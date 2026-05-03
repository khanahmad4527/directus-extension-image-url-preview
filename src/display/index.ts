import { defineDisplay } from '@directus/extensions-sdk';
import DisplayComponent from './display.vue';

export default defineDisplay({
  id: 'image-url-display',
  name: 'Image URL Preview',
  description: 'Show a small thumbnail of an external image URL in collection lists and table views.',
  icon: 'image',
  component: DisplayComponent,
  types: ['string', 'text'],
  options: [
    {
      field: 'size',
      name: 'Preview Size',
      type: 'string',
      meta: {
        interface: 'select-dropdown',
        width: 'half',
        options: {
          choices: [
            { text: 'Small (24px)', value: 'small' },
            { text: 'Medium (40px)', value: 'medium' },
            { text: 'Large (64px)', value: 'large' }
          ]
        }
      },
      schema: { default_value: 'medium' }
    },
    {
      field: 'shape',
      name: 'Shape',
      type: 'string',
      meta: {
        interface: 'select-dropdown',
        width: 'half',
        options: {
          choices: [
            { text: 'Rounded square', value: 'rounded' },
            { text: 'Circle', value: 'circle' },
            { text: 'Square', value: 'square' }
          ]
        }
      },
      schema: { default_value: 'rounded' }
    }
  ]
});
