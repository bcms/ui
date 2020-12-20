export default {
  name: '#Label',
  description: '.CodeMirror-line > span',
  addItem: '.bcmsModal--actions > .bcmsButton_primary',
  createdTitle: '.managerInfo--title',
  createdDescription: '[data-cy=description-double-click] > p',
  editTemplate: '[data-cy=edit-button] > svg',
  properties: '.managerPropsEditor--list',
  addProperty: '[data-cy=add-prop-button]',
  newProperty: '.bcmsModal--property',
  required: ':nth-child(2) > ._bcmsInput > ._bcmsInput--inner > ._bcmsInput--toggle > ._bcmsInput--toggle-inner',
  arrayOption: '.bcmsModal--property > :nth-child(1) > :nth-child(3)',
  array: ':nth-child(3) > ._bcmsInput > ._bcmsInput--inner > ._bcmsInput--toggle',
}