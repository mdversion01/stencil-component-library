// File: src/stories/modal-component.story-helpers.js

export const portalizeModalInDocs = root => {
  const inDocs =
    Boolean(
      document.querySelector(
        '.sbdocs, .docs-story',
      ),
    );

  if (!inDocs) {
    return {
      destroy: () => {},
    };
  }

  const portedNodes =
    new Set();

  const portToBody = (
    el,
    zIndex,
  ) => {
    if (
      !el ||
      el.__ported_to_body__
    ) {
      return;
    }

    el.__ported_to_body__ =
      true;

    el.style.position =
      'fixed';

    if (
      zIndex != null
    ) {
      el.style.zIndex =
        String(zIndex);
    }

    document.body.appendChild(
      el,
    );

    portedNodes.add(
      el,
    );
  };

  const syncNow = () => {
    const hostScope =
      root;

    const modalEls =
      hostScope.querySelectorAll(
        '.modal',
      );

    const backdropEls =
      hostScope.querySelectorAll(
        '.modal-backdrop',
      );

    modalEls.forEach(
      modal =>
        portToBody(
          modal,
          1060,
        ),
    );

    backdropEls.forEach(
      backdrop =>
        portToBody(
          backdrop,
          1050,
        ),
    );
  };

  const observer =
    new MutationObserver(
      syncNow,
    );

  observer.observe(
    root,
    {
      childList: true,
      subtree: true,
      attributes: true,
    },
  );

  queueMicrotask(
    syncNow,
  );

  return {
    destroy: () => {
      observer.disconnect();

      portedNodes.forEach(
        el => {
          try {
            el.remove();
          } catch (_) {
            // Ignore nodes already removed by Storybook.
          }
        },
      );

      portedNodes.clear();
    },
  };
};

export const docsPortalDecorator =
  Story => {
    const wrapEl =
      document.createElement(
        'div',
      );

    const out =
      Story();

    if (
      typeof out === 'string'
    ) {
      wrapEl.innerHTML =
        out;
    } else if (
      out instanceof Node
    ) {
      wrapEl.appendChild(
        out,
      );
    }

    const control =
      portalizeModalInDocs(
        wrapEl,
      );

    const removalObserver =
      new MutationObserver(
        () => {
          if (
            !document.body.contains(
              wrapEl,
            )
          ) {
            removalObserver.disconnect();
            control.destroy();
          }
        },
      );

    removalObserver.observe(
      document.body,
      {
        childList: true,
        subtree: true,
      },
    );

    return wrapEl;
  };

export const normalize = value => {
  if (
    value === '' ||
    value == null
  ) {
    return undefined;
  }

  if (
    value === true
  ) {
    return true;
  }

  if (
    value === false
  ) {
    return false;
  }

  return value;
};

export const esc = value =>
  String(value)
    .replace(
      /&/g,
      '&amp;',
    )
    .replace(
      /</g,
      '&lt;',
    )
    .replace(
      />/g,
      '&gt;',
    )
    .replace(
      /"/g,
      '&quot;',
    );

export const boolAttr = (
  name,
  on,
) =>
  on
    ? ` ${name}`
    : '';

