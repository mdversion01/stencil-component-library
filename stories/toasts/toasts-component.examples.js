export const reactExample = `import React, { useEffect, useRef } from 'react';

export default function ToastsComponentExample() {
  const toastRef = useRef(null);

  useEffect(() => {
    const setup = async () => {
      await customElements.whenDefined('toasts-component');
      const host = toastRef.current;
      if (!host) return;

      if (typeof host.componentOnReady === 'function') {
        await host.componentOnReady();
      }
    };

    setup();
  }, []);

  const showDefaultToast = async () => {
    const host = toastRef.current;
    if (!host) return;

    await host.showToast({
      toastTitle: 'Saved',
      content: 'Your changes were saved successfully.',
      variantClass: 'success',
      svgIcon: 'check-circle-fill',
      additionalHdrContent: 'Just now',
      persistent: true,
    });
  };

  const showWarningToast = async () => {
    const host = toastRef.current;
    if (!host) return;

    await host.showToast({
      toastTitle: 'Warning',
      content: 'Please review the highlighted fields.',
      variantClass: 'warning',
      svgIcon: 'exclamation-triangle-fill',
      persistent: true,
    });
  };

  return (
    <section>
      <h2>Toasts Component Example</h2>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <button type="button" onClick={showDefaultToast}>
          Show Success Toast
        </button>

        <button type="button" onClick={showWarningToast}>
          Show Warning Toast
        </button>
      </div>

      <toasts-component
        ref={toastRef}
        aria-label="Notifications"
        position="top-right"
        append-toast
        persistent
      ></toasts-component>
    </section>
  );
}
`;

export const vueExample = `<template>
  <section>
    <h2>Toasts Component Example</h2>

    <div style="display:flex; gap:12px; margin-bottom:16px;">
      <button type="button" @click="showDefaultToast">Show Success Toast</button>
      <button type="button" @click="showWarningToast">Show Warning Toast</button>
    </div>

    <toasts-component
      ref="toastRef"
      aria-label="Notifications"
      position="top-right"
      append-toast
      persistent
    ></toasts-component>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const toastRef = ref(null);

onMounted(async () => {
  await customElements.whenDefined('toasts-component');

  if (toastRef.value?.componentOnReady) {
    await toastRef.value.componentOnReady();
  }
});

async function showDefaultToast() {
  const host = toastRef.value;
  if (!host) return;

  await host.showToast({
    toastTitle: 'Saved',
    content: 'Your changes were saved successfully.',
    variantClass: 'success',
    svgIcon: 'check-circle-fill',
    additionalHdrContent: 'Just now',
    persistent: true,
  });
}

async function showWarningToast() {
  const host = toastRef.value;
  if (!host) return;

  await host.showToast({
    toastTitle: 'Warning',
    content: 'Please review the highlighted fields.',
    variantClass: 'warning',
    svgIcon: 'exclamation-triangle-fill',
    persistent: true,
  });
}
</script>
`;

export const angularExample = `import { AfterViewInit, Component, ElementRef, ViewChild, CUSTOM_ELEMENTS_SCHEMA, } from '@angular/core';

@Component({
  selector: 'app-toasts-component',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <section>

      <div style="display:flex; gap:12px; margin-bottom:16px;">
        <button type="button" (click)="showDefaultToast()">Show Success Toast</button>
        <button type="button" (click)="showWarningToast()">Show Warning Toast</button>
      </div>

      <toasts-component
        #toastRef
        aria-label="Notifications"
        position="top-right"
        append-toast
        persistent
      ></toasts-component>
    </section>
  \`,
})
export class ToastsComponent implements AfterViewInit {
  @ViewChild('toastRef', { static: true }) toastRef!: ElementRef;

  async ngAfterViewInit(): Promise<void> {
    await customElements.whenDefined('toasts-component');

    const host = this.toastRef?.nativeElement;
    if (host?.componentOnReady) {
      await host.componentOnReady();
    }
  }

  async showDefaultToast(): Promise<void> {
    const host = this.toastRef?.nativeElement;
    if (!host) return;

    await host.showToast({
      toastTitle: 'Saved',
      content: 'Your changes were saved successfully.',
      variantClass: 'success',
      svgIcon: 'check-circle-fill',
      additionalHdrContent: 'Just now',
      persistent: true,
    });
  }

  async showWarningToast(): Promise<void> {
    const host = this.toastRef?.nativeElement;
    if (!host) return;

    await host.showToast({
      toastTitle: 'Warning',
      content: 'Please review the highlighted fields.',
      variantClass: 'warning',
      svgIcon: 'exclamation-triangle-fill',
      persistent: true,
    });
  }
}
`;

