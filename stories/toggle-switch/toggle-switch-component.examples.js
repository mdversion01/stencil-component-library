export const reactExample = `import React, { useEffect, useRef } from 'react';

export default function ToggleSwitchComponentExample() {
  const singleRef = useRef(null);
  const multiRef = useRef(null);

  useEffect(() => {
    const setup = async () => {
      await customElements.whenDefined('toggle-switch-component');

      const multi = multiRef.current;
      if (!multi) return;

      multi.switchesArray = [
        { id: 'wifi', label: 'Wi-Fi', value: 'wifi', checked: true, toggleTxt: true, newToggleTxt: { on: 'On', off: 'Off' } },
        { id: 'bt', label: 'Bluetooth', value: 'bt', checked: false, toggleTxt: true },
        { id: 'air', label: 'Airplane Mode', value: 'air', disabled: true },
      ];
    };

    setup();
  }, []);

  const handleCheckedChanged = (event) => {
    console.log('checkedChanged', event.detail);
  };

  useEffect(() => {
    const single = singleRef.current;
    const multi = multiRef.current;
    if (!single || !multi) return;

    single.addEventListener('checkedChanged', handleCheckedChanged);
    multi.addEventListener('checkedChanged', handleCheckedChanged);

    return () => {
      single.removeEventListener('checkedChanged', handleCheckedChanged);
      multi.removeEventListener('checkedChanged', handleCheckedChanged);
    };
  }, []);

  return (
    <section>
      <h2>Single Toggle</h2>
      <toggle-switch-component
        ref={singleRef}
        input-id="react-toggle-single"
        label-txt="Enable notifications"
        toggle-txt
        new-toggle-txt='{"on":"On","off":"Off"}'
        value="notifications"
      ></toggle-switch-component>

      <h2 style={{ marginTop: '24px' }}>Multi Toggle Group</h2>
      <div id="react-toggle-group-label" style={{ fontWeight: 600, marginBottom: '8px' }}>
        Device settings
      </div>
      <toggle-switch-component
        ref={multiRef}
        input-id="react-toggle-group"
        switches
        inline
        aria-labelledby="react-toggle-group-label"
      ></toggle-switch-component>
    </section>
  );
}
`;

export const vueExample = `<template>
  <section>
    <h2>Single Toggle</h2>
    <toggle-switch-component
      ref="singleRef"
      input-id="vue-toggle-single"
      label-txt="Enable notifications"
      toggle-txt
      new-toggle-txt='{"on":"On","off":"Off"}'
      value="notifications"
    ></toggle-switch-component>

    <h2 style="margin-top:24px;">Multi Toggle Group</h2>
    <div id="vue-toggle-group-label" style="font-weight:600; margin-bottom:8px;">
      Device settings
    </div>
    <toggle-switch-component
      ref="multiRef"
      input-id="vue-toggle-group"
      switches
      inline
      aria-labelledby="vue-toggle-group-label"
    ></toggle-switch-component>
  </section>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';

const singleRef = ref(null);
const multiRef = ref(null);

const onCheckedChanged = (event) => {
  console.log('checkedChanged', event.detail);
};

onMounted(async () => {
  await customElements.whenDefined('toggle-switch-component');

  if (multiRef.value) {
    multiRef.value.switchesArray = [
      { id: 'wifi', label: 'Wi-Fi', value: 'wifi', checked: true, toggleTxt: true, newToggleTxt: { on: 'On', off: 'Off' } },
      { id: 'bt', label: 'Bluetooth', value: 'bt', checked: false, toggleTxt: true },
      { id: 'air', label: 'Airplane Mode', value: 'air', disabled: true },
    ];
  }

  singleRef.value?.addEventListener('checkedChanged', onCheckedChanged);
  multiRef.value?.addEventListener('checkedChanged', onCheckedChanged);
});

onBeforeUnmount(() => {
  singleRef.value?.removeEventListener('checkedChanged', onCheckedChanged);
  multiRef.value?.removeEventListener('checkedChanged', onCheckedChanged);
});
</script>
`;

export const angularExample = `import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-toggle-switch',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <section>
      <h3>Single Toggle</h3>
      <toggle-switch-component
        #singleRef
        input-id="ng-toggle-single"
        label-txt="Enable notifications"
        toggle-txt
        new-toggle-txt='{"on":"On","off":"Off"}'
        value="notifications"
      ></toggle-switch-component>

      <h3 style="margin-top:24px;">Multi Toggle Group</h3>
      <div id="ng-toggle-group-label" style="font-weight:600; margin-bottom:8px;">
        Device settings
      </div>
      <toggle-switch-component
        #multiRef
        input-id="ng-toggle-group"
        switches
        inline
        aria-labelledby="ng-toggle-group-label"
      ></toggle-switch-component>
    </section>
  \`,
})
export class ToggleSwitchComponent implements AfterViewInit, OnDestroy {
  @ViewChild('singleRef', { static: true }) singleRef!: ElementRef;
  @ViewChild('multiRef', { static: true }) multiRef!: ElementRef;

  private onCheckedChanged = (event: Event) => {
    const customEvent = event as CustomEvent;
    console.log('checkedChanged', customEvent.detail);
  };

  async ngAfterViewInit(): Promise<void> {
    await customElements.whenDefined('toggle-switch-component');

    const multi = this.multiRef.nativeElement;
    multi.switchesArray = [
      { id: 'wifi', label: 'Wi-Fi', value: 'wifi', checked: true, toggleTxt: true, newToggleTxt: { on: 'On', off: 'Off' } },
      { id: 'bt', label: 'Bluetooth', value: 'bt', checked: false, toggleTxt: true },
      { id: 'air', label: 'Airplane Mode', value: 'air', disabled: true },
    ];

    this.singleRef.nativeElement.addEventListener('checkedChanged', this.onCheckedChanged);
    this.multiRef.nativeElement.addEventListener('checkedChanged', this.onCheckedChanged);
  }

  ngOnDestroy(): void {
    this.singleRef?.nativeElement?.removeEventListener('checkedChanged', this.onCheckedChanged);
    this.multiRef?.nativeElement?.removeEventListener('checkedChanged', this.onCheckedChanged);
  }
}
`;

