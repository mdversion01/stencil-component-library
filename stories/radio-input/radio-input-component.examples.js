// src/stories/radio-input-component.examples.js

export const reactExample = `
import { useEffect, useRef } from 'react';

export default function RadioInputExample() {
  const radioRef = useRef(null);

  useEffect(() => {
    const el = radioRef.current;
    if (!el) return;

    const groupOptions = [
      { inputId: 'contact-email', value: 'email', labelTxt: 'Email', checked: true },
      { inputId: 'contact-sms', value: 'sms', labelTxt: 'SMS' },
      { inputId: 'contact-call', value: 'call', labelTxt: 'Phone Call' },
    ];

    el.groupOptions = groupOptions;

    const handleGroupChange = (event) => {
      console.log('Selected value:', event.detail);
    };

    el.addEventListener('groupChange', handleGroupChange);

    return () => {
      el.removeEventListener('groupChange', handleGroupChange);
    };
  }, []);

  return (
    <radio-input-component
      ref={radioRef}
      bs-radio-group
      name="preferredContact"
      group-title="Preferred Contact"
    />
  );
}
`.trim();

export const vueExample = `
<template>
  <radio-input-component
    ref="radioEl"
    bs-radio-group
    name="preferredContact"
    group-title="Preferred Contact"
  />
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

const radioEl = ref(null);

const groupOptions = [
  { inputId: 'contact-email', value: 'email', labelTxt: 'Email', checked: true },
  { inputId: 'contact-sms', value: 'sms', labelTxt: 'SMS' },
  { inputId: 'contact-call', value: 'call', labelTxt: 'Phone Call' },
];

const handleGroupChange = (event) => {
  console.log('Selected value:', event.detail);
};

onMounted(() => {
  const el = radioEl.value;
  if (!el) return;

  el.groupOptions = groupOptions;
  el.addEventListener('groupChange', handleGroupChange);
});

onBeforeUnmount(() => {
  radioEl.value?.removeEventListener('groupChange', handleGroupChange);
});
</script>
`.trim();

export const angularExample = `
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnDestroy, ViewChild } from '@angular/core';

@Component({
  selector: 'app-radio-input',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <radio-input-component
      #radioEl
      bs-radio-group
      name="preferredContact"
      group-title="Preferred Contact"
    ></radio-input-component>
  \`,
})
export class RadioInputComponent implements AfterViewInit, OnDestroy {
  @ViewChild('radioEl', { static: true }) radioRef!: ElementRef<HTMLElement & { groupOptions?: unknown }>;

  private readonly groupOptions = [
    { inputId: 'contact-email', value: 'email', labelTxt: 'Email', checked: true },
    { inputId: 'contact-sms', value: 'sms', labelTxt: 'SMS' },
    { inputId: 'contact-call', value: 'call', labelTxt: 'Phone Call' },
  ];

  private readonly handleGroupChange = (event: Event) => {
    console.log('Selected value:', (event as CustomEvent<string>).detail);
  };

  ngAfterViewInit(): void {
    const el = this.radioRef.nativeElement;
    el.groupOptions = this.groupOptions;
    el.addEventListener('groupChange', this.handleGroupChange);
  }

  ngOnDestroy(): void {
    this.radioRef.nativeElement.removeEventListener('groupChange', this.handleGroupChange);
  }
}
`.trim();

export const svelteExample = `
<script>
  import { onMount } from 'svelte';

  let radioEl;

  const groupOptions = [
    { inputId: 'contact-email', value: 'email', labelTxt: 'Email', checked: true },
    { inputId: 'contact-sms', value: 'sms', labelTxt: 'SMS' },
    { inputId: 'contact-call', value: 'call', labelTxt: 'Phone Call' },
  ];

  function handleGroupChange(event) {
    console.log('Selected value:', event.detail);
  }

  onMount(() => {
    const el = radioEl;
    if (!el) return;

    el.groupOptions = groupOptions;
    el.addEventListener('groupChange', handleGroupChange);

    return () => {
      el.removeEventListener('groupChange', handleGroupChange);
    };
  });
</script>

<section>
  <h2>Radio Input Example</h2>

  <radio-input-component
    bind:this={radioEl}
    bs-radio-group
    name="preferredContact"
    group-title="Preferred Contact"
  ></radio-input-component>
</section>
`.trim();

export const svelteKitExample = `
<script>
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';

  let radioEl;

  const groupOptions = [
    { inputId: 'contact-email', value: 'email', labelTxt: 'Email', checked: true },
    { inputId: 'contact-sms', value: 'sms', labelTxt: 'SMS' },
    { inputId: 'contact-call', value: 'call', labelTxt: 'Phone Call' },
  ];

  function handleGroupChange(event) {
    console.log('Selected value:', event.detail);
  }

  onMount(() => {
    if (!browser) return;

    const el = radioEl;
    if (!el) return;

    el.groupOptions = groupOptions;
    el.addEventListener('groupChange', handleGroupChange);

    return () => {
      el.removeEventListener('groupChange', handleGroupChange);
    };
  });
</script>

<section>
  <h2>Radio Input Example</h2>

  {#if browser}
    <radio-input-component
      bind:this={radioEl}
      bs-radio-group
      name="preferredContact"
      group-title="Preferred Contact"
    ></radio-input-component>
  {/if}
</section>
`.trim();
