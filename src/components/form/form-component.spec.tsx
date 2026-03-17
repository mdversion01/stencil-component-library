// src/components/form/form-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { FormComponent } from './form-component';

// -------- style normalization helpers --------

function decodeIndexedStyle(styleLike: string): string {
  const s = String(styleLike || '').trim();
  if (!s) return '';

  // normal style string
  if (!/^\d+\s*:/.test(s)) return s;

  const parts: Array<{ i: number; v: string }> = [];
  const re = /(\d+)\s*:\s*([^;]*?)\s*;/g;
  let m: RegExpExecArray | null;

  while ((m = re.exec(s))) {
    const i = Number(m[1]);
    const v = m[2] ?? '';
    if (Number.isFinite(i)) parts.push({ i, v });
  }

  if (!parts.length) return s;

  parts.sort((a, b) => a.i - b.i);
  return parts.map(p => p.v).join('');
}

function getFieldsetStyleText(fieldset: HTMLFieldSetElement): string {
  const attr = fieldset.getAttribute('style') || '';
  const cssText = (fieldset.style && fieldset.style.cssText) || '';
  const raw = attr.length >= cssText.length ? attr : cssText;
  return decodeIndexedStyle(raw);
}

describe('<form-component>', () => {
  it('renders a <form> with basic attributes', async () => {
    const page = await newSpecPage({
      components: [FormComponent],
      html: `<form-component action="/submit" method="post" form-id="contact"></form-component>`,
    });

    const root = page.root!;
    const form = root.querySelector('form') as HTMLFormElement;

    expect(form).toBeTruthy();
    expect(form.getAttribute('action')).toBe('/submit');
    expect(form.getAttribute('method')).toBe('post');
    expect(form.getAttribute('id')).toBe('contact');
    expect(form.className).toBe('');
  });

  it('applies layout classes (horizontal / inline)', async () => {
    const pageH = await newSpecPage({
      components: [FormComponent],
      html: `<form-component form-layout="horizontal"></form-component>`,
    });
    expect(pageH.root!.querySelector('form')!.classList.contains('horizontal')).toBe(true);

    const pageI = await newSpecPage({
      components: [FormComponent],
      html: `<form-component form-layout="inline"></form-component>`,
    });
    expect(pageI.root!.querySelector('form')!.classList.contains('inline')).toBe(true);
  });

  it('renders outsideOfForm container instead of <form>', async () => {
    const page = await newSpecPage({
      components: [FormComponent],
      html: `<form-component outside-of-form form-id="external"></form-component>`,
    });

    const form = page.root!.querySelector('form');
    const div = page.root!.querySelector('div');

    expect(form).toBeNull();
    expect(div).toBeTruthy();
    expect(div!.getAttribute('data-form-id')).toBe('external');
  });

  it('renders fieldset + legend with defaults', async () => {
    const page = await newSpecPage({
      components: [FormComponent],
      html: `<form-component fieldset legend></form-component>`,
    });

    const fieldset = page.root!.querySelector('fieldset') as HTMLFieldSetElement;
    const legend = fieldset.querySelector('legend') as HTMLLegendElement;

    expect(fieldset).toBeTruthy();
    expect(legend).toBeTruthy();
    expect(legend.textContent).toBe('Add Title Here');

    expect(legend.classList.contains('left')).toBe(true);
    expect(legend.classList.contains('base')).toBe(true);
  });

  it('renders fieldset inside <form> when not outsideOfForm, with custom legend & styles', async () => {
    const page = await newSpecPage({
      components: [FormComponent],
      html: `<form-component
             fieldset
             legend
             legend-txt="Profile"
             legend-position="left"
             bcolor="#333"
             bstyle="solid"
             bwidth="2"
             bradius="8"
             styles="margin: 4px;"
           ></form-component>`,
    });

    const form = page.root!.querySelector('form')!;
    const fieldset = form.querySelector('fieldset') as HTMLFieldSetElement;
    const legend = fieldset.querySelector('legend') as HTMLLegendElement;

    expect(form).toBeTruthy();
    expect(fieldset).toBeTruthy();
    expect(legend.textContent).toBe('Profile');

    expect(legend.classList.contains('left')).toBe(true);
    expect(legend.classList.contains('base')).toBe(true);

    const css = getFieldsetStyleText(fieldset);
    const cssNorm = css.replace(/\s+/g, '').trim();

    // ✅ tolerate missing spaces/semicolons from JSDOM/Stencil serialization
    expect(cssNorm).toMatch(/margin:4px;?/);

    // ✅ allow optional ';' too (your decoded string may omit it)
    expect(css).toMatch(/border-color:\s*#333\s*;?/);
    expect(css).toMatch(/border-style:\s*solid\s*;?/);
    expect(css).toMatch(/border-width:\s*2px\s*;?/);
    expect(css).toMatch(/border-radius:\s*8px\s*;?/);
  });

  it('renders slotted children in the "formField" slot', async () => {
    const page = await newSpecPage({
      components: [FormComponent],
      html: `<form-component>
               <div slot="formField" id="child-a">A</div>
               <div slot="formField" id="child-b">B</div>
             </form-component>`,
    });

    const formOrDiv = page.root!.querySelector('form, div')!;
    const a = formOrDiv.querySelector('#child-a');
    const b = formOrDiv.querySelector('#child-b');

    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
    expect(a!.textContent).toBe('A');
    expect(b!.textContent).toBe('B');
  });

  it('matches snapshot (base form)', async () => {
    const page = await newSpecPage({
      components: [FormComponent],
      html: `<form-component action="/s" method="get" form-id="f1"></form-component>`,
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('matches snapshot (fieldset + legend + styles, outsideOfForm)', async () => {
    const page = await newSpecPage({
      components: [FormComponent],
      html: `<form-component
               fieldset
               legend
               legend-position="right"
               legend-txt="Settings"
               outside-of-form
               form-id="external"
               bcolor="red"
               bstyle="dashed"
               bwidth="1"
               bradius="4"
               styles="padding:2px;"
             >
               <div slot="formField">Inner field</div>
             </form-component>`,
    });
    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });
});
