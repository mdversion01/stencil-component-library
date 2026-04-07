// File: src/stories/button-group/button-group.story-helpers.js

export const setAttr = (el, name, v) => {
  if (v === true) el.setAttribute(name, '');
  else if (v === false || v == null || v === '') el.removeAttribute(name);
  else el.setAttribute(name, String(v));
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

export const buildDocsHtml = (args) => {
  const groupAttrs = attrLines([
    ['vertical', args.vertical],
    ['disabled', args.disabled],
    ['class-names', args.classNames],
    ['aria-label', args.ariaLabelledby ? '' : args.ariaLabel],
    ['aria-labelledby', args.ariaLabelledby],
    ['aria-describedby', args.ariaDescribedby],
  ]);

  const labelBlock = args.ariaLabelledby
    ? `<div id="${args.ariaLabelledby}">External group label</div>\n`
    : '';

  const descBlock = args.ariaDescribedby
    ? `<div id="${args.ariaDescribedby}">Helper text for the group.</div>\n`
    : '';

  return normalize(`
${labelBlock}${descBlock}<button-group
  ${groupAttrs}
>
  <button-component
    title-attr="Go Ahead"
    start
    size="sm"
    variant="active-blue"
    active
    group-btn
    btn-text="Default Button"${args.vertical ? '\n    vertical' : ''}${args.disabled ? '\n    disabled' : ''}
  ></button-component>

  <button-component
    title-attr="Go Ahead"
    variant="active-blue"
    size="sm"
    group-btn
    btn-text="Default Button"${args.vertical ? '\n    vertical' : ''}${args.disabled ? '\n    disabled' : ''}
  ></button-component>

  <button-component
    title-attr="Go Ahead"
    variant="active-blue"
    size="sm"
    group-btn
    end
    btn-text="Default This Button"${args.vertical ? '\n    vertical' : ''}${args.disabled || args.showDisabledChild ? '\n    disabled' : ''}
  ></button-component>
</button-group>
`);
};

export const buildDocsHtmlMany = (snippets) =>
  normalize(`
<div style="display:grid; gap:14px;">
${snippets.map((s) => `  ${String(s).replace(/\n/g, '\n  ')}`).join('\n')}
</div>
`);

export const applyChildGroupState = (btn, args) => {
  setAttr(btn, 'vertical', args.vertical);
  if (args.disabled) setAttr(btn, 'disabled', true);
};

export const createDemoButtons = (args) => {
  const b1 = document.createElement('button-component');
  setAttr(b1, 'title-attr', 'Go Ahead');
  setAttr(b1, 'start', true);
  setAttr(b1, 'size', 'sm');
  setAttr(b1, 'variant', 'active-blue');
  setAttr(b1, 'active', true);
  setAttr(b1, 'group-btn', true);
  setAttr(b1, 'btn-text', 'Default Button');
  applyChildGroupState(b1, args);

  const b2 = document.createElement('button-component');
  setAttr(b2, 'title-attr', 'Go Ahead');
  setAttr(b2, 'variant', 'active-blue');
  setAttr(b2, 'size', 'sm');
  setAttr(b2, 'group-btn', true);
  setAttr(b2, 'btn-text', 'Default Button');
  applyChildGroupState(b2, args);

  const b3 = document.createElement('button-component');
  setAttr(b3, 'title-attr', 'Go Ahead');
  setAttr(b3, 'variant', 'active-blue');
  setAttr(b3, 'size', 'sm');
  setAttr(b3, 'group-btn', true);
  setAttr(b3, 'end', true);
  setAttr(b3, 'btn-text', 'Default This Button');

  if (!args.disabled && args.showDisabledChild) setAttr(b3, 'disabled', true);
  applyChildGroupState(b3, args);

  return [b1, b2, b3];
};

export const renderButtonGroup = (args) => {
  const el = document.createElement('button-group');

  setAttr(el, 'vertical', args.vertical);
  setAttr(el, 'disabled', args.disabled);
  setAttr(el, 'class-names', args.classNames);

  if (args.ariaLabelledby) {
    setAttr(el, 'aria-labelledby', args.ariaLabelledby);
    el.removeAttribute('aria-label');
  } else if (args.ariaLabel) {
    setAttr(el, 'aria-label', args.ariaLabel);
    el.removeAttribute('aria-labelledby');
  } else {
    el.removeAttribute('aria-label');
    el.removeAttribute('aria-labelledby');
  }

  setAttr(el, 'aria-describedby', args.ariaDescribedby);

  const [b1, b2, b3] = createDemoButtons(args);
  el.append(b1, b2, b3);

  const wrap = document.createElement('div');
  wrap.style.display = 'grid';
  wrap.style.gap = '12px';
  wrap.style.padding = '16px';

  if (args.ariaLabelledby) {
    const label = document.createElement('div');
    label.id = args.ariaLabelledby;
    label.textContent = 'External group label';
    label.style.fontWeight = '600';
    wrap.appendChild(label);
  }

  if (args.ariaDescribedby) {
    const desc = document.createElement('div');
    desc.id = args.ariaDescribedby;
    desc.textContent = 'Helper text for the group.';
    desc.style.opacity = '0.85';
    wrap.appendChild(desc);
  }

  wrap.appendChild(el);
  return wrap;
};
