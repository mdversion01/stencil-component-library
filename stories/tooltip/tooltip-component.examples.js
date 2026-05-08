export const reactExample = `import React from 'react';

export default function TooltipExample() {
  return (
    <div style={{ display: 'inline-block' }}>
      <tooltip-component
        position="top"
        trigger="hover focus"
        tooltip-title="Hello from React"
        variant="primary"
      >
        <button-component
          btn-text="Hover me"
          size="sm"
          variant="secondary"
        ></button-component>
      </tooltip-component>
    </div>
  );
}
`;

export const vueExample = `<template>
  <div style="display:inline-block">
    <tooltip-component
      position="top"
      trigger="hover focus"
      tooltip-title="Hello from Vue"
      variant="primary"
    >
      <button-component
        btn-text="Hover me"
        size="sm"
        variant="secondary"
      ></button-component>
    </tooltip-component>
  </div>
</template>

<script setup>
</script>
`;

export const angularExample = `import { Component } from '@angular/core';

@Component({
  selector: 'app-tooltip-example',
  template: \`
    <div style="display:inline-block">
      <tooltip-component
        position="top"
        trigger="hover focus"
        tooltip-title="Hello from Angular"
        variant="primary"
      >
        <button-component
          btn-text="Hover me"
          size="sm"
          variant="secondary"
        ></button-component>
      </tooltip-component>
    </div>
  \`,
})
export class TooltipExampleComponent {}
`;

export const svelteExample = `<script>
</script>

<div style="display:inline-block">
  <tooltip-component
    position="top"
    trigger="hover focus"
    tooltip-title="Hello from Svelte"
    variant="primary"
  >
    <button-component
      btn-text="Hover me"
      size="sm"
      variant="secondary"
    ></button-component>
  </tooltip-component>
</div>
`;

export const reactManualExample = `import React, { useRef, useState } from 'react';

export default function TooltipManualExample() {
  const tooltipRef = useRef(null);
  const [open, setOpen] = useState(false);

  const showTooltip = async () => {
    await tooltipRef.current?.show?.();
    setOpen(true);
  };

  const hideTooltip = async () => {
    await tooltipRef.current?.hide?.();
    setOpen(false);
  };

  const toggleTooltip = async () => {
    if (open) {
      await hideTooltip();
    } else {
      await showTooltip();
    }
  };

  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
      <tooltip-component
        ref={tooltipRef}
        trigger="manual click"
        position="bottom"
        tooltip-title="Manually controlled tooltip"
      >
        <button-component
          btn-text="Target"
          size="sm"
          variant="secondary"
        ></button-component>
      </tooltip-component>

      <button-component btn-text="Show" size="sm" variant="primary" onClick={showTooltip}></button-component>
      <button-component btn-text="Hide" size="sm" variant="danger" onClick={hideTooltip}></button-component>
      <button-component btn-text="Toggle" size="sm" variant="info" onClick={toggleTooltip}></button-component>
    </div>
  );
}
`;

export const vueManualExample = `<template>
  <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap">
    <tooltip-component
      ref="tooltipRef"
      trigger="manual click"
      position="bottom"
      tooltip-title="Manually controlled tooltip"
    >
      <button-component
        btn-text="Target"
        size="sm"
        variant="secondary"
      ></button-component>
    </tooltip-component>

    <button-component btn-text="Show" size="sm" variant="primary" @click="showTooltip"></button-component>
    <button-component btn-text="Hide" size="sm" variant="danger" @click="hideTooltip"></button-component>
    <button-component btn-text="Toggle" size="sm" variant="info" @click="toggleTooltip"></button-component>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const tooltipRef = ref(null);
const isOpen = ref(false);

const showTooltip = async () => {
  await tooltipRef.value?.show?.();
  isOpen.value = true;
};

const hideTooltip = async () => {
  await tooltipRef.value?.hide?.();
  isOpen.value = false;
};

const toggleTooltip = async () => {
  if (isOpen.value) {
    await hideTooltip();
  } else {
    await showTooltip();
  }
};
</script>
`;

export const angularManualExample = `import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-tooltip-manual-example',
  template: \`
    <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap">
      <tooltip-component
        #tooltipRef
        trigger="manual click"
        position="bottom"
        tooltip-title="Manually controlled tooltip"
      >
        <button-component
          btn-text="Target"
          size="sm"
          variant="secondary"
        ></button-component>
      </tooltip-component>

      <button-component btn-text="Show" size="sm" variant="primary" (click)="showTooltip()"></button-component>
      <button-component btn-text="Hide" size="sm" variant="danger" (click)="hideTooltip()"></button-component>
      <button-component btn-text="Toggle" size="sm" variant="info" (click)="toggleTooltip()"></button-component>
    </div>
  \`,
})
export class TooltipManualExampleComponent {
  @ViewChild('tooltipRef', { static: true }) tooltipRef!: ElementRef;
  isOpen = false;

  async showTooltip(): Promise<void> {
    await this.tooltipRef?.nativeElement?.show?.();
    this.isOpen = true;
  }

  async hideTooltip(): Promise<void> {
    await this.tooltipRef?.nativeElement?.hide?.();
    this.isOpen = false;
  }

  async toggleTooltip(): Promise<void> {
    if (this.isOpen) {
      await this.hideTooltip();
    } else {
      await this.showTooltip();
    }
  }
}
`;

export const svelteManualExample = `<script>
  let tooltipRef;
  let isOpen = false;

  const showTooltip = async () => {
    await tooltipRef?.show?.();
    isOpen = true;
  };

  const hideTooltip = async () => {
    await tooltipRef?.hide?.();
    isOpen = false;
  };

  const toggleTooltip = async () => {
    if (isOpen) {
      await hideTooltip();
    } else {
      await showTooltip();
    }
  };
</script>

<div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap">
  <tooltip-component
    bind:this={tooltipRef}
    trigger="manual click"
    position="bottom"
    tooltip-title="Manually controlled tooltip"
  >
    <button-component
      btn-text="Target"
      size="sm"
      variant="secondary"
    ></button-component>
  </tooltip-component>

  <button-component btn-text="Show" size="sm" variant="primary" on:click={showTooltip}></button-component>
  <button-component btn-text="Hide" size="sm" variant="danger" on:click={hideTooltip}></button-component>
  <button-component btn-text="Toggle" size="sm" variant="info" on:click={toggleTooltip}></button-component>
</div>
`;
