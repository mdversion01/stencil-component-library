export const reactExample = `
import { useEffect, useRef } from 'react'

export default function PlumageAutocompleteMultipleSelections() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    el.options = [
      'Apple',
      'Banana',
      'Orange',
      'Mango',
      'Blueberry',
      'Strawberry',
    ]
    el.value = ['Apple', 'Mango']

    const onChange = (event) => {
      console.log('multiSelectChange:', event.detail)
    }

    el.addEventListener('multiSelectChange', onChange)

    return () => {
      el.removeEventListener('multiSelectChange', onChange)
    }
  }, [])

  return (
    <main>
      <plumage-autocomplete-multiple-selections-component
        ref={ref}
        input-id="react-acms"
        label="Favorite fruits"
        placeholder="Type to search"
        editable
        add-btn
        badge-variant="primary"
      />
    </main>
  )
}
`.trim();

export const vueExample = `
<template>
  <main>
    <plumage-autocomplete-multiple-selections-component
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
import { onBeforeUnmount, onMounted, ref } from 'vue'

const autocompleteEl = ref(null)

const onChange = (event) => {
  console.log('multiSelectChange:', event.detail)
}

onMounted(() => {
  const el = autocompleteEl.value
  if (!el) return

  el.options = [
    'Apple',
    'Banana',
    'Orange',
    'Mango',
    'Blueberry',
    'Strawberry',
  ]
  el.value = ['Apple', 'Mango']

  el.addEventListener('multiSelectChange', onChange)
})

onBeforeUnmount(() => {
  autocompleteEl.value?.removeEventListener('multiSelectChange', onChange)
})
</script>
`.trim();

export const angularExample = `
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnDestroy, ViewChild } from '@angular/core'

@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <main>
      <plumage-autocomplete-multiple-selections-component
        #autocompleteEl
        input-id="angular-acms"
        label="Favorite fruits"
        placeholder="Type to search"
        editable
        add-btn
        badge-variant="primary"
      ></plumage-autocomplete-multiple-selections-component>
    </main>
  \`,
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('autocompleteEl', { static: true }) autocompleteRef!: ElementRef

  private readonly onChange = (event: Event) => {
    const customEvent = event as CustomEvent<string[]>
    console.log('multiSelectChange:', customEvent.detail)
  }

  ngAfterViewInit(): void {
    const el = this.autocompleteRef.nativeElement

    el.options = [
      'Apple',
      'Banana',
      'Orange',
      'Mango',
      'Blueberry',
      'Strawberry',
    ]
    el.value = ['Apple', 'Mango']

    el.addEventListener('multiSelectChange', this.onChange)
  }

  ngOnDestroy(): void {
    this.autocompleteRef.nativeElement.removeEventListener('multiSelectChange', this.onChange)
  }
}
`.trim();
