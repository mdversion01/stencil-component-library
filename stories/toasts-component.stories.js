// stories/toasts-component.stories.js
import DocsPage from './toasts-component.docs.mdx';

const TAG = 'toasts-component';

/* -----------------------------
 Helpers
------------------------------ */

const normalize = (txt) => {
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

const uid = () => `${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;

const makeIds = (baseMap, context) => {
  const base = (context?.id || 'sb').split('--').pop() || 'sb';
  const scope = context?.viewMode || 'story';
  const token = `${base}-${scope}-${uid()}`;

  const out = {};
  Object.keys(baseMap).forEach((k) => (out[k] = `${baseMap[k]}-${token}`));
  return out;
};

const setAttr = (el, name, value) => {
  if (value === true) el.setAttribute(name, '');
  else if (value === false || value == null || value === '') el.removeAttribute(name);
  else el.setAttribute(name, String(value));
};

const whenReady = async (el) => {
  try {
    await customElements.whenDefined(TAG);
    await el?.componentOnReady?.();
  } catch (_) {
    // no-op
  }
};

const safeShowToast = async (el, opts) => {
  if (!el) return;
  await whenReady(el);
  try {
    await el.showToast(opts);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[toasts-story] showToast failed:', e);
  }
};

/* -----------------------------
 Docs helpers (DISPLAY code only)
------------------------------ */

const docsCode = (html, js) => normalize(`${html}\n\n${js}`);

const jsPreviewBlock = (lines) =>
  normalize(`
// JavaScript (autoplay for visual preview only)
${lines.join('\n')}
`);

/* -----------------------------
 Autoplay: re-run ONLY when args change (per story instance)
------------------------------ */

const AUTOPLAY_STATE_KEY = '__plumage_toasts_autoplay_state__';

const runOnArgsChange = (key, args, fn) => {
  window[AUTOPLAY_STATE_KEY] = window[AUTOPLAY_STATE_KEY] || {};
  const store = window[AUTOPLAY_STATE_KEY];

  const hash = JSON.stringify(args ?? {});
  if (store[key] === hash) return;

  store[key] = hash;
  requestAnimationFrame(() => fn());
};

/* -----------------------------
 Docs/source helpers from args
------------------------------ */

const truthyAttr = (name, value) => (value ? ` ${name}` : '');

const valueAttr = (name, value) =>
  value == null || value === '' ? '' : ` ${name}="${String(value).replace(/"/g, '&quot;')}"`;

const buildToastContent = (args) => {
  if (args.customContent && String(args.customContent).trim()) {
    return { contentHtml: String(args.customContent) };
  }
  if (args.message && String(args.message).trim()) {
    return { content: String(args.message) };
  }
  return { content: 'This is a default toast example!' };
};

const buildToastOptions = (args) => {
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

    // Component API uses variantClass
    variantClass: args.variant || '',
  };
};

const applyHostProps = (host, args, overrides = {}) => {
  const a = { ...args, ...overrides };

  setAttr(host, 'position', a.position || '');
  setAttr(host, 'solid-toast', !!a.solidToast);
  setAttr(host, 'plumage-toast', !!a.plumageToast);
  setAttr(host, 'plumage-toast-max', !!a.plumageToastMax);
  setAttr(host, 'append-toast', !!a.appendToast);
  setAttr(host, 'no-animation', !!a.noAnimation);
  setAttr(host, 'no-hover-pause', !!a.noHoverPause);

  return a;
};

/* -----------------------------
 Storybook meta
------------------------------ */

