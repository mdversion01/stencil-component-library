// src/stories/timepicker-manager.stories.js

export default {
  title: 'Components/Timepicker/Timepicker Manager',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The Timepicker Manager component wraps a timepicker input and forwards props to either <timepicker-component> or <plumage-timepicker-component>. It also forwards accessibility overrides (aria-label/labelledby/describedby) with aria-labelledby taking precedence.',
      },
      source: {
        type: 'dynamic',
        language: 'html',
        transform: (_code, ctx) => Template(ctx.args),
      },
    },
  },
  argTypes: {
    /* -----------------------------
     Accessibility
    ------------------------------ */
    ariaLabel: {
      control: 'text',
      name: 'aria-label',
      description: 'Accessible label for the timepicker input (used when aria-labelledby not provided).',
      table: { category: 'Accessibility' },
    },
    ariaLabelledby: {
      control: 'text',
      name: 'aria-labelledby',
      description:
        'ID(s) of element(s) that label the timepicker input (space-separated). Takes precedence over aria-label.',
      table: { category: 'Accessibility' },
    },
    ariaDescribedby: {
      control: 'text',
      name: 'aria-describedby',
      description:
        'ID(s) of external description/help elements (space-separated). If validationMessage is present, manager appends the child validation element id.',
      table: { category: 'Accessibility' },
    },

    /* -----------------------------
     Labeling
    ------------------------------ */
    showLabel: {
      control: 'boolean',
      name: 'show-label',
      table: { defaultValue: { summary: true }, category: 'Labeling' },
      description:
        'Whether to show the label (for demo purposes; if not showing a visible label, prefer aria-labelledby or aria-label).',
    },
    labelText: {
      control: 'text',
      name: 'label-text',
      description: 'Text for the label (if show-label is true)',
      table: { category: 'Labeling' },
    },
    required: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Labeling' },
      name: 'required',
      description: 'Show required indicator (label asterisk) where supported.',
    },

    /* -----------------------------
     Input Attributes
    ------------------------------ */
    inputId: {
      control: 'text',
      name: 'input-id',
      description: 'ID for the timepicker input (should be unique per instance).',
      table: { category: 'Input Attributes' },
    },
    inputName: {
      control: 'text',
      name: 'input-name',
      description: 'Name attribute for the timepicker input.',
      table: { category: 'Input Attributes' },
    },

    /* -----------------------------
     Layout & Sizing
    ------------------------------ */
    inputWidth: {
      control: { type: 'number', min: 0, step: 1 },
      name: 'input-width',
      description: 'Custom width for the timepicker input (px).',
      table: { category: 'Layout & Sizing' },
    },
    size: {
      control: { type: 'select' },
      options: ['', 'sm', 'lg'],
      description: 'Size of the timepicker input.',
      table: { category: 'Layout & Sizing' },
    },

    /* -----------------------------
     Format & Options
    ------------------------------ */
    isTwentyFourHourFormat: {
      control: 'boolean',
      table: { defaultValue: { summary: true }, category: 'Format & Options' },
      name: 'is-twenty-four-hour-format',
      description: 'Initial format preference (24h).',
    },
    twelveHourOnly: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Format & Options' },
      name: 'twelve-hour-only',
      description: 'Only allow 12-hour format.',
    },
    twentyFourHourOnly: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Format & Options' },
      name: 'twenty-four-hour-only',
      description: 'Only allow 24-hour format.',
    },
    hideSeconds: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Format & Options' },
      name: 'hide-seconds',
      description: 'Hide seconds UI.',
    },

    /* -----------------------------
     UI Controls
    ------------------------------ */
    hideTimepickerBtn: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'UI Controls' },
      name: 'hide-timepicker-btn',
      description: 'Hide the timepicker toggle button.',
    },

    /* -----------------------------
     State
    ------------------------------ */
    disableTimepicker: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'State' },
      name: 'disable-timepicker',
      description:
        'Disable the timepicker (input + buttons + dropdown). Passed to child as disableTimepicker or disabled (Plumage).',
    },
    isValid: {
      control: 'boolean',
      table: { defaultValue: { summary: true }, category: 'State' },
      name: 'is-valid',
      description: 'Whether the current value is considered valid.',
    },

    /* -----------------------------
     Validation
    ------------------------------ */
    validation: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Validation' },
      name: 'validation',
      description:
        'Apply invalid styling (drives invalid/is-invalid inside the rendered timepicker). Manager will also append the child validation element id to aria-describedby when validationMessage is present.',
    },
    validationMessage: {
      control: 'text',
      name: 'validation-message',
      description: 'Validation message to display (if any).',
      table: { category: 'Validation' },
    },

    /* -----------------------------
     Rendering Mode
    ------------------------------ */
    usePlTimepicker: {
      control: 'boolean',
      table: { defaultValue: { summary: false }, category: 'Rendering Mode' },
      name: 'use-pl-timepicker',
      description: 'Render <plumage-timepicker-component> instead of <timepicker-component>.',
    },

    /* -----------------------------
     Storybook Only
    ------------------------------ */
    wrapperWidth: {
      control: { type: 'number', min: 120, step: 10 },
      description: 'Demo wrapper width (px), for Storybook only.',
      table: { category: 'Storybook Only' },
    },
  },
};

