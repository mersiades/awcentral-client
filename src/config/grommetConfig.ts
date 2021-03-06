import { FC } from 'react';
import { rgba } from 'polished';
import { deepMerge } from 'grommet/utils';
import { grommet } from 'grommet/themes/grommet';
import styled, { css } from 'styled-components';
import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  Heading,
  HeadingProps,
  Paragraph,
  ParagraphProps,
  Text,
  TextInput,
  TextInputProps,
  TextProps,
} from 'grommet';
import { Close, IconProps } from 'grommet-icons';

import '../assets/styles/main.css';

export const brandColor = '#CD3F3E';

export const accentColors = ['#698D70', '#CFCBBC', '#D66667', '#E0C5B6'];
export const neutralColors = ['#4C684C', '#B1BAA3', '#614134', '#967F6B'];
const statusColors = {
  critical: '#FF4040',
  error: '#FF4040',
  warning: '#FFAA15',
  ok: '#00C781',
  unknown: '#CCCCCC',
  disabled: '#CCCCCC',
};
const darkColors = ['#333333', '#555555', '#777777', '#999999', '#999999', '#999999'];
const lightColors = ['#F8F8F8', '#F2F2F2', '#EDEDED', '#DADADA', '#DADADA', '#DADADA'];
const focusColor = accentColors[0];

const colors = {
  active: rgba(221, 221, 221, 0.5),
  'background-back': {
    dark: '#33333308',
    light: '#EDEDED',
  },
  'background-front': {
    dark: '#444444',
    light: '#FFFFFF',
  },
  'background-contrast': {
    dark: '#33333308',
    light: '#FFFFFF08',
  },
  'active-background': 'background-contrast',
  'active-text': 'text-strong',
  black: '#000000',
  border: {
    dark: rgba(255, 255, 255, 0.33),
    light: rgba(0, 0, 0, 0.33),
  },
  brand: brandColor,
  control: {
    dark: 'white',
    light: 'black',
  },
  focus: focusColor,
  'graph-0': 'accent-1',
  'graph-1': 'neutral-1',
  'graph-2': 'neutral-2',
  'graph-3': 'neutral-3',
  'graph-4': 'neutral-4',
  placeholder: '#AAAAAA',
  selected: 'brand',
  text: {
    dark: 'white',
    light: 'black',
  },
  'text-strong': {
    dark: '#FFFFFF',
    light: '#000000',
  },
  'text-weak': {
    dark: '#CCCCCC',
    light: '#555555',
  },
  'text-xweak': {
    dark: '#BBBBBB',
    light: '#666666',
  },
  icon: {
    dark: '#f8f8f8',
    light: '#666666',
  },
  'selected-background': 'brand',
  'selected-text': 'text-strong',
  white: '#FFFFFF',
};

const colorArray = (array: string[], prefix: string) =>
  array.forEach((color, index) => {
    // @ts-ignore
    colors[`${prefix}-${index + 1}`] = color;
  });

colorArray(accentColors, 'accent');
colorArray(darkColors, 'dark');
colorArray(lightColors, 'light');
colorArray(neutralColors, 'neutral');
Object.keys(statusColors).forEach((color) => {
  // @ts-ignore
  colors[`status-${color}`] = statusColors[color];
});

const baseSpacing = 24;
const scale = 6;

const fontSizing = (factor: number) => {
  const baseFontSize = baseSpacing * 0.75; // 18
  const fontScale = baseSpacing / scale; // 4

  return {
    size: `${baseFontSize + factor * fontScale}px`,
    height: `${baseSpacing + factor * fontScale}px`,
    // maxWidth chosen to be ~50 characters wide
    // see: https://ux.stackexchange.com/a/34125
    maxWidth: `${baseSpacing * (baseFontSize + factor * fontScale)}px`,
  };
};

