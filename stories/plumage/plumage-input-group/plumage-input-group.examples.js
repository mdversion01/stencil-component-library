// File: src/stories/plumage-input-group.examples.js

export const reactExample = `
import { useEffect, useRef, useState } from 'react';

export default function PlumageInputGroup() {
  const searchRef = useRef(null);
  const [result, setResult] = useState('');

  useEffect(() => {
    const el = searchRef.current;
    if (!el) return;

    const onValueChange = event => {
      console.log('valueChange:', event.detail);
    };

    const onAppendClick = event => {
      const input = el.querySelector('input');
      const value = input ? input.value : '';

      console.log('appendClick:', event.detail);
      console.log('Current input value:', value);

      setResult(
        value
          ? \`Append button clicked. Current value: "\${value}"\`
          : 'Append button clicked. Input is empty.',
      );
    };

    const onPrependClick = event => {
      console.log('prependClick:', event.detail);
    };

    el.addEventListener('valueChange', onValueChange);
    el.addEventListener('appendClick', onAppendClick);
    el.addEventListener('prependClick', onPrependClick);

    return () => {
      el.removeEventListener('valueChange', onValueChange);
      el.removeEventListener('appendClick', onAppendClick);
      el.removeEventListener('prependClick', onPrependClick);
    };
  }, []);

  return (
    <main style={{ display: 'grid', gap: '16px' }}>
      <plumage-input-group-component
        label="Amount"
        input-id="react-amount"
        has-append
        append-icon="fa-solid fa-dollar-sign"
      ></plumage-input-group-component>

      <plumage-input-group-component
        ref={searchRef}
        label="Search Users"
        input-id="react-search-users"
        placeholder="Type a username"
        has-append
        append-button
        append-text="Search"
        append-button-id="react-search-users-append-btn"
      ></plumage-input-group-component>

      <div>{result}</div>
    </main>
  );
}
`.trim();

export const vueExample = `
<template>
  <main style="display:grid; gap:16px;">
    <plumage-input-group-component
      label="Amount"
      input-id="vue-amount"
      has-append
      append-icon="fa-solid fa-dollar-sign"
    ></plumage-input-group-component>

    <plumage-input-group-component
      ref="inputGroupRef"
      label="Search Users"
      input-id="vue-search-users"
      placeholder="Type a username"
      has-append
      append-button
      append-text="Search"
      append-button-id="vue-search-users-append-btn"
    ></plumage-input-group-component>

    <div>{{ result }}</div>
  </main>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

const inputGroupRef = ref(null);
const result = ref('');

const onValueChange = event => {
  console.log('valueChange:', event.detail);
};

const onAppendClick = event => {
  const el = inputGroupRef.value;
  const input = el?.querySelector('input');
  const value = input ? input.value : '';

  console.log('appendClick:', event.detail);
  console.log('Current input value:', value);

  result.value = value
    ? \`Append button clicked. Current value: "\${value}"\`
    : 'Append button clicked. Input is empty.';
};

const onPrependClick = event => {
  console.log('prependClick:', event.detail);
};

onMounted(() => {
  inputGroupRef.value?.addEventListener('valueChange', onValueChange);
  inputGroupRef.value?.addEventListener('appendClick', onAppendClick);
  inputGroupRef.value?.addEventListener('prependClick', onPrependClick);
});

onBeforeUnmount(() => {
  inputGroupRef.value?.removeEventListener('valueChange', onValueChange);
  inputGroupRef.value?.removeEventListener('appendClick', onAppendClick);
  inputGroupRef.value?.removeEventListener('prependClick', onPrependClick);
});
</script>
`.trim();