/* ---------------------------------------------
   Helpers
---------------------------------------------- */

const normalizeHtml = (html) => {
  const lines = String(html ?? '')
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

const normalizeIdList = (v) => {
  const s = String(v ?? '').trim();
  if (!s) return '';
  return s.split(/\s+/).filter(Boolean).join(' ');
};

const boolAttr = (name, on) => (on ? name : null);
const attr = (name, v) => (v === undefined || v === null || v === '' ? null : `${name}="${String(v)}"`);

/* ---------------------------------------------
   Template
---------------------------------------------- */

const Template = (args) => {
  const width = Number.isFinite(args.wrapperWidth) ? `${args.wrapperWidth}px` : '';

  const attrs = [
    attr('aria-label', args.ariaLabel),
    attr('aria-labelledby', normalizeIdList(args.ariaLabelledby)),
    attr('aria-describedby', normalizeIdList(args.ariaDescribedby)),

    boolAttr('disable-timepicker', args.disableTimepicker),
    boolAttr('hide-seconds', args.hideSeconds),
    boolAttr('hide-timepicker-btn', args.hideTimepickerBtn),
    attr('input-id', args.inputId),
    attr('input-name', args.inputName),
    attr('input-width', args.inputWidth),
    boolAttr('is-twenty-four-hour-format', args.isTwentyFourHourFormat),
    boolAttr('is-valid', args.isValid),
    attr('label-text', args.labelText),
    boolAttr('required', args.required),
    boolAttr('show-label', args.showLabel),
    attr('size', args.size),
    boolAttr('twelve-hour-only', args.twelveHourOnly),
    boolAttr('twenty-four-hour-only', args.twentyFourHourOnly),
    boolAttr('use-pl-timepicker', args.usePlTimepicker),
    boolAttr('validation', args.validation),
    attr('validation-message', args.validationMessage),
  ]
    .filter(Boolean)
    .join('\n    ');

  return normalizeHtml(`
<div class="timepicker-wrapper"${width ? ` style="width:${width};"` : ''}>
  <timepicker-manager
    ${attrs}
  ></timepicker-manager>
</div>
`);
};

/* =========================
   Stories (existing, updated where needed)
   ========================= */

export const Default = Template.bind({});
Default.args = {
  ariaLabel: 'Time Picker',
  ariaLabelledby: '', // ✅ avoid pointing to non-existent default ids
  ariaDescribedby: '',
  disableTimepicker: false,
  hideSeconds: false,
  hideTimepickerBtn: false,
  inputId: 'default-time-input',
  inputName: 'time',
  inputWidth: null,
  isTwentyFourHourFormat: true,
  isValid: true,
  labelText: 'Add Time',
  required: false,
  showLabel: true,
  size: '',
  twelveHourOnly: false,
  twentyFourHourOnly: false,
  usePlTimepicker: false,
  validation: false,
  validationMessage: '',
  wrapperWidth: 240,
};
Default.storyName = 'Default Timepicker Manager';
Default.parameters = {
  docs: {
    description: {
      story:
        'Default configuration with a visible label. For best accessibility, prefer a visible label or external aria-labelledby.',
    },
    story: { height: '220px' },
  },
};

export const SmallSize = Template.bind({});
SmallSize.args = {
  ...Default.args,
  showLabel: false,
  size: 'sm',
  inputId: 'time-input-sm',
};
SmallSize.storyName = 'Small Size (no Label)';
SmallSize.parameters = {
  docs: {
    description: {
      story:
        'Small input with no visible label. In real usage, provide aria-labelledby to an external label or aria-label.',
    },
    story: { height: '220px' },
  },
};

export const LargeWithLabel = Template.bind({});
LargeWithLabel.args = {
  ...Default.args,
  size: 'lg',
  showLabel: true,
  inputId: 'time-input-lg',
};
LargeWithLabel.storyName = 'Large Size with Label';
LargeWithLabel.parameters = {
  docs: {
    description: { story: 'Large input with a visible label.' },
    story: { height: '220px' },
  },
};

export const TwelveHourOnly = Template.bind({});
TwelveHourOnly.args = {
  ...Default.args,
  isTwentyFourHourFormat: false,
  twelveHourOnly: true,
  twentyFourHourOnly: false,
  labelText: '12-hour Time',
  inputId: 'time-12h-only',
  wrapperWidth: 340,
};
TwelveHourOnly.storyName = '12-Hour Only';
TwelveHourOnly.parameters = {
  docs: {
    description: { story: 'Only allow 12-hour format.' },
    story: { height: '220px' },
  },
};

export const TwentyFourHourOnlyHideSeconds = Template.bind({});
TwentyFourHourOnlyHideSeconds.args = {
  ...Default.args,
  twentyFourHourOnly: true,
  twelveHourOnly: false,
  hideSeconds: true,
  labelText: '24-hour (HH:mm)',
  inputId: 'time-24h-only',
  wrapperWidth: 340,
};
TwentyFourHourOnlyHideSeconds.storyName = '24-Hour Only (with Seconds Hidden)';
TwentyFourHourOnlyHideSeconds.parameters = {
  docs: {
    description: { story: 'Only allow 24-hour format and hide seconds.' },
    story: { height: '220px' },
  },
};

export const CustomInputWidth = Template.bind({});
CustomInputWidth.args = {
  ...Default.args,
  inputId: 'time-custom-width',
  labelText: 'Custom Width',
  inputWidth: 260,
  wrapperWidth: 420,
};
CustomInputWidth.storyName = 'Custom Input Width';
CustomInputWidth.parameters = {
  docs: {
    description: { story: 'Custom input width via input-width.' },
    story: { height: '220px' },
  },
};

export const WithValidation = Template.bind({});
WithValidation.args = {
  ...Default.args,
  inputId: 'time-input-validation',
  validation: true,
  isValid: false,
  validationMessage: 'Please enter a valid time.',
  wrapperWidth: 420,
};
WithValidation.storyName = 'With Validation Message';
WithValidation.parameters = {
  docs: {
    description: {
      story:
        'Invalid styling + validation message. Manager appends the child validation element id to aria-describedby when validationMessage is present.',
    },
    story: { height: '240px' },
  },
};

export const PlumageStyle = Template.bind({});
PlumageStyle.args = {
  ...Default.args,
  usePlTimepicker: true,
  inputId: 'time-plumage',
  labelText: 'Add Time',
  wrapperWidth: 520,
};
PlumageStyle.storyName = 'Plumage Style Timepicker';
PlumageStyle.parameters = {
  docs: {
    description: {
      story:
        'Renders the <plumage-timepicker-component> when use-pl-timepicker is true. Disabled mapping differs (disabled vs disableTimepicker).',
    },
    story: { height: '240px' },
  },
};

/* ============================== Accessibility Matrix (computed) ============================== */

const splitIds = (v) => String(v || '').trim().split(/\s+/).filter(Boolean);

const resolveId = (scopeRoot, id) => {
  if (!id) return false;
  try {
    return !!scopeRoot.querySelector(`#${CSS.escape(id)}`);
  } catch {
    return false;
  }
};

const getChild = (mgr) =>
  mgr?.querySelector('plumage-timepicker-component') ||
  mgr?.querySelector('timepicker-component') ||
  null;

const getSnapshot = (mgr, scopeRoot) => {
  const child = getChild(mgr);

  const childTag = child?.tagName?.toLowerCase?.() ?? null;

  const childProps = child
    ? {
        tag: childTag,
        ariaLabel: child.ariaLabel ?? null,
        ariaLabelledby: child.ariaLabelledby ?? null,
        ariaDescribedby: child.ariaDescribedby ?? null,
        // state
        disableTimepicker:
          childTag === 'plumage-timepicker-component'
            ? child.disabled ?? null
            : child.disableTimepicker ?? null,
        showLabel: child.showLabel ?? null,
        inputId: child.inputId ?? null,
      }
    : null;

  const labelledIds = splitIds(childProps?.ariaLabelledby);
  const describedIds = splitIds(childProps?.ariaDescribedby);

  // Manager (current implementation) appends `${inputId}-validation` when validationMessage is present.
  const mgrInputId = mgr?.getAttribute?.('input-id') || '';
  const inferredValidationId = mgrInputId ? `${mgrInputId}-validation` : null;

  return {
    managerTag: mgr?.tagName?.toLowerCase?.() ?? null,
    managerAttrs: {
      'aria-label': mgr?.getAttribute?.('aria-label') ?? null,
      'aria-labelledby': mgr?.getAttribute?.('aria-labelledby') ?? null,
      'aria-describedby': mgr?.getAttribute?.('aria-describedby') ?? null,
      'input-id': mgrInputId || null,
      'validation-message': mgr?.getAttribute?.('validation-message') ?? null,
      validation: mgr?.hasAttribute?.('validation') ?? null,
      'is-valid': mgr?.getAttribute?.('is-valid') ?? null,
      'use-pl-timepicker': mgr?.hasAttribute?.('use-pl-timepicker') ?? null,
      'disable-timepicker': mgr?.hasAttribute?.('disable-timepicker') ?? null,
    },
    child: childProps,
    resolved: {
      labelledbyIds: labelledIds,
      labelledbyAllResolve: labelledIds.every((id) => resolveId(scopeRoot, id)),
      describedbyIds: describedIds,
      describedbyAllResolve: describedIds.every((id) => resolveId(scopeRoot, id)),
      inferredValidationId,
      inferredValidationResolves: inferredValidationId ? resolveId(scopeRoot, inferredValidationId) : false,
    },
  };
};

export const AccessibilityMatrix = {
  name: 'Accessibility Matrix (computed)',
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.display = 'grid';
    wrap.style.gap = '16px';
    wrap.style.maxWidth = '980px';

    const header = document.createElement('div');
    header.innerHTML = `
      <strong>Accessibility matrix</strong>
      <div style="opacity:.8">
        Renders multiple configurations and prints computed labeling/description wiring for the manager + child:
        <code>aria-label</code>, <code>aria-labelledby</code>, <code>aria-describedby</code>, and inferred validation id.
      </div>
    `;
    wrap.appendChild(header);

    const card = (title, storyArgs, extraHtml = '', containerStyle = '') => {
      const box = document.createElement('div');
      box.style.border = '1px solid #ddd';
      box.style.borderRadius = '10px';
      box.style.padding = '12px';
      box.style.display = 'grid';
      box.style.gap = '10px';

      const t = document.createElement('div');
      t.style.fontWeight = '600';
      t.textContent = title;

      const demo = document.createElement('div');
      if (containerStyle) demo.setAttribute('style', containerStyle);

      const pre = document.createElement('pre');
      pre.style.margin = '0';
      pre.style.padding = '10px';
      pre.style.borderRadius = '8px';
      pre.style.overflow = 'auto';
      pre.style.border = '1px solid #eee';
      pre.style.background = '#fafafa';
      pre.textContent = 'Loading…';

      const mount = document.createElement('div');
      mount.innerHTML = normalizeHtml(`
        ${extraHtml}
        ${Template({ ...Default.args, ...storyArgs })}
      `);

      demo.appendChild(mount);

      const update = async () => {
        const mgr = mount.querySelector('timepicker-manager');

        if (mgr?.componentOnReady) {
          try {
            await mgr.componentOnReady();
          } catch (_e) {}
        } else if (window.customElements?.whenDefined) {
          try {
            await customElements.whenDefined('timepicker-manager');
          } catch (_e) {}
        }

        const child = getChild(mgr);
        if (child?.componentOnReady) {
          try {
            await child.componentOnReady();
          } catch (_e) {}
        }

        pre.textContent = JSON.stringify(getSnapshot(mgr, mount), null, 2);
      };

      queueMicrotask(() => requestAnimationFrame(update));

      box.appendChild(t);
      box.appendChild(demo);
      box.appendChild(pre);
      return box;
    };

    // Default
    wrap.appendChild(
      card('Default (visible label)', {
        showLabel: true,
        labelText: 'Add time',
        inputId: 'mx-time-default',
        inputName: 'time',
        ariaLabel: 'Time Picker',
        ariaLabelledby: '',
        ariaDescribedby: '',
        isValid: true,
        validation: false,
        validationMessage: '',
        usePlTimepicker: false,
        wrapperWidth: 260,
      }),
    );

    // Inline (simulated)
    wrap.appendChild(
      card(
        'Inline (external aria-labelledby + aria-describedby)',
        {
          showLabel: false,
          labelText: '',
          inputId: 'mx-time-inline',
          ariaLabel: 'Ignored',
          ariaLabelledby: 'mx-inline-label',
          ariaDescribedby: 'mx-inline-help',
          isValid: true,
          validation: false,
          validationMessage: '',
          usePlTimepicker: false,
          wrapperWidth: 260,
        },
        `
        <div id="mx-inline-label" style="font-weight:600; margin-bottom:6px;">External label for time</div>
        <div id="mx-inline-help" style="opacity:.8; margin-bottom:8px;">Help text: enter time in HH:mm.</div>
        `,
      ),
    );

    // Horizontal (simulated)
    wrap.appendChild(
      card(
        'Horizontal (simulated layout, external labelledby)',
        {
          showLabel: false,
          labelText: '',
          inputId: 'mx-time-horizontal',
          ariaLabelledby: 'mx-horizontal-label',
          ariaDescribedby: '',
          isValid: true,
          usePlTimepicker: false,
          wrapperWidth: 320,
        },
        `
        <div style="display:grid; grid-template-columns:220px 1fr; gap:12px; align-items:center; max-width:860px; margin-bottom:8px;">
          <div id="mx-horizontal-label" style="font-weight:600;">Time (horizontal label area)</div>
        </div>
        `,
        'max-width:860px;',
      ),
    );

    // Error/validation (simulated)
    wrap.appendChild(
      card(
        'Error / validation (simulated, describedby + inferred validation id)',
        {
          showLabel: true,
          labelText: 'Add time',
          inputId: 'mx-time-error',
          ariaLabel: '',
          ariaLabelledby: '',
          ariaDescribedby: 'mx-error-help',
          validation: true,
          isValid: false,
          validationMessage: 'Time is required.',
          usePlTimepicker: false,
          wrapperWidth: 420,
        },
        `
        <div id="mx-error-help" style="color:#444; font-size:12px; margin-bottom:8px;">
          Help: required field. Manager should append <code>mx-time-error-validation</code> to aria-describedby when validationMessage exists.
        </div>
        `,
      ),
    );

    // Disabled
    wrap.appendChild(
      card('Disabled (plumage)', {
        usePlTimepicker: true,
        disableTimepicker: true,
        showLabel: true,
        labelText: 'Disabled time',
        inputId: 'mx-time-disabled',
        ariaLabel: 'Disabled time picker',
        ariaLabelledby: '',
        ariaDescribedby: '',
        isValid: true,
        validation: false,
        validationMessage: '',
        wrapperWidth: 320,
      }),
    );

    return wrap;
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Prints computed accessibility wiring for the timepicker manager + its child: aria precedence (labelledby > label), describedby forwarding + validation id appending, simulated inline/horizontal layouts, validation, and disabled state.',
      },
    },
  },
};