export default {
  title: 'Components/Toasts',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      page: DocsPage,
      description: {
        component:
          'Visual styling previews for `<toasts-component>`. Stories are controls-driven. A small autoplay runs to render example toasts so you can see styles; it re-runs when controls change.',
      },
    },
  },

  argTypes: {
    additionalHeaderContent: {
      control: 'text',
      name: 'additional-header-content',
      table: { category: 'Toast Options' },
      description:
        'Optional header content (string/HTML) appearing next to the title, such as timestamps or status indicators.',
    },
    bodyClass: {
      control: 'text',
      name: 'body-class',
      table: { category: 'Toast Options' },
      description: 'Additional CSS class(es) to apply to the toast body for custom styling.',
    },
    customContent: {
      control: 'text',
      name: 'custom-content',
      table: { category: 'Toast Options' },
      description: 'Optional custom HTML content for the body. Prefer using slots in apps.',
    },
    duration: {
      control: 'number',
      table: { category: 'Toast Options', defaultValue: { summary: 5000 } },
      description: 'Duration in milliseconds before the toast automatically dismisses. Default is 5000.',
    },
    headerClass: {
      control: 'text',
      name: 'header-class',
      table: { category: 'Toast Options' },
      description: 'Additional CSS class(es) to apply to the toast header for custom styling.',
    },
    iconPlumageStyle: {
      control: 'boolean',
      name: 'icon-plumage-style',
      table: { category: 'Toast Options', defaultValue: { summary: false } },
      description: 'When true, applies Plumage styling to the toast icon (if an SVG icon is used).',
    },
    isStatus: {
      control: 'boolean',
      name: 'is-status',
      table: { category: 'Toast Options', defaultValue: { summary: false } },
      description: 'When true, the toast is announced as a status update (aria-live="polite").',
    },
    position: {
      control: 'select',
      options: ['', 'top-left', 'top-right', 'bottom-left', 'bottom-right'],
      table: { category: 'Component Props' },
      description: 'Position of the toast container on the screen.',
    },
    solidToast: {
      control: 'boolean',
      name: 'solid-toast',
      table: { category: 'Component Props', defaultValue: { summary: false } },
      description: 'Enable solid background styling for toasts.',
    },
    message: {
      control: 'text',
      name: 'message',
      table: { category: 'Toast Options' },
      description: 'Optional simple message (plain text). If set, it will be used when custom-content is empty.',
    },
    noAnimation: {
      control: 'boolean',
      name: 'no-animation',
      table: { category: 'Component Props', defaultValue: { summary: false } },
      description: 'Disable show/hide animations for toasts.',
    },
    noCloseButton: {
      control: 'boolean',
      name: 'no-close-button',
      table: { category: 'Toast Options', defaultValue: { summary: false } },
      description:
        'When true, the toast will not display a close button and can only be dismissed by timeout or programmatically.',
    },
    noHoverPause: {
      control: 'boolean',
      name: 'no-hover-pause',
      table: { category: 'Component Props', defaultValue: { summary: false } },
      description: 'When true, hovering over a toast does not pause its auto-dismiss timer.',
    },
    persistent: {
      control: 'boolean',
      name: 'persistent',
      table: { category: 'Toast Options', defaultValue: { summary: false } },
      description: 'When true, the toast will not auto-dismiss and requires user interaction to close.',
    },
    plumageToast: {
      control: 'boolean',
      name: 'plumage-toast',
      table: { category: 'Component Props', defaultValue: { summary: false } },
      description: 'Enable Plumage styling for toasts (different from solid-toast).',
    },
    plumageToastMax: {
      control: 'boolean',
      name: 'plumage-toast-max',
      table: { category: 'Component Props', defaultValue: { summary: false } },
      description: 'Enable Plumage Max styling for toasts (larger, more prominent).',
    },
    appendToast: {
      control: 'boolean',
      name: 'append-toast',
      table: { category: 'Component Props', defaultValue: { summary: false } },
      description: 'When true, new toasts are added below existing ones instead of above.',
    },
    svgIcon: {
      control: 'select',
      options: ['', 'exclamation-triangle-outline', 'exclamation-circle-fill', 'exclamation-circle-outline', 'exclamation-triangle-fill', 'check-circle-fill', 'check-circle-outline', 'info-fill', 'info-outline'],
      name: 'svg-icon',
      table: { category: 'Toast Options' },
      description: 'Name of the SVG icon to display (e.g., "exclamation-triangle-outline").',
    },
    time: {
      control: 'text',
      name: 'time',
      table: { category: 'Toast Options' },
      description: 'Default time label (ZULU) in the toast header.',
    },
    toastId: {
      control: 'text',
      name: 'toast-id',
      table: { category: 'Toast Options' },
      description: 'Optional ID for the toast, useful for programmatic control (e.g., dismissal).',
    },
    toastTitle: {
      control: 'text',
      name: 'toast-title',
      table: { category: 'Toast Options' },
      description: 'Optional default title for new toasts.',
    },
    variant: {
      control: 'select',
      options: ['', 'primary', 'secondary', 'success', 'danger', 'warning', 'info'],
      table: { category: 'Toast Options' },
      description:
        "Visual variant of the toast, mapped to the toast option `variantClass` ('primary', 'secondary', 'success', 'danger', 'warning', 'info').",
    },
  },

  args: {
    additionalHeaderContent: '43 seconds ago',
    bodyClass: '',
    customContent: '',
    duration: 7000,
    headerClass: '',
    iconPlumageStyle: false,
    isStatus: false,
    message: '',
    noAnimation: false,
    noCloseButton: false,
    noHoverPause: false,
    persistent: true,

    position: 'top-right',
    solidToast: false,
    plumageToast: false,
    plumageToastMax: false,
    appendToast: true,

    svgIcon: 'exclamation-triangle-outline',
    time: '',
    toastId: '',
    toastTitle: 'Title Text',
    variant: '',
  },
};

