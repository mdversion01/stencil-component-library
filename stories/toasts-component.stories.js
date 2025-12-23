// src/stories/toasts-component.stories.js

export default {
  title: 'Components/Toasts',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    // --- Demo helpers (not component props) ---
    demoWidth: {
      control: { type: 'number', min: 180, step: 10 },
      description: 'Wrapper width (px) for the preview.',
    },
    demoTitle: { control: 'text', description: 'Title for the next toast you spawn.' },
    demoMessage: { control: 'text', description: 'Body (text) for the next toast you spawn.' },
    demoHtml: {
      control: 'text',
      description: 'If set, uses trusted HTML for the toast body (replaces demoMessage).',
    },
    demoButtonText: { control: 'text', description: 'Label for the “Show toast” button.' },

    // --- Component props ---
    toastId: { control: 'text', name: 'toast-id' },
    position: {
      control: 'select',
      options: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    },
    variant: {
      control: 'select',
      options: ['', 'primary', 'secondary', 'success', 'danger', 'info', 'warning', 'dark', 'light'],
    },
    solidToast: { control: 'boolean', name: 'solid-toast' },
    plumageToast: { control: 'boolean', name: 'plumage-toast' },
    plumageToastMax: { control: 'boolean', name: 'plumage-toast-max' },
    appendToast: { control: 'boolean', name: 'append-toast' },
    duration: { control: { type: 'number', min: 500, step: 500 } },
    noAnimation: { control: 'boolean', name: 'no-animation' },
    noHoverPause: { control: 'boolean', name: 'no-hover-pause' },
    persistent: { control: 'boolean' },
    svgIcon: {
      control: 'select',
      options: [
        undefined,
        'check-circle-fill',
        'check-circle-outline',
        'info-fill',
        'info-outlined',
        'exclamation-triangle-fill',
        'exclamation-triangle-outline',
        'exclamation-circle-fill',
        'exclamation-circle-outline',
      ],
      description: 'Symbol id from the component’s built-in SVG sprite.',
    },
    headerClass: { control: 'text', name: 'header-class' },
    bodyClass: { control: 'text', name: 'body-class' },
    isStatus: { control: 'boolean', name: 'is-status' },
    noCloseButton: { control: 'boolean', name: 'no-close-button' },
    iconPlumageStyle: { control: 'boolean', name: 'icon-plumage-style' },
    toastTitle: { control: 'text', name: 'toast-title' },
    message: { control: 'text' },
    additionalHeaderContent: { control: 'text', name: 'additional-header-content' },
    time: { control: 'text' },
  },
};

/** Small helper for boolean attributes */
const boolAttr = (name, on) => (on ? ` ${name}` : '');
/** Helper for normal attributes */
const attr = (name, v) =>
  v === undefined || v === null || v === '' ? '' : ` ${name}="${String(v)}"`;

