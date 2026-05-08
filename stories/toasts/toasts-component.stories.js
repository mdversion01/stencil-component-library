import DocsPage from './toasts-component.docs.mdx';
import {
  TAG,
  normalize,
  makeIds,
  applyHostProps,
  runOnArgsChange,
  safeClearToasts,
  safeShowToast,
  buildToastContent,
  buildPreviewToastOptions,
  buildSingleToastDocsSource,
} from './toasts-component.story-helpers';

export default {
  title: 'Components/Toasts',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      page: DocsPage,
      description: {
        component:
          'Visual styling previews for `<toasts-component>`. Stories are controls-driven. A small autoplay runs to render example toasts so you can see styles; it re-runs when controls change. Previews are configured to keep toasts visible (no auto-dismiss) in both Canvas and Docs.',
      },
    },
  },

  argTypes: {
    ariaLabel: {
      control: 'text',
      name: 'aria-label',
      table: { category: 'Accessibility' },
      description: 'Accessible label for the toaster region (role="region"). Example: "Notifications".',
    },
    focusOnShow: {
      control: 'boolean',
      name: 'focus-on-show',
      table: { category: 'Accessibility', defaultValue: { summary: false } },
      description: 'If true, newly shown toast content receives focus.',
    },

    additionalHeaderContent: {
      control: 'text',
      name: 'additional-header-content',
      table: { category: 'Toast Options' },
      description: 'Optional header content appearing next to the title.',
    },
    bodyClass: {
      control: 'text',
      name: 'body-class',
      table: { category: 'Toast Options' },
      description: 'Additional CSS class(es) for the toast body.',
    },
    customContent: {
      control: 'text',
      name: 'custom-content',
      table: { category: 'Toast Options' },
      description: 'Optional custom HTML content for the toast body.',
    },
    duration: {
      control: 'number',
      table: { category: 'Toast Options', defaultValue: { summary: 5000 } },
      description: 'Duration in milliseconds before the toast automatically dismisses.',
    },
    headerClass: {
      control: 'text',
      name: 'header-class',
      table: { category: 'Toast Options' },
      description: 'Additional CSS class(es) for the toast header.',
    },
    iconPlumageStyle: {
      control: 'boolean',
      name: 'icon-plumage-style',
      table: { category: 'Toast Options', defaultValue: { summary: false } },
      description: 'When true, applies Plumage styling to the toast icon.',
    },
    isStatus: {
      control: 'boolean',
      name: 'is-status',
      table: { category: 'Toast Options', defaultValue: { summary: false } },
      description: 'When true, the toast is announced as a status update.',
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
      description: 'Optional simple message.',
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
      description: 'When true, the toast will not display a close button.',
    },
    noHoverPause: {
      control: 'boolean',
      name: 'no-hover-pause',
      table: { category: 'Component Props', defaultValue: { summary: false } },
      description: 'When true, hovering over a toast does not pause its timer.',
    },
    persistent: {
      control: 'boolean',
      name: 'persistent',
      table: { category: 'Toast Options', defaultValue: { summary: false } },
      description: 'When true, the toast will not auto-dismiss.',
    },
    plumageToast: {
      control: 'boolean',
      name: 'plumage-toast',
      table: { category: 'Component Props', defaultValue: { summary: false } },
      description: 'Enable Plumage styling for toasts.',
    },
    plumageToastMax: {
      control: 'boolean',
      name: 'plumage-toast-max',
      table: { category: 'Component Props', defaultValue: { summary: false } },
      description: 'Enable Plumage Max styling for toasts.',
    },
    appendToast: {
      control: 'boolean',
      name: 'append-toast',
      table: { category: 'Component Props', defaultValue: { summary: false } },
      description: 'When true, new toasts are added below existing ones.',
    },
    svgIcon: {
      control: 'select',
      options: [
        '',
        'exclamation-triangle-outline',
        'exclamation-circle-fill',
        'exclamation-circle-outline',
        'exclamation-triangle-fill',
        'check-circle-fill',
        'check-circle-outline',
        'info-fill',
        'info-outlined',
      ],
      name: 'svg-icon',
      table: { category: 'Toast Options' },
      description: 'Name of the SVG icon to display.',
    },
    time: {
      control: 'text',
      name: 'time',
      table: { category: 'Toast Options' },
      description: 'Default time label in the toast header.',
    },
    toastId: {
      control: 'text',
      name: 'toast-id',
      table: { category: 'Toast Options' },
      description: 'Optional ID prefix used to generate stable element ids.',
    },
    toastTitle: {
      control: 'text',
      name: 'toast-title',
      table: { category: 'Toast Options' },
      description: 'Optional default title for new toasts.',
    },
    variant: {
      control: 'select',
      options: ['', 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'dark', 'light'],
      table: { category: 'Toast Options' },
      description: 'Visual variant of the toast.',
    },
  },

  args: {
    ariaLabel: 'Notifications',
    focusOnShow: false,

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

    runOnArgsChange(`${context.id}::DefaultToast`, { ...args, __viewMode: context.viewMode }, async () => {
      const t = document.getElementById(ids.host);
      await safeClearToasts(t);
      await safeShowToast(t, buildPreviewToastOptions(args));
    });

    return wrap;
  },

  parameters: {
    docs: {
      source: {
        language: 'html',
        transform: (_code, ctx) => buildSingleToastDocsSource(ctx.args, ctx, 'defaultToastHost', 'Default toast styling preview:'),
      },
      story: { height: '220px' },
    },
  },
};

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

    applyHostProps(host, args, { appendToast: true });

    section.append(label, host);
    wrap.append(section);

    runOnArgsChange(`${context.id}::DefaultVariantColors`, { ...args, __viewMode: context.viewMode }, async () => {
      const t = document.getElementById(ids.host);
      await safeClearToasts(t);

      const base = {
        ...buildPreviewToastOptions(args),
        toastTitle: args.toastTitle || 'Title Text',
        additionalHdrContent: args.additionalHeaderContent || '43 seconds ago',
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
      story: { height: '380px' },
      description: {
        story:
          'Default toast variants stacked into a single host so you can compare visual styles without overlapping containers.',
      },
    },
  },
};