/* =========================================================
   1) Default Toast (single preview; args-driven)
   ========================================================= */

export const DefaultToast = {
  name: 'Default: Toast',
  render: (args, context) => {
    const ids = makeIds({ host: 'defaultToastHost' }, context);

    const wrap = document.createElement('div');
    wrap.className = 'cwrapper';

    const section = document.createElement('section');
    section.className = 'display-box-demo';

    const label = document.createElement('div');
    label.textContent = 'Default toast styling preview:';
    label.style.marginBottom = '8px';
    label.style.fontSize = '0.75rem';

    const host = document.createElement(TAG);
    host.id = ids.host;

    applyHostProps(host, args);

    section.append(label, host);
    wrap.append(section);

    runOnArgsChange(`${context.id}::DefaultToast`, args, async () => {
      const t = document.getElementById(ids.host);
      await safeShowToast(t, buildToastOptions(args));
    });

    return wrap;
  },

  parameters: {
    docs: {
      source: {
        language: 'html',
        transform: (_code, ctx) => {
          const ids = makeIds({ host: 'defaultToastHost' }, ctx);
          const a = ctx?.args || {};
          const opts = buildToastOptions(a);

          const html = normalize(`
<div class="cwrapper">
  <section class="display-box-demo">
    <div style="margin-bottom: 8px; font-size: 0.75rem">Default toast styling preview:</div>
    <toasts-component
      id="${ids.host}"
      ${valueAttr('position', a.position || '')}
      ${truthyAttr('solid-toast', !!a.solidToast)}
      ${truthyAttr('plumage-toast', !!a.plumageToast)}
      ${truthyAttr('plumage-toast-max', !!a.plumageToastMax)}
      ${truthyAttr('append-toast', !!a.appendToast)}
      ${truthyAttr('no-animation', !!a.noAnimation)}
      ${truthyAttr('no-hover-pause', !!a.noHoverPause)}
    ></toasts-component>
  </section>
</div>
          `);

          const js = jsPreviewBlock([
            `const t = document.getElementById('${ids.host}');`,
            `t && t.showToast(${JSON.stringify(opts, null, 2)});`,
          ]);

          return docsCode(html, js);
        },
      },
      story: { height: '220px' },
    },
  },
};

/* =========================================================
   2) Default Variant Colors (STACKED in ONE host; args-driven)
   ========================================================= */