export const theme = (vtksReady: boolean) => {
  return deepMerge(grommet, {
    global: {
      font: {
        family: "'chaparral pro', sans-serif",
        size: '18px',
        height: '20px',
      },
      colors,
      hover: {
        background: {
          color: 'accent-1',
          opacity: '100%',
        },
      },
    },
    button: {
      text: {
        large: {
          size: 36,
        },
      },
      size: {
        small: {
          border: {
            radius: '0px',
          },
        },
        medium: {
          border: {
            radius: '0px',
          },
        },
        large: {
          border: {
            radius: '0px',
          },
        },
      },
      border: {
        width: '0px',
        radius: 0,
      },
      color: {
        dark: 'black',
        light: 'white',
      },
      default: {
        color: {
          dark: 'accent-1',
          light: 'neutral-1',
        },
        background: {
          color: {
            dark: 'black',
            light: 'white',
          },
          opacity: 100,
        },
        border: {
          color: 'accent-1',
          width: '2px',
        },
      },
      primary: {
        color: {
          dark: 'white',
          light: 'white',
        },
        background: {
          color: {
            dark: brandColor,
            light: brandColor,
          },
          opacity: 100,
        },
        border: {
          color: 'brand',
          width: '2px',
        },
      },
      secondary: {
        color: {
          dark: 'brand',
          light: 'brand',
        },
        border: {
          color: 'brand',
          width: '2px',
        },
      },
      hover: {
        primary: {
          border: {
            color: {
              dark: 'white',
              light: 'brand',
            },
            width: '2px',
          },
          color: {
            dark: 'white',
            light: 'white',
          },
          background: {
            dark: 'brand',
            light: 'accent-3',
          },
          extend: 'font-weight: 500;',
        },
        secondary: {
          border: {
            color: {
              dark: 'white',
              light: 'brand',
            },
            width: '2px',
          },
          color: {
            dark: 'white',
            light: 'white',
          },
          background: {
            light: 'accent-3',
          },
          extend: 'font-weight: 500;',
        },
        border: {
          color: {
            dark: 'white',
            light: 'neutral-1',
          },
          width: '2px',
        },
        color: {
          dark: 'white',
          light: 'neutral-1',
        },
        extend: 'font-weight: 500;',
      },

      extend: vtksReady
        ? "font-family: 'Vtks good luck for you', sans-serif; font-size: 36px; line-height: 36px;"
        : 'font-family: sans-serif; font-size: 28px; line-height: 36px; font-weight: 600; letter-spacing: -3px;',
    },
    textInput: {
      suggestions: {
        extend: `
          & button {
            font-family: 'chaparral pro', sans-serif;
            text-shadow: 0 0 1px #000, 0 0 3px #000;
            font-weight: 600;
            margin: 0px;
            font-size: 18px;
            line-height: 24px;
          }
        `,
      },
    },
    heading: {
      font: {
        family: 'crust_clean',
      },
      level: {
        1: {
          font: {
            family: 'Vtks good luck for you',
            weight: 500,
          },
          small: { ...fontSizing(4) },
          medium: { ...fontSizing(8) },
          large: { ...fontSizing(16) },
          xlarge: { ...fontSizing(24) },
        },
        2: {
          font: {
            family: 'crust_clean',
            weight: 500,
          },
          small: { ...fontSizing(2) },
          medium: { ...fontSizing(4) },
          large: { ...fontSizing(8) },
          xlarge: { ...fontSizing(12) },
        },
        3: {
          font: {
            family: 'crust_clean',
            weight: 500,
          },
          small: { ...fontSizing(1) },
          medium: { ...fontSizing(2) },
          large: { ...fontSizing(4) },
          xlarge: { ...fontSizing(6) },
        },
        4: {
          font: {
            family: 'chaparral pro',
            weight: 700,
          },
          small: { ...fontSizing(0) },
          medium: { ...fontSizing(0) },
          large: { ...fontSizing(0) },
          xlarge: { ...fontSizing(0) },
        },
      },
    },
    layer: {
      border: {
        radius: 'unset',
      },
    },
    tab: {
      active: {
        color: { dark: 'white', light: 'black' },
        // background: undefined,
      },
      border: {
        side: 'bottom',
        size: 'medium',
        color: {
          dark: 'accent-1',
          light: 'black',
        },
        active: {
          color: {
            dark: 'white',
            light: 'neutral-1',
          },
        },
      },

      margin: {
        vertical: 'small',
        horizontal: 'medium',
      },
      pad: {
        bottom: 'xsmall',
      },
      extend: `
      font-size: 36px;
      font-family: 'crust_clean', sans-serif;
      line-height: normal;
      text-shadow: 0 0 1px #000, 0 0 3px #000, 0 0 5px #000;
    `,
    },
    tip: {
      content: {
        // any Box props
        background: {
          color: neutralColors[1],
          dark: false,
        },
        elevation: 'small',
        margin: 'xsmall',
        pad: { vertical: 'xsmall', horizontal: 'small' },
        round: 'small',
        style: { boxShadow: '0 0 1px 1px #000, 0 0 5px 3px #000' },
      },
      drop: {
        // any props for the drop
        align: { top: 'bottom' }, // most common use case is Header with Buttons
      },
    },
    select: {
      background: 'transparent',
      container: {
        extend: `
        & button {
          font-family: 'chaparral pro', sans-serif;
          text-shadow: 0 0 1px #000, 0 0 3px #000;
          font-weight: 600;
        }
        `,
      },
      control: {
        extend: `
        font-family: 'chaparral pro', sans-serif;
        background: transparent;
        width: 100%;
        & input {
          text-shadow: 0 0 1px #000, 0 0 3px #000;
          font-size: 26px;
          margin-top: 4px;
        }
        
        `,
        // open: undefined,
      },
      options: {
        container: {
          align: 'start',
          pad: '12px',
        },
        text: {
          margin: 'none',
        },
      },
    },
  });
};

