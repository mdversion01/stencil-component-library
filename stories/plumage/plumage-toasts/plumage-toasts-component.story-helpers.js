// ============================================================================
// File: stories/plumage/plumage-toasts/
//       plumage-toasts-component.story-helpers.js
// ============================================================================

const TAG =
  'plumage-toasts-component';

const COMPONENT_DEFAULTS = {
  ariaLabel:
    'Notifications',

  toastId:
    'plumage-toasts-component',

  position:
    'bottom-right',

  duration:
    5000,

  maxWidth:
    550,
};

const escapeHtml = value =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const sanitizeId = value =>
  String(
    value ||
    'plumage-toast-story',
  )
    .toLowerCase()
    .replace(
      /[^a-z0-9_-]+/g,
      '-',
    )
    .replace(
      /^-+|-+$/g,
      '',
    ) ||
  'plumage-toast-story';

export const makeIds = (
  baseMap,
  context,
) => {
  const scope =
    sanitizeId(
      context?.id ||
      'plumage-toast-story',
    );

  const result = {};

  Object.entries(baseMap).forEach(
    ([key, value]) => {
      result[key] =
        `${value}-${scope}`;
    },
  );

  return result;
};

export const normalizeMaxWidth =
  value => {
    if (
      typeof value === 'number'
    ) {
      return `${value}px`;
    }

    const maxWidth =
      String(
        value ?? '',
      ).trim();

    if (!maxWidth) {
      return '550px';
    }

    if (
      /^\d+(\.\d+)?$/.test(
        maxWidth,
      )
    ) {
      return `${maxWidth}px`;
    }

    return maxWidth;
  };

const buildPreviewItem = config => {
  const item = {
    toastTitle:
      config.toastTitle ||
      'Title Text',

    additionalHdrContent:
      config.additionalHeaderContent ||
      undefined,

    iconVariantClass:
      config.variant ||
      '',

    duration:
      Number.isFinite(
        Number(
          config.duration,
        ),
      )
        ? Number(
            config.duration,
          )
        : COMPONENT_DEFAULTS.duration,

    svgIcon:
      config.svgIcon ||
      undefined,

    persistent:
      !!config.persistent,

    noTime:
      !!config.noTime,

    noCloseButton:
      !!config.noCloseButton,

    bodyClass:
      config.bodyClass ||
      undefined,

    headerClass:
      config.headerClass ||
      undefined,

    isStatus:
      !!config.isStatus,

    noHoverPause:
      true,
  };

  /*
   * Omit time unless explicitly supplied. The actual component-generated
   * current Zulu time remains authoritative.
   */
  if (
    config.time !== undefined &&
    config.time !== null &&
    String(config.time).trim()
  ) {
    item.time =
      String(config.time);
  }

  if (
    config.contentHtml &&
    String(
      config.contentHtml,
    ).trim()
  ) {
    item.contentHtml =
      String(
        config.contentHtml,
      );

    return item;
  }

  item.content =
    config.content ??
    config.message ??
    'This is a default toast example!';

  return item;
};

const setBooleanAttribute = (
  element,
  name,
  value,
) => {
  if (value) {
    element.setAttribute(
      name,
      '',
    );

    return;
  }

  element.removeAttribute(
    name,
  );
};

const setOptionalAttribute = (
  element,
  name,
  value,
) => {
  if (
    value === undefined ||
    value === null ||
    String(value).trim() === ''
  ) {
    element.removeAttribute(
      name,
    );

    return;
  }

  element.setAttribute(
    name,
    String(value),
  );
};

const applyHostAttributes = (
  host,
  config,
) => {
  host.setAttribute(
    'toast-id',
    config.toastId ||
      COMPONENT_DEFAULTS.toastId,
  );

  host.setAttribute(
    'position',
    config.position ||
      COMPONENT_DEFAULTS.position,
  );

  host.setAttribute(
    'aria-label',
    config.ariaLabel ||
      COMPONENT_DEFAULTS.ariaLabel,
  );

  host.setAttribute(
    'duration',
    String(
      config.duration ??
        COMPONENT_DEFAULTS.duration,
    ),
  );

  host.setAttribute(
    'max-width',
    String(
      config.maxWidth ??
        COMPONENT_DEFAULTS.maxWidth,
    ),
  );

  setOptionalAttribute(
    host,
    'variant',
    config.variant,
  );

  setOptionalAttribute(
    host,
    'svg-icon',
    config.svgIcon,
  );

  setOptionalAttribute(
    host,
    'header-class',
    config.headerClass,
  );

  setOptionalAttribute(
    host,
    'body-class',
    config.bodyClass,
  );

  setOptionalAttribute(
    host,
    'toast-title',
    config.toastTitle,
  );

  setOptionalAttribute(
    host,
    'message',
    config.message,
  );

  setOptionalAttribute(
    host,
    'additional-header-content',
    config.additionalHeaderContent,
  );

  /*
   * Do not set a time attribute unless the Storybook user explicitly
   * provides one.
   */
  setOptionalAttribute(
    host,
    'time',
    config.time,
  );

  setBooleanAttribute(
    host,
    'plumage-toast-max',
    !!config.plumageToastMax,
  );

  setBooleanAttribute(
    host,
    'append-toast',
    !!config.appendToast,
  );

  setBooleanAttribute(
    host,
    'no-animation',
    !!config.noAnimation,
  );

  setBooleanAttribute(
    host,
    'no-hover-pause',
    !!config.noHoverPause,
  );

  setBooleanAttribute(
    host,
    'persistent',
    !!config.persistent,
  );

  setBooleanAttribute(
    host,
    'is-status',
    !!config.isStatus,
  );

  setBooleanAttribute(
    host,
    'no-close-button',
    !!config.noCloseButton,
  );

  setBooleanAttribute(
    host,
    'no-time',
    !!config.noTime,
  );

  setBooleanAttribute(
    host,
    'focus-on-show',
    !!config.focusOnShow,
  );
};

