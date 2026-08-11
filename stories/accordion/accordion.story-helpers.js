// stories/accordion/accordion.story-helpers.js
const TAG = 'accordion-component';

export function setAttr(el, name, value) {
  if (value === true) {
    el.setAttribute(name, '');
    return;
  }

  if (value === false || value == null || value === '') {
    el.removeAttribute(name);
    return;
  }

  el.setAttribute(name, String(value));
}

export function makeUniqueTargetId(base, context) {
  const normalizedBase =
    base && String(base).trim() ? String(base).trim() : 'acc';
  const scope = context?.viewMode || 'story';
  const randomSuffix = Math.random().toString(36).slice(2, 6);

  return `${normalizedBase}-${scope}-${context?.id || 'sb'}-${randomSuffix}`;
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

  const paragraphOne = document.createElement('p');
  paragraphOne.textContent = args.contentLine1;

  const paragraphTwo = document.createElement('p');
  paragraphTwo.textContent = args.contentLine2;

  content.append(paragraphOne, paragraphTwo);
  host.append(header, content);

  return host;
}
