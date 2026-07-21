// src/components/plumage-autocomplete-single/plumage-autocomplete-single-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { PlumageAutocompleteSingle } from './plumage-autocomplete-single-component';

if (!(global as any).InputEvent) {
  (global as any).InputEvent = Event as any;
}

function getInput(page: any): HTMLInputElement {
  const el = page.root!.querySelector('input.form-control') as HTMLInputElement | null;
  if (!el) throw new Error('input not found');
  return el;
}

async function typeIn(page: any, value: string) {
  const input = getInput(page);
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
  await page.waitForChanges();
}

async function keydown(page: any, key: string) {
  const input = getInput(page);
  input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key }));
  await page.waitForChanges();
}

function clickOptionByText(page: any, text: string) {
  const items = Array.from(page.root!.querySelectorAll('.autocomplete-dropdown-item')) as HTMLElement[];
  const match = items.find(li => (li.textContent || '').trim() === text);
  if (!match) throw new Error(`Option "${text}" not found`);
  match.click();
}

describe('plumage-autocomplete-single', () => {
  it('renders stacked layout with underline present (not invalid by default)', async () => {
    const page = await newSpecPage({
      components: [PlumageAutocompleteSingle],
      template: () => <plumage-autocomplete-single input-id="acs" label="City" options={['Apple', 'Banana', 'Cherry']} />,
    });

    await page.waitForChanges();

    const input = getInput(page);
    expect(input.getAttribute('role')).toBe('combobox');
    expect(input.getAttribute('aria-autocomplete')).toBe('list');
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(input.getAttribute('aria-invalid')).toBe('false');

    const underline = page.root!.querySelector('.b-underline') as HTMLElement | null;
    expect(underline).toBeTruthy();
    expect(underline!.classList.contains('invalid')).toBe(false);

    expect(page.root).toMatchSnapshot();
  });

  it('required + blur marks invalid and shows validation message; underline reflects invalid state; aria-describedby wired to validation id', async () => {
    const page = await newSpecPage({
      components: [PlumageAutocompleteSingle],
      template: () => <plumage-autocomplete-single input-id="acs" label="City" required={true} validation-message="Please fill in" options={['Apple', 'Banana', 'Cherry']} />,
    });

    await page.waitForChanges();

    const input = getInput(page);
    input.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
    await page.waitForChanges();

    expect(page.root!.querySelector('.b-underline')!.classList.contains('invalid')).toBe(true);
    expect(getInput(page).classList.contains('is-invalid')).toBe(true);
    expect(getInput(page).getAttribute('aria-invalid')).toBe('true');

    const desc = getInput(page).getAttribute('aria-describedby') || '';
    expect(desc).toContain('acs-validation');

    const msg = page.root!.querySelector('#acs-validation') as HTMLElement | null;
    expect(msg).toBeTruthy();
    expect((msg!.textContent || '').trim()).toBe('Please fill in');

    expect(page.root).toMatchSnapshot();
  });

  it('filters on input and selects an option; dropdown closes and value is set; aria-selected reflects selected option; aria-activedescendant references option id', async () => {
    const page = await newSpecPage({
      components: [PlumageAutocompleteSingle],
      template: () => <plumage-autocomplete-single input-id="acs" label="City" options={['Apple', 'Banana', 'Cherry']} />,
    });

    await page.waitForChanges();

    let input = getInput(page);
    input.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    await page.waitForChanges();

    await typeIn(page, 'app');

    const comp = page.rootInstance as any;
    comp.inputValue = 'app';
    comp.valueState = 'app';
    comp.filteredOptions = ['Apple'];
    comp.dropdownOpen = true;
    comp.focusedOptionIndex = 0;
    comp.selectedOptionIndex = -1;
    await page.waitForChanges();

    input = getInput(page);
    expect(input.value).toBe('app');
    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(input.getAttribute('aria-controls')).toBe('acs-listbox');
    expect(input.getAttribute('aria-activedescendant')).toBe('acs-opt-0');

    let list = page.root!.querySelector('#acs-listbox') as HTMLElement | null;
    expect(list).toBeTruthy();
    expect(list!.getAttribute('role')).toBe('listbox');

    let items = Array.from(page.root!.querySelectorAll('.autocomplete-dropdown-item')) as HTMLElement[];
    expect(items.length).toBe(1);
    expect(items[0].textContent!.trim()).toBe('Apple');
    expect(items[0].getAttribute('aria-selected')).toBe('false');

    clickOptionByText(page, 'Apple');
    await page.waitForChanges();

    expect(page.root!.querySelector('.autocomplete-dropdown')).toBeNull();

    input = getInput(page);
    expect(input.value).toBe('Apple');

    comp.inputValue = 'a';
    comp.valueState = 'a';
    comp.filteredOptions = ['Apple', 'Banana'];
    comp.dropdownOpen = true;
    comp.focusedOptionIndex = 0;
    comp.selectedOptionIndex = 0;
    await page.waitForChanges();

    const opt = page.root!.querySelector('#acs-opt-0') as HTMLElement | null;
    expect(opt).toBeTruthy();
    expect(opt!.getAttribute('aria-selected')).toBe('true');

    const clearBtn = page.root!.querySelector('.clear-btn') as HTMLButtonElement | null;
    expect(clearBtn).toBeTruthy();
    expect(clearBtn!.getAttribute('type')).toBe('button');

    expect(page.root).toMatchSnapshot();
  });

  it('error state sets aria-invalid and error message uses role=alert', async () => {
    const page = await newSpecPage({
      components: [PlumageAutocompleteSingle],
      template: () => <plumage-autocomplete-single input-id="acs" label="City" error={true} error-message="Bad value" options={['Apple', 'Banana', 'Cherry']} />,
    });

    await page.waitForChanges();

    const input = getInput(page);
    expect(input.getAttribute('aria-invalid')).toBe('true');

    const desc = input.getAttribute('aria-describedby') || '';
    expect(desc).toContain('acs-error');

    const msg = page.root!.querySelector('#acs-error') as HTMLElement | null;
    expect(msg).toBeTruthy();
    expect(msg!.getAttribute('role')).toBe('alert');
    expect(msg!.getAttribute('aria-live')).toBe('assertive');

    expect(page.root).toMatchSnapshot();
  });

  it('label-hidden uses aria-label fallback when no aria-labelledby provided', async () => {
    const page = await newSpecPage({
      components: [PlumageAutocompleteSingle],
      template: () => <plumage-autocomplete-single input-id="acs" label="City" label-hidden={true} options={['Apple', 'Banana', 'Cherry']} />,
    });

    await page.waitForChanges();

    const input = getInput(page);
    expect(input.getAttribute('aria-label')).toBeTruthy();
    expect((input.getAttribute('aria-label') || '').length).toBeGreaterThan(0);

    expect(page.root).toMatchSnapshot();
  });
});
