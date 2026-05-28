// File: src/stories/button-group/button-group.stories.js

import DocsPage from './button-group.docs.mdx';
import { buildDocsHtml, renderButtonGroup, setAttr } from './button-group.story-helpers.js';

export default {
  title: 'Components/Button Group',
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: DocsPage,
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
      source: {
        language: 'html',
        transform: (_src, ctx) => buildDocsHtml(ctx.args),
      },
    },
  },

  render: (args) => renderButtonGroup(args),

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
      name: 'show-disabled-child',
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
    showDisabledChild: true,
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

export const DisabledGroup = {
  args: {
    vertical: false,
    ariaLabel: 'Disabled Button Group',
    disabled: true,
    showDisabledChild: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled group example. The group gets `aria-disabled="true"` and this story also disables all child buttons for visual parity.',
      },
    },
  },
};

export const ExternalLabelAndDescription = {
  args: {
    vertical: false,
    ariaLabel: '',
    ariaLabelledby: 'button-group-label',
    ariaDescribedby: 'button-group-description',
    disabled: false,
    showDisabledChild: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Example using external label and description ids with `aria-labelledby` and `aria-describedby`.',
      },
    },
  },
};

export const AccessibilityMatrix = {
  name: 'Accessibility Matrix (computed)',
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.display = 'grid';
    wrap.style.gap = '16px';
    wrap.style.maxWidth = '980px';

    const title = document.createElement('div');
    title.innerHTML =
      '<strong>Accessibility matrix</strong>' +
      '<div style="opacity:.8">Shows computed role and aria-* attributes on the group container.</div>';
    wrap.appendChild(title);

    const mkRow = (labelText, makeHost, afterMount) => {
      const row = document.createElement('div');
      row.style.display = 'grid';
      row.style.gridTemplateColumns = '260px 1fr';
      row.style.gap = '12px';
      row.style.alignItems = 'start';
      row.style.border = '1px solid #ddd';
      row.style.borderRadius = '8px';
      row.style.padding = '12px';

      const left = document.createElement('div');
      left.innerHTML = `<div style="font-weight:600">${labelText}</div>`;

      const right = document.createElement('div');
      right.style.display = 'grid';
      right.style.gap = '8px';

      const demo = document.createElement('div');
      const host = makeHost();
      demo.appendChild(host);

      const pre = document.createElement('pre');
      pre.style.margin = '0';
      pre.style.padding = '10px';
      pre.style.borderRadius = '8px';
      pre.style.overflow = 'auto';
      pre.style.border = '1px solid #eee';
      pre.style.background = '#fafafa';
      pre.textContent = 'Loading computed attributes…';

      right.appendChild(demo);
      right.appendChild(pre);

      row.appendChild(left);
      row.appendChild(right);

      const update = () => {
        const group = demo.querySelector('button-group > div[role="group"]') || demo.querySelector('[role="group"]');
        const attrs = {
          tag: group?.tagName ?? null,
          role: group?.getAttribute('role') ?? null,
          class: group?.getAttribute('class') ?? null,
          'aria-label': group?.getAttribute('aria-label') ?? null,
          'aria-labelledby': group?.getAttribute('aria-labelledby') ?? null,
          'aria-describedby': group?.getAttribute('aria-describedby') ?? null,
          'aria-disabled': group?.getAttribute('aria-disabled') ?? null,
        };
        pre.textContent = JSON.stringify(attrs, null, 2);
      };

      queueMicrotask(() =>
        requestAnimationFrame(async () => {
          update();
          if (afterMount) await afterMount(demo, update);
        }),
      );

      return row;
    };

    wrap.appendChild(
      mkRow('Fallback label', () =>
        renderButtonGroup({
          vertical: false,
          classNames: '',
          disabled: false,
          ariaLabel: '',
          ariaLabelledby: '',
          ariaDescribedby: '',
          showDisabledChild: false,
        }),
      ),
    );

    wrap.appendChild(
      mkRow('aria-label provided', () =>
        renderButtonGroup({
          vertical: false,
          classNames: '',
          disabled: false,
          ariaLabel: 'Primary actions',
          ariaLabelledby: '',
          ariaDescribedby: '',
          showDisabledChild: true,
        }),
      ),
    );

    wrap.appendChild(
      mkRow('aria-labelledby + aria-describedby', () =>
        renderButtonGroup({
          vertical: false,
          classNames: '',
          disabled: false,
          ariaLabel: '',
          ariaLabelledby: 'group-ext-label',
          ariaDescribedby: 'group-ext-desc',
          showDisabledChild: true,
        }),
      ),
    );

    wrap.appendChild(
      mkRow('Vertical + disabled', () =>
        renderButtonGroup({
          vertical: true,
          classNames: '',
          disabled: true,
          ariaLabel: 'Disabled vertical group',
          ariaLabelledby: '',
          ariaDescribedby: '',
          showDisabledChild: false,
        }),
      ),
    );

    return wrap;
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Renders several button-group configurations and prints the computed group container attributes: `role`, `aria-label`, `aria-labelledby`, `aria-describedby`, and `aria-disabled`.',
      },
    },
  },
};
