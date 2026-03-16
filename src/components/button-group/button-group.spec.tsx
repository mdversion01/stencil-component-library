// src/components/button-group/button-group.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { ButtonGroup } from './button-group-component';
import { Button } from '../button/button-component';

describe('button-group', () => {
  const getGroupDiv = (root: HTMLElement) => root.querySelector('div') as HTMLDivElement;
  const getInnerControl = (root: HTMLElement) =>
    root.querySelector('button-component button, button-component a') as HTMLElement | null;

  it('renders horizontal by default with default aria-label', async () => {
    const page = await newSpecPage({
      components: [ButtonGroup],
      html: `<button-group></button-group>`,
    });

    const div = getGroupDiv(page.root);
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

    const div = getGroupDiv(page.root);
    expect(div.classList.contains('btn-group-vertical')).toBe(true);

    expect(page.root).toMatchSnapshot();
  });

  it('applies additional classNames', async () => {
    const page = await newSpecPage({
      components: [ButtonGroup],
      html: `<button-group class-names="custom-class"></button-group>`,
    });

    const div = getGroupDiv(page.root);
    expect(div.classList.contains('custom-class')).toBe(true);

    expect(page.root).toMatchSnapshot();
  });

  it('uses custom aria-label if provided', async () => {
    const page = await newSpecPage({
      components: [ButtonGroup],
      html: `<button-group aria-label="Custom Group Label"></button-group>`,
    });

    const div = getGroupDiv(page.root);
    expect(div.getAttribute('aria-label')).toBe('Custom Group Label');

    expect(page.root).toMatchSnapshot();
  });

  it('prefers aria-labelledby over aria-label (and clears aria-label when labelledby present)', async () => {
    const page = await newSpecPage({
      components: [ButtonGroup],
      html: `<button-group aria-label="Label Should Not Win" aria-labelledby="groupLabel"></button-group>`,
    });

    const div = getGroupDiv(page.root);
    expect(div.getAttribute('aria-labelledby')).toBe('groupLabel');
    expect(div.getAttribute('aria-label')).toBeNull();

    expect(page.root).toMatchSnapshot();
  });

  it('sets aria-describedby when provided', async () => {
    const page = await newSpecPage({
      components: [ButtonGroup],
      html: `<button-group aria-describedby="groupHelp"></button-group>`,
    });

    const div = getGroupDiv(page.root);
    expect(div.getAttribute('aria-describedby')).toBe('groupHelp');

    expect(page.root).toMatchSnapshot();
  });

  it('sets aria-disabled when disabled is true', async () => {
    const page = await newSpecPage({
      components: [ButtonGroup],
      html: `<button-group disabled></button-group>`,
    });

    const div = getGroupDiv(page.root);
    expect(div.getAttribute('aria-disabled')).toBe('true');

    expect(page.root).toMatchSnapshot();
  });

  it('renders slotted buttons', async () => {
    const page = await newSpecPage({
      components: [ButtonGroup, Button],
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

  it('keyboard activation on inner button emits customClick (Enter/Space)', async () => {
    const page = await newSpecPage({
      components: [ButtonGroup, Button],
      html: `
        <button-group>
          <button-component btn-text="Click Me"></button-component>
        </button-group>
      `,
    });

    const buttonComp = page.root.querySelector('button-component') as HTMLElement;
    expect(buttonComp).toBeTruthy();

    const inner = getInnerControl(page.root);
    expect(inner).toBeTruthy();

    const clickSpy = jest.fn();
    buttonComp.addEventListener('customClick', clickSpy);

    inner!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await page.waitForChanges();

    inner!.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    inner!.dispatchEvent(new KeyboardEvent('keyup', { key: ' ', bubbles: true }));
    await page.waitForChanges();

    expect(clickSpy).toHaveBeenCalledTimes(2);
  });
});
