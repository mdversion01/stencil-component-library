// stories/app-wrapper.stories.js

/* ------------------------------------------------------------------
 * Storybook: App Wrapper
 * - Docs/source preview: HTML, normalized (no blank lines), stable formatting
 * ------------------------------------------------------------------ */

/* =========================
 * Docs helpers (NO blanks)
 * ========================= */

const normalize = (txt) => {
  const lines = String(txt || '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((l) => l.replace(/[ \t]+$/g, ''));

  const out = [];
  let prevBlank = false;

  for (const line of lines) {
    const blank = line.trim() === '';
    if (blank) {
      if (prevBlank) continue;
      prevBlank = true;
      out.push('');
      continue;
    }
    prevBlank = false;
    out.push(line);
  }

  while (out[0] === '') out.shift();
  while (out[out.length - 1] === '') out.pop();

  return out.join('\n');
};

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const attrLines = (pairs) =>
  pairs
    .filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== false)
    .map(([k, v]) => (v === true ? `${k}` : `${k}="${esc(v)}"`))
    .join('\n  ');

/** Build formatted HTML shown in Docs "Code" panel */
const buildDocsHtml = (args, { variant } = {}) => {
  // Story-only args should not appear on <app-wrapper>
  const classNames = args.classNames;

  if (variant === 'Playground') {
    return normalize(`
<app-wrapper
  ${attrLines([['class-names', classNames]])}
>
  <div class="demo-card ${args.paddedCard ? 'p-3 border rounded' : ''}">
    <h3 class="mb-2">${esc(args.contentTitle)}</h3>
    <p class="mb-3">${esc(args.contentBody)}</p>
    <div style="display:flex; gap:.5rem; flex-wrap:wrap">
      <button-component btn-text="Primary" variant="primary" size="sm"></button-component>
      <button-component btn-text="Secondary" variant="secondary" size="sm"></button-component>
      <button-component btn-text="Link" variant="link" size="sm"></button-component>
    </div>
  </div>
</app-wrapper>
`);
  }

  if (variant === 'UtilityClasses') {
    return normalize(`
<div style="display:grid; gap:12px">
  <app-wrapper class-names="p-3 bg-light rounded">
    <div>Light background, rounded, p-3</div>
  </app-wrapper>
  <app-wrapper class-names="p-4 bg-primary text-white rounded">
    <div>Primary background, white text, p-4</div>
  </app-wrapper>
  <app-wrapper class-names="p-2 border rounded">
    <div>Bordered wrapper with small padding</div>
  </app-wrapper>
  <app-wrapper class-names="container py-3">
    <div>Centered content using <code>container</code></div>
  </app-wrapper>
</div>
`);
  }

  if (variant === 'NestedWrappers') {
    return normalize(`
<app-wrapper class-names="p-3 bg-light rounded">
  <div class="mb-2"><strong>Outer</strong> — p-3, bg-light, rounded</div>
  <app-wrapper class-names="p-3 bg-white border rounded">
    <div class="mb-2"><strong>Inner</strong> — p-3, bg-white, border</div>
    <app-wrapper class-names="p-2 bg-light rounded">
      <div><strong>Innermost</strong> — p-2, bg-light</div>
    </app-wrapper>
  </app-wrapper>
</app-wrapper>
`);
  }

  if (variant === 'LayoutExamples') {
    return normalize(`
<div style="display:grid; gap:16px">
  <app-wrapper class-names="p-3 bg-light rounded">
    <div class="d-flex gap-2 flex-wrap">
      <span class="badge bg-secondary">Flex</span>
      <span class="badge bg-secondary">Gap</span>
      <span class="badge bg-secondary">Utilities</span>
    </div>
  </app-wrapper>

  <app-wrapper class-names="p-3">
    <div class="row g-2">
      <div class="col-12 col-sm-6 col-lg-3"><div class="p-3 border rounded text-center">A</div></div>
      <div class="col-12 col-sm-6 col-lg-3"><div class="p-3 border rounded text-center">B</div></div>
      <div class="col-12 col-sm-6 col-lg-3"><div class="p-3 border rounded text-center">C</div></div>
      <div class="col-12 col-sm-6 col-lg-3"><div class="p-3 border rounded text-center">D</div></div>
    </div>
  </app-wrapper>

  <app-wrapper class-names="py-4 bg-dark text-white">
    <div class="container">
      <h4 class="mb-2">Full-width section</h4>
      <p class="mb-3">Use <code>container</code> inside to constrain content.</p>
      <button-component btn-text="Action" variant="light" size="sm"></button-component>
    </div>
  </app-wrapper>
</div>
`);
  }

  if (variant === 'PageShell') {
    return normalize(`
<app-wrapper class-names="min-vh-100 d-flex flex-column">
  <header class="p-3 bg-primary text-white">
    <div class="container d-flex justify-content-between align-items-center">
      <strong>My App</strong>
      <button-component btn-text="Sign in" size="sm" variant="light"></button-component>
    </div>
  </header>

  <main class="flex-fill py-4">
    <div class="container">
      <h3 class="mb-3">Hello!</h3>
      <p class="mb-0">This is a simple page shell built with <code>&lt;app-wrapper&gt;</code> plus your global CSS utilities.</p>
    </div>
  </main>

  <footer class="py-3 bg-light border-top">
    <div class="container small text-muted">© 2025 Example Co.</div>
  </footer>
</app-wrapper>
`);
  }

  // default fallback (shouldn't really be used)
  return normalize(`
<app-wrapper
  ${attrLines([['class-names', classNames]])}
></app-wrapper>
`);
};

