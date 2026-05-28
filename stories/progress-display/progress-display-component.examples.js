export const reactExample = `import React from 'react';

import React, { useEffect } from 'react';

export default function Progress() {
  useEffect(() => {
    const progressComp = document.getElementById('progressBarComp');

    if (!progressComp) {
      return undefined;
    }

    let value = 0;

    const interval = window.setInterval(() => {
      value = value >= 100 ? 0 : value + 10;
      progressComp.setAttribute('value', String(value));
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  return (
    <>
      <progress-display-component
        value={45}
        max={100}
        variant="primary"
        show-progress
        label="Upload progress"
      >
        Loading
      </progress-display-component>

      <br />

      <progress-display-component
        id="progressBarComp"
        value={75}
        max={100}
        variant="success"
        show-progress
        label="Upload progress"
        progress-align="right"
      >
        Loading
      </progress-display-component>
    </>
  );
}
`;

export const vueExample = `<template>
  <section>
    <progress-display-component
      :value="45"
      :max="100"
      variant="primary"
      show-progress
      label="Upload progress"
    >
      Loading
    </progress-display-component>

    <br />

    <progress-display-component
      ref="animatedProgressEl"
      :value="75"
      :max="100"
      variant="success"
      show-progress
      label="Upload progress"
      progress-align="right"
    >
      Loading
    </progress-display-component>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

type ProgressDisplayElement = HTMLElement & {
  value?: number | string
}

const animatedProgressEl = ref<ProgressDisplayElement | null>(null)

let intervalId: number | undefined
let value = 75

onMounted(() => {
  intervalId = window.setInterval(() => {
    const el = animatedProgressEl.value
    if (!el) return

    value = value >= 100 ? 0 : value + 10
    el.setAttribute('value', String(value))
  }, 1000)
})

onBeforeUnmount(() => {
  if (intervalId !== undefined) {
    window.clearInterval(intervalId)
  }
})
</script>
`;

export const angularExample = `import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';

type ProgressDisplayElement = HTMLElement & {
  value?: number;
  max?: number;
};

@Component({
  selector: 'app-progress',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <progress-display-component
      #staticProgressEl
      variant="primary"
      show-progress
      label="Upload progress"
    >
      Loading
    </progress-display-component>

    <br />

    <progress-display-component
      #animatedProgressEl
      variant="success"
      show-progress
      label="Upload progress"
      progress-align="right"
    >
      Loading
    </progress-display-component>
  \`,
})
export class ProgressComponent implements AfterViewInit, OnDestroy {
  @ViewChild('staticProgressEl', { static: true })
  private staticProgressEl!: ElementRef<ProgressDisplayElement>;

  @ViewChild('animatedProgressEl', { static: true })
  private animatedProgressEl!: ElementRef<ProgressDisplayElement>;

  private intervalId?: number;
  private value = 75;

  ngAfterViewInit(): void {
    const staticEl = this.staticProgressEl.nativeElement;
    staticEl.value = 45;
    staticEl.max = 100;

    const animatedEl = this.animatedProgressEl.nativeElement;
    animatedEl.value = this.value;
    animatedEl.max = 100;

    this.intervalId = window.setInterval(() => {
      this.value = this.value >= 100 ? 0 : this.value + 10;
      animatedEl.value = this.value;
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId !== undefined) {
      window.clearInterval(this.intervalId);
    }
  }
}
`;

export const svelteExample = `<script>
  import { onMount } from 'svelte';

  let animatedProgressEl = null;

  onMount(() => {
    let value = 75;

    const interval = window.setInterval(() => {
      if (!animatedProgressEl) return;
      value = value >= 100 ? 0 : value + 10;
      animatedProgressEl.setAttribute('value', String(value));
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  });
</script>

<section>
  <progress-display-component
    value="45"
    max="100"
    variant="primary"
    show-progress
    label="Upload progress"
  >
    Loading
  </progress-display-component>

  <br />

  <progress-display-component
    bind:this={animatedProgressEl}
    value="75"
    max="100"
    variant="success"
    show-progress
    label="Upload progress"
    progress-align="right"
  >
    Loading
  </progress-display-component>
</section>
`;

export const svelteKitExample = `<script>
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';

  let animatedProgressEl = null;

  onMount(() => {
    if (!browser) return;

    let value = 75;

    const interval = window.setInterval(() => {
      if (!animatedProgressEl) return;
      value = value >= 100 ? 0 : value + 10;
      animatedProgressEl.setAttribute('value', String(value));
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  });
</script>

<section>
  {#if browser}
    <progress-display-component
      value="45"
      max="100"
      variant="primary"
      show-progress
      label="Upload progress"
    >
      Loading
    </progress-display-component>

    <br />

    <progress-display-component
      bind:this={animatedProgressEl}
      value="75"
      max="100"
      variant="success"
      show-progress
      label="Upload progress"
      progress-align="right"
    >
      Loading
    </progress-display-component>
  {/if}
</section>
`;
