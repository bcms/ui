import type { BCMSMedia } from '@becomes/cms-sdk/types';
import type { CommandProps, Range } from '@tiptap/core';

export interface SlashCommandData {
  editor: CommandProps;
  range: Range;
}

export interface SlashCommandItem {
  title: string;
  widget?: boolean;
  icon: string;
  image?: BCMSMedia;
  type?: 'primary';
  command: (data: SlashCommandData) => void;
}