/* =========================
 * Template
 * ========================= */

const attr = (name, v) => (v === undefined || v === null || v === '' ? '' : ` ${name}="${String(v)}"`);

const Template = (args) =>
  normalize(`
<app-wrapper${attr('class-names', args.classNames)}>
  <div class="demo-card ${args.paddedCard ? 'p-3 border rounded' : ''}">
    <h3 class="mb-2">${args.contentTitle}</h3>
    <p class="mb-3">${args.contentBody}</p>
    <div style="display:flex; gap:.5rem; flex-wrap:wrap">
      <button-component btn-text="Primary" variant="primary" size="sm"></button-component>
      <button-component btn-text="Secondary" variant="secondary" size="sm"></button-component>
      <button-component btn-text="Link" variant="link" size="sm"></button-component>
    </div>
  </div>
</app-wrapper>
`);

/* =========================
 * Default export
 * ========================= */

export default {
  title: 'Layout/App Wrapper',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '`<app-wrapper>` is a super-light container that simply renders a div with the classes you pass in and a default `app-wrapper` class. It renders in the **light DOM** (shadow: false) so your global styles (e.g., Bootstrap/Tailwind/custom globals) apply to children.',
      },
      source: {
        language: 'html',
        transform: (_src, ctx) => buildDocsHtml(ctx.args, { variant: 'Playground' }),
      },
    },
  },
  argTypes: {
    classNames: {
      control: 'text',
      description:
        'Space-separated utility classes applied to the outer wrapper. Examples: `p-4 bg-light`, `container mx-auto`, `d-flex gap-3`.',
      table: { category: 'Styling' },
      name: 'class-names',
    },
    // demo-only knobs
    contentBody: { control: 'text', table: { category: 'Storybook Demo' }, name: 'content-body', description: 'Demo content body text.' },
    contentTitle: { control: 'text', table: { category: 'Storybook Demo' }, name: 'content-title', description: 'Demo content title.' },
    paddedCard: {
      control: 'boolean',
      description: 'Adds inner demo card padding/border.',
      table: { category: 'Storybook Demo' },
      name: 'padded-card',
    },
  },
};

/* =========================
 * Stories
 * ========================= */

export const Playground = Template.bind({});
Playground.args = {
  classNames: 'p-4 bg-light',
  contentTitle: 'App Wrapper Playground',
  contentBody:
    'Pass any utility classes to control spacing, backgrounds, layout, etc. Everything inside is rendered in light DOM so your global CSS works.',
  paddedCard: true,
};
Playground.parameters = {
  docs: {
    source: { language: 'html', transform: (_src, ctx) => buildDocsHtml(ctx.args, { variant: 'Playground' }) },
  },
};

