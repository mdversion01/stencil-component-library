// File: src/stories/button-component/button-component.stories.js

import DocsPage from './button-component.docs.mdx';
import { buildDocsHtml, buildDocsHtmlMany, renderButton, setAttr } from './button-component.story-helpers.js';

export default {
  title: 'Components/Button',
  tags: ['autodocs'],

  render: args => renderButton(args),

  parameters: {
    docs: {
      page: DocsPage,
      description: {
        component: [
          'Button component allows for various styles and behaviors.',
          "Content is provided via the 'btnText' prop (text only) or the **default slot** (text or markup).",
          '',
          '**Accessibility:**',
          '- Native `<button>` uses visible text as its accessible name when possible (aria-label omitted unless needed).',
          '- Link mode renders an `<a>` with `role="button"`, manages `tabindex`, and uses `aria-disabled` when disabled.',
          '- For icon-only, provide `aria-label` (or `aria-labelledby`).',
        ].join('\n'),
      },
      source: {
        language: 'html',
        transform: (_src, ctx) => buildDocsHtml(ctx.args),
      },
    },
  },

  argTypes: {
    ariaLabel: { control: 'text', name: 'aria-label', description: 'Accessible name override (best for icon-only).', table: { category: 'Accessibility' } },
    ariaLabelledby: { control: 'text', name: 'aria-labelledby', description: 'References element(s) that label the button.', table: { category: 'Accessibility' } },
    ariaDescribedby: { control: 'text', name: 'aria-describedby', description: 'References element(s) that describe the button.', table: { category: 'Accessibility' } },
    role: { control: 'text', description: 'Optional explicit role passthrough to the inner control.', table: { category: 'Accessibility' } },
    tabindex: { control: 'text', description: 'Optional tabindex passthrough to the inner control.', table: { category: 'Accessibility' } },
    titleAttr: {
      control: 'text',
      name: 'title-attr',
      description: 'Title attribute (tooltip / fallback label when icon-only and no aria provided).',
      table: { category: 'Accessibility' },
    },

    btnText: { control: 'text', name: 'btn-text', description: 'Text content of the button.', table: { category: 'Content' } },
    slotSide: {
      control: { type: 'select' },
      options: ['', 'left', 'right', 'none'],
      name: 'slot-side',
      description: 'If using a side icon, choose left or right.',
      table: { category: 'Content' },
    },

    type: {
      control: { type: 'select' },
      options: ['button', 'submit', 'reset'],
      description: 'Native button type (ignored in link mode).',
      table: { category: 'Element' },
    },

    active: { control: 'boolean', description: 'If true, adds active styles to the button.', table: { category: 'State', defaultValue: { summary: false } } },
    disabled: { control: 'boolean', description: 'If true, disables the button.', table: { category: 'State', defaultValue: { summary: false } } },

    variant: { control: 'text', description: 'Visual variant/color.', table: { category: 'Appearance' } },
    size: { control: { type: 'select' }, options: ['', 'xs', 'sm', 'lg', 'plumage-size'], description: 'Size.', table: { category: 'Appearance' } },
    shape: { control: { type: 'select' }, options: ['', 'circle', 'pill', 'square'], description: 'Shape.', table: { category: 'Appearance' } },
    outlined: { control: 'boolean', description: 'Outlined style.', table: { category: 'Appearance', defaultValue: { summary: false } } },
    link: { control: 'boolean', description: 'Render as <a> styled like a button.', table: { category: 'Appearance', defaultValue: { summary: false } } },
    text: { control: 'boolean', description: 'Text style.', table: { category: 'Appearance', defaultValue: { summary: false } } },
    textBtn: { control: 'boolean', name: 'text-btn', description: 'Text button hover behavior.', table: { category: 'Appearance', defaultValue: { summary: false } } },
    stripped: { control: 'boolean', description: 'Stripped style.', table: { category: 'Appearance', defaultValue: { summary: false } } },
    elevation: { control: 'text', description: 'Elevation level 0-24.', table: { category: 'Appearance' } },
    classNames: { control: 'text', name: 'class-names', description: 'Extra classes.', table: { category: 'Appearance' } },
    styles: { control: 'text', description: 'Inline styles (CSS declarations).', table: { category: 'Appearance' } },

    block: { control: 'boolean', description: 'Full width.', table: { category: 'Layout & Position', defaultValue: { summary: false } } },
    start: { control: 'boolean', description: 'Button-group placement start.', table: { category: 'Layout & Position', defaultValue: { summary: false } } },
    end: { control: 'boolean', description: 'Button-group placement end.', table: { category: 'Layout & Position', defaultValue: { summary: false } } },
    groupBtn: { control: 'boolean', name: 'group-btn', description: 'Group button styling.', table: { category: 'Layout & Position', defaultValue: { summary: false } } },
    vertical: { control: 'boolean', description: 'Vertical button-group.', table: { category: 'Layout & Position', defaultValue: { summary: false } } },
    absolute: { control: 'boolean', description: 'position:absolute.', table: { category: 'Layout & Position', defaultValue: { summary: false } } },
    fixed: { control: 'boolean', description: 'position:fixed.', table: { category: 'Layout & Position', defaultValue: { summary: false } } },
    top: { control: 'text', description: 'Top offset (px).', table: { category: 'Layout & Position' } },
    right: { control: 'text', description: 'Right offset (px).', table: { category: 'Layout & Position' } },
    bottom: { control: 'text', description: 'Bottom offset (px).', table: { category: 'Layout & Position' } },
    left: { control: 'text', description: 'Left offset (px).', table: { category: 'Layout & Position' } },
    zIndex: { control: 'text', name: 'z-index', description: 'z-index.', table: { category: 'Layout & Position' } },

    btnIcon: { control: 'boolean', name: 'btn-icon', description: 'Icon-only mode.', table: { category: 'Icon Button', defaultValue: { summary: false } } },
    iconBtn: { control: 'boolean', name: 'icon-btn', description: 'Icon button mode.', table: { category: 'Icon Button', defaultValue: { summary: false } } },

    ripple: { control: 'boolean', description: 'Ripple effect.', table: { category: 'Behavior', defaultValue: { summary: false } } },
    toggle: { control: 'boolean', description: 'Toggle mode (aria-pressed).', table: { category: 'Behavior', defaultValue: { summary: false } } },
    pressed: { control: 'boolean', description: 'Pressed state (toggle only).', table: { category: 'Behavior', defaultValue: { summary: false } } },

    url: { control: 'text', description: 'Href for link mode.', table: { category: 'Link / Navigation' } },

    accordion: { control: 'boolean', description: 'Accordion toggle ARIA.', table: { category: 'Accordion', defaultValue: { summary: false } } },
    isOpen: { control: 'boolean', name: 'is-open', description: 'Accordion expanded state.', table: { category: 'Accordion', defaultValue: { summary: false } } },
    targetId: { control: 'text', name: 'target-id', description: 'Accordion panel id (aria-controls).', table: { category: 'Accordion' } },

    allowFocusableChildren: {
      control: 'boolean',
      name: 'allow-focusable-children',
      description: 'Opt-out of nested focusable neutralization.',
      table: { category: 'Advanced', defaultValue: { summary: false } },
    },

    devMode: { control: 'boolean', name: 'dev-mode', description: 'Enable dev logging.', table: { category: 'Dev', defaultValue: { summary: false } } },

    iconHtml: { name: 'icon-html', table: { disable: true }, control: false },
    sideIconHtml: { name: 'side-icon-html', table: { disable: true }, control: false },
  },

  controls: {
    exclude: ['iconHtml', 'sideIconHtml'],
  },

  args: {
    absolute: false,
    active: false,
    ariaLabel: '',
    ariaLabelledby: '',
    ariaDescribedby: '',
    role: '',
    tabindex: '',
    type: 'button',

    block: false,
    bottom: '',
    btnIcon: false,
    btnText: 'Click me',
    classNames: '',
    devMode: false,
    disabled: false,
    elevation: '',
    end: false,
    fixed: false,
    groupBtn: false,
    iconBtn: false,
    left: '',
    link: false,
    outlined: false,
    pressed: false,
    right: '',
    ripple: false,
    shape: '',
    size: '',
    slotSide: '',
    start: false,
    stripped: false,
    styles: '',
    text: false,
    textBtn: false,
    titleAttr: '',
    toggle: false,
    top: '',
    url: '',
    variant: '',
    vertical: false,
    zIndex: '',

    accordion: false,
    isOpen: false,
    targetId: '',

    allowFocusableChildren: false,

    iconHtml: '',
    sideIconHtml: '',
  },
};