export const svelteExample = `<script>
  import { onMount } from 'svelte';

  let toastEl;

  onMount(async () => {
    await customElements.whenDefined('toasts-component');

    if (toastEl?.componentOnReady) {
      await toastEl.componentOnReady();
    }
  });

  async function showDefaultToast() {
    if (!toastEl) return;

    await toastEl.showToast({
      toastTitle: 'Saved',
      content: 'Your changes were saved successfully.',
      variantClass: 'success',
      svgIcon: 'check-circle-fill',
      additionalHdrContent: 'Just now',
      persistent: true,
    });
  }

  async function showWarningToast() {
    if (!toastEl) return;

    await toastEl.showToast({
      toastTitle: 'Warning',
      content: 'Please review the highlighted fields.',
      variantClass: 'warning',
      svgIcon: 'exclamation-triangle-fill',
      persistent: true,
    });
  }
</script>

<section>
  <h2>Toasts Component Example</h2>

  <div style="display:flex; gap:12px; margin-bottom:16px;">
    <button type="button" onclick={showDefaultToast}>Show Success Toast</button>
    <button type="button" onclick={showWarningToast}>Show Warning Toast</button>
  </div>

  <toasts-component
    bind:this={toastEl}
    aria-label="Notifications"
    position="top-right"
    append-toast
    persistent
  ></toasts-component>
</section>
`;

export const svelteKitExample = `<script lang="ts">
  import { onMount } from 'svelte';

  type ToastVariant =
    | ''
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'info'
    | 'warning'
    | 'dark'
    | 'light';

  type ToastHost = HTMLElement & {
    componentOnReady?: () => Promise<void>;
    showToast: (opts: {
      toastTitle?: string;
      content?: string;
      contentHtml?: string;
      variantClass?: ToastVariant;
      svgIcon?: string;
      additionalHdrContent?: string;
      persistent?: boolean;
    }) => Promise<number>;
  };

  let toastEl: ToastHost | null = null;

  onMount(async () => {
    await customElements.whenDefined('toasts-component');

    if (toastEl?.componentOnReady) {
      await toastEl.componentOnReady();
    }
  });

  async function showDefaultToast(): Promise<void> {
    if (!toastEl) return;

    await toastEl.showToast({
      toastTitle: 'Saved',
      content: 'Your changes were saved successfully.',
      variantClass: 'success',
      svgIcon: 'check-circle-fill',
      additionalHdrContent: 'Just now',
      persistent: true,
    });
  }

  async function showWarningToast(): Promise<void> {
    if (!toastEl) return;

    await toastEl.showToast({
      toastTitle: 'Warning',
      content: 'Please review the highlighted fields.',
      variantClass: 'warning',
      svgIcon: 'exclamation-triangle-fill',
      persistent: true,
    });
  }
</script>

<section>
  <h2>Toasts Component Example</h2>

  <div style="display:flex; gap:12px; margin-bottom:16px;">
    <button type="button" onclick={showDefaultToast}>Show Success Toast</button>
    <button type="button" onclick={showWarningToast}>Show Warning Toast</button>
  </div>

  <toasts-component
    bind:this={toastEl}
    aria-label="Notifications"
    position="top-right"
    append-toast
    persistent
  ></toasts-component>
</section>
`;
