# TutorialScreen

A lightweight, zero-dependency JavaScript library for creating interactive, step-by-step product tours.

<img width="600" alt="screenshot of the product" src="https://github.com/user-attachments/assets/2fc18ddf-290e-4f3d-9aca-ce95c48427f4" />


Created by **Mark Gondelman**.

## Features

- **Lightweight**: Zero external dependencies for the end-user (Optional Hammer.js support for swipes).
- **Zero-Dependency**: No runtime dependencies required to use the library on your webpage.
- **Customizable**: Control transitions, colors, and positioning via options or CSS.
- **Responsive**: Handles window resizing and maintains target anchoring.
- **Multi-Format**: Distributed as IIFE and ES Modules (minified and non-minified versions included). Available for both JavaScript and TypeScript environments.
- **JavaScript & TypeScript Support**: Choose between `src/tutorial.js` and `src/tutorial.ts`. Both produce the same high-quality bundles.
- **TypeScript Ready**: Includes full type definitions (`.d.ts`) for a better development experience.
- **Lifecycle Hooks**: `onTipLoad` and `onTipClose` hooks for advanced page interaction.
- **Modern Build**: Developed in a single source file and built for multiple environments.

## Installation

You can include the pre-built files from the `dist` folder.

### JavaScript (IIFE)
```html
<link rel="stylesheet" href="styles/tutorial.css">
<!-- Choose between JS-built or TS-built bundles -->
<script src="dist/tutorial.js.min.js"></script>
<!-- OR -->
<script src="dist/tutorial.ts.min.js"></script>
```

### JavaScript / TypeScript (ES Module)
```javascript
// From JavaScript build
import { TutorialScreen } from './dist/tutorial.js.esm.min.js';
// OR from TypeScript build (includes types automatically)
import { TutorialScreen } from './dist/tutorial.ts.esm.min.js';
```

## Quick Start

Define your stages and launch the tour:

```javascript
const myTour = [
    { 
        name: 'Welcome', 
        content: 'Welcome to our app!', 
        target: null // Centered on screen
    },
    { 
        name: 'Dashboard', 
        content: 'This is where you see your data.', 
        target: '#dashboard-id' // Element ID or CSS selector to highlight
    }
];

TutorialScreen.startTutorial(myTour);
```

## Configuration Options

| Option | Default | Description |
| :--- | :--- | :--- |
| `BASE_SLEEP` | `350` | Delay before tip starts moving. |
| `BASE_SLEEP_EXPOSITION` | `550` | Delay after tip moved and before exposition. |
| `BASE_SLEEP_ARROW_ADD` | `560` | Delay before adding the arrow. |
| `FAST_SLEEP` | `50` | Faster delay before tip starts moving. |
| `FAST_SLEEP_EXPOSITION` | `150` | Faster delay after tip moved and before exposition. |
| `FAST_SLEEP_ARROW_ADD` | `260` | Faster delay before adding the arrow. |
| `VERTICAL_SPACING` | `20` | Vertical padding between tip and target. |
| `HORIZONTAL_SPACING` | `20` | Horizontal padding between tip and target. |
| `SHOW_TIP_NAMES` | `true` | Display the stage name in the header. |
| `SHOW_TIP_COUNT` | `true` | Display '1/5' step indicator. |
| `SHOW_INTERNAL_NAVIGATION` | `true` | Show side buttons inside the tip. |
| `SHOW_INTERNAL_CLOSE_BUTTON` | `true` | Show 'x' close button in the tip. |
| `ADD_SWIPE_ACTIONS` | `true` | Enable swipe gestures (requires Hammer.js). |
| `CLOSE_ON_ESCAPE` | `true` | Close tour when Escape key is pressed. |
| `DEFAULT_T_LINK` | `'styles/tutorial.css'` | Default path to the library CSS file. |
| `DEFAULT_THEME` | `'light'` | Default theme applied (internal). |
| `THEME_CLASS_NAME` | `'light'` | Default global theme class name. |
| `DEFAULT_TUTORIAL` | `[...]` | Default stage if none provided to `startTutorial`. |

Update options using:
```javascript
TutorialScreen.setTutorialOptions({ THEME_CLASS_NAME: 'dark-mode' });
```

### Advanced Theming

You can apply different themes and classes to specific stages or elements. 

**Important:** For custom theme classes to be correctly removed during transitions (in between stages), they **must contain the string "theme"** in their class name (e.g., `my-custom-theme`, `theme-dark`, `solarized-theme`).

```javascript
const myTour = [
    {
        name: 'Stage 1',
        content: 'Custom theme for this stage',
        target: '#target', // Element ID or CSS selector to highlight
        themeClassName: 'my-custom-theme' // Overrides global THEME_CLASS_NAME
    },
    {
        name: 'Stage 2',
        content: 'Fine-tuned classes for elements',
        target: '#target2', // Element ID or CSS selector to highlight
        additionalTipClassName: 'special-theme-tip', // Note 'theme' in name
        additionalVeilClassName: 'special-theme-veil',
        additionalVeilControlClassName: 'special-theme-controls'
    }
];
```

### Lifecycle Hooks

#### `onTutorialClose`
Fires when the entire tutorial is closed.

```javascript
TutorialScreen.setOnTutorialClose(() => {
    console.log('User finished the tour!');
});
```

#### `onTipLoad` & `onTipClose`
These hooks can be defined for each stage of the tutorial to handle logic specific to that step.

- **`onTipLoad`**: Executes when the stage starts rendering.
- **`onTipClose`**: Executes when the stage is about to be replaced by the next one or when the tutorial is closed.

```javascript
const myTour = [
    {
        name: 'Interaction',
        content: 'Observe the change!',
        target: '#my-element', // Element ID or CSS selector to highlight
        onTipLoad: () => {
            document.querySelector('#my-element').classList.add('active');
        },
        onTipClose: () => {
            document.querySelector('#my-element').classList.remove('active');
        }
    }
];
```

## Dependencies

- **End-Users**: Zero external dependencies. If you are using the pre-built files from the `dist` folder, you don't need to install anything. Simply include the script and style on your page.
- **Developers**: If you want to modify the source code or re-build the project using Rollup, you will need to install the `devDependencies` listed in `package.json` (Rollup, Babel, Terser, etc.) via `npm install`.

## Development

This project uses **Rollup** for building. Building is only necessary if you plan to modify the library's features.

1. Install development dependencies: `npm install`
2. Build the library: `npm run build`
3. Watch mode for development: `npm run dev`

## Examples

Explore our [interactive examples gallery](examples/index.html) to see TutorialScreen in action.

The `examples` folder contains several demonstrations of how to use the library:

- **Basic**:
    - [Standard IIFE Load](examples/basic/simple.iife.html)
    - [ES Module Load](examples/basic/simple.module.html)
- **Advanced**:
    - [Scripted Interactions](examples/advanced/scripted.html)
    - [Custom Themes (Dark Mode, Global vs Stage)](examples/advanced/custom-theme.html)
    - [Multiple Themes & Fine-tuning (Solarized, Forest)](examples/advanced/multiple-themes.html)
    - [Lifecycle Hooks (onTipLoad, onTipClose)](examples/advanced/hooks-demo.html)

## Contributing
Contributions are welcome! Please see the [CONTRIBUTING.md](CONTRIBUTING.md) file for more information.

## Credits

- **Core JavaScript Engine**: Developed and written by **Mark Gondelman**.
- **Documentation & Examples**: Generated and optimized with LLM-assistance (Google Gemini and **JetBrains Junie** using the `gemini-3-flash-preview` model).

## License
[MIT](LICENSE)
