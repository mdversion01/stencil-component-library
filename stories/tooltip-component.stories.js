export default {
  title: 'Components/Tooltip',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Light-DOM tooltip wrapper. Place your trigger element **inside** the component. Supports placement, HTML content (trusted), variants, custom classes, manual control, and custom container.',
      },
    },
  },
  argTypes: {
    // component props/attrs
    message: { control: 'text' },
    tooltipTitle: { control: 'text', name: 'tooltip-title' },
    htmlContent: { control: 'boolean', name: 'html-content' },
    position: {
      control: 'select',
      options: ['auto', 'top', 'bottom', 'left', 'right'],
    },
    trigger: {
      control: 'text',
      description: 'Space-separated: "hover", "focus", "click", "manual"',
    },
    animation: { control: 'boolean' },
    container: { control: 'text' },
    customClass: { control: 'text' },
    variant: {
      control: 'select',
      options: ['', 'primary', 'secondary', 'success', 'danger', 'info', 'warning', 'dark'],
    },
    visible: {
      control: 'boolean',
      description: 'With trigger containing "manual", toggles via API.',
    },

    // demo-only helpers
    btnText: { control: 'text', description: 'Trigger button text' },
    btnVariant: {
      control: 'select',
      options: ['secondary', 'primary', 'success', 'danger', 'info', 'warning', 'dark'],
      description: '<button-component> variant',
    },
  },
};

const boolAttr = (name, on) => (on ? ` ${name}` : '');
const attr = (name, v) =>
  v === undefined || v === null || v === '' ? '' : ` ${name}="${String(v)}"`;

/** Base one-off tooltip story (playground) */
const Template = (args) => {
  const id = `tt-${Math.random().toString(36).slice(2)}`;
  const htmlFlag = !!args.htmlContent;
  // We feed the content through data-original-title so it wins in resolveTitle().
  const dataTitle = (args.tooltipTitle || args.message || 'Tooltip content').replaceAll('"', '&quot;');

  const markup = `
<div style="display:inline-block">
  <tooltip-component
    id="${id}"
    ${attr('position', args.position)}
    ${attr('trigger', args.trigger)}
    ${attr('customClass', args.customClass)}
    ${attr('variant', args.variant)}
    ${attr('container', args.container)}
    ${attr('message', args.message)}
    ${boolAttr('animation', args.animation)}
    ${boolAttr('htmlContent', htmlFlag)}
    data-original-title="${dataTitle}"
    ${htmlFlag ? 'data-html' : ''}
  >
    <button-component btn-text="${args.btnText}" size="sm" ${attr('variant', args.btnVariant)}></button-component>
  </tooltip-component>

  <script>
    (function(){
      const el = document.getElementById('${id}');
      // reflect "visible" when manual trigger is chosen
      const hasManual = ((${JSON.stringify(args.trigger || '')}).split(/\\s+/).includes('manual'));
      if (hasManual) {
        if (${!!args.visible}) { el.show(); }
        else { el.hide(); }
      }
    })();
  </script>
</div>`.trim();

  return markup;
};

export const Playground = Template.bind({});
Playground.args = {
  // tooltip props
  message: '',
  tooltipTitle: 'Hello from tooltip!',
  htmlContent: false,
  position: 'top',
  trigger: 'hover focus',
  animation: true,
  container: '',
  customClass: '',
  variant: '',
  visible: false,

  // demo helpers
  btnText: 'Hover me',
  btnVariant: 'secondary',
};

/* ====== Focused examples (matching your docs) ====== */

export const PositionsGrid = () => `
<div style="display:flex; gap:10px; flex-wrap:wrap">
  <tooltip-component data-placement="top" data-original-title="Tooltip on top" data-trigger="hover focus">
    <button-component btn-text="Top" size="sm" variant="secondary"></button-component>
  </tooltip-component>

  <tooltip-component data-placement="right" data-original-title="Tooltip on right" data-trigger="hover focus">
    <button-component btn-text="Right" size="sm" variant="secondary"></button-component>
  </tooltip-component>

  <tooltip-component data-placement="left" data-original-title="Tooltip on left" data-trigger="hover focus">
    <button-component btn-text="Left" size="sm" variant="secondary"></button-component>
  </tooltip-component>

  <tooltip-component data-placement="bottom" data-original-title="Tooltip on bottom" data-trigger="hover focus">
    <button-component btn-text="Bottom" size="sm" variant="secondary"></button-component>
  </tooltip-component>

  <tooltip-component data-placement="auto" data-original-title="Placement auto" data-trigger="hover focus">
    <button-component btn-text="Auto" size="sm" variant="secondary"></button-component>
  </tooltip-component>
</div>
`.trim();

