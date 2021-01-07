import { Box, BoxProps } from 'grommet';
import React, { FC } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { neutralColors } from '../config/grommetConfig';
import '../assets/styles/transitions.css';

const move = keyframes`
  25% {
    opacity: 1;
  }
  33% {
    opacity: 1;
    transform: translateY(30px);
  }
  67% {
    opacity: 1;
    transform: translateY(40px);
  }
  100% {
    opacity: 0;
    transform: translateY(55px) scale3d(0.5, 0.5, 0.5);
  }
`;

const ContainerBox = styled(Box as FC<BoxProps & JSX.IntrinsicElements['div']>)(() => {
  return css`
    position: absolute;
    bottom: 48px;
    right: 24px;
    width: 24px;
    height: 24px;
  `;
});

const Chevron = styled.div`
  position: absolute;
  width: 28px;
  height: 8px;
  opacity: 0;
  transform: scale3d(0.5, 0.5, 0.5);
  animation: ${move} 3s ease-out infinite;
  &:before {
    content: ' ';
    position: absolute;
    top: 0;
    height: 100%;
    width: 51%;
    background: ${neutralColors[0]};
    left: 0;
    transform: skew(0deg, 30deg);
  }
  &:after {
    content: ' ';
    position: absolute;
    top: 0;
    height: 100%;
    width: 51%;
    background: ${neutralColors[0]};
    right: 0;
    width: 50%;
    transform: skew(0deg, -30deg);
  }
  &:first-child {
    animation: ${move} 3s ease-out 1s infinite;
  }
  &:nth-child(2) {
    animation: ${move} 3s ease-out 2s infinite;
  }
`;

interface ScrollableIndicatorProps {
  show: boolean;
}

const ScrollableIndicator: FC<ScrollableIndicatorProps> = ({ show }) => {
  return (
    <ContainerBox className={show ? 'fadeInSlow' : 'fadeOutSlow'}>
      <Chevron className={show ? 'fadeInSlow' : 'fadeOutSlow'} />
      <Chevron className={show ? 'fadeInSlow' : 'fadeOutSlow'} />
      <Chevron className={show ? 'fadeInSlow' : 'fadeOutSlow'} />
    </ContainerBox>
  );
};

export default ScrollableIndicator;