/** Base template that also wires a “Show toast” button to call `showToast()` */
const Template = (args) => {
  const hostId = args.toastId && args.toastId !== 'toast-component'
    ? args.toastId
    : `toasts-${Math.random().toString(36).slice(2)}`;

  const wrapperStyle = Number.isFinite(args.demoWidth) ? `style="width:${args.demoWidth}px"` : '';

  return `
<div ${wrapperStyle}>
  <div style="display:flex; gap:8px; margin-bottom:8px; flex-wrap:wrap">
    <button type="button" id="${hostId}-show" class="btn btn-secondary btn-sm">
      ${args.demoButtonText || 'Show toast'}
    </button>
    <button type="button" id="${hostId}-clear" class="btn btn-outline-secondary btn-sm">
      Clear all
    </button>
  </div>

  <toasts-component
    id="${hostId}"
    ${attr('toast-id', hostId)}
    ${attr('position', args.position)}
    ${attr('variant', args.variant)}
    ${boolAttr('solid-toast', args.solidToast)}
    ${boolAttr('plumage-toast', args.plumageToast)}
    ${boolAttr('plumage-toast-max', args.plumageToastMax)}
    ${boolAttr('append-toast', args.appendToast)}
    ${attr('duration', args.duration)}
    ${boolAttr('no-animation', args.noAnimation)}
    ${boolAttr('no-hover-pause', args.noHoverPause)}
    ${boolAttr('persistent', args.persistent)}
    ${attr('svg-icon', args.svgIcon)}
    ${attr('header-class', args.headerClass)}
    ${attr('body-class', args.bodyClass)}
    ${boolAttr('is-status', args.isStatus)}
    ${boolAttr('no-close-button', args.noCloseButton)}
    ${boolAttr('icon-plumage-style', args.iconPlumageStyle)}
    ${attr('toast-title', args.toastTitle)}
    ${attr('message', args.message)}
    ${attr('additional-header-content', args.additionalHeaderContent)}
    ${attr('time', args.time)}
  ></toasts-component>

  <script>
    (function(){
      const el = document.getElementById('${hostId}');
      const btn = document.getElementById('${hostId}-show');
      const clr = document.getElementById('${hostId}-clear');

      if (btn && !btn._wired) {
        btn._wired = true;
        btn.addEventListener('click', async () => {
          await customElements.whenDefined('toasts-component');
          await el?.componentOnReady?.();

          const opts = {
            toastTitle: ${JSON.stringify(args.demoTitle || args.toastTitle || 'Notification')},
            content: ${args.demoHtml ? 'undefined' : JSON.stringify(args.demoMessage || args.message || 'Hello from toast!')},
            contentHtml: ${args.demoHtml ? JSON.stringify(args.demoHtml) : 'undefined'},
            variantClass: ${JSON.stringify(args.variant || '')},
            svgIcon: ${args.svgIcon ? JSON.stringify(args.svgIcon) : 'undefined'},
            duration: ${Number.isFinite(args.duration) ? Number(args.duration) : 5000},
            persistent: ${!!args.persistent},
            noCloseButton: ${!!args.noCloseButton},
            iconPlumageStyle: ${!!args.iconPlumageStyle},
            bodyClass: ${args.bodyClass ? JSON.stringify(args.bodyClass) : 'undefined'},
            headerClass: ${args.headerClass ? JSON.stringify(args.headerClass) : 'undefined'},
            isStatus: ${!!args.isStatus},
            noHoverPause: ${!!args.noHoverPause},
            time: ${args.time ? JSON.stringify(args.time) : 'undefined'},
            additionalHdrContent: ${args.additionalHeaderContent ? JSON.stringify(args.additionalHeaderContent) : 'undefined'}
          };

          try { await el.showToast(opts); } catch(e) { console.warn('showToast failed:', e); }
        });
      }

      if (clr && !clr._wired) {
        clr._wired = true;
        clr.addEventListener('click', async () => {
          await customElements.whenDefined('toasts-component');
          await el?.componentOnReady?.();
          const list = (el?.toasts || []).slice();
          for (const t of list) { try { await el.removeToast(t.id); } catch(_){} }
        });
      }
    })();
  </script>
</div>`;
};

/* =========================
   Stories
   ========================= */

export const Default = Template.bind({});
Default.args = {
  // demo
  demoWidth: 420,
  demoTitle: 'Saved',
  demoMessage: 'Your changes have been saved.',
  demoHtml: '',
  demoButtonText: 'Show toast',

  // component
  toastId: 'toast-component',
  position: 'bottom-right',
  variant: '',
  solidToast: false,
  plumageToast: false,
  plumageToastMax: false,
  appendToast: false,
  duration: 5000,
  noAnimation: false,
  noHoverPause: false,
  persistent: false,
  svgIcon: undefined,
  headerClass: '',
  bodyClass: '',
  isStatus: false,
  noCloseButton: false,
  iconPlumageStyle: false,
  toastTitle: 'Notification',
  message: '',
  additionalHeaderContent: '',
  time: undefined,
};

export const SolidStyle = Template.bind({});
SolidStyle.args = {
  ...Default.args,
  solidToast: true,
  variant: 'success',
  demoTitle: 'Success',
  demoMessage: 'Solid toast with success styling.',
  svgIcon: 'check-circle-fill',
};

export const Plumage = Template.bind({});
Plumage.args = {
  ...Default.args,
  plumageToast: true,
  variant: 'info',
  position: 'top-right',
  demoTitle: 'Heads up',
  demoMessage: 'This is a Plumage toast.',
  svgIcon: 'info-fill',
};

