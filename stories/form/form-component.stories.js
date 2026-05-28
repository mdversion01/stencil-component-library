import DocsPage from './form-component.docs.mdx';
import {
  buildDocsHtml,
  buildForm,
  makeInput,
  makeSelect,
  makeTextarea,
  renderMatrixRow,
  template,
} from './form-component.story-helpers.js';

export default {
  title: 'Form/Form Wrapper',
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: DocsPage,
      description: {
        component:
          'A flexible wrapper for forms that can render with or without a native `<form>` element. Supports fieldsets, legends, and various layout and styling options.',
      },
      source: {
        language: 'html',
        transform: (_src, ctx) => buildDocsHtml(ctx.args),
      },
    },
  },
  argTypes: {
    action: {
      control: 'text',
      table: { category: 'Form Attributes' },
      description: 'The URL where the form data will be sent on submit.',
    },
    method: {
      control: 'text',
      table: { category: 'Form Attributes' },
      description: 'The HTTP method to use when submitting the form.',
    },

    formAriaLabel: {
      control: 'text',
      name: 'form-aria-label',
      table: { category: 'Accessibility' },
      description: 'Optional aria-label applied to the native <form> (only when outsideOfForm=false).',
    },
    formAriaLabelledby: {
      control: 'text',
      name: 'form-aria-labelledby',
      table: { category: 'Accessibility' },
      description: 'Optional aria-labelledby applied to the native <form> (only when outsideOfForm=false).',
    },
    formAriaDescribedby: {
      control: 'text',
      name: 'form-aria-describedby',
      table: { category: 'Accessibility' },
      description: 'Optional aria-describedby applied to the native <form> (only when outsideOfForm=false).',
    },

    fieldsetAriaLabel: {
      control: 'text',
      name: 'fieldset-aria-label',
      table: { category: 'Accessibility' },
      description:
        'Optional aria-label applied to <fieldset>. Useful when fieldset=true but legend=false so the group still has a name.',
    },
    fieldsetAriaLabelledby: {
      control: 'text',
      name: 'fieldset-aria-labelledby',
      table: { category: 'Accessibility' },
      description:
        'Optional aria-labelledby applied to <fieldset>. If legend=true and these are empty, component auto-wires to legend id.',
    },
    fieldsetAriaDescribedby: {
      control: 'text',
      name: 'fieldset-aria-describedby',
      table: { category: 'Accessibility' },
      description: 'Optional aria-describedby applied to <fieldset>.',
    },

    fieldset: {
      control: 'boolean',
      table: { category: 'Fieldset & Legend', defaultValue: false },
      description: 'Whether to wrap the form fields in a `<fieldset>` element.',
    },
    legend: {
      control: 'boolean',
      table: { category: 'Fieldset & Legend', defaultValue: false },
      description: 'Whether to display a `<legend>` element for the fieldset.',
    },
    legendPosition: {
      control: { type: 'select' },
      name: 'legend-position',
      options: ['left', 'center', 'right'],
      table: { category: 'Fieldset & Legend', defaultValue: 'left' },
      description: 'The position of the legend text within the fieldset.',
    },
    legendSize: {
      control: { type: 'select' },
      name: 'legend-size',
      options: ['small', 'base', 'large', 'xlarge'],
      table: { category: 'Fieldset & Legend', defaultValue: 'base' },
      description: 'The size of the legend text.',
    },
    legendTxt: {
      control: 'text',
      name: 'legend-txt',
      table: { category: 'Fieldset & Legend' },
      description: 'The text content of the legend.',
    },

    formLayout: {
      control: { type: 'select' },
      name: 'form-layout',
      options: ['', 'horizontal', 'inline'],
      table: { category: 'Layout' },
      description:
        'The layout style for the form fields. "horizontal" typically means labels and inputs are side by side, while "inline" means fields flow horizontally like text.',
    },
    formId: {
      control: 'text',
      name: 'form-id',
      table: { category: 'Layout' },
      description: 'The id attribute for the form, useful for associating external buttons/inputs when outsideOfForm is true.',
    },

    outsideOfForm: {
      control: 'boolean',
        name: 'outside-of-form',
      table: { category: 'Rendering Mode', defaultValue: false },
      description:
        'If true, the component will render without a native `<form>` element. Useful for custom layouts or when using with frameworks that handle forms differently.',
    },

    bcolor: {
      control: 'text',
      table: { category: 'Styles' },
      description: 'Border color for the fieldset (if fieldset=true).',
    },
    bradius: {
      control: 'number',
      table: { category: 'Styles' },
      description: 'Border radius for the fieldset (if fieldset=true).',
    },
    bstyle: {
      control: 'text',
      table: { category: 'Styles' },
      description: 'Border style for the fieldset (if fieldset=true).',
    },
    bwidth: {
      control: 'number',
      table: { category: 'Styles' },
      description: 'Border width for the fieldset (if fieldset=true).',
    },

    styles: {
      control: 'text',
      table: { category: 'Styles' },
      description: 'Additional CSS styles to apply to the fieldset or form wrapper.',
    },

    numFields: {
      control: { type: 'number', min: 1, max: 6, step: 1 },
      name: 'number-of-fields',
      table: { disable: true },
    },
    showValidation: {
      control: 'boolean',
      name: 'show-validation',
      table: { disable: true },
      description: 'Story-only helper used by Accessibility matrix to render an error block.',
    },
    validationText: {
      control: 'text',
      name: 'validation-text',
      table: { disable: true },
      description: 'Story-only helper message used by Accessibility matrix.',
    },
    disabledDemo: {
      control: 'boolean',
      name: 'disabled-demo',
      table: { disable: true },
      description: 'Story-only helper to disable child fields/buttons in Accessibility matrix.',
    },
  },
  args: {
    action: '',
    bcolor: '',
    bradius: undefined,
    bstyle: '',
    bwidth: undefined,
    fieldset: false,
    formId: 'demo-form',
    formLayout: '',
    legend: false,
    legendPosition: 'left',
    legendSize: 'base',
    legendTxt: 'Add Title Here',
    method: '',
    numFields: 2,
    outsideOfForm: false,
    styles: '',

    formAriaLabel: '',
    formAriaLabelledby: '',
    formAriaDescribedby: '',
    fieldsetAriaLabel: '',
    fieldsetAriaLabelledby: '',
    fieldsetAriaDescribedby: '',

    showValidation: false,
    validationText: 'Please fix the errors above.',
    disabledDemo: false,
  },
};

