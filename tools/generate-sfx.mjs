import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';

const SR = 22050;
const PEAK = 10 ** (-3 / 20);
const OUT_DIR = path.resolve('app/public/audio/sfx');
const TMP_DIR = path.resolve('app/public/audio/.tmp-sfx');
const FFMPEG = process.env.FFMPEG_PATH;

if (!FFMPEG) {
  throw new Error('Set FFMPEG_PATH to an ffmpeg executable before running this script.');
}

const note = (midi) => 440 * 2 ** ((midi - 69) / 12);
const clamp = (v) => Math.max(-1, Math.min(1, v));
const smooth = (x) => x * x * (3 - 2 * x);

let seed = 0x51a7d05;
const rnd = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 0x100000000;
};

function makeBuffer(seconds) {
  return new Float32Array(Math.ceil(seconds * SR));
}

function addSine(buf, opts) {
  const {
    start = 0,
    duration,
    from,
    to = from,
    amp = 0.5,
    attack = 0.002,
    decay = duration,
    wave = 'sine',
  } = opts;
  const i0 = Math.max(0, Math.floor(start * SR));
  const len = Math.min(buf.length - i0, Math.floor(duration * SR));
  let phase = opts.phase ?? 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const p = i / Math.max(1, len - 1);
    const freq = from + (to - from) * p;
    phase += (Math.PI * 2 * freq) / SR;
    const atk = Math.min(1, t / attack);
    const env = Math.sin(Math.min(1, atk) * Math.PI / 2) * Math.exp(-t / decay);
    let sample = Math.sin(phase);
    if (wave === 'triangle') sample = (2 / Math.PI) * Math.asin(sample);
    if (wave === 'soft-square') sample = Math.tanh(sample * 2.2);
    buf[i0 + i] += sample * amp * env;
  }
}

function addNoise(buf, opts) {
  const {
    start = 0,
    duration,
    amp = 0.4,
    attack = 0.001,
    decay = duration,
    tone = 0.5,
  } = opts;
  const i0 = Math.max(0, Math.floor(start * SR));
  const len = Math.min(buf.length - i0, Math.floor(duration * SR));
  let last = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const raw = rnd() * 2 - 1;
    last = last * tone + raw * (1 - tone);
    const p = i / Math.max(1, len - 1);
    const atk = Math.min(1, t / attack);
    const env = Math.sin(Math.min(1, atk) * Math.PI / 2) * Math.exp(-p * duration / decay);
    buf[i0 + i] += (raw - last) * amp * env;
  }
}

function addBell(buf, start, midi, duration, amp = 0.35) {
  const f = note(midi);
  addSine(buf, { start, duration, from: f, amp, attack: 0.004, decay: duration * 0.45 });
  addSine(buf, { start, duration, from: f * 2.01, amp: amp * 0.28, attack: 0.002, decay: duration * 0.28 });
  addSine(buf, { start, duration, from: f * 3.02, amp: amp * 0.13, attack: 0.002, decay: duration * 0.18 });
}

function addWhoosh(buf, start, duration, amp, upward = true) {
  const from = upward ? 450 : 1800;
  const to = upward ? 1900 : 420;
  addNoise(buf, { start, duration, amp, attack: duration * 0.25, decay: duration * 0.8, tone: 0.78 });
  addSine(buf, { start, duration, from, to, amp: amp * 0.35, attack: duration * 0.2, decay: duration * 0.9 });
}

function normalize(buf) {
  let peak = 0;
  for (const sample of buf) peak = Math.max(peak, Math.abs(sample));
  const gain = peak > 0 ? PEAK / peak : 1;
  for (let i = 0; i < buf.length; i++) buf[i] = clamp(buf[i] * gain);
}

function wavBytes(buf) {
  normalize(buf);
  const dataSize = buf.length * 2;
  const bytes = Buffer.alloc(44 + dataSize);
  bytes.write('RIFF', 0);
  bytes.writeUInt32LE(36 + dataSize, 4);
  bytes.write('WAVE', 8);
  bytes.write('fmt ', 12);
  bytes.writeUInt32LE(16, 16);
  bytes.writeUInt16LE(1, 20);
  bytes.writeUInt16LE(1, 22);
  bytes.writeUInt32LE(SR, 24);
  bytes.writeUInt32LE(SR * 2, 28);
  bytes.writeUInt16LE(2, 32);
  bytes.writeUInt16LE(16, 34);
  bytes.write('data', 36);
  bytes.writeUInt32LE(dataSize, 40);
  for (let i = 0; i < buf.length; i++) {
    bytes.writeInt16LE(Math.round(clamp(buf[i]) * 32767), 44 + i * 2);
  }
  return bytes;
}