export const Basic = {
  args: {
    variant: 'primary',
    btnText: 'Basic Button',
  },
  parameters: {
    docs: { description: { story: 'Basic button shown below.' } },
  },
};

export const DisabledButton = {
  args: {
    variant: 'primary',
    btnText: 'Disabled Button',
    disabled: true,
  },
  parameters: {
    docs: { description: { story: 'Disabled button shown below.' } },
  },
};

export const BackgroundColors = {
  name: 'Background Colors (all core variant colors)',
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.flexWrap = 'wrap';
    wrap.style.gap = '12px';

    const title = v => v.charAt(0).toUpperCase() + v.slice(1);
    const variants = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];

    variants.forEach(v => {
      const btn = document.createElement('button-component');
      setAttr(btn, 'variant', v);
      setAttr(btn, 'btn-text', title(v));
      wrap.appendChild(btn);
    });

    return wrap;
  },
  parameters: {
    docs: {
      source: {
        language: 'html',
        code: buildDocsHtmlMany(
          ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'].map(
            v => `<button-component variant="${v}" btn-text="${v.charAt(0).toUpperCase() + v.slice(1)}"></button-component>`,
          ),
        ),
      },
      description: {
        story: 'Filled buttons for all core variants. Each button sets `variant` to one of: `primary`, `secondary`, `success`, `danger`, `warning`, `info`, `light`, `dark`.',
      },
    },
  },
};

