// File: src/stories/modal-component.story-helpers.js

export const portalizeModalInDocs = (root) => {
  const inDocs = !!document.querySelector('.sbdocs, .docs-story');
  if (!inDocs) return { destroy: () => {} };

  const portedNodes = new Set();

  const portToBody = (el, zIndex) => {
    if (!el || el.__ported_to_body__) return;
    el.__ported_to_body__ = true;
    el.style.position = 'fixed';
    if (zIndex != null) el.style.zIndex = String(zIndex);
    document.body.appendChild(el);
    portedNodes.add(el);
  };

  const syncNow = () => {
    const hostScope = root;
    const modalEls = hostScope.querySelectorAll('.modal');
    const backdropEls = hostScope.querySelectorAll('.modal-backdrop');

    modalEls.forEach((m) => portToBody(m, 1060));
    backdropEls.forEach((b) => portToBody(b, 1050));
  };

  const mo = new MutationObserver(() => syncNow());
  mo.observe(root, { childList: true, subtree: true, attributes: true });

  queueMicrotask(syncNow);

  return {
    destroy: () => {
      mo.disconnect();
      portedNodes.forEach((el) => {
        try {
          el.remove();
        } catch (_) {}
      });
      portedNodes.clear();
    },
  };
};

export const docsPortalDecorator = (Story) => {
  const wrapEl = document.createElement('div');

  const out = Story();
  if (typeof out === 'string') {
    wrapEl.innerHTML = out;
  } else if (out instanceof Node) {
    wrapEl.appendChild(out);
  }

  const control = portalizeModalInDocs(wrapEl);

  const removalObserver = new MutationObserver(() => {
    if (!document.body.contains(wrapEl)) {
      removalObserver.disconnect();
      control.destroy();
    }
  });
  removalObserver.observe(document.body, { childList: true, subtree: true });

  return wrapEl;
};

export const normalize = (v) => {
  if (v === '' || v == null) return undefined;
  if (v === true) return true;
  if (v === false) return false;
  return v;
};

export const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const boolAttr = (name, on) => (on ? ` ${name}` : '');

export const attr = (name, val) => {
  const v = normalize(val);
  return v === undefined || v === false ? '' : v === true ? ` ${name}` : ` ${name}="${esc(v)}"`;
};

export const DOCS_SIZES = [
  '<div style="display:grid; gap:16px;">',
  '  <modal-component variant="secondary" btn-text="Small (sm)" modal-size="sm">',
  '    <p>Small modal.</p>',
  '    <button-component slot="footer" variant="primary">OK</button-component>',
  '  </modal-component>',
  '',
  '  <modal-component variant="secondary" btn-text="Large (lg)" modal-size="lg">',
  '    <p>Large modal.</p>',
  '    <button-component slot="footer" variant="primary">OK</button-component>',
  '  </modal-component>',
  '',
  '  <modal-component variant="secondary" btn-text="Extra Large (xl)" modal-size="xl">',
  '    <p>Extra large modal.</p>',
  '    <button-component slot="footer" variant="primary">OK</button-component>',
  '  </modal-component>',
  '</div>',
].join('\n');

export const DOCS_FULLSCREEN = [
  '<div style="display:grid; gap:16px;">',
  '  <modal-component variant="dark" btn-text="Fullscreen" modal-full-screen="fullscreen">',
  '    <p>Always fullscreen.</p>',
  '  </modal-component>',
  '',
  '  <modal-component variant="dark" btn-text="md-down fullscreen" modal-full-screen="md-down">',
  '    <p>Fullscreen at md and below.</p>',
  '  </modal-component>',
  '</div>',
].join('\n');

export const DOCS_SCROLLABLE_BODY = `
<modal-component variant="info" btn-text="Scrollable body" scrollable-body modal-size="lg">
  ${Array.from({ length: 20 }, (_, i) => `<p>Scrollable content line ${i + 1}</p>`).join('')}
</modal-component>
`.trim();

