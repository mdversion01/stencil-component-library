// ============================================================================
// File: stories/toasts/toasts-component.stories.js
// ============================================================================

import '../../src/components/toasts/toasts-styles.scss';

import {
  buildComponentUsageSource,
  buildMultipleComponentUsageSource,
  createToastComponentPreview,
  makeIds,
  normalizeMaxWidth,
} from './toasts-component.story-helpers';

export default {
  title: 'Bootstrap/Toasts',

  parameters: {
    layout: 'padded',

    themeFamily: 'bootstrap',

    docs: {
      description: {
        component:
          'Visual previews for `<toasts-component>` rendered by the actual Stencil component. Storybook supplies declarative preview data, so `showToast()`, dismissal timers, focus movement, hover timing, and toast lifecycle state are not executed.',
      },
    },
  },

  argTypes: {
    ariaLabel: {
      control: 'text',

      name: 'aria-label',

      table: {
        category: 'Accessibility',

        defaultValue: {
          summary: 'Notifications',
        },
      },

      description:
        'Accessible label for the toaster region.',
    },

    focusOnShow: {
      control: 'boolean',

      name: 'focus-on-show',

      table: {
        category: 'Accessibility',

        defaultValue: {
          summary: false,
        },
      },

      description:
        'Moves focus when a live toast is shown. Preview mode does not move focus.',
    },

    additionalHeaderContent: {
      control: 'text',

      name: 'additional-header-content',

      table: {
        category: 'Toast Options',
      },

      description:
        'Optional content displayed next to the toast title.',
    },

    bodyClass: {
      control: 'text',

      name: 'body-class',

      table: {
        category: 'Toast Options',
      },

      description:
        'Additional CSS class or classes applied to the toast body.',
    },

    contentHtml: {
      control: 'text',

      name: 'content-html',

      table: {
        category: 'Toast Options',
      },

      description:
        'Optional HTML content used for the toast body. Overrides `message` if both are supplied.',
    },

    duration: {
      control: 'number',

      table: {
        category: 'Toast Options',

        defaultValue: {
          summary: 5000,
        },
      },

      description:
        'Auto-dismiss duration for live toasts. Preview mode does not start dismissal timers.',
    },

    headerClass: {
      control: 'text',

      name: 'header-class',

      table: {
        category: 'Toast Options',
      },

      description:
        'Additional CSS class or classes applied to the toast header.',
    },

    isStatus: {
      control: 'boolean',

      name: 'is-status',

      table: {
        category: 'Toast Options',

        defaultValue: {
          summary: false,
        },
      },

      description:
        'Uses role="status" instead of role="alert".',
    },

    message: {
      control: 'text',

      table: {
        category: 'Toast Options',
      },

      description:
        'Simple text displayed in the toast body.',
    },

    noCloseButton: {
      control: 'boolean',

      name: 'no-close-button',

      table: {
        category: 'Toast Options',

        defaultValue: {
          summary: false,
        },
      },

      description:
        'Removes the close button.',
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

      table: {
        category: 'Toast Options',
      },

      description:
        'Registered SVG icon displayed in the toast.',
    },

    toastId: {
      control: 'text',

      name: 'toast-id',

      table: {
        category: 'Component Props',

        defaultValue: {
          summary: 'toast-component',
        },
      },

      description:
        'Prefix used for generated toast element IDs.',
    },

    toastTitle: {
      control: 'text',

      name: 'toast-title',

      table: {
        category: 'Toast Options',
      },

      description:
        'Toast title.',
    },

    variant: {
      control: 'select',

      options: [
        '',
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
        'dark',
        'light',
      ],

      table: {
        category: 'Toast Options',

        defaultValue: {
          summary: '',
        },
      },

      description:
        'Visual toast variant.',
    },

    position: {
      control: 'select',

      options: [
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ],

      table: {
        category: 'Component Props',

        defaultValue: {
          summary: 'bottom-right',
        },
      },

      description:
        'Positions the toaster region.',
    },

    solidToast: {
      control: 'boolean',

      name: 'solid-toast',

      table: {
        category: 'Component Props',

        defaultValue: {
          summary: false,
        },
      },

      description:
        'Switches between the standard and solid toast layouts.',
    },

    maxWidth: {
      control: 'text',

      name: 'max-width',

      table: {
        category: 'Component Props',

        defaultValue: {
          summary: '350',
        },
      },

      description:
        'Maximum toaster width. Numeric values are interpreted as pixels.',
    },

    appendToast: {
      control: 'boolean',

      name: 'append-toast',

      table: {
        category: 'Component Props',

        defaultValue: {
          summary: false,
        },
      },

      description:
        'Controls live toast insertion order. Preview mode uses declarative fixed ordering.',
    },

    noAnimation: {
      control: 'boolean',

      name: 'no-animation',

      table: {
        category: 'Component Props',

        defaultValue: {
          summary: false,
        },
      },

      description:
        'Disables live toast animation. Preview mode renders directly in the visible state.',
    },

    noHoverPause: {
      control: 'boolean',

      name: 'no-hover-pause',

      table: {
        category: 'Component Props',

        defaultValue: {
          summary: false,
        },
      },

      description:
        'Prevents hover from pausing live dismissal timers. Preview mode does not run timers.',
    },

    persistent: {
      control: 'boolean',

      table: {
        category: 'Component Props',

        defaultValue: {
          summary: false,
        },
      },

      description:
        'Prevents automatic dismissal in live usage. Preview items remain visible without lifecycle timers.',
    },
  },

  args: {
    ariaLabel: 'Notifications',

    focusOnShow: false,

    additionalHeaderContent:
      '43 seconds ago',

    bodyClass: '',

    contentHtml: '',

    duration: 5000,

    headerClass: '',

    isStatus: false,

    message: 'This is a toast message.',

    noCloseButton: false,

    svgIcon:
      'exclamation-triangle-outline',

    toastId:
      'toast-component',

    toastTitle:
      'Title Text',

    variant: '',

    position:
      'bottom-left',

    solidToast:
      false,

    maxWidth:
      350,

    appendToast:
      false,

    noAnimation:
      false,

    noHoverPause:
      false,

    persistent:
      false,
  },
};

