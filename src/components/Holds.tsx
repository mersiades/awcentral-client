import { useMutation } from '@apollo/client';
import { Box, Markdown, Text, Tip } from 'grommet';
import { omit } from 'lodash';
import React, { FC } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { HoldInput } from '../@types';
import { Hold } from '../@types/dataInterfaces';
import { accentColors, HeadingWS } from '../config/grommetConfig';
import { useFonts } from '../contexts/fontContext';
import { useGame } from '../contexts/gameContext';
import REMOVE_HOLD, { RemoveHoldData, RemoveHoldVars } from '../mutations/removeHold';
import SPEND_HOLD, { SpendHoldData, SpendHoldVars } from '../mutations/spendHold';

interface HoldsProps {
  holds: Hold[];
}

const StyledHold = styled.div`
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
  const [removeHold, { loading: removingHold }] = useMutation<RemoveHoldData, RemoveHoldVars>(REMOVE_HOLD);

  // ------------------------------------------------- Component functions -------------------------------------------------- /

  const handleHoldLeftClick = (hold: Hold) => {
    if (!!gameId && !!userGameRole && !!character) {
      const holdNoTypename = omit(hold, ['__typename']) as HoldInput;
      try {
        spendHold({ variables: { gameId, gameRoleId: userGameRole.id, characterId: character.id, hold: holdNoTypename } });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleHoldRightClick = (hold: Hold) => {
    if (!!userGameRole && !!character) {
      const holdNoTypename = omit(hold, ['__typename']) as HoldInput;
      try {
        removeHold({ variables: { gameRoleId: userGameRole.id, characterId: character.id, hold: holdNoTypename } });
      } catch (error) {
        console.error(error);
      }
    }
  };

  // -------------------------------------------------- Render component  ---------------------------------------------------- //
  const renderTipContent = (hold: Hold) => (
    <Box>
      <Markdown>{hold.moveDescription}</Markdown>
      <Box direction="row" justify="between">
        <Text weight="bold">Left click: spend</Text>
        <Text weight="bold">Right click: delete</Text>
      </Box>
    </Box>
  );

  return (
    <Box direction="row" pad={{ horizontal: '24px' }} gap="12px" align="center" justify="start">
      <HeadingWS crustReady={crustReady} level={2} margin={{ vertical: '3px' }}>
        Holds
      </HeadingWS>
      {holds.map((hold) => (
        <Tip key={hold.id} content={renderTipContent(hold)}>
          <Box animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}>
            <StyledHold
              data-testid="hold-circle"
              onClick={() => !spendingHold && handleHoldLeftClick(hold)}
              onContextMenu={(e) => {
                e.preventDefault();
                !removingHold && handleHoldRightClick(hold);
                return false;
              }}
            />
          </Box>
        </Tip>
      ))}
    </Box>
  );
};

export default Holds;