export const customDefaultButtonStyles = deepMerge(grommet, {
  button: {
    default: {
      color: {
        dark: 'white',
        light: 'black',
      },
      background: {
        color: {
          dark: neutralColors[0],
          light: neutralColors[0],
        },
        opacity: 100,
      },
      border: 'none',
    },
    hover: {
      border: 'none',
      backgroundColor: `${accentColors[0]}`,
      extend: 'font-weight: 500; font-size: 18px;',
    },
    extend: `
    font-family: 'crust_clean', sans-serif;
    font-size: 18px;
    line-height: 24px;
    color: #fff;
    &:hover {
      background-color: ${accentColors[0]};
      color: #fff;
    };
    &:focus {
      outline: 0;
      box-shadow: none;
      background-color: ${accentColors[0]};
    }
    `,
  },
});

export const customTabStyles = deepMerge(grommet, {
  text: {
    medium: '36px',
  },
  tab: {
    color: '#FFF',
    hover: {
      color: '#FFF',
    },
    active: {
      color: '#FFF',
    },
    border: {
      side: 'bottom',
      size: 'small',
      color: {
        dark: 'rgba(255, 255, 255, 0.10)',
        // "light": "brand"
      },
      active: {
        color: {
          dark: '#FFF',
          // light: 'black',
        },
      },
      disabled: {},
      hover: {
        color: {
          dark: accentColors[0],
          // light: 'black',
        },
      },
    },
    extend: `
      font-size: 36px;
      font-family: 'crust_clean', sans-serif;
      line-height: normal;
      text-shadow: 0 0 1px #000, 0 0 3px #000, 0 0 5px #000;
    `,
  },
  button: {
    extend: `
    &:focus {
      outline: 0;
      box-shadow: none;
    }
    `,
  },
});

export const background = {
  color: 'black',
  dark: true,
  size: 'contain',
  image: 'url(/images/cover-background.jpg)',
};

export const CustomUL = styled.ul`
  margin: unset;
  overflow-y: auto;
  width: 100%;
  align-self: inherit;
  list-style-type: none;
  padding: 0;
  &::-webkit-scrollbar {
    display: none;
  }
`;

// Renders Grommet Heading with black text shadow
export const HeadingWS = styled(
  Heading as React.FC<
    HeadingProps &
      JSX.IntrinsicElements['h1'] &
      JSX.IntrinsicElements['h2'] &
      JSX.IntrinsicElements['h3'] &
      JSX.IntrinsicElements['h4'] &
      JSX.IntrinsicElements['h5'] &
      JSX.IntrinsicElements['h6'] & { vtksReady?: boolean; crustReady?: boolean }
  >
)(({ level, vtksReady, crustReady }) => {
  const setFontFamily = () => {
    switch (level) {
      case 1:
        return vtksReady ? null : 'sans serif';
      case 2:
        return crustReady ? null : 'sans serif';
      case 3:
        return crustReady ? null : 'sans serif';
    }
  };

  const setFontWeight = () => {
    switch (level) {
      case 1:
        return vtksReady ? null : 600;
      case 2:
      // Deliberately falls through
      case 3:
        return crustReady ? null : 600;
    }
  };

  const setFontSize = () => {
    switch (level) {
      case 1:
        return vtksReady ? null : '28px';
      case 2:
        return crustReady ? null : '30px';
      case 3:
        return crustReady ? null : '24px';
    }
  };

  const setLetterSpacing = () => {
    switch (level) {
      case 1:
        return vtksReady ? null : '-3px';
      case 2:
        return crustReady ? null : '-3px';
      case 3:
        return crustReady ? null : '-1.5px';
    }
  };

  return css`
    text-shadow: 0 0 1px #000, 0 0 3px #000, 0 0 5px #000, 0 0 10px #000;
    cursor: default;
    font-family: ${setFontFamily()};
    font-weight: ${setFontWeight()};
    font-size: ${setFontSize()};
    letter-spacing: ${setLetterSpacing()};
  `;
});

// Renders Grommet Paragraph with black text shadow
export const ParagraphWS = styled(Paragraph as FC<ParagraphProps & JSX.IntrinsicElements['p']>)(() => {
  return css`
    text-shadow: 0 0 1px #000, 0 0 3px #000, 0 0 5px #000, 0 0 10px #000;
  `;
});

export const TextInputWS = styled(
  TextInput as FC<TextInputProps & Omit<JSX.IntrinsicElements['input'], 'onSelect' | 'size' | 'placeholder'>>
)(() => {
  return css`
    text-shadow: 0 0 1px #000, 0 0 3px #000, 0 0 5px #000, 0 0 10px #000;
  `;
});

