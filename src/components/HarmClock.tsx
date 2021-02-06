import { Box } from 'grommet';
import React, { FC } from 'react';
import { accentColors, brandColor, TextWS } from '../config/grommetConfig';

interface HarmClockProps {
  harmValue: number;
  isStabilized: boolean;
  diameter?: number;
  showNumbers?: boolean;
  margin?: number;
}

const HarmClock: FC<HarmClockProps> = ({ harmValue, isStabilized, diameter = 200, showNumbers = true, margin = 50 }) => {
  const highlightColor = isStabilized ? accentColors[0] : brandColor;

  const circle = {
    position: 'relative' as 'relative',
    height: `${diameter}px`,
    width: `${diameter}px`,
    overflow: 'hidden',
    borderRadius: '50%',
  };

  const sectorBase = {
    position: 'absolute' as 'absolute',
    left: '50%',
    bottom: '50%',
    height: '100%',
    width: '100%',
    transformOrigin: 'bottom left',
    borderColor: '#000',
    borderWidth: 1,
    borderStyle: 'solid',
    cursor: 'pointer',
  };

  const sector0 = (value: number) => {
    return {
      ...sectorBase,
      backgroundColor: value > 0 ? highlightColor : '#FFF',
      transform: 'rotate(0deg) skewY(0deg)',
    };
  };

  const sector1 = (value: number) => {
    return {
      ...sectorBase,
      backgroundColor: value > 1 ? highlightColor : '#FFF',
      transform: 'rotate(90deg) skewY(0deg)',
    };
  };

  const sector2 = (value: number) => {
    return {
      ...sectorBase,
      backgroundColor: value > 2 ? highlightColor : '#FFF',
      transform: 'rotate(180deg) skewY(0deg)',
    };
  };

  const sector3 = (value: number) => {
    return {
      ...sectorBase,
      backgroundColor: value > 3 ? highlightColor : '#FFF',
      transform: 'rotate(270deg) skewY(-60deg)',
    };
  };

  const sector4 = (value: number) => {
    return {
      ...sectorBase,
      backgroundColor: value > 4 ? highlightColor : '#FFF',
      transform: 'rotate(300deg) skewY(-60deg)',
    };
  };

  const sector5 = (value: number) => {
    return {
      ...sectorBase,
      backgroundColor: value > 5 ? highlightColor : '#FFF',
      transform: 'rotate(330deg) skewY(-60deg)',
    };
  };

  const oclockBase = {
    position: 'absolute' as 'absolute',
    padding: '3px',
    width: '30px',
    height: '30px',
  };

  const oclock12 = {
    ...oclockBase,
    top: 0,
    left: 'calc(50% - 15px)',
  };

  const oclock3 = {
    ...oclockBase,
    top: 'calc(50% - 15px)',
    right: 0,
  };

  const oclock6 = {
    ...oclockBase,
    bottom: -3,
    left: 'calc(50% - 15px)',
  };

  const oclock9 = {
    ...oclockBase,
    top: 'calc(50% -15px)',
    left: 0,
  };

  return (
    <Box
      fill="horizontal"
      direction="row"
      justify="around"
      animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
    >
      <Box
        data-testid="harm-clock"
        align="center"
        justify="center"
        style={{ position: 'relative', width: `${diameter + margin}px`, height: `${diameter + margin}px` }}
      >
        {showNumbers && (
          <>
            <Box style={oclock12} align="center" justify="center">
              <TextWS style={{ textAlign: 'center' }}>12</TextWS>
            </Box>
            <Box style={oclock3} align="center" justify="center">
              <TextWS>3</TextWS>
            </Box>
            <Box style={oclock6} align="center" justify="center">
              <TextWS>6</TextWS>
            </Box>
            <Box style={oclock9} align="center" justify="center">
              <TextWS>9</TextWS>
            </Box>
          </>
        )}

        <div style={circle}>
          <div data-testid="harm-sector-0" style={sector0(harmValue)} />
          <div data-testid="harm-sector-1" style={sector1(harmValue)} />
          <div data-testid="harm-sector-2" style={sector2(harmValue)} />
          <div data-testid="harm-sector-3" style={sector3(harmValue)} />
          <div data-testid="harm-sector-4" style={sector4(harmValue)} />
          <div data-testid="harm-sector-5" style={sector5(harmValue)} />
        </div>
      </Box>
    </Box>
  );
};

export default HarmClock;