export const attr = (
  name,
  value,
) => {
  const normalized =
    normalize(value);

  if (
    normalized === undefined ||
    normalized === false
  ) {
    return '';
  }

  if (
    normalized === true
  ) {
    return ` ${name}`;
  }

  return ` ${name}="${esc(normalized)}"`;
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

  '  <modal-component',
  '    variant="secondary"',
  '    btn-text="Always fullscreen"',
  '    modal-full-screen="fullscreen"',
  '  >',
  '    <p>This modal is always fullscreen.</p>',
  '  </modal-component>',

  '',

  '  <modal-component',
  '    variant="secondary"',
  '    btn-text="Fullscreen below sm"',
  '    modal-full-screen="fullscreen-sm-down"',
  '  >',
  '    <p>This modal is fullscreen below the sm breakpoint (576px).</p>',
  '  </modal-component>',

  '',

  '  <modal-component',
  '    variant="secondary"',
  '    btn-text="Fullscreen below md"',
  '    modal-full-screen="fullscreen-md-down"',
  '  >',
  '    <p>This modal is fullscreen below the md breakpoint (768px).</p>',
  '  </modal-component>',

  '',

  '  <modal-component',
  '    variant="secondary"',
  '    btn-text="Fullscreen below lg"',
  '    modal-full-screen="fullscreen-lg-down"',
  '  >',
  '    <p>This modal is fullscreen below the lg breakpoint (992px).</p>',
  '  </modal-component>',

  '',

  '  <modal-component',
  '    variant="secondary"',
  '    btn-text="Fullscreen below xl"',
  '    modal-full-screen="fullscreen-xl-down"',
  '  >',
  '    <p>This modal is fullscreen below the xl breakpoint (1200px).</p>',
  '  </modal-component>',

  '',

  '  <modal-component',
  '    variant="secondary"',
  '    btn-text="Fullscreen below xxl"',
  '    modal-full-screen="fullscreen-xxl-down"',
  '  >',
  '    <p>This modal is fullscreen below the xxl breakpoint (1400px).</p>',
  '  </modal-component>',

  '</div>',
].join('\n');

export const DOCS_SCROLLABLE_BODY = `
<modal-component
  variant="info"
  btn-text="Scrollable body"
  scrollable-body
  modal-size="lg"
>
  ${Array.from(
    {
      length: 20,
    },
    (_, index) =>
      `<p>Scrollable content line ${index + 1}</p>`,
  ).join('')}
</modal-component>
`.trim();

export const DOCS_LONG_SCROLL = `
<modal-component
  variant="secondary"
  btn-text="Long content (window scroll)"
  scroll-long-content
>
  ${Array.from(
    {
      length: 30,
    },
    (_, index) =>
      `<p>Long content ${index + 1}</p>`,
  ).join('')}
</modal-component>
`.trim();

export const DOCS_MATRIX = `
<!-- Default modal -->
<modal-component
  modal-id="modal-a11y-1"
  variant="primary"
  btn-text="Open modal"
  modal-title="Default Dialog"
>
  <p>Default modal content.</p>
</modal-component>

<!-- Explicit trigger accessible name -->
<modal-component
  modal-id="modal-a11y-2"
  variant="secondary"
  btn-text="Open details"
  aria-label="Open account details dialog"
  modal-title="Account details"
>
  <p>Account details content.</p>
</modal-component>

<!-- Explicit modal ID -->
<modal-component
  modal-id="modal-a11y-custom"
  variant="secondary"
  btn-text="Open custom ID modal"
  modal-title="Custom ID Dialog"
>
  <p>This dialog uses an explicit modal id.</p>
</modal-component>

<!-- Disabled trigger -->
<modal-component
  modal-id="modal-a11y-4"
  variant="secondary"
  btn-text="Disabled modal trigger"
  modal-title="Disabled Dialog"
  disabled
>
  <p>This modal should not open because its trigger is disabled.</p>
</modal-component>
`.trim();

