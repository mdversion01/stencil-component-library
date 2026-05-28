export const reactExample = `
import { useEffect, useRef } from 'react';

export default function PlumageTimepicker() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onTimeChange = (event) => {
      console.log('timeChange:', event.detail);
    };

    const onTimeInput = (event) => {
      console.log('timeInput:', event.detail);
    };

    el.addEventListener('timeChange', onTimeChange);
    el.addEventListener('timeInput', onTimeInput);

    return () => {
      el.removeEventListener('timeChange', onTimeChange);
      el.removeEventListener('timeInput', onTimeInput);
    };
  }, []);

  return (
    <plumage-timepicker-component
      ref={ref}
      show-label
      label-text="Meeting time"
      input-id="react-timepicker"
      input-name="meetingTime"
      value="13:05:09"
      is-twenty-four-hour-format="true"
    />
  );
}
`.trim();

export const vueExample = `
<template>
  <plumage-timepicker-component
    ref="timepickerRef"
    show-label
    label-text="Meeting time"
    input-id="vue-timepicker"
    input-name="meetingTime"
    value="13:05:09"
    is-twenty-four-hour-format="true"
  />
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

const timepickerRef = ref(null);

const onTimeChange = (event) => {
  console.log('timeChange:', event.detail);
};

const onTimeInput = (event) => {
  console.log('timeInput:', event.detail);
};

onMounted(() => {
  const el = timepickerRef.value;
  if (!el) return;

  el.addEventListener('timeChange', onTimeChange);
  el.addEventListener('timeInput', onTimeInput);
});

onBeforeUnmount(() => {
  timepickerRef.value?.removeEventListener('timeChange', onTimeChange);
  timepickerRef.value?.removeEventListener('timeInput', onTimeInput);
});
</script>
`.trim();

export const angularExample = `import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnDestroy, ViewChild } from '@angular/core';

@Component({
  selector: 'app-plumage-timepicker',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <plumage-timepicker-component
      #timepickerEl
      show-label
      label-text="Meeting time"
      input-id="angular-timepicker"
      input-name="meetingTime"
      value="13:05:09"
      is-twenty-four-hour-format="true"
    ></plumage-timepicker-component>
  \`,
})
export class PlumageTimepickerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('timepickerEl', { static: true }) timepickerRef!: ElementRef;

  private readonly onTimeChange = (event: Event) => {
    const customEvent = event as CustomEvent;
    console.log('timeChange:', customEvent.detail);
  };

  private readonly onTimeInput = (event: Event) => {
    const customEvent = event as CustomEvent;
    console.log('timeInput:', customEvent.detail);
  };

  ngAfterViewInit(): void {
    const el = this.timepickerRef.nativeElement;

    el.addEventListener('timeChange', this.onTimeChange);
    el.addEventListener('timeInput', this.onTimeInput);
  }

  ngOnDestroy(): void {
    this.timepickerRef.nativeElement.removeEventListener('timeChange', this.onTimeChange);
    this.timepickerRef.nativeElement.removeEventListener('timeInput', this.onTimeInput);
  }
}
`.trim();

export const svelteExample = `
<script>
  import { onMount, onDestroy } from 'svelte';

  let timepickerEl;

  const handleTimeChange = (event) => {
    console.log('timeChange:', event.detail);
  };

  const handleTimeInput = (event) => {
    console.log('timeInput:', event.detail);
  };

  onMount(() => {
    const el = timepickerEl;
    if (!el) return;

    el.addEventListener('timeChange', handleTimeChange);
    el.addEventListener('timeInput', handleTimeInput);
  });

  onDestroy(() => {
    const el = timepickerEl;
    if (!el) return;

    el.removeEventListener('timeChange', handleTimeChange);
    el.removeEventListener('timeInput', handleTimeInput);
  });
</script>

<plumage-timepicker-component
  bind:this={timepickerEl}
  show-label
  label-text="Meeting time"
  input-id="svelte-timepicker"
  input-name="meetingTime"
  value="00:00:00"
  is-twenty-four-hour-format="true"
></plumage-timepicker-component>
`.trim();

export const svelteKitExample = `
<!-- File: src/lib/components/PlumageTimepickerExample.svelte -->
<script>
  import { onMount, onDestroy } from 'svelte';

  let timepickerEl;

  const handleTimeChange = (event) => {
    console.log('timeChange:', event.detail);
  };

  const handleTimeInput = (event) => {
    console.log('timeInput:', event.detail);
  };

  onMount(() => {
    const el = timepickerEl;
    if (!el) return;

    el.addEventListener('timeChange', handleTimeChange);
    el.addEventListener('timeInput', handleTimeInput);
  });

  onDestroy(() => {
    const el = timepickerEl;
    if (!el) return;

    el.removeEventListener('timeChange', handleTimeChange);
    el.removeEventListener('timeInput', handleTimeInput);
  });
</script>

<plumage-timepicker-component
  bind:this={timepickerEl}
  show-label
  label-text="Meeting time"
  input-id="sveltekit-timepicker"
  input-name="meetingTime"
  value="00:00:00"
  is-twenty-four-hour-format="true"
></plumage-timepicker-component>

<!-- File: src/routes/+page.svelte -->
<script>
  import PlumageTimepickerExample from '$lib/components/PlumageTimepickerExample.svelte';
</script>

<PlumageTimepickerExample />
`.trim();
