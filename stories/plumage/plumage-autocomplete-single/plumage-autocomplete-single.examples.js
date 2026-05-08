export const reactExample = `
import { useEffect, useRef } from 'react'

export default function PlumageAutocompleteSingle() {
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

    const onItemSelect = (event) => {
      console.log('itemSelect:', event.detail)
    }

    const onValueChange = (event) => {
      console.log('valueChange:', event.detail)
    }

    el.addEventListener('itemSelect', onItemSelect)
    el.addEventListener('valueChange', onValueChange)

    return () => {
      el.removeEventListener('itemSelect', onItemSelect)
      el.removeEventListener('valueChange', onValueChange)
    }
  }, [])

  return (
    <main>
      <plumage-autocomplete-single
        ref={ref}
        input-id="react-acs"
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
    <plumage-autocomplete-single
      ref="autocompleteEl"
      input-id="vue-acs"
      label="Favorite fruit"
      placeholder="Type to search"
    />
  </main>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const autocompleteEl = ref(null)

const onItemSelect = (event) => {
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

  el.addEventListener('itemSelect', onItemSelect)
  el.addEventListener('valueChange', onValueChange)
})

onBeforeUnmount(() => {
  autocompleteEl.value?.removeEventListener('itemSelect', onItemSelect)
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
      <plumage-autocomplete-single
        #autocompleteEl
        input-id="angular-acs"
        label="Favorite fruit"
        placeholder="Type to search"
      ></plumage-autocomplete-single>
    </main>
  \`,
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('autocompleteEl', { static: true }) autocompleteRef!: ElementRef

  private readonly onItemSelect = (event: Event) => {
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

    el.addEventListener('itemSelect', this.onItemSelect)
    el.addEventListener('valueChange', this.onValueChange)
  }

  ngOnDestroy(): void {
    this.autocompleteRef.nativeElement.removeEventListener('itemSelect', this.onItemSelect)
    this.autocompleteRef.nativeElement.removeEventListener('valueChange', this.onValueChange)
  }
}
`.trim();
