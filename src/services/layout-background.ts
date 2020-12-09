import { gsap } from "gsap";
export interface LayoutBackgroundPrototype {
  set(): void;
}

export type LayoutName = "template"
  | "group"
  | "widget"
  | "media"
  | "language"
  | "user"
  | "entry-single"
  | "entry-list"
  | "dashboard"
  | "key";

export type colorScheme = [string, string, string, string, string, string];

const getPathName = (): LayoutName => {
  const path = window.location.pathname;
  if (path.includes('template/editor')) { return 'template' }
  else if (path.includes('group/editor')) { return 'group' }
  else if (path.includes('widget/editor')) { return 'widget' }
  else if (path.includes('media/editor')) { return 'media' }
  else if (path.includes('language/editor')) { return 'language' }
  else if (path.includes('user/editor')) { return 'user' }
  else if (path.includes('key/editor')) { return 'key' }
  else if (path.includes('/entry/-')) { return 'entry-single' }
  else if (path.includes('/entry')) { return 'entry-list' }
  else { return 'dashboard' }
}

const colorSchemes: Array<
  [
    LayoutName[],
    colorScheme
  ]
> = [
    [["template", 'group', 'widget'], ["#F8C8C5", "#F8C8C5", "#249681", "#249681", "#F8C8C5", "#F8C8C5"]],
    [["media", 'language', 'user', 'key'], ["#FFCD19", "#F8C8C5", "#F8C8C5", "#F8C8C5", "#F8C8C5", "#FFCD19"]],
    [["dashboard"], ["#F8C8C5", "#F8C8C5", "#F8C8C5", "#FFCD19", "#FFCD19", "#ffc68e"]],
    [["entry-single"], ["#FFCD19", "#FFCD19", "#249681", "#249681", "#FFCD19", "#FFCD19"]],
    [["entry-list"], ["#fef6d2", "#249681", "#FFCD19", "#FFCD19", "#fef6d2", "#fef6d2"]],
  ]

const animateBackground = (colorScheme: colorScheme) => {
  colorScheme.forEach((color, index) => {
    const vars = {};
    vars[`--gradient-stop-${index + 1}`] = color
    gsap.to("html", { ...vars, duration: 3 });
  })
}

function layoutBackground() {
  return {
    async set() {
      const layoutName: LayoutName = getPathName();
      const nextColorScheme = colorSchemes.find(e => e[0].includes(layoutName))[1];
      animateBackground(nextColorScheme)
    }
  }
}

export const LayoutBackground = layoutBackground();