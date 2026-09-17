// File: src/stories/divider-component/divider-component.story-helpers.js

export const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta? Refert tamen, quo modo.';


export const setAttr = (
  el,
  name,
  value,
) => {
  if (value === true) {
    el.setAttribute(
      name,
      '',
    );

    return;
  }

  if (
    value === false ||
    value == null ||
    value === ''
  ) {
    el.removeAttribute(
      name,
    );

    return;
  }

  el.setAttribute(
    name,
    String(value),
  );
};


export const normalize = txt => {
  const lines =
    String(txt || '')
      .replace(
        /\r\n/g,
        '\n',
      )
      .split('\n')
      .map(line =>
        line.replace(
          /[ \t]+$/g,
          '',
        ),
      );

  const out = [];
  let prevBlank = false;

  for (const line of lines) {
    const blank =
      line.trim() === '';

    if (blank) {
      if (prevBlank) {
        continue;
      }

      prevBlank = true;

      out.push('');

      continue;
    }

    prevBlank = false;

    out.push(line);
  }

  while (
    out[0] === ''
  ) {
    out.shift();
  }

  while (
    out[out.length - 1] === ''
  ) {
    out.pop();
  }

  return out.join('\n');
};


export const attrLines = pairs =>
  pairs
    .filter(
      ([, value]) =>
        value !== undefined &&
        value !== null &&
        value !== '' &&
        value !== false,
    )
    .map(
      ([key, value]) =>
        value === true
          ? key
          : `${key}="${String(
              value,
            ).replace(
              /"/g,
              '&quot;',
            )}"`,
    )
    .join('\n  ');


export const buildDividerHtml = (
  args = {},
) => {
  const attrs =
    attrLines([
      [
        'id',
        args.sbId,
      ],
      [
        'dashed',
        args.dashed,
      ],
      [
        'plain',
        args.plain,
      ],
      [
        'orientation',
        args.orientation,
      ],
      [
        'remove-orientation-margin',
        args.removeOrientationMargin,
      ],
      [
        'direction',
        args.direction ===
        'vertical'
          ? 'vertical'
          : undefined,
      ],
      [
        'styles',
        args.styles,
      ],
      [
        'aria-label',
        args.ariaLabel,
      ],
      [
        'aria-disabled',
        args.sbAriaDisabled
          ? 'true'
          : undefined,
      ],
    ]);

  const slotText =
    args.slotText
      ? `\n  ${args.slotText}\n`
      : '\n';

  return normalize(`
<divider-component${attrs ? `\n  ${attrs}` : ''}>
${slotText}</divider-component>
`);
};


export const buildDocsHtml = (
  args = {},
) => {
  const dividerHtml =
    buildDividerHtml(args);

  if (
    args.direction ===
    'vertical'
  ) {
    return normalize(`
<div style="display:flex; align-items:center; gap:12px; height:48px;">
  <div>Left</div>
  ${dividerHtml.replace(
    /\n/g,
    '\n  ',
  )}
  <div>Right</div>
</div>
`);
  }

  return normalize(`
<div>
  <p>${LOREM}</p>
  ${dividerHtml.replace(
    /\n/g,
    '\n  ',
  )}
  <p>${LOREM}</p>
</div>
`);
};


export const buildDocsHtmlMany =
  snippets =>
    normalize(`
<div style="display:grid; gap:14px;">
${snippets
  .map(
    snippet =>
      `  ${String(
        snippet,
      ).replace(
        /\n/g,
        '\n  ',
      )}`,
  )
  .join('\n')}
</div>
`);


export const buildDivider = (
  args = {},
) => {
  const el =
    document.createElement(
      'divider-component',
    );

  if (
    args.direction ===
    'vertical'
  ) {
    el.direction =
      'vertical';
  } else {
    delete el.direction;
  }

  el.dashed =
    Boolean(
      args.dashed,
    );

  el.plain =
    Boolean(
      args.plain,
    );

  if (
    args.orientation ===
    undefined
  ) {
    delete el.orientation;
  } else {
    el.orientation =
      args.orientation;
  }

  if (
    args.removeOrientationMargin ===
    undefined
  ) {
    delete el.removeOrientationMargin;
  } else {
    el.removeOrientationMargin =
      args.removeOrientationMargin;
  }

  if (
    args.styles &&
    String(
      args.styles,
    ).trim().length
  ) {
    el.styles =
      args.styles;
  } else {
    el.removeAttribute(
      'styles',
    );
  }

  if (
    args.ariaLabel &&
    String(
      args.ariaLabel,
    ).trim().length
  ) {
    el.ariaLabel =
      String(
        args.ariaLabel,
      ).trim();
  } else {
    el.ariaLabel =
      undefined;
  }

  setAttr(
    el,
    'direction',
    args.direction ===
    'vertical'
      ? 'vertical'
      : undefined,
  );

  setAttr(
    el,
    'dashed',
    Boolean(
      args.dashed,
    ),
  );

  setAttr(
    el,
    'plain',
    Boolean(
      args.plain,
    ),
  );

  setAttr(
    el,
    'orientation',
    args.orientation,
  );

  setAttr(
    el,
    'remove-orientation-margin',
    args.removeOrientationMargin,
  );

  setAttr(
    el,
    'styles',
    args.styles,
  );

  setAttr(
    el,
    'aria-label',
    args.ariaLabel &&
      String(
        args.ariaLabel,
      ).trim().length
      ? String(
          args.ariaLabel,
        ).trim()
      : '',
  );

  setAttr(
    el,
    'id',
    args.sbId,
  );

  setAttr(
    el,
    'aria-disabled',
    args.sbAriaDisabled
      ? 'true'
      : undefined,
  );

  el.textContent =
    args.slotText ||
    '';

  return el;
};