export const OutlineColors = {
  name: 'Outlined Colors (all core variant colors)',
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.flexWrap = 'wrap';
    wrap.style.gap = '12px';

    const title = v => v.charAt(0).toUpperCase() + v.slice(1);
    const variants = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];

    variants.forEach(v => {
      const btn = document.createElement('button-component');
      setAttr(btn, 'outlined', true);
      setAttr(btn, 'variant', v);
      setAttr(btn, 'btn-text', `Outlined ${title(v)}`);
      wrap.appendChild(btn);
    });

    return wrap;
  },
  parameters: {
    docs: {
      source: {
        language: 'html',
        code: buildDocsHtmlMany(
          ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'].map(
            v => `<button-component outlined variant="${v}" btn-text="Outlined ${v.charAt(0).toUpperCase() + v.slice(1)}"></button-component>`,
          ),
        ),
      },
      description: {
        story:
          'Outlined buttons for all core variants. Each button uses `outlined` with `variant` set to one of: `primary`, `secondary`, `success`, `danger`, `warning`, `info`, `light`, `dark`.',
      },
    },
  },
};

export const Sizes = {
  name: 'Sizes (sm, default, lg)',
  args: {
    variant: 'primary',
  },
  render: args => {
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.gap = '12px';

    const mk = (size, text) => {
      const btn = document.createElement('button-component');
      setAttr(btn, 'variant', args.variant || 'primary');
      setAttr(btn, 'btn-text', text);
      if (size) setAttr(btn, 'size', size);
      return btn;
    };

    wrap.append(mk('sm', 'Small'), mk('', 'Default'), mk('lg', 'Large'));
    return wrap;
  },
  parameters: {
    docs: { description: { story: 'Buttons in small, default, and large sizes.' } },
  },
};

export const Shapes = {
  name: 'Shapes (default, pill, square, circle w/ icon)',
  args: {
    variant: 'primary',
  },
  render: args => {
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.gap = '12px';

    const mk = opts => {
      const btn = document.createElement('button-component');
      setAttr(btn, 'variant', opts.variant ?? args.variant ?? 'primary');
      setAttr(btn, 'shape', opts.shape || '');
      setAttr(btn, 'btn-text', opts.btnText ?? '');
      if (opts.btnIcon) setAttr(btn, 'btn-icon', true);
      if (opts.ariaLabel) setAttr(btn, 'aria-label', opts.ariaLabel);
      return btn;
    };

    const def = mk({ btnText: 'Default' });
    const pill = mk({ shape: 'pill', btnText: 'Pill' });
    const square = mk({ shape: 'square', btnText: 'Square' });

    const circle = mk({ shape: 'circle', btnIcon: true, ariaLabel: 'Home' });
    const icon = document.createElement('span');
    icon.innerHTML = '<i class="fa-solid fa-house"></i>';
    circle.appendChild(icon);

    wrap.append(def, pill, square, circle);
    return wrap;
  },
  parameters: {
    docs: { description: { story: 'Buttons in various shapes: default, pill, square, and circle with icon.' } },
  },
};

