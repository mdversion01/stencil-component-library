export const reactExample = `
import { useEffect, useRef } from 'react';

export default function TimepickerManager() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleManagerTimeChange = (event) => {
      console.log('managerTimeChange', event.detail);
    };

    const handleManagerTimeInput = (event) => {
      console.log('managerTimeInput', event.detail);
    };

    el.addEventListener('managerTimeChange', handleManagerTimeChange);
    el.addEventListener('managerTimeInput', handleManagerTimeInput);

    return () => {
      el.removeEventListener('managerTimeChange', handleManagerTimeChange);
      el.removeEventListener('managerTimeInput', handleManagerTimeInput);
    };
  }, []);

  return (
    <timepicker-manager
      ref={ref}
      show-label
      label-text="Meeting time"
      input-id="react-manager-time"
      input-name="meetingTime"
      value="00:00:00"
      is-twenty-four-hour-format
    />
  );
}
`.trim();

export const vueExample = `
<template>
  <timepicker-manager
    ref="managerRef"
    show-label
    label-text="Meeting time"
    input-id="vue-manager-time"
    input-name="meetingTime"
    value="00:00:00"
    is-twenty-four-hour-format
  />
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';

const managerRef = ref(null);

const handleManagerTimeChange = (event) => {
  console.log('managerTimeChange', event.detail);
};

const handleManagerTimeInput = (event) => {
  console.log('managerTimeInput', event.detail);
};

onMounted(() => {
  const el = managerRef.value;
  if (!el) return;

  el.addEventListener('managerTimeChange', handleManagerTimeChange);
  el.addEventListener('managerTimeInput', handleManagerTimeInput);
});

onBeforeUnmount(() => {
  const el = managerRef.value;
  if (!el) return;

  el.removeEventListener('managerTimeChange', handleManagerTimeChange);
  el.removeEventListener('managerTimeInput', handleManagerTimeInput);
});
</script>
`.trim();

export const angularExample = `import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnDestroy, ViewChild } from '@angular/core';

@Component({
  selector: 'app-timepicker-manager',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <timepicker-manager
      #managerEl
      show-label
      label-text="Meeting time"
      input-id="angular-manager-time"
      input-name="meetingTime"
      value="00:00:00"
      [isTwentyFourHourFormat]="true"
    ></timepicker-manager>
  \`,
})
export class TimepickerManagerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('managerEl', { static: true }) managerRef!: ElementRef<HTMLElement>;

  private readonly handleManagerTimeChange = (event: Event) => {
    console.log('managerTimeChange', (event as CustomEvent).detail);
  };

  private readonly handleManagerTimeInput = (event: Event) => {
    console.log('managerTimeInput', (event as CustomEvent).detail);
  };

  ngAfterViewInit(): void {
    const el = this.managerRef.nativeElement;
    el.addEventListener('managerTimeChange', this.handleManagerTimeChange);
    el.addEventListener('managerTimeInput', this.handleManagerTimeInput);
  }

  ngOnDestroy(): void {
    const el = this.managerRef.nativeElement;
    el.removeEventListener('managerTimeChange', this.handleManagerTimeChange);
    el.removeEventListener('managerTimeInput', this.handleManagerTimeInput);
  }
}
`.trim();

export const svelteExample = `
<script>
  import { onMount, onDestroy } from 'svelte';

  let managerEl;

  const handleManagerTimeChange = (event) => {
    console.log('managerTimeChange', event.detail);
  };

  const handleManagerTimeInput = (event) => {
    console.log('managerTimeInput', event.detail);
  };

  onMount(() => {
    const el = managerEl;
    if (!el) return;

    el.addEventListener('managerTimeChange', handleManagerTimeChange);
    el.addEventListener('managerTimeInput', handleManagerTimeInput);

    return () => {
      el.removeEventListener('managerTimeChange', handleManagerTimeChange);
      el.removeEventListener('managerTimeInput', handleManagerTimeInput);
    };
  });

  onDestroy(() => {
    const el = managerEl;
    if (!el) return;

    el.removeEventListener('managerTimeChange', handleManagerTimeChange);
    el.removeEventListener('managerTimeInput', handleManagerTimeInput);
  });
</script>

<timepicker-manager
  bind:this={managerEl}
  show-label
  label-text="Meeting time"
  input-id="svelte-manager-time"
  input-name="meetingTime"
  value="00:00:00"
  is-twenty-four-hour-format
></timepicker-manager>
`.trim();

export const svelteKitExample = `
<script lang="ts">
  import { onMount } from 'svelte';

  type TimeChangeDetail = {
    value: string;
    hours?: string;
    minutes?: string;
    seconds?: string;
    meridiem?: string;
  };

  type TimeInputDetail = {
    value: string;
    hours?: string;
    minutes?: string;
    seconds?: string;
    meridiem?: string;
  };

  type TimepickerManagerElement = HTMLElement & {
    addEventListener: (
      type: 'managerTimeChange' | 'managerTimeInput',
      listener: (event: CustomEvent<any>) => void
    ) => void;
    removeEventListener: (
      type: 'managerTimeChange' | 'managerTimeInput',
      listener: (event: CustomEvent<any>) => void
    ) => void;
  };

  let managerEl: TimepickerManagerElement | null = null;

  const handleManagerTimeChange = (
    event: CustomEvent<TimeChangeDetail & { managerInputId: string; impl: string }>
  ) => {
    console.log('managerTimeChange', event.detail);
  };

  const handleManagerTimeInput = (
    event: CustomEvent<TimeInputDetail & { managerInputId: string; impl: string }>
  ) => {
    console.log('managerTimeInput', event.detail);
  };

  onMount(() => {
    const el = managerEl;
    if (!el) return;

    el.addEventListener('managerTimeChange', handleManagerTimeChange);
    el.addEventListener('managerTimeInput', handleManagerTimeInput);

    return () => {
      el.removeEventListener('managerTimeChange', handleManagerTimeChange);
      el.removeEventListener('managerTimeInput', handleManagerTimeInput);
    };
  });
</script>

<timepicker-manager
  bind:this={managerEl}
  show-label
  label-text="Meeting time"
  input-id="sveltekit-manager-time"
  input-name="meetingTime"
  value="00:00:00"
  is-twenty-four-hour-format
></timepicker-manager>
`.trim();
