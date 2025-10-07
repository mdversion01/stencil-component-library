// src/components/divider/divider-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { DividerComponent } from './divider-component';

describe('divider-component', () => {
  it('renders horizontal divider by default', async () => {
    const page = await newSpecPage({
      components: [DividerComponent],
      html: `<divider-component></divider-component>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders dashed horizontal divider', async () => {
    const page = await newSpecPage({
      components: [DividerComponent],
      html: `<divider-component dashed></divider-component>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders vertical divider', async () => {
    const page = await newSpecPage({
      components: [DividerComponent],
      html: `<divider-component type="vertical"></divider-component>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders divider with centered text', async () => {
    const page = await newSpecPage({
      components: [DividerComponent],
      html: `<divider-component orientation="center">Center</divider-component>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders divider with left aligned text and margin override', async () => {
    const page = await newSpecPage({
      components: [DividerComponent],
      html: `<divider-component orientation="left" orientation-margin="left">Left</divider-component>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders divider with custom styles in text', async () => {
    const page = await newSpecPage({
      components: [DividerComponent],
      html: `<divider-component orientation="center" styles="color: red; font-weight: bold;">Styled</divider-component>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