export const RippleEffect = {
  args: {
    variant: 'primary',
    ripple: true,
    btnText: 'Ripple Button',
  },
  parameters: {
    docs: { description: { story: 'Button with ripple effect enabled on click.' } },
  },
};

export const ActiveState = {
  args: {
    variant: 'active-blue',
    classNames: 'active',
    active: true,
    btnText: 'Active Button',
  },
  parameters: {
    docs: { description: { story: 'Button with active state styling.' } },
  },
};

export const Block = {
  args: {
    block: true,
    btnText: 'Block Button',
    variant: 'primary',
  },
  parameters: {
    docs: { description: { story: 'Block-level button that spans the full width of its container.' } },
  },
};

export const IconsLeftAndRightExamples = {
  name: 'Icons: Left & Right (two buttons)',
  args: {
    variant: 'primary',
    btnText: 'Home',
  },
  render: args => {
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.gap = '12px';

    const leftBtn = document.createElement('button-component');
    leftBtn.setAttribute('variant', args.variant || 'primary');
    leftBtn.setAttribute('btn-text', args.btnText || 'Home');
    leftBtn.setAttribute('slot-side', 'left');
    const leftIcon = document.createElement('span');
    leftIcon.innerHTML = '<i class="fa-solid fa-house"></i>';
    leftBtn.appendChild(leftIcon);

    const rightBtn = document.createElement('button-component');
    rightBtn.setAttribute('variant', args.variant || 'primary');
    rightBtn.setAttribute('btn-text', args.btnText || 'Home');
    rightBtn.setAttribute('slot-side', 'right');
    const rightIcon = document.createElement('span');
    rightIcon.innerHTML = '<i class="fa-solid fa-house"></i>';
    rightBtn.appendChild(rightIcon);

    wrap.append(leftBtn, rightBtn);
    return wrap;
  },
  parameters: {
    docs: { description: { story: 'Example showing two buttons: one with a left icon and one with a right icon.' } },
  },
};

export const IconOnly = {
  args: {
    btnIcon: true,
    btnText: '',
    ariaLabel: 'Star',
    iconHtml: '<i class="fa-solid fa-star"></i>',
  },
  parameters: {
    docs: { description: { story: 'Icon-only button example with a star icon.' } },
  },
};

export const StrippedButton = {
  args: {
    stripped: true,
    btnText: 'Stripped Button',
  },
  parameters: {
    docs: { description: { story: 'Stripped button appearance.' } },
  },
};

export const LinkButton = {
  args: {
    link: true,
    url: '#',
    variant: 'link',
    btnText: 'Anchor-like Button',
  },
  parameters: {
    docs: { description: { story: 'Button styled as a link. When url is "#" navigation is prevented but click still emits.' } },
  },
};

export const DisabledLinkWithUrl = {
  name: 'Disabled link (url set)',
  args: {
    link: true,
    disabled: true,
    url: '/somewhere',
    btnText: 'Disabled Link (url set)',
    variant: 'primary',
    ariaLabel: 'Disabled link button',
  },
  parameters: {
    docs: {
      description: {
        story: 'Renders link-mode as an `<a>` but in a disabled state. Expected: **no `href`**, `aria-disabled="true"`, and `tabindex="-1"`.',
      },
      source: {
        language: 'html',
        code: `<button-component link disabled url="/somewhere" variant="primary" btn-text="Disabled Link (url set)" aria-label="Disabled link button"></button-component>`,
      },
    },
  },
};

export const ToggleButton = {
  name: 'Toggle (aria-pressed)',
  args: {
    toggle: true,
    pressed: false,
    btnText: 'Toggle Me',
    variant: 'primary',
  },
  parameters: {
    docs: { description: { story: 'Toggle button that can be pressed or unpressed (aria-pressed).' } },
  },
};

export const AccordionToggleExample = {
  name: 'Accordion toggle (aria)',
  args: {
    accordion: true,
    isOpen: false,
    targetId: 'accordion-section-1',
    variant: 'primary',
    btnText: 'Toggle Section',
  },
  parameters: {
    docs: { description: { story: 'Accordion toggle button sets aria-expanded and aria-controls.' } },
  },
};

