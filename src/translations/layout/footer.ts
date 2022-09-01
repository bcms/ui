export const footerTranslationsEn = {
  help: {
    toggleTitle: 'Help, feedback, and \n keyboard shortcuts',
    updated: 'Updated',
    navigation: [
      {
        title: 'Help & support guide',
        url: 'https://thebcms.com/support',
        level: 1,
        icon: 'file',
      },
      {
        title: 'Send us a message',
        url: 'https://thebcms.com/contact',
        level: 1,
        icon: 'file',
      },
      {
        title: 'Global search',
        action: 'global-search',
        level: 2,
      },
      {
        title(theme: string): string {
          return theme === 'dark' ? 'Light mode' : 'Dark mode';
        },
        action: 'dark-mode',
        level: 2,
      },
      {
        title: "What's new",
        url: 'https://thebcms.com/changelog',
        level: 2,
      },
      {
        title: 'Join us',
        url: 'https://thebcms.com/careers',
        level: 2,
      },
      {
        title: 'Twitter - @thebcms',
        url: 'https://twitter.com/thebcms',
        level: 3,
      },
      {
        title: 'Terms & privacy',
        url: 'https://thebcms.com/privacy-policy',
        level: 3,
      },
      {
        title: 'Status',
        url: 'https://thebcms.com/status',
        level: 3,
      },
    ],
  },
};
