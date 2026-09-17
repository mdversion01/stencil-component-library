// ============================================================================
// File: stories/plumage/plumage-toasts/
//       plumage-toasts-component.stories.js
// ============================================================================

import '../../../src/components/plumage-toasts/plumage-toasts-styles.scss';

import {
  buildComponentUsageSource,
  buildMultipleComponentUsageSource,
  createPlumageToastComponentPreview,
  makeIds,
  normalizeMaxWidth,
} from './plumage-toasts-component.story-helpers';

export default {
  title:
    'Plumage/Plumage Toasts',

  parameters: {
    layout: 'padded',

    themeFamily:
      'plumage',

    docs: {
      description: {
        component:
          'Visual previews for `<plumage-toasts-component>` rendered by the actual Stencil component. Storybook supplies declarative preview data, so `showToast()`, dismissal timers, focus movement, hover timing, and toast lifecycle state are not executed.',
      },
    },
  },

  argTypes: {
    ariaLabel: {
      control: 'text',

      name: 'aria-label',

      table: {
        category:
          'Accessibility',

        defaultValue: {
          summary:
            'Notifications',
        },
      },

      description:
        'Accessible label for the toaster region.',
    },

    focusOnShow: {
      control:
        'boolean',

      name:
        'focus-on-show',

      table: {
        category:
          'Accessibility',

        defaultValue: {
          summary: false,
        },
      },

      description:
        'Moves focus when a live toast is shown. Preview mode does not move focus.',
    },

    additionalHeaderContent: {
      control: 'text',

      name:
        'additional-header-content',

      table: {
        category:
          'Toast Options',
      },

      description:
        'Optional additional content displayed with the toast title.',
    },

    bodyClass: {
      control: 'text',

      name:
        'body-class',

      table: {
        category:
          'Toast Options',
      },

      description:
        'Additional CSS class or classes applied to the toast body.',
    },

    contentHtml: {
      control: 'text',

      name:
        'content-html',

      table: {
        category:
          'Toast Options',
      },

      description:
        'Optional HTML content used for the toast body. Overrides `message` if both are supplied.',
    },

    duration: {
      control:
        'number',

      table: {
        category:
          'Toast Options',

        defaultValue: {
          summary:
            5000,
        },
      },

      description:
        'Auto-dismiss duration for live toasts. Preview mode does not start dismissal timers.',
    },

    headerClass: {
      control: 'text',

      name:
        'header-class',

      table: {
        category:
          'Toast Options',
      },

      description:
        'Additional CSS class or classes applied to the toast header.',
    },

    isStatus: {
      control:
        'boolean',

      name:
        'is-status',

      table: {
        category:
          'Toast Options',

        defaultValue: {
          summary:
            false,
        },
      },

      description:
        'Uses role="status" instead of role="alert".',
    },

    message: {
      control:
        'text',

      table: {
        category:
          'Toast Options',
      },

      description:
        'Simple body text.',
    },

    noCloseButton: {
      control:
        'boolean',

      name:
        'no-close-button',

      table: {
        category:
          'Toast Options',

        defaultValue: {
          summary:
            false,
        },
      },

      description:
        'Removes the close button.',
    },

    noTime: {
      control:
        'boolean',

      name:
        'no-time',

      table: {
        category:
          'Toast Options',

        defaultValue: {
          summary:
            false,
        },
      },

      description:
        'Hides the generated or explicitly supplied time in the Standard Plumage layout.',
    },

    svgIcon: {
      control:
        'select',

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

      name:
        'svg-icon',

      table: {
        category:
          'Toast Options',
      },

      description:
        'SVG icon rendered by the Plumage Max layout.',
    },

    time: {
      control:
        'text',

      table: {
        category:
          'Toast Options',
      },

      description:
        'Optional time override. When omitted, the component generates the current Zulu time.',
    },

    toastId: {
      control:
        'text',

      name:
        'toast-id',

      table: {
        category:
          'Component Props',

        defaultValue: {
          summary:
            'plumage-toasts-component',
        },
      },

      description:
        'Prefix used for generated toast element IDs.',
    },

    toastTitle: {
      control:
        'text',

      name:
        'toast-title',

      table: {
        category:
          'Toast Options',
      },

      description:
        'Toast title.',
    },

    variant: {
      control:
        'select',

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
        category:
          'Toast Options',

        defaultValue: {
          summary: '',
        },
      },

      description:
        'Icon color variant used by the Plumage Max layout.',
    },

    position: {
      control:
        'select',

      options: [
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ],

      table: {
        category:
          'Component Props',

        defaultValue: {
          summary:
            'bottom-right',
        },
      },

      description:
        'Positions the toaster region.',
    },

    plumageToastMax: {
      control:
        'boolean',

      name:
        'plumage-toast-max',

      table: {
        category:
          'Component Props',

        defaultValue: {
          summary:
            false,
        },
      },

      description:
        'Switches between Standard and Plumage Max layouts.',
    },

    appendToast: {
      control:
        'boolean',

      name:
        'append-toast',

      table: {
        category:
          'Component Props',

        defaultValue: {
          summary:
            false,
        },
      },

      description:
        'Controls live insertion order. Preview mode uses declarative fixed ordering.',
    },

    maxWidth: {
      control: 'text',

      name:
        'max-width',

      table: {
        category:
          'Component Props',

        defaultValue: {
          summary:
            '550',
        },
      },

      description:
        'Maximum toaster width. Numeric values are interpreted as pixels.',
    },

    noAnimation: {
      control:
        'boolean',

      name:
        'no-animation',

      table: {
        category:
          'Component Props',

        defaultValue: {
          summary:
            false,
        },
      },

      description:
        'Disables live animation. Preview mode renders directly in the visible state.',
    },

    noHoverPause: {
      control:
        'boolean',

      name:
        'no-hover-pause',

      table: {
        category:
          'Component Props',

        defaultValue: {
          summary:
            false,
        },
      },

      description:
        'Prevents hover from pausing live dismissal timers. Preview mode does not run timers.',
    },

    persistent: {
      control:
        'boolean',

      table: {
        category:
          'Component Props',

        defaultValue: {
          summary:
            false,
        },
      },

      description:
        'Prevents automatic live dismissal. Preview items remain rendered without lifecycle timers.',
    },
  },

  args: {
    ariaLabel:
      'Notifications',

    focusOnShow:
      false,

    additionalHeaderContent:
      '43 seconds ago',

    bodyClass:
      '',

    contentHtml:
      '',

    duration:
      5000,

    headerClass:
      '',

    isStatus:
      false,

    message:
      'This is a message for the toast body.',

    noCloseButton:
      false,

    noTime:
      false,

    svgIcon:
      'exclamation-triangle-outline',

    toastTitle:
      'Title Text',

    variant:
      '',

    toastId:
      'plumage-toasts-component',

    position:
      'bottom-right',

    plumageToastMax:
      false,

    appendToast:
      false,

    maxWidth:
      550,

    noAnimation:
      false,

    noHoverPause:
      false,

    persistent:
      false,
  },
};