export const PlumageMaxLayout = Template.bind({});
PlumageMaxLayout.args = {
  ...Plumage.args,
  plumageToastMax: true,
  iconPlumageStyle: true,
  demoTitle: 'Expanded',
  demoHtml: '<p><strong>Expanded layout</strong> with <em>HTML content</em>.</p>',
};

export const WarningPersistent = Template.bind({});
WarningPersistent.args = {
  ...Default.args,
  variant: 'warning',
  persistent: true,
  demoTitle: 'Action required',
  demoMessage: 'This toast will remain until closed.',
  svgIcon: 'exclamation-triangle-fill',
};

export const DangerNoAnimation = Template.bind({});
DangerNoAnimation.args = {
  ...Default.args,
  variant: 'danger',
  noAnimation: true,
  demoTitle: 'Error',
  demoMessage: 'No fade transitions are used.',
  svgIcon: 'exclamation-circle-fill',
};

/* =========================================================
   EXTRA: Full DOM Examples + your initialization script
   ========================================================= */

export const ExamplesFromDocs = () => `
<style>
  .display-box-demo { margin: 12px 0; }
  .btn { cursor: pointer; }
</style>

<section class="display-box-demo">
  <button class="btn btn-secondary btn-sm" onclick="showNotification1c()">Show Toast</button>
  <button class="btn btn-secondary btn-sm" onclick="showCustomNotification1d()">Show Custom Toast</button>
  <button class="btn btn-secondary btn-sm" onclick="simulateStackedNotifications()">Simulate RealTime Stacked Notifications</button>

  <toasts-component id="toast1c" position="bottom-left"></toasts-component>

  <div style="margin-top: 15px">
    <div style="margin-bottom: 5px; font-size: 0.75rem">Toast Styling Example:</div>
    <toasts-component id="toast3" position=""></toasts-component>
  </div>
</section>

<section class="display-box-demo">
  <div style="margin-top: 15px">
    <div style="margin-bottom: 5px; font-size: 0.75rem">Toast Variant Colors Example:</div>

    <div style="display: flex; gap: 16px;">
      <div style="flex: 1 1 auto">
        <toasts-component id="toast3a" position=""></toasts-component>
        <toasts-component id="toast3b" position=""></toasts-component>
      </div>
      <div style="flex: 1 1 auto">
        <toasts-component id="toast3c" position=""></toasts-component>
        <toasts-component id="toast3d" position=""></toasts-component>
      </div>
    </div>
  </div>
</section>

<section class="display-box-demo">
  <button class="btn btn-secondary btn-sm" onclick="showNotification2a()">Show Plumage Toast</button>
  <toasts-component id="toast2a" position="top-right" plumage-toast></toasts-component>

  <div style="margin-top: 15px; max-width: 500px;">
    <div style="margin-bottom: 5px; font-size: 0.75rem">Plumage Toast Styling Example:</div>
    <toasts-component id="toast2" position="" plumage-toast></toasts-component>
  </div>
</section>

<section class="display-box-demo">
  <button class="btn btn-secondary btn-sm" onclick="showNotification1a()">Show Toast</button>
  <button class="btn btn-secondary btn-sm" onclick="showCustomNotification1b()">Show Custom Toast</button>

  <toasts-component id="toast1a" position="bottom-right" solid-toast></toasts-component>
  <toasts-component id="toast1b" position="bottom-left" solid-toast></toasts-component>

  <div style="margin-top: 15px">
    <div style="margin-bottom: 5px; font-size: 0.75rem">Single Toast Styling Example:</div>
    <toasts-component id="toast1" position="" solid-toast></toasts-component>
  </div>
</section>

<section class="display-box-demo">
  <div style="margin-top: 15px">
    <div style="margin-bottom: 5px; font-size: 0.75rem">Toast Variant Colors Example:</div>

    <div style="display: flex; gap: 16px;">
      <div style="flex: 1 1 auto">
        <toasts-component id="toast1g" solid-toast position=""></toasts-component>
        <toasts-component id="toast1d" solid-toast position=""></toasts-component>
      </div>
      <div style="flex: 1 1 auto">
        <toasts-component id="toast1e" solid-toast position=""></toasts-component>
        <toasts-component id="toast1f" solid-toast position=""></toasts-component>
      </div>
    </div>
  </div>
</section>

<section class="display-box-demo">
  <div style="margin-top: 15px">
    <div style="margin-bottom: 5px; font-size: 0.75rem">Plumage Toast Max Examples:</div>
    <toasts-component id="toast4" position="top-right" plumage-toast plumage-toast-max></toasts-component>
    <toasts-component id="toast2b" position="top-right" plumage-toast plumage-toast-max></toasts-component>
  </div>
</section>

<script>
(function attachExamples(){
  function run() {
    // Ensure CE is defined before calling methods
    customElements.whenDefined('toasts-component').then(() => {
      ${`
