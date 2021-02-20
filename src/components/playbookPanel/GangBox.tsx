import React, { FC, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { Box } from 'grommet';
import { FormDown, FormUp } from 'grommet-icons';

import CollapsiblePanelBox from '../CollapsiblePanelBox';
import { RedBox, HeadingWS, brandColor, TextWS } from '../../config/grommetConfig';
import ALL_MOVES, { AllMovesData } from '../../queries/allMoves';
import PERFORM_STAT_ROLL_MOVE, {
  PerformStatRollMoveData,
  PerformStatRollMoveVars,
} from '../../mutations/performStatRollMove';
import PERFORM_PRINT_MOVE, { PerformPrintMoveData, PerformPrintMoveVars } from '../../mutations/performPrintMove';
import { MoveActionType, MoveType, RollType } from '../../@types/enums';
import { CharacterMove, Move } from '../../@types/staticDataInterfaces';
import { useFonts } from '../../contexts/fontContext';
import { useGame } from '../../contexts/gameContext';
import { decapitalize } from '../../helpers/decapitalize';
import { GO_AGGRO_NAME, SUCKER_SOMEONE_NAME } from '../../config/constants';

interface GangBoxProps {
  navigateToCharacterCreation: (step: string) => void;
  openDialog: (move: Move | CharacterMove) => void;
}

const GangBox: FC<GangBoxProps> = ({ navigateToCharacterCreation }) => {
  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [showMoves, setShowMoves] = useState(false);
  const [gangMoves, setGangMoves] = useState<Move[]>([]);

  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { crustReady } = useFonts();
  const { character, userGameRole } = useGame();

  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //
  const { gameId } = useParams<{ gameId: string }>();

  // ------------------------------------------------------ graphQL -------------------------------------------------------- //
  const { data: allMovesData } = useQuery<AllMovesData>(ALL_MOVES);

  const [performPrintMove, { loading: performingPrintMove }] = useMutation<PerformPrintMoveData, PerformPrintMoveVars>(
    PERFORM_PRINT_MOVE
  );
  const [performStatRollMove, { loading: performingStatRollMove }] = useMutation<
    PerformStatRollMoveData,
    PerformStatRollMoveVars
  >(PERFORM_STAT_ROLL_MOVE);
  // ------------------------------------------------- Component functions -------------------------------------------------- //
  const moveStyle = {
    cursor: 'pointer',
    '&:hover': {
      color: brandColor,
    },
  };

  const handleStatRollMove = (move: Move | CharacterMove) => {
    if (!!userGameRole && userGameRole.characters.length === 1 && !performingStatRollMove) {
      try {
        performStatRollMove({
          variables: {
            gameId,
            gameroleId: userGameRole.id,
            characterId: userGameRole.characters[0].id,
            moveId: move.id,
            isGangMove: true,
          },
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleRollClick = (move: Move | CharacterMove) => {
    switch (move.moveAction?.rollType) {
      case RollType.stat:
        handleStatRollMove(move);
        break;
      default:
    }
  };

  const handlePrintMove = (move: Move | CharacterMove) => {
    if (!!userGameRole && userGameRole.characters.length === 1 && !performingPrintMove) {
      try {
        performPrintMove({
          variables: {
            gameId,
            gameroleId: userGameRole.id,
            characterId: userGameRole.characters[0].id,
            moveId: move.id,
            isGangMove: true,
          },
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleMoveClick = (move: Move | CharacterMove) => {
    console.log('move.moveAction?.actionType', move.moveAction?.actionType);
    switch (move.moveAction?.actionType) {
      case MoveActionType.roll:
        handleRollClick(move);
        break;
      case MoveActionType.print:
      // Deliberately falls through
      default:
        handlePrintMove(move);
    }
  };

  useEffect(() => {
    if (!!allMovesData) {
      const gangMoves = allMovesData?.allMoves.filter((move) => move.kind === MoveType.battle) as Move[];
      gangMoves.push(allMovesData?.allMoves.find((move) => move.name === GO_AGGRO_NAME) as Move);
      gangMoves.push(allMovesData?.allMoves.find((move) => move.name === SUCKER_SOMEONE_NAME) as Move);
      setGangMoves(gangMoves);
    }
  }, [allMovesData]);

  return (
    <CollapsiblePanelBox open title="Gang" navigateToCharacterCreation={navigateToCharacterCreation} targetCreationStep="6">
      <Box fill="horizontal" align="start" animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}>
        <Box fill="horizontal" direction="row" align="center" justify="start" wrap gap="12px" pad="12px">
          <Box align="center" justify="between" height="90px" gap="6px" margin={{ bottom: '6px' }}>
            <RedBox pad="12px" align="center" fill justify="center">
              <HeadingWS crustReady={crustReady} level={3} margin={{ horizontal: '9px', bottom: '-3px', top: '3px' }}>
                {character?.playbookUnique?.gang?.size}
              </HeadingWS>
            </RedBox>
            <TextWS style={{ fontWeight: 600 }}>Size</TextWS>
          </Box>
          <Box align="center" justify="between" height="90px" gap="6px" margin={{ bottom: '6px' }}>
            <RedBox align="center" width="50px" fill="vertical" justify="center">
              <HeadingWS crustReady={crustReady} level="2" margin={{ left: '9px', right: '9px', bottom: '3px', top: '9px' }}>
                {character?.playbookUnique?.gang?.harm}
              </HeadingWS>
            </RedBox>
            <TextWS style={{ fontWeight: 600 }}>Harm</TextWS>
          </Box>
          <Box align="center" justify="between" height="90px" gap="6px" margin={{ bottom: '6px' }}>
            <RedBox align="center" width="50px" fill="vertical" justify="center">
              <HeadingWS crustReady={crustReady} level="2" margin={{ left: '9px', right: '9px', bottom: '3px', top: '9px' }}>
                {character?.playbookUnique?.gang?.armor}
              </HeadingWS>
            </RedBox>
            <TextWS style={{ fontWeight: 600 }}>Armor</TextWS>
          </Box>
          <Box align="center" justify="between" height="90px" gap="6px" margin={{ bottom: '6px' }}>
            <RedBox pad="12px" fill justify="center">
              <TextWS>{character?.playbookUnique?.gang?.tags.join(', ')}</TextWS>
            </RedBox>
            <TextWS style={{ fontWeight: 600 }}>Tags</TextWS>
          </Box>
        </Box>
        <Box direction="row" justify="between" fill="horizontal" align="center" pad="12px">
          <HeadingWS level="4" margin={{ vertical: '3px' }}>
            Gang moves
          </HeadingWS>
          {showMoves ? (
            <FormUp data-testid="hide-gang-moves-icon" onClick={() => setShowMoves(false)} style={{ cursor: 'pointer' }} />
          ) : (
            <FormDown data-testid="show-gang-moves-icon" onClick={() => setShowMoves(true)} style={{ cursor: 'pointer' }} />
          )}
        </Box>
        {showMoves && (
          <Box pad="12px">
            <Box fill="horizontal" align="start" animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}>
              {gangMoves.map((move) => {
                return (
                  <HeadingWS
                    key={move.id}
                    crustReady={crustReady}
                    level="3"
                    margin={{ top: '3px', bottom: '3px' }}
                    onClick={() => handleMoveClick(move)}
                    onMouseOver={(e: React.MouseEvent<HTMLHeadingElement>) =>
                      // @ts-ignore
                      (e.target.style.color = '#CD3F3E')
                    }
                    // @ts-ignore
                    onMouseOut={(e: React.MouseEvent<HTMLHeadingElement>) => (e.target.style.color = '#FFF')}
                    style={moveStyle}
                  >
                    {decapitalize(move.name)}
                  </HeadingWS>
                );
              })}
            </Box>
          </Box>
        )}
      </Box>
    </CollapsiblePanelBox>
  );
};

export default GangBox;
