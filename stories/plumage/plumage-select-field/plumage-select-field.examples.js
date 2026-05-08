export const reactExample = `
import { useEffect, useRef } from 'react';

export default function PlumageSelectField() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.options = [
      { value: 'apple', name: 'Apple' },
      { value: 'banana', name: 'Banana' },
      { value: 'cherry', name: 'Cherry' },
    ];

    const onValueChange = (event) => {
      console.log('valueChange:', event.detail);
    };

    el.addEventListener('valueChange', onValueChange);

    return () => {
      el.removeEventListener('valueChange', onValueChange);
    };
  }, []);

  return (
    <plumage-select-field-component
      ref={ref}
      label="Fruits"
      select-field-id="react-fruit"
      default-option-txt="Select a fruit"
    />
  );
}
`.trim();

export const vueExample = `
<template>
  <plumage-select-field-component
    ref="selectRef"
    label="Fruits"
    select-field-id="vue-fruit"
    default-option-txt="Select a fruit"
  />
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

const selectRef = ref(null);

const onValueChange = (event) => {
  console.log('valueChange:', event.detail);
};

onMounted(() => {
  const el = selectRef.value;
  if (!el) return;

  el.options = [
    { value: 'apple', name: 'Apple' },
    { value: 'banana', name: 'Banana' },
    { value: 'cherry', name: 'Cherry' },
  ];

  el.addEventListener('valueChange', onValueChange);
});

onBeforeUnmount(() => {
  selectRef.value?.removeEventListener('valueChange', onValueChange);
});
</script>
`.trim();

export const angularExample = `
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnDestroy, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <plumage-select-field-component
      #selectField
      label="Fruits"
      select-field-id="angular-fruit"
      default-option-txt="Select a fruit"
    ></plumage-select-field-component>
  \`,
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('selectField', { static: true }) selectFieldRef!: ElementRef;

  private readonly onValueChange = (event: Event) => {
    const customEvent = event as CustomEvent<string | string[]>;
    console.log('valueChange:', customEvent.detail);
  };

  ngAfterViewInit(): void {
    const el = this.selectFieldRef.nativeElement;

    el.options = [
      { value: 'apple', name: 'Apple' },
      { value: 'banana', name: 'Banana' },
      { value: 'cherry', name: 'Cherry' },
    ];

    el.addEventListener('valueChange', this.onValueChange);
  }

  ngOnDestroy(): void {
    this.selectFieldRef.nativeElement.removeEventListener('valueChange', this.onValueChange);
  }
}
`.trim();