export const angularExample = `
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnDestroy, ViewChild } from '@angular/core';

@Component({
  selector: 'app-plumage-input-group',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <main style="display:grid; gap:16px;">
      <plumage-input-group-component
        label="Amount"
        input-id="angular-amount"
        has-append
        append-icon="fa-solid fa-dollar-sign"
      ></plumage-input-group-component>

      <plumage-input-group-component
        #inputGroup
        label="Search Users"
        input-id="angular-search-users"
        placeholder="Type a username"
        has-append
        append-button
        append-text="Search"
        append-button-id="angular-search-users-append-btn"
      ></plumage-input-group-component>

      <div>{{ result }}</div>
    </main>
  \`,
})
export class PlumageInputGroupComponent implements AfterViewInit, OnDestroy {
  @ViewChild('inputGroup', { static: true }) inputGroupRef!: ElementRef<HTMLElement>;

  result = '';

  private readonly onValueChange = (event: Event) => {
    const customEvent = event as CustomEvent<string>;
    console.log('valueChange:', customEvent.detail);
  };

  private readonly onAppendClick = (event: Event) => {
    const customEvent = event as CustomEvent<{ originalEvent: MouseEvent }>;
    const el = this.inputGroupRef.nativeElement;
    const input = el.querySelector('input') as HTMLInputElement | null;
    const value = input ? input.value : '';

    console.log('appendClick:', customEvent.detail);
    console.log('Current input value:', value);

    this.result = value
      ? \`Append button clicked. Current value: "\${value}"\`
      : 'Append button clicked. Input is empty.';
  };

  private readonly onPrependClick = (event: Event) => {
    const customEvent = event as CustomEvent<{ originalEvent: MouseEvent }>;
    console.log('prependClick:', customEvent.detail);
  };

  ngAfterViewInit(): void {
    this.inputGroupRef.nativeElement.addEventListener('valueChange', this.onValueChange);
    this.inputGroupRef.nativeElement.addEventListener('appendClick', this.onAppendClick);
    this.inputGroupRef.nativeElement.addEventListener('prependClick', this.onPrependClick);
  }

  ngOnDestroy(): void {
    this.inputGroupRef.nativeElement.removeEventListener('valueChange', this.onValueChange);
    this.inputGroupRef.nativeElement.removeEventListener('appendClick', this.onAppendClick);
    this.inputGroupRef.nativeElement.removeEventListener('prependClick', this.onPrependClick);
  }
}
`.trim();

export const svelteExample = `
<script>
  import { onMount } from 'svelte';

  let inputGroupRef = null;
  let result = '';

  function onValueChange(event) {
    console.log('valueChange:', event.detail);
  }

  function onAppendClick(event) {
    const input = inputGroupRef?.querySelector('input');
    const value = input ? input.value : '';

    console.log('appendClick:', event.detail);
    console.log('Current input value:', value);

    result = value
      ? \`Append button clicked. Current value: "\${value}"\`
      : 'Append button clicked. Input is empty.';
  }

  function onPrependClick(event) {
    console.log('prependClick:', event.detail);
  }

  onMount(() => {
    const el = inputGroupRef;
    if (!el) return;

    el.addEventListener('valueChange', onValueChange);
    el.addEventListener('appendClick', onAppendClick);
    el.addEventListener('prependClick', onPrependClick);

    return () => {
      el.removeEventListener('valueChange', onValueChange);
      el.removeEventListener('appendClick', onAppendClick);
      el.removeEventListener('prependClick', onPrependClick);
    };
  });
</script>

<main style="display:grid; gap:16px;">
  <plumage-input-group-component
    label="Amount"
    input-id="svelte-amount"
    has-append
    append-icon="fa-solid fa-dollar-sign"
  ></plumage-input-group-component>

  <plumage-input-group-component
    bind:this={inputGroupRef}
    label="Search Users"
    input-id="svelte-search-users"
    placeholder="Type a username"
    has-append
    append-button
    append-text="Search"
    append-button-id="svelte-search-users-append-btn"
  ></plumage-input-group-component>

  <div>{result}</div>
</main>
`.trim();

export const svelteKitExample = `
<script>
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';

  let inputGroupRef = null;
  let result = '';

  function onValueChange(event) {
    console.log('valueChange:', event.detail);
  }

  function onAppendClick(event) {
    const input = inputGroupRef?.querySelector('input');
    const value = input ? input.value : '';

    console.log('appendClick:', event.detail);
    console.log('Current input value:', value);

    result = value
      ? \`Append button clicked. Current value: "\${value}"\`
      : 'Append button clicked. Input is empty.';
  }

  function onPrependClick(event) {
    console.log('prependClick:', event.detail);
  }

  onMount(() => {
    if (!browser) return;

    const el = inputGroupRef;
    if (!el) return;

    el.addEventListener('valueChange', onValueChange);
    el.addEventListener('appendClick', onAppendClick);
    el.addEventListener('prependClick', onPrependClick);

    return () => {
      el.removeEventListener('valueChange', onValueChange);
      el.removeEventListener('appendClick', onAppendClick);
      el.removeEventListener('prependClick', onPrependClick);
    };
  });
</script>

{#if browser}
  <main style="display:grid; gap:16px;">
    <plumage-input-group-component
      label="Amount"
      input-id="sveltekit-amount"
      has-append
      append-icon="fa-solid fa-dollar-sign"
    ></plumage-input-group-component>

    <plumage-input-group-component
      bind:this={inputGroupRef}
      label="Search Users"
      input-id="sveltekit-search-users"
      placeholder="Type a username"
      has-append
      append-button
      append-text="Search"
      append-button-id="sveltekit-search-users-append-btn"
    ></plumage-input-group-component>

    <div>{result}</div>
  </main>
{/if}
`.trim();
