// File: src/stories/accordion-container/accordion-container.story-helpers.js

const TAG = 'accordion-container';

export const setAttr = (el, name, v) => {
  if (v === true) el.setAttribute(name, '');
  else if (v === false || v == null || v === '') el.removeAttribute(name);
  else el.setAttribute(name, String(v));
};

export const uid = () => Math.random().toString(36).slice(2, 8) + '-' + Date.now().toString(36);

export function buildContainer(args, baseId = 'acc') {
  const el = document.createElement(TAG);
  const token = uid();
  const parentId = `${baseId}-${token}`;

  el.data = Array.isArray(args.data) ? args.data : [];

  setAttr(el, 'aria-label', args.ariaLabel);
  setAttr(el, 'aria-labelledby', args.ariaLabelledby);

  setAttr(el, 'parent-id', parentId);
  setAttr(el, 'flush', args.flush);
  setAttr(el, 'variant', args.variant);
  setAttr(el, 'size', args.size);
  setAttr(el, 'outlined', args.outlined);
  setAttr(el, 'block', args.block);
  setAttr(el, 'disabled', args.disabled);
  setAttr(el, 'ripple', args.ripple);
  setAttr(el, 'class-names', args.classNames);
  setAttr(el, 'content-txt-size', args.contentTxtSize);
  setAttr(el, 'icon', args.icon);
  setAttr(el, 'single-open', args.singleOpen);

  return el;
}
