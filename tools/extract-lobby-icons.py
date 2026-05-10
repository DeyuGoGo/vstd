from collections import deque
from pathlib import Path
import sys

from PIL import Image


NAMES = [
    "event",
    "task",
    "achievement",
    "shop",
    "storage",
    "memory",
    "ranking",
    "home",
    "adventure",
    "starfield",
    "guild",
    "mail",
    "friends",
    "settings",
]


def is_green_key(r, g, b):
    return g > 120 and g > r * 1.45 and g > b * 1.45


def keyed_image(src):
    img = src.convert("RGBA")
    px = img.load()
    w, h = img.size
    mask = [[False] * w for _ in range(h)]

    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if is_green_key(r, g, b):
                px[x, y] = (r, g, b, 0)
            else:
                if g > r and g > b:
                    g = min(g, int(max(r, b) * 1.12 + 8))
                    px[x, y] = (r, g, b, a)
                mask[y][x] = True
    return img, mask


def components(mask):
    h = len(mask)
    w = len(mask[0])
    seen = [[False] * w for _ in range(h)]
    boxes = []
    for y in range(h):
        for x in range(w):
            if seen[y][x] or not mask[y][x]:
                continue
            q = deque([(x, y)])
            seen[y][x] = True
            min_x = max_x = x
            min_y = max_y = y
            count = 0
            while q:
                cx, cy = q.popleft()
                count += 1
                min_x = min(min_x, cx)
                max_x = max(max_x, cx)
                min_y = min(min_y, cy)
                max_y = max(max_y, cy)
                for nx, ny in ((cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)):
                    if 0 <= nx < w and 0 <= ny < h and not seen[ny][nx] and mask[ny][nx]:
                        seen[ny][nx] = True
                        q.append((nx, ny))
            if count > 1200:
                boxes.append((min_x, min_y, max_x + 1, max_y + 1, count))
    return boxes


def merge_related(boxes):
    boxes = [list(box) for box in boxes]
    changed = True
    while changed:
        changed = False
        merged = []
        used = [False] * len(boxes)
        for i, a in enumerate(boxes):
            if used[i]:
                continue
            ax1, ay1, ax2, ay2, ac = a
            used[i] = True
            for j in range(i + 1, len(boxes)):
                if used[j]:
                    continue
                bx1, by1, bx2, by2, bc = boxes[j]
                overlap_x = min(ax2, bx2) - max(ax1, bx1)
                overlap_y = min(ay2, by2) - max(ay1, by1)
                gap_x = max(0, max(ax1, bx1) - min(ax2, bx2))
                gap_y = max(0, max(ay1, by1) - min(ay2, by2))
                is_detail = min(ac, bc) < 5000
                if is_detail and ((overlap_x > 0 and gap_y < 36) or (overlap_y > 0 and gap_x < 36)):
                    ax1 = min(ax1, bx1)
                    ay1 = min(ay1, by1)
                    ax2 = max(ax2, bx2)
                    ay2 = max(ay2, by2)
                    ac += bc
                    used[j] = True
                    changed = True
            merged.append([ax1, ay1, ax2, ay2, ac])
        boxes = merged
    return [tuple(box) for box in boxes]


def sort_grid(boxes):
    boxes = sorted(boxes, key=lambda b: (b[1], b[0]))
    rows = []
    for box in boxes:
        center_y = (box[1] + box[3]) / 2
        for row in rows:
            row_center = sum((b[1] + b[3]) / 2 for b in row) / len(row)
            if abs(center_y - row_center) < 110:
                row.append(box)
                break
        else:
            rows.append([box])
    return [box for row in rows for box in sorted(row, key=lambda b: b[0])]


def save_icon(img, box, out):
    w, h = img.size
    pad = 18
    x1 = max(0, box[0] - pad)
    y1 = max(0, box[1] - pad)
    x2 = min(w, box[2] + pad)
    y2 = min(h, box[3] + pad)
    crop = img.crop((x1, y1, x2, y2))

    canvas = Image.new("RGBA", (256, 256), (0, 0, 0, 0))
    cw, ch = crop.size
    scale = min(220 / cw, 220 / ch)
    nw = max(1, round(cw * scale))
    nh = max(1, round(ch * scale))
    crop = crop.resize((nw, nh), Image.Resampling.LANCZOS)
    canvas.alpha_composite(crop, ((256 - nw) // 2, (256 - nh) // 2))
    canvas.save(out)


def main():
    if len(sys.argv) != 3:
        raise SystemExit("Usage: extract-lobby-icons.py <sprite.png> <out-dir>")
    source = Path(sys.argv[1])
    out_dir = Path(sys.argv[2])
    out_dir.mkdir(parents=True, exist_ok=True)

    keyed, mask = keyed_image(Image.open(source))
    boxes = sort_grid(merge_related(components(mask)))
    if len(boxes) != len(NAMES):
        raise SystemExit(f"Expected {len(NAMES)} icons, found {len(boxes)} components: {boxes}")

    keyed.save(out_dir / "_sprite-keyed.png")
    for name, box in zip(NAMES, boxes):
        save_icon(keyed, box, out_dir / f"{name}.png")
        print(f"wrote {name}.png")


if __name__ == "__main__":
    main()
