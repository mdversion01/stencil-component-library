export const TAG = 'toasts-component';

export const normalize = (txt) => {
  const lines = String(txt ?? '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((l) => l.replace(/[ \t]+$/g, ''));

  const out = [];
  let prevBlank = false;

  for (const line of lines) {
    const blank = line.trim() === '';
    if (blank) {
      if (prevBlank) continue;
      out.push('');
      prevBlank = true;
      continue;
    }
    out.push(line);
    prevBlank = false;
  }

  while (out.length && out[0] === '') out.shift();
  while (out.length && out[out.length - 1] === '') out.pop();

  return out.join('\n');
};

export const uid = () => `${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;

export const makeIds = (baseMap, context) => {
  const base = (context?.id || 'sb').split('--').pop() || 'sb';
  const scope = context?.viewMode || 'story';
  const token = `${base}-${scope}-${uid()}`;

  const out = {};
  Object.keys(baseMap).forEach((k) => {
    out[k] = `${baseMap[k]}-${token}`;
  });

  return out;
};

export const setAttr = (el, name, value) => {
  if (!el) return;
  if (value === true) el.setAttribute(name, '');
  else if (value === false || value == null || value === '') el.removeAttribute(name);
  else el.setAttribute(name, String(value));
};

export const whenReady = async (el) => {
  try {
    await customElements.whenDefined(TAG);
    await el?.componentOnReady?.();
  } catch (_) {
    // no-op
  }
};

export const safeShowToast = async (el, opts) => {
  if (!el) return;
  await whenReady(el);

  try {
    await el.showToast(opts);
  } catch (e) {
    console.warn('[toasts-story] showToast failed:', e);
  }
};

export const safeClearToasts = async (el) => {
  if (!el) return;
  await whenReady(el);

  try {
    const ids = Array.from(el.querySelectorAll('[data-toast-id]'))
      .map((n) => Number(n.getAttribute('data-toast-id')))
      .filter((n) => Number.isFinite(n));

    await Promise.all(ids.map((id) => el.removeToast?.(id)));
  } catch (_) {
    // no-op
  }
};

export const docsCode = (html, js) => normalize(`${html}\n\n${js}`);

export const jsPreviewBlock = (lines) =>
  normalize(`
// JavaScript (autoplay for visual preview only)
${lines.join('\n')}
`);

const AUTOPLAY_STATE_KEY = '__plumage_toasts_autoplay_state__';

export const runOnArgsChange = (key, args, fn) => {
  window[AUTOPLAY_STATE_KEY] = window[AUTOPLAY_STATE_KEY] || {};
  const store = window[AUTOPLAY_STATE_KEY];

  const hash = JSON.stringify(args ?? {});
  if (store[key] === hash) return;

  store[key] = hash;
  requestAnimationFrame(() => fn());
};

export const truthyAttr = (name, value) => (value ? ` ${name}` : '');

export const valueAttr = (name, value) =>
  value == null || value === '' ? '' : ` ${name}="${String(value).replace(/"/g, '&quot;')}"`;

export const buildToastContent = (args) => {
  if (args.customContent && String(args.customContent).trim()) {
    return { contentHtml: String(args.customContent) };
  }

  if (args.message && String(args.message).trim()) {
    return { content: String(args.message) };
  }

  return { content: 'This is a default toast example!' };
};

export const buildToastOptions = (args) => {
  const content = buildToastContent(args);

  return {
    toastId: args.toastId || undefined,
    toastTitle: args.toastTitle || 'Title Text',
    ...content,
    additionalHdrContent: args.additionalHeaderContent || undefined,
    duration: Number.isFinite(args.duration) ? args.duration : 5000,
    svgIcon: args.svgIcon || undefined,
    time: args.time || undefined,
    persistent: !!args.persistent,
    noCloseButton: !!args.noCloseButton,
    iconPlumageStyle: !!args.iconPlumageStyle,
    isStatus: !!args.isStatus,
    headerClass: args.headerClass || undefined,
    bodyClass: args.bodyClass || undefined,
    variantClass: args.variant || '',
  };
};

export const buildPreviewToastOptions = (args) => ({
  ...buildToastOptions(args),
  persistent: true,
  duration: 2147483647,
});

export const applyHostProps = (host, args, overrides = {}) => {
  const a = { ...args, ...overrides };

  setAttr(host, 'position', a.position || '');
  setAttr(host, 'solid-toast', !!a.solidToast);
  setAttr(host, 'plumage-toast', !!a.plumageToast);
  setAttr(host, 'plumage-toast-max', !!a.plumageToastMax);
  setAttr(host, 'append-toast', !!a.appendToast);
  setAttr(host, 'no-animation', !!a.noAnimation);
  setAttr(host, 'no-hover-pause', !!a.noHoverPause);
  setAttr(host, 'aria-label', a.ariaLabel || 'Notifications');
  setAttr(host, 'focus-on-show', !!a.focusOnShow);
  setAttr(host, 'persistent', true);

  return a;
};

export const buildSingleToastDocsSource = (args, context, idKey, labelText) => {
  const ids = makeIds({ host: idKey }, context);
  const opts = buildPreviewToastOptions(args);

  const html = normalize(`
<div class="cwrapper">
  <section class="display-box-demo">
    <div style="margin-bottom: 8px; font-size: 0.75rem">${labelText}</div>
    <toasts-component
      id="${ids.host}"
      ${valueAttr('aria-label', args.ariaLabel || 'Notifications')}
      ${truthyAttr('focus-on-show', !!args.focusOnShow)}
      ${truthyAttr('persistent', true)}
      ${valueAttr('position', args.position || '')}
      ${truthyAttr('solid-toast', !!args.solidToast)}
      ${truthyAttr('plumage-toast', !!args.plumageToast)}
      ${truthyAttr('plumage-toast-max', !!args.plumageToastMax)}
      ${truthyAttr('append-toast', !!args.appendToast)}
      ${truthyAttr('no-animation', !!args.noAnimation)}
      ${truthyAttr('no-hover-pause', !!args.noHoverPause)}
    ></toasts-component>
  </section>
</div>
  `);

  const js = jsPreviewBlock([
    `const t = document.getElementById('${ids.host}');`,
    `t && t.showToast(${JSON.stringify(opts, null, 2)});`,
  ]);

  return docsCode(html, js);
};

export const splitIds = (v) => String(v || '').trim().split(/\s+/).filter(Boolean);