export const DefaultToast = {
  name:
    'Standard: Toast',

  args: {
    plumageToastMax:
      false,
  },

  render: (args, context) =>
    createPlumageToastComponentPreview(
      args,
      context,
      {
        labelText:
          'Standard Plumage toast styling preview:',
      },
    ),

  parameters: {
    docs: {
      source: {
        language: 'html',

        transform:
          (_code, context) =>
            buildComponentUsageSource(
              context.args,
              {},
              'plumage-toast-standard',
            ),
      },

      story: {
        height:
          '220px',
      },

      description: {
        story:
          'Rendered by the actual Plumage component. Turning `plumage-toast-max` on changes both the preview and generated Show Code.',
      },
    },
  },
};

export const StandardWithoutTime = {
  name:
    'Standard: Without Time',

  args: {
    plumageToastMax:
      false,

    noTime:
      true,
  },

  render: (args, context) =>
    createPlumageToastComponentPreview(
      args,
      context,
      {
        labelText:
          'Standard Plumage toast without a time label:',
      },
    ),

  parameters: {
    docs: {
      source: {
        language: 'html',

        transform:
          (_code, context) =>
            buildComponentUsageSource(
              context.args,
              {},
              'plumage-toast-no-time',
            ),
      },

      story: {
        height:
          '220px',
      },

      description: {
        story:
          'Starts with the time hidden. The `no-time` and `plumage-toast-max` controls remain fully interactive.',
      },
    },
  },
};