window.addEventListener("DOMContentLoaded", () => {
  const toast1 = document.getElementById("toast1");
  toast1 && toast1.showToast({
    toastTitle: "Solid Toast",
    content: "This is a solid toast example!",
    duration: 5000,
    svgIcon: "exclamation-triangle-outline",
    persistent: true,
    variant: toast1.variant, // (uses component default if set)
  });

  const toast1g = document.getElementById("toast1g");
  toast1g && toast1g.showToast({
    toastTitle: "Solid Toast",
    content: "This is a solid toast example!",
    duration: 5000,
    svgIcon: "exclamation-triangle-outline",
    persistent: true,
    variantClass: "primary",
  });

  const toast1d = document.getElementById("toast1d");
  toast1d && toast1d.showToast({
    toastTitle: "Solid Toast",
    content: "This is a solid toast example!",
    duration: 5000,
    svgIcon: "exclamation-triangle-outline",
    persistent: true,
    variantClass: "secondary",
  });

  const toast1e = document.getElementById("toast1e");
  toast1e && toast1e.showToast({
    toastTitle: "Solid Toast",
    content: "This is a solid toast example!",
    duration: 5000,
    svgIcon: "exclamation-triangle-outline",
    persistent: true,
    variantClass: "danger",
  });

  const toast1f = document.getElementById("toast1f");
  toast1f && toast1f.showToast({
    toastTitle: "Solid Toast",
    content: "This is a solid toast example!",
    duration: 5000,
    svgIcon: "exclamation-triangle-outline",
    persistent: true,
    variantClass: "success",
  });

  const toast2 = document.getElementById("toast2");
  toast2 && toast2.showToast({
    toastTitle: "Plumage Toast",
    content: "This is a Plumage styled toast example!",
    duration: 5000,
    svgIcon: "exclamation-circle-fill",
    persistent: true,
    noCloseButton: true,
    iconPlumageStyle: true,
    variantClass: "info",
  });

  const toast3 = document.getElementById("toast3");
  toast3 && toast3.showToast({
    toastTitle: "Title Text",
    content: "This is a default toast example!",
    additionalHdrContent: "43 seconds ago",
    duration: 5000,
    svgIcon: "exclamation-triangle-outline",
    persistent: true,
  });

  const toast3a = document.getElementById("toast3a");
  toast3a && toast3a.showToast({
    toastTitle: "Title Text",
    content: "This is a default toast example!",
    additionalHdrContent: "43 seconds ago",
    duration: 5000,
    svgIcon: "exclamation-triangle-outline",
    persistent: true,
    variantClass: "primary",
  });

  const toast3b = document.getElementById("toast3b");
  toast3b && toast3b.showToast({
    toastTitle: "Title Text",
    content: "This is a default toast example!",
    additionalHdrContent: "43 seconds ago",
    duration: 5000,
    svgIcon: "exclamation-triangle-outline",
    persistent: true,
    variantClass: "danger",
  });

  const toast3c = document.getElementById("toast3c");
  toast3c && toast3c.showToast({
    toastTitle: "Title Text",
    content: "This is a default toast example!",
    additionalHdrContent: "43 seconds ago",
    duration: 5000,
    svgIcon: "exclamation-triangle-outline",
    persistent: true,
    variantClass: "warning",
  });

  const toast3d = document.getElementById("toast3d");
  toast3d && toast3d.showToast({
    toastTitle: "Title Text",
    content: "This is a default toast example!",
    additionalHdrContent: "43 seconds ago",
    duration: 5000,
    svgIcon: "exclamation-triangle-outline",
    persistent: true,
    variantClass: "success",
  });

  const toast4 = document.getElementById("toast4");
  toast4 && toast4.showToast({
    toastTitle: "Plumage Toast Max",
    contentHtml: "<div><div>This is data</div><div>This is data</div></div>",
    duration: 7000,
    svgIcon: "exclamation-circle-fill",
    persistent: true,
    iconPlumageStyle: true,
    variantClass: "danger",
  });
});

