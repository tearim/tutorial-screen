/**
 * @file tutorial.ts
 * @description A lightweight, customizable product tour library.
 * @author Mark Gondelman
 * @credits JSDocs created by Gemini; re-optimized by Junie. JS Code is human-written.
 */
const TutorialScreenDefaults = {
  BASE_SLEEP: 350,
  BASE_SLEEP_EXPOSITION: 550,
  BASE_SLEEP_ARROW_ADD: 560,
  FAST_SLEEP: 50,
  FAST_SLEEP_EXPOSITION: 150,
  FAST_SLEEP_ARROW_ADD: 260,
  VERTICAL_SPACING: 20,
  HORIZONTAL_SPACING: 20,
  SHOW_TIP_NAMES: true,
  SHOW_TIP_COUNT: true,
  SHOW_INTERNAL_NAVIGATION: true,
  SHOW_INTERNAL_CLOSE_BUTTON: true,
  ADD_SWIPE_ACTIONS: true,
  CLOSE_ON_ESCAPE: true,
  DEFAULT_T_LINK: 'styles/tutorial.css',
  DEFAULT_THEME: 'light',
  THEME_CLASS_NAME: 'light',
  DEFAULT_TUTORIAL: [{
    name: 'Welcome',
    content: 'Hello there, I\'m a <strong>tutorial</strong><br /><a href="https://w3c.org">link</a>',
    target: null
  }]
};
/**
 * TutorialScreen - Core Logic
 */
