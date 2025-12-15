import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { PlumageAutocompleteSingle } from './plumage-autocomplete-single-component';

// Minimal InputEvent polyfill for JSDOM
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
      template: () => (
        <plumage-autocomplete-single
          input-id="acs"
          label="City"
          options={['Apple', 'Banana', 'Cherry']}
        />
      ),
    });

    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('required + blur marks invalid and shows validation message; underline reflects invalid state', async () => {
    const page = await newSpecPage({
      components: [PlumageAutocompleteSingle],
      template: () => (
        <plumage-autocomplete-single
          input-id="acs"
          label="City"
          required={true}
          validation-message="Please fill in"
          options={['Apple', 'Banana', 'Cherry']}
        />
      ),
    });

    await page.waitForChanges();

    const input = getInput(page);
    input.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
    await page.waitForChanges();

    expect(page.root).toMatchSnapshot();
  });

  it('filters on input and selects an option; dropdown closes and value is set', async () => {
    const page = await newSpecPage({
      components: [PlumageAutocompleteSingle],
      template: () => (
        <plumage-autocomplete-single
          input-id="acs"
          label="City"
          options={['Apple', 'Banana', 'Cherry']}
        />
      ),
    });

    await page.waitForChanges();

    await typeIn(page, 'ap');

    const items = Array.from(page.root!.querySelectorAll('.autocomplete-dropdown-item')) as HTMLElement[];
    expect(items.length).toBe(1);
    expect(items[0].textContent!.trim()).toBe('Apple');

    clickOptionByText(page, 'Apple');
    await page.waitForChanges();

    expect(page.root!.querySelector('.autocomplete-dropdown')).toBeNull();
    const input = getInput(page);
    expect(input.value).toBe('Apple');

    const clearBtn = page.root!.querySelector('.clear-btn');
    expect(clearBtn).toBeTruthy();

    expect(page.root).toMatchSnapshot();
  });
});
