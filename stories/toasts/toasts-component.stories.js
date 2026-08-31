// import DocsPage from './toasts-component.docs.mdx';
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
  title: 'Components/Toasts'
  ,
  parameters: {
    layout: 'padded',
    docs: {

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
    const ids = makeIds(
      {
        alert: 'mxAlert',
        status: 'mxStatus',
        noClose: 'mxNoClose',
        focus: 'mxFocus',
        plumage: 'mxPlumage',
        position: 'mxPosition',
      },
      context,
    );

    const wrap = document.createElement('div');
    wrap.className = 'toasts-accessibility-matrix';

    const header = document.createElement('div');

    const headerTitle = document.createElement('strong');
    headerTitle.textContent = 'Accessibility matrix';

    const headerDescription = document.createElement('div');
    headerDescription.className =
      'toasts-accessibility-matrix__description';
    headerDescription.innerHTML =
      'Prints the derived accessibility model for representative toast configurations: ' +
      '<code>role="alert"</code> versus <code>role="status"</code>, accessible naming, ' +
      'close-button wiring, focus behavior, styling mode, and toaster position. ' +
      'No toast overlay UI is rendered in this matrix.';

    header.appendChild(headerTitle);
    header.appendChild(headerDescription);
    wrap.appendChild(header);

    const makeCard = title => {
      const box = document.createElement('div');
      box.className = 'toasts-accessibility-matrix__card';

      const cardTitle = document.createElement('div');
      cardTitle.className =
        'toasts-accessibility-matrix__card-title';
      cardTitle.textContent = title;

      const output = document.createElement('pre');
      output.className = 'toasts-accessibility-matrix__output';
      output.textContent = 'Loading…';

      box.appendChild(cardTitle);
      box.appendChild(output);

      return {
        box,
        output,
      };
    };

    const compute = config => {
      const toastId = config.toastId || 'mx';
      const numericId = config.exampleToastNumericId;

      const outerId =
        `${toastId}__toast_${numericId}__outer`;

      const contentId =
        `${toastId}__toast_${numericId}__content`;

      const titleId =
        `${toastId}__toast_${numericId}__title`;

      const bodyId =
        `${toastId}__toast_${numericId}__body`;

      const closeId =
        `${toastId}__toast_${numericId}__close`;

      const role = config.isStatus
        ? 'status'
        : 'alert';

      return {
        scenario: config.scenario,

        region: {
          role: 'region',
          id: `toaster-${config.position}`,
          class:
            `${config.plumageToast ? 'pl-toaster' : 'toaster'} ` +
            `toaster-${config.position}`,
          'aria-label':
            config.ariaLabel || 'Notifications',
          'aria-relevant': 'additions text',
          'aria-atomic': 'false',
        },

        toast: {
          'data-toast-id': String(numericId),
          id: outerId,
          role,
          'aria-atomic': 'true',
          'aria-labelledby':
            config.toastTitle
              ? titleId
              : null,
          'aria-describedby': bodyId,

          accessibleNameSource:
            config.toastTitle
              ? 'aria-labelledby → toast title'
              : null,

          accessibleDescriptionSource:
            'aria-describedby → toast body',

          focusTargetId: contentId,

          closeButton: config.noCloseButton
            ? null
            : {
                id: closeId,
                'aria-label': config.toastTitle
                  ? `Close ${config.toastTitle}`
                  : 'Close notification',
                'aria-controls': outerId,
              },

          derivedIds: {
            outerId,
            contentId,
            titleId,
            bodyId,
            closeId,
          },
        },

        behavior: {
          announcement:
            role === 'status'
              ? 'polite'
              : 'assertive',

          focusOnShow:
            !!config.focusOnShow,

          closeButton:
            !config.noCloseButton,

          escapeClosesWhenFocused:
            true,
        },

        hostProps: {
          position: config.position,
          solidToast:
            !!config.solidToast,
          plumageToast:
            !!config.plumageToast,
          plumageToastMax:
            !!config.plumageToastMax,
          appendToast:
            !!config.appendToast,
          noAnimation:
            !!config.noAnimation,
          noHoverPause:
            !!config.noHoverPause,
          focusOnShow:
            !!config.focusOnShow,
        },
      };
    };

    const alertCard =
      makeCard('Alert toast');

    const statusCard =
      makeCard('Status toast');

    const noCloseCard =
      makeCard('No close button');

    const focusCard =
      makeCard('Focus on show');

    const plumageCard =
      makeCard('Plumage toast');

    const positionCard =
      makeCard('Bottom-left position');

    wrap.appendChild(alertCard.box);
    wrap.appendChild(statusCard.box);
    wrap.appendChild(noCloseCard.box);
    wrap.appendChild(focusCard.box);
    wrap.appendChild(plumageCard.box);
    wrap.appendChild(positionCard.box);

    queueMicrotask(() => {
      const base = {
        ariaLabel: 'Notifications',
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

      alertCard.output.textContent =
        JSON.stringify(
          compute({
            ...base,
            scenario: 'alert toast',
            toastId: ids.alert,
            toastTitle: 'Important notice',
            isStatus: false,
          }),
          null,
          2,
        );

      statusCard.output.textContent =
        JSON.stringify(
          compute({
            ...base,
            scenario: 'status toast',
            toastId: ids.status,
            toastTitle: 'Saved',
            isStatus: true,
          }),
          null,
          2,
        );

      noCloseCard.output.textContent =
        JSON.stringify(
          compute({
            ...base,
            scenario: 'no close button',
            toastId: ids.noClose,
            toastTitle: 'Persistent notice',
            noCloseButton: true,
          }),
          null,
          2,
        );

      focusCard.output.textContent =
        JSON.stringify(
          compute({
            ...base,
            scenario: 'focus on show',
            toastId: ids.focus,
            toastTitle: 'Focused notice',
            focusOnShow: true,
          }),
          null,
          2,
        );

      plumageCard.output.textContent =
        JSON.stringify(
          compute({
            ...base,
            scenario: 'plumage toast',
            toastId: ids.plumage,
            toastTitle: 'Plumage notice',
            plumageToast: true,
            plumageToastMax: true,
            solidToast: true,
          }),
          null,
          2,
        );

      positionCard.output.textContent =
        JSON.stringify(
          compute({
            ...base,
            scenario: 'bottom-left position',
            toastId: ids.position,
            toastTitle: 'Positioned notice',
            position: 'bottom-left',
          }),
          null,
          2,
        );
    });

    return wrap;
  },

  parameters: {
    controls: {
      disable: true,
    },

    docs: {
      description: {
        story:
          'Print-only accessibility matrix for representative Toast configurations. It compares alert versus status announcement semantics, close-button accessibility, focus-on-show behavior, Plumage styling, and positioning while showing the derived toast and toaster IDs and ARIA relationships.',
      },
    },
  },
};