export const DefaultToast = {
  name: 'Default: Toast',

  args: {
    solidToast: false,
  },

  render: (args, context) =>
    createToastComponentPreview(
      args,
      context,
      {
        labelText:
          'Default toast styling preview:',
      },
    ),

  parameters: {
    docs: {
      source: {
        language: 'html',

        transform: (_code, context) =>
          buildComponentUsageSource(
            context.args,
            {},
            'toast1c',
          ),
      },

      story: {
        height: '220px',
      },

      description: {
        story:
          'The actual `<toasts-component>` rendered with declarative preview data. Controls can switch between standard and solid layouts without invoking `showToast()`.',
      },
    },
  },
};

export const DefaultVariantColors = {
  name:
    'Default: Variant Colors',

  args: {
    solidToast: false,

    position: 'top-right',
  },

  render: (args, context) =>
    createToastComponentPreview(
      args,
      context,
      {
        labelText:
          'Toast variant colors:',

        toasts: [
          {
            message:
              'Primary variant',

            variant:
              'primary',
          },

          {
            message:
              'Secondary variant',

            variant:
              'secondary',
          },

          {
            message:
              'Danger variant',

            variant:
              'danger',
          },

          {
            message:
              'Warning variant',

            variant:
              'warning',
          },

          {
            message:
              'Success variant',

            variant:
              'success',
          },

          {
            message:
              'Info variant',

            variant:
              'info',
          },
        ],
      },
    ),

  parameters: {
    docs: {
      source: {
        language: 'html',

        transform: (_code, context) =>
          buildMultipleComponentUsageSource(
            context.args,
            [
              {
                id:
                  'toast-primary',

                message:
                  'Primary variant',

                variant:
                  'primary',
              },

              {
                id:
                  'toast-secondary',

                message:
                  'Secondary variant',

                variant:
                  'secondary',
              },

              {
                id:
                  'toast-danger',

                message:
                  'Danger variant',

                variant:
                  'danger',
              },

              {
                id:
                  'toast-warning',

                message:
                  'Warning variant',

                variant:
                  'warning',
              },

              {
                id:
                  'toast-success',

                message:
                  'Success variant',

                variant:
                  'success',
              },

              {
                id:
                  'toast-info',

                message:
                  'Info variant',

                variant:
                  'info',
              },
            ],
          ),
      },

      story: {
        height: '440px',
      },

      description: {
        story:
          'Variant comparison rendered by the actual component. Enabling `solid-toast` switches the entire preview to the solid layout.',
      },
    },
  },
};

