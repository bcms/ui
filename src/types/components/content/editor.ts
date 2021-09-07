export interface SlashCommandItem {
  title: string;
  widget?: boolean;
  icon: string;
  command: () => void;
}