function convert(wavPath, oggPath) {
  return new Promise((resolve, reject) => {
    const child = spawn(FFMPEG, [
      '-hide_banner',
      '-loglevel',
      'error',
      '-y',
      '-i',
      wavPath,
      '-ar',
      String(SR),
      '-ac',
      '1',
      '-codec:a',
      'libvorbis',
      '-q:a',
      '4',
      oggPath,
    ]);
    let err = '';
    child.stderr.on('data', (chunk) => {
      err += chunk;
    });
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(err || `ffmpeg exited ${code}`));
    });
  });
}

const sounds = {
  sfx_hero_shoot: () => {
    const b = makeBuffer(0.13);
    addWhoosh(b, 0, 0.11, 0.38, true);
    addSine(b, { duration: 0.09, from: 1450, to: 2600, amp: 0.42, attack: 0.004, decay: 0.05 });
    for (let i = 0; i < 5; i++) addBell(b, 0.018 + i * 0.012, 86 + i, 0.045, 0.045);
    return b;
  },
  sfx_hit_normal: () => {
    const b = makeBuffer(0.17);
    addSine(b, { duration: 0.12, from: 210, to: 150, amp: 0.48, attack: 0.002, decay: 0.045, wave: 'soft-square' });
    addNoise(b, { duration: 0.09, amp: 0.42, attack: 0.001, decay: 0.035, tone: 0.45 });
    addSine(b, { start: 0.018, duration: 0.12, from: 920, to: 1240, amp: 0.24, attack: 0.001, decay: 0.04 });
    return b;
  },
  sfx_hit_crit: () => {
    const b = makeBuffer(0.32);
    addSine(b, { duration: 0.2, from: 150, to: 88, amp: 0.58, attack: 0.002, decay: 0.075, wave: 'soft-square' });
    addNoise(b, { duration: 0.12, amp: 0.46, attack: 0.001, decay: 0.045, tone: 0.4 });
    addBell(b, 0.035, 81, 0.23, 0.28);
    addBell(b, 0.055, 88, 0.18, 0.16);
    addSine(b, { start: 0.018, duration: 0.16, from: 1850, to: 1160, amp: 0.2, attack: 0.002, decay: 0.07 });
    return b;
  },
  sfx_hero_take_dmg: () => {
    const b = makeBuffer(0.44);
    addSine(b, { duration: 0.28, from: 92, to: 58, amp: 0.62, attack: 0.003, decay: 0.12, wave: 'soft-square' });
    addNoise(b, { start: 0.015, duration: 0.18, amp: 0.38, attack: 0.001, decay: 0.06, tone: 0.25 });
    for (const t of [0.06, 0.095, 0.135]) addBell(b, t, 55 + Math.floor(rnd() * 5), 0.11, 0.08);
    return b;
  },
  sfx_level_up: () => {
    const b = makeBuffer(1.0);
    addWhoosh(b, 0, 0.36, 0.24, true);
    [72, 76, 79, 84].forEach((m, i) => addBell(b, 0.08 + i * 0.095, m, 0.46, 0.22));
    [72, 76, 79, 84].forEach((m) => addBell(b, 0.52, m, 0.42, 0.12));
    addNoise(b, { start: 0.22, duration: 0.42, amp: 0.09, attack: 0.1, decay: 0.3, tone: 0.86 });
    return b;
  },
  sfx_wave_clear: () => {
    const b = makeBuffer(0.34);
    addBell(b, 0, 74, 0.22, 0.22);
    addBell(b, 0.09, 79, 0.22, 0.2);
    addSine(b, { start: 0, duration: 0.24, from: 600, to: 1320, amp: 0.16, attack: 0.02, decay: 0.16 });
    return b;
  },
  sfx_boss_spawn: () => {
    const b = makeBuffer(1.25);
    addSine(b, { duration: 1.08, from: 58, to: 43, amp: 0.58, attack: 0.12, decay: 0.85, wave: 'soft-square' });
    addSine(b, { start: 0.18, duration: 0.9, from: 1030, to: 740, amp: 0.2, attack: 0.18, decay: 0.6, wave: 'triangle' });
    addSine(b, { start: 0.3, duration: 0.7, from: 1460, to: 1210, amp: 0.13, attack: 0.14, decay: 0.5 });
    addNoise(b, { start: 0.02, duration: 0.95, amp: 0.23, attack: 0.24, decay: 0.5, tone: 0.82 });
    addBell(b, 0.86, 38, 0.36, 0.2);
    return b;
  },
  sfx_game_over: () => {
    const b = makeBuffer(2.0);
    [67, 63, 60, 55].forEach((m, i) => addBell(b, i * 0.26, m, 0.82, 0.2 - i * 0.025));
    addSine(b, { start: 0.45, duration: 1.25, from: 82, to: 49, amp: 0.26, attack: 0.2, decay: 0.9, wave: 'triangle' });
    addNoise(b, { start: 0.75, duration: 0.8, amp: 0.08, attack: 0.2, decay: 0.7, tone: 0.9 });
    return b;
  },
  sfx_victory: () => {
    const b = makeBuffer(2.05);
    addSine(b, { duration: 0.18, from: 120, to: 72, amp: 0.42, attack: 0.003, decay: 0.08, wave: 'soft-square' });
    addNoise(b, { duration: 0.12, amp: 0.25, attack: 0.001, decay: 0.04, tone: 0.44 });
    [67, 72, 76, 79, 84].forEach((m, i) => addBell(b, 0.44 + i * 0.105, m, 0.55, 0.2));
    [72, 76, 79, 84, 88].forEach((m) => addBell(b, 1.15, m, 0.72, 0.13));
    addWhoosh(b, 0.78, 0.42, 0.16, true);
    return b;
  },
  sfx_ui_card_hover: () => {
    const b = makeBuffer(0.065);
    addBell(b, 0, 89, 0.055, 0.13);
    addSine(b, { duration: 0.045, from: 2100, to: 2400, amp: 0.07, attack: 0.002, decay: 0.03 });
    return b;
  },
  sfx_ui_card_pick: () => {
    const b = makeBuffer(0.38);
    addBell(b, 0, 79, 0.28, 0.2);
    addBell(b, 0.075, 84, 0.3, 0.2);
    addWhoosh(b, 0.03, 0.24, 0.12, true);
    return b;
  },
  sfx_ui_reroll: () => {
    const b = makeBuffer(0.45);
    addWhoosh(b, 0, 0.34, 0.2, false);
    for (let i = 0; i < 7; i++) {
      const t = 0.035 + i * 0.044;
      addNoise(b, { start: t, duration: 0.035, amp: 0.15, attack: 0.001, decay: 0.015, tone: 0.35 });
      addBell(b, t, 72 + (i % 3) * 3, 0.06, 0.05);
    }
    addBell(b, 0.34, 84, 0.12, 0.11);
    return b;
  },
  sfx_ui_button_tap: () => {
    const b = makeBuffer(0.085);
    addSine(b, { duration: 0.065, from: 520, to: 380, amp: 0.33, attack: 0.001, decay: 0.025, wave: 'triangle' });
    addNoise(b, { duration: 0.025, amp: 0.13, attack: 0.001, decay: 0.012, tone: 0.55 });
    return b;
  },
  sfx_ui_pause: () => {
    const b = makeBuffer(0.22);
    addSine(b, { duration: 0.16, from: 740, to: 370, amp: 0.24, attack: 0.002, decay: 0.07, wave: 'triangle' });
    addBell(b, 0.045, 67, 0.13, 0.12);
    addNoise(b, { start: 0.015, duration: 0.08, amp: 0.1, attack: 0.001, decay: 0.03, tone: 0.8 });
    return b;
  },
};

await mkdir(OUT_DIR, { recursive: true });
await mkdir(TMP_DIR, { recursive: true });

for (const [name, create] of Object.entries(sounds)) {
  const wavPath = path.join(TMP_DIR, `${name}.wav`);
  const oggPath = path.join(OUT_DIR, `${name}.ogg`);
  await writeFile(wavPath, wavBytes(create()));
  await convert(wavPath, oggPath);
  console.log(`wrote ${path.relative(process.cwd(), oggPath)}`);
}

await rm(TMP_DIR, { recursive: true, force: true });