export const ButtonWithBadge = {
  name: 'Button with Badge',
  render: () => {
    const btn = document.createElement('button-component');
    btn.setAttribute('title-attr', 'Button with Badge');
    btn.setAttribute('btn-text', 'With a badge');
    btn.setAttribute('variant', 'primary');

    const badge = document.createElement('badge-component');
    badge.setAttribute('id', 'badge12');
    badge.setAttribute('variant', 'light');
    badge.setAttribute('bdg-position', 'right');
    badge.setAttribute('size', 'sm');
    badge.setAttribute('aria-label', 'Count 1');
    badge.textContent = '1';

    btn.appendChild(badge);
    return btn;
  },
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        language: 'html',
        code: `<button-component title-attr="Button with Badge" btn-text="With a badge" variant="primary">
  <badge-component id="badge12" variant="light" bdg-position="right" size="sm" aria-label="Count 1">1</badge-component>
</button-component>`,
      },
      description: { story: 'Button that includes a badge component positioned to the right.' },
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
    title.innerHTML = `<strong>Accessibility matrix</strong><div style="opacity:.8">Shows computed <code>tag</code>, <code>role</code>, <code>aria-*</code>, <code>href</code>, <code>tabindex</code>.</div>`;
    wrap.appendChild(title);

    const mkRow = (labelText, makeHost) => {
      const row = document.createElement('div');
      row.style.display = 'grid';
      row.style.gridTemplateColumns = '240px 1fr';
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
      demo.style.display = 'inline-flex';
      demo.style.alignItems = 'center';
      demo.style.gap = '8px';
      demo.style.flexWrap = 'wrap';

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
        const inner = host.querySelector('button, a');
        const attrs = {
          'tag': inner?.tagName ?? null,
          'href': inner?.getAttribute('href') ?? null,
          'role': inner?.getAttribute('role') ?? null,
          'tabindex': inner?.getAttribute('tabindex') ?? null,
          'aria-label': inner?.getAttribute('aria-label') ?? null,
          'aria-labelledby': inner?.getAttribute('aria-labelledby') ?? null,
          'aria-describedby': inner?.getAttribute('aria-describedby') ?? null,
          'aria-disabled': inner?.getAttribute('aria-disabled') ?? null,
          'aria-pressed': inner?.getAttribute('aria-pressed') ?? null,
          'aria-expanded': inner?.getAttribute('aria-expanded') ?? null,
          'aria-controls': inner?.getAttribute('aria-controls') ?? null,
          'title': inner?.getAttribute('title') ?? null,
        };
        pre.textContent = JSON.stringify(attrs, null, 2);
      };

      queueMicrotask(() => requestAnimationFrame(update));
      return row;
    };

    wrap.appendChild(
      mkRow('Native button (text name)', () => {
        const b = document.createElement('button-component');
        b.setAttribute('variant', 'primary');
        b.setAttribute('btn-text', 'Save');
        return b;
      }),
    );

    wrap.appendChild(
      mkRow('Icon-only (aria-label)', () => {
        const b = document.createElement('button-component');
        b.setAttribute('btn-icon', '');
        b.setAttribute('aria-label', 'Notifications');
        const icon = document.createElement('span');
        icon.innerHTML = '<i class="fa-solid fa-bell"></i>';
        b.appendChild(icon);
        return b;
      }),
    );

    wrap.appendChild(
      mkRow('Link mode (enabled)', () => {
        const b = document.createElement('button-component');
        b.setAttribute('link', '');
        b.setAttribute('btn-text', 'Go to page');
        b.setAttribute('url', '/path');
        return b;
      }),
    );

    wrap.appendChild(
      mkRow('Link mode (disabled)', () => {
        const b = document.createElement('button-component');
        b.setAttribute('link', '');
        b.setAttribute('disabled', '');
        b.setAttribute('btn-text', 'Disabled link');
        b.setAttribute('url', '/path');
        return b;
      }),
    );

    wrap.appendChild(
      mkRow('Toggle (aria-pressed)', () => {
        const b = document.createElement('button-component');
        b.setAttribute('toggle', '');
        b.setAttribute('btn-text', 'Toggle');
        return b;
      }),
    );

    wrap.appendChild(
      mkRow('Accordion (aria-expanded/controls)', () => {
        const b = document.createElement('button-component');
        b.setAttribute('accordion', '');
        b.setAttribute('target-id', 'panel-1');
        b.setAttribute('is-open', 'false');
        b.setAttribute('btn-text', 'Toggle section');
        return b;
      }),
    );

    return wrap;
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Renders multiple configurations and prints the computed inner control attributes (tag, role, aria-*, href, tabindex). Useful for validating 508/a11y behavior after changes.',
      },
    },
  },
};
