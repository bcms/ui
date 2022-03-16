import { BCMSMedia } from '@becomes/cms-sdk/types';

export interface SlashCommandItem {
  title: string;
  widget?: boolean;
  icon: string;
  image?: BCMSMedia;
  command: () => void;
}
