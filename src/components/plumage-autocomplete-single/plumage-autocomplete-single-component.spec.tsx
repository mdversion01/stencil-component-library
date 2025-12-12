import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { PlumageAutocompleteSingle } from './plumage-autocomplete-single-component';

// If some environments rely on InputEvent existing, provide a minimal polyfill.
// This is safe even if InputEvent already exists.
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
  // Use a plain bubbling event so it works in JSDOM
  input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
  await page.waitForChanges();
}

function clickOptionByText(page: any, text: string) {
  const items = Array.from(page.root!.querySelectorAll('.autocomplete-dropdown-item')) as HTMLElement[];
  const match = items.find(li => (li.textContent || '').trim() === text);
  if (!match) throw new Error(`Option "${text}" not found`);
  match.click();
}

/**
 * NOTE:
 * We use inputId="acs" (-> ids: "acs") and label="City" (-> names: "city")
 * so aria-* and message ids are predictable in snapshots.
 */

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

    const underline = page.root!.querySelector('.b-underline') as HTMLElement | null;
    const focusBar = page.root!.querySelector('.b-focus') as HTMLElement | null;
    expect(underline).toBeTruthy();
    expect(focusBar).toBeTruthy();
    expect(underline!.classList.contains('invalid')).toBe(false);
    expect(focusBar!.classList.contains('invalid')).toBe(false);

    expect(page.root).toMatchInlineSnapshot(`
<plumage-autocomplete-single input-id="acs">
  <div class="plumage">
    <div class="autocomplete-container form-group">
      <div>
        <label class="form-control-label" htmlfor="acs">
          <span>
            City
          </span>
        </label>
        <div>
          <div class="autocomplete-single-select input-group">
            <input aria-autocomplete="list" aria-controls="acs-listbox" aria-expanded="false" aria-haspopup="listbox" aria-required="false" autocomplete="off" class="form-control" id="acs" inputmode="text" name="city" placeholder="City" role="combobox" type="text" value="">
          </div>
          <div class="b-underline" role="presentation">
            <div aria-hidden="true" class="b-focus" role="presentation" style="width: 0; left: 50%;"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</plumage-autocomplete-single>
`);
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

    // Blur with empty value -> should trigger validationState = true
    const input = getInput(page);
    input.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
    await page.waitForChanges();

    const underline = page.root!.querySelector('.b-underline')!;
    const focusBar = page.root!.querySelector('.b-focus')!;
    const message = page.root!.querySelector('#acs-validation');

    expect(underline.classList.contains('invalid')).toBe(true);
    expect(focusBar.classList.contains('invalid')).toBe(true);
    expect(message?.textContent).toBe('Please fill in');

    expect(page.root).toMatchInlineSnapshot(`
<plumage-autocomplete-single input-id="acs" validation-message="Please fill in">
  <div class="plumage">
    <div class="autocomplete-container form-group">
      <div>
        <label class="form-control-label invalid" htmlfor="acs">
          <span class="required">
            City
          </span>
          <span class="required">
            *
          </span>
        </label>
        <div>
          <div class="autocomplete-single-select input-group is-invalid">
            <input aria-autocomplete="list" aria-controls="acs-listbox" aria-describedby="acs-validation" aria-expanded="false" aria-haspopup="listbox" aria-required="true" autocomplete="off" class="form-control is-invalid" id="acs" inputmode="text" name="city" placeholder="City" role="combobox" type="text" value="">
          </div>
          <div class="b-underline invalid" role="presentation">
            <div aria-hidden="true" class="b-focus invalid" role="presentation" style="width: 0; left: 50%;"></div>
          </div>
          <div aria-live="polite" class="invalid-feedback" id="acs-validation">
            Please fill in
          </div>
        </div>
      </div>
    </div>
  </div>
</plumage-autocomplete-single>
`);
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

    // Type to filter (any non-empty will filter; not tied to 3-char threshold)
    await typeIn(page, 'ap'); // should match "Apple"

    // Dropdown should open with "Apple"
    let items = Array.from(page.root!.querySelectorAll('.autocomplete-dropdown-item')) as HTMLElement[];
    expect(items.length).toBe(1);
    expect(items[0].textContent!.trim()).toBe('Apple');

    // Click the item to select
    clickOptionByText(page, 'Apple');
    await page.waitForChanges();

    // Dropdown should be gone, input should have "Apple"
    expect(page.root!.querySelector('.autocomplete-dropdown')).toBeNull();
    const input = getInput(page);
    expect(input.value).toBe('Apple');

    // Clear button should show (unless removeClearBtn is set)
    const clearBtn = page.root!.querySelector('.clear-btn');
    expect(clearBtn).toBeTruthy();

    expect(page.root).toMatchInlineSnapshot(`
<plumage-autocomplete-single input-id="acs">
  <div class="plumage">
    <div class="autocomplete-container form-group">
      <div>
        <label class="form-control-label" htmlfor="acs">
          <span>
            City
          </span>
        </label>
        <div>
          <div class="autocomplete-single-select input-group">
            <input aria-autocomplete="list" aria-controls="acs-listbox" aria-expanded="false" aria-haspopup="listbox" aria-required="false" autocomplete="off" class="form-control" id="acs" inputmode="text" name="city" placeholder="City" role="combobox" type="text" value="Apple">
            <button aria-label="Clear input" class="clear-btn" role="button" title="Clear input">
              <i class="fa-times fas"></i>
            </button>
          </div>
          <div class="b-underline" role="presentation">
            <div aria-hidden="true" class="b-focus" role="presentation" style="width: 0; left: 50%;"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</plumage-autocomplete-single>
`);
  });
});
