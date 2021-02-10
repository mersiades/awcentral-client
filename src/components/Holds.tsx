import { useMutation } from '@apollo/client';
import { Box } from 'grommet';
import React, { FC } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { accentColors, HeadingWS } from '../config/grommetConfig';
import { useFonts } from '../contexts/fontContext';
import { useGame } from '../contexts/gameContext';
import SPEND_HOLD, { SpendHoldData, SpendHoldVars } from '../mutations/spendHold';

interface HoldsProps {
  holds: number;
}

const Hold = styled.div`
  width: 25px;
  height: 25px;
  border-radius: 15px;
  background-color: ${accentColors[2]};
  box-shadow: 0 0 5px 1px #000;
  cursor: pointer;
`;

const Holds: FC<HoldsProps> = ({ holds }) => {
  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //
  const { gameId } = useParams<{ gameId: string }>();

  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { userGameRole, character } = useGame();
  const { crustReady } = useFonts();

  // ------------------------------------------------------ graphQL -------------------------------------------------------- //
  const [spendHold, { loading: spendingHold }] = useMutation<SpendHoldData, SpendHoldVars>(SPEND_HOLD);

  // ------------------------------------------------- Component functions -------------------------------------------------- //
  const holdsArray = Array.from(Array(holds).keys());

  const handleHoldClick = () => {
    if (!!gameId && !!userGameRole && !!character) {
      try {
        spendHold({ variables: { gameId, gameroleId: userGameRole.id, characterId: character.id } });
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <Box direction="row" pad={{ horizontal: '24px' }} gap="12px" align="center" justify="start">
      <HeadingWS crustReady={crustReady} level={2} margin={{ vertical: '3px' }}>
        Holds
      </HeadingWS>
      {holdsArray.map((index) => (
        <Box key={index} animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}>
          <Hold onClick={() => !spendingHold && handleHoldClick()} />
        </Box>
      ))}
    </Box>
  );
};

export default Holds;
