import { defineInterface } from '@directus/extensions-sdk';
import InterfaceComponent from './interface.vue';

export default defineInterface({
  id: 'image-url-interface',
  name: 'Image URL Preview',
  description: 'Preview any external image URL inside the form view, with loading state, error fallback and optional lightbox.',
  icon: 'image',
  component: InterfaceComponent,
  types: ['string', 'text'],
  group: 'presentation',
  options: [
    {
      field: 'editable',
      name: 'Allow Editing The URL',
      type: 'boolean',
      meta: {
        interface: 'boolean',
        width: 'half',
        options: { label: 'Show URL input field above preview' }
      },
      schema: { default_value: true }
    },
    {
      field: 'height',
      name: 'Preview Height',
      type: 'string',
      meta: {
        interface: 'input',
        width: 'half',
        options: { placeholder: 'e.g. 300px or 50vh' }
      },
      schema: { default_value: '300px' }
    },
    {
      field: 'fit',
      name: 'Object Fit',
      type: 'string',
      meta: {
        interface: 'select-dropdown',
        width: 'half',
        options: {
          choices: [
            { text: 'Contain', value: 'contain' },
            { text: 'Cover', value: 'cover' },
            { text: 'Fill', value: 'fill' },
            { text: 'None', value: 'none' },
            { text: 'Scale Down', value: 'scale-down' }
          ]
        }
      },
      schema: { default_value: 'contain' }
    },
    {
      field: 'radius',
      name: 'Border Radius',
      type: 'string',
      meta: {
        interface: 'input',
        width: 'half',
        options: { placeholder: 'e.g. 8px' }
      },
      schema: { default_value: '8px' }
    },
    {
      field: 'enable_lightbox',
      name: 'Click To Enlarge',
      type: 'boolean',
      meta: {
        interface: 'boolean',
        width: 'full',
        options: { label: 'Open a full-size lightbox when the preview is clicked' }
      },
      schema: { default_value: true }
    }
  ]
});
