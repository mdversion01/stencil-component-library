// File: src/stories/accordion/accordion.story-helpers.js
const TAG = 'accordion-component';

export function setAttr(el, name, v) {
  if (v === true) el.setAttribute(name, '');
  else if (v === false || v == null || v === '') el.removeAttribute(name);
  else el.setAttribute(name, String(v));
}

export function makeUniqueTargetId(base, context) {
  const b = base && String(base).trim() ? base.trim() : 'acc';
  const scope = context?.viewMode || 'story';
  const rnd = Math.random().toString(36).slice(2, 6);
  return `${b}-${scope}-${context?.id || 'sb'}-${rnd}`;
}

export function buildAccordion(args, context) {
  const host = document.createElement(TAG);
  const uniqueTargetId = makeUniqueTargetId(args.targetId, context);

  setAttr(host, 'accordion', args.accordion);
  setAttr(host, 'content-txt-size', args.contentTxtSize);
  setAttr(host, 'target-id', uniqueTargetId);
  setAttr(host, 'class-names', args.classNames);
  setAttr(host, 'flush', args.flush);
  setAttr(host, 'outlined', args.outlined);
  setAttr(host, 'block', args.block);
  setAttr(host, 'variant', args.variant);
  setAttr(host, 'size', args.size);
  setAttr(host, 'disabled', args.disabled);
  setAttr(host, 'ripple', args.ripple);
  setAttr(host, 'link', args.link);
  setAttr(host, 'icon', args.icon);
  setAttr(host, 'is-open', args.isOpen);
  setAttr(host, 'region-labelledby', args.regionLabelledby);

  const header = document.createElement('span');
  header.slot = args.accordion ? 'accordion-header' : 'button-text';
  header.textContent = args.headerText;

  const content = document.createElement('div');
  content.slot = 'content';

  const p1 = document.createElement('p');
  p1.textContent = args.contentLine1;

  const p2 = document.createElement('p');
  p2.textContent = args.contentLine2;

  content.append(p1, p2);
  host.append(header, content);

  return host;
}