export const DefaultVariantColors = {
  name: 'Default: Variant Colors (Stacked)',
  args: {
    solidToast: false,
    plumageToast: false,
    plumageToastMax: false,
    appendToast: true,
    position: 'top-right',
  },
  render: (args, context) => {
    const ids = makeIds({ host: 'defaultVariantsHost' }, context);

    const wrap = document.createElement('div');
    wrap.className = 'cwrapper';

    const section = document.createElement('section');
    section.className = 'display-box-demo';

    const label = document.createElement('div');
    label.textContent = 'Default variants stacked into one host:';
    label.style.marginBottom = '8px';
    label.style.fontSize = '0.75rem';

    const host = document.createElement(TAG);
    host.id = ids.host;

    // Force appendToast on for stacking preview
    applyHostProps(host, args, { appendToast: true });

    section.append(label, host);
    wrap.append(section);

    runOnArgsChange(`${context.id}::DefaultVariantColors`, args, async () => {
      const t = document.getElementById(ids.host);

      const base = {
        ...buildToastOptions(args),
        toastTitle: args.toastTitle || 'Title Text',
        additionalHdrContent: args.additionalHeaderContent || '43 seconds ago',
        persistent: true,
      };

      await safeShowToast(t, { ...base, content: 'Primary variant', variantClass: 'primary' });
      await safeShowToast(t, { ...base, content: 'Secondary variant', variantClass: 'secondary' });
      await safeShowToast(t, { ...base, content: 'Danger variant', variantClass: 'danger' });
      await safeShowToast(t, { ...base, content: 'Warning variant', variantClass: 'warning' });
      await safeShowToast(t, { ...base, content: 'Success variant', variantClass: 'success' });
      await safeShowToast(t, { ...base, content: 'Info variant', variantClass: 'info' });
    });

    return wrap;
  },

  parameters: {
    docs: {
      source: {
        language: 'html',
        transform: (_code, ctx) => {
          const ids = makeIds({ host: 'defaultVariantsHost' }, ctx);
          const a = { ...(ctx?.args || {}), appendToast: true };

          const base = {
            ...buildToastOptions(a),
            toastTitle: a.toastTitle || 'Title Text',
            additionalHdrContent: a.additionalHeaderContent || '43 seconds ago',
            persistent: true,
          };

          const html = normalize(`
<div class="cwrapper">
  <section class="display-box-demo">
    <div style="margin-bottom: 8px; font-size: 0.75rem">Default variants stacked into one host:</div>
    <toasts-component
      id="${ids.host}"
      ${valueAttr('position', a.position || '')}
      append-toast
    ></toasts-component>
  </section>
</div>
          `);

          const js = jsPreviewBlock([
            `const t = document.getElementById('${ids.host}');`,
            `t && t.showToast(${JSON.stringify({ ...base, content: 'Primary variant', variantClass: 'primary' }, null, 2)});`,
            `t && t.showToast(${JSON.stringify({ ...base, content: 'Secondary variant', variantClass: 'secondary' }, null, 2)});`,
            `t && t.showToast(${JSON.stringify({ ...base, content: 'Danger variant', variantClass: 'danger' }, null, 2)});`,
            `t && t.showToast(${JSON.stringify({ ...base, content: 'Warning variant', variantClass: 'warning' }, null, 2)});`,
            `t && t.showToast(${JSON.stringify({ ...base, content: 'Success variant', variantClass: 'success' }, null, 2)});`,
            `t && t.showToast(${JSON.stringify({ ...base, content: 'Info variant', variantClass: 'info' }, null, 2)});`,
          ]);

          return docsCode(html, js);
        },
      },
      story: { height: '380px' },
      description: {
        story:
          'Default toast variants stacked into a single host so you can compare visual styles without overlapping containers.',
      },
    },
  },
};

/* =========================================================
   3) Solid Toast (single preview; args-driven)
   ========================================================= */

