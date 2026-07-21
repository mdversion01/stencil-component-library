// File: src/stories/autocomplete-multiselect/autocomplete-multiselect.examples.js

export const reactExample = `
import { useEffect, useRef } from 'react';

export default function AutocompleteMultiSelect() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.options = [
      'Apple',
      'Banana',
      'Orange',
      'Mango',
      'Blueberry',
      'Strawberry',
    ];
    el.value = ['Apple', 'Mango'];

    const onChange = (event) => {
      console.log('multiSelectChange:', event.detail);
    };

    const onValueChange = (event) => {
      console.log('valueChange:', event.detail);
    };

    const onOptionsChange = (event) => {
      console.log('optionsChange:', event.detail);
    };

    el.addEventListener('multiSelectChange', onChange);
    el.addEventListener('valueChange', onValueChange);
    el.addEventListener('optionsChange', onOptionsChange);

    return () => {
      el.removeEventListener('multiSelectChange', onChange);
      el.removeEventListener('valueChange', onValueChange);
      el.removeEventListener('optionsChange', onOptionsChange);
    };
  }, []);

  return (
    <main>
      <autocomplete-multiselect
        ref={ref}
        input-id="react-acm"
        label="Favorite fruits"
        placeholder="Type to search"
        editable
        add-btn
        badge-variant="primary"
      />
    </main>
  );
}
`.trim();

export const vueExample = `
<template>
  <main>
    <autocomplete-multiselect
      ref="autocompleteEl"
      input-id="vue-acm"
      label="Favorite fruits"
      placeholder="Type to search"
      editable
      add-btn
      badge-variant="primary"
    />
  </main>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

const autocompleteEl = ref(null);

const onChange = (event) => {
  console.log('multiSelectChange:', event.detail);
};

const onValueChange = (event) => {
  console.log('valueChange:', event.detail);
};

const onOptionsChange = (event) => {
  console.log('optionsChange:', event.detail);
};

onMounted(() => {
  const el = autocompleteEl.value;
  if (!el) return;

  el.options = [
    'Apple',
    'Banana',
    'Orange',
    'Mango',
    'Blueberry',
    'Strawberry',
  ];
  el.value = ['Apple', 'Mango'];

  el.addEventListener('multiSelectChange', onChange);
  el.addEventListener('valueChange', onValueChange);
  el.addEventListener('optionsChange', onOptionsChange);
});

onBeforeUnmount(() => {
  autocompleteEl.value?.removeEventListener('multiSelectChange', onChange);
  autocompleteEl.value?.removeEventListener('valueChange', onValueChange);
  autocompleteEl.value?.removeEventListener('optionsChange', onOptionsChange);
});
</script>
`.trim();

export const angularExample = `
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnDestroy, ViewChild } from '@angular/core';

@Component({
  selector: 'app-autocomplete-multiselect',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <main>
      <autocomplete-multiselect
        #autocompleteEl
        input-id="angular-acm"
        label="Favorite fruits"
        placeholder="Type to search"
        editable
        add-btn
        badge-variant="primary"
      ></autocomplete-multiselect>
    </main>
  \`,
})
export class AutocompleteMultiselectComponent implements AfterViewInit, OnDestroy {
  @ViewChild('autocompleteEl', { static: true }) autocompleteRef!: ElementRef<HTMLElement>;

  private readonly onChange = (event: Event) => {
    const customEvent = event as CustomEvent<string[]>;
    console.log('multiSelectChange:', customEvent.detail);
  };

  private readonly onValueChange = (event: Event) => {
    const customEvent = event as CustomEvent<string[]>;
    console.log('valueChange:', customEvent.detail);
  };

  private readonly onOptionsChange = (event: Event) => {
    const customEvent = event as CustomEvent;
    console.log('optionsChange:', customEvent.detail);
  };

  ngAfterViewInit(): void {
    const el = this.autocompleteRef.nativeElement as any;

    el.options = [
      'Apple',
      'Banana',
      'Orange',
      'Mango',
      'Blueberry',
      'Strawberry',
    ];
    el.value = ['Apple', 'Mango'];

    el.addEventListener('multiSelectChange', this.onChange);
    el.addEventListener('valueChange', this.onValueChange);
    el.addEventListener('optionsChange', this.onOptionsChange);
  }

  ngOnDestroy(): void {
    const el = this.autocompleteRef.nativeElement;
    el.removeEventListener('multiSelectChange', this.onChange);
    el.removeEventListener('valueChange', this.onValueChange);
    el.removeEventListener('optionsChange', this.onOptionsChange);
  }
}
`.trim();

export const svelteExample = `
<script>
  import { onMount } from 'svelte';

  let autocompleteEl = null;

  function onChange(event) {
    console.log('multiSelectChange:', event.detail);
  }

  function onValueChange(event) {
    console.log('valueChange:', event.detail);
  }

  function onOptionsChange(event) {
    console.log('optionsChange:', event.detail);
  }

  onMount(() => {
    const el = autocompleteEl;
    if (!el) return;

    el.options = [
      'Apple',
      'Banana',
      'Orange',
      'Mango',
      'Blueberry',
      'Strawberry',
    ];
    el.value = ['Apple', 'Mango'];

    el.addEventListener('multiSelectChange', onChange);
    el.addEventListener('valueChange', onValueChange);
    el.addEventListener('optionsChange', onOptionsChange);

    return () => {
      el.removeEventListener('multiSelectChange', onChange);
      el.removeEventListener('valueChange', onValueChange);
      el.removeEventListener('optionsChange', onOptionsChange);
    };
  });
</script>

<main>
  <autocomplete-multiselect
    bind:this={autocompleteEl}
    input-id="svelte-acm"
    label="Favorite fruits"
    placeholder="Type to search"
    editable
    add-btn
    badge-variant="primary"
  />
</main>
`.trim();

export const svelteKitExample = `
<script>
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';

  let autocompleteEl = null;

  function onChange(event) {
    console.log('multiSelectChange:', event.detail);
  }

  function onValueChange(event) {
    console.log('valueChange:', event.detail);
  }

  function onOptionsChange(event) {
    console.log('optionsChange:', event.detail);
  }

  onMount(() => {
    if (!browser) return;

    const el = autocompleteEl;
    if (!el) return;

    el.options = [
      'Apple',
      'Banana',
      'Orange',
      'Mango',
      'Blueberry',
      'Strawberry',
    ];
    el.value = ['Apple', 'Mango'];

    el.addEventListener('multiSelectChange', onChange);
    el.addEventListener('valueChange', onValueChange);
    el.addEventListener('optionsChange', onOptionsChange);

    return () => {
      el.removeEventListener('multiSelectChange', onChange);
      el.removeEventListener('valueChange', onValueChange);
      el.removeEventListener('optionsChange', onOptionsChange);
    };
  });
</script>

{#if browser}
  <main>
    <autocomplete-multiselect
      bind:this={autocompleteEl}
      input-id="sveltekit-acm"
      label="Favorite fruits"
      placeholder="Type to search"
      editable
      add-btn
      badge-variant="primary"
    />
  </main>
{/if}
`.trim();
