export const reactExample = `import React from 'react';

import React, { useEffect } from 'react';

export default function Progress() {
  useEffect(() => {
    const progressComp = document.getElementById('progressBarComp');

    if (!progressComp) {
      return undefined;
    }

    let value = 0;

    const interval = window.setInterval(() => {
      value = value >= 100 ? 0 : value + 10;
      progressComp.setAttribute('value', String(value));
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  return (
    <>
      <progress-display-component
        value={45}
        max={100}
        variant="primary"
        show-progress
        label="Upload progress"
      >
        Loading
      </progress-display-component>

      <br />

      <progress-display-component
        id="progressBarComp"
        value={75}
        max={100}
        variant="success"
        show-progress
        label="Upload progress"
        progress-align="right"
      >
        Loading
      </progress-display-component>
    </>
  );
}
`;

export const vueExample = `<template>
  <progress-display-component
    :value="45"
    :max="100"
    variant="primary"
    show-progress
    label="Upload progress"
  >
    Loading
  </progress-display-component>
</template>

<script setup>
</script>
`;

export const angularExample = `import { Component } from '@angular/core';

@Component({
  selector: 'app-progress-example',
  template: \`
    <progress-display-component
      [value]="45"
      [max]="100"
      variant="primary"
      show-progress
      label="Upload progress"
    >
      Loading
    </progress-display-component>
  \`,
})
export class ProgressExampleComponent {}
`;
