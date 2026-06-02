// File: src/stories/plumage-input-group.examples.js

export const reactExample = `
import { useEffect, useRef } from 'react';

export default function PlumageInputGroup() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onValueChange = event => {
      console.log('valueChange:', event.detail);
    };

    const onAppendClick = event => {
      console.log('appendClick:', event.detail);
    };

    el.addEventListener('valueChange', onValueChange);
    el.addEventListener('appendClick', onAppendClick);

    return () => {
      el.removeEventListener('valueChange', onValueChange);
      el.removeEventListener('appendClick', onAppendClick);
    };
  }, []);

  return (
    <plumage-input-group-component
      ref={ref}
      label="Search"
      input-id="react-search"
      has-append
      append-button
      append-text="Go"
      append-button-variant="secondary"
      append-button-id="react-search-append-btn"
    />
  );
}
`.trim();

export const vueExample = `
<template>
  <plumage-input-group-component
    ref="inputGroupRef"
    label="Search"
    input-id="vue-search"
    has-append
    append-button
    append-text="Go"
    append-button-variant="secondary"
    append-button-id="vue-search-append-btn"
  />
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

const inputGroupRef = ref(null);

const onValueChange = event => {
  console.log('valueChange:', event.detail);
};

const onAppendClick = event => {
  console.log('appendClick:', event.detail);
};

onMounted(() => {
  inputGroupRef.value?.addEventListener('valueChange', onValueChange);
  inputGroupRef.value?.addEventListener('appendClick', onAppendClick);
});

onBeforeUnmount(() => {
  inputGroupRef.value?.removeEventListener('valueChange', onValueChange);
  inputGroupRef.value?.removeEventListener('appendClick', onAppendClick);
});
</script>
`.trim();

export const angularExample = `import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnDestroy, ViewChild } from '@angular/core';

@Component({
  selector: 'app-plumage-input-group',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <plumage-input-group-component
      #inputGroup
      label="Search"
      input-id="angular-search"
      has-append
      append-button
      append-text="Go"
      append-button-variant="secondary"
      append-button-id="angular-search-append-btn"
    ></plumage-input-group-component>
  \`,
})
export class PlumageInputGroupComponent implements AfterViewInit, OnDestroy {
  @ViewChild('inputGroup', { static: true }) inputGroupRef!: ElementRef;

  private readonly onValueChange = (event: Event) => {
    const customEvent = event as CustomEvent<string>;
    console.log('valueChange:', customEvent.detail);
  };

  private readonly onAppendClick = (event: Event) => {
    const customEvent = event as CustomEvent<{ originalEvent: MouseEvent }>;
    console.log('appendClick:', customEvent.detail);
  };

  ngAfterViewInit(): void {
    this.inputGroupRef.nativeElement.addEventListener('valueChange', this.onValueChange);
    this.inputGroupRef.nativeElement.addEventListener('appendClick', this.onAppendClick);
  }

  ngOnDestroy(): void {
    this.inputGroupRef.nativeElement.removeEventListener('valueChange', this.onValueChange);
    this.inputGroupRef.nativeElement.removeEventListener('appendClick', this.onAppendClick);
  }
}
`.trim();

export const svelteExample = `
<script>
  import { onMount } from 'svelte';

  let inputGroupRef = null;

  function onValueChange(event) {
    console.log('valueChange:', event.detail);
  }

  function onAppendClick(event) {
    console.log('appendClick:', event.detail);
  }

  onMount(() => {
    const el = inputGroupRef;
    if (!el) return;

    el.addEventListener('valueChange', onValueChange);
    el.addEventListener('appendClick', onAppendClick);

    return () => {
      el.removeEventListener('valueChange', onValueChange);
      el.removeEventListener('appendClick', onAppendClick);
    };
  });
</script>

<plumage-input-group-component
  bind:this={inputGroupRef}
  label="Search"
  input-id="svelte-search"
  has-append
  append-button
  append-text="Go"
  append-button-variant="secondary"
  append-button-id="svelte-search-append-btn"
></plumage-input-group-component>
`.trim();

export const svelteKitExample = `
<script>
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';

  let inputGroupRef = null;

  function onValueChange(event) {
    console.log('valueChange:', event.detail);
  }

  function onAppendClick(event) {
    console.log('appendClick:', event.detail);
  }

  onMount(() => {
    if (!browser) return;

    const el = inputGroupRef;
    if (!el) return;

    el.addEventListener('valueChange', onValueChange);
    el.addEventListener('appendClick', onAppendClick);

    return () => {
      el.removeEventListener('valueChange', onValueChange);
      el.removeEventListener('appendClick', onAppendClick);
    };
  });
</script>

{#if browser}
  <plumage-input-group-component
    bind:this={inputGroupRef}
    label="Search"
    input-id="sveltekit-search"
    has-append
    append-button
    append-text="Go"
    append-button-variant="secondary"
    append-button-id="sveltekit-search-append-btn"
  ></plumage-input-group-component>
{/if}
`.trim();