const TutorialScreen = function () {
  let stage = 0;
  let tutorialStarted = false;
  let tutorialStages = [];
  let CSSLink = 'styles/tutorial.css';
  let stylesEmbedded = false;
  let veil = document.createElement('div');
  let veilControls = document.createElement('div');
  let unveiler = null;
  let nextButton = null;
  let previousButton = null;
  let highlightedElementPreviousPosition = null;
  let highlightedElem = null;
  let highlightedPosition = null;
  let tipElem = null;
  let tipElemArrow = null;
  let tipArrowDirection = null;
  let tipHeight = null;
  let tipWidth = null;
  let tipTop = 0;
  let tipLeft = 0;
  let onTipClose = null;
  let onTutorialClose = null;
  let tutorialOptions = Object.assign({}, TutorialScreenDefaults);
  /**
   * Initializes and starts the tutorial.
   */
  function start(state = 0, newTutorialStages) {
    embedStyles();
    tutorialStages = newTutorialStages ? newTutorialStages : tutorialOptions.DEFAULT_TUTORIAL;
    stage = state;
    const body = document.getElementsByTagName('body')[0];
    veil.className = 'tutorial_veil';
    veilControls.className = 'tutorial_veil_controls';
    body.append(veilControls);
    body.append(veil);
    tutorialStarted = true;
    stylesReady.then(render);
    if (tutorialOptions.CLOSE_ON_ESCAPE) {
      document.addEventListener('keydown', onKeydown);
    }
  }
  function onKeydown(event) {
    if (event.key == 'Escape' && tutorialStarted) {
      end();
    }
    if (event.key == 'ArrowLeft' && tutorialStarted) {
      previous();
    }
    if (event.key == 'ArrowRight' && tutorialStarted) {
      next();
    }
  }
  /**
   * Ends the tutorial and cleans up the DOM elements.
   */
  function end() {
    if (typeof onTipClose == 'function') {
      onTipClose();
      onTipClose = null;
    }
    if (typeof onTutorialClose == 'function') {
      onTutorialClose();
      onTutorialClose = null;
    }
    veil.remove();
    veilControls.remove();
    removeHighlight();
    removeResizerNScroller();
    tutorialStarted = false;
    document.removeEventListener('keydown', onKeydown);
  }
  /**
   * Advances the tutorial to the next stage.
   */
  function next() {
    if (stage < tutorialStages.length - 1) {
      stage++;
    } else {
      return;
    }
    render();
  }
  /**
   * Returns the tutorial to the previous stage.
   */
  function previous() {
    if (stage > 0) {
      stage--;
    } else {
      return;
    }
    render();
  }
  let stylesReady = Promise.resolve();
  /**
   * Injects the required CSS link into the document head.
   */
  function embedStyles(forceTime = false) {
    if (stylesEmbedded) return;
    let head = document.getElementsByTagName('HEAD')[0];
    document.getElementById('tutorial_screen_styles')?.remove();
    const link = document.createElement('link');
    link.id = 'tutorial_screen_styles';
    link.rel = 'stylesheet';
    link.setAttribute('type', 'text/css');
    link.href = forceTime ? CSSLink + '?time=' + Date.now() : CSSLink;
    stylesReady = new Promise(resolve => {
      link.onload = () => resolve();
      link.onerror = () => resolve();
    });
    head.appendChild(link);
    stylesEmbedded = true;
  }
  /**
   * Merges user-provided parameters into the global options.
   */
  function setOptions(param) {
    if (typeof param != 'object') return;
    tutorialOptions = {
      ...tutorialOptions,
      ...param
    };
  }
  /**
   * Handles the rendering logic for the current tutorial stage.
   */
  function render() {
    if (typeof onTipClose == 'function') {
      onTipClose();
      onTipClose = null;
    }
    if (tutorialStages[stage].onTipClose && typeof tutorialStages[stage].onTipClose == 'function') {
      onTipClose = tutorialStages[stage].onTipClose;
    }
    if (tutorialStages[stage].onTipLoad && typeof tutorialStages[stage].onTipLoad == 'function') {
      tutorialStages[stage].onTipLoad();
    }
    if (typeof tutorialStages[stage].renderTimeout == 'number') {
      setTimeout(renderControlsAndTip, tutorialStages[stage].renderTimeout);
    } else {
      renderControlsAndTip();
    }
    if (tutorialStages[stage].onTipLoadEnd && typeof tutorialStages[stage].onTipLoadEnd == 'function') {
      setTimeout(tutorialStages[stage].onTipLoadEnd, tutorialStages[stage].renderTimeout);
    }
  }
  /**
   * Highlights the target element and creates the content container.
   */
  function _showTip(content, elemName) {
    if (!tutorialStarted) return;
    removeHighlight();
    let elem;
    if (typeof elemName == 'string') {
      elem = document.querySelector(elemName);
    } else {
      elem = elemName;
    }
    if (elem) {
      elem.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      elem.classList.add('highlighted');
      if (getComputedStyle(elem).position === 'static') {
        highlightedElementPreviousPosition = elem.style.position;
        elem.style.position = 'relative';
      }
      highlightedElem = elem;
    }
    const tipContent = document.createElement('div');
    const richContent = new DOMParser().parseFromString('<div>' + content + '</div>', "text/html");
    tipContent.appendChild(richContent.getElementsByTagName('div')[0]);
    prepareContent(tipContent);
    if (tutorialOptions.SHOW_TIP_NAMES || tutorialOptions.SHOW_TIP_COUNT) renderTipTitle();
    setIdealHintPosition();
    if (elem) {
      registerResizerNScroller();
      setTimeout(exposeTip, tutorialOptions.BASE_SLEEP_EXPOSITION);
      setTimeout(addArrow, tutorialOptions.BASE_SLEEP_ARROW_ADD);
    } else {
      setTimeout(exposeTip, 50);
    }
  }
  /**
   * Orchestrates the rendering of navigation controls and the tip.
   */
  function renderControlsAndTip() {
    addTutorialControls();
    _showTip(tutorialStages[stage].content, tutorialStages[stage].target);
    if (tutorialOptions.SHOW_INTERNAL_NAVIGATION) addInternalNavigation();
    if (tutorialOptions.SHOW_INTERNAL_CLOSE_BUTTON) addInternalCloseButton();
  }
  /**
   * Renders the title and step counter inside the tip element.
   */
  function renderTipTitle() {
    if (!tipElem) return;
    const titleElem = document.createElement('div');
    titleElem.className = 'tip_title';
    if (tutorialOptions.SHOW_TIP_NAMES && tutorialStages[stage].name) {
      const titleElemTitle = document.createElement('h1');
      titleElemTitle.textContent = tutorialStages[stage].name;
      titleElem.append(titleElemTitle);
    }
    if (tutorialOptions.SHOW_TIP_COUNT) {
      const titleElemCounting = document.createElement('span');
      titleElemCounting.className = 'counting_span';
      titleElemCounting.textContent = stage + 1 + '/' + tutorialStages.length;
      titleElem.append(titleElemCounting);
    }
    tipElem.prepend(titleElem);
  }
  /**
   * Updates the content of the active tip.
   */
  function setContent(content) {
    if (tipElem === null) return;
    if (typeof content == 'string') {
      tipElem.innerHTML = content;
    } else {
      tipElem.append(content);
    }
  }
  /**
   * Prepares the tip DOM structure and applies custom class names.
   */
  function prepareContent(content) {
    if (tipElem !== null) {
      tipElem.remove();
      tipElem = null;
    }
    tipElem = document.createElement('div');
    setContent(content);
    if (tutorialOptions.ADD_SWIPE_ACTIONS) addSwiper();
    tipElem.className = 'tutorial_tip';
    let currentTheme = typeof tutorialStages[stage].themeClassName == 'string' ? tutorialStages[stage].themeClassName : tutorialOptions.THEME_CLASS_NAME;
    _applyThemedClassesToElement(tipElem, currentTheme);
    if (typeof tutorialStages[stage].additionalTipClassName != 'undefined') {
      _applyThemedClassesToElement(tipElem, tutorialStages[stage].additionalTipClassName);
    }
    if (typeof tutorialStages[stage].additionalVeilClassName != 'undefined') {
      _applyThemedClassesToElement(veil, tutorialStages[stage].additionalVeilClassName);
    } else {
      _applyThemedClassesToElement(veil, currentTheme);
    }
    if (typeof tutorialStages[stage].additionalVeilControlClassName != 'undefined') {
      _applyThemedClassesToElement(veilControls, tutorialStages[stage].additionalVeilControlClassName);
    } else {
      _applyThemedClassesToElement(veilControls, currentTheme);
    }
    veil.append(tipElem);
  }
  /**
   * Internal function to apply custom class names to elements.
   */
  function _applyThemedClassesToElement(elem, classes) {
    _removeThemedClasses(elem);
    if (typeof classes == 'string') {
      if (classes.includes(' ')) {
        let classesArray = classes.split(' ');
        for (let i = 0; i < classesArray.length; i++) {
          if (typeof classesArray[i] == 'string' && classesArray[i].trim() !== '') {
            elem.classList.add(classesArray[i].trim());
          }
        }
      } else {
        elem.classList.add(classes);
      }
    }
  }
  function _removeThemedClasses(elem) {
    if (typeof elem == 'undefined') return;
    if (typeof elem.classList == 'undefined') return;
    elem.classList.forEach(className => {
      if (className.includes('theme')) {
        elem.classList.remove(className);
      }
    });
  }
  /**
   * Calculates the optimal position for the tip relative to the target element.
   */
  function setIdealHintPosition() {
    if (!tipElem) return;
    if (!highlightedElem) {
      tipElem.classList.add('general');
      tipArrowDirection = null;
      return;
    }
    tipElem.style.top = '';
    tipElem.style.bottom = '';
    tipElem.style.right = '';
    tipElem.style.left = '';
    tipElem.style.width = '';
    highlightedPosition = highlightedElem.getBoundingClientRect();
    const topSpace = highlightedPosition.top / window.innerHeight;
    let biggestSpaceName = 'top';
    let biggestSpace = topSpace;
    const bottomSpace = 1 - highlightedPosition.bottom / window.innerHeight;
    if (bottomSpace > topSpace) {
      biggestSpaceName = 'bottom';
      biggestSpace = bottomSpace;
    }
    const leftSpace = highlightedPosition.left / window.innerWidth;
    if (leftSpace > biggestSpace) {
      biggestSpaceName = 'left';
      biggestSpace = leftSpace;
    }
    const rightSpace = 1 - highlightedPosition.right / window.innerWidth;
    if (rightSpace > biggestSpace) {
      biggestSpaceName = 'right';
    }
    if (typeof tutorialStages[stage].preferredLocation == 'string') {
      biggestSpaceName = tutorialStages[stage].preferredLocation;
    }
    tipWidth = tipElem.clientWidth;
    tipHeight = tipElem.clientHeight;
    switch (biggestSpaceName) {
      case 'top':
        tipTop = highlightedPosition.top - tutorialOptions.VERTICAL_SPACING;
        tipElem.style.top = tipTop - tipHeight + 'px';
        placeVertical(biggestSpaceName);
        break;
      case 'bottom':
        tipTop = highlightedPosition.bottom + tutorialOptions.VERTICAL_SPACING;
        tipElem.style.top = tipTop + 'px';
        placeVertical(biggestSpaceName);
        break;
      case 'left':
        tipLeft = highlightedPosition.left - tipWidth - tutorialOptions.HORIZONTAL_SPACING;
        if (tipLeft <= 0) {
          tipElem.style.width = highlightedPosition.left - 10 - tutorialOptions.HORIZONTAL_SPACING + 'px';
          tipLeft = 10;
        }
        tipElem.style.left = tipLeft + 'px';
        placeHorizontal(biggestSpaceName);
        break;
      case 'right':
        tipLeft = highlightedPosition.right + tutorialOptions.HORIZONTAL_SPACING;
        tipElem.style.left = tipLeft + 'px';
        placeHorizontal(biggestSpaceName);
        break;
    }
  }
  /**
   * Positions the tip horizontally when space is optimal on the left or right.
   */
  function placeHorizontal(biggestSpaceName) {
    if (!tipElem || !highlightedPosition) return;
    tipArrowDirection = biggestSpaceName == 'right' ? 'left' : 'right';
    let calcTop = Math.max(10, highlightedPosition.top + highlightedPosition.height / 2 - tipElem.clientHeight / 2);
    calcTop = calcTop + tipElem.clientHeight > window.innerHeight - 10 ? 'use_bottom' : calcTop;
    if (calcTop == 'use_bottom') {
      tipElem.style.bottom = '10px';
    } else {
      tipElem.style.top = calcTop + 'px';
    }
  }
  /**
   * Positions the tip vertically when space is optimal on the top or bottom.
   */
  function placeVertical(biggestSpaceName) {
    if (!tipElem || !highlightedPosition) return;
    tipArrowDirection = biggestSpaceName == 'bottom' ? 'up' : 'down';
    let calcLeft = Math.max(10, highlightedPosition.left + highlightedPosition.width / 2 - tipElem.clientWidth / 2);
    calcLeft = calcLeft + tipElem.clientWidth > window.innerWidth - 10 ? 'use_right' : calcLeft;
    if (calcLeft == 'use_right') {
      tipElem.style.right = '10px';
    } else {
      tipElem.style.left = calcLeft + 'px';
    }
  }
  /**
   * Adds a directional arrow to the tip pointing to the highlighted element.
   */
  function addArrow() {
    if (!tipArrowDirection || !tipElem || !highlightedPosition) return;
    if (tipElemArrow) {
      tipElemArrow.remove();
      tipElemArrow = null;
    }
    tipElemArrow = document.createElement('div');
    tipElemArrow.className = 'arrow ' + tipArrowDirection;
    switch (tipArrowDirection) {
      case 'left':
      case 'right':
        tipElemArrow.style.top = highlightedPosition.top + highlightedPosition.height / 2 - tipElem.offsetTop - 7 + 'px';
        break;
      case 'up':
      case 'down':
        tipElemArrow.style.left = highlightedPosition.left + highlightedPosition.width / 2 - tipElem.offsetLeft - 5 + 'px';
        break;
    }
    tipElem.append(tipElemArrow);
  }
  /**
   * Creates and attaches the global tutorial control buttons (Close, Next, Prev).
   */
  function addTutorialControls() {
    if (unveiler) unveiler.remove();
    if (nextButton) nextButton.remove();
    if (previousButton) previousButton.remove();
    unveiler = document.createElement('div');
    nextButton = document.createElement('div');
    previousButton = document.createElement('div');
    unveiler.className = 'button close';
    unveiler.textContent = 'x';
    unveiler.addEventListener('click', () => end());
    veilControls.append(unveiler);
    nextButton.className = 'button next';
    if (stage >= tutorialStages.length - 1) nextButton.classList.add('disabled');
    const captionN = document.createElement('span');
    captionN.className = 'caption';
    captionN.textContent = 'Δ';
    nextButton.append(captionN);
    nextButton.addEventListener('click', () => next());
    veilControls.append(nextButton);
    previousButton.className = 'button previous';
    if (!stage) previousButton.classList.add('disabled');
    const captionP = document.createElement('span');
    captionP.className = 'caption';
    captionP.textContent = 'Δ';
    previousButton.append(captionP);
    previousButton.addEventListener('click', () => previous());
    veilControls.append(previousButton);
  }
  /**
   * Adds navigation elements inside the tip itself.
   */
  function addInternalNavigation() {
    if (!tutorialStarted || !tipElem) return;
    let previousNavButton = document.createElement('div');
    let nextNavButton = document.createElement('div');
    previousNavButton.className = 'side_button previous';
    const captionP = document.createElement('span');
    captionP.className = 'caption';
    captionP.textContent = 'Δ';
    previousNavButton.append(captionP);
    previousNavButton.onclick = previous;
    nextNavButton.className = 'side_button next';
    const captionN = document.createElement('span');
    captionN.className = 'caption';
    captionN.textContent = 'Δ';
    nextNavButton.append(captionN);
    nextNavButton.onclick = next;
    if (stage >= tutorialStages.length - 1) nextNavButton.classList.add('disabled');
    if (!stage) previousNavButton.classList.add('disabled');
    tipElem.append(previousNavButton);
    tipElem.append(nextNavButton);
  }
  function addInternalCloseButton() {
    if (!tutorialStarted || !tipElem) return;
    const closeButton = document.createElement('div');
    closeButton.className = 'side_button close';
    closeButton.textContent = 'x';
    closeButton.onclick = end;
    tipElem.append(closeButton);
  }
  /**
   * Initializes swipe gesture support if Hammer.js is detected.
   */
  function addSwiper() {
    if (!tipElem) return;
    // @ts-ignore
    if (typeof Hammer != 'function') return;
    // @ts-ignore
    let mc = new Hammer(tipElem);
    mc.get('swipe').set({
      direction: window.Hammer.DIRECTION_ALL
    });
    mc.on("swipeleft swiperight swipedown ", ev => {
      switch (ev.type) {
        case 'swipedown':
          end();
          break;
        case 'swipeleft':
          next();
          break;
        case 'swiperight':
          previous();
          break;
      }
    });
  }
  /** Hides the tip element. */
  function hideTip() {
    if (tipElem) tipElem.classList.remove('exposed');
  }
  /** Shows the tip element. */
  function exposeTip() {
    if (tipElem) tipElem.classList.add('exposed');
  }
  /**
   * Cleans up highlighting and custom positioning from target elements.
   */
  function removeHighlight() {
    if (highlightedElem) {
      if (highlightedElementPreviousPosition !== null) {
        highlightedElem.style.position = highlightedElementPreviousPosition;
        highlightedElementPreviousPosition = null;
      }
      highlightedElem.classList.remove('highlighted');
      highlightedElem = null;
    }
    if (tipElem) {
      tipElem.remove();
      tipElem = null;
    }
    if (tipElemArrow) {
      tipElemArrow.remove();
      tipElemArrow = null;
    }
  }
  /** Registers the window resize listener. */
  function registerResizerNScroller() {
    window.addEventListener('resize', resizer);
    window.addEventListener('orientationchange', resizer);
    window.addEventListener('scroll', resizer);
  }
  /** Removes the window resize listener. */
  function removeResizerNScroller() {
    window.removeEventListener('resize', resizer);
    window.removeEventListener('orientationchange', resizer);
    window.removeEventListener('scroll', resizer);
  }
  let currentResizeNScrollTimer = null;
  let currentResizeNScrollTimerHelper = null;
  let currentResizeNScrollTimerHelperArrow = null;
  /**
   * Handles window resize events to keep the tip anchored to the target.
   */
  function resizer(fast = false) {
    if (!highlightedElem) return;
    if (!(typeof fast == 'boolean' && fast)) hideTip();
    if (currentResizeNScrollTimer) {
      clearTimeout(currentResizeNScrollTimer);
      clearTimeout(currentResizeNScrollTimerHelper);
      clearTimeout(currentResizeNScrollTimerHelperArrow);
    }
    const sleep = typeof fast == 'boolean' && fast ? 'FAST_SLEEP' : 'BASE_SLEEP';
    const expo = typeof fast == 'boolean' && fast ? 'FAST_SLEEP_EXPOSITION' : 'BASE_SLEEP_EXPOSITION';
    const arrow = typeof fast == 'boolean' && fast ? 'FAST_SLEEP_ARROW_ADD' : 'BASE_SLEEP_ARROW_ADD';
    currentResizeNScrollTimer = setTimeout(setIdealHintPosition, tutorialOptions[sleep]);
    currentResizeNScrollTimerHelper = setTimeout(exposeTip, tutorialOptions[expo]);
    currentResizeNScrollTimerHelperArrow = setTimeout(addArrow, tutorialOptions[arrow]);
  }
  return {
    /**
     * Public entry point to launch the tutorial.
     */
    startTutorial: function (tutorial, options = {}) {
      let startNum = 0;
      if (typeof options == 'object') {
        if (typeof options.START == 'number') {
          startNum = options.START;
          delete options.START;
        }
        setOptions(options);
      } else if (typeof options == 'number') {
        startNum = options;
      }
      start(startNum, tutorial);
    },
    /** Closes the tutorial. */
    endTutorial: () => end(),
    /**
     * Updates options globally.
     */
    setTutorialOptions: param => setOptions(param),
    /**
     * Sets a callback for when the tutorial finishes or is closed.
     */
    setOnTutorialClose: fn => {
      if (typeof fn == 'function') onTutorialClose = fn;
    },
    /**
     * Manually trigger a tip.
     */
    showTip: (content, elemName = null) => _showTip(content, elemName),
    /** Navigate forward. */
    nextTip: () => next(),
    /** Navigate backward. */
    previousTip: () => previous(),
    /**
     * Forces a recalculation of the tip position.
     */
    reposition: (fast = false) => resizer(fast),
    /**
     * Sets a custom CSS file path.
     */
    setCSSLink: (path, forceEmbed = true) => {
      CSSLink = path;
      if (forceEmbed) {
        stylesEmbedded = false;
        embedStyles(false);
      }
    },
    /** Returns the current CSS path. */
    getCSSLink: () => CSSLink
  };
}();

export { TutorialScreen };
