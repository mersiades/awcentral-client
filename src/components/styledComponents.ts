import { Box, BoxProps } from "grommet";
import styled, { css } from "styled-components";

export const Footer = styled(Box as React.FC<BoxProps & JSX.IntrinsicElements['div']>)`
  border-top: 6px solid transparent;
  border-image-source: url(/images/black-line-short.png);
  border-image-slice: 17 0;
  border-image-repeat: round;
`;

interface MainContainerProps {
  readonly sidePanel: number;
  readonly maxPanels: number;
  readonly shinkWidth: number; // 0-100, for vw
}

export const MainContainer = styled(Box as React.FC<MainContainerProps & BoxProps & JSX.IntrinsicElements['div']>)(
  ({ sidePanel, maxPanels, shinkWidth }) => {
    return css`
      height: calc(100vh - 95px);
      width: 100vw;
      transition: width 200ms ease-in-out, transform 200ms ease-in-out;
      ${sidePanel < maxPanels &&
        css`
          transform: translateX(${shinkWidth}vw);
          width: ${100 - shinkWidth}vw;
        `};
    `;
  }
);

interface SidePanelProps {
  readonly sidePanel: number;
  readonly growWidth: number; // 0-100, for vw
}

export const SidePanel = styled(Box as React.FC<SidePanelProps & BoxProps & JSX.IntrinsicElements['div']>)(({ sidePanel, growWidth }) => {
  return css`
    border-right: 1px solid transparent;
    border-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), black, rgba(0, 0, 0, 0)) 1 100%;
    position: absolute;
    height: calc(100vh - 95px);
    width: ${growWidth}vw;
  `;
});