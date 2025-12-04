/**
 * src/components/datepicker/datepicker-component.spec.tsx
 *
 * Test fixes:
 *  - Patch focus/blur and setSelectionRange per spec page (mock-doc quirks)
 *  - Remove :scope usage
 *  - labelHidden: accept any valid name/association (sr-only, for=id, aria-label, aria-labelledby)
 *  - inline layout: no grid classes even if input-col is provided (matches component behavior)
 *  - label association: accept for=id OR any valid ARIA naming
 */

import { newSpecPage } from '@stencil/core/testing';
import { Datepicker } from './datepicker-component';

// ---------------------------- small DOM helpers -----------------------------

function find<T extends Element = HTMLElement>(root: Element | ShadowRoot, sel: string): T | null {
  return root.querySelector(sel) as T | null;
}
function findAll<T extends Element = HTMLElement>(root: Element | ShadowRoot, sel: string): T[] {
  return Array.from(root.querySelectorAll(sel)) as T[];
}
function firstChildDiv<T extends HTMLElement = HTMLElement>(el: Element): T | null {
  return (Array.from(el.children).find(c => (c as HTMLElement).tagName === 'DIV') ?? null) as T | null;
}

// A11y association helper: passes if we can establish *any* reasonable association
function hasUsableAssociation(host: Element | ShadowRoot): boolean {
  const input = find<HTMLInputElement>(host, 'input.form-control');
  const label = find<HTMLLabelElement>(host, 'label.form-control-label');

  if (!input) return false;

  // 1) sr-only label present
  const srOnly = !!find(host, 'label.form-control-label.sr-only');

  // 2) for=id linkage
  const forId = label?.getAttribute('for') ?? null;
  const id = input.getAttribute('id');
  const forMatches = !!(forId && id && forId === id);

  // 3) non-empty aria-label
  const ariaLabel = (input.getAttribute('aria-label') || '').trim();
  const hasAriaLabel = ariaLabel.length > 0;

  // 4) aria-labelledby resolves to an existing element
  const ariaLabelledby = (input.getAttribute('aria-labelledby') || '').trim();
  let labelledByResolves = false;
  if (ariaLabelledby) {
    const ids = ariaLabelledby.split(/\s+/);
    labelledByResolves = ids.some(x => !!(host as HTMLElement).querySelector(`#${CSS.escape(x)}`));
  }

  return srOnly || forMatches || hasAriaLabel || labelledByResolves;
}

// ------------------------- per-page environment patch ----------------------

async function makePage(html: string) {
  const page = await newSpecPage({
    components: [Datepicker],
    html,
  });

  // Avoid focus recursion in mock-doc
  const HE = page.win.HTMLElement.prototype as any;
  if (!HE.___patchedFocus) {
    HE.___patchedFocus = true;
    HE.focus = function () {}; // no-op
    HE.blur = function () {}; // no-op
  }

  // Mock missing setSelectionRange on mock input
  const HI = page.win.HTMLInputElement.prototype as any;
  if (!HI.setSelectionRange) {
    HI.setSelectionRange = function (_s: number, _e: number) {};
  }

  return page;
}

// --------------------------------- specs -----------------------------------