// Renders Grommet Button with black box shadow
export const ButtonWS = styled(Button as FC<ButtonProps & JSX.IntrinsicElements['button']>)(({ primary }) => {
  return css`
    box-shadow: 0 0 5px 1px #000 ${!primary ? ', 0 0 5px 1px #000 inset' : ''};
    text-shadow: ${!primary ? '0 0 2px #000, 0 0 4px #000' : ''};
    &:focus {
      outline: 0;
      box-shadow: none;
      border-color: #fff;
      color: #fff;
    }
  `;
});

// Renders Grommet Text with black text shadow
export const TextWS = styled(Text as FC<TextProps & Omit<JSX.IntrinsicElements['span'], 'color'>>)(() => {
  return css`
    text-shadow: 0 0 1px #000, 0 0 3px #000;
    cursor: default;
  `;
});

export const StyledClose = styled(Close as FC<IconProps & JSX.IntrinsicElements['svg']>)(() => {
  return css`
    cursor: pointer;
    &:hover {
      stroke: #fff;
    }
  `;
});

export const RedBox = styled(Box as FC<BoxProps & JSX.IntrinsicElements['div']>)(() => {
  return css`
    border-color: ${brandColor};
    border-width: 3px;
    border-style: solid;
    box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.3), 0 0 10px 1px rgba(0, 0, 0, 0.2), 0 0 5px 1px rgba(0, 0, 0, 0.3) inset,
      0 0 10px 1px rgba(0, 0, 0, 0.2) inset;
  `;
});

const backgroundBase = {
  color: 'black',
  dark: true,
  position: 'center bottom',
  size: 'cover',
};

export const warningDialogBackground = {
  ...backgroundBase,
  image: 'url(/images/background-image-6.jpg)',
};

export const helpOrInterfereBackground = {
  ...backgroundBase,
  image: 'url(/images/background-image-10.jpg)',
};

export const barterBackground = {
  ...backgroundBase,
  position: 'left bottom',
  image: 'url(/images/background-image-11.jpg)',
};

export const makeWantKnownBackground = {
  ...backgroundBase,
  image: 'url(/images/background-image-13.jpg)',
};

export const sufferHarmBackground = {
  ...backgroundBase,
  image: 'url(/images/background-image-12.jpg)',
};

export const inflictHarmBackground = {
  ...backgroundBase,
  size: 'contain',
  image: 'url(/images/background-image-14.jpg)',
};

export const healHarmBackground = {
  ...backgroundBase,
  size: 'contain',
  image: 'url(/images/background-image-15.jpg)',
};

export const angelSpecialBackground = {
  ...backgroundBase,
  image: 'url(/images/background-image-16.jpg)',
};

export const stabilizeBackground = {
  ...backgroundBase,
  image: 'url(/images/background-image-17.jpg)',
};

export const speedRecoveryBackground = {
  ...backgroundBase,
  image: 'url(/images/background-image-18.jpg)',
};

export const reviveBackground = {
  ...backgroundBase,
  image: 'url(/images/background-image-19.jpg)',
};

export const treatNpcBackground = {
  ...backgroundBase,
  image: 'url(/images/background-image-20.jpg)',
};

export const chopperSpecialBackground = {
  ...backgroundBase,
  image: 'url(/images/background-image-21.jpg)',
};

export const threatDialogBackground = {
  ...backgroundBase,
  position: 'right bottom',
  size: 'contain',
  image: 'url(/images/background-image-22.jpg)',
};

export const npcDialogBackground = {
  ...backgroundBase,
  image: 'url(/images/background-image-23.jpg)',
};

export const gunluggerSpecialDialogBackground = {
  ...backgroundBase,
  position: 'right top',
  size: 'contain',
  image: 'url(/images/background-image-24.jpg)',
};

export const relativeSpeedDialogBackground = {
  ...backgroundBase,
  image: 'url(/images/background-image-25.jpg)',
};

export const boardVehicleDialogBackground = {
  ...backgroundBase,
  image: 'url(/images/background-image-26.jpg)',
};

export const dealTerrainDialogBackground = {
  ...backgroundBase,
  image: 'url(/images/background-image-27.jpg)',
};

export const hocusSpecialDialogBackground = {
  ...backgroundBase,
  image: 'url(/images/background-image-28.jpg)',
};

export const skinnerSpecialDialogBackground = {
  ...backgroundBase,
  image: 'url(/images/background-image-29.jpg)',
};

export const justGiveMotiveDialogBackground = {
  ...backgroundBase,
  size: 'contain',
  image: 'url(/images/background-image-30.jpg)',
};
