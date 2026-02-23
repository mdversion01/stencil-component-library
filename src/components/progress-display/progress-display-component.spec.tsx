// src/components/progress-display/progress-display-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { ProgressDisplayComponent } from './progress-display-component';

describe('progress-display-component', () => {
  it('linear (default) snapshot', async () => {
    const page = await newSpecPage({
      components: [ProgressDisplayComponent],
      template: () => <progress-display-component value={35} />,
    });

    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('linear with showProgress + striped + animated + variant', async () => {
    const page = await newSpecPage({
      components: [ProgressDisplayComponent],
      template: () => (
        <progress-display-component value={50} showProgress striped animated variant="success" precision={1} height={16} />
      ),
    });

    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('circular snapshot (showProgress)', async () => {
    const page = await newSpecPage({
      components: [ProgressDisplayComponent],
      template: () => <progress-display-component circular value={25} showProgress size={60} width={6} />,
    });

    await page.waitForChanges();
    expect(page.root).toMatchSnapshot();
  });

  it('multi bars from JSON attribute snapshot', async () => {
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

    // initial: 1 bar
    expect(page.root!.querySelectorAll('.progress-bar').length).toBe(1);

    // update bars attribute (string) -> watcher should normalize & rerender
    page.root!.setAttribute('bars', updated);
    await page.waitForChanges();

    const bars = page.root!.querySelectorAll('.progress-bar');
    expect(bars.length).toBe(2);

    // snapshot after update
    expect(page.root).toMatchSnapshot();
  });
});
