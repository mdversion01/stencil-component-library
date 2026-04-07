// File: src/stories/badge-component/badge-component.story-helpers.js

export const setAttr = (el, name, value) => {
  if (value === true) el.setAttribute(name, '');
  else if (value === false || value == null || value === '') el.removeAttribute(name);
  else el.setAttribute(name, String(value));
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
<badge-component
  ${attrLines([
    ['id', args.id],
    ['aria-label', args.ariaLabel],
    ['aria-labelledby', args.ariaLabelledby],
    ['aria-describedby', args.ariaDescribedby],
    ['badge-id', args.badgeId],
    ['variant', args.variant],
    ['size', args.size],
    ['shape', args.shape],
    ['class-names', args.classNames],
    ['bdg-position', args.bdgPosition],
    ['elevation', args.elevation],
    ['background-color', args.backgroundColor],
    ['color', args.color],
    ['inline-styles', args.inlineStyles],
    ['styles', args.styles],
    ['left', args.left],
    ['right', args.right],
    ['top', args.top],
    ['bottom', args.bottom],
    ['offset-x', args.offsetX],
    ['offset-y', args.offsetY],
    ['z-index', args.zIndex],
    ['absolute', args.absolute],
    ['disabled', args.disabled],
    ['outlined', args.outlined],
    ['bordered', args.bordered],
    ['pulse', args.pulse],
    ['inset', args.inset],
    ['icon', args.icon],
    ['token', args.token],
    ['dot', args.dot],
    ['dev-mode', args.devMode],
  ])}
>
  ${args.useButtonComponentChild
    ? `<button-component
    type="${args.buttonType || 'button'}"
    variant="${args.buttonVariant || 'secondary'}"${args.buttonOutlined ? '\n    outlined' : ''}\n    size="${args.buttonSize || 'sm'}"
  >${args.buttonText || 'Action'}</button-component>`
    : args.text || 'Badge'}
  ${
    args.icon
      ? args.iconMode === 'icon-component' && args.iconName
        ? `\n  <span slot="icon"><icon-component icon="${args.iconName}"></icon-component></span>`
        : args.iconClass
          ? `\n  <span slot="icon"><i class="${args.iconClass}"></i></span>`
          : ''
      : ''
  }
  ${
    args.token
      ? args.tokenIconMode === 'icon-component' && args.tokenIconName
        ? `\n  <span slot="token"><icon-component icon="${args.tokenIconName}"></icon-component></span>`
        : args.tokenIconClass
          ? `\n  <span slot="token"><i class="${args.tokenIconClass}"></i></span>`
          : ''
      : ''
  }
</badge-component>
`);

export const buildDocsHtmlMany = (snippets) =>
  normalize(`
<div style="display:grid; gap:14px;">
${snippets.map((s) => `  ${String(s).replace(/\n/g, '\n  ')}`).join('\n')}
</div>
`);

export const renderBadge = (args) => {
  const el = document.createElement('badge-component');

  setAttr(el, 'id', args.id);
  setAttr(el, 'aria-label', args.ariaLabel);
  setAttr(el, 'badge-id', args.badgeId);
  setAttr(el, 'label', args.label);
  setAttr(el, 'variant', args.variant);
  setAttr(el, 'size', args.size);
  setAttr(el, 'shape', args.shape);
  setAttr(el, 'class-names', args.classNames);
  setAttr(el, 'bdg-position', args.bdgPosition);
  setAttr(el, 'elevation', args.elevation);
  setAttr(el, 'background-color', args.backgroundColor);
  setAttr(el, 'color', args.color);
  setAttr(el, 'inline-styles', args.inlineStyles);
  setAttr(el, 'styles', args.styles);
  setAttr(el, 'left', args.left);
  setAttr(el, 'right', args.right);
  setAttr(el, 'top', args.top);
  setAttr(el, 'bottom', args.bottom);
  setAttr(el, 'offset-x', args.offsetX);
  setAttr(el, 'offset-y', args.offsetY);
  setAttr(el, 'z-index', args.zIndex);
  setAttr(el, 'aria-labelledby', args.ariaLabelledby);
  setAttr(el, 'aria-describedby', args.ariaDescribedby);

  setAttr(el, 'absolute', args.absolute);
  setAttr(el, 'disabled', args.disabled);
  setAttr(el, 'outlined', args.outlined);
  setAttr(el, 'bordered', args.bordered);
  setAttr(el, 'pulse', args.pulse);
  setAttr(el, 'inset', args.inset);
  setAttr(el, 'icon', args.icon);
  setAttr(el, 'token', args.token);
  setAttr(el, 'dot', args.dot);
  setAttr(el, 'dev-mode', args.devMode);

  if (args.useButtonComponentChild) {
    const btnc = document.createElement('button-component');
    setAttr(btnc, 'type', args.buttonType || 'button');
    setAttr(btnc, 'variant', args.buttonVariant || 'secondary');
    setAttr(btnc, 'outlined', !!args.buttonOutlined);
    setAttr(btnc, 'size', args.buttonSize || 'sm');
    btnc.textContent = args.buttonText || 'Action';
    el.appendChild(btnc);
  } else if (args.text) {
    el.appendChild(document.createTextNode(args.text));
  }

  if (args.icon) {
    const iconHost = document.createElement('span');
    iconHost.setAttribute('slot', 'icon');

    if (args.iconMode === 'icon-component' && args.iconName) {
      iconHost.innerHTML = `<icon-component icon="${args.iconName}"></icon-component>`;
    } else if (args.iconClass) {
      iconHost.innerHTML = `<i class="${args.iconClass}"></i>`;
    }

    el.appendChild(iconHost);
  }

  if (args.token) {
    const tokenIcon = document.createElement('span');
    tokenIcon.setAttribute('slot', 'token');

    if (args.tokenIconMode === 'icon-component' && args.tokenIconName) {
      tokenIcon.innerHTML = `<icon-component icon="${args.tokenIconName}"></icon-component>`;
      el.appendChild(tokenIcon);
    } else if (args.tokenIconClass) {
      tokenIcon.innerHTML = `<i class="${args.tokenIconClass}"></i>`;
      el.appendChild(tokenIcon);
    }
  }

  el.addEventListener('customClick', (e) => {
    console.log('[badge-component] customClick', e?.detail);
  });

  return el;
};
