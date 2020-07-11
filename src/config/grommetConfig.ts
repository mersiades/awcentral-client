import { rgba } from "polished";
import { deepMerge } from "grommet/utils";
import { grommet } from "grommet/themes/grommet";

const brandColor = "#CD3F3E";

const accentColors = ["#698D70", "#CFCBBC", "#D66667", "#E0C5B6"];
const neutralColors = ["#4C684C", "#B1BAA3", "#614134", "#967F6B"];
const statusColors = {
  critical: "#FF4040",
  error: "#FF4040",
  warning: "#FFAA15",
  ok: "#00C781",
  unknown: "#CCCCCC",
  disabled: "#CCCCCC",
};
const darkColors = [
  "#333333",
  "#555555",
  "#777777",
  "#999999",
  "#999999",
  "#999999",
];
const lightColors = [
  "#F8F8F8",
  "#F2F2F2",
  "#EDEDED",
  "#DADADA",
  "#DADADA",
  "#DADADA",
];
const focusColor = accentColors[0];

const colors = {
  active: rgba(221, 221, 221, 0.5),
  "background-back": {
    dark: "#33333308",
    light: "#EDEDED",
  },
  "background-front": {
    dark: "#444444",
    light: "#FFFFFF",
  },
  "background-contrast": {
    dark: "#33333308",
    light: "#FFFFFF08",
  },
  "active-background": "background-contrast",
  "active-text": "text-strong",
  black: "#000000",
  border: {
    dark: rgba(255, 255, 255, 0.33),
    light: rgba(0, 0, 0, 0.33),
  },
  brand: brandColor,
  control: {
    dark: "accent-1",
    light: "brand",
  },
  focus: focusColor,
  "graph-0": "accent-1",
  "graph-1": "neutral-1",
  "graph-2": "neutral-2",
  "graph-3": "neutral-3",
  "graph-4": "neutral-4",
  placeholder: "#AAAAAA",
  selected: "brand",
  text: {
    dark: "#f8f8f8",
    light: "#444444",
  },
  "text-strong": {
    dark: "#FFFFFF",
    light: "#000000",
  },
  "text-weak": {
    dark: "#CCCCCC",
    light: "#555555",
  },
  "text-xweak": {
    dark: "#BBBBBB",
    light: "#666666",
  },
  icon: {
    dark: "#f8f8f8",
    light: "#666666",
  },
  "selected-background": "brand",
  "selected-text": "text-strong",
  white: "#FFFFFF",
};

const colorArray = (array: string[], prefix: string) =>
  array.forEach((color, index) => {
    // @ts-ignore
    colors[`${prefix}-${index + 1}`] = color;
  });

colorArray(accentColors, "accent");
colorArray(darkColors, "dark");
colorArray(lightColors, "light");
colorArray(neutralColors, "neutral");
Object.keys(statusColors).forEach((color) => {
  // @ts-ignore
  colors[`status-${color}`] = statusColors[color];
});

export const theme = deepMerge(grommet, {
  global: {
    font: {
      family: "'chaparral pro', sans-serif",
      size: "18px",
      height: "20px",
    },
    colors,
  },
  button: {
    size: {
      small: {
        border: {
          radius: "0px",
        },
      },
      medium: {
        border: {
          radius: "0px",
        },
      },
      large: {
        border: {
          radius: "0px",
        },
      },
    },
    border: {
      width: "0px",
    },
    extend: "font-family: 'Vtks good luck for you', sans-serif;",
  },
});
