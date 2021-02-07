import React, { FC, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { Box } from 'grommet';
import { FormUp, FormDown, Edit } from 'grommet-icons';

import { StyledMarkdown } from '../styledComponents';
import PERFORM_PRINT_MOVE, { PerformPrintMoveData, PerformPrintMoveVars } from '../../mutations/performPrintMove';
import PERFORM_STAT_ROLL_MOVE, {
  PerformStatRollMoveData,
  PerformStatRollMoveVars,
} from '../../mutations/performStatRollMove';
import { MoveActionType, RoleType, RollType } from '../../@types/enums';
import { CharacterMove, Move } from '../../@types/staticDataInterfaces';
import { useGame } from '../../contexts/gameContext';
import { useFonts } from '../../contexts/fontContext';
import { brandColor, HeadingWS } from '../../config/grommetConfig';
import { decapitalize } from '../../helpers/decapitalize';

interface MovesBoxProps {
  moves: Array<CharacterMove | Move>;
  moveCategory: string;
  open?: boolean;
  navigateToCharacterCreation?: (step: string) => void;
  openDialog?: (move: Move | CharacterMove) => void;
}

const MovesBox: FC<MovesBoxProps> = ({ moves, moveCategory, open, navigateToCharacterCreation, openDialog }) => {
  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [showMoves, setShowMoves] = useState(open);
  const [showMoveDetails, setShowMoveDetails] = useState<string[]>([]);

  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //
  const { gameId } = useParams<{ gameId: string }>();

  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { userGameRole } = useGame();
  const { crustReady } = useFonts();

  // ------------------------------------------------------ graphQL -------------------------------------------------------- //

  const [performPrintMove, { loading: performingPrintMove }] = useMutation<PerformPrintMoveData, PerformPrintMoveVars>(
    PERFORM_PRINT_MOVE
  );

  const [performStatRollMove, { loading: performingStatRollMove }] = useMutation<
    PerformStatRollMoveData,
    PerformStatRollMoveVars
  >(PERFORM_STAT_ROLL_MOVE);

  // ------------------------------------------------- Component functions -------------------------------------------------- //
  const toggleShowMoves = () => setShowMoves(!showMoves);

  const clickableStyle = {
    cursor: 'pointer',
    '&:hover': {
      color: brandColor,
    },
  };

  const unClickableStyle = {
    cursor: 'default',
  };

  const toggleShowMoveDetails = (moveId: string) => {
    if (showMoveDetails.includes(moveId)) {
      setShowMoveDetails(showMoveDetails.filter((m) => m !== moveId));
    } else {
      setShowMoveDetails([...showMoveDetails, moveId]);
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
            isGangMove: false,
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
            gameroleId: userGameRole.id,
            characterId: userGameRole.characters[0].id,
            moveId: move.id,
            isGangMove: false,
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
      case RollType.barter:
      // deliberately falls through
      case RollType.harm:
      // deliberately falls through
      case RollType.hx:
        !!openDialog && openDialog(move);
        break;
      default:
    }
  };

  const handleMoveClick = (move: Move | CharacterMove) => {
    switch (move.moveAction?.actionType) {
      case MoveActionType.roll:
        handleRollClick(move);
        break;
      case MoveActionType.adjustHx:
      // Deliberately falls through
      case MoveActionType.barter:
        !!openDialog && openDialog(move);
        break;
      case MoveActionType.print:
      // Deliberately falls through
      default:
        handlePrintMove(move);
    }
  };

  return (
    <Box
      data-testid="moves-box"
      fill="horizontal"
      align="center"
      justify="start"
      pad={{ vertical: '12px' }}
      style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.25)' }}
    >
      <Box fill="horizontal" direction="row" align="center" justify="between" pad={{ vertical: '12px' }}>
        <HeadingWS
          crustReady={crustReady}
          level="3"
          margin="0px"
          alignSelf="start"
          onClick={toggleShowMoves}
          style={{ cursor: 'pointer' }}
        >
          {`${decapitalize(moveCategory)} moves`}
        </HeadingWS>
        <Box direction="row" align="center" gap="12px">
          {showMoves ? (
            <FormUp data-testid="hide-moves-icon" onClick={toggleShowMoves} style={{ cursor: 'pointer' }} />
          ) : (
            <FormDown data-testid="show-moves-icon" onClick={toggleShowMoves} style={{ cursor: 'pointer' }} />
          )}
          {!!navigateToCharacterCreation && (
            <Edit color="accent-1" onClick={() => navigateToCharacterCreation('7')} style={{ cursor: 'pointer' }} />
          )}
        </Box>
      </Box>
      {showMoves &&
        moves.map((move) => {
          const canPerformMove = !!move.moveAction && userGameRole?.role !== RoleType.mc;
          return (
            <Box key={move.id} fill="horizontal" animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}>
              <Box fill="horizontal" direction="row" justify="between" align="center">
                <Box direction="row" justify="start" align="center" pad="12px" gap="12px">
                  {showMoveDetails.includes(move.id) ? (
                    <FormUp
                      data-testid="hide-move-details-icon"
                      onClick={() => toggleShowMoveDetails(move.id)}
                      style={{ cursor: 'pointer' }}
                    />
                  ) : (
                    <FormDown
                      data-testid="show-move-details-icon"
                      onClick={() => toggleShowMoveDetails(move.id)}
                      style={{ cursor: 'pointer' }}
                    />
                  )}
                  <HeadingWS
                    crustReady={crustReady}
                    level="3"
                    margin={{ top: '3px', bottom: '3px' }}
                    onClick={() => canPerformMove && handleMoveClick(move)}
                    onMouseOver={(e: React.MouseEvent<HTMLHeadingElement>) =>
                      // @ts-ignore
                      (e.target.style.color = canPerformMove ? '#CD3F3E' : '#FFF')
                    }
                    // @ts-ignore
                    onMouseOut={(e: React.MouseEvent<HTMLHeadingElement>) => (e.target.style.color = '#FFF')}
                    style={canPerformMove ? clickableStyle : unClickableStyle}
                  >
                    {decapitalize(move.name)}
                  </HeadingWS>
                </Box>
              </Box>

              {showMoveDetails.includes(move.id) && (
                <Box pad="12px" animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}>
                  <StyledMarkdown>{move.description}</StyledMarkdown>
                </Box>
              )}
            </Box>
          );
        })}
    </Box>
  );
};

export default MovesBox;
