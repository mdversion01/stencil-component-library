// File: src/stories/date-range-picker-component/date-range-picker-component.examples.js

export const reactExample = `
import { useEffect, useRef } from 'react'

export default function DateRangePicker() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onUpdate = (event) => {
      console.log('date-range-updated', event.detail)
    }

    el.addEventListener('date-range-updated', onUpdate)

    return () => {
      el.removeEventListener('date-range-updated', onUpdate)
    }
  }, [])

  return (
    <main>
      <date-range-picker-component
        ref={ref}
        input-id="react-date-range"
        label="Select date range"
        join-by=" - "
        date-format="YYYY-MM-DD"
        append-prop
      ></date-range-picker-component>
    </main>
  )
}
`.trim();

export const vueExample = `
<template>
  <main>
    <date-range-picker-component
      ref="pickerRef"
      input-id="vue-date-range"
      label="Select date range"
      join-by=" - "
      date-format="YYYY-MM-DD"
      append-prop
    ></date-range-picker-component>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const pickerRef = ref(null)

onMounted(() => {
  const el = pickerRef.value
  if (!el) return

  el.addEventListener('date-range-updated', (event) => {
    console.log('date-range-updated', event.detail)
  })
})
</script>
`.trim();

export const angularExample = `
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild } from '@angular/core'

@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    <main>
      <date-range-picker-component
        #pickerRef
        input-id="angular-date-range"
        label="Select date range"
        join-by=" - "
        date-format="YYYY-MM-DD"
        append-prop
      ></date-range-picker-component>
    </main>
  \`,
})
export class AppComponent implements AfterViewInit {
  @ViewChild('pickerRef', { static: true }) pickerRef!: ElementRef

  ngAfterViewInit(): void {
    const el = this.pickerRef.nativeElement

    el.addEventListener('date-range-updated', (event: CustomEvent) => {
      console.log('date-range-updated', event.detail)
    })
  }
}
`.trim();
