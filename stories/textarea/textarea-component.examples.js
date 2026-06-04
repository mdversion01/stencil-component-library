import { normalize } from './textarea-component.story-helpers';

export const htmlExample = normalize(`
<textarea-component
  label="Message"
  placeholder="Enter your message"
  rows="4"
  max-length="250"
  required
  validation
  validation-message="Please enter at least 3 characters."
></textarea-component>
`);

export const reactExample = normalize(`
import { useEffect, useRef } from 'react';

export default function TextareaExample() {
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    const onValueChange = (event) => {
      console.log('valueChange:', event.detail);
    };

    const onBlurChange = (event) => {
      console.log('blurChange:', event.detail);
    };

    el.addEventListener('valueChange', onValueChange);
    el.addEventListener('blurChange', onBlurChange);

    return () => {
      el.removeEventListener('valueChange', onValueChange);
      el.removeEventListener('blurChange', onBlurChange);
    };
  }, []);

  return (
    <textarea-component
      ref={textareaRef}
      label="Message"
      placeholder="Enter your message"
      rows={4}
      max-length={250}
      required
      validation
      validation-message="Please enter at least 3 characters."
    />
  );
}
`);

export const vueExample = normalize(`
<template>
  <textarea-component
    ref="textareaEl"
    label="Message"
    placeholder="Enter your message"
    :rows="4"
    :max-length="250"
    required
    validation
    validation-message="Please enter at least 3 characters."
  />
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';

const textareaEl = ref(null);

const onValueChange = (event) => {
  console.log('valueChange:', event.detail);
};

const onBlurChange = (event) => {
  console.log('blurChange:', event.detail);
};

onMounted(() => {
  textareaEl.value?.addEventListener('valueChange', onValueChange);
  textareaEl.value?.addEventListener('blurChange', onBlurChange);
});

onBeforeUnmount(() => {
  textareaEl.value?.removeEventListener('valueChange', onValueChange);
  textareaEl.value?.removeEventListener('blurChange', onBlurChange);
});
</script>
`);

export const angularExample = normalize(`
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-textarea-example',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <textarea-component
      label="Message"
      placeholder="Enter your message"
      rows="4"
      max-length="250"
      required
      validation
      validation-message="Please enter at least 3 characters."
      (valueChange)="onValueChange($event)"
      (blurChange)="onBlurChange($event)"
    ></textarea-component>
  \`,
})
export class TextareaExampleComponent {
  onValueChange(event: CustomEvent<string>) {
    console.log('valueChange:', event.detail);
  }

  onBlurChange(event: CustomEvent<string>) {
    console.log('blurChange:', event.detail);
  }
}
`);

export const svelteExample = normalize(`
<script>
  let textareaEl;

  function handleValueChange(event) {
    console.log('valueChange:', event.detail);
  }

  function handleBlurChange(event) {
    console.log('blurChange:', event.detail);
  }
</script>

<textarea-component
  bind:this={textareaEl}
  label="Message"
  placeholder="Enter your message"
  rows="4"
  max-length="250"
  required
  validation
  validation-message="Please enter at least 3 characters."
  on:valueChange={handleValueChange}
  on:blurChange={handleBlurChange}
/>
`);

export const svelteKitExample = normalize(`
<script>
  import { onMount } from 'svelte';

  let mounted = false;

  onMount(() => {
    mounted = true;
  });

  function handleValueChange(event) {
    console.log('valueChange:', event.detail);
  }

  function handleBlurChange(event) {
    console.log('blurChange:', event.detail);
  }
</script>

{#if mounted}
  <textarea-component
    label="Message"
    placeholder="Enter your message"
    rows="4"
    max-length="250"
    required
    validation
    validation-message="Please enter at least 3 characters."
    on:valueChange={handleValueChange}
    on:blurChange={handleBlurChange}
  />
{/if}
`);
