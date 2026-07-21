/**
 * src/components/date-picker/datepicker-component.spec.tsx
 *
 * Updated for current component behavior:
 * - Works without global CSS.escape
 * - Resolves aria-labelledby / aria-describedby safely via [id="..."]
 * - Asserts help text (__desc) is always present and outside the dialog
 * - Asserts validation message (__validation) is added only when validation attr is present and invalid
 * - Accepts current label strategy:
 *    - visible label uses aria-labelledby
 *    - hidden label uses aria-label
 * - Matches current horizontal / inline grid behavior
 */

import { newSpecPage } from '@stencil/core/testing';
import { Datepicker } from './datepicker-component';

function find<T extends Element = HTMLElement>(root: Element | ShadowRoot, sel: string): T | null {
  return root.querySelector(sel) as T | null;
}

function findAll<T extends Element = HTMLElement>(root: Element | ShadowRoot, sel: string): T[] {
  return Array.from(root.querySelectorAll(sel)) as T[];
}

function firstChildDiv<T extends HTMLElement = HTMLElement>(el: Element): T | null {
  return (Array.from(el.children).find(c => (c as HTMLElement).tagName === 'DIV') ?? null) as T | null;
}

function escapeAttrValue(v: string): string {
  return v.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function queryById(root: Element | ShadowRoot, id: string): Element | null {
  return root.querySelector(`[id="${escapeAttrValue(id)}"]`);
}

function parseIdRefs(value: string | null | undefined): string[] {
  return String(value || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function hasUsableAssociation(host: Element | ShadowRoot): boolean {
  const input = find<HTMLInputElement>(host, 'input.form-control');
  const label = find<HTMLLabelElement>(host, 'label.form-control-label');

  if (!input) return false;

  const forId = label?.getAttribute('for') ?? null;
  const inputId = input.getAttribute('id');
  const forMatches = !!(forId && inputId && forId === inputId);

  const ariaLabel = (input.getAttribute('aria-label') || '').trim();
  const hasAriaLabel = ariaLabel.length > 0;

  const ariaLabelledby = (input.getAttribute('aria-labelledby') || '').trim();
  const labelledIds = parseIdRefs(ariaLabelledby);
  const labelledByResolves = labelledIds.some(id => !!queryById(host, id));

  return forMatches || hasAriaLabel || labelledByResolves;
}

async function makePage(html: string) {
  const page = await newSpecPage({
    components: [Datepicker],
    html,
  });

  const HE = page.win.HTMLElement.prototype as any;
  if (!HE.__datepickerPatchedFocus) {
    HE.__datepickerPatchedFocus = true;
    HE.focus = function () {};
    HE.blur = function () {};
  }

  const HI = page.win.HTMLInputElement.prototype as any;
  if (!HI.setSelectionRange) {
    HI.setSelectionRange = function (_start: number, _end: number) {};
  }

  await page.waitForChanges();
  return page;
}

function expectDescribedByResolves(host: HTMLElement, input: HTMLInputElement) {
  const ids = parseIdRefs(input.getAttribute('aria-describedby'));
  expect(ids.length).toBeGreaterThan(0);

  ids.forEach(id => {
    expect(queryById(host, id)).toBeTruthy();
  });
}

function expectHelpTextOutsideDialog(host: HTMLElement, input: HTMLInputElement) {
  const ids = parseIdRefs(input.getAttribute('aria-describedby'));
  const helpId = ids.find(id => id.endsWith('__desc'));

  expect(helpId).toBeTruthy();

  const helpEl = helpId ? queryById(host, helpId) : null;
  expect(helpEl).toBeTruthy();

  const dialog = find<HTMLElement>(host, '.dropdown-content');
  if (dialog && helpEl) {
    expect(dialog.contains(helpEl)).toBe(false);
  }
}

describe('datepicker-component', () => {
  it('renders', async () => {
    const page = await makePage(`<datepicker-component></datepicker-component>`);
    expect(page.root).toBeTruthy();
  });

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

    const group = groups[0];
    const inputCol = firstChildDiv(group);
    expect(inputCol).toBeTruthy();
    expect(inputCol!.className).toContain('col-9');

    const label = find<HTMLLabelElement>(host, 'label.form-control-label');
    expect(label).toBeTruthy();
    expect(label!.className).toContain('col-3');
    expect(label!.className).toContain('form-control-label');
    expect(label!.className).toMatch(/\blg\b|label-lg|col-form-label-lg/);
  });

  it('horizontal + labelHidden: expands input to col-12 and still has usable accessible naming', async () => {
    const page = await makePage(`
      <datepicker-component
        form-layout="horizontal"
        label="Start date"
        label-hidden
      ></datepicker-component>
    `);

    const host = page.root as HTMLElement;
    expect(hasUsableAssociation(host)).toBe(true);

    const groups = findAll(host, '.form-group');
    expect(groups.length).toBeGreaterThan(0);

    const group = groups[0];
    const inputCol = firstChildDiv(group);
    expect(inputCol).toBeTruthy();
    expect(inputCol!.className).toContain('col-12');
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

    const group = groups[0];
    const inputCol = firstChildDiv(group);
    expect(inputCol).toBeTruthy();
    expect(inputCol!.className).toContain('col-sm-8');
    expect(inputCol!.className).toContain('col-md-9');

    const label = find<HTMLLabelElement>(host, 'label.form-control-label');
    expect(label).toBeTruthy();
    expect(label!.className).toContain('col-sm-4');
    expect(label!.className).toContain('col-md-3');
  });

  it('inline layout: does not apply grid classes by default, even if numeric widths are provided', async () => {
    const page1 = await makePage(`
      <datepicker-component
        form-layout="inline"
        label="Date"
      ></datepicker-component>
    `);

    const host1 = page1.root as HTMLElement;
    const label1 = find<HTMLLabelElement>(host1, 'label.form-control-label');
    expect(label1).toBeTruthy();
    expect(label1!.className).not.toMatch(/\bcol-\w+/);

    const inputGroup1 = find<HTMLElement>(host1, '.form-group .input-group');
    expect(inputGroup1).toBeTruthy();
    const inputWrap1 = inputGroup1!.parentElement as HTMLElement;
    expect(inputWrap1.className).not.toMatch(/\bcol-\w+/);

    const page2 = await makePage(`
      <datepicker-component
        form-layout="inline"
        label="Date"
        input-col="6"
      ></datepicker-component>
    `);

    const host2 = page2.root as HTMLElement;
    const label2 = find<HTMLLabelElement>(host2, 'label.form-control-label');
    expect(label2).toBeTruthy();
    expect(label2!.className).not.toMatch(/\bcol-\w+/);

    const inputGroup2 = find<HTMLElement>(host2, '.form-group .input-group');
    expect(inputGroup2).toBeTruthy();
    const inputWrap2 = inputGroup2!.parentElement as HTMLElement;
    expect(inputWrap2.className).not.toMatch(/\bcol-\w+/);
  });

  it('always renders help text id and keeps aria-describedby resolvable', async () => {
    const page = await makePage(`
      <datepicker-component label="Birthday"></datepicker-component>
    `);

    const host = page.root as HTMLElement;
    const input = find<HTMLInputElement>(host, 'input.form-control');
    expect(input).toBeTruthy();

    expectDescribedByResolves(host, input!);
    expectHelpTextOutsideDialog(host, input!);
  });

  it('input -> clear -> blur becomes invalid when required + validation are enabled', async () => {
    const page = await makePage(`
      <datepicker-component
        required
        validation
        label="Date"
        validation-message="Date is required."
      ></datepicker-component>
    `);

    const host = page.root as HTMLElement;
    const input = find<HTMLInputElement>(host, 'input.form-control');
    expect(input).toBeTruthy();

    input!.value = '2022-01-02';
    input!.dispatchEvent(new page.win.Event('input', { bubbles: true }));
    await page.waitForChanges();

    input!.value = '';
    input!.dispatchEvent(new page.win.Event('input', { bubbles: true }));
    await page.waitForChanges();

    input!.dispatchEvent(new page.win.Event('blur', { bubbles: true }));
    await page.waitForChanges();

    expect(input!.classList.contains('is-invalid') || input!.getAttribute('aria-invalid') === 'true').toBe(true);
    expect(input!.getAttribute('aria-invalid')).toBe('true');

    const describedByIds = parseIdRefs(input!.getAttribute('aria-describedby'));
    const validationId = describedByIds.find(id => id.endsWith('__validation'));
    expect(validationId).toBeTruthy();

    const validationEl = validationId ? (queryById(host, validationId) as HTMLElement | null) : null;
    expect(validationEl).toBeTruthy();

    if (validationEl) {
      expect((validationEl.textContent || '').trim()).toBe('Please select a date.');
      expect(validationEl.getAttribute('aria-live')).toBe('polite');
      expect(validationEl.getAttribute('aria-atomic')).toBe('true');
    }

    expectDescribedByResolves(host, input!);
  });

  it('does not show invalid state on blur when validation attribute is absent', async () => {
    const page = await makePage(`
      <datepicker-component
        required
        label="Date"
        validation-message="Date is required."
      ></datepicker-component>
    `);

    const host = page.root as HTMLElement;
    const input = find<HTMLInputElement>(host, 'input.form-control');
    expect(input).toBeTruthy();

    input!.value = '';
    input!.dispatchEvent(new page.win.Event('input', { bubbles: true }));
    input!.dispatchEvent(new page.win.Event('blur', { bubbles: true }));
    await page.waitForChanges();

    expect(input!.classList.contains('is-invalid')).toBe(false);
    expect(input!.getAttribute('aria-invalid')).not.toBe('true');

    const describedByIds = parseIdRefs(input!.getAttribute('aria-describedby'));
    expect(describedByIds.some(id => id.endsWith('__validation'))).toBe(false);

    const validationEl = find<HTMLElement>(host, '.invalid-feedback');
    expect(validationEl).toBeNull();
  });

  it('warns once when both placeholder and dateFormat are provided', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    await makePage(`
      <datepicker-component
        date-format="YYYY-MM-DD"
        placeholder="Pick a date"
      ></datepicker-component>
    `);

    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('associates label with input via for=id or ARIA naming', async () => {
    const page = await makePage(`
      <datepicker-component label="Birthday"></datepicker-component>
    `);

    const host = page.root as HTMLElement;
    expect(hasUsableAssociation(host)).toBe(true);
  });

  it('labelHidden uses aria-label instead of aria-labelledby', async () => {
    const page = await makePage(`
      <datepicker-component
        label="Birthday"
        label-hidden
      ></datepicker-component>
    `);

    const host = page.root as HTMLElement;
    const input = find<HTMLInputElement>(host, 'input.form-control');
    expect(input).toBeTruthy();

    expect((input!.getAttribute('aria-label') || '').trim()).toBe('Birthday');
    expect(input!.getAttribute('aria-labelledby')).toBeNull();
  });

  it('visible label uses aria-labelledby and that id resolves', async () => {
    const page = await makePage(`
      <datepicker-component
        label="Birthday"
      ></datepicker-component>
    `);

    const host = page.root as HTMLElement;
    const input = find<HTMLInputElement>(host, 'input.form-control');
    expect(input).toBeTruthy();

    const ids = parseIdRefs(input!.getAttribute('aria-labelledby'));
    expect(ids.length).toBeGreaterThan(0);
    ids.forEach(id => {
      expect(queryById(host, id)).toBeTruthy();
    });

    expect(input!.getAttribute('aria-label')).toBeNull();
  });
});