export const SolidToast = {
  name: 'Solid: Toast',

  args: {
    solidToast: true,

    variant: 'info',

    message:
      'This is a solid toast example!',
  },

  render: (args, context) =>
    createToastComponentPreview(
      args,
      context,
      {
        labelText:
          'Solid toast styling preview:',
      },
    ),

  parameters: {
    docs: {
      source: {
        language: 'html',

        transform: (_code, context) =>
          buildComponentUsageSource(
            context.args,
            {},
            'toast-solid',
          ),
      },

      story: {
        height: '220px',
      },

      description: {
        story:
          'Starts in solid mode. The `solid-toast` control can also be switched off because no fixed override is applied.',
      },
    },
  },
};

export const SolidVariantColors = {
  name:
    'Solid: Variant Colors',

  args: {
    solidToast: true,

    position: 'top-right',
  },

  render: (args, context) =>
    createToastComponentPreview(
      args,
      context,
      {
        labelText:
          'Solid toast variant colors:',

        toasts: [
          {
            message:
              'Primary solid variant',

            variant:
              'primary',
          },

          {
            message:
              'Secondary solid variant',

            variant:
              'secondary',
          },

          {
            message:
              'Danger solid variant',

            variant:
              'danger',
          },

          {
            message:
              'Warning solid variant',

            variant:
              'warning',
          },

          {
            message:
              'Success solid variant',

            variant:
              'success',
          },

          {
            message:
              'Info solid variant',

            variant:
              'info',
          },
        ],
      },
    ),

  parameters: {
    docs: {
      source: {
        language: 'html',

        transform: (_code, context) =>
          buildMultipleComponentUsageSource(
            context.args,
            [
              {
                id:
                  'solid-toast-primary',

                message:
                  'Primary solid variant',

                variant:
                  'primary',
              },

              {
                id:
                  'solid-toast-secondary',

                message:
                  'Secondary solid variant',

                variant:
                  'secondary',
              },

              {
                id:
                  'solid-toast-danger',

                message:
                  'Danger solid variant',

                variant:
                  'danger',
              },

              {
                id:
                  'solid-toast-warning',

                message:
                  'Warning solid variant',

                variant:
                  'warning',
              },

              {
                id:
                  'solid-toast-success',

                message:
                  'Success solid variant',

                variant:
                  'success',
              },

              {
                id:
                  'solid-toast-info',

                message:
                  'Info solid variant',

                variant:
                  'info',
              },
            ],
          ),
      },

      story: {
        height: '440px',
      },

      description: {
        story:
          'Starts in solid mode but remains fully controllable from Storybook Controls.',
      },
    },
  },
};

