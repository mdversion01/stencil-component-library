import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { ProgressDisplayComponent } from './progress-display-component';

describe('progress-display-component', () => {
  test('linear (default) snapshot', async () => {
    const page = await newSpecPage({
      components: [ProgressDisplayComponent],
      template: () => <progress-display-component value={35} />,
    });

    expect(page.root).toMatchInlineSnapshot(`
<progress-display-component>
  <!---->
  <div class="linear-progress" style="height: 20px;">
    <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="35" class="bg-primary progress-bar" role="progressbar" style="width: 35%;"></div>
  </div>
</progress-display-component>
`);
  });

  test('linear with showProgress + striped + animated + variant', async () => {
    const page = await newSpecPage({
      components: [ProgressDisplayComponent],
      template: () => <progress-display-component value={50} showProgress striped animated variant="success" precision={1} height={16} />,
    });

    expect(page.root).toMatchInlineSnapshot(`
<progress-display-component>
  <!---->
  <div class="linear-progress" style="height: 16px;">
    <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="50" class="bg-success progress-bar progress-bar-animated progress-bar-striped" role="progressbar" style="width: 50%;">
      <span class="progress-text">
        50.0%
      </span>
    </div>
  </div>
</progress-display-component>
`);
  });

  test('circular snapshot (showProgress)', async () => {
    const page = await newSpecPage({
      components: [ProgressDisplayComponent],
      template: () => <progress-display-component circular value={25} showProgress size={60} width={6} />,
    });

    // Structure-focused snapshot (SVG numbers will be stable for given inputs)
    expect(page.root).toMatchInlineSnapshot(`
<progress-display-component width="6">
  <!---->
  <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="25" class="primary-text progress-circular" role="progressbar" style="height: 60px; width: 60px;">
    <svg viewBox="0 0 46 46" style="transform: rotate(0deg);">
      <circle class="progress-circular-underlay" cx="23" cy="23" fill="transparent" r="20" stroke-dasharray="125.66370614359172" stroke-dashoffset="0" stroke-width="6"></circle>
      <circle class="progress-circular-overlay" cx="23" cy="23" r="20" stroke-dasharray="125.66370614359172" stroke-dashoffset="94.24777960769379" stroke-width="6" style="stroke-linecap: round;"></circle>
    </svg>
    <div class="progress-circular-info">
      25%
    </div>
  </div>
</progress-display-component>
`);
  });

  test('multi bars from JSON attribute snapshot', async () => {
    const barsJson = JSON.stringify([
      { value: 25, variant: 'primary', showProgress: true },
      { value: 15, variant: 'success', striped: true },
      { value: 10, variant: 'danger', animated: true, progressAlign: 'right' },
    ]);

    const page = await newSpecPage({
      components: [ProgressDisplayComponent],
      template: () => <progress-display-component multi height={22} bars={barsJson} />,
    });

    expect(page.root).toMatchInlineSnapshot(`
<progress-display-component>
  <!---->
  <div class="linear-progress" style="height: 22px;">
    <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="25" class="bg-primary progress-bar" role="progressbar" style="width: 25%;">
      <span class="progress-text">
        25%
      </span>
    </div>
    <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="15" class="bg-success progress-bar progress-bar-striped" role="progressbar" style="width: 15%;"></div>
    <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="10" class="bg-danger progress-bar progress-bar-animated" role="progressbar" style="width: 10%;">
    </div>
  </div>
</progress-display-component>
`);
  });

  test('bars watcher: update via attribute re-renders', async () => {
    const initial = JSON.stringify([{ value: 30, variant: 'info' }]);
    const updated = JSON.stringify([
      { value: 40, variant: 'warning', showProgress: true },
      { value: 10, variant: 'dark', progressAlign: 'right' },
    ]);

    const page = await newSpecPage({
      components: [ProgressDisplayComponent],
      template: () => <progress-display-component multi bars={initial} />,
    });

    // initial: 1 bar
    expect(page.root!.querySelectorAll('.progress-bar').length).toBe(1);

    // update bars attribute (string) -> watcher should normalize & rerender
    page.root!.setAttribute('bars', updated);
    await page.waitForChanges();

    const bars = page.root!.querySelectorAll('.progress-bar');
    expect(bars.length).toBe(2);
    expect(page.root).toMatchInlineSnapshot(`
<progress-display-component bars="[{&quot;value&quot;:40,&quot;variant&quot;:&quot;warning&quot;,&quot;showProgress&quot;:true},{&quot;value&quot;:10,&quot;variant&quot;:&quot;dark&quot;,&quot;progressAlign&quot;:&quot;right&quot;}]">
  <!---->
  <div class="linear-progress" style="height: 20px;">
    <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="40" class="bg-warning progress-bar" role="progressbar" style="width: 40%;">
      <span class="progress-text">
        40%
      </span>
    </div>
    <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="10" class="bg-dark progress-bar" role="progressbar" style="width: 10%;">
    </div>
  </div>
</progress-display-component>
`);
  });
});
