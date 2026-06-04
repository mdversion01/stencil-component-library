// File: src/stories/plumage-textarea-component.examples.js

export const reactExample = `
import { useEffect, useRef, useState } from 'react';

export default function PlumageTextareaComponentExample() {
  const textareaRef = useRef(null);
  const [lastBlurValue, setLastBlurValue] = useState('');

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    const onValueChange = event => {
      console.log('valueChange:', event.detail);
    };

    const onBlurChange = event => {
      console.log('blurChange:', event.detail);
      setLastBlurValue(event.detail || '');
    };

    el.addEventListener('valueChange', onValueChange);
    el.addEventListener('blurChange', onBlurChange);

    return () => {
      el.removeEventListener('valueChange', onValueChange);
      el.removeEventListener('blurChange', onBlurChange);
    };
  }, []);

  return (
    <main style={{ display: 'grid', gap: '16px' }}>
      <plumage-textarea-component
        ref={textareaRef}
        label="Message"
        input-id="react-message"
        placeholder="Enter your message"
        rows="4"
        max-length="250"
        validation-message="Please enter at least 3 characters."
      ></plumage-textarea-component>

      <div>
        <strong>Last blur value:</strong> {lastBlurValue || '—'}
      </div>
    </main>
  );
}
`.trim();

export const vueExample = `
<template>
  <main style="display:grid; gap:16px;">
    <plumage-textarea-component
      ref="textareaRef"
      label="Message"
      input-id="vue-message"
      placeholder="Enter your message"
      rows="4"
      max-length="250"
      validation-message="Please enter at least 3 characters."
    ></plumage-textarea-component>

    <div><strong>Last blur value:</strong> {{ lastBlurValue || '—' }}</div>
  </main>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

const textareaRef = ref(null);
const lastBlurValue = ref('');

const onValueChange = event => {
  console.log('valueChange:', event.detail);
};

const onBlurChange = event => {
  console.log('blurChange:', event.detail);
  lastBlurValue.value = event.detail || '';
};

onMounted(() => {
  textareaRef.value?.addEventListener('valueChange', onValueChange);
  textareaRef.value?.addEventListener('blurChange', onBlurChange);
});

onBeforeUnmount(() => {
  textareaRef.value?.removeEventListener('valueChange', onValueChange);
  textareaRef.value?.removeEventListener('blurChange', onBlurChange);
});
</script>
`.trim();

export const angularExample = `
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnDestroy, ViewChild } from '@angular/core';

@Component({
  selector: 'app-plumage-textarea-component',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <main style="display:grid; gap:16px;">
      <plumage-textarea-component
        #textareaEl
        label="Message"
        input-id="angular-message"
        placeholder="Enter your message"
        rows="4"
        max-length="250"
        validation-message="Please enter at least 3 characters."
      ></plumage-textarea-component>

      <div><strong>Last blur value:</strong> {{ lastBlurValue || '—' }}</div>
    </main>
  \`,
})
export class PlumageTextareaComponentExample implements AfterViewInit, OnDestroy {
  @ViewChild('textareaEl', { static: true }) textareaRef!: ElementRef<HTMLElement>;

  lastBlurValue = '';

  private readonly onValueChange = (event: Event) => {
    const customEvent = event as CustomEvent<string>;
    console.log('valueChange:', customEvent.detail);
  };

  private readonly onBlurChange = (event: Event) => {
    const customEvent = event as CustomEvent<string>;
    console.log('blurChange:', customEvent.detail);
    this.lastBlurValue = customEvent.detail || '';
  };

  ngAfterViewInit(): void {
    this.textareaRef.nativeElement.addEventListener('valueChange', this.onValueChange);
    this.textareaRef.nativeElement.addEventListener('blurChange', this.onBlurChange);
  }

  ngOnDestroy(): void {
    this.textareaRef.nativeElement.removeEventListener('valueChange', this.onValueChange);
    this.textareaRef.nativeElement.removeEventListener('blurChange', this.onBlurChange);
  }
}
`.trim();

export const svelteExample = `
<script>
  import { onMount } from 'svelte';

  let textareaRef = null;
  let lastBlurValue = '';

  function onValueChange(event) {
    console.log('valueChange:', event.detail);
  }

  function onBlurChange(event) {
    console.log('blurChange:', event.detail);
    lastBlurValue = event.detail || '';
  }

  onMount(() => {
    const el = textareaRef;
    if (!el) return;

    el.addEventListener('valueChange', onValueChange);
    el.addEventListener('blurChange', onBlurChange);

    return () => {
      el.removeEventListener('valueChange', onValueChange);
      el.removeEventListener('blurChange', onBlurChange);
    };
  });
</script>

<main style="display:grid; gap:16px;">
  <plumage-textarea-component
    bind:this={textareaRef}
    label="Message"
    input-id="svelte-message"
    placeholder="Enter your message"
    rows="4"
    max-length="250"
    validation-message="Please enter at least 3 characters."
  ></plumage-textarea-component>

  <div><strong>Last blur value:</strong> {lastBlurValue || '—'}</div>
</main>
`.trim();

export const svelteKitExample = `
<script>
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';

  let textareaRef = null;
  let lastBlurValue = '';

  function onValueChange(event) {
    console.log('valueChange:', event.detail);
  }

  function onBlurChange(event) {
    console.log('blurChange:', event.detail);
    lastBlurValue = event.detail || '';
  }

  onMount(() => {
    if (!browser) return;

    const el = textareaRef;
    if (!el) return;

    el.addEventListener('valueChange', onValueChange);
    el.addEventListener('blurChange', onBlurChange);

    return () => {
      el.removeEventListener('valueChange', onValueChange);
      el.removeEventListener('blurChange', onBlurChange);
    };
  });
</script>

{#if browser}
  <main style="display:grid; gap:16px;">
    <plumage-textarea-component
      bind:this={textareaRef}
      label="Message"
      input-id="sveltekit-message"
      placeholder="Enter your message"
      rows="4"
      max-length="250"
      validation-message="Please enter at least 3 characters."
    ></plumage-textarea-component>

    <div><strong>Last blur value:</strong> {lastBlurValue || '—'}</div>
  </main>
{/if}
`.trim();