export const WithHTMLContent = () => `
<div style="display:flex; gap:10px; flex-wrap:wrap">
  <tooltip-component
    data-placement="top"
    data-original-title="<span style='display:flex;align-items:center;gap:6px'><i class='fa fa-tachometer'></i> Tooltip with icon</span>"
    data-trigger="hover focus"
    data-html
  >
    <button-component btn-text="HTML + Icon" size="sm" variant="secondary"></button-component>
  </tooltip-component>

  <tooltip-component
    data-placement="top"
    data-original-title="<em>Tooltip</em> with <strong>HTML</strong> styling"
    data-trigger="hover focus"
    data-html
  >
    <button-component btn-text="Rich HTML" size="sm" variant="secondary"></button-component>
  </tooltip-component>
</div>
`.trim();

export const Variants = () => `
<div style="display:flex; gap:10px; flex-wrap:wrap">
  <tooltip-component data-placement="top" data-original-title="Informational" data-trigger="hover focus" variant="info">
    <button-component btn-text="Info" size="sm" variant="secondary"></button-component>
  </tooltip-component>

  <tooltip-component data-placement="top" data-original-title="Danger" data-trigger="hover focus" variant="danger">
    <button-component btn-text="Danger" size="sm" variant="secondary"></button-component>
  </tooltip-component>

  <tooltip-component data-placement="top" data-original-title="Warning" data-trigger="hover focus" variant="warning">
    <button-component btn-text="Warning" size="sm" variant="secondary"></button-component>
  </tooltip-component>

  <tooltip-component data-placement="top" data-original-title="Success" data-trigger="hover focus" variant="success">
    <button-component btn-text="Success" size="sm" variant="secondary"></button-component>
  </tooltip-component>

  <tooltip-component data-placement="top" data-original-title="Custom class color" data-trigger="hover focus" customClass="purple">
    <button-component btn-text="Custom class" size="sm" variant="secondary"></button-component>
  </tooltip-component>
</div>
`.trim();

export const InlineLinks = () => `
<p style="max-width:680px; line-height:1.6">
  Placeholder text to demonstrate some
  <tooltip-component data-placement="top" data-original-title="Default tooltip" data-trigger="hover focus">
    <a href="javascript:void(0)">inline links</a>
  </tooltip-component>
  with tooltips. This is now just filler, no killer. Content placed here just to mimic the presence of
  <tooltip-component data-placement="top" data-original-title="Another tooltip" data-trigger="hover focus">
    <a href="javascript:void(0)">real text</a>
  </tooltip-component>.
  And all that just to give you an idea of how tooltips would look when used in real-world situations. So hopefully you've now seen how
  <tooltip-component data-placement="top" data-original-title="Another one here too" data-trigger="hover focus">
    <a href="javascript:void(0)">these tooltips on links</a>
  </tooltip-component>
  can work in practice, once you use them on
  <tooltip-component data-placement="top" data-original-title="And the last tip!" data-trigger="hover focus">
    <a href="javascript:void(0)">your own</a>
  </tooltip-component>
  site or project.
</p>
`.trim();

export const ManualTrigger = () => {
  const id = `manual-${Math.random().toString(36).slice(2)}`;
  return `
<div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap">
  <tooltip-component id="${id}" trigger="manual click" position="bottom" data-original-title="Manually controlled tooltip">
    <button-component btn-text="Target" size="sm" variant="secondary"></button-component>
  </tooltip-component>

  <button-component btn-text="Show" size="sm" variant="primary" id="${id}-show"></button-component>
  <button-component btn-text="Hide" size="sm" variant="danger" id="${id}-hide"></button-component>
  <button-component btn-text="Toggle" size="sm" variant="info" id="${id}-toggle"></button-component>

  <script>
    (function(){
      const el = document.getElementById('${id}');
      const showBtn = document.getElementById('${id}-show');
      const hideBtn = document.getElementById('${id}-hide');
      const toggleBtn = document.getElementById('${id}-toggle');

      showBtn?.addEventListener('click', () => el.show());
      hideBtn?.addEventListener('click', () => el.hide());
      toggleBtn?.addEventListener('click', () => (el.visible ? el.hide() : el.show()));
    })();
  </script>
</div>
  `.trim();
};

export const CustomContainer = () => {
  const id = `ctn-${Math.random().toString(36).slice(2)}`;
  return `
<div>
  <div id="${id}-container" style="position:relative; border:1px dashed #ccc; padding:20px; height:160px; overflow:auto">
    <div style="height:320px">
      <div style="margin-top:80px">
        <tooltip-component container="#${id}-container" position="right" data-original-title="Inside scrollable container" data-trigger="hover focus">
          <button-component btn-text="Hover me in container" size="sm" variant="secondary"></button-component>
        </tooltip-component>
      </div>
    </div>
  </div>
  <small style="color:#666">Tooltip is appended inside the dashed box and respects its scroll.</small>
</div>
`.trim();
};
