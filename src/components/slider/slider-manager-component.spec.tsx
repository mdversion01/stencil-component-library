// src/components/slider/slider-manager-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { Component, Prop, h } from '@stencil/core';
import { SliderManagerComponent } from './slider-manager-component';

/**
 * Lightweight stubs for child components. They expose the same props
 * the manager forwards, and render a <pre.props> JSON so tests can assert.
 */
@Component({ tag: 'basic-slider-component', shadow: false })
class BasicStub {
  @Prop() label: string;
  @Prop() value: number;
  @Prop() min: number;
  @Prop() max: number;
  @Prop() unit: string;
  @Prop() plumage: boolean;
  @Prop() sliderThumbLabel: boolean;
  @Prop() snapToTicks: boolean;
  @Prop() tickLabels: boolean;
  @Prop() tickValues: number[] = [];
  @Prop() variant: ''|'primary'|'secondary'|'success'|'danger'|'info'|'warning'|'dark' = '';
  @Prop() hideTextBoxes: boolean;
  @Prop() hideLeftTextBox: boolean;
  @Prop() hideRightTextBox: boolean;
  @Prop() disabled: boolean;

  render() {
    const props = {
      kind: 'basic',
      label: this.label,
      value: this.value,
      min: this.min,
      max: this.max,
      unit: this.unit,
      plumage: this.plumage,
      sliderThumbLabel: this.sliderThumbLabel,
      snapToTicks: this.snapToTicks,
      tickLabels: this.tickLabels,
      tickValues: this.tickValues,
      variant: this.variant,
      hideTextBoxes: this.hideTextBoxes,
      hideLeftTextBox: this.hideLeftTextBox,
      hideRightTextBox: this.hideRightTextBox,
      disabled: this.disabled,
    };
    return (
      <div class="stub basic">
        <pre class="props">{JSON.stringify(props)}</pre>
      </div>
    );
  }
}

@Component({ tag: 'multi-range-slider-component', shadow: false })
class MultiStub {
  @Prop() label: string;
  @Prop() lowerValue: number;
  @Prop() upperValue: number;
  @Prop() min: number;
  @Prop() max: number;
  @Prop() unit: string;
  @Prop() plumage: boolean;
  @Prop() sliderThumbLabel: boolean;
  @Prop() snapToTicks: boolean;
  @Prop() tickLabels: boolean;
  @Prop() tickValues: number[] = [];
  @Prop() variant: ''|'primary'|'secondary'|'success'|'danger'|'info'|'warning'|'dark' = '';
  @Prop() hideTextBoxes: boolean;
  @Prop() hideLeftTextBox: boolean;
  @Prop() hideRightTextBox: boolean;
  @Prop() disabled: boolean;

  render() {
    const props = {
      kind: 'multi',
      label: this.label,
      lowerValue: this.lowerValue,
      upperValue: this.upperValue,
      min: this.min,
      max: this.max,
      unit: this.unit,
      plumage: this.plumage,
      sliderThumbLabel: this.sliderThumbLabel,
      snapToTicks: this.snapToTicks,
      tickLabels: this.tickLabels,
      tickValues: this.tickValues,
      variant: this.variant,
      hideTextBoxes: this.hideTextBoxes,
      hideLeftTextBox: this.hideLeftTextBox,
      hideRightTextBox: this.hideRightTextBox,
      disabled: this.disabled,
    };
    return (
      <div class="stub multi">
        <pre class="props">{JSON.stringify(props)}</pre>
      </div>
    );
  }
}

@Component({ tag: 'discrete-slider-component', shadow: false })
class DiscreteStub {
  @Prop() label: string;
  @Prop() selectedIndex: number;
  @Prop() stringValues: string[] = [];
  @Prop() plumage: boolean;
  @Prop() tickLabels: boolean;
  @Prop() variant: ''|'primary'|'secondary'|'success'|'danger'|'info'|'warning'|'dark' = '';
  @Prop() disabled: boolean;
  @Prop() hideRightTextBox: boolean;

  render() {
    const props = {
      kind: 'discrete',
      label: this.label,
      selectedIndex: this.selectedIndex,
      stringValues: this.stringValues,
      plumage: this.plumage,
      tickLabels: this.tickLabels,
      variant: this.variant,
      disabled: this.disabled,
      hideRightTextBox: this.hideRightTextBox,
    };
    return (
      <div class="stub discrete">
        <pre class="props">{JSON.stringify(props)}</pre>
      </div>
    );
  }
}

// Helper: parse the JSON the stub printed
function readPropsJSON(root: HTMLElement) {
  const pre = root.querySelector('pre.props');
  if (!pre) return null;
  try {
    return JSON.parse(pre.textContent || '{}');
  } catch {
    return null;
  }
}