export const SolidToast = {
  name: 'Solid: Toast',
  args: {
    solidToast: true,
    plumageToast: false,
    plumageToastMax: false,
    appendToast: true,
    position: 'bottom-right',
  },
  render: (args, context) => {
    const ids = makeIds({ host: 'solidToastHost' }, context);

    const wrap = document.createElement('div');
    wrap.className = 'cwrapper';

    const section = document.createElement('section');
    section.className = 'display-box-demo';

    const label = document.createElement('div');
    label.textContent = 'Solid toast styling preview:';
    label.style.marginBottom = '8px';
    label.style.fontSize = '0.75rem';

    const host = document.createElement(TAG);
    host.id = ids.host;

    applyHostProps(host, args);

    section.append(label, host);
    wrap.append(section);

    runOnArgsChange(`${context.id}::SolidToast`, args, async () => {
      const t = document.getElementById(ids.host);

      const opts = {
        ...buildToastOptions(args),
        toastTitle: args.toastTitle || 'Solid Toast',
        content: args.message || 'This is a solid toast example!',
        variantClass: args.variant || '',
      };

      await safeShowToast(t, opts);
    });

    return wrap;
  },

  parameters: {
    docs: {
      story: { height: '220px' },
      description: {
        story:
          'The "Solid" variant provides a bold appearance with solid backgrounds corresponding to each variant type.',
      },
    },
  },
};

/* =========================================================
   4) Solid Variant Colors (STACKED in ONE host; args-driven)
   ========================================================= */

export const SolidVariantColors = {
  name: 'Solid: Variant Colors (Stacked)',
  args: {
    solidToast: true,
    plumageToast: false,
    plumageToastMax: false,
    appendToast: true,
    position: 'top-right',
  },
  render: (args, context) => {
    const ids = makeIds({ host: 'solidVariantsHost' }, context);

    const wrap = document.createElement('div');
    wrap.className = 'cwrapper';

    const section = document.createElement('section');
    section.className = 'display-box-demo';

    const label = document.createElement('div');
    label.textContent = 'Solid variants stacked into one host:';
    label.style.marginBottom = '8px';
    label.style.fontSize = '0.75rem';

    const host = document.createElement(TAG);
    host.id = ids.host;

    applyHostProps(host, args, { solidToast: true, appendToast: true });

    section.append(label, host);
    wrap.append(section);

    runOnArgsChange(`${context.id}::SolidVariantColors`, args, async () => {
      const t = document.getElementById(ids.host);

      const base = {
        ...buildToastOptions(args),
        toastTitle: args.toastTitle || 'Solid Toast',
        duration: Number.isFinite(args.duration) ? args.duration : 7000,
        persistent: true,
      };

      await safeShowToast(t, { ...base, content: 'Primary solid variant', variantClass: 'primary' });
      await safeShowToast(t, { ...base, content: 'Secondary solid variant', variantClass: 'secondary' });
      await safeShowToast(t, { ...base, content: 'Danger solid variant', variantClass: 'danger' });
      await safeShowToast(t, { ...base, content: 'Warning solid variant', variantClass: 'warning' });
      await safeShowToast(t, { ...base, content: 'Success solid variant', variantClass: 'success' });
      await safeShowToast(t, { ...base, content: 'Info solid variant', variantClass: 'info' });
    });

    return wrap;
  },

  parameters: {
    docs: {
      source: {
        language: 'html',
        transform: (_code, ctx) => {
          const ids = makeIds({ host: 'solidVariantsHost' }, ctx);
          const a = { ...(ctx?.args || {}), solidToast: true, appendToast: true };

          const base = {
            ...buildToastOptions(a),
            toastTitle: a.toastTitle || 'Solid Toast',
            duration: Number.isFinite(a.duration) ? a.duration : 7000,
            persistent: true,
          };

          const html = normalize(`
<div class="cwrapper">
  <section class="display-box-demo">
    <div style="margin-bottom: 8px; font-size: 0.75rem">Solid variants stacked into one host:</div>
    <toasts-component
      id="${ids.host}"
      solid-toast
      ${valueAttr('position', a.position || '')}
      append-toast
    ></toasts-component>
  </section>
</div>
          `);

          const js = jsPreviewBlock([
            `const t = document.getElementById('${ids.host}');`,
            `t && t.showToast(${JSON.stringify({ ...base, content: 'Primary solid variant', variantClass: 'primary' }, null, 2)});`,
            `t && t.showToast(${JSON.stringify({ ...base, content: 'Secondary solid variant', variantClass: 'secondary' }, null, 2)});`,
            `t && t.showToast(${JSON.stringify({ ...base, content: 'Danger solid variant', variantClass: 'danger' }, null, 2)});`,
            `t && t.showToast(${JSON.stringify({ ...base, content: 'Warning solid variant', variantClass: 'warning' }, null, 2)});`,
            `t && t.showToast(${JSON.stringify({ ...base, content: 'Success solid variant', variantClass: 'success' }, null, 2)});`,
            `t && t.showToast(${JSON.stringify({ ...base, content: 'Info solid variant', variantClass: 'info' }, null, 2)});`,
          ]);

          return docsCode(html, js);
        },
      },
      story: { height: '380px' },
      description: {
        story:
          'Solid variants stacked into a single host so you can compare solid styling across all variants.',
      },
    },
  },
};

