// src/stories/svg-component.examples.js
export const reactExample = `import React from 'react';

export default function SvgComponentExample() {
  return (
    <svg-component
      width="32"
      height="32"
      fill="currentColor"
      view-box="0 0 640 640"
      svg-aria-hidden="false"
      svg-aria-label="Home icon"
      path={'<path d="M341.8 72.6C329.5 61.2 310.5 61.2 298.3 72.6L74.3 280.6C64.7 289.6 61.5 303.5 66.3 315.7C71.1 327.9 82.8 336 96 336L112 336L112 512C112 547.3 140.7 576 176 576L464 576C499.3 576 528 547.3 528 512L528 336L544 336C557.2 336 569 327.9 573.8 315.7C578.6 303.5 575.4 289.5 565.8 280.6L341.8 72.6zM304 384L336 384C362.5 384 384 405.5 384 432L384 528L256 528L256 432C256 405.5 277.5 384 304 384z" />'}
    ></svg-component>
  );
}
`;

export const reactInlineExample = `import React from 'react';

export default function SvgComponentInlineExample() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span>Inline text</span>
      <svg-component
        width="20"
        height="20"
        fill="currentColor"
        svg-margin="both"
        svg-aria-hidden="true"
        path={'<path d="M341.8 72.6C329.5 61.2 310.5 61.2 298.3 72.6L74.3 280.6C64.7 289.6 61.5 303.5 66.3 315.7C71.1 327.9 82.8 336 96 336L112 336L112 512C112 547.3 140.7 576 176 576L464 576C499.3 576 528 547.3 528 512L528 336L544 336C557.2 336 569 327.9 573.8 315.7C578.6 303.5 575.4 289.5 565.8 280.6L341.8 72.6zM304 384L336 384C362.5 384 384 405.5 384 432L384 528L256 528L256 432C256 405.5 277.5 384 304 384z" />'}
      ></svg-component>
      <span>Inline text</span>
    </div>
  );
}
`;

export const vueExample = `<template>
  <svg-component
    width="32"
    height="32"
    fill="currentColor"
    view-box="0 0 640 640"
    svg-aria-hidden="false"
    svg-aria-label="Home icon"
    :path="iconPath"
  ></svg-component>
</template>

<script setup>
const iconPath =
  '<path d="M341.8 72.6C329.5 61.2 310.5 61.2 298.3 72.6L74.3 280.6C64.7 289.6 61.5 303.5 66.3 315.7C71.1 327.9 82.8 336 96 336L112 336L112 512C112 547.3 140.7 576 176 576L464 576C499.3 576 528 547.3 528 512L528 336L544 336C557.2 336 569 327.9 573.8 315.7C578.6 303.5 575.4 289.5 565.8 280.6L341.8 72.6zM304 384L336 384C362.5 384 384 405.5 384 432L384 528L256 528L256 432C256 405.5 277.5 384 304 384z" />';
</script>
`;

export const vueInlineExample = `<template>
  <div style="display:flex;align-items:center;gap:4px;">
    <span>Inline text</span>
    <svg-component
      width="20"
      height="20"
      fill="currentColor"
      svg-margin="both"
      svg-aria-hidden="true"
      :path="iconPath"
    ></svg-component>
    <span>Inline text</span>
  </div>
</template>

<script setup>
const iconPath =
  '<path d="M341.8 72.6C329.5 61.2 310.5 61.2 298.3 72.6L74.3 280.6C64.7 289.6 61.5 303.5 66.3 315.7C71.1 327.9 82.8 336 96 336L112 336L112 512C112 547.3 140.7 576 176 576L464 576C499.3 576 528 547.3 528 512L528 336L544 336C557.2 336 569 327.9 573.8 315.7C578.6 303.5 575.4 289.5 565.8 280.6L341.8 72.6zM304 384L336 384C362.5 384 384 405.5 384 432L384 528L256 528L256 432C256 405.5 277.5 384 304 384z" />';
</script>
`;

export const angularExample = `import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-svg-component',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <svg-component
      width="32"
      height="32"
      fill="currentColor"
      view-box="0 0 640 640"
      svg-aria-hidden="false"
      svg-aria-label="Home icon"
      [path]="iconPath"
    ></svg-component>
  \`,
})
export class SvgComponent {
  iconPath =
    '<path d="M341.8 72.6C329.5 61.2 310.5 61.2 298.3 72.6L74.3 280.6C64.7 289.6 61.5 303.5 66.3 315.7C71.1 327.9 82.8 336 96 336L112 336L112 512C112 547.3 140.7 576 176 576L464 576C499.3 576 528 547.3 528 512L528 336L544 336C557.2 336 569 327.9 573.8 315.7C578.6 303.5 575.4 289.5 565.8 280.6L341.8 72.6zM304 384L336 384C362.5 384 384 405.5 384 432L384 528L256 528L256 432C256 405.5 277.5 384 304 384z" />';
}

`;

