/**
 * @file tutorial.ts
 * @description A lightweight, customizable product tour library.
 * @author Mark Gondelman
 * @credits JSDocs created by Gemini; re-optimized by Junie. JS Code is human-written.
 */
/**
 * Default configuration for the TutorialScreen library.
 */
export interface TutorialOptions {
    BASE_SLEEP: number;
    BASE_SLEEP_EXPOSITION: number;
    BASE_SLEEP_ARROW_ADD: number;
    FAST_SLEEP: number;
    FAST_SLEEP_EXPOSITION: number;
    FAST_SLEEP_ARROW_ADD: number;
    VERTICAL_SPACING: number;
    HORIZONTAL_SPACING: number;
    SHOW_TIP_NAMES: boolean;
    SHOW_TIP_COUNT: boolean;
    SHOW_INTERNAL_NAVIGATION: boolean;
    SHOW_INTERNAL_CLOSE_BUTTON: boolean;
    ADD_SWIPE_ACTIONS: boolean;
    CLOSE_ON_ESCAPE: boolean;
    DEFAULT_T_LINK: string;
    DEFAULT_THEME: string;
    THEME_CLASS_NAME: string;
    DEFAULT_TUTORIAL: TutorialStage[];
}
/**
 * Definition of a single tutorial step.
 */
export interface TutorialStage {
    name?: string;
    content: string;
    target: string | HTMLElement | null;
    themeClassName?: string;
    additionalTipClassName?: string;
    additionalVeilClassName?: string;
    additionalVeilControlClassName?: string;
    preferredLocation?: 'top' | 'bottom' | 'left' | 'right';
    renderTimeout?: number;
    onTipLoad?: () => void;
    onTipClose?: () => void;
    onTipLoadEnd?: () => void;
}
/**
 * TutorialScreen - Core Logic
 */
declare const TutorialScreen: {
    /**
     * Public entry point to launch the tutorial.
     */
    startTutorial: (tutorial: TutorialStage[], options?: Partial<TutorialOptions> | number) => void;
    /** Closes the tutorial. */
    endTutorial: () => void;
    /**
     * Updates options globally.
     */
    setTutorialOptions: (param: Partial<TutorialOptions>) => void;
    /**
     * Sets a callback for when the tutorial finishes or is closed.
     */
    setOnTutorialClose: (fn: () => void) => void;
    /**
     * Manually trigger a tip.
     */
    showTip: (content: string, elemName?: string | HTMLElement | null) => void;
    /** Navigate forward. */
    nextTip: () => void;
    /** Navigate backward. */
    previousTip: () => void;
    /**
     * Forces a recalculation of the tip position.
     */
    reposition: (fast?: boolean) => void;
    /**
     * Sets a custom CSS file path.
     */
    setCSSLink: (path: string, forceEmbed?: boolean) => void;
    /** Returns the current CSS path. */
    getCSSLink: () => string;
};
export { TutorialScreen };
