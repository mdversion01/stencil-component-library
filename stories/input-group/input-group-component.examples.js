// File: src/stories/input-group-component/input-group-component.examples.js

export const reactExample = `
import { useEffect, useRef } from 'react';

export default function InputGroupComponentExample() {
  const searchRef = useRef(null);

  useEffect(() => {
    const el = searchRef.current;
    if (!el) return;

    const onAppendClick = event => {
      const input = el.querySelector('input');
      const value = input ? input.value : '';
      console.log('appendClick:', event.detail);
      console.log('Current value:', value);
    };

    el.addEventListener('appendClick', onAppendClick);

    return () => {
      el.removeEventListener('appendClick', onAppendClick);
    };
  }, []);

  return (
    <main style={{ display: 'grid', gap: '16px' }}>
      <input-group-component
        has-append
        label="Amount"
        input-id="amount-play"
        placeholder="Enter amount"
        append-icon="fa-solid fa-dollar-sign"
      ></input-group-component>

      <input-group-component
        has-prepend
        has-append
        label="Amount"
        input-id="amount-both-icons"
        prepend-icon="fa-solid fa-dollar-sign"
        append-icon="fa-solid fa-dollar-sign"
      ></input-group-component>

      <input-group-component
        ref={searchRef}
        has-append
        label="Search"
        input-id="search-q"
        append-button
        append-text="Go"
        append-button-variant="secondary"
        append-button-id="search-q-append-btn"
      ></input-group-component>
    </main>
  );
}
`.trim();

export const vueExample = `
<template>
  <main style="display:grid; gap:16px;">
    <input-group-component
      has-append
      label="Amount"
      input-id="amount-play"
      placeholder="Enter amount"
      append-icon="fa-solid fa-dollar-sign"
    ></input-group-component>

    <input-group-component
      has-prepend
      has-append
      label="Amount"
      input-id="amount-both-icons"
      prepend-icon="fa-solid fa-dollar-sign"
      append-icon="fa-solid fa-dollar-sign"
    ></input-group-component>

    <input-group-component
      ref="searchRef"
      has-append
      label="Search"
      input-id="search-q"
      append-button
      append-text="Go"
      append-button-variant="secondary"
      append-button-id="search-q-append-btn"
    ></input-group-component>
  </main>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

const searchRef = ref(null);

const onAppendClick = event => {
  const input = searchRef.value?.querySelector('input');
  const value = input ? input.value : '';
  console.log('appendClick:', event.detail);
  console.log('Current value:', value);
};

onMounted(() => {
  searchRef.value?.addEventListener('appendClick', onAppendClick);
});

onBeforeUnmount(() => {
  searchRef.value?.removeEventListener('appendClick', onAppendClick);
});
</script>
`.trim();

export const angularExample = `
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnDestroy, ViewChild } from '@angular/core';

@Component({
  selector: 'app-input-group',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <main style="display:grid; gap:16px;">
      <input-group-component
        has-append
        label="Amount"
        input-id="amount-play"
        placeholder="Enter amount"
        append-icon="fa-solid fa-dollar-sign"
      ></input-group-component>

      <input-group-component
        has-prepend
        has-append
        label="Amount"
        input-id="amount-both-icons"
        prepend-icon="fa-solid fa-dollar-sign"
        append-icon="fa-solid fa-dollar-sign"
      ></input-group-component>

      <input-group-component
        #searchRef
        has-append
        label="Search"
        input-id="search-q"
        append-button
        append-text="Go"
        append-button-variant="secondary"
        append-button-id="search-q-append-btn"
      ></input-group-component>
    </main>
  \`,
})
export class InputGroupComponentExample implements AfterViewInit, OnDestroy {
  @ViewChild('searchRef', { static: true }) searchRef!: ElementRef<HTMLElement>;

  private readonly onAppendClick = (event: Event) => {
    const host = this.searchRef.nativeElement;
    const input = host.querySelector('input');
    const value = input ? input.value : '';
    const customEvent = event as CustomEvent<{ originalEvent: MouseEvent }>;

    console.log('appendClick:', customEvent.detail);
    console.log('Current value:', value);
  };

  ngAfterViewInit(): void {
    this.searchRef.nativeElement.addEventListener('appendClick', this.onAppendClick);
  }

  ngOnDestroy(): void {
    this.searchRef.nativeElement.removeEventListener('appendClick', this.onAppendClick);
  }
}
`.trim();

export const svelteExample = `
<script>
  import { onMount } from 'svelte';

  let searchRef = null;

  function onAppendClick(event) {
    const input = searchRef?.querySelector('input');
    const value = input ? input.value : '';
    console.log('appendClick:', event.detail);
    console.log('Current value:', value);
  }

  onMount(() => {
    const el = searchRef;
    if (!el) return;

    el.addEventListener('appendClick', onAppendClick);

    return () => {
      el.removeEventListener('appendClick', onAppendClick);
    };
  });
</script>

<main style="display:grid; gap:16px;">
  <input-group-component
    has-append
    label="Amount"
    input-id="amount-play"
    placeholder="Enter amount"
    append-icon="fa-solid fa-dollar-sign"
  ></input-group-component>

  <input-group-component
    has-prepend
    has-append
    label="Amount"
    input-id="amount-both-icons"
    prepend-icon="fa-solid fa-dollar-sign"
    append-icon="fa-solid fa-dollar-sign"
  ></input-group-component>

  <input-group-component
    bind:this={searchRef}
    has-append
    label="Search"
    input-id="search-q"
    append-button
    append-text="Go"
    append-button-variant="secondary"
    append-button-id="search-q-append-btn"
  ></input-group-component>
</main>
`.trim();

export const svelteKitExample = `
<script>
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';

  let searchRef = null;

  function onAppendClick(event) {
    const input = searchRef?.querySelector('input');
    const value = input ? input.value : '';
    console.log('appendClick:', event.detail);
    console.log('Current value:', value);
  }

  onMount(() => {
    if (!browser) return;

    const el = searchRef;
    if (!el) return;

    el.addEventListener('appendClick', onAppendClick);

    return () => {
      el.removeEventListener('appendClick', onAppendClick);
    };
  });
</script>

{#if browser}
  <main style="display:grid; gap:16px;">
    <input-group-component
      has-append
      label="Amount"
      input-id="amount-play"
      placeholder="Enter amount"
      append-icon="fa-solid fa-dollar-sign"
    ></input-group-component>

    <input-group-component
      has-prepend
      has-append
      label="Amount"
      input-id="amount-both-icons"
      prepend-icon="fa-solid fa-dollar-sign"
      append-icon="fa-solid fa-dollar-sign"
    ></input-group-component>

    <input-group-component
      bind:this={searchRef}
      has-append
      label="Search"
      input-id="search-q"
      append-button
      append-text="Go"
      append-button-variant="secondary"
      append-button-id="search-q-append-btn"
    ></input-group-component>
  </main>
{/if}
`.trim();
