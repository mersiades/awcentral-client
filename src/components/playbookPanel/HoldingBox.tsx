import React, { FC, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { Box } from 'grommet';
import { FormDown, FormUp } from 'grommet-icons';

import DoubleRedBox from '../DoubleRedBox';
import SingleRedBox from '../SingleRedBox';
import RedTagsBox from '../RedTagsBox';
import CollapsiblePanelBox from '../CollapsiblePanelBox';
import { HeadingWS, brandColor } from '../../config/grommetConfig';
import ALL_MOVES, { AllMovesData } from '../../queries/allMoves';
import PERFORM_PRINT_MOVE, { PerformPrintMoveData, PerformPrintMoveVars } from '../../mutations/performPrintMove';
import PERFORM_STAT_ROLL_MOVE, {
  PerformStatRollMoveData,
  PerformStatRollMoveVars,
} from '../../mutations/performStatRollMove';
import { MoveActionType, MoveType, RollType } from '../../@types/enums';
import { CharacterMove, Move } from '../../@types/staticDataInterfaces';
import { useFonts } from '../../contexts/fontContext';
import { useGame } from '../../contexts/gameContext';
import { decapitalize } from '../../helpers/decapitalize';
import { GO_AGGRO_NAME, SUCKER_SOMEONE_NAME } from '../../config/constants';

import SET_HOLDING_BARTER, { SetHoldingBarterData, SetHoldingBarterVars } from '../../mutations/setHoldingBarter';

interface HoldingBoxProps {
  navigateToCharacterCreation: (step: string) => void;
}

const HoldingBox: FC<HoldingBoxProps> = ({ navigateToCharacterCreation }) => {
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

  const [setHoldingBarter, { loading: settingHoldingBarter }] = useMutation<SetHoldingBarterData, SetHoldingBarterVars>(
    SET_HOLDING_BARTER
  );

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
  const holding = character?.playbookUnique?.holding;

  const adjustBarter = (type: 'increase' | 'decrease') => {
    if (!!userGameRole && !!character && !!character.playbookUnique && !!holding) {
      const amount = type === 'increase' ? holding.barter + 1 : holding.barter - 1;
      try {
        setHoldingBarter({
          variables: { gameRoleId: userGameRole?.id, characterId: character.id, amount },
          optimisticResponse: {
            __typename: 'Mutation',
            setHoldingBarter: {
              __typename: 'Character',
              ...character,
              playbookUnique: {
                ...character.playbookUnique,
                holding: {
                  ...holding,
                  barter: amount,
                },
              },
            },
          },
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleStatRollMove = (move: Move | CharacterMove) => {
    if (!!userGameRole && userGameRole.characters.length === 1 && !performingStatRollMove) {
      try {
        performStatRollMove({
          variables: {
            gameId,
            gameRoleId: userGameRole.id,
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
            gameRoleId: userGameRole.id,
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

  // -------------------------------------------------- Render component  ---------------------------------------------------- //

  return (
    <CollapsiblePanelBox
      open
      title="Holding & Gang"
      navigateToCharacterCreation={navigateToCharacterCreation}
      targetCreationStep="6"
    >
      <Box fill="horizontal" align="start" animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}>
        <HeadingWS level={4} margin={{ vertical: '3px' }}>
          Holding
        </HeadingWS>
        {!!holding && (
          <Box fill="horizontal" direction="row" align="center" justify="start" wrap gap="12px" pad="12px">
            <SingleRedBox
              value={holding.barter.toString()}
              label="Barter"
              loading={settingHoldingBarter}
              onIncrease={() => adjustBarter('increase')}
              onDecrease={() => adjustBarter('decrease')}
            />
            <DoubleRedBox value={holding.holdingSize} label="Size" />
            <DoubleRedBox value={holding.souls} label="Population" />
            <RedTagsBox tags={holding.wants} label="Wants" height="90px" />
            <DoubleRedBox value={`+${holding.surplus}barter`} label="Surplus" />
            <RedTagsBox tags={holding.gigs} label="Gigs" height="90px" />
            <DoubleRedBox value={`+${holding.gangDefenseArmorBonus}armor`} label="Defense bonus" />
          </Box>
        )}
        <HeadingWS level={4} margin={{ vertical: '3px' }}>
          Gang
        </HeadingWS>
        {!!holding && (
          <Box fill="horizontal" direction="row" align="center" justify="start" wrap gap="12px" pad="12px">
            <DoubleRedBox value={holding.gangSize} label="Size" />
            <SingleRedBox value={holding.gangHarm.toString()} label="Harm" />
            <SingleRedBox value={holding.gangArmor.toString()} label="Armor" />
            <RedTagsBox tags={holding.gangTags} label="Tags" height="90px" />
          </Box>
        )}
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

export default HoldingBox;