export const angularInlineExample = `import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-svg-inline-text',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <div style="display:flex;align-items:center;gap:4px;">
      <span>Inline text</span>
      <svg-component
        width="20"
        height="20"
        fill="currentColor"
        svg-margin="both"
        svg-aria-hidden="true"
        [path]="iconPath"
      ></svg-component>
      <span>Inline text</span>
    </div>
  \`,
})
export class SvgInlineTextComponent {
  iconPath =
    '<path d="M341.8 72.6C329.5 61.2 310.5 61.2 298.3 72.6L74.3 280.6C64.7 289.6 61.5 303.5 66.3 315.7C71.1 327.9 82.8 336 96 336L112 336L112 512C112 547.3 140.7 576 176 576L464 576C499.3 576 528 547.3 528 512L528 336L544 336C557.2 336 569 327.9 573.8 315.7C578.6 303.5 575.4 289.5 565.8 280.6L341.8 72.6zM304 384L336 384C362.5 384 384 405.5 384 432L384 528L256 528L256 432C256 405.5 277.5 384 304 384z" />';
}

`;

export const svelteExample = `<script>
  const iconPath =
    '<path d="M341.8 72.6C329.5 61.2 310.5 61.2 298.3 72.6L74.3 280.6C64.7 289.6 61.5 303.5 66.3 315.7C71.1 327.9 82.8 336 96 336L112 336L112 512C112 547.3 140.7 576 176 576L464 576C499.3 576 528 547.3 528 512L528 336L544 336C557.2 336 569 327.9 573.8 315.7C578.6 303.5 575.4 289.5 565.8 280.6L341.8 72.6zM304 384L336 384C362.5 384 384 405.5 384 432L384 528L256 528L256 432C256 405.5 277.5 384 304 384z" />';
</script>

<svg-component
  width="32"
  height="32"
  fill="currentColor"
  view-box="0 0 640 640"
  svg-aria-hidden="false"
  svg-aria-label="Home icon"
  path={iconPath}
></svg-component>
`;

export const svelteInlineExample = `<script>
  const iconPath =
    '<path d="M341.8 72.6C329.5 61.2 310.5 61.2 298.3 72.6L74.3 280.6C64.7 289.6 61.5 303.5 66.3 315.7C71.1 327.9 82.8 336 96 336L112 336L112 512C112 547.3 140.7 576 176 576L464 576C499.3 576 528 547.3 528 512L528 336L544 336C557.2 336 569 327.9 573.8 315.7C578.6 303.5 575.4 289.5 565.8 280.6L341.8 72.6zM304 384L336 384C362.5 384 384 405.5 384 432L384 528L256 528L256 432C256 405.5 277.5 384 304 384z" />';
</script>

<div style="display:flex;align-items:center;gap:4px;">
  <span>Inline text</span>
  <svg-component
    width="20"
    height="20"
    fill="currentColor"
    svg-margin="both"
    svg-aria-hidden="true"
    path={iconPath}
  ></svg-component>
  <span>Inline text</span>
</div>
`;

export const svelteKitExample = `<script>
  import { browser } from '$app/environment';

  const iconPath =
    '<path d="M341.8 72.6C329.5 61.2 310.5 61.2 298.3 72.6L74.3 280.6C64.7 289.6 61.5 303.5 66.3 315.7C71.1 327.9 82.8 336 96 336L112 336L112 512C112 547.3 140.7 576 176 576L464 576C499.3 576 528 547.3 528 512L528 336L544 336C557.2 336 569 327.9 573.8 315.7C578.6 303.5 575.4 289.5 565.8 280.6L341.8 72.6zM304 384L336 384C362.5 384 384 405.5 384 432L384 528L256 528L256 432C256 405.5 277.5 384 304 384z" />';
</script>

{#if browser}
  <svg-component
    width="32"
    height="32"
    fill="currentColor"
    view-box="0 0 640 640"
    svg-aria-hidden="false"
    svg-aria-label="Home icon"
    path={iconPath}
  ></svg-component>
{/if}
`;

export const svelteKitInlineExample = `<script>
  import { browser } from '$app/environment';

  const iconPath =
    '<path d="M341.8 72.6C329.5 61.2 310.5 61.2 298.3 72.6L74.3 280.6C64.7 289.6 61.5 303.5 66.3 315.7C71.1 327.9 82.8 336 96 336L112 336L112 512C112 547.3 140.7 576 176 576L464 576C499.3 576 528 547.3 528 512L528 336L544 336C557.2 336 569 327.9 573.8 315.7C578.6 303.5 575.4 289.5 565.8 280.6L341.8 72.6zM304 384L336 384C362.5 384 384 405.5 384 432L384 528L256 528L256 432C256 405.5 277.5 384 304 384z" />';
</script>

{#if browser}
  <div style="display:flex;align-items:center;gap:4px;">
    <span>Inline text</span>
    <svg-component
      width="20"
      height="20"
      fill="currentColor"
      svg-margin="both"
      svg-aria-hidden="true"
      path={iconPath}
    ></svg-component>
    <span>Inline text</span>
  </div>
{/if}
`;
