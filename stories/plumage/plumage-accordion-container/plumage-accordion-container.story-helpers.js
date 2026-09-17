// ============================================================================
// File: src/stories/plumage-accordion-container/plumage-accordion-container.story-helpers.js
// ============================================================================

const TAG = 'plumage-accordion-container';

export const setAttr = (element, name, value) => {
  if (value === true) {
    element.setAttribute(name, '');
    return;
  }

  if (value === false || value == null || value === '') {
    element.removeAttribute(name);
    return;
  }

  element.setAttribute(name, String(value));
};

export const uid = () => `${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;

export function buildPlumageAccordionContainer(args, baseId = 'plumage-accordion') {
  const element = document.createElement(TAG);

  const token = uid();

  const parentId = `${baseId}-${token}`;

  element.data = Array.isArray(args.data) ? args.data : [];

  setAttr(element, 'aria-label', args.ariaLabel);

  setAttr(element, 'aria-labelledby', args.ariaLabelledby);

  setAttr(element, 'parent-id', parentId);

  setAttr(element, 'flush', args.flush);

  setAttr(element, 'variant', args.variant);

  setAttr(element, 'size', args.size);

  setAttr(element, 'outlined', args.outlined);

  setAttr(element, 'block', args.block);

  setAttr(element, 'disabled', args.disabled);

  setAttr(element, 'ripple', args.ripple);

  setAttr(element, 'class-names', args.classNames);

  setAttr(element, 'content-txt-size', args.contentTxtSize);

  setAttr(element, 'icon', args.icon);

  setAttr(element, 'single-open', args.singleOpen);

  return element;
}