export const DOCS_LONG_SCROLL = `
<modal-component variant="secondary" btn-text="Long content (window scroll)" scroll-long-content>
  ${Array.from({ length: 30 }, (_, i) => `<p>Long content ${i + 1}</p>`).join('')}
</modal-component>
`.trim();

export const DOCS_MATRIX = `<!-- Accessibility matrix is rendered via DOM (see Canvas). -->`;

export const buildDocsHtml = (args, storyName = '') => {
  const n = String(storyName || '').replace(/\s+/g, '');

  if (n === 'ModalSizes') return DOCS_SIZES;
  if (n === 'Fullscreenvariants') return DOCS_FULLSCREEN;
  if (n === 'Scrollablebodymodal') return DOCS_SCROLLABLE_BODY;
  if (n === 'Longcontent(windowscroll)') return DOCS_LONG_SCROLL;
  if (n === 'AccessibilityMatrix') return DOCS_MATRIX;

  return [
    `<modal-component`,
    `  ${attr('btn-text', args.btnText)}`,
    `  ${attr('variant', args.variant)}`,
    `  ${attr('size', args.size)}`,
    `  ${attr('shape', args.shape)}`,
    `  ${boolAttr('outlined', !!args.outlined)}`,
    `  ${boolAttr('block', !!args.block)}`,
    `  ${boolAttr('link', !!args.link)}`,
    `  ${boolAttr('ripple', !!args.ripple)}`,
    `  ${attr('class-names', args.classNames)}`,
    `  ${boolAttr('disabled', !!args.disabled)}`,
    `  ${attr('title-attr', args.titleAttr)}`,
    `  ${attr('aria-label', args.ariaLabel)}`,
    ``,
    `  ${attr('modal-id', args.modalId)}`,
    `  ${attr('modal-title', args.modalTitle)}`,
    `  ${attr('modal-size', args.modalSize)}`,
    `  ${attr('modal-full-screen', args.modalFullScreen)}`,
    `  ${boolAttr('scrollable-body', !!args.scrollableBody)}`,
    `  ${boolAttr('scroll-long-content', !!args.scrollLongContent)}`,
    `  ${boolAttr('vertically-centered', !!args.verticallyCentered)}`,
    ``,
    `  ${attr('cancel-close-btn', args.cancelCloseBtn)}`,
    `>`,
    `  ${args.bodyHtml || `<p>Woohoo, you're reading this text in a modal!</p>\n  <p>This is the modal body. Add any markup you like here.</p>`}`,
    ``,
    `  ${
      args.footerHtml
        ? `<span slot="footer">${args.footerHtml}</span>`
        : `<button-component slot="footer" variant="primary" ${attr('size', args.size)}>Save changes</button-component>`
    }`,
    `</modal-component>`,
  ]
    .filter((l) => l.trim() !== '')
    .join('\n');
};

export const template = (args) => `
<modal-component
  ${attr('btn-text', args.btnText)}
  ${attr('variant', args.variant)}
  ${attr('size', args.size)}
  ${attr('shape', args.shape)}
  ${boolAttr('outlined', !!args.outlined)}
  ${boolAttr('block', !!args.block)}
  ${boolAttr('link', !!args.link)}
  ${boolAttr('ripple', !!args.ripple)}
  ${attr('class-names', args.classNames)}
  ${boolAttr('disabled', !!args.disabled)}
  ${attr('title-attr', args.titleAttr)}
  ${attr('aria-label', args.ariaLabel)}

  ${attr('modal-id', args.modalId)}
  ${attr('modal-title', args.modalTitle)}
  ${attr('modal-size', args.modalSize)}
  ${attr('modal-full-screen', args.modalFullScreen)}
  ${boolAttr('scrollable-body', !!args.scrollableBody)}
  ${boolAttr('scroll-long-content', !!args.scrollLongContent)}
  ${boolAttr('vertically-centered', !!args.verticallyCentered)}

  ${attr('cancel-close-btn', args.cancelCloseBtn)}
>
  ${
    args.bodyHtml ||
    `
  <p>Woohoo, you're reading this text in a modal!</p>
  <p>This is the modal body. Add any markup you like here.</p>`
  }

  ${
    args.footerHtml
      ? `<span slot="footer">${args.footerHtml}</span>`
      : `<button-component slot="footer" variant="primary" ${attr('size', args.size)}>Save changes</button-component>`
  }
</modal-component>
`;

