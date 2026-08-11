// File: stories/card/card-component.story-helpers.js

import { action } from 'storybook/actions';

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

export const normalize = (text) => {
  const lines = String(text || '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.replace(/[ \t]+$/g, ''));

  const output = [];
  let previousLineWasBlank = false;

  for (const line of lines) {
    const isBlank = line.trim() === '';

    if (isBlank) {
      if (previousLineWasBlank) {
        continue;
      }

      previousLineWasBlank = true;
      output.push('');
      continue;
    }

    previousLineWasBlank = false;
    output.push(line);
  }

  while (output[0] === '') {
    output.shift();
  }

  while (output[output.length - 1] === '') {
    output.pop();
  }

  return output.join('\n');
};

export const attrLines = (pairs) =>
  pairs
    .filter(
      ([, value]) =>
        value !== undefined &&
        value !== null &&
        value !== '' &&
        value !== false,
    )
    .map(([key, value]) =>
      value === true
        ? key
        : `${key}="${String(value).replace(/"/g, '&quot;')}"`,
    )
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

export const setAttr = (element, name, value) => {
  const isEmpty =
    value === false ||
    value === null ||
    value === undefined ||
    (typeof value === 'string' && value.trim() === '');

  if (isEmpty) {
    element.removeAttribute(name);
    return;
  }

  if (value === true) {
    element.setAttribute(name, '');
    return;
  }

  element.setAttribute(name, String(value));
};

export const renderCard = (args) => {
  const element = document.createElement('card-component');

  element.actions = Boolean(args.actions);
  element.img = Boolean(args.img);
  element.noFooter = Boolean(args.noFooter);
  element.noHeader = Boolean(args.noHeader);
  element.clickable = Boolean(args.clickable);
  element.disabled = Boolean(args.disabled);
  element.landmark = Boolean(args.landmark);
  element.headingLevel = Number(args.headingLevel) || 5;
  element.decorativeImage = Boolean(args.decorativeImage);

  if (args.ariaLabel) {
    element.ariaLabel = args.ariaLabel;
  }

  if (args.ariaLabelledby) {
    element.ariaLabelledby = args.ariaLabelledby;
  }

  if (args.ariaDescribedby) {
    element.ariaDescribedby = args.ariaDescribedby;
  }

  if (args.classNames) {
    element.classNames = args.classNames;
  }

  if (args.elevation) {
    element.elevation = args.elevation;
  }

  if (args.inlineStyles) {
    element.inlineStyles = args.inlineStyles;
  }

  if (args.cardMaxWidth) {
    element.cardMaxWidth = args.cardMaxWidth;
  }

  if (args.img) {
    if (args.altText) {
      element.altText = args.altText;
    }

    if (args.imgSrc) {
      element.imgSrc = args.imgSrc;
    }

    if (args.imgHeight) {
      element.imgHeight = args.imgHeight;
    }
  }

  setAttr(element, 'actions', Boolean(args.actions));
  setAttr(element, 'img', Boolean(args.img));
  setAttr(element, 'no-footer', Boolean(args.noFooter));
  setAttr(element, 'no-header', Boolean(args.noHeader));
  setAttr(element, 'clickable', Boolean(args.clickable));
  setAttr(element, 'disabled', Boolean(args.disabled));
  setAttr(element, 'landmark', Boolean(args.landmark));
  setAttr(element, 'heading-level', args.headingLevel);
  setAttr(element, 'decorative-image', Boolean(args.decorativeImage));
  setAttr(element, 'aria-label', args.ariaLabel);
  setAttr(element, 'aria-labelledby', args.ariaLabelledby);
  setAttr(element, 'aria-describedby', args.ariaDescribedby);
  setAttr(element, 'class-names', args.classNames);
  setAttr(element, 'elevation', args.elevation);
  setAttr(element, 'inline-styles', args.inlineStyles);
  setAttr(element, 'card-max-width', args.cardMaxWidth);

  if (args.img) {
    setAttr(element, 'alt-text', args.altText);
    setAttr(element, 'img-src', args.imgSrc);
    setAttr(element, 'img-height', args.imgHeight);
  } else {
    element.removeAttribute('alt-text');
    element.removeAttribute('img-src');
    element.removeAttribute('img-height');
  }

  element.innerHTML = `
    ${args.noHeader ? '' : `<div slot="header">${args.slotHeader}</div>`}
    <span slot="title">${args.slotTitle}</span>
    <span slot="text">${args.slotText}</span>
    ${args.actions ? `<span slot="actions">${args.slotActions}</span>` : ''}
    ${args.noFooter ? '' : `<div slot="footer"><p>${args.slotFooter}</p></div>`}
  `;

  element.addEventListener('customClick', action('customClick'));

  return element;
};
