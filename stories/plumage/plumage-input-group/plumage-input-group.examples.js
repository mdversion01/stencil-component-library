export const reactExample = `
import { useEffect, useRef } from 'react';

export default function PlumageInputGroup() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onValueChange = (event) => {
      console.log('valueChange:', event.detail);
    };

    el.addEventListener('valueChange', onValueChange);

    return () => {
      el.removeEventListener('valueChange', onValueChange);
    };
  }, []);

  return (
    <plumage-input-group-component
      ref={ref}
      label="Amount"
      input-id="react-amount"
      placeholder="Enter amount"
      append
      append-icon="fa-solid fa-dollar-sign"
    />
  );
}
`.trim();

export const vueExample = `
<template>
  <plumage-input-group-component
    ref="inputGroupRef"
    label="Amount"
    input-id="vue-amount"
    placeholder="Enter amount"
    append
    append-icon="fa-solid fa-dollar-sign"
  />
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

const inputGroupRef = ref(null);

const onValueChange = (event) => {
  console.log('valueChange:', event.detail);
};

onMounted(() => {
  inputGroupRef.value?.addEventListener('valueChange', onValueChange);
});

onBeforeUnmount(() => {
  inputGroupRef.value?.removeEventListener('valueChange', onValueChange);
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
      label="Amount"
      input-id="angular-amount"
      placeholder="Enter amount"
      append
      append-icon="fa-solid fa-dollar-sign"
    ></plumage-input-group-component>
  \`,
})
export class PlumageInputGroupComponent implements AfterViewInit, OnDestroy {
  @ViewChild('inputGroup', { static: true }) inputGroupRef!: ElementRef;

  private readonly onValueChange = (event: Event) => {
    const customEvent = event as CustomEvent<string>;
    console.log('valueChange:', customEvent.detail);
  };

  ngAfterViewInit(): void {
    this.inputGroupRef.nativeElement.addEventListener('valueChange', this.onValueChange);
  }

  ngOnDestroy(): void {
    this.inputGroupRef.nativeElement.removeEventListener('valueChange', this.onValueChange);
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

  onMount(() => {
    const el = inputGroupRef;
    if (!el) return;

    el.addEventListener('valueChange', onValueChange);

    return () => {
      el.removeEventListener('valueChange', onValueChange);
    };
  });
</script>

<plumage-input-group-component
  bind:this={inputGroupRef}
  label="Amount"
  input-id="svelte-amount"
  placeholder="Enter amount"
  append
  append-icon="fa-solid fa-dollar-sign"
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

  onMount(() => {
    if (!browser) return;

    const el = inputGroupRef;
    if (!el) return;

    el.addEventListener('valueChange', onValueChange);

    return () => {
      el.removeEventListener('valueChange', onValueChange);
    };
  });
</script>

{#if browser}
  <plumage-input-group-component
    bind:this={inputGroupRef}
    label="Amount"
    input-id="sveltekit-amount"
    placeholder="Enter amount"
    append
    append-icon="fa-solid fa-dollar-sign"
  ></plumage-input-group-component>
{/if}
`.trim();

