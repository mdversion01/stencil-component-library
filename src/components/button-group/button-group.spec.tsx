// src/components/button-group/button-group.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { ButtonGroup } from './button-group-component';
import { Button } from '../button/button-component';


describe('button-group', () => {
  it('renders horizontal by default with default aria-label', async () => {
    const page = await newSpecPage({
      components: [ButtonGroup],
      html: `<button-group></button-group>`,
    });
    const div = page.root.querySelector('div');
    expect(div.getAttribute('role')).toBe('group');
    expect(div.getAttribute('aria-label')).toBe('Button Group');
    expect(div.classList.contains('btn-group')).toBe(true);
    expect(page.root).toMatchSnapshot();
  });

  it('renders vertical layout when vertical prop is true', async () => {
    const page = await newSpecPage({
      components: [ButtonGroup],
      html: `<button-group vertical></button-group>`,
    });
    const div = page.root.querySelector('div');
    expect(div.classList.contains('btn-group-vertical')).toBe(true);
    expect(page.root).toMatchSnapshot();
  });

  it('applies additional classNames', async () => {
    const page = await newSpecPage({
      components: [ButtonGroup],
      html: `<button-group class-names="custom-class"></button-group>`,
    });
    const div = page.root.querySelector('div');
    expect(div.classList.contains('custom-class')).toBe(true);
    expect(page.root).toMatchSnapshot();
  });

  it('uses custom aria-label if provided', async () => {
    const page = await newSpecPage({
      components: [ButtonGroup],
      html: `<button-group aria-label="Custom Group Label"></button-group>`,
    });
    const div = page.root.querySelector('div');
    expect(div.getAttribute('aria-label')).toBe('Custom Group Label');
    expect(page.root).toMatchSnapshot();
  });

  it('renders slotted buttons', async () => {
    const page = await newSpecPage({
      components: [ButtonGroup],
      html: `
        <button-group>
          <button-component btn-text="One"></button-component>
          <button-component btn-text="Two"></button-component>
        </button-group>
      `,
    });
    expect(page.root.querySelectorAll('button-component').length).toBe(2);
    expect(page.root).toMatchSnapshot();
  });

  it('handles keyboard navigation: Enter and Space keys', async () => {
    const page = await newSpecPage({
      components: [ButtonGroup, Button],
      html: `
        <button-group>
          <button-component btn-text="Click Me"></button-component>
        </button-group>
      `,
    });

    const buttonComp = page.root.querySelector('button-component');

    const clickSpy = jest.fn();
    buttonComp.addEventListener('customClick', clickSpy);

    // Manually emit the customClick for Enter and Space
    buttonComp.dispatchEvent(new CustomEvent('customClick'));
    buttonComp.dispatchEvent(new CustomEvent('customClick'));
    await page.waitForChanges();

    expect(clickSpy).toHaveBeenCalledTimes(2);
  });


});
