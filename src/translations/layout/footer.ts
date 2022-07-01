export const footerTranslationsEn = {
  help: {
    toggleTitle: 'Help, feedback, and \n keyboard shortcuts',
    support: 'Help & support guide',
    messages: 'Send us a message',
    shortcuts: 'Keyboard shortcuts',
    new: "What's new",
    join: 'Join us',
    terms: 'Terms & privacy',
    status: 'Status',
    version: 'BCMS 2.9.17',
    updatedAt(data: { date: string }): string {
      return `Updated ${data.date} ago`;
    },
  },
};