const Template = (args) => template(args);

export const Basic = Template.bind({});
Basic.args = {
  formLayout: '',
  fieldset: false,
  legend: false,
};
Basic.storyName = 'Basic Setup';
Basic.parameters = {
  docs: {
    description: {
      story: 'A simple form wrapper with no fieldset or legend, and default layout.',
    },
  },
};

export const HorizontalLayout = Template.bind({});
HorizontalLayout.args = {
  formLayout: 'horizontal',
  numFields: 3,
};
HorizontalLayout.storyName = 'Horizontal Layout';
HorizontalLayout.parameters = {
  docs: {
    description: {
      story: 'Fields are arranged in a horizontal layout, typically with labels and inputs side by side.',
    },
  },
};

export const InlineLayout = Template.bind({});
InlineLayout.args = {
  formLayout: 'inline',
  numFields: 3,
};
InlineLayout.storyName = 'Inline Layout';
InlineLayout.parameters = {
  docs: {
    description: {
      story: 'Fields flow horizontally like text, wrapping to new lines as needed.',
    },
  },
};

export const WithFieldset = Template.bind({});
WithFieldset.args = {
  fieldset: true,
  legend: false,
  legendPosition: '',
  legendTxt: '',
  legendSize: '',
};
WithFieldset.storyName = 'Using a Fieldset';
WithFieldset.parameters = {
  docs: {
    description: {
      story: 'A form wrapper that includes a fieldset but no legend.',
    },
  },
};

export const WithLegendCentered = Template.bind({});
WithLegendCentered.args = {
  fieldset: true,
  legend: true,
  legendPosition: 'left',
  legendTxt: 'Profile Details',
  bstyle: 'solid',
  bwidth: 1,
  bradius: 8,
  bcolor: '#1b2af5 !important',
  styles: 'padding: 12px;',
};
WithLegendCentered.storyName = 'Fieldset with Legend';
WithLegendCentered.parameters = {
  docs: {
    description: {
      story: 'A form wrapper that includes a fieldset and a left-aligned legend.',
    },
  },
};

export const StyledFieldsetBorders = Template.bind({});
StyledFieldsetBorders.args = {
  fieldset: true,
  legend: true,
  legendTxt: 'Contact',
  legendPosition: 'left',
  bstyle: 'dashed',
  bwidth: 2,
  bradius: 10,
  bcolor: '#94a3b8',
  styles: 'padding: 16px; background: #fafafa;',
  numFields: 2,
};
StyledFieldsetBorders.storyName = 'Styled Fieldset Borders';
StyledFieldsetBorders.parameters = {
  docs: {
    description: {
      story: 'A form wrapper that includes a fieldset with custom border styles.',
    },
  },
};

export const OutsideOfForm = (args) => {
  const fields = [
    makeInput('Tag', 'tag', !!args.disabledDemo),
    makeSelect('Category', 'cat', !!args.disabledDemo),
    makeTextarea('Notes', 'notes', !!args.disabledDemo),
  ];

  const el = buildForm(
    {
      ...args,
      outsideOfForm: true,
      fieldset: true,
      legend: true,
      legendTxt: 'Detached Layout',
      styles: 'padding: 16px 16px 16px 32px !important;',
    },
    fields,
  );

  const externalSubmit = document.createElement('button-component');
  externalSubmit.textContent = 'Submit (external)';
  externalSubmit.setAttribute('variant', 'secondary');
  externalSubmit.style.display = 'inline-block';
  externalSubmit.style.marginTop = '15px';

  if (args.disabledDemo) externalSubmit.setAttribute('disabled', '');

  const wrapper = document.createElement('div');
  wrapper.appendChild(el);
  wrapper.appendChild(externalSubmit);
  return wrapper;
};
OutsideOfForm.args = {
  formLayout: 'horizontal',
  formId: 'detached-form',
};
OutsideOfForm.storyName = 'Rendering Outside of a Native Form';
OutsideOfForm.parameters = {
  docs: {
    description: {
      story:
        'The form wrapper can render without a native `<form>` element, allowing for custom layouts or integration with frameworks that handle forms differently.',
    },
  },
};

