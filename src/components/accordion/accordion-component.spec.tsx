// src/components/accordion/accordion-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { AccordionComponent } from './accordion-component';
// IMPORTANT: also register the child so its native control renders
import { Button as ButtonComponent } from '../button/button-component';

describe('accordion-component', () => {
  const getTargetEl = (page: any, id: string) => page.root.querySelector<HTMLElement>(`#${id}`);

  const getInnerControl = (root: HTMLElement) => root.querySelector<HTMLElement>('button-component button, button-component a');

  const fireTransitionEnd = async (el: HTMLElement, page: any) => {
    el.dispatchEvent(new Event('transitionend'));
    await page.waitForChanges();
  };

  it('renders closed by default', async () => {
    const page = await newSpecPage({
      components: [AccordionComponent, ButtonComponent],
      html: `<accordion-component target-id="section1"></accordion-component>`,
    });

    const hostBtn = page.root.querySelector('button-component');
    const control = getInnerControl(page.root);
    const target = getTargetEl(page, 'section1')!;

    expect(hostBtn).toBeTruthy();
    expect(control).toBeTruthy();
    expect(control!.getAttribute('aria-expanded')).toBe('false');
    expect(target.style.display).toBe('none');
    expect(target.style.height).toBe('0px');

    expect(page.root).toMatchSnapshot();
  });

  it('renders open by default when is-open is set', async () => {
    const page = await newSpecPage({
      components: [AccordionComponent, ButtonComponent],
      html: `<accordion-component target-id="section2" is-open="true"></accordion-component>`,
    });

    const control = getInnerControl(page.root);
    const target = getTargetEl(page, 'section2')!;

    expect(control).toBeTruthy();
    expect(page.rootInstance.internalOpen).toBe(true);
    expect(control!.getAttribute('aria-expanded')).toBe('true');
    expect(target.style.display).toBe('block');
    expect(target.style.height).toBe('auto');

    expect(page.root).toMatchSnapshot();
  });

  it('toggles open/closed state on click', async () => {
    const page = await newSpecPage({
      components: [AccordionComponent, ButtonComponent],
      html: `<accordion-component target-id="section3"></accordion-component>`,
    });

    const instance = page.rootInstance as AccordionComponent;
    const hostBtn = page.root.querySelector('button-component')!;
    const control = getInnerControl(page.root);
    const target = getTargetEl(page, 'section3')!;

    expect(control).toBeTruthy();

    await hostBtn.dispatchEvent(new CustomEvent('customClick'));
    await page.waitForChanges();
    expect(instance.internalOpen).toBe(true);
    expect(control!.getAttribute('aria-expanded')).toBe('true');
    await fireTransitionEnd(target, page);
    expect(target.style.height).toBe('auto');
    expect(target.style.display).toBe('block');

    await hostBtn.dispatchEvent(new CustomEvent('customClick'));
    await page.waitForChanges();
    expect(instance.internalOpen).toBe(false);
    expect(control!.getAttribute('aria-expanded')).toBe('false');
    await fireTransitionEnd(target, page);
    expect(target.style.display).toBe('none');
  });

  it('renders icon and switches when toggled', async () => {
    const page = await newSpecPage({
      components: [AccordionComponent, ButtonComponent],
      html: `<accordion-component
               accordion
               target-id="accordion-test"
               icon="fa-chevron-down, fa-chevron-up"
             >
               <span slot="accordion-header">Header</span>
               <div slot="content">Body</div>
             </accordion-component>`,
    });

    const icon = page.root.querySelector('icon-component');
    expect(icon).toBeTruthy();
    expect(icon!.getAttribute('icon')).toContain('fa-chevron-down');

    const hostBtn = page.root.querySelector('button-component')!;
    const target = getTargetEl(page, 'accordion-test')!;

    hostBtn.dispatchEvent(new CustomEvent('customClick'));
    await page.waitForChanges();
    await fireTransitionEnd(target, page);

    const updatedIcon = page.root.querySelector('icon-component')!;
    expect(updatedIcon.getAttribute('icon')).toContain('fa-chevron-up');
  });

  it('toggles open/closed with keyboard (Enter and Space)', async () => {
    const page = await newSpecPage({
      components: [AccordionComponent, ButtonComponent],
      html: `<accordion-component target-id="section5"></accordion-component>`,
    });

    const instance = page.rootInstance as AccordionComponent;
    const inner = page.root.querySelector<HTMLElement>('button-component button, button-component a')!;
    const target = page.root.querySelector<HTMLElement>('#section5')!;

    // Press Enter — the button-component will emit customClick itself
    inner.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await page.waitForChanges();
    expect(instance.internalOpen).toBe(true);
    target.dispatchEvent(new Event('transitionend'));
    await page.waitForChanges();

    // Press Space — same: only keyboard events, no manual customClick
    inner.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    inner.dispatchEvent(new KeyboardEvent('keyup', { key: ' ', bubbles: true }));
    await page.waitForChanges();
    expect(instance.internalOpen).toBe(false);
    target.dispatchEvent(new Event('transitionend'));
    await page.waitForChanges();
  });

  it('renders and toggles in link mode (anchor-like button)', async () => {
    const page = await newSpecPage({
      components: [AccordionComponent, ButtonComponent],
      html: `<accordion-component link target-id="link-section" variant="primary">
             <span slot="button-text">Open Link</span>
           </accordion-component>`,
    });

    const instance = page.rootInstance as AccordionComponent;
    const inner = page.root.querySelector<HTMLElement>('button-component a, button-component button')!;
    const target = page.root.querySelector<HTMLElement>('#link-section')!;

    expect(inner.getAttribute('role')).toBe('button');
    expect(inner.getAttribute('aria-expanded')).toBe('false');

    // Open via keyboard (component emits customClick)
    inner.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await page.waitForChanges();
    expect(instance.internalOpen).toBe(true);
    target.dispatchEvent(new Event('transitionend'));
    await page.waitForChanges();

    // Close via Space
    inner.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    inner.dispatchEvent(new KeyboardEvent('keyup', { key: ' ', bubbles: true }));
    await page.waitForChanges();
    expect(instance.internalOpen).toBe(false);
    target.dispatchEvent(new Event('transitionend'));
    await page.waitForChanges();
  });

  it('emits toggleEvent(boolean) with the new state', async () => {
    const page = await newSpecPage({
      components: [AccordionComponent, ButtonComponent],
      html: `<accordion-component target-id="emit-section"></accordion-component>`,
    });

    const spy = jest.fn();
    page.root.addEventListener('toggleEvent', (e: CustomEvent) => spy(e.detail));
    const hostBtn = page.root.querySelector('button-component')!;

    await hostBtn.dispatchEvent(new CustomEvent('customClick'));
    await page.waitForChanges();
    expect(spy).toHaveBeenLastCalledWith(true);

    await hostBtn.dispatchEvent(new CustomEvent('customClick'));
    await page.waitForChanges();
    expect(spy).toHaveBeenLastCalledWith(false);
  });

  it('@Watch("isOpen"): updating host prop updates internalOpen and styles', async () => {
    const page = await newSpecPage({
      components: [AccordionComponent, ButtonComponent],
      html: `<accordion-component target-id="watched"></accordion-component>`,
    });

    const instance = page.rootInstance as AccordionComponent;
    const control = getInnerControl(page.root);
    const target = getTargetEl(page, 'watched')!;

    expect(control).toBeTruthy();

    // Start closed
    expect(instance.internalOpen).toBe(false);
    expect(control!.getAttribute('aria-expanded')).toBe('false');

    // Open via host attribute/property
    page.root.setAttribute('is-open', 'true');
    await page.waitForChanges();
    expect(instance.internalOpen).toBe(true);
    expect(control!.getAttribute('aria-expanded')).toBe('true');
    expect(target.style.display).toBe('block');
    expect(target.style.height).toBe('auto');

    // Close via host attribute/property
    page.root.setAttribute('is-open', 'false');
    await page.waitForChanges();
    expect(instance.internalOpen).toBe(false);
    expect(control!.getAttribute('aria-expanded')).toBe('false');
    expect(target.style.display).toBe('none');
    expect(target.style.height).toBe('0px');
  });
});