export function pickAttrs(el, names) {
  const out = {};
  for (const n of names) {
    const v = el.getAttribute(n);
    if (v !== null && v !== '') out[n] = v;
  }
  return out;
}

export function splitIds(v) {
  return String(v || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

export function resolveIdsWithin(host, ids) {
  const res = {};
  for (const id of ids) {
    const safe = String(id).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const node = host.querySelector(`[id="${safe}"]`);
    res[id] = !!node;
  }
  return res;
}

export function snapshotA11y(host) {
  const trigger = host.querySelector('button[type="button"]');
  const modal = host.querySelector('.modal');
  const dialog = host.querySelector('.modal-dialog');
  const title = modal ? host.querySelector(`#${modal.getAttribute('aria-labelledby') || ''}`) : null;
  const desc = modal ? host.querySelector(`#${modal.getAttribute('aria-describedby') || ''}`) : null;

  const labelledByIds = modal ? splitIds(modal.getAttribute('aria-labelledby')) : [];
  const describedByIds = modal ? splitIds(modal.getAttribute('aria-describedby')) : [];

  return {
    trigger: trigger
      ? {
          tag: trigger.tagName.toLowerCase(),
          text: (trigger.textContent || '').trim(),
          ...pickAttrs(trigger, ['aria-label', 'aria-haspopup', 'aria-controls', 'aria-expanded', 'aria-disabled', 'disabled']),
        }
      : null,
    modal: modal
      ? {
          tag: modal.tagName.toLowerCase(),
          id: modal.getAttribute('id') || '',
          ...pickAttrs(modal, ['role', 'aria-modal', 'aria-labelledby', 'aria-describedby', 'aria-hidden', 'tabindex']),
          resolves: {
            'aria-labelledby': resolveIdsWithin(host, labelledByIds),
            'aria-describedby': resolveIdsWithin(host, describedByIds),
          },
          hasTitleEl: !!title,
          hasDescEl: !!desc,
        }
      : null,
    dialog: dialog
      ? {
          tag: dialog.tagName.toLowerCase(),
          id: dialog.getAttribute('id') || '',
          ...pickAttrs(dialog, ['role', 'tabindex', 'class']),
        }
      : null,
  };
}

export function buildMatrixRow({ title, args, wrapStyle = '', idSuffix }) {
  const wrap = document.createElement('div');
  wrap.style.border = '1px solid #ddd';
  wrap.style.borderRadius = '12px';
  wrap.style.padding = '12px';
  wrap.style.display = 'grid';
  wrap.style.gap = '10px';

  const heading = document.createElement('div');
  heading.style.fontWeight = '700';
  heading.textContent = title;

  const stage = document.createElement('div');
  stage.style.maxWidth = '720px';
  if (wrapStyle) stage.setAttribute('style', wrapStyle);

  const container = document.createElement('div');
  container.innerHTML = template({
    ...args,
    modalId: args.modalId || `modal-a11y-${idSuffix}`,
  });

  stage.appendChild(container);

  const pre = document.createElement('pre');
  pre.style.margin = '0';
  pre.style.padding = '10px';
  pre.style.background = '#f6f8fa';
  pre.style.borderRadius = '10px';
  pre.style.overflowX = 'auto';
  pre.style.fontSize = '12px';
  pre.textContent = 'Collecting aria/role/id…';

  wrap.appendChild(heading);
  wrap.appendChild(stage);
  wrap.appendChild(pre);

  const update = () => {
    const host = container.querySelector('modal-component');
    if (!host) return;
    pre.textContent = JSON.stringify(snapshotA11y(host), null, 2);
  };

  requestAnimationFrame(() => requestAnimationFrame(update));

  return wrap;
}
