// stories/button-group.stories.js

const setAttr = (el, name, v) => {
  if (v === true) el.setAttribute(name, '');
  else if (v === false || v == null || v === '') el.removeAttribute(name);
  else el.setAttribute(name, String(v));
};

export default {
  title: 'Components/Button Group',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Button Group component allows grouping multiple buttons together.',
          '',
          '**Accessibility:**',
          '- Renders `role="group"`.',
          '- Provide either `aria-label` or (preferred) `aria-labelledby`.',
          '- Optional `aria-describedby` for helper text.',
          '- `disabled` sets `aria-disabled="true"` on the group container.',
          '',
          '**Note:** `vertical` / `disabled` on `<button-group>` do not automatically propagate to slotted `<button-component>` children. This story applies them to children so visuals match the selected controls.',
        ].join('\n'),
      },
    },
  },

  render: args => {
    const el = document.createElement('button-group');

    // group attributes
    setAttr(el, 'vertical', args.vertical);
    setAttr(el, 'disabled', args.disabled);
    setAttr(el, 'class-names', args.classNames);

    // a11y
    if (args.ariaLabelledby) {
      setAttr(el, 'aria-labelledby', args.ariaLabelledby);
      el.removeAttribute('aria-label'); // labelledby wins
    } else if (args.ariaLabel) {
      setAttr(el, 'aria-label', args.ariaLabel);
      el.removeAttribute('aria-labelledby');
    } else {
      el.removeAttribute('aria-label');
      el.removeAttribute('aria-labelledby');
    }
    setAttr(el, 'aria-describedby', args.ariaDescribedby);

    // helper: apply group-derived state to child buttons (visual parity)
    const applyChildGroupState = btn => {
      // vertical impacts group positioning classes in button-component
      setAttr(btn, 'vertical', args.vertical);

      // if the group is disabled, disable all children (common expected behavior)
      // (you can change this to only set aria-disabled if you prefer)
      if (args.disabled) setAttr(btn, 'disabled', true);
    };

    // slot buttons
    const b1 = document.createElement('button-component');
    setAttr(b1, 'title-attr', 'Go Ahead');
    setAttr(b1, 'start', true);
    setAttr(b1, 'size', 'sm');
    setAttr(b1, 'variant', 'active-blue');
    setAttr(b1, 'active', true);
    setAttr(b1, 'group-btn', true);
    setAttr(b1, 'btn-text', 'Default Button');
    applyChildGroupState(b1);

    const b2 = document.createElement('button-component');
    setAttr(b2, 'title-attr', 'Go Ahead');
    setAttr(b2, 'variant', 'active-blue');
    setAttr(b2, 'size', 'sm');
    setAttr(b2, 'group-btn', true);
    setAttr(b2, 'btn-text', 'Default Button');
    applyChildGroupState(b2);

    const b3 = document.createElement('button-component');
    setAttr(b3, 'title-attr', 'Go Ahead');
    setAttr(b3, 'variant', 'active-blue');
    setAttr(b3, 'size', 'sm');
    setAttr(b3, 'group-btn', true);
    setAttr(b3, 'end', true);
    setAttr(b3, 'btn-text', 'Default This Button');

    // story-only: allow just the 3rd child to be disabled when group itself isn't disabled
    if (!args.disabled && args.showDisabledChild) setAttr(b3, 'disabled', true);

    applyChildGroupState(b3);

    el.append(b1, b2, b3);

    // optional external label/description demo elements (when ids provided)
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
  },

  argTypes: {
    vertical: {
      control: 'boolean',
      description: 'If true, stacks buttons vertically instead of horizontally.',
      table: { category: 'Layout', defaultValue: { summary: false } },
    },
    classNames: {
      control: 'text',
      name: 'class-names',
      description: 'Additional classes applied to the group container.',
      table: { category: 'Layout' },
    },
    disabled: {
      control: 'boolean',
      description: 'Sets aria-disabled="true" on the group container. (Story also disables child buttons for visual parity.)',
      table: { category: 'State', defaultValue: { summary: false } },
    },
    ariaLabel: {
      control: 'text',
      name: 'aria-label',
      description: 'Accessible name for the group (ignored when aria-labelledby is provided).',
      table: { category: 'Accessibility' },
    },
    ariaLabelledby: {
      control: 'text',
      name: 'aria-labelledby',
      description: 'Preferred accessible name reference for the group.',
      table: { category: 'Accessibility' },
    },
    ariaDescribedby: {
      control: 'text',
      name: 'aria-describedby',
      description: 'Optional helper text reference for the group.',
      table: { category: 'Accessibility' },
    },
    showDisabledChild: {
      control: 'boolean',
      description: 'Story-only: toggles disabled on the 3rd child button to demo mixed states (ignored when group disabled=true).',
      table: { category: 'Story-only', defaultValue: { summary: true } },
    },
  },

  args: {
    vertical: false,
    classNames: '',
    disabled: false,
    ariaLabel: '',
    ariaLabelledby: '',
    ariaDescribedby: '',
    showDisabledChild: true,
  },
};

export const Horizontal = {
  args: {
    vertical: false,
    ariaLabel: 'Button Group',
    showDisabledChild: true,
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Horizontal button group (the default) with active and disabled states.',
      },
    },
  },
};

export const Vertical = {
  args: {
    vertical: true,
    ariaLabel: 'Vertical Button Group',
    showDisabledChild: true, // ✅ make 3rd child disabled
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Vertical button group with different variants and states.',
      },
    },
  },
};
