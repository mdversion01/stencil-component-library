// File: src/stories/checkbox-component/checkbox-component.examples.js

export const reactExample = `
import { useEffect, useRef } from 'react'

export default function CheckboxComponent() {
  const groupRef = useRef(null)
  const singleRef = useRef(null)

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.groupOptions = [
        { inputId: 'react-opt-1', value: 'alpha', labelTxt: 'Alpha' },
        { inputId: 'react-opt-2', value: 'beta', labelTxt: 'Beta', checked: true },
        { inputId: 'react-opt-3', value: 'gamma', labelTxt: 'Gamma' },
      ]
    }

    const single = singleRef.current
    if (!single) return

    const onToggle = (event) => {
      console.log('toggle', event.detail)
    }

    single.addEventListener('toggle', onToggle)
    return () => single.removeEventListener('toggle', onToggle)
  }, [])

  return (
    <main style={{ display: 'grid', gap: '16px' }}>
      <checkbox-component
        ref={singleRef}
        input-id="react-single"
        name="agree"
        label-txt="I agree to the terms"
        value="agree"
      ></checkbox-component>

      <checkbox-component
        ref={groupRef}
        checkbox-group
        name="features"
        group-title="Pick one or more"
        validation
        validation-msg="Select at least one option."
      ></checkbox-component>
    </main>
  )
}
`.trim();

export const vueExample = `
<template>
  <main style="display:grid; gap:16px;">
    <checkbox-component
      ref="singleRef"
      input-id="vue-single"
      name="agree"
      label-txt="I agree to the terms"
      value="agree"
    ></checkbox-component>

    <checkbox-component
      ref="groupRef"
      checkbox-group
      name="features"
      group-title="Pick one or more"
      validation
      validation-msg="Select at least one option."
    ></checkbox-component>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const singleRef = ref(null)
const groupRef = ref(null)

onMounted(() => {
  if (groupRef.value) {
    groupRef.value.groupOptions = [
      { inputId: 'vue-opt-1', value: 'alpha', labelTxt: 'Alpha' },
      { inputId: 'vue-opt-2', value: 'beta', labelTxt: 'Beta', checked: true },
      { inputId: 'vue-opt-3', value: 'gamma', labelTxt: 'Gamma' },
    ]
  }

  singleRef.value?.addEventListener('toggle', (event) => {
    console.log('toggle', event.detail)
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
    <main style="display:grid; gap:16px;">
      <checkbox-component
        #singleRef
        input-id="ng-single"
        name="agree"
        label-txt="I agree to the terms"
        value="agree"
      ></checkbox-component>

      <checkbox-component
        #groupRef
        checkbox-group
        name="features"
        group-title="Pick one or more"
        validation
        validation-msg="Select at least one option."
      ></checkbox-component>
    </main>
  \`,
})
export class AppComponent implements AfterViewInit {
  @ViewChild('singleRef', { static: true }) singleRef!: ElementRef
  @ViewChild('groupRef', { static: true }) groupRef!: ElementRef

  ngAfterViewInit(): void {
    this.groupRef.nativeElement.groupOptions = [
      { inputId: 'ng-opt-1', value: 'alpha', labelTxt: 'Alpha' },
      { inputId: 'ng-opt-2', value: 'beta', labelTxt: 'Beta', checked: true },
      { inputId: 'ng-opt-3', value: 'gamma', labelTxt: 'Gamma' },
    ]

    this.singleRef.nativeElement.addEventListener('toggle', (event: CustomEvent) => {
      console.log('toggle', event.detail)
    })
  }
}
`.trim();