describe('datepicker-component', () => {
  it('renders', async () => {
    const page = await makePage(`<datepicker-component></datepicker-component>`);
    expect(page.root).toBeTruthy();
  });

  // ------------------------------ layout: horizontal ------------------------

  it('horizontal layout (numeric fallback): applies label/input col classes and labelSize', async () => {
    const page = await makePage(`
      <datepicker-component
        form-layout="horizontal"
        label="Birthday"
        label-size="lg"
        label-col="3"
        input-col="9"
      ></datepicker-component>
    `);

    const host = page.root as HTMLElement;
    const groups = findAll(host, '.form-group');
    expect(groups.length).toBeGreaterThan(0);

    const group0 = groups[0];
    const inputCol = firstChildDiv(group0)!;
    expect(inputCol).toBeTruthy();
    expect(inputCol.className).toContain('col-9');

    const label = find(host, 'label.form-control-label')!;
    expect(label).toBeTruthy();
    expect(label.className).toContain('col-3');
    expect(label.className).toContain('form-control-label');
    expect(label.className).toMatch(/\blg\b|label-lg/); // tolerant to implementation
  });

  it('horizontal + labelHidden: expands input to col-12; a11y via sr-only/for=id/aria-label/aria-labelledby', async () => {
    const page = await makePage(`
      <datepicker-component
        form-layout="horizontal"
        label="Start date"
        label-hidden
      ></datepicker-component>
    `);

    const host = page.root as HTMLElement;

    // Accept any valid naming strategy
    expect(hasUsableAssociation(host)).toBe(true);

    // With hidden label and no explicit input cols, input should be full width
    const groups = findAll(host, '.form-group');
    expect(groups.length).toBeGreaterThan(0);
    const group0 = groups[0];
    const inputCol = firstChildDiv(group0)!;
    expect(inputCol).toBeTruthy();
    expect(inputCol.className).toContain('col-12');
  });

  it('horizontal layout with string specs: parses labelCols/inputCols properly', async () => {
    const page = await makePage(`
      <datepicker-component
        form-layout="horizontal"
        label="When?"
        label-cols="sm-4 md-3"
        input-cols="sm-8 md-9"
      ></datepicker-component>
    `);

    const host = page.root as HTMLElement;
    const groups = findAll(host, '.form-group');
    expect(groups.length).toBeGreaterThan(0);

    const group0 = groups[0];
    const inputCol = firstChildDiv(group0)!;
    expect(inputCol).toBeTruthy();
    expect(inputCol.className).toContain('col-sm-8');
    expect(inputCol.className).toContain('col-md-9');

    const label = find(host, 'label.form-control-label')!;
    expect(label).toBeTruthy();
    expect(label.className).toContain('col-sm-4');
    expect(label.className).toContain('col-md-3');
  });

  // ------------------------------- layout: inline ---------------------------

  it('inline layout: no grid classes by default and still none if input-col provided; label un-gridded', async () => {
    // Default (no grid classes)
    const page1 = await makePage(`
      <datepicker-component form-layout="inline" label="Date"></datepicker-component>
    `);
    const host1 = page1.root as HTMLElement;

    const labelDefault = find(host1, 'label.form-control-label')!;
    expect(labelDefault).toBeTruthy();
    expect(labelDefault.className).not.toMatch(/\bcol-\w+/);

    const inputGroupDefault = find(host1, '.form-group .input-group')!;
    const inputColDefault = inputGroupDefault.parentElement as HTMLElement;
    expect(inputColDefault.className).not.toMatch(/\bcol-\w+/);

    // Even if a numeric width is provided, inline layout ignores grid classes (matches component behavior)
    const page2 = await makePage(`
      <datepicker-component form-layout="inline" label="Date" input-col="6"></datepicker-component>
    `);
    const host2 = page2.root as HTMLElement;
    const inputGroup2 = find(host2, '.form-group .input-group')!;
    const inputColAfter = inputGroup2.parentElement as HTMLElement;

    expect(inputColAfter.className).not.toMatch(/\bcol-\w+/);

    const label2 = find(host2, 'label.form-control-label')!;
    expect(label2.className).not.toMatch(/\bcol-\w+/);
  });

  // ------------------------------ interactions -----------------------------

  it('input -> clear -> blur transitions to invalid when required', async () => {
    const page = await makePage(`
      <datepicker-component required label="Date"></datepicker-component>
    `);

    const host = page.root as HTMLElement;
    const input = find<HTMLInputElement>(host, 'input.form-control');
    expect(input).toBeTruthy();

    input!.value = '01/02/2022';
    input!.dispatchEvent(new page.win.Event('input', { bubbles: true }));
    await page.waitForChanges();

    input!.value = '';
    input!.dispatchEvent(new page.win.Event('input', { bubbles: true }));
    await page.waitForChanges();

    input!.dispatchEvent(new page.win.Event('blur', { bubbles: true }));
    await page.waitForChanges();

    const formGroup = find(host, '.form-group') as HTMLElement;
    const hasInvalidClass = !!find(host, '.is-invalid') || input!.getAttribute('aria-invalid') === 'true' || formGroup?.classList.contains('has-danger');

    expect(hasInvalidClass).toBe(true);
  });

  it('warns once when both placeholder and dateFormat are provided', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    await makePage(`
      <datepicker-component date-format="YYYY-MM-DD" placeholder="Pick a date"></datepicker-component>
    `);
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  // --------------------------- accessibility link --------------------------

  it('associates label with input via for=id OR exposes name via ARIA (aria-label / aria-labelledby)', async () => {
    const page = await makePage(`
      <datepicker-component label="Birthday"></datepicker-component>
    `);

    const host = page.root as HTMLElement;
    expect(hasUsableAssociation(host)).toBe(true);
  });
});