export const svelteExample = `<script>
  import { onMount, onDestroy } from 'svelte';

  let singleEl;
  let multiEl;

  const onCheckedChanged = (event) => {
    console.log('checkedChanged', event.detail);
  };

  onMount(async () => {
    await customElements.whenDefined('toggle-switch-component');

    if (multiEl) {
      multiEl.switchesArray = [
        { id: 'wifi', label: 'Wi-Fi', value: 'wifi', checked: true, toggleTxt: true, newToggleTxt: { on: 'On', off: 'Off' } },
        { id: 'bt', label: 'Bluetooth', value: 'bt', checked: false, toggleTxt: true },
        { id: 'air', label: 'Airplane Mode', value: 'air', disabled: true },
      ];
    }

    singleEl?.addEventListener('checkedChanged', onCheckedChanged);
    multiEl?.addEventListener('checkedChanged', onCheckedChanged);
  });

  onDestroy(() => {
    singleEl?.removeEventListener('checkedChanged', onCheckedChanged);
    multiEl?.removeEventListener('checkedChanged', onCheckedChanged);
  });
</script>

<section>
  <h2>Single Toggle</h2>
  <toggle-switch-component
    bind:this={singleEl}
    input-id="svelte-toggle-single"
    label-txt="Enable notifications"
    toggle-txt
    new-toggle-txt='{"on":"On","off":"Off"}'
    value="notifications"
  ></toggle-switch-component>

  <h2 style="margin-top:24px;">Multi Toggle Group</h2>
  <div id="svelte-toggle-group-label" style="font-weight:600; margin-bottom:8px;">
    Device settings
  </div>
  <toggle-switch-component
    bind:this={multiEl}
    input-id="svelte-toggle-group"
    switches
    inline
    aria-labelledby="svelte-toggle-group-label"
  ></toggle-switch-component>
</section>
`;

export const svelteKitExample = `<script lang="ts">
  import { browser } from '$app/environment';
  import { onMount, onDestroy } from 'svelte';

  let singleEl: HTMLElement | null = null;
  let multiEl: HTMLElement | null = null;

  const onCheckedChanged = (event: Event) => {
    const customEvent = event as CustomEvent<{ id: string; checked: boolean }>;
    console.log('checkedChanged', customEvent.detail);
  };

  onMount(async () => {
    if (!browser) return;

    await customElements.whenDefined('toggle-switch-component');

    const multi = multiEl as (HTMLElement & { switchesArray?: unknown[] }) | null;
    if (multi) {
      multi.switchesArray = [
        { id: 'wifi', label: 'Wi-Fi', value: 'wifi', checked: true, toggleTxt: true, newToggleTxt: { on: 'On', off: 'Off' } },
        { id: 'bt', label: 'Bluetooth', value: 'bt', checked: false, toggleTxt: true },
        { id: 'air', label: 'Airplane Mode', value: 'air', disabled: true },
      ];
    }

    singleEl?.addEventListener('checkedChanged', onCheckedChanged);
    multiEl?.addEventListener('checkedChanged', onCheckedChanged);
  });

  onDestroy(() => {
    singleEl?.removeEventListener('checkedChanged', onCheckedChanged);
    multiEl?.removeEventListener('checkedChanged', onCheckedChanged);
  });
</script>

<section>
  <h2>Single Toggle</h2>
  <toggle-switch-component
    bind:this={singleEl}
    input-id="sveltekit-toggle-single"
    label-txt="Enable notifications"
    toggle-txt
    new-toggle-txt='{"on":"On","off":"Off"}'
    value="notifications"
  ></toggle-switch-component>

  <h2 style="margin-top:24px;">Multi Toggle Group</h2>
  <div id="sveltekit-toggle-group-label" style="font-weight:600; margin-bottom:8px;">
    Device settings
  </div>
  <toggle-switch-component
    bind:this={multiEl}
    input-id="sveltekit-toggle-group"
    switches
    inline
    aria-labelledby="sveltekit-toggle-group-label"
  ></toggle-switch-component>
</section>
`.trim();
