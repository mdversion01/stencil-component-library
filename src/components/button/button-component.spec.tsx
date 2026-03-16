// src/components/button/button-component.new.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { Button } from './button-component';

const getControl = (root: HTMLElement) =>
  (root.querySelector('button') as HTMLElement) || (root.querySelector('a') as HTMLElement);

describe('button-component (new spec)', () => {
  it('renders default <button> with text (no forced role, no aria-label by default)', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: `<button-component btn-text="Click me"></button-component>`,
    });

    const btn = getControl(page.root);

    expect(page.root.hasAttribute('slot-side')).toBe(false);

    expect(btn).toBeTruthy();
    expect(btn.tagName).toBe('BUTTON');

    // Native button: do not force role
    expect(btn.getAttribute('role')).toBeNull();

    // Visible text already names the control; aria-label should be omitted unless needed
    expect(btn.getAttribute('aria-label')).toBeNull();

    expect(btn).toMatchSnapshot();
  });

  it('renders <a> link with aria-disabled and proper role/tabindex when disabled', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: `<button-component link disabled btn-text="Disabled Link" url="https://example.com"></button-component>`,
    });
    const a = getControl(page.root);

    expect(a.tagName).toBe('A');

    // Disabled link should not be navigable
    expect(a.getAttribute('href')).toBeNull();

    expect(a.getAttribute('aria-disabled')).toBe('true');
    expect(a.getAttribute('role')).toBe('button');
    expect(a.getAttribute('tabindex')).toBe('-1');

    expect(a).toMatchSnapshot();
  });

  it('link enabled: sets href when url is valid (not empty/#), role=button, tabindex=0 by default', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: `<button-component link btn-text="Go" url="/path"></button-component>`,
    });
    const a = getControl(page.root);

    expect(a.tagName).toBe('A');
    expect(a.getAttribute('href')).toBe('/path');
    expect(a.getAttribute('role')).toBe('button');
    expect(a.getAttribute('tabindex')).toBe('0');
  });

  it('applies aria-pressed only when toggle=true; respects aria-label override', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: `<button-component toggle pressed btn-text="Submit" aria-label="Submit form"></button-component>`,
    });
    const btn = getControl(page.root);

    expect(btn.getAttribute('aria-pressed')).toBe('true');
    expect(btn.getAttribute('aria-label')).toBe('Submit form');
    expect(btn).toMatchSnapshot();
  });

  it('omits aria-pressed when toggle=false even if pressed is set', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: `<button-component pressed btn-text="No Toggle"></button-component>`,
    });
    const btn = getControl(page.root);
    expect(btn.hasAttribute('aria-pressed')).toBe(false);
  });

  it('uses aria-labelledby over aria-label when provided', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: `<button-component btn-text="Ignored" aria-label="Label" aria-labelledby="lbl-id" aria-describedby="desc-id"></button-component>`,
    });
    const btn = getControl(page.root);

    expect(btn.getAttribute('aria-labelledby')).toBe('lbl-id');
    expect(btn.getAttribute('aria-describedby')).toBe('desc-id');
    // When labelledby is present, aria-label should be omitted to avoid conflicts
    expect(btn.getAttribute('aria-label')).toBeNull();
  });

  it('slotSide="left" adds ms-1 and keeps me-1 off', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: `<button-component btn-text="With Icon" slot-side="left"><span>🌟</span></button-component>`,
    });
    const content = page.root.querySelector('.btn__content') as HTMLElement;
    expect(page.root.getAttribute('slot-side')).toBe('left');
    expect(content.classList.contains('ms-1')).toBe(true);
    expect(content.classList.contains('me-1')).toBe(false);
    expect(getControl(page.root)).toMatchSnapshot();
  });

  it('slotSide="right" adds me-1 and keeps ms-1 off', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: `<button-component btn-text="Next" slot-side="right"><span>➡️</span></button-component>`,
    });
    const content = page.root.querySelector('.btn__content') as HTMLElement;
    expect(page.root.getAttribute('slot-side')).toBe('right');
    expect(content.classList.contains('me-1')).toBe(true);
    expect(content.classList.contains('ms-1')).toBe(false);
    expect(getControl(page.root)).toMatchSnapshot();
  });

  it('btnIcon (icon-only) uses fallback aria-label "Button" when no text/aria provided', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: `<button-component btn-icon><span>🔔</span></button-component>`,
    });
    const btn = getControl(page.root);

    expect(btn.getAttribute('aria-label')).toBe('Button');
    expect(btn).toMatchSnapshot();
  });

  it('iconBtn wraps slot in .btn__content', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: `<button-component icon-btn><span>🔔</span></button-component>`,
    });
    expect(page.root.querySelector('.btn__content')).toBeTruthy();
    expect(getControl(page.root)).toMatchSnapshot();
  });

  it('grouped button with start placement adds group classes', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: `<button-component group-btn start btn-text="Start Btn"></button-component>`,
    });
    const btn = getControl(page.root);

    expect(btn.classList.contains('btn-group')).toBe(true);
    expect(btn.classList.contains('btn-group-start')).toBe(true);
    expect(btn).toMatchSnapshot();
  });

  it('applies variant/size/elevation classes (presence only)', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: `<button-component btn-text="Elevated" elevation="2" variant="primary" size="lg"></button-component>`,
    });
    const btn = getControl(page.root);

    expect(btn.classList.contains('elevated-2')).toBe(true);
    expect(btn.classList.contains('btn-primary')).toBe(true);
    expect(btn.classList.contains('btn-lg')).toBe(true);
  });

  it('keyboard Enter/Space on link emits customClick (when enabled)', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: `<button-component link btn-text="Press Me" url="#"></button-component>`,
    });
    const a = getControl(page.root);
    const spy = jest.fn();
    page.root.addEventListener('customClick', spy);

    a.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await page.waitForChanges();
    a.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    await page.waitForChanges();

    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('disabled link: Enter/Space do not emit', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: `<button-component link disabled btn-text="Disabled Link" url="#disabled"></button-component>`,
    });
    const a = getControl(page.root);
    const spy = jest.fn();
    page.root.addEventListener('customClick', spy);

    a.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await page.waitForChanges();
    a.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    await page.waitForChanges();

    expect(spy).not.toHaveBeenCalled();
  });

  it('disabled native button: click does not emit', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: `<button-component disabled btn-text="Disabled Button"></button-component>`,
    });
    const btn = getControl(page.root);
    const spy = jest.fn();
    page.root.addEventListener('customClick', spy);

    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await page.waitForChanges();

    expect(spy).not.toHaveBeenCalled();
  });

  it('accordion props: sets aria-expanded/controls and toggles when isOpen changes', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: `<button-component accordion is-open="false" target-id="panel-1" btn-text="Toggle Section"></button-component>`,
    });
    const comp = page.rootInstance as Button;
    const btn = getControl(page.root);

    expect(btn.getAttribute('aria-expanded')).toBe('false');
    expect(btn.getAttribute('aria-controls')).toBe('panel-1');

    comp.isOpen = true;
    await page.waitForChanges();

    expect(btn.getAttribute('aria-expanded')).toBe('true');
    expect(btn).toMatchSnapshot();
  });

  it('dynamic styles: absolute positioning + offsets + zIndex reflected in style attribute', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: `<button-component btn-text="Styled" absolute left="10" top="5" z-index="9"></button-component>`,
    });
    const btn = getControl(page.root);
    const style = (btn.getAttribute('style') || '').replace(/\s+/g, ' ');
    expect(style).toContain('position: absolute');
    expect(style).toContain('left: 10px');
    expect(style).toContain('top: 5px');
    expect(style).toContain('z-index: 9');
  });

  it('link path: prevents navigation when url is empty or "#" and still emits customClick', async () => {
    const prevent = jest.fn();
    const page = await newSpecPage({
      components: [Button],
      html: `<button-component link btn-text="NoNav" url="#"></button-component>`,
    });
    const a = getControl(page.root);
    const clickSpy = jest.fn();
    page.root.addEventListener('customClick', clickSpy);

    const evt = new MouseEvent('click', { bubbles: true, cancelable: true }) as any;
    evt.preventDefault = prevent;
    a.dispatchEvent(evt);
    await page.waitForChanges();

    expect(prevent).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
  });

  it('toggle: clicking flips pressed and emits pressedChange', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: `<button-component toggle btn-text="Toggle Me"></button-component>`,
    });
    const btnEl = page.root;
    const btn = getControl(page.root);

    const pressedSpy = jest.fn();
    btnEl.addEventListener('pressedChange', (e: CustomEvent) => pressedSpy(e.detail));

    expect(btn.getAttribute('aria-pressed')).toBe('false');

    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await page.waitForChanges();
    expect(btn.getAttribute('aria-pressed')).toBe('true');
    expect(pressedSpy).toHaveBeenLastCalledWith(true);

    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await page.waitForChanges();
    expect(btn.getAttribute('aria-pressed')).toBe('false');
    expect(pressedSpy).toHaveBeenLastCalledWith(false);
  });

  it('native button type prop maps to <button type="submit">', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: `<button-component type="submit" btn-text="Submit"></button-component>`,
    });
    const btn = getControl(page.root);
    expect(btn.tagName).toBe('BUTTON');
    expect(btn.getAttribute('type')).toBe('submit');
  });

  it('respects explicit role passthrough on native button when provided on host', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: `<button-component role="menuitem" btn-text="Menu Item"></button-component>`,
    });
    const btn = getControl(page.root);
    expect(btn.getAttribute('role')).toBe('menuitem');
  });

  it('respects explicit tabindex passthrough on native button when provided on host', async () => {
    const page = await newSpecPage({
      components: [Button],
      html: `<button-component tabindex="2" btn-text="Tabbed"></button-component>`,
    });
    const btn = getControl(page.root);
    expect(btn.getAttribute('tabindex')).toBe('2');
  });
});
