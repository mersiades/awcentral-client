import { Box, BoxProps } from 'grommet';
import styled, { css } from 'styled-components';
import { accentColors } from '../config/grommetConfig';

export const Footer = styled(Box as React.FC<BoxProps & JSX.IntrinsicElements['div']>)`
  border-top: 1px solid ${accentColors[0]};
`;

interface MainContainerProps {
  readonly sidePanel: number;
  readonly maxPanels: number;
  readonly shinkWidth: number; // 0-100, for vw
}

//height: calc(100vh - 102px);
export const MainContainer = styled(Box as React.FC<MainContainerProps & BoxProps & JSX.IntrinsicElements['div']>)(
  ({ sidePanel, maxPanels, shinkWidth }) => {
    return css`
      height: 86vh;
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
  ({ sidePanel, growWidth }) => {
    return css`
      border-right: 1px solid ${accentColors[0]};
      background: transparent;
      position: absolute;
      height: 86vh;
      width: ${growWidth}vw;
    `;
  }
);
