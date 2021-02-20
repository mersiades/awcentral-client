import { Box, BoxProps } from 'grommet';
import ReactMarkdown from 'react-markdown';
import styled, { css } from 'styled-components';
import { gamePageBottomNavbarHeight, gamePageTopNavbarHeight } from '../config/constants';
import { accentColors } from '../config/grommetConfig';

export const Footer = styled(Box as React.FC<BoxProps & JSX.IntrinsicElements['div']>)`
  border-top: 1px solid ${accentColors[0]};
`;

interface MainContainerProps {
  readonly sidePanel: number;
  readonly maxPanels: number;
  readonly shinkWidth: number; // 0-100, for vw
}

export const MainContainer = styled(Box as React.FC<MainContainerProps & BoxProps & JSX.IntrinsicElements['div']>)(
  ({ sidePanel, maxPanels, shinkWidth }) => {
    return css`
      height: calc(100vh - ${gamePageBottomNavbarHeight + gamePageTopNavbarHeight}px);
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

export const SidePanel = styled(Box as React.FC<SidePanelProps & BoxProps & JSX.IntrinsicElements['div']>)(
  // @ts-ignore
  ({ sidePanel, growWidth }) => {
    return css`
      border-right: 1px solid ${accentColors[0]};
      background: transparent;
      position: absolute;
      height: calc(100vh - ${gamePageBottomNavbarHeight + gamePageTopNavbarHeight}px);
      width: ${growWidth}vw;
    `;
  }
);

interface LeftMainProps {
  readonly rightPanel: number;
}

export const LeftMainContainer = styled(Box as React.FC<LeftMainProps & BoxProps & JSX.IntrinsicElements['div']>)(
  ({ rightPanel }) => {
    return css`
      height: calc(100vh - ${gamePageBottomNavbarHeight + gamePageTopNavbarHeight}px);
      width: 100%;
      transition: width 200ms ease-in-out;
      ${rightPanel !== 2 &&
      css`
        width: 50%;
      `};
    `;
  }
);

interface RightMainProps {
  readonly rightPanel: number;
}
export const RightMainContainer = styled(Box as React.FC<RightMainProps & BoxProps & JSX.IntrinsicElements['div']>)(
  ({ rightPanel }) => {
    return css`
      border-left: 1px solid ${accentColors[0]};
      position: absolute;
      height: calc(100vh - ${gamePageBottomNavbarHeight + gamePageTopNavbarHeight}px);
      opacity: 0;
      transform: translateX(200%);
      transition: opacity 200ms ease-in-out, transform 200ms ease-in-out;
      ${rightPanel !== 2 &&
      css`
        transform: translateX(100%);
        width: 50%;
        opacity: 1;
      `};
    `;
  }
);

export const StyledMarkdown = styled(ReactMarkdown)`
  cursor: default;
  & p {
    margin: unset;
    margin-bottom: 6px;
    text-shadow: 0 0 1px #000, 0 0 3px #000;
  }
  & li {
    text-shadow: 0 0 1px #000, 0 0 3px #000;
  }
`;
