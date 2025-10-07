// src/components/accordion/accordion-component.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { AccordionComponent } from './accordion-component';

describe('accordion-component', () => {
  const getTargetEl = (page: any, id: string) =>
    page.root.querySelector<HTMLElement>(`#${id}`);

  const fireTransitionEnd = async (el: HTMLElement, page: any) => {
    el.dispatchEvent(new Event('transitionend'));
    await page.waitForChanges();
  };

  it('renders closed by default', async () => {
    const page = await newSpecPage({
      components: [AccordionComponent],
      html: `<accordion-component target-id="section1"></accordion-component>`,
    });

    const button = page.root.querySelector('button-component');
    const target = getTargetEl(page, 'section1');

    expect(button).toBeTruthy();
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(target.style.display).toBe('none');
    expect(target.style.height).toBe('0px');

    expect(page.root).toMatchSnapshot();
  });

  it('renders open by default when is-open is set', async () => {
    const page = await newSpecPage({
      components: [AccordionComponent],
      html: `<accordion-component target-id="section2" is-open="true"></accordion-component>`,
    });

    const button = page.root.querySelector('button-component');
    const target = getTargetEl(page, 'section2');

    expect(page.rootInstance.internalOpen).toBe(true);
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(target.style.display).toBe('block');
    expect(target.style.height).toBe('auto');

    expect(page.root).toMatchSnapshot();
  });

  it('toggles open/closed state on click', async () => {
    const page = await newSpecPage({
      components: [AccordionComponent],
      html: `<accordion-component target-id="section3"></accordion-component>`,
    });

    const instance = page.rootInstance as AccordionComponent;
    const button = page.root.querySelector('button-component');
    const target = getTargetEl(page, 'section3');

    await button.dispatchEvent(new CustomEvent('customClick'));
    await page.waitForChanges();
    expect(instance.internalOpen).toBe(true);
    expect(button.getAttribute('aria-expanded')).toBe('true');
    await fireTransitionEnd(target, page);
    expect(target.style.height).toBe('auto');
    expect(target.style.display).toBe('block');

    await button.dispatchEvent(new CustomEvent('customClick'));
    await page.waitForChanges();
    expect(instance.internalOpen).toBe(false);
    expect(button.getAttribute('aria-expanded')).toBe('false');
    await fireTransitionEnd(target, page);
    expect(target.style.display).toBe('none');
  });

  it('renders icon and switches when toggled', async () => {
    const page = await newSpecPage({
      components: [AccordionComponent],
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
    expect(icon.getAttribute('icon')).toContain('fa-chevron-down');

    const button = page.root.querySelector('button-component');
    const target = getTargetEl(page, 'accordion-test');

    button.dispatchEvent(new CustomEvent('customClick'));
    await page.waitForChanges();
    await fireTransitionEnd(target, page);

    const updatedIcon = page.root.querySelector('icon-component');
    expect(updatedIcon.getAttribute('icon')).toContain('fa-chevron-up');
  });

  it('toggles open/closed with keyboard (Enter and Space)', async () => {
    const page = await newSpecPage({
      components: [AccordionComponent],
      html: `<accordion-component target-id="section5"></accordion-component>`,
    });

    const instance = page.rootInstance as AccordionComponent;
    const button = page.root.querySelector('button-component');
    const target = getTargetEl(page, 'section5');

    await button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await page.waitForChanges();
    expect(instance.internalOpen).toBe(true);
    await fireTransitionEnd(target, page);

    await button.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    await page.waitForChanges();
    expect(instance.internalOpen).toBe(false);
    await fireTransitionEnd(target, page);
  });

  it('renders and toggles in link mode (anchor-like button)', async () => {
    const page = await newSpecPage({
      components: [AccordionComponent],
      html: `<accordion-component link target-id="link-section" variant="primary">
               <span slot="button-text">Open Link</span>
             </accordion-component>`,
    });

    const instance = page.rootInstance as AccordionComponent;
    const linkBtn = page.root.querySelector('button-component');
    const target = getTargetEl(page, 'link-section');

    expect(linkBtn.getAttribute('role')).toBe('button');
    expect(linkBtn.getAttribute('aria-expanded')).toBe('false');

    linkBtn.dispatchEvent(new CustomEvent('customClick'));
    await page.waitForChanges();
    expect(instance.internalOpen).toBe(true);
    expect(linkBtn.getAttribute('aria-expanded')).toBe('true');
    await fireTransitionEnd(target, page);

    await linkBtn.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    await page.waitForChanges();
    expect(instance.internalOpen).toBe(false);
    await fireTransitionEnd(target, page);
  });

  it('emits toggleEvent(boolean) with the new state', async () => {
    const page = await newSpecPage({
      components: [AccordionComponent],
      html: `<accordion-component target-id="emit-section"></accordion-component>`,
    });

    const spy = jest.fn();
    page.root.addEventListener('toggleEvent', (e: CustomEvent) => spy(e.detail));
    const btn = page.root.querySelector('button-component');

    await btn.dispatchEvent(new CustomEvent('customClick'));
    await page.waitForChanges();
    expect(spy).toHaveBeenLastCalledWith(true);

    await btn.dispatchEvent(new CustomEvent('customClick'));
    await page.waitForChanges();
    expect(spy).toHaveBeenLastCalledWith(false);
  });

  it('@Watch("isOpen"): updating host prop updates internalOpen and styles (no prop mutation on instance)', async () => {
    const page = await newSpecPage({
      components: [AccordionComponent],
      html: `<accordion-component target-id="watched"></accordion-component>`,
    });

    const instance = page.rootInstance as AccordionComponent;
    const btn = page.root.querySelector('button-component');
    const target = getTargetEl(page, 'watched');

    // Start closed
    expect(instance.internalOpen).toBe(false);
    expect(btn.getAttribute('aria-expanded')).toBe('false');

    // Open via host attribute/property (external change)
    page.root.setAttribute('is-open', 'true'); // OR: (page.root as any).isOpen = true;
    await page.waitForChanges();
    expect(instance.internalOpen).toBe(true);
    expect(btn.getAttribute('aria-expanded')).toBe('true');
    expect(target.style.display).toBe('block');
    expect(target.style.height).toBe('auto');

    // Close via host attribute/property
    page.root.setAttribute('is-open', 'false'); // OR: (page.root as any).isOpen = false;
    await page.waitForChanges();
    expect(instance.internalOpen).toBe(false);
    expect(btn.getAttribute('aria-expanded')).toBe('false');
    expect(target.style.display).toBe('none');
    expect(target.style.height).toBe('0px');
  });
});
