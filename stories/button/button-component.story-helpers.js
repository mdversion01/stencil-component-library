// File: src/stories/button-component/button-component.story-helpers.js

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
<button-component
  ${attrLines([
    ['aria-label', args.ariaLabel],
    ['aria-labelledby', args.ariaLabelledby],
    ['aria-describedby', args.ariaDescribedby],
    ['role', args.role],
    ['tabindex', args.tabindex],
    ['type', args.type],
    ['btn-text', args.btnText],
    ['class-names', args.classNames],
    ['elevation', args.elevation],
    ['left', args.left],
    ['right', args.right],
    ['top', args.top],
    ['bottom', args.bottom],
    ['size', args.size],
    ['shape', args.shape],
    ['styles', args.styles],
    ['title-attr', args.titleAttr],
    ['url', args.url],
    ['variant', args.variant],
    ['z-index', args.zIndex],
    ['slot-side', args.slotSide],
    ['accordion', args.accordion],
    ['is-open', args.isOpen],
    ['target-id', args.targetId],
    ['allow-focusable-children', args.allowFocusableChildren],
    ['absolute', args.absolute],
    ['active', args.active],
    ['block', args.block],
    ['btn-icon', args.btnIcon],
    ['disabled', args.disabled],
    ['end', args.end],
    ['fixed', args.fixed],
    ['group-btn', args.groupBtn],
    ['icon-btn', args.iconBtn],
    ['link', args.link],
    ['outlined', args.outlined],
    ['ripple', args.ripple],
    ['start', args.start],
    ['stripped', args.stripped],
    ['text', args.text],
    ['text-btn', args.textBtn],
    ['vertical', args.vertical],
    ['dev-mode', args.devMode],
    ['toggle', args.toggle],
    ['pressed', args.toggle ? args.pressed : false],
  ])}
>
  ${
    args.btnIcon || args.iconBtn
      ? args.iconHtml || '<i class="fa-solid fa-star"></i>'
      : args.slotSide && args.slotSide !== 'none' && args.sideIconHtml
        ? `${args.sideIconHtml}\n  `
        : ''
  }
</button-component>
`);

export const buildDocsHtmlMany = (snippets) =>
  normalize(`
<div style="display:grid; gap:14px;">
${snippets.map((s) => `  ${String(s).replace(/\n/g, '\n  ')}`).join('\n')}
</div>
`);

export const renderButton = (args) => {
  const el = document.createElement('button-component');

  setAttr(el, 'aria-label', args.ariaLabel);
  setAttr(el, 'aria-labelledby', args.ariaLabelledby);
  setAttr(el, 'aria-describedby', args.ariaDescribedby);
  setAttr(el, 'role', args.role);
  setAttr(el, 'tabindex', args.tabindex);

  setAttr(el, 'type', args.type);

  setAttr(el, 'btn-text', args.btnText);
  setAttr(el, 'class-names', args.classNames);
  setAttr(el, 'elevation', args.elevation);
  setAttr(el, 'left', args.left);
  setAttr(el, 'right', args.right);
  setAttr(el, 'top', args.top);
  setAttr(el, 'bottom', args.bottom);
  setAttr(el, 'size', args.size);
  setAttr(el, 'shape', args.shape);
  setAttr(el, 'styles', args.styles);
  setAttr(el, 'title-attr', args.titleAttr);
  setAttr(el, 'url', args.url);
  setAttr(el, 'variant', args.variant);
  setAttr(el, 'z-index', args.zIndex);
  setAttr(el, 'slot-side', args.slotSide);

  setAttr(el, 'accordion', args.accordion);
  setAttr(el, 'is-open', args.isOpen);
  setAttr(el, 'target-id', args.targetId);

  setAttr(el, 'allow-focusable-children', args.allowFocusableChildren);

  setAttr(el, 'absolute', args.absolute);
  setAttr(el, 'active', args.active);
  setAttr(el, 'block', args.block);
  setAttr(el, 'btn-icon', args.btnIcon);
  setAttr(el, 'disabled', args.disabled);
  setAttr(el, 'end', args.end);
  setAttr(el, 'fixed', args.fixed);
  setAttr(el, 'group-btn', args.groupBtn);
  setAttr(el, 'icon-btn', args.iconBtn);
  setAttr(el, 'link', args.link);
  setAttr(el, 'outlined', args.outlined);
  setAttr(el, 'ripple', args.ripple);
  setAttr(el, 'start', args.start);
  setAttr(el, 'stripped', args.stripped);
  setAttr(el, 'text', args.text);
  setAttr(el, 'text-btn', args.textBtn);
  setAttr(el, 'vertical', args.vertical);
  setAttr(el, 'dev-mode', args.devMode);

  setAttr(el, 'toggle', args.toggle);
  if (args.toggle) setAttr(el, 'pressed', args.pressed);
  else el.removeAttribute('pressed');

  if (args.iconHtml && (args.btnIcon || args.iconBtn)) {
    const icon = document.createElement('span');
    icon.innerHTML = args.iconHtml;
    el.appendChild(icon);
  }

  if (args.slotSide && args.slotSide !== 'none' && args.sideIconHtml) {
    const side = document.createElement('span');
    side.innerHTML = args.sideIconHtml;
    el.appendChild(side);
  }

  el.addEventListener('customClick', () => {
    console.log('[button-component] customClick');
  });

  el.addEventListener('pressedChange', (e) => {
    console.log('[button-component] pressedChange', e.detail);
  });

  return el;
};