export const PlumageToastMax = {
  name:
    'Plumage Max: Toast',

  args: {
    plumageToastMax:
      true,

    position:
      'top-right',

    variant:
      'danger',

    svgIcon:
      'exclamation-circle-fill',

    contentHtml:
      '<div><div>This is data</div><div>This is data</div></div>',
  },

  render: (args, context) =>
    createPlumageToastComponentPreview(
      args,
      context,
      {
        labelText:
          'Plumage Max toast styling preview:',
      },
    ),

  parameters: {
    docs: {
      source: {
        language: 'html',

        transform:
          (_code, context) =>
            buildComponentUsageSource(
              context.args,
              {},
              'plumage-toast-max',
            ),
      },

      story: {
        height:
          '220px',
      },

      description: {
        story:
          'Starts in Plumage Max mode. Turning `plumage-toast-max` off switches the actual component back to the Standard layout.',
      },
    },
  },
};

export const PlumageMaxVariantColors = {
  name:
    'Plumage Max: Icon Variant Colors (Stacked)',

  args: {
    plumageToastMax:
      true,

    position:
      'top-right',

    svgIcon:
      'info-fill',
  },

  render: (args, context) =>
    createPlumageToastComponentPreview(
      args,
      context,
      {
        labelText:
          'Plumage Max icon variants:',

        toasts: [
          {
            message:
              'Primary icon color',

            variant:
              'primary',
          },

          {
            message:
              'Secondary icon color',

            variant:
              'secondary',
          },

          {
            message:
              'Danger icon color',

            variant:
              'danger',
          },

          {
            message:
              'Warning icon color',

            variant:
              'warning',
          },

          {
            message:
              'Success icon color',

            variant:
              'success',
          },

          {
            message:
              'Info icon color',

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

        transform:
          (_code, context) =>
            buildMultipleComponentUsageSource(
              context.args,
              [
                {
                  id:
                    'plumage-toast-primary',

                  message:
                    'Primary icon color',

                  variant:
                    'primary',
                },

                {
                  id:
                    'plumage-toast-secondary',

                  message:
                    'Secondary icon color',

                  variant:
                    'secondary',
                },

                {
                  id:
                    'plumage-toast-danger',

                  message:
                    'Danger icon color',

                  variant:
                    'danger',
                },

                {
                  id:
                    'plumage-toast-warning',

                  message:
                    'Warning icon color',

                  variant:
                    'warning',
                },

                {
                  id:
                    'plumage-toast-success',

                  message:
                    'Success icon color',

                  variant:
                    'success',
                },

                {
                  id:
                    'plumage-toast-info',

                  message:
                    'Info icon color',

                  variant:
                    'info',
                },
              ],
            ),
      },

      story: {
        height:
          '580px',
      },

      description: {
        story:
          'Six variant examples rendered by the actual component. Turning `plumage-toast-max` off changes the whole preview to the Standard layout.',
      },
    },
  },
};

export const StandardExamples = {
  name:
    'Standard: Examples (Stacked)',

  args: {
    plumageToastMax:
      false,

    position:
      'top-right',
  },

  render: (args, context) =>
    createPlumageToastComponentPreview(
      args,
      context,
      {
        labelText:
          'Standard Plumage examples:',

        toasts: [
          {
            toastTitle:
              'Information',

            message:
              'Standard toast with generated time.',
          },

          {
            toastTitle:
              'No Time',

            message:
              'Standard toast without a time.',

            noTime:
              true,
          },

          {
            toastTitle:
              'No Close',

            message:
              'Standard toast without a close button.',

            noCloseButton:
              true,
          },
        ],
      },
    ),

  parameters: {
    docs: {
      source: {
        language: 'html',

        transform:
          (_code, context) =>
            buildMultipleComponentUsageSource(
              context.args,
              [
                {
                  id:
                    'plumage-toast-information',

                  toastTitle:
                    'Information',

                  message:
                    'Standard toast with generated time.',
                },

                {
                  id:
                    'plumage-toast-no-time',

                  toastTitle:
                    'No Time',

                  message:
                    'Standard toast without a time.',

                  noTime:
                    true,
                },

                {
                  id:
                    'plumage-toast-no-close',

                  toastTitle:
                    'No Close',

                  message:
                    'Standard toast without a close button.',

                  noCloseButton:
                    true,
                },
              ],
            ),
      },

      story: {
        height:
          '320px',
      },

      description: {
        story:
          'Standard Plumage examples using the real component and declarative preview data.',
      },
    },
  },
};

export const AccessibilityMatrix = {
  name:
    'Accessibility Matrix (computed)',

  render: (_args, context) => {
    const ids =
      makeIds(
        {
          alert:
            'mxAlert',

          status:
            'mxStatus',

          noClose:
            'mxNoClose',

          focus:
            'mxFocus',

          max:
            'mxMax',

          noTime:
            'mxNoTime',

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
      'Computed Plumage component API examples. No live toast lifecycle is executed.';

    header.append(
      title,
      description,
    );

    wrap.appendChild(header);

    const makeCard =
      titleText => {
        const card =
          document.createElement(
            'div',
          );

        card.className =
          'toasts-accessibility-matrix__card';

        const cardTitle =
          document.createElement(
            'div',
          );

        cardTitle.className =
          'toasts-accessibility-matrix__card-title';

        cardTitle.textContent =
          titleText;

        const output =
          document.createElement(
            'pre',
          );

        output.className =
          'toasts-accessibility-matrix__output';

        card.append(
          cardTitle,
          output,
        );

        wrap.appendChild(
          card,
        );

        return output;
      };

    const compute =
      config => {
        const numericId =
          12345;

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
            role:
              'region',

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
            id:
              outerId,

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

            layout:
              config.plumageToastMax
                ? 'Plumage Max'
                : 'Standard Plumage',

            timeVisible:
              !config.plumageToastMax &&
              !config.noTime,

            timeSource:
              !config.plumageToastMax &&
              !config.noTime
                ? 'Generated current Zulu time'
                : null,

            focusTargetId:
              contentId,

            closeButton:
              config.noCloseButton
                ? null
                : {
                    id:
                      closeId,

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

            plumageToastMax:
              !!config.plumageToastMax,

            noTime:
              !!config.noTime,

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
        'plumage-toasts-component',

      toastTitle:
        'Notice',

      isStatus:
        false,

      noCloseButton:
        false,

      noTime:
        false,

      position:
        'top-right',

      plumageToastMax:
        false,

      focusOnShow:
        false,

      maxWidth:
        550,
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
      'Plumage Max toast',
    ).textContent =
      JSON.stringify(
        compute({
          ...base,

          scenario:
            'Plumage Max toast',

          toastId:
            ids.max,

          plumageToastMax:
            true,
        }),
        null,
        2,
      );

    makeCard(
      'Standard without time',
    ).textContent =
      JSON.stringify(
        compute({
          ...base,

          scenario:
            'Standard without time',

          toastId:
            ids.noTime,

          noTime:
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
            '42rem',
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

        code: `<plumage-toasts-component
  id="plumage-toast-example"
  aria-label="Notifications"
  toast-id="plumage-toasts-component"
  position="bottom-right"
  duration="5000"
  max-width="550"
></plumage-toasts-component>`,
      },

      description: {
        story:
          'Computed accessibility and layout reference only. No live Plumage toast lifecycle is executed.',
      },
    },
  },
};
