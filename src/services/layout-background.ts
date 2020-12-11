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

export type backgroundName = 'pink-yellow' | "pink-green" | "yellow-green" | "green-yellow" | "pink-yellow-green";

let activeBackgroundName: backgroundName = undefined;

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

const colorPairs: Array<
  [
    LayoutName[],
    backgroundName
  ]
> = [
    [["template", 'group', 'widget'], "pink-green"],
    [["media", 'language', 'user', 'key'], "pink-yellow-green"],
    [["dashboard"], "pink-yellow"],
    [["entry-single"], "yellow-green"],
    [["entry-list"], "green-yellow"],
  ]

const animateBackground = (nextBackgroundName: backgroundName) => {

  /**
   * If active and next backgrounds are the same, do nothing.
   *
   * @param   {[backgroundName]}  activeBackgroundName
   * @param   {[backgroundName]}  nextBackgroundName
   *
   */
  if (activeBackgroundName === nextBackgroundName) {
    return;
  }

  /**
   * Fade out active background
   */

  if (activeBackgroundName) {
    gsap.to(`[data-bcms-glow="${activeBackgroundName}"]`, {
      duration: activeBackgroundName ? 2 : 0.1,
      opacity: 0
    })
  }

  /**
   * Fade in next background
   */
  gsap.to(`[data-bcms-glow="${nextBackgroundName}"]`, {
    duration: activeBackgroundName ? 2 : 0.1,
    opacity: 1,
    onComplete: () => {
      /**
       * Set active background to the new value;
       */
      activeBackgroundName = nextBackgroundName;
    }
  })

}

function layoutBackground() {
  return {
    async set() {
      const layoutName: LayoutName = getPathName();
      const nextColorScheme = colorPairs.find(e => e[0].includes(layoutName))[1];
      animateBackground(nextColorScheme)
    }
  }
}

export const LayoutBackground = layoutBackground();