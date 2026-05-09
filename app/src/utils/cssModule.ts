// Vite 8's CSS Modules dev-mode runtime ignores `localsConvention: 'camelCase'`
// for kebab-case selectors, exposing only the original kebab keys. Wrap the
// imported style object in this Proxy so JSX can keep using camelCase access
// (`styles.playerBlock`) regardless. Falls through to kebab-case lookup.
type StringRecord = Record<string, string>;

export function cm<T extends StringRecord>(styles: T): T {
  return new Proxy(styles, {
    get(target, prop) {
      if (typeof prop !== 'string') return undefined;
      if (prop in target) return (target as StringRecord)[prop];
      const kebab = prop.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());
      return (target as StringRecord)[kebab];
    },
  }) as T;
}
