// src/components/progress-display/progress-display-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { ProgressDisplayComponent } from './progress-display-component';

function getFirstProgressbar(root: HTMLElement): HTMLElement {
  const el = root.querySelector('[role="progressbar"]') as HTMLElement | null;
  if (!el) throw new Error('progressbar element not found');
  return el;
}

describe('progress-display-component', () => {
  it('linear (default) snapshot + a11y basics', async () => {
    const page = await newSpecPage({
      components: [ProgressDisplayComponent],
      template: () => <progress-display-component value={35} />,
    });

    await page.waitForChanges();

    const pb = getFirstProgressbar(page.root as HTMLElement);
    expect(pb.getAttribute('role')).toBe('progressbar');
    expect(pb.getAttribute('aria-valuemin')).toBe('0');
    expect(pb.getAttribute('aria-valuemax')).toBe('100');
    expect(pb.getAttribute('aria-valuenow')).toBe('35');

    // default labeling should exist (aria-label fallback)
    const ariaLabel = pb.getAttribute('aria-label');
    const ariaLabelledBy = pb.getAttribute('aria-labelledby');
    expect(ariaLabel || ariaLabelledBy).toBeTruthy();

    expect(page.root).toMatchSnapshot();
  });

  it('linear with showProgress + striped + animated + variant (adds aria-valuetext)', async () => {
    const page = await newSpecPage({
      components: [ProgressDisplayComponent],
      template: () => (
        <progress-display-component value={50} showProgress striped animated variant="success" precision={1} height={16} />
      ),
    });

    await page.waitForChanges();

    const pb = getFirstProgressbar(page.root as HTMLElement);
    expect(pb.getAttribute('aria-valuenow')).toBe('50');
    expect(pb.getAttribute('aria-valuetext')).toBe('50.0%');

    expect(page.root).toMatchSnapshot();
  });

  it('circular snapshot (showProgress) + a11y basics', async () => {
    const page = await newSpecPage({
      components: [ProgressDisplayComponent],
      template: () => <progress-display-component circular value={25} showProgress size={60} width={6} />,
    });

    await page.waitForChanges();

    const pb = getFirstProgressbar(page.root as HTMLElement);
    expect(pb.getAttribute('role')).toBe('progressbar');
    expect(pb.getAttribute('aria-valuemin')).toBe('0');
    expect(pb.getAttribute('aria-valuemax')).toBe('100');
    expect(pb.getAttribute('aria-valuenow')).toBe('25');
    expect(pb.getAttribute('aria-valuetext')).toBe('25%');

    expect(page.root).toMatchSnapshot();
  });

  it('indeterminate progress omits aria-valuenow/max and sets aria-busy', async () => {
    const page = await newSpecPage({
      components: [ProgressDisplayComponent],
      template: () => <progress-display-component indeterminate value={50} />,
    });

    await page.waitForChanges();

    const pb = getFirstProgressbar(page.root as HTMLElement);
    expect(pb.getAttribute('role')).toBe('progressbar');
    expect(pb.getAttribute('aria-busy')).toBe('true');

    // indeterminate: should not report determinate values
    expect(pb.getAttribute('aria-valuenow')).toBeNull();
    expect(pb.getAttribute('aria-valuemax')).toBeNull();
    expect(pb.getAttribute('aria-valuemin')).toBeNull();

    expect(page.root).toMatchSnapshot();
  });

  it('multi bars from JSON attribute snapshot + a11y group', async () => {
    const barsJson = JSON.stringify([
      { value: 25, variant: 'primary', showProgress: true },
      { value: 15, variant: 'success', striped: true },
      { value: 10, variant: 'danger', animated: true, progressAlign: 'right' },
    ]);

    const page = await newSpecPage({
      components: [ProgressDisplayComponent],
      template: () => <progress-display-component multi height={22} bars={barsJson} />,
    });

    await page.waitForChanges();

    const group = (page.root as HTMLElement).querySelector('[role="group"]') as HTMLElement | null;
    expect(group).toBeTruthy();

    const bars = (page.root as HTMLElement).querySelectorAll('[role="progressbar"]');
    expect(bars.length).toBe(3);

    // bar 0 showProgress => aria-valuetext
    expect((bars[0] as HTMLElement).getAttribute('aria-valuetext')).toBe('25%');

    expect(page.root).toMatchSnapshot();
  });

  it('bars watcher: update via attribute re-renders', async () => {
    const initial = JSON.stringify([{ value: 30, variant: 'info' }]);
    const updated = JSON.stringify([
      { value: 40, variant: 'warning', showProgress: true },
      { value: 10, variant: 'dark', progressAlign: 'right' },
    ]);

    const page = await newSpecPage({
      components: [ProgressDisplayComponent],
      template: () => <progress-display-component multi bars={initial} />,
    });

    await page.waitForChanges();

    expect(page.root!.querySelectorAll('.progress-bar').length).toBe(1);

    page.root!.setAttribute('bars', updated);
    await page.waitForChanges();

    const bars = page.root!.querySelectorAll('.progress-bar');
    expect(bars.length).toBe(2);

    // snapshot after update
    expect(page.root).toMatchSnapshot();
  });

  it('label prop wires aria-labelledby to a real label id (single)', async () => {
    const page = await newSpecPage({
      components: [ProgressDisplayComponent],
      template: () => <progress-display-component value={10} label="Loading widgets" />,
    });

    await page.waitForChanges();

    const root = page.root as HTMLElement;
    const pb = getFirstProgressbar(root);

    const labelledby = pb.getAttribute('aria-labelledby');
    expect(labelledby).toBeTruthy();

    const labelEl = labelledby ? (root.querySelector(`#${labelledby}`) as HTMLElement | null) : null;
    expect(labelEl).toBeTruthy();
    expect(labelEl!.textContent).toBe('Loading widgets');

    // aria-label should be absent when aria-labelledby is present
    expect(pb.getAttribute('aria-label')).toBeNull();

    expect(page.root).toMatchSnapshot();
  });
});
