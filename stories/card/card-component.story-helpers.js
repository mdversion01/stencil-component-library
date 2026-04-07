// File: src/stories/card-component/card-component.story-helpers.js

import { action } from '@storybook/addon-actions';

export const DocsWrapStyles = () => {
  const style = document.createElement('style');
  style.innerHTML = `
    .sbdocs pre,
    .sbdocs pre code {
      white-space: pre-wrap !important;
      word-break: break-word !important;
      overflow-x: auto !important;
    }
  `;
  return style;
};

export const normalize = (txt) => {
  const lines = String(txt || '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((l) => l.replace(/[ \t]+$/g, ''));

  const out = [];
  let prevBlank = false;

  for (const line of lines) {
    const blank = line.trim() === '';
    if (blank) {
      if (prevBlank) continue;
      prevBlank = true;
      out.push('');
      continue;
    }
    prevBlank = false;
    out.push(line);
  }

  while (out[0] === '') out.shift();
  while (out[out.length - 1] === '') out.pop();

  return out.join('\n');
};

export const attrLines = (pairs) =>
  pairs
    .filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== false)
    .map(([k, v]) => (v === true ? `${k}` : `${k}="${String(v).replace(/"/g, '&quot;')}"`))
    .join('\n  ');

export const buildDocsHtml = (args) =>
  normalize(`
<card-component
  ${attrLines([
    ['aria-label', args.ariaLabel],
    ['aria-labelledby', args.ariaLabelledby],
    ['aria-describedby', args.ariaDescribedby],
    ['landmark', args.landmark],
    ['heading-level', args.headingLevel],
    ['clickable', args.clickable],
    ['disabled', args.disabled],
    ['actions', args.actions],
    ['img', args.img],
    ['no-footer', args.noFooter],
    ['no-header', args.noHeader],
    ['card-max-width', args.cardMaxWidth],
    ['class-names', args.classNames],
    ['elevation', args.elevation],
    ['inline-styles', args.inlineStyles],
    ['img-src', args.imgSrc],
    ['img-height', args.imgHeight],
    ['alt-text', args.altText],
    ['decorative-image', args.decorativeImage],
  ])}
>
  ${args.noHeader ? '' : `<div slot="header">${args.slotHeader}</div>`}
  <span slot="title">${args.slotTitle}</span>
  <span slot="text">${args.slotText}</span>
  ${args.actions ? `<span slot="actions">${args.slotActions}</span>` : ''}
  ${args.noFooter ? '' : `<div slot="footer"><p>${args.slotFooter}</p></div>`}
</card-component>
`);

export const wrapDocsHtml = (innerHtml) =>
  normalize(`
<div style="max-width:680px;">
  ${String(innerHtml).replace(/\n/g, '\n  ')}
</div>
`);

export const setAttr = (el, name, value) => {
  const isEmpty =
    value === false ||
    value === null ||
    value === undefined ||
    (typeof value === 'string' && value.trim() === '');

  if (isEmpty) el.removeAttribute(name);
  else if (value === true) el.setAttribute(name, '');
  else el.setAttribute(name, String(value));
};

export const renderCard = (args) => {
  const el = document.createElement('card-component');

  el.actions = !!args.actions;
  el.img = !!args.img;
  el.noFooter = !!args.noFooter;
  el.noHeader = !!args.noHeader;

  el.clickable = !!args.clickable;
  el.disabled = !!args.disabled;
  el.landmark = !!args.landmark;
  el.headingLevel = Number(args.headingLevel) || 5;
  el.decorativeImage = !!args.decorativeImage;

  if (args.ariaLabel) el.ariaLabel = args.ariaLabel;
  if (args.ariaLabelledby) el.ariaLabelledby = args.ariaLabelledby;
  if (args.ariaDescribedby) el.ariaDescribedby = args.ariaDescribedby;

  if (args.classNames) el.classNames = args.classNames;
  if (args.elevation) el.elevation = args.elevation;
  if (args.inlineStyles) el.inlineStyles = args.inlineStyles;
  if (args.cardMaxWidth) el.cardMaxWidth = args.cardMaxWidth;

  if (args.img) {
    if (args.altText) el.altText = args.altText;
    if (args.imgSrc) el.imgSrc = args.imgSrc;
    if (args.imgHeight) el.imgHeight = args.imgHeight;
  }

  setAttr(el, 'actions', !!args.actions);
  setAttr(el, 'img', !!args.img);
  setAttr(el, 'no-footer', !!args.noFooter);
  setAttr(el, 'no-header', !!args.noHeader);

  setAttr(el, 'clickable', !!args.clickable);
  setAttr(el, 'disabled', !!args.disabled);
  setAttr(el, 'landmark', !!args.landmark);
  setAttr(el, 'heading-level', args.headingLevel);
  setAttr(el, 'decorative-image', !!args.decorativeImage);

  setAttr(el, 'aria-label', args.ariaLabel);
  setAttr(el, 'aria-labelledby', args.ariaLabelledby);
  setAttr(el, 'aria-describedby', args.ariaDescribedby);

  setAttr(el, 'class-names', args.classNames);
  setAttr(el, 'elevation', args.elevation);
  setAttr(el, 'inline-styles', args.inlineStyles);
  setAttr(el, 'card-max-width', args.cardMaxWidth);

  if (args.img) {
    setAttr(el, 'alt-text', args.altText);
    setAttr(el, 'img-src', args.imgSrc);
    setAttr(el, 'img-height', args.imgHeight);
  } else {
    el.removeAttribute('alt-text');
    el.removeAttribute('img-src');
    el.removeAttribute('img-height');
  }

  el.innerHTML = `
    ${args.noHeader ? '' : `<div slot="header">${args.slotHeader}</div>`}
    <span slot="title">${args.slotTitle}</span>
    <span slot="text">${args.slotText}</span>
    ${args.actions ? `<span slot="actions">${args.slotActions}</span>` : ''}
    ${args.noFooter ? '' : `<div slot="footer"><p>${args.slotFooter}</p></div>`}
  `;

  el.addEventListener('customClick', action('customClick'));

  return el;
};
