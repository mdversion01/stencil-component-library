/**
 * src/components/datepicker/datepicker-component.spec.tsx
 *
 * Updates (for latest component changes):
 *  - Remove dependency on global CSS.escape (not present in Jest/mock-doc).
 *  - Resolve aria-labelledby via safe [id="..."] selector (attribute-escaped).
 *  - NEW: assert aria-describedby always includes the help text id and that it exists near the input (outside dialog).
 *  - NEW: when invalid, aria-describedby also includes validation id; validation node is aria-live polite + atomic.
 *  - Keep existing behavior checks (sr-only OR for=id OR aria-label OR aria-labelledby resolves).
 *
 * Notes:
 *  - Component only shows validation UI / aria-invalid when the `validation` attribute is present.
 *  - Help text id is expected to end with `__desc` (ids.desc).
 *  - Validation message id is expected to end with `__validation` (ids.validation).
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

/**
 * Escape for attribute selector value: [id="..."].
 * Minimal escaping for quotes and backslashes so querySelector stays valid.
 */
function escapeAttrValue(v: string): string {
  return v.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function queryById(root: Element | ShadowRoot, id: string): Element | null {
  const safe = escapeAttrValue(id);
  return (root as ParentNode).querySelector(`[id="${safe}"]`);
}

function parseIdRefs(value: string | null | undefined): string[] {
  return String(value || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
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
    const ids = ariaLabelledby.split(/\s+/).filter(Boolean);
    labelledByResolves = ids.some(x => !!queryById(host, x));
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

// ----------------------------- a11y assertions ------------------------------

function expectDescribedByResolves(host: HTMLElement, input: HTMLInputElement) {
  const refs = parseIdRefs(input.getAttribute('aria-describedby'));
  expect(refs.length).toBeGreaterThan(0);

  for (const id of refs) {
    const node = queryById(host, id);
    expect(node).toBeTruthy();
  }
}

function expectHasHelpTextOutsideDialog(host: HTMLElement, input: HTMLInputElement) {
  const refs = parseIdRefs(input.getAttribute('aria-describedby'));
  expect(refs.length).toBeGreaterThan(0);

  const helpId = refs.find(id => id.endsWith('__desc'));
  expect(helpId).toBeTruthy();

  const helpEl = helpId ? queryById(host, helpId) : null;
  expect(helpEl).toBeTruthy();
  if (!helpEl) return;

  // help text should not live inside the dropdown dialog
  const dialog = find<HTMLElement>(host, '.dropdown-content');
  if (dialog) {
    expect(dialog.contains(helpEl)).toBe(false);
  }
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
    expect(label.className).toMatch(/\blg\b|label-lg/);
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

    // Even if a numeric width is provided, inline layout ignores grid classes
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

  // ------------------------------ aria-describedby / help text -----------------------------

  it('always renders help text id and keeps aria-describedby resolvable (help text outside dialog)', async () => {
    const page = await makePage(`
      <datepicker-component label="Birthday"></datepicker-component>
    `);

    const host = page.root as HTMLElement;
    const input = find<HTMLInputElement>(host, 'input.form-control')!;
    expect(input).toBeTruthy();

    // aria-describedby must exist and resolve to real elements
    expectDescribedByResolves(host, input);

    // help text should be present and not inside the dialog container
    expectHasHelpTextOutsideDialog(host, input);
  });

  // ------------------------------ interactions / validation -----------------------------

  it('input -> clear -> blur transitions to invalid when required (validation enabled) and announces via live region', async () => {
    const page = await makePage(`
      <datepicker-component required validation label="Date" validation-message="Date is required."></datepicker-component>
    `);

    const host = page.root as HTMLElement;
    const input = find<HTMLInputElement>(host, 'input.form-control');
    expect(input).toBeTruthy();

    // type a value
    input!.value = '01-02-2022';
    input!.dispatchEvent(new page.win.Event('input', { bubbles: true }));
    await page.waitForChanges();

    // clear it
    input!.value = '';
    input!.dispatchEvent(new page.win.Event('input', { bubbles: true }));
    await page.waitForChanges();

    // blur should trigger invalid state when validation is enabled
    input!.dispatchEvent(new page.win.Event('blur', { bubbles: true }));
    await page.waitForChanges();

    const hasInvalid = !!find(host, '.is-invalid') || input!.getAttribute('aria-invalid') === 'true';
    expect(hasInvalid).toBe(true);

    // validation message should exist, be referenced by aria-describedby, and be a polite live region
    const describedByIds = parseIdRefs(input!.getAttribute('aria-describedby'));
    const validationId = describedByIds.find(x => x.endsWith('__validation'));
    expect(validationId).toBeTruthy();

    const validationEl = validationId ? (queryById(host, validationId) as HTMLElement | null) : null;
    expect(validationEl).toBeTruthy();
    if (validationEl) {
      expect((validationEl.getAttribute('aria-live') || '').toLowerCase()).toBe('polite');
      expect((validationEl.getAttribute('aria-atomic') || '').toLowerCase()).toBe('true');
    }

    // describedby references should all resolve
    expectDescribedByResolves(host, input!);
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
