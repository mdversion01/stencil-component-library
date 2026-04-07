// File: src/stories/app-wrapper/app-wrapper.story-helpers.js

const TAG = 'app-wrapper';

export const normalize = (txt) => {
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

export const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const attrLines = (pairs) =>
  pairs
    .filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== false)
    .map(([k, v]) => (v === true ? `${k}` : `${k}="${esc(v)}"`))
    .join('\n  ');

export const buildDocsHtml = (args, { variant } = {}) => {
  const classNames = args.classNames || '';

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

  return normalize(`
<app-wrapper
  ${attrLines([['class-names', classNames]])}
></app-wrapper>
`);
};

const setAttr = (el, name, v) => {
  if (v === true) el.setAttribute(name, '');
  else if (v === false || v == null || v === '') el.removeAttribute(name);
  else el.setAttribute(name, String(v));
};

export function buildPlayground(args) {
  const host = document.createElement(TAG);
  setAttr(host, 'class-names', args.classNames);

  const card = document.createElement('div');
  card.className = `demo-card ${args.paddedCard ? 'p-3 border rounded' : ''}`.trim();

  const title = document.createElement('h3');
  title.className = 'mb-2';
  title.textContent = args.contentTitle || '';

  const body = document.createElement('p');
  body.className = 'mb-3';
  body.textContent = args.contentBody || '';

  const actions = document.createElement('div');
  actions.style.display = 'flex';
  actions.style.gap = '.5rem';
  actions.style.flexWrap = 'wrap';

  const primary = document.createElement('button-component');
  primary.setAttribute('btn-text', 'Primary');
  primary.setAttribute('variant', 'primary');
  primary.setAttribute('size', 'sm');

  const secondary = document.createElement('button-component');
  secondary.setAttribute('btn-text', 'Secondary');
  secondary.setAttribute('variant', 'secondary');
  secondary.setAttribute('size', 'sm');

  const link = document.createElement('button-component');
  link.setAttribute('btn-text', 'Link');
  link.setAttribute('variant', 'link');
  link.setAttribute('size', 'sm');

  actions.append(primary, secondary, link);
  card.append(title, body, actions);
  host.append(card);

  return host;
}

export function buildUtilityClasses() {
  const wrap = document.createElement('div');
  wrap.style.display = 'grid';
  wrap.style.gap = '12px';

  const cases = [
    ['p-3 bg-light rounded', 'Light background, rounded, p-3'],
    ['p-4 bg-primary text-white rounded', 'Primary background, white text, p-4'],
    ['p-2 border rounded', 'Bordered wrapper with small padding'],
    ['container py-3', 'Centered content using container'],
  ];

  cases.forEach(([classNames, text]) => {
    const host = document.createElement(TAG);
    host.setAttribute('class-names', classNames);

    const div = document.createElement('div');
    div.textContent = text;

    host.append(div);
    wrap.append(host);
  });

  return wrap;
}

export function buildNestedWrappers() {
  const outer = document.createElement(TAG);
  outer.setAttribute('class-names', 'p-3 bg-light rounded');

  const outerLabel = document.createElement('div');
  outerLabel.className = 'mb-2';
  outerLabel.innerHTML = '<strong>Outer</strong> — p-3, bg-light, rounded';

  const inner = document.createElement(TAG);
  inner.setAttribute('class-names', 'p-3 bg-white border rounded');

  const innerLabel = document.createElement('div');
  innerLabel.className = 'mb-2';
  innerLabel.innerHTML = '<strong>Inner</strong> — p-3, bg-white, border';

  const innerMost = document.createElement(TAG);
  innerMost.setAttribute('class-names', 'p-2 bg-light rounded');

  const innerMostLabel = document.createElement('div');
  innerMostLabel.innerHTML = '<strong>Innermost</strong> — p-2, bg-light';

  innerMost.append(innerMostLabel);
  inner.append(innerLabel, innerMost);
  outer.append(outerLabel, inner);

  return outer;
}

export function buildLayoutExamples() {
  const wrap = document.createElement('div');
  wrap.style.display = 'grid';
  wrap.style.gap = '16px';

  const first = document.createElement(TAG);
  first.setAttribute('class-names', 'p-3 bg-light rounded');
  first.innerHTML = `
    <div class="d-flex gap-2 flex-wrap">
      <span class="badge bg-secondary">Flex</span>
      <span class="badge bg-secondary">Gap</span>
      <span class="badge bg-secondary">Utilities</span>
    </div>
  `;

  const second = document.createElement(TAG);
  second.setAttribute('class-names', 'p-3');
  second.innerHTML = `
    <div class="row g-2">
      <div class="col-12 col-sm-6 col-lg-3"><div class="p-3 border rounded text-center">A</div></div>
      <div class="col-12 col-sm-6 col-lg-3"><div class="p-3 border rounded text-center">B</div></div>
      <div class="col-12 col-sm-6 col-lg-3"><div class="p-3 border rounded text-center">C</div></div>
      <div class="col-12 col-sm-6 col-lg-3"><div class="p-3 border rounded text-center">D</div></div>
    </div>
  `;

  const third = document.createElement(TAG);
  third.setAttribute('class-names', 'py-4 bg-dark text-white');
  third.innerHTML = `
    <div class="container">
      <h4 class="mb-2">Full-width section</h4>
      <p class="mb-3">Use <code>container</code> inside to constrain content.</p>
      <button-component btn-text="Action" variant="light" size="sm"></button-component>
    </div>
  `;

  wrap.append(first, second, third);
  return wrap;
}

export function buildPageShell() {
  const host = document.createElement(TAG);
  host.setAttribute('class-names', 'min-vh-100 d-flex flex-column');

  host.innerHTML = `
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
  `;

  return host;
}