export const buildDocsHtml = (
  args,
  storyName = '',
) => {
  const normalizedStoryName =
    String(
      storyName || '',
    ).replace(
      /\s+/g,
      '',
    );

  if (
    normalizedStoryName ===
    'Modalsizes'
  ) {
    return DOCS_SIZES;
  }

  if (
    normalizedStoryName ===
    'Fullscreenvariants'
  ) {
    return DOCS_FULLSCREEN;
  }

  if (
    normalizedStoryName ===
    'Scrollablebodymodal'
  ) {
    return DOCS_SCROLLABLE_BODY;
  }

  if (
    normalizedStoryName ===
    'Longcontent(windowscroll)'
  ) {
    return DOCS_LONG_SCROLL;
  }

  if (
    normalizedStoryName ===
    'AccessibilityMatrix(computed)' ||
    normalizedStoryName ===
    'AccessibilityMatrix'
  ) {
    return DOCS_MATRIX;
  }

  return [
    '<modal-component',
    `  ${attr(
      'btn-text',
      args.btnText,
    )}`,
    `  ${attr(
      'variant',
      args.variant,
    )}`,
    `  ${attr(
      'size',
      args.size,
    )}`,
    `  ${attr(
      'shape',
      args.shape,
    )}`,
    `  ${boolAttr(
      'outlined',
      Boolean(
        args.outlined,
      ),
    )}`,
    `  ${boolAttr(
      'block',
      Boolean(
        args.block,
      ),
    )}`,
    `  ${boolAttr(
      'link',
      Boolean(
        args.link,
      ),
    )}`,
    `  ${boolAttr(
      'ripple',
      Boolean(
        args.ripple,
      ),
    )}`,
    `  ${attr(
      'class-names',
      args.classNames,
    )}`,
    `  ${boolAttr(
      'disabled',
      Boolean(
        args.disabled,
      ),
    )}`,
    `  ${attr(
      'title-attr',
      args.titleAttr,
    )}`,
    `  ${attr(
      'aria-label',
      args.ariaLabel,
    )}`,
    '',
    `  ${attr(
      'modal-id',
      args.modalId,
    )}`,
    `  ${attr(
      'modal-title',
      args.modalTitle,
    )}`,
    `  ${attr(
      'modal-size',
      args.modalSize,
    )}`,
    `  ${attr(
      'modal-full-screen',
      args.modalFullScreen,
    )}`,
    `  ${boolAttr(
      'scrollable-body',
      Boolean(
        args.scrollableBody,
      ),
    )}`,
    `  ${boolAttr(
      'scroll-long-content',
      Boolean(
        args.scrollLongContent,
      ),
    )}`,
    `  ${boolAttr(
      'vertically-centered',
      Boolean(
        args.verticallyCentered,
      ),
    )}`,
    '',
    `  ${attr(
      'cancel-close-btn',
      args.cancelCloseBtn,
    )}`,
    '>',
    `  ${
      args.bodyHtml ||
      '<p>Woohoo, you\'re reading this text in a modal!</p>\n  <p>This is the modal body. Add any markup you like here.</p>'
    }`,
    '',
    `  ${
      args.footerHtml
        ? `<span slot="footer">${args.footerHtml}</span>`
        : `<button-component slot="footer" variant="primary" ${attr(
            'size',
            args.size,
          )}>Save changes</button-component>`
    }`,
    '</modal-component>',
  ]
    .filter(
      line =>
        line.trim() !== '',
    )
    .join('\n');
};

export const template =
  args => `
<modal-component
  ${attr(
    'btn-text',
    args.btnText,
  )}
  ${attr(
    'variant',
    args.variant,
  )}
  ${attr(
    'size',
    args.size,
  )}
  ${attr(
    'shape',
    args.shape,
  )}
  ${boolAttr(
    'outlined',
    Boolean(
      args.outlined,
    ),
  )}
  ${boolAttr(
    'block',
    Boolean(
      args.block,
    ),
  )}
  ${boolAttr(
    'link',
    Boolean(
      args.link,
    ),
  )}
  ${boolAttr(
    'ripple',
    Boolean(
      args.ripple,
    ),
  )}
  ${attr(
    'class-names',
    args.classNames,
  )}
  ${boolAttr(
    'disabled',
    Boolean(
      args.disabled,
    ),
  )}
  ${attr(
    'title-attr',
    args.titleAttr,
  )}
  ${attr(
    'aria-label',
    args.ariaLabel,
  )}

  ${attr(
    'modal-id',
    args.modalId,
  )}
  ${attr(
    'modal-title',
    args.modalTitle,
  )}
  ${attr(
    'modal-size',
    args.modalSize,
  )}
  ${attr(
    'modal-full-screen',
    args.modalFullScreen,
  )}
  ${boolAttr(
    'scrollable-body',
    Boolean(
      args.scrollableBody,
    ),
  )}
  ${boolAttr(
    'scroll-long-content',
    Boolean(
      args.scrollLongContent,
    ),
  )}
  ${boolAttr(
    'vertically-centered',
    Boolean(
      args.verticallyCentered,
    ),
  )}

  ${attr(
    'cancel-close-btn',
    args.cancelCloseBtn,
  )}
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
      : `<button-component slot="footer" variant="primary" ${attr(
          'size',
          args.size,
        )}>Save changes</button-component>`
  }
</modal-component>
`;