export const AccessibilityMatrix = {
  name:
    'Accessibility Matrix (computed)',

  render: (_args, context) => {
    const ids = makeIds(
      {
        alert:
          'mxAlert',

        status:
          'mxStatus',

        noClose:
          'mxNoClose',

        focus:
          'mxFocus',

        position:
          'mxPosition',

        width:
          'mxWidth',
      },
      context,
    );

    const wrap =
      document.createElement('div');

    wrap.className =
      'toasts-accessibility-matrix';

    const header =
      document.createElement('div');

    const title =
      document.createElement('strong');

    title.textContent =
      'Accessibility matrix';

    const description =
      document.createElement('div');

    description.className =
      'toasts-accessibility-matrix__description';

    description.textContent =
      'Computed component API examples. No live toast lifecycle is executed.';

    header.append(
      title,
      description,
    );

    wrap.appendChild(header);

    const makeCard = titleText => {
      const card =
        document.createElement('div');

      card.className =
        'toasts-accessibility-matrix__card';

      const cardTitle =
        document.createElement('div');

      cardTitle.className =
        'toasts-accessibility-matrix__card-title';

      cardTitle.textContent =
        titleText;

      const output =
        document.createElement('pre');

      output.className =
        'toasts-accessibility-matrix__output';

      card.append(
        cardTitle,
        output,
      );

      wrap.appendChild(card);

      return output;
    };

    const compute = config => {
      const numericId = 12345;

      const outerId =
        `${config.toastId}__toast_${numericId}__outer`;

      const contentId =
        `${config.toastId}__toast_${numericId}__content`;

      const titleId =
        `${config.toastId}__toast_${numericId}__title`;

      const bodyId =
        `${config.toastId}__toast_${numericId}__body`;

      const closeId =
        `${config.toastId}__toast_${numericId}__close`;

      return {
        scenario:
          config.scenario,

        region: {
          role: 'region',

          id:
            `toaster-${config.position}`,

          class:
            `toaster toaster-${config.position}`,

          'aria-label':
            config.ariaLabel,

          'aria-relevant':
            'additions text',

          'aria-atomic':
            'false',

          maxWidth:
            normalizeMaxWidth(
              config.maxWidth,
            ),
        },

        toast: {
          id: outerId,

          role:
            config.isStatus
              ? 'status'
              : 'alert',

          'aria-atomic':
            'true',

          'aria-labelledby':
            config.toastTitle
              ? titleId
              : null,

          'aria-describedby':
            bodyId,

          focusTargetId:
            contentId,

          closeButton:
            config.noCloseButton
              ? null
              : {
                  id: closeId,

                  'aria-label':
                    config.toastTitle
                      ? `Close ${config.toastTitle}`
                      : 'Close notification',

                  'aria-controls':
                    outerId,
                },
        },

        hostProps: {
          'aria-label':
            config.ariaLabel,

          toastId:
            config.toastId,

          position:
            config.position,

          solidToast:
            !!config.solidToast,

          maxWidth:
            config.maxWidth,

          focusOnShow:
            !!config.focusOnShow,
        },
      };
    };

    const base = {
      ariaLabel:
        'Notifications',

      toastId:
        'toast-component',

      toastTitle:
        'Notice',

      isStatus:
        false,

      noCloseButton:
        false,

      position:
        'top-right',

      solidToast:
        false,

      focusOnShow:
        false,

      maxWidth:
        350,
    };

    makeCard(
      'Alert toast',
    ).textContent =
      JSON.stringify(
        compute({
          ...base,

          scenario:
            'alert toast',

          toastId:
            ids.alert,
        }),
        null,
        2,
      );

    makeCard(
      'Status toast',
    ).textContent =
      JSON.stringify(
        compute({
          ...base,

          scenario:
            'status toast',

          toastId:
            ids.status,

          isStatus:
            true,
        }),
        null,
        2,
      );

    makeCard(
      'No close button',
    ).textContent =
      JSON.stringify(
        compute({
          ...base,

          scenario:
            'no close button',

          toastId:
            ids.noClose,

          noCloseButton:
            true,
        }),
        null,
        2,
      );

    makeCard(
      'Focus on show',
    ).textContent =
      JSON.stringify(
        compute({
          ...base,

          scenario:
            'focus on show',

          toastId:
            ids.focus,

          focusOnShow:
            true,
        }),
        null,
        2,
      );

    makeCard(
      'Bottom-center position',
    ).textContent =
      JSON.stringify(
        compute({
          ...base,

          scenario:
            'bottom-center position',

          toastId:
            ids.position,

          position:
            'bottom-center',
        }),
        null,
        2,
      );

    makeCard(
      'Custom max width',
    ).textContent =
      JSON.stringify(
        compute({
          ...base,

          scenario:
            'custom max width',

          toastId:
            ids.width,

          maxWidth:
            '32rem',
        }),
        null,
        2,
      );

    return wrap;
  },

  parameters: {
    controls: {
      disable: true,
    },

    docs: {
      source: {
        language: 'html',

        code: `<toasts-component
  id="toast-example"
  aria-label="Notifications"
  toast-id="toast-component"
  position="bottom-right"
  duration="5000"
  max-width="350"
></toasts-component>`,
      },

      description: {
        story:
          'Computed accessibility reference only. No toast lifecycle behavior is executed.',
      },
    },
  },
};