export const ControlledActionMethod = Template.bind({});
ControlledActionMethod.args = {
  action: '/submit-here',
  method: 'post',
  formLayout: '',
  fieldset: true,
  legend: true,
  legendTxt: 'Signup',
};
ControlledActionMethod.storyName = 'Controlled Action and Method';
ControlledActionMethod.parameters = {
  docs: {
    description: {
      story: 'A form wrapper with explicitly set action and method attributes, demonstrating how to control form submission behavior.',
    },
  },
};

const kitchenSinkDefaults = {
  fieldset: true,
  legend: true,
  legendTxt: 'All Props Demo',
  bstyle: 'solid',
  bwidth: 1,
  bradius: 12,
  bcolor: '#e5e7eb',
  styles: 'padding: 16px 16px 16px 32px !important;',
  formLayout: 'horizontal',
  method: 'post',
  action: '/fake-endpoint',
};

export const KitchenSink = (args) => {
  const fields = [
    makeInput('First Name', 'first', !!args.disabledDemo),
    makeInput('Last Name', 'last', !!args.disabledDemo),
    makeInput('Email', 'email', !!args.disabledDemo),
    makeSelect('Role', 'role', !!args.disabledDemo),
    makeTextarea('About You', 'about', !!args.disabledDemo),
  ];

  return buildForm(
    {
      ...kitchenSinkDefaults,
      ...args,
    },
    fields,
  );
};

KitchenSink.args = {
  ...kitchenSinkDefaults,
};

KitchenSink.storyName = 'Kitchen Sink';
KitchenSink.parameters = {
  docs: {
    description: {
      story: 'A comprehensive example showcasing all the main features and props of the form wrapper component.',
    },
  },
};

export const AccessibilityMatrix = () => {
  const root = document.createElement('div');
  root.style.display = 'grid';
  root.style.gap = '16px';

  const intro = document.createElement('div');
  intro.innerHTML = `
    <div style="font-weight:700; font-size:14px; margin-bottom:6px;">Accessibility matrix</div>
    <div style="font-size:13px; color:#444;">
      Renders common variants and prints computed <code>role</code> + <code>aria-*</code> + IDs.
      Includes Storybook-only "validation" and "disabled" demos to help audit 508/WCAG behavior.
    </div>
  `;
  root.appendChild(intro);

  const rows = [
    {
      title: 'Default',
      args: { formLayout: '', fieldset: false, legend: false, outsideOfForm: false, showValidation: false, disabledDemo: false },
    },
    {
      title: 'Inline layout',
      args: { formLayout: 'inline', fieldset: false, legend: false, outsideOfForm: false, showValidation: false, disabledDemo: false, numFields: 3 },
    },
    {
      title: 'Horizontal layout (fieldset + legend)',
      args: { formLayout: 'horizontal', fieldset: true, legend: true, legendTxt: 'Details', outsideOfForm: false, showValidation: false, disabledDemo: false, numFields: 3 },
    },
    {
      title: 'Error/validation (storybook demo block)',
      args: {
        formLayout: '',
        fieldset: true,
        legend: true,
        legendTxt: 'Validation Demo',
        outsideOfForm: false,
        showValidation: true,
        validationText: 'Please fix the errors above.',
        formAriaDescribedby: 'form-matrix-4__validation',
        disabledDemo: false,
        numFields: 2,
      },
    },
    {
      title: 'Disabled (storybook demo disables children)',
      args: { formLayout: '', fieldset: true, legend: true, legendTxt: 'Disabled Demo', outsideOfForm: false, showValidation: false, disabledDemo: true, numFields: 2 },
    },
  ];

  rows.forEach((r, idx) => {
    const idSuffix = String(idx + 1);
    const fixedArgs =
      r.title.startsWith('Error/validation')
        ? { ...r.args, formAriaDescribedby: `form-matrix-${idSuffix}__validation` }
        : r.args;

    root.appendChild(renderMatrixRow({ title: r.title, args: fixedArgs, idSuffix }));
  });

  return root;
};

AccessibilityMatrix.storyName = 'Accessibility Matrix (computed)';
AccessibilityMatrix.parameters = {
  docs: {
    description: {
      story:
        'Matrix of key states (default/inline/horizontal, error/validation demo, disabled demo). Each row prints computed role/aria/ids and whether ARIA references resolve.',
    },
    story: { height: '1250px' },
  },
  controls: { disable: true },
};