const applyHostPropertiesAfterUpgrade = (
  host,
  config,
  previewToasts,
) => {
  host.previewToasts =
    previewToasts;

  if (
    config.contentHtml !== undefined
  ) {
    host.contentHtml =
      config.contentHtml;
  }
};

export const createPlumageToastComponentPreview = (
  args,
  context,
  {
    labelText,
    overrides = {},
    toasts,
  } = {},
) => {
  /*
   * Controls are authoritative.
   */
  const config = {
    ...overrides,
    ...args,
  };

  const wrapper =
    document.createElement('div');

  wrapper.className =
    'cwrapper';

  const section =
    document.createElement('section');

  section.className =
    'display-box-demo';

  if (labelText) {
    const label =
      document.createElement('div');

    label.textContent =
      labelText;

    label.style.marginBottom =
      '8px';

    label.style.fontSize =
      '0.75rem';

    section.appendChild(label);
  }

  const definitions =
    toasts?.length
      ? toasts
      : [{}];

  const previewToasts =
    definitions.map(
      toastOverrides =>
        buildPreviewItem({
          ...config,
          ...toastOverrides,
        }),
    );

  const host =
    document.createElement(TAG);

  host.id =
    `${sanitizeId(context?.id)}-host`;

  applyHostAttributes(
    host,
    config,
  );

  section.appendChild(host);
  wrapper.appendChild(section);

  void customElements
    .whenDefined(TAG)
    .then(() => {
      applyHostPropertiesAfterUpgrade(
        host,
        config,
        previewToasts,
      );
    });

  return wrapper;
};

const appendAttribute = (
  attributes,
  name,
  value,
) => {
  attributes.push(
    `${name}="${escapeHtml(value)}"`,
  );
};

const appendOptionalAttribute = (
  attributes,
  name,
  value,
) => {
  if (
    value === undefined ||
    value === null ||
    String(value).trim() === ''
  ) {
    return;
  }

  appendAttribute(
    attributes,
    name,
    value,
  );
};

const appendBooleanAttribute = (
  attributes,
  name,
  value,
) => {
  if (value === true) {
    attributes.push(name);
  }
};

export const buildComponentUsageSource = (
  args,
  overrides = {},
  id = 'plumage-toast-example',
) => {
  /*
   * Controls must also win in Show Code.
   */
  const config = {
    ...overrides,
    ...args,
  };

  const attributes = [];

  appendAttribute(
    attributes,
    'id',
    id,
  );

  appendAttribute(
    attributes,
    'aria-label',
    config.ariaLabel ??
      COMPONENT_DEFAULTS.ariaLabel,
  );

  appendAttribute(
    attributes,
    'toast-id',
    config.toastId ||
      COMPONENT_DEFAULTS.toastId,
  );

  appendAttribute(
    attributes,
    'position',
    config.position ||
      COMPONENT_DEFAULTS.position,
  );

  appendAttribute(
    attributes,
    'duration',
    config.duration ??
      COMPONENT_DEFAULTS.duration,
  );

  appendAttribute(
    attributes,
    'max-width',
    config.maxWidth ??
      COMPONENT_DEFAULTS.maxWidth,
  );

  appendOptionalAttribute(
    attributes,
    'variant',
    config.variant,
  );

  appendBooleanAttribute(
    attributes,
    'plumage-toast-max',
    !!config.plumageToastMax,
  );

  appendBooleanAttribute(
    attributes,
    'append-toast',
    !!config.appendToast,
  );

  appendBooleanAttribute(
    attributes,
    'no-animation',
    !!config.noAnimation,
  );

  appendBooleanAttribute(
    attributes,
    'no-hover-pause',
    !!config.noHoverPause,
  );

  appendBooleanAttribute(
    attributes,
    'persistent',
    !!config.persistent,
  );

  appendBooleanAttribute(
    attributes,
    'is-status',
    !!config.isStatus,
  );

  appendBooleanAttribute(
    attributes,
    'no-close-button',
    !!config.noCloseButton,
  );

  appendBooleanAttribute(
    attributes,
    'no-time',
    !!config.noTime,
  );

  appendBooleanAttribute(
    attributes,
    'focus-on-show',
    !!config.focusOnShow,
  );

  appendOptionalAttribute(
    attributes,
    'svg-icon',
    config.svgIcon,
  );

  appendOptionalAttribute(
    attributes,
    'header-class',
    config.headerClass,
  );

  appendOptionalAttribute(
    attributes,
    'body-class',
    config.bodyClass,
  );

  appendOptionalAttribute(
    attributes,
    'toast-title',
    config.toastTitle,
  );

  appendOptionalAttribute(
    attributes,
    'message',
    config.message,
  );

  appendOptionalAttribute(
    attributes,
    'additional-header-content',
    config.additionalHeaderContent,
  );

  appendOptionalAttribute(
    attributes,
    'content-html',
    config.contentHtml,
  );

  appendOptionalAttribute(
    attributes,
    'time',
    config.time,
  );

  const markup = attributes
    .map(attribute => `  ${attribute}`)
    .join('\n');

  return `<plumage-toasts-component
${markup}
></plumage-toasts-component>`;
};

export const buildMultipleComponentUsageSource = (
  args,
  examples,
  overrides = {},
) =>
  examples
    .map((example, index) => {
      const {
        id,
        ...exampleArgs
      } = example;

      const combinedArgs = {
        ...args,
        ...exampleArgs,
      };

      return buildComponentUsageSource(
        combinedArgs,
        overrides,
        id ||
          `plumage-toast-${index + 1}`,
      );
    })
    .join('\n\n');