export function pickAttrs(
  el,
  names,
) {
  const out = {};

  if (!el) {
    return out;
  }

  for (
    const name of names
  ) {
    const value =
      el.getAttribute(
        name,
      );

    if (
      value !== null
    ) {
      out[name] =
        value;
    }
  }

  return out;
}

export function splitIds(
  value,
) {
  return String(
    value || '',
  )
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

export function resolveIds(
  ids,
) {
  const result = {};

  for (
    const id of ids
  ) {
    result[id] =
      Boolean(
        document.getElementById(
          id,
        ),
      );
  }

  return result;
}

function findTrigger(
  host,
) {
  if (!host) {
    return null;
  }

  const selectors = [
    'button-component button',
    'button[aria-haspopup="dialog"]',
    'button[aria-haspopup="true"]',
    'button[aria-controls]',
    'button[type="button"]',
    'button',
  ];

  for (
    const selector of selectors
  ) {
    const trigger =
      host.querySelector(
        selector,
      );

    if (trigger) {
      return trigger;
    }
  }

  return null;
}

function findModal(
  host,
  trigger,
) {
  const controlledId =
    trigger?.getAttribute(
      'aria-controls',
    ) || '';

  if (controlledId) {
    const controlledModal =
      document.getElementById(
        controlledId,
      );

    if (controlledModal) {
      return controlledModal;
    }
  }

  const configuredId =
    host?.modalId ||
    host?.getAttribute(
      'modal-id',
    ) ||
    '';

  if (configuredId) {
    const configuredModal =
      document.getElementById(
        configuredId,
      );

    if (configuredModal) {
      return configuredModal;
    }
  }

  const localModal =
    host?.querySelector(
      '.modal',
    );

  if (localModal) {
    return localModal;
  }

  return null;
}

async function waitForModalReady(
  host,
) {
  if (!host) {
    return;
  }

  if (
    typeof host.componentOnReady ===
    'function'
  ) {
    await host.componentOnReady();
  } else if (
    window.customElements
      ?.whenDefined
  ) {
    await customElements.whenDefined(
      'modal-component',
    );
  }

  for (
    let attempt = 0;
    attempt < 10;
    attempt += 1
  ) {
    await new Promise(
      resolve =>
        requestAnimationFrame(
          resolve,
        ),
    );

    const trigger =
      findTrigger(host);

    const modal =
      findModal(
        host,
        trigger,
      );

    if (
      trigger ||
      modal
    ) {
      if (
        trigger &&
        modal
      ) {
        return;
      }
    }
  }
}

function snapshotTrigger(
  trigger,
  modal,
) {
  if (!trigger) {
    return null;
  }

  const controls =
    trigger.getAttribute(
      'aria-controls',
    ) || '';

  const labelledBy =
    trigger.getAttribute(
      'aria-labelledby',
    ) || '';

  const describedBy =
    trigger.getAttribute(
      'aria-describedby',
    ) || '';

  return {
    tag:
      trigger.tagName.toLowerCase(),

    id:
      trigger.getAttribute(
        'id',
      ) || '',

    text:
      (
        trigger.textContent ||
        ''
      )
        .replace(
          /\s+/g,
          ' ',
        )
        .trim(),

    class:
      trigger.getAttribute(
        'class',
      ) || '',

    ...pickAttrs(
      trigger,
      [
        'type',
        'title',
        'role',
        'aria-label',
        'aria-labelledby',
        'aria-describedby',
        'aria-haspopup',
        'aria-controls',
        'aria-expanded',
        'aria-disabled',
        'disabled',
      ],
    ),

    resolves: {
      'aria-controls':
        controls
          ? resolveIds(
              splitIds(
                controls,
              ),
            )
          : {},

      'aria-labelledby':
        labelledBy
          ? resolveIds(
              splitIds(
                labelledBy,
              ),
            )
          : {},

      'aria-describedby':
        describedBy
          ? resolveIds(
              splitIds(
                describedBy,
              ),
            )
          : {},
    },

    controlsModal:
      Boolean(
        controls &&
        modal?.id &&
        splitIds(
          controls,
        ).includes(
          modal.id,
        ),
      ),
  };
}

function snapshotModal(
  modal,
) {
  if (!modal) {
    return null;
  }

  const labelledBy =
    modal.getAttribute(
      'aria-labelledby',
    ) || '';

  const describedBy =
    modal.getAttribute(
      'aria-describedby',
    ) || '';

  const titleIds =
    splitIds(
      labelledBy,
    );

  const descriptionIds =
    splitIds(
      describedBy,
    );

  return {
    tag:
      modal.tagName.toLowerCase(),

    id:
      modal.getAttribute(
        'id',
      ) || '',

    class:
      modal.getAttribute(
        'class',
      ) || '',

    ...pickAttrs(
      modal,
      [
        'role',
        'aria-modal',
        'aria-label',
        'aria-labelledby',
        'aria-describedby',
        'aria-hidden',
        'tabindex',
      ],
    ),

    resolves: {
      'aria-labelledby':
        resolveIds(
          titleIds,
        ),

      'aria-describedby':
        resolveIds(
          descriptionIds,
        ),
    },

    hasTitleElement:
      titleIds.length > 0 &&
      titleIds.every(
        id =>
          Boolean(
            document.getElementById(
              id,
            ),
          ),
      ),

    hasDescriptionElement:
      descriptionIds.length > 0 &&
      descriptionIds.every(
        id =>
          Boolean(
            document.getElementById(
              id,
            ),
          ),
      ),
  };
}

function snapshotDialog(
  modal,
) {
  if (!modal) {
    return null;
  }

  const dialog =
    modal.querySelector(
      '.modal-dialog',
    );

  if (!dialog) {
    return null;
  }

  return {
    tag:
      dialog.tagName.toLowerCase(),

    id:
      dialog.getAttribute(
        'id',
      ) || '',

    class:
      dialog.getAttribute(
        'class',
      ) || '',

    ...pickAttrs(
      dialog,
      [
        'role',
        'aria-label',
        'aria-labelledby',
        'aria-describedby',
        'tabindex',
      ],
    ),
  };
}

function snapshotCloseButtons(
  modal,
) {
  if (!modal) {
    return [];
  }

  const buttons =
    Array.from(
      modal.querySelectorAll(
        [
          'button[data-bs-dismiss="modal"]',
          '.btn-close',
          '.modal-footer button',
        ].join(','),
      ),
    );

  return buttons.map(
    (
      button,
      index,
    ) => ({
      index,

      tag:
        button.tagName.toLowerCase(),

      text:
        (
          button.textContent ||
          ''
        )
          .replace(
            /\s+/g,
            ' ',
          )
          .trim(),

      ...pickAttrs(
        button,
        [
          'type',
          'title',
          'aria-label',
          'aria-disabled',
          'disabled',
          'data-bs-dismiss',
        ],
      ),
    }),
  );
}

export function snapshotA11y(
  host,
) {
  if (!host) {
    return {
      error:
        'modal-component not found',
    };
  }

  const trigger =
    findTrigger(
      host,
    );

  const modal =
    findModal(
      host,
      trigger,
    );

  const labelledBy =
    modal?.getAttribute(
      'aria-labelledby',
    ) || '';

  const describedBy =
    modal?.getAttribute(
      'aria-describedby',
    ) || '';

  const labelledByIds =
    splitIds(
      labelledBy,
    );

  const describedByIds =
    splitIds(
      describedBy,
    );

  return {
    host: {
      tag:
        host.tagName.toLowerCase(),

      id:
        host.getAttribute(
          'id',
        ) || '',

      modalId:
        host.modalId ||
        host.getAttribute(
          'modal-id',
        ) ||
        '',

      ...pickAttrs(
        host,
        [
          'aria-label',
          'aria-labelledby',
          'aria-describedby',
          'aria-disabled',
          'role',
          'disabled',
        ],
      ),
    },

    trigger:
      snapshotTrigger(
        trigger,
        modal,
      ),

    modal:
      snapshotModal(
        modal,
      ),

    dialog:
      snapshotDialog(
        modal,
      ),

    closeButtons:
      snapshotCloseButtons(
        modal,
      ),

    summary: {
      triggerFound:
        Boolean(
          trigger,
        ),

      modalFound:
        Boolean(
          modal,
        ),

      dialogFound:
        Boolean(
          modal?.querySelector(
            '.modal-dialog',
          ),
        ),

      role:
        modal?.getAttribute(
          'role',
        ) || '',

      ariaModal:
        modal?.getAttribute(
          'aria-modal',
        ) || '',

      ariaLabelledByResolves:
        labelledByIds.length > 0 &&
        labelledByIds.every(
          id =>
            Boolean(
              document.getElementById(
                id,
              ),
            ),
        ),

      ariaDescribedByResolves:
        describedByIds.length > 0 &&
        describedByIds.every(
          id =>
            Boolean(
              document.getElementById(
                id,
              ),
            ),
        ),

      triggerControlsModal:
        Boolean(
          trigger?.getAttribute(
            'aria-controls',
          ) &&
          modal?.id &&
          splitIds(
            trigger.getAttribute(
              'aria-controls',
            ),
          ).includes(
            modal.id,
          ),
        ),

      triggerExpanded:
        trigger?.getAttribute(
          'aria-expanded',
        ) ?? null,

      triggerDisabled:
        Boolean(
          trigger?.disabled ||
          trigger?.hasAttribute(
            'disabled',
          ) ||
          trigger?.getAttribute(
            'aria-disabled',
          ) === 'true',
        ),
    },
  };
}

export function buildMatrixRow({
  title,
  args,
  idSuffix,
}) {
  const wrapper =
    document.createElement(
      'div',
    );

  wrapper.className =
    'modal-accessibility-matrix__row';

  const heading =
    document.createElement(
      'div',
    );

  heading.className =
    'modal-accessibility-matrix__row-heading';

  heading.textContent =
    title;

  const stage =
    document.createElement(
      'div',
    );

  stage.className =
    'modal-accessibility-matrix__stage';

  const container =
    document.createElement(
      'div',
    );

  const modalId =
    args.modalId ||
    `modal-a11y-${idSuffix}`;

  container.innerHTML =
    template({
      ...args,
      modalId,
    });

  stage.appendChild(
    container,
  );

  const output =
    document.createElement(
      'pre',
    );

  output.className =
    'modal-accessibility-matrix__output';

  output.textContent =
    'Collecting modal accessibility attributes…';

  wrapper.appendChild(
    heading,
  );

  wrapper.appendChild(
    stage,
  );

  wrapper.appendChild(
    output,
  );

  const update =
    async () => {
      try {
        const host =
          container.querySelector(
            'modal-component',
          );

        if (!host) {
          output.textContent =
            JSON.stringify(
              {
                error:
                  'modal-component not found',
              },
              null,
              2,
            );

          return;
        }

        await waitForModalReady(
          host,
        );

        output.textContent =
          JSON.stringify(
            snapshotA11y(
              host,
            ),
            null,
            2,
          );
      } catch (
        error
      ) {
        output.textContent =
          String(
            error?.stack ||
            error,
          );
      }
    };

  void update();

  return wrapper;
}
