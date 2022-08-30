export const managerTranslationsEn = {
  info: {
    clickToDescribe(data: { label: string }): string {
      return `Double click here to describe this ${data.label}`;
    },
    actions: {
      showExamples: 'Show examples',
      done: 'Save',
      cancel: 'Cancel',
    },
    table: {
      id: 'ID',
      created: 'Created',
      updated: 'Updated',
    },
    input: {
      description: {
        helperText: 'Supports markdown',
      },
    },
    error: {
      emptyLabel: 'Label cannot be empty',
    },
  },
};
