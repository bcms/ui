export const homeTranslationsEn = {
  meta: {
    title: 'Home',
  },
  greeting: {
    title: (name: string) => `Hello ${name},`,
    wish: 'Have a nice day at work!',
  },
  newOptions: {
    title: 'Create new',
    template: 'Template',
    widget: 'Widget',
    group: 'Group',
    fileUpload: 'File Upload',
    entry: {
      label: 'Entry',
      dropdown: {
        title: 'Select template',
        seeAll: 'See all',
      },
    },
  },
  search: 'Search',
  stats: {
    title: 'Your stats',
    entries: 'Entries created',
    uploads: 'Megabytes uploaded',
    members: 'Members',
  },
  activity: {
    title: '7-days activity',
    noRecentActivity: 'You don’t have any activity for past 7 days',
  },
  uploads: {
    title: 'Recently uploaded',
    seeAll: 'See all files',
    noRecentUploads: 'You don’t have any recent uploads',
    cta: 'Upload files',
    dropzone: {
      drop: 'Drop files here to upload or',
      select: 'Select files from computer',
      fileSize: 'Maximum file size 100mb',
    },
  },
  members: {
    title: 'Manage members',
    invite: 'Invite a member',
    seeAll: 'See all members',
    noUsers: 'You don’t have any active users now',
  },
  docsAndResources: {
    title: 'Docs and resources',
    documentation: 'Documentation',
    tutorials: 'Tutorials',
    codeStarters: 'Code starters',
  },
  supportAndCommunity: {
    title: 'Support and community',
    contact: 'Contact',
  },
};
