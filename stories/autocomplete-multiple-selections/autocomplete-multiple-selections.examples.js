// File: src/stories/autocomplete-multiple-selections/autocomplete-multiple-selections.examples.js

export const reactExample = `
import { useEffect, useRef } from 'react';

export default function AutocompleteMultipleSelections() {
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

    const onOptionDelete = (event) => {
      console.log('optionDelete:', event.detail);
    };

    el.addEventListener('multiSelectChange', onChange);
    el.addEventListener('valueChange', onValueChange);
    el.addEventListener('optionDelete', onOptionDelete);

    return () => {
      el.removeEventListener('multiSelectChange', onChange);
      el.removeEventListener('valueChange', onValueChange);
      el.removeEventListener('optionDelete', onOptionDelete);
    };
  }, []);

  return (
    <main>
      <autocomplete-multiple-selections
        ref={ref}
        input-id="react-acms"
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
    <autocomplete-multiple-selections
      ref="autocompleteEl"
      input-id="vue-acms"
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

const onOptionDelete = (event) => {
  console.log('optionDelete:', event.detail);
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
  el.addEventListener('optionDelete', onOptionDelete);
});

onBeforeUnmount(() => {
  autocompleteEl.value?.removeEventListener('multiSelectChange', onChange);
  autocompleteEl.value?.removeEventListener('valueChange', onValueChange);
  autocompleteEl.value?.removeEventListener('optionDelete', onOptionDelete);
});
</script>
`.trim();

export const angularExample = `
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnDestroy, ViewChild } from '@angular/core';

@Component({
  selector: 'app-autocomplete-multiple-selections',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <main>
      <autocomplete-multiple-selections
        #autocompleteEl
        input-id="angular-acms"
        label="Favorite fruits"
        placeholder="Type to search"
        editable
        add-btn
        badge-variant="primary"
      ></autocomplete-multiple-selections>
    </main>
  \`,
})
export class AutocompleteMultipleSelectionsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('autocompleteEl', { static: true }) autocompleteRef!: ElementRef<HTMLElement>;

  private readonly onChange = (event: Event) => {
    const customEvent = event as CustomEvent<string[]>;
    console.log('multiSelectChange:', customEvent.detail);
  };

  private readonly onValueChange = (event: Event) => {
    const customEvent = event as CustomEvent<string[]>;
    console.log('valueChange:', customEvent.detail);
  };

  private readonly onOptionDelete = (event: Event) => {
    const customEvent = event as CustomEvent<string>;
    console.log('optionDelete:', customEvent.detail);
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
    el.addEventListener('optionDelete', this.onOptionDelete);
  }

  ngOnDestroy(): void {
    const el = this.autocompleteRef.nativeElement;
    el.removeEventListener('multiSelectChange', this.onChange);
    el.removeEventListener('valueChange', this.onValueChange);
    el.removeEventListener('optionDelete', this.onOptionDelete);
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

  function onOptionDelete(event) {
    console.log('optionDelete:', event.detail);
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
    el.addEventListener('optionDelete', onOptionDelete);

    return () => {
      el.removeEventListener('multiSelectChange', onChange);
      el.removeEventListener('valueChange', onValueChange);
      el.removeEventListener('optionDelete', onOptionDelete);
    };
  });
</script>

<main>
  <autocomplete-multiple-selections
    bind:this={autocompleteEl}
    input-id="svelte-acms"
    label="Favorite fruits"
    placeholder="Type to search"
    editable
    add-btn
    badge-variant="primary"
  ></autocomplete-multiple-selections>
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

  function onOptionDelete(event) {
    console.log('optionDelete:', event.detail);
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
    el.addEventListener('optionDelete', onOptionDelete);

    return () => {
      el.removeEventListener('multiSelectChange', onChange);
      el.removeEventListener('valueChange', onValueChange);
      el.removeEventListener('optionDelete', onOptionDelete);
    };
  });
</script>

{#if browser}
  <main>
    <autocomplete-multiple-selections
      bind:this={autocompleteEl}
      input-id="sveltekit-acms"
      label="Favorite fruits"
      placeholder="Type to search"
      editable
      add-btn
      badge-variant="primary"
    ></autocomplete-multiple-selections>
  </main>
{/if}
`.trim();
