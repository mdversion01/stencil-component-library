// ───────────────────────────────────────────────────────────────────────────────
// File: src/test/snapshotSerializers/classOrderSerializer.ts
// Alphabetizes class tokens in any HTML string before snapshotting.
// ───────────────────────────────────────────────────────────────────────────────
const normalizeClassAttr = (html: string): string => {
  return html.replace(/class="([^"]*)"/g, (_m, cls) => {
    const sorted = cls
      .split(/\s+/)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b))
      .join(' ');
    return `class="${sorted}"`;
  });
};

const toHtmlString = (value: any): string => {
  // Stencil mock-dom nodes expose outerHTML/innerHTML; fall back to String
  if (value && typeof value === 'object') {
    if ('outerHTML' in value && typeof value.outerHTML === 'string') return value.outerHTML as string;
    if ('innerHTML' in value && typeof value.innerHTML === 'string') return value.innerHTML as string;
  }
  return String(value ?? '');
};

export const classOrderSerializer = {
  test(val: unknown) {
    // Accept elements, fragments, shadow roots, and strings
    if (typeof val === 'string') return true;
    if (!val || typeof val !== 'object') return false;
    // match Stencil mock nodes
    return 'outerHTML' in (val as any) || 'innerHTML' in (val as any);
  },
  print(val: unknown) {
    const html = toHtmlString(val);
    const normalized = normalizeClassAttr(html)
      // collapse whitespace for stability
      .replace(/\s+\n\s+/g, '\n')
      .replace(/\s{2,}/g, ' ')
      .trim();
    return normalized;
  },
};

export default classOrderSerializer;