/* =========================================================
   5) Plumage Toast (single preview; args-driven)
   ========================================================= */

export const PlumageToast = {
  name: 'Plumage: Toast',
  args: {
    solidToast: false,
    plumageToast: true,
    plumageToastMax: false,
    appendToast: true,
    position: 'top-right',
    iconPlumageStyle: true,
    noCloseButton: true,
    variant: 'info',
    svgIcon: 'exclamation-circle-fill',
  },
  render: (args, context) => {
    const ids = makeIds({ host: 'plumageToastHost' }, context);

    const wrap = document.createElement('div');
    wrap.className = 'cwrapper';

    const section = document.createElement('section');
    section.className = 'display-box-demo';

    const label = document.createElement('div');
    label.textContent = 'Plumage toast styling preview:';
    label.style.marginBottom = '8px';
    label.style.fontSize = '0.75rem';

    const host = document.createElement(TAG);
    host.id = ids.host;

    applyHostProps(host, args, { plumageToast: true });

    section.append(label, host);
    wrap.append(section);

    runOnArgsChange(`${context.id}::PlumageToast`, args, async () => {
      const t = document.getElementById(ids.host);

      const opts = {
        ...buildToastOptions(args),
        toastTitle: args.toastTitle || 'Plumage Toast',
        content: args.message || 'This is a Plumage styled toast example!',
        variantClass: args.variant || 'info',
      };

      await safeShowToast(t, opts);
    });

    return wrap;
  },

  parameters: {
    docs: {
      story: { height: '220px' },
      description: {
        story:
          'The "Plumage" variant offers a modern and clean design using Plumage-specific styling.',
      },
    },
  },
};

/* =========================================================
   6) Plumage Toast Max (single preview; args-driven)
   ========================================================= */

export const PlumageToastMax = {
  name: 'Plumage: Toast Max',
  args: {
    solidToast: false,
    plumageToast: true,
    plumageToastMax: true,
    appendToast: true,
    position: 'top-right',
    iconPlumageStyle: true,
    variant: 'danger',
    svgIcon: 'exclamation-circle-fill',
    customContent: '<div><div>This is data</div><div>This is data</div></div>',
  },
  render: (args, context) => {
    const ids = makeIds({ host: 'plumageToastMaxHost' }, context);

    const wrap = document.createElement('div');
    wrap.className = 'cwrapper';

    const section = document.createElement('section');
    section.className = 'display-box-demo';

    const label = document.createElement('div');
    label.textContent = 'Plumage toast max styling preview:';
    label.style.marginBottom = '8px';
    label.style.fontSize = '0.75rem';

    const host = document.createElement(TAG);
    host.id = ids.host;

    applyHostProps(host, args, { plumageToast: true, plumageToastMax: true });

    section.append(label, host);
    wrap.append(section);

    runOnArgsChange(`${context.id}::PlumageToastMax`, args, async () => {
      const t = document.getElementById(ids.host);

      const opts = {
        ...buildToastOptions(args),
        toastTitle: args.toastTitle || 'Plumage Toast Max',
        // prefer customContent for max
        ...buildToastContent(args),
        variantClass: args.variant || 'danger',
      };

      await safeShowToast(t, opts);
    });

    return wrap;
  },

  parameters: {
    docs: {
      story: { height: '220px' },
      description: {
        story:
          'The "Plumage Max" variant is designed for more prominent notifications, featuring larger content and a more prominent layout.',
      },
    },
  },
};
