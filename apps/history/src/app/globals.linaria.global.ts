import { css } from '@linaria/core';

import { Colors } from '~/design/colors';

export const globals = css`
  :global() {
    :root {
      /** https://forum.figma.com/t/font-in-browser-seem-bolder-than-in-the-figma/24656/6 */
      font-synthesis: none;
      text-rendering: optimizeSpeed;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      font-smooth: never;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    section {
      font-size: 0;
    }

    html,
    body {
      max-width: 100vw;
    }

    body {
      background-color: ${Colors.backgroundPage};
      color: ${Colors.typography.base};
    }

    a,
    button,
    label,
    input {
      -webkit-tap-highlight-color: transparent;
    }
  }
`;