export const SolidToast = {
  name: 'Solid: Toast',
  args: {
    solidToast: true,
    plumageToast: false,
    plumageToastMax: false,
    appendToast: true,
    variant: 'info',
    position: 'top-right',
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

    runOnArgsChange(`${context.id}::SolidToast`, { ...args, __viewMode: context.viewMode }, async () => {
      const t = document.getElementById(ids.host);
      await safeClearToasts(t);

      const opts = {
        ...buildPreviewToastOptions(args),
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

    runOnArgsChange(`${context.id}::SolidVariantColors`, { ...args, __viewMode: context.viewMode }, async () => {
      const t = document.getElementById(ids.host);
      await safeClearToasts(t);

      const base = {
        ...buildPreviewToastOptions(args),
        toastTitle: args.toastTitle || 'Solid Toast',
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
      story: { height: '380px' },
      description: {
        story: 'Solid variants stacked into a single host so you can compare solid styling across all variants.',
      },
    },
  },
};

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

    runOnArgsChange(`${context.id}::PlumageToast`, { ...args, __viewMode: context.viewMode }, async () => {
      const t = document.getElementById(ids.host);
      await safeClearToasts(t);

      const opts = {
        ...buildPreviewToastOptions(args),
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
        story: 'The "Plumage" variant offers a modern and clean design using Plumage-specific styling.',
      },
    },
  },
};

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

    runOnArgsChange(`${context.id}::PlumageToastMax`, { ...args, __viewMode: context.viewMode }, async () => {
      const t = document.getElementById(ids.host);
      await safeClearToasts(t);

      const opts = {
        ...buildPreviewToastOptions(args),
        toastTitle: args.toastTitle || 'Plumage Toast Max',
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

export const AccessibilityMatrix = {
  name: 'Accessibility Matrix (computed)',
  render: (_args, context) => {
    makeIds(
      {
        s_default: 'mxDefault',
        s_inline: 'mxInline',
        s_horizontal: 'mxHorizontal',
        s_error: 'mxError',
        s_disabled: 'mxDisabled',
      },
      context,
    );

    const wrap = document.createElement('div');
    wrap.style.display = 'grid';
    wrap.style.gap = '16px';
    wrap.style.maxWidth = '980px';

    const header = document.createElement('div');
    header.innerHTML = `
      <strong>Accessibility matrix</strong>
      <div style="opacity:.8">
        Prints computed a11y wiring for the toaster region and the toast template (derived ids, roles, aria-*),
        without rendering any actual toast UI.
      </div>
    `;
    wrap.appendChild(header);

    const makeCard = (title) => {
      const box = document.createElement('div');
      box.style.border = '1px solid #ddd';
      box.style.borderRadius = '10px';
      box.style.padding = '12px';
      box.style.display = 'grid';
      box.style.gap = '10px';

      const t = document.createElement('div');
      t.style.fontWeight = '600';
      t.textContent = title;

      const pre = document.createElement('pre');
      pre.style.margin = '0';
      pre.style.padding = '10px';
      pre.style.borderRadius = '8px';
      pre.style.overflow = 'auto';
      pre.style.border = '1px solid #eee';
      pre.style.background = '#fafafa';
      pre.textContent = 'Loading…';

      box.appendChild(t);
      box.appendChild(pre);
      return { box, pre };
    };

    const compute = (cfg) => {
      const toastId = cfg.toastId || 'mx';
      const outerId = `${toastId}__toast_${cfg.exampleToastNumericId}__outer`;
      const contentId = `${toastId}__toast_${cfg.exampleToastNumericId}__content`;
      const titleId = `${toastId}__toast_${cfg.exampleToastNumericId}__title`;
      const bodyId = `${toastId}__toast_${cfg.exampleToastNumericId}__body`;
      const closeId = `${toastId}__toast_${cfg.exampleToastNumericId}__close`;
      const role = cfg.isStatus ? 'status' : 'alert';

      return {
        scenario: cfg.scenario,
        region: {
          role: 'region',
          ariaLabel: cfg.ariaLabel || 'Notifications',
          ariaRelevant: 'additions text',
          ariaAtomic: 'false',
          id: `toaster-${cfg.position}`,
          class: `${cfg.plumageToast ? 'pl-toaster' : 'toaster'} toaster-${cfg.position}`,
        },
        exampleToast: {
          dataToastId: String(cfg.exampleToastNumericId),
          outerId,
          role,
          ariaAtomic: 'true',
          ariaLabelledby: cfg.toastTitle ? titleId : undefined,
          ariaDescribedby: bodyId,
          focusTargetId: contentId,
          closeButton: cfg.noCloseButton
            ? null
            : {
                id: closeId,
                ariaLabel: cfg.toastTitle ? `Close ${cfg.toastTitle}` : 'Close notification',
                ariaControls: outerId,
              },
          derivedIds: { outerId, contentId, titleId, bodyId, closeId },
        },
        props: {
          position: cfg.position,
          solidToast: !!cfg.solidToast,
          plumageToast: !!cfg.plumageToast,
          plumageToastMax: !!cfg.plumageToastMax,
          appendToast: !!cfg.appendToast,
          noAnimation: !!cfg.noAnimation,
          noHoverPause: !!cfg.noHoverPause,
          focusOnShow: !!cfg.focusOnShow,
        },
        notes: [
          'No live-region aria-live on the region itself; each toast uses role=status/alert which implies polite/assertive announcements.',
          'Toast outer uses aria-labelledby (title) + aria-describedby (body) for an explicit accessible name/description.',
          'Escape closes a toast when focus is within the toast.',
        ],
      };
    };

    const c1 = makeCard('Default (standard toast)');
    const c2 = makeCard('Inline (external label/help scenario)');
    const c3 = makeCard('Horizontal (simulated layout)');
    const c4 = makeCard('Error/validation (danger alert)');
    const c5 = makeCard('Disabled (simulated: no close button)');

    wrap.appendChild(c1.box);
    wrap.appendChild(c2.box);
    wrap.appendChild(c3.box);
    wrap.appendChild(c4.box);
    wrap.appendChild(c5.box);

    queueMicrotask(() => {
      const base = {
        ariaLabel: 'Notifications',
        toastId: 'mx',
        exampleToastNumericId: 12345,
        toastTitle: 'Notice',
        isStatus: false,
        noCloseButton: false,
        position: 'top-right',
        solidToast: false,
        plumageToast: false,
        plumageToastMax: false,
        appendToast: true,
        noAnimation: true,
        noHoverPause: false,
        focusOnShow: false,
      };

      c1.pre.textContent = JSON.stringify(
        compute({
          ...base,
          scenario: 'default',
        }),
        null,
        2,
      );

      c2.pre.textContent = JSON.stringify(
        compute({
          ...base,
          scenario: 'inline',
          position: 'top-left',
          toastId: 'mx-inline',
          toastTitle: 'Inline notice',
        }),
        null,
        2,
      );

      c3.pre.textContent = JSON.stringify(
        compute({
          ...base,
          scenario: 'horizontal',
          position: 'bottom-left',
          toastId: 'mx-horizontal',
          toastTitle: 'Horizontal notice',
        }),
        null,
        2,
      );

      c4.pre.textContent = JSON.stringify(
        compute({
          ...base,
          scenario: 'error/validation',
          position: 'bottom-right',
          toastId: 'mx-error',
          toastTitle: 'Error',
          isStatus: false,
        }),
        null,
        2,
      );

      c5.pre.textContent = JSON.stringify(
        compute({
          ...base,
          scenario: 'disabled (simulated)',
          toastId: 'mx-disabled',
          solidToast: true,
          noCloseButton: true,
        }),
        null,
        2,
      );
    });

    return wrap;
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Print-only accessibility matrix (no toast UI is rendered). It mirrors the component’s derived ids and aria/role model so you can verify wiring without overlays.',
      },
    },
  },
};