describe('slider-manager-component', () => {
  test('renders BASIC by default and forwards props', async () => {
    const page = await newSpecPage({
      components: [SliderManagerComponent, BasicStub, MultiStub, DiscreteStub],
      template: () => (
        <slider-manager-component
          /* type omitted -> default 'basic' */
          label="Speed"
          value={42}
          min={0}
          max={120}
          unit="%"
          variant="primary"
          plumage={true}
          sliderThumbLabel={true}
          snapToTicks={true}
          tickLabels={true}
          tickValues={[0, 20, 40, 60, 80, 100, 120]}
          hideTextBoxes={false}
          hideLeftTextBox={false}
          hideRightTextBox={true}
          disabled={false}
        />
      ),
    });

    // snapshot entire host
    expect(page.root).toMatchSnapshot('basic/default-snapshot');

    // ensure it rendered the basic stub and props were forwarded
    const json = readPropsJSON(page.root as any);
    expect(json).toBeTruthy();
    expect(json.kind).toBe('basic');
    expect(json.label).toBe('Speed');
    expect(json.value).toBe(42);
    expect(json.min).toBe(0);
    expect(json.max).toBe(120);
    expect(json.unit).toBe('%');
    expect(json.variant).toBe('primary');
    expect(json.sliderThumbLabel).toBe(true);
    expect(json.snapToTicks).toBe(true);
    expect(json.tickLabels).toBe(true);
    expect(json.tickValues).toEqual([0, 20, 40, 60, 80, 100, 120]);
    expect(json.hideRightTextBox).toBe(true);
  });

  test('switches to MULTI and forwards props', async () => {
    const page = await newSpecPage({
      components: [SliderManagerComponent, BasicStub, MultiStub, DiscreteStub],
      template: () => (
        <slider-manager-component
          type="multi"
          label="Range"
          lowerValue={10}
          upperValue={90}
          min={0}
          max={100}
          unit=""
          variant="warning"
          plumage={false}
          sliderThumbLabel={false}
          snapToTicks={true}
          tickLabels={false}
          tickValues={[0, 25, 50, 75, 100]}
          hideTextBoxes={true}
          hideLeftTextBox={false}
          hideRightTextBox={false}
          disabled={false}
        />
      ),
    });

    expect(page.root).toMatchSnapshot('multi/snapshot');

    const json = readPropsJSON(page.root as any);
    expect(json).toBeTruthy();
    expect(json.kind).toBe('multi');
    expect(json.label).toBe('Range');
    expect(json.lowerValue).toBe(10);
    expect(json.upperValue).toBe(90);
    expect(json.snapToTicks).toBe(true);
    expect(json.tickValues).toEqual([0, 25, 50, 75, 100]);
    expect(json.hideTextBoxes).toBe(true);
  });

  test('renders DISCRETE and forwards props', async () => {
    const page = await newSpecPage({
      components: [SliderManagerComponent, BasicStub, MultiStub, DiscreteStub],
      template: () => (
        <slider-manager-component
          type="discrete"
          label="Quality"
          selectedIndex={2}
          stringValues={['Low', 'Med', 'High', 'Ultra']}
          tickLabels={true}
          variant="success"
          plumage={true}
          disabled={true}
          hideRightTextBox={true}
        />
      ),
    });

    expect(page.root).toMatchSnapshot('discrete/snapshot');

    const json = readPropsJSON(page.root as any);
    expect(json).toBeTruthy();
    expect(json.kind).toBe('discrete');
    expect(json.label).toBe('Quality');
    expect(json.selectedIndex).toBe(2);
    expect(json.stringValues).toEqual(['Low', 'Med', 'High', 'Ultra']);
    expect(json.tickLabels).toBe(true);
    expect(json.variant).toBe('success');
    expect(json.plumage).toBe(true);
    expect(json.disabled).toBe(true);
    expect(json.hideRightTextBox).toBe(true);
  });

  test('reacts to type changes at runtime', async () => {
    const page = await newSpecPage({
      components: [SliderManagerComponent, BasicStub, MultiStub, DiscreteStub],
      template: () => (
        <slider-manager-component
          label="Dynamic"
          value={5}
          min={0}
          max={10}
          tickValues={[0, 5, 10]}
        />
      ),
    });

    // Starts basic
    let json = readPropsJSON(page.root as any);
    expect(json.kind).toBe('basic');

    // Change to multi
    page.root!.setAttribute('type', 'multi');
    await page.waitForChanges();
    json = readPropsJSON(page.root as any);
    expect(json.kind).toBe('multi');

    // Change to discrete
    page.root!.setAttribute('type', 'discrete');
    await page.waitForChanges();
    json = readPropsJSON(page.root as any);
    expect(json.kind).toBe('discrete');

    expect(page.root).toMatchSnapshot('runtime-switch/snapshot');
  });
});