window.showNotification1a = function () {
  const t = document.getElementById("toast1a");
  t && t.showToast({
    content: "This is a toast message!",
    variantClass: "primary",
    duration: 5000,
    svgIcon: "exclamation-triangle-outline",
    persistent: false,
    noHoverPause: true,
  });
};

window.showCustomNotification1b = function () {
  const t = document.getElementById("toast1a");
  t && t.showToast({
    content: "This is a custom toast with an icon!",
    variantClass: "light",
    duration: 7000,
    svgIcon: "info-fill",
    persistent: false,
  });
};

window.showNotification1c = function () {
  const t = document.getElementById("toast1c");
  t && t.showToast({
    toastTitle: "Title Text",
    content: "This is a toast message!",
    additionalHdrContent: "43 seconds ago",
    variantClass: "primary",
    duration: 5000,
    svgIcon: "exclamation-triangle-outline",
    persistent: false,
  });
};

window.showCustomNotification1d = function () {
  const t = document.getElementById("toast1c");
  t && t.showToast({
    toastTitle: "Title Text",
    contentHtml: "<div><div>This is data</div><div>This is data</div></div>",
    additionalHdrContent: "43 seconds ago",
    variantClass: "danger",
    duration: 5000,
    svgIcon: "exclamation-triangle-outline",
    persistent: false,
  });
};

window.showNotification2a = function () {
  const t = document.getElementById("toast2a");
  t && t.showToast({
    toastTitle: "Title Text",
    content: "This is a Plumage Styled toast message!",
    duration: 5000,
    svgIcon: "exclamation-circle-fill",
    persistent: false,
    noCloseButton: false,
    iconPlumageStyle: true,
    variantClass: "danger",
  });
};

window.showNotification2b = function () {
  const t = document.getElementById("toast2b");
  t && t.showToast({
    toastTitle: "Plumage Toast Max",
    contentHtml: \`<div slot="custom-content">
            <div>This is data</div>
            <div>This is data</div>
          </div>\`,
    duration: 7000,
    svgIcon: "exclamation-circle-fill",
    persistent: false,
    noCloseButton: false,
    iconPlumageStyle: true,
    variantClass: "danger",
  });
};

// Simulate real-time notifications
(function simulateRealTimeNotifications() {
  const types = ["error", "update", "news"];
  const messages = {
    error: "An error toast example!",
    update: "System update toast example!",
    news: "Breaking news alert/toast example !",
  };
  const variants = { error: "danger", update: "info", news: "primary" };
  const icons = {
    error: "exclamation-triangle-fill",
    update: "info-fill",
    news: "check-circle-fill",
  };

  setInterval(() => {
    const type = types[Math.floor(Math.random() * types.length)];
    const t = document.getElementById("toast1a");
    t && t.showToast({
      toastTitle: type[0].toUpperCase() + type.slice(1),
      content: messages[type],
      variantClass: variants[type],
      duration: 7000,
      svgIcon: icons[type],
      persistent: false,
    });
  }, 10000);
})();

window.simulateStackedNotifications = function () {
  const t = document.getElementById("toast1c");
  const notifications = [
    {
      toastTitle: "Title Text 1",
      content: "Stacked Notification 1",
      variantClass: "info",
      additionalHdrContent: "43 seconds ago",
    },
    {
      toastTitle: "Title Text 2",
      content: "Stacked Notification 2",
      variantClass: "danger",
    },
    {
      toastTitle: "Title Text 3",
      content: "Stacked Notification 3",
      variantClass: "success",
    },
  ];

  let delay = 0;
  notifications.forEach((n) => {
    setTimeout(
      () =>
        t && t.showToast({
          ...n,
          duration: 10000,
          svgIcon: "exclamation-triangle-outline",
          persistent: false,
        }),
      delay
    );
    delay += 2000;
  });
};`.trim()}
    }); // whenDefined
  }

  if (document.readyState !== 'loading') run();
  else window.addEventListener('DOMContentLoaded', run);
})();
</script>
`;
