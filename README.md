# @sandumo/ui

A UI library meant to be used as a git submodule for the Sandumo project.

## Usage

```bash
git submodule add git@github.com:sandumo/ui.git packages/ui
```

```bash
git submodule update --init --recursive
```

Install dependencies

```bash
pnpm i tailwindcss autoprefixer postcss --filter web -D
```

```js
// apps/web/tailwind.config.js

const sharedConfig = require('../../packages/ui/tailwind.config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...sharedConfig,
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    ...sharedConfig.theme,
    extend: {
      ...sharedConfig.theme.extend,
    },
  },
  plugins: [...sharedConfig.plugins],
}
```


```js
// apps/web/postcss.config.js

module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```


Add following line to your `_app.tsx` file

```tsx
import '@sandumo/ui/styles.css';
```
