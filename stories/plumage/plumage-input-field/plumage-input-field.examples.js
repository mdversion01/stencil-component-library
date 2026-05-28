export const reactExample = `
import { useEffect, useRef } from 'react';

export default function PlumageInputField() {
  const inputRef = useRef(null);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;

    const handleValueChange = (event) => {
      console.log('valueChange:', event.detail);
    };

    el.addEventListener('valueChange', handleValueChange);

    return () => {
      el.removeEventListener('valueChange', handleValueChange);
    };
  }, []);

  return (
    <plumage-input-field-component
      ref={inputRef}
      label="First Name"
      input-id="react-first-name"
      placeholder="Enter your first name"
      value="Taylor"
    />
  );
}
`.trim();

export const vueExample = `
<template>
  <plumage-input-field-component
    ref="inputRef"
    label="First Name"
    input-id="vue-first-name"
    placeholder="Enter your first name"
    value="Taylor"
  />
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

const inputRef = ref(null);

const handleValueChange = (event) => {
  console.log('valueChange:', event.detail);
};

onMounted(() => {
  inputRef.value?.addEventListener('valueChange', handleValueChange);
});

onBeforeUnmount(() => {
  inputRef.value?.removeEventListener('valueChange', handleValueChange);
});
</script>
`.trim();

export const angularExample = `import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnDestroy, ViewChild } from '@angular/core';

@Component({
  selector: 'app-plumage-input-field',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <plumage-input-field-component
      #inputField
      label="First Name"
      input-id="angular-first-name"
      placeholder="Enter your first name"
      value="Taylor"
    ></plumage-input-field-component>
  \`,
})
export class PlumageInputFieldComponent implements AfterViewInit, OnDestroy {
  @ViewChild('inputField', { static: true }) inputFieldRef!: ElementRef;

  private readonly handleValueChange = (event: Event) => {
    const customEvent = event as CustomEvent<string>;
    console.log('valueChange:', customEvent.detail);
  };

  ngAfterViewInit(): void {
    this.inputFieldRef.nativeElement.addEventListener('valueChange', this.handleValueChange);
  }

  ngOnDestroy(): void {
    this.inputFieldRef.nativeElement.removeEventListener('valueChange', this.handleValueChange);
  }
}
`.trim();

export const svelteExample = `
<script>
  import { onMount } from 'svelte';

  let inputRef = null;

  function handleValueChange(event) {
    console.log('valueChange:', event.detail);
  }

  onMount(() => {
    const el = inputRef;
    if (!el) return;

    el.addEventListener('valueChange', handleValueChange);

    return () => {
      el.removeEventListener('valueChange', handleValueChange);
    };
  });
</script>

<plumage-input-field-component
  bind:this={inputRef}
  label="First Name"
  input-id="svelte-first-name"
  placeholder="Enter your first name"
  value="Taylor"
></plumage-input-field-component>
`.trim();

export const svelteKitExample = `
<script>
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';

  let inputRef = null;

  function handleValueChange(event) {
    console.log('valueChange:', event.detail);
  }

  onMount(() => {
    if (!browser) return;

    const el = inputRef;
    if (!el) return;

    el.addEventListener('valueChange', handleValueChange);

    return () => {
      el.removeEventListener('valueChange', handleValueChange);
    };
  });
</script>

{#if browser}
  <plumage-input-field-component
    bind:this={inputRef}
    label="First Name"
    input-id="sveltekit-first-name"
    placeholder="Enter your first name"
    value="Taylor"
  ></plumage-input-field-component>
{/if}
`.trim();

