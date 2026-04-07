// File: stories/date-range-time-picker-component.examples.js

export const reactExample = `
import { useEffect, useRef } from 'react';

export default function DateRangeTimePicker() {
  const pickerRef = useRef(null);

  useEffect(() => {
    const el = pickerRef.current;
    if (!el) return;

    const handleUpdate = (event) => {
      console.log('date-time-updated', event.detail);
    };

    el.addEventListener('date-time-updated', handleUpdate);
    return () => el.removeEventListener('date-time-updated', handleUpdate);
  }, []);

  return (
    <date-range-time-picker-component
      ref={pickerRef}
      input-id="react-date-range-time"
      label="Meeting time"
      date-format="YYYY-MM-DD"
      join-by=" - "
      append-prop
      show-duration
    />
  );
}
`.trim();

export const vueExample = `
<template>
  <date-range-time-picker-component
    ref="pickerRef"
    input-id="vue-date-range-time"
    label="Meeting time"
    date-format="YYYY-MM-DD"
    join-by=" - "
    append-prop
    show-duration
  />
</template>

<script setup>
import { onMounted, ref } from 'vue';

const pickerRef = ref(null);

onMounted(() => {
  const el = pickerRef.value;
  if (!el) return;

  el.addEventListener('date-time-updated', (event) => {
    console.log('date-time-updated', event.detail);
  });
});
</script>
`.trim();

export const angularExample = `
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-date-range-time-picker-example',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <date-range-time-picker-component
      #pickerRef
      input-id="angular-date-range-time"
      label="Meeting time"
      date-format="YYYY-MM-DD"
      join-by=" - "
      append-prop
      show-duration
    ></date-range-time-picker-component>
  \`,
})
export class DateRangeTimePickerExampleComponent implements AfterViewInit {
  @ViewChild('pickerRef', { static: true }) pickerRef!: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    this.pickerRef.nativeElement.addEventListener('date-time-updated', (event: Event) => {
      console.log('date-time-updated', (event as CustomEvent).detail);
    });
  }
}
`.trim();
