import { newSpecPage } from '@stencil/core/testing';
import { CardComponent } from './card-component';

describe('card-component', () => {
  it('renders basic card with default aria attributes', async () => {
    const page = await newSpecPage({
      components: [CardComponent],
      html: `<card-component></card-component>`,
    });
    const div = page.root.querySelector('div');
    expect(div.getAttribute('role')).toBe('region');
    expect(div.getAttribute('aria-label')).toBe('Card section');
    expect(page.root).toMatchSnapshot();
  });

  it('renders card with custom aria-label', async () => {
    const page = await newSpecPage({
      components: [CardComponent],
      html: `<card-component aria-label="Profile Card"></card-component>`,
    });
    const div = page.root.querySelector('div');
    expect(div.getAttribute('aria-label')).toBe('Profile Card');
    expect(page.root).toMatchSnapshot();
  });

  it('renders card with header and footer slots', async () => {
    const page = await newSpecPage({
      components: [CardComponent],
      html: `
        <card-component>
          <div slot="header">Header Content</div>
          <div slot="title">Card Title</div>
          <div slot="text">Main text content</div>
          <div slot="footer">Footer Content</div>
        </card-component>
      `,
    });
    expect(page.root.querySelector('.card-header')).toBeTruthy();
    expect(page.root.querySelector('.card-footer')).toBeTruthy();
    expect(page.root).toMatchSnapshot();
  });

  it('renders card with image', async () => {
    const page = await newSpecPage({
      components: [CardComponent],
      html: `<card-component img img-src="https://example.com/image.jpg" alt-text="Sample Image"></card-component>`,
    });
    const img = page.root.querySelector('img');
    expect(img).toBeTruthy();
    expect(img.getAttribute('alt')).toBe('Sample Image');
    expect(page.root).toMatchSnapshot();
  });

  it('renders card with actions slot', async () => {
    const page = await newSpecPage({
      components: [CardComponent],
      html: `
        <card-component actions>
          <div slot="actions">Action Button</div>
        </card-component>
      `,
    });
    expect(page.root.querySelector('.card-actions')).toBeTruthy();
    expect(page.root).toMatchSnapshot();
  });

  it('applies elevation and custom classes', async () => {
    const page = await newSpecPage({
      components: [CardComponent],
      html: `<card-component elevation="2" class-names="custom-card"></card-component>`,
    });
    const div = page.root.querySelector('div');
    expect(div.classList.contains('elevated-2')).toBe(true);
    expect(div.classList.contains('custom-card')).toBe(true);
    expect(page.root).toMatchSnapshot();
  });

  it('is focusable when tabindex is provided', async () => {
    const page = await newSpecPage({
      components: [CardComponent],
      html: `<card-component tab="0"></card-component>`,
    });
    const div = page.root.querySelector('div');
    expect(div.getAttribute('tabindex')).toBe('0');
    expect(page.root).toMatchSnapshot();
  });

  it('responds to Enter and Space key events if clickable', async () => {
    const page = await newSpecPage({
      components: [CardComponent],
      html: `<card-component tab="0"></card-component>`,
    });

    const clickSpy = jest.fn();
    page.root.addEventListener('customClick', clickSpy);

    const div = page.root.querySelector('div');
    div.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    div.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    await page.waitForChanges();

    expect(clickSpy).toHaveBeenCalledTimes(2);
  });

});