export const renderDivider =
  args =>
    buildDivider(args);


export const makeParagraph = (
  text = LOREM,
) => {
  const p =
    document.createElement(
      'p',
    );

  p.textContent =
    text;

  return p;
};


/* ============================================================
   Accessibility Matrix helpers
   ============================================================ */

export const pickDividerA11yAttrs =
  el => {
    const out = {};

    if (!el) {
      return out;
    }

    const names = [
      'id',
      'role',
      'aria-orientation',
      'aria-label',
      'aria-labelledby',
      'aria-describedby',
      'aria-disabled',
      'hidden',
    ];

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
  };


const waitForDividerReady =
  async host => {
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
        'divider-component',
      );
    }

    await new Promise(
      resolve => {
        requestAnimationFrame(
          () => {
            requestAnimationFrame(
              resolve,
            );
          },
        );
      },
    );
  };


const findRenderedDivider =
  host => {
    if (!host) {
      return null;
    }

    return (
      host.querySelector(
        '.divider',
      ) ||
      host.querySelector(
        '[role="separator"]',
      ) ||
      null
    );
  };


export const snapshotDividerA11y =
  host => {
    if (!host) {
      return {
        error:
          'divider-component not found',
      };
    }

    const dividerEl =
      findRenderedDivider(
        host,
      );

    const hostRole =
      host.getAttribute(
        'role',
      ) || '';

    const renderedRole =
      dividerEl?.getAttribute(
        'role',
      ) || '';

    const hostOrientation =
      host.getAttribute(
        'aria-orientation',
      ) || '';

    const renderedOrientation =
      dividerEl?.getAttribute(
        'aria-orientation',
      ) || '';

    const hostLabel =
      host.getAttribute(
        'aria-label',
      ) || '';

    const renderedLabel =
      dividerEl?.getAttribute(
        'aria-label',
      ) || '';

    return {
      host: {
        tag:
          host.tagName.toLowerCase(),

        className:
          host.className ||
          '',

        text:
          (
            host.textContent ||
            ''
          ).trim(),

        attrs:
          pickDividerA11yAttrs(
            host,
          ),

        props: {
          direction:
            host.direction ??
            '',

          orientation:
            host.orientation ??
            '',

          dashed:
            Boolean(
              host.dashed,
            ),

          plain:
            Boolean(
              host.plain,
            ),

          ariaLabel:
            host.ariaLabel ??
            '',
        },
      },

      renderedDivider:
        dividerEl
          ? {
              tag:
                dividerEl.tagName.toLowerCase(),

              className:
                dividerEl.className ||
                '',

              text:
                (
                  dividerEl.textContent ||
                  ''
                ).trim(),

              attrs:
                pickDividerA11yAttrs(
                  dividerEl,
                ),
            }
          : null,

      summary: {
        renderedDividerFound:
          Boolean(
            dividerEl,
          ),

        role:
          renderedRole ||
          hostRole,

        ariaOrientation:
          renderedOrientation ||
          hostOrientation,

        accessibleName:
          renderedLabel ||
          hostLabel,

        direction:
          host.direction ||
          host.getAttribute(
            'direction',
          ) ||
          'horizontal',
      },
    };
  };


export const renderDividerMatrixRow =
  ({
    title,
    build,
    idSuffix,
  }) => {
    const wrapper =
      document.createElement(
        'div',
      );

    wrapper.className =
      'divider-accessibility-matrix__card';

    const heading =
      document.createElement(
        'div',
      );

    heading.className =
      'divider-accessibility-matrix__card-title';

    heading.textContent =
      title;

    const stage =
      document.createElement(
        'div',
      );

    stage.className =
      'divider-accessibility-matrix__stage';

    const status =
      document.createElement(
        'div',
      );

    status.className =
      'divider-accessibility-matrix__status';

    status.textContent =
      'Inspecting rendered accessibility attributes…';

    const output =
      document.createElement(
        'pre',
      );

    output.className =
      'divider-accessibility-matrix__output';

    output.textContent =
      'Loading computed attributes…';

    const content =
      build(idSuffix);

    stage.appendChild(
      content,
    );

    wrapper.appendChild(
      heading,
    );

    wrapper.appendChild(
      stage,
    );

    wrapper.appendChild(
      status,
    );

    wrapper.appendChild(
      output,
    );

    const update =
      async () => {
        try {
          const host =
            stage.querySelector(
              'divider-component',
            );

          if (!host) {
            status.textContent =
              'Divider component missing.';

            output.textContent =
              JSON.stringify(
                {
                  error:
                    'divider-component not found',
                },
                null,
                2,
              );

            return;
          }

          await waitForDividerReady(
            host,
          );

          const snapshot =
            snapshotDividerA11y(
              host,
            );

          output.textContent =
            JSON.stringify(
              snapshot,
              null,
              2,
            );

          status.textContent =
            [
              `Rendered divider: ${
                snapshot.summary
                  .renderedDividerFound
                  ? 'found'
                  : 'missing'
              }`,

              `Role: ${
                snapshot.summary
                  .role ||
                '(none)'
              }`,

              `Orientation: ${
                snapshot.summary
                  .ariaOrientation ||
                '(none)'
              }`,
            ].join(
              ' · ',
            );
        } catch (
          error
        ) {
          status.textContent =
            'Accessibility snapshot failed.';

          output.textContent =
            String(
              error?.stack ||
                error,
            );
        }
      };

    void update();

    return wrapper;
  };
