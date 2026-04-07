// File: src/stories/autocomplete-single/autocomplete-single.examples.js

export const reactExample = `
import { useEffect, useRef } from 'react'

export default function AutocompleteSingleSelect() {
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
    el.value = 'Apple'
    el.autoSort = true

    const onSelect = (event) => {
      console.log('itemSelect:', event.detail)
    }

    const onValueChange = (event) => {
      console.log('valueChange:', event.detail)
    }

    el.addEventListener('itemSelect', onSelect)
    el.addEventListener('valueChange', onValueChange)

    return () => {
      el.removeEventListener('itemSelect', onSelect)
      el.removeEventListener('valueChange', onValueChange)
    }
  }, [])

  return (
    <main>
      <autocomplete-single
        ref={ref}
        input-id="react-autocomplete-single"
        label="Favorite fruit"
        placeholder="Type to search"
      />
    </main>
  )
}
`.trim();

export const vueExample = `
<template>
  <main>
    <autocomplete-single
      ref="autocompleteEl"
      input-id="vue-autocomplete-single"
      label="Favorite fruit"
      placeholder="Type to search"
    />
  </main>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const autocompleteEl = ref(null)

const onSelect = (event) => {
  console.log('itemSelect:', event.detail)
}

const onValueChange = (event) => {
  console.log('valueChange:', event.detail)
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
  el.value = 'Apple'
  el.autoSort = true

  el.addEventListener('itemSelect', onSelect)
  el.addEventListener('valueChange', onValueChange)
})

onBeforeUnmount(() => {
  autocompleteEl.value?.removeEventListener('itemSelect', onSelect)
  autocompleteEl.value?.removeEventListener('valueChange', onValueChange)
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
      <autocomplete-single
        #autocompleteEl
        input-id="angular-autocomplete-single"
        label="Favorite fruit"
        placeholder="Type to search"
      ></autocomplete-single>
    </main>
  \`,
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('autocompleteEl', { static: true }) autocompleteRef!: ElementRef

  private readonly onSelect = (event: Event) => {
    const customEvent = event as CustomEvent<string>
    console.log('itemSelect:', customEvent.detail)
  }

  private readonly onValueChange = (event: Event) => {
    const customEvent = event as CustomEvent<string>
    console.log('valueChange:', customEvent.detail)
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
    el.value = 'Apple'
    el.autoSort = true

    el.addEventListener('itemSelect', this.onSelect)
    el.addEventListener('valueChange', this.onValueChange)
  }

  ngOnDestroy(): void {
    this.autocompleteRef.nativeElement.removeEventListener('itemSelect', this.onSelect)
    this.autocompleteRef.nativeElement.removeEventListener('valueChange', this.onValueChange)
  }
}
`.trim();
