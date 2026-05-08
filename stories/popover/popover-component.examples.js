export const reactExample = `import { useEffect } from 'react';

export default function Popover() {
  useEffect(() => {
    import('stencil-component-library/loader').then(({ defineCustomElements }) => {
      defineCustomElements(window);
    });
  }, []);

  return (
    <popover-component
      title="Popover title"
      content="This is a popover."
      trigger="click"
      placement="bottom"
    >
      <button className="btn btn-primary">Open popover</button>
    </popover-component>
  );
}
`;

export const vueExample = `<template>
  <popover-component
    title="Popover title"
    content="This is a popover."
    trigger="click"
    placement="bottom"
  >
    <button class="btn btn-primary">Open popover</button>
  </popover-component>
</template>

<script setup>
import { onMounted } from 'vue';
import { defineCustomElements } from 'stencil-component-library/loader';

onMounted(() => {
  defineCustomElements(window);
});
</script>
`;

export const angularExample = `import { Component } from '@angular/core';

@Component({
  selector: 'app-popover-example',
  template: \`
    <popover-component
      title="Popover title"
      content="This is a popover."
      trigger="click"
      placement="bottom"
    >
      <button class="btn btn-primary">Open popover</button>
    </popover-component>
  \`,
})
export class PopoverExampleComponent {}
`;