/* ================= Focused Examples ================= */

export const UtilityClasses = () =>
  normalize(`
<div style="display:grid; gap:12px">
  <app-wrapper class-names="p-3 bg-light rounded">
    <div>Light background, rounded, p-3</div>
  </app-wrapper>
  <app-wrapper class-names="p-4 bg-primary text-white rounded">
    <div>Primary background, white text, p-4</div>
  </app-wrapper>
  <app-wrapper class-names="p-2 border rounded">
    <div>Bordered wrapper with small padding</div>
  </app-wrapper>
  <app-wrapper class-names="container py-3">
    <div>Centered content using <code>container</code></div>
  </app-wrapper>
</div>
`);
UtilityClasses.parameters = {
  docs: {
    source: { language: 'html', transform: (_src, ctx) => buildDocsHtml(ctx.args, { variant: 'UtilityClasses' }) },
  },
};

export const NestedWrappers = () =>
  normalize(`
<app-wrapper class-names="p-3 bg-light rounded">
  <div class="mb-2"><strong>Outer</strong> — p-3, bg-light, rounded</div>
  <app-wrapper class-names="p-3 bg-white border rounded">
    <div class="mb-2"><strong>Inner</strong> — p-3, bg-white, border</div>
    <app-wrapper class-names="p-2 bg-light rounded">
      <div><strong>Innermost</strong> — p-2, bg-light</div>
    </app-wrapper>
  </app-wrapper>
</app-wrapper>
`);
NestedWrappers.parameters = {
  docs: {
    source: { language: 'html', transform: (_src, ctx) => buildDocsHtml(ctx.args, { variant: 'NestedWrappers' }) },
  },
};

export const LayoutExamples = () =>
  normalize(`
<div style="display:grid; gap:16px">
  <app-wrapper class-names="p-3 bg-light rounded">
    <div class="d-flex gap-2 flex-wrap">
      <span class="badge bg-secondary">Flex</span>
      <span class="badge bg-secondary">Gap</span>
      <span class="badge bg-secondary">Utilities</span>
    </div>
  </app-wrapper>

  <app-wrapper class-names="p-3">
    <div class="row g-2">
      <div class="col-12 col-sm-6 col-lg-3"><div class="p-3 border rounded text-center">A</div></div>
      <div class="col-12 col-sm-6 col-lg-3"><div class="p-3 border rounded text-center">B</div></div>
      <div class="col-12 col-sm-6 col-lg-3"><div class="p-3 border rounded text-center">C</div></div>
      <div class="col-12 col-sm-6 col-lg-3"><div class="p-3 border rounded text-center">D</div></div>
    </div>
  </app-wrapper>

  <app-wrapper class-names="py-4 bg-dark text-white">
    <div class="container">
      <h4 class="mb-2">Full-width section</h4>
      <p class="mb-3">Use <code>container</code> inside to constrain content.</p>
      <button-component btn-text="Action" variant="light" size="sm"></button-component>
    </div>
  </app-wrapper>
</div>
`);
LayoutExamples.parameters = {
  docs: {
    source: { language: 'html', transform: (_src, ctx) => buildDocsHtml(ctx.args, { variant: 'LayoutExamples' }) },
  },
};

export const PageShell = () =>
  normalize(`
<app-wrapper class-names="min-vh-100 d-flex flex-column">
  <header class="p-3 bg-primary text-white">
    <div class="container d-flex justify-content-between align-items-center">
      <strong>My App</strong>
      <button-component btn-text="Sign in" size="sm" variant="light"></button-component>
    </div>
  </header>

  <main class="flex-fill py-4">
    <div class="container">
      <h3 class="mb-3">Hello!</h3>
      <p class="mb-0">This is a simple page shell built with <code>&lt;app-wrapper&gt;</code> plus your global CSS utilities.</p>
    </div>
  </main>

  <footer class="py-3 bg-light border-top">
    <div class="container small text-muted">© 2025 Example Co.</div>
  </footer>
</app-wrapper>
`);
PageShell.parameters = {
  docs: {
    source: { language: 'html', transform: (_src, ctx) => buildDocsHtml(ctx.args, { variant: 'PageShell' }) },
  },
};
