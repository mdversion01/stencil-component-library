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
    },
  },
  argTypes: {
    classNames: {
      control: 'text',
      description:
        'Space-separated utility classes applied to the outer wrapper. Examples: `p-4 bg-light`, `container mx-auto`, `d-flex gap-3`.',
      table: { category: 'Props' },
    },
    // demo-only knobs
    contentTitle: { control: 'text', table: { category: 'Demo' } },
    contentBody: { control: 'text', table: { category: 'Demo' } },
    paddedCard: {
      control: 'boolean',
      description: 'Adds inner demo card padding/border.',
      table: { category: 'Demo' },
    },
  },
};

const attr = (name, v) =>
  v === undefined || v === null || v === '' ? '' : ` ${name}="${String(v)}"`;

const Template = (args) => `
<app-wrapper${attr('classNames', args.classNames)}>
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
`.trim();

export const Playground = Template.bind({});
Playground.args = {
  classNames: 'p-4 bg-light',
  contentTitle: 'App Wrapper Playground',
  contentBody:
    'Pass any utility classes to control spacing, backgrounds, layout, etc. Everything inside is rendered in light DOM so your global CSS works.',
  paddedCard: true,
};

/* ================= Focused Examples ================= */

export const UtilityClasses = () => `
<div style="display:grid; gap:12px">
  <app-wrapper classNames="p-3 bg-light rounded">
    <div>Light background, rounded, p-3</div>
  </app-wrapper>

  <app-wrapper classNames="p-4 bg-primary text-white rounded">
    <div>Primary background, white text, p-4</div>
  </app-wrapper>

  <app-wrapper classNames="p-2 border rounded">
    <div>Bordered wrapper with small padding</div>
  </app-wrapper>

  <app-wrapper classNames="container py-3">
    <div>Centered content using <code>container</code></div>
  </app-wrapper>
</div>
`.trim();

export const NestedWrappers = () => `
<app-wrapper classNames="p-3 bg-light rounded">
  <div class="mb-2"><strong>Outer</strong> — p-3, bg-light, rounded</div>
  <app-wrapper classNames="p-3 bg-white border rounded">
    <div class="mb-2"><strong>Inner</strong> — p-3, bg-white, border</div>
    <app-wrapper classNames="p-2 bg-light rounded">
      <div><strong>Innermost</strong> — p-2, bg-light</div>
    </app-wrapper>
  </app-wrapper>
</app-wrapper>
`.trim();

export const LayoutExamples = () => `
<div style="display:grid; gap:16px">
  <!-- Flex row -->
  <app-wrapper classNames="p-3 bg-light rounded">
    <div class="d-flex gap-2 flex-wrap">
      <span class="badge bg-secondary">Flex</span>
      <span class="badge bg-secondary">Gap</span>
      <span class="badge bg-secondary">Utilities</span>
    </div>
  </app-wrapper>

  <!-- Grid -->
  <app-wrapper classNames="p-3">
    <div class="row g-2">
      <div class="col-12 col-sm-6 col-lg-3"><div class="p-3 border rounded text-center">A</div></div>
      <div class="col-12 col-sm-6 col-lg-3"><div class="p-3 border rounded text-center">B</div></div>
      <div class="col-12 col-sm-6 col-lg-3"><div class="p-3 border rounded text-center">C</div></div>
      <div class="col-12 col-sm-6 col-lg-3"><div class="p-3 border rounded text-center">D</div></div>
    </div>
  </app-wrapper>

  <!-- Full-bleed section -->
  <app-wrapper classNames="py-4 bg-dark text-white">
    <div class="container">
      <h4 class="mb-2">Full-width section</h4>
      <p class="mb-3">Use <code>container</code> inside to constrain content.</p>
      <button-component btn-text="Action" variant="light" size="sm"></button-component>
    </div>
  </app-wrapper>
</div>
`.trim();

export const PageShell = () => `
<app-wrapper classNames="min-vh-100 d-flex flex-column">
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
`.trim();
