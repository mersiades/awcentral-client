import React, { FC, useState } from 'react';
import { Box, Button } from 'grommet';
import { FormUp, FormDown, Edit } from 'grommet-icons';

import { StyledMarkdown } from '../styledComponents';
import { useGame } from '../../contexts/gameContext';
import { Roles } from '../../@types/enums';
import { CharacterMove, Move } from '../../@types/staticDataInterfaces';
import { decapitalize } from '../../helpers/decapitalize';
import { HeadingWS } from '../../config/grommetConfig';
import { useFonts } from '../../contexts/fontContext';

interface MovesBoxProps {
  moves: Array<CharacterMove | Move>;
  moveCategory: string;
  open?: boolean;
  navigateToCharacterCreation?: (step: string) => void;
}

const MovesBox: FC<MovesBoxProps> = ({ moves, moveCategory, open, navigateToCharacterCreation }) => {
  const [showMoves, setShowMoves] = useState(open);
  const [showMoveDetails, setShowMoveDetails] = useState<string[]>([]);

  const { userGameRole } = useGame();
  const { crustReady } = useFonts();

  const toggleShowMoves = () => setShowMoves(!showMoves);

  const toggleShowMoveDetails = (moveId: string) => {
    if (showMoveDetails.includes(moveId)) {
      setShowMoveDetails(showMoveDetails.filter((m) => m !== moveId));
    } else {
      setShowMoveDetails([...showMoveDetails, moveId]);
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
                    onClick={() => toggleShowMoveDetails(move.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {decapitalize(move.name)}
                  </HeadingWS>
                </Box>
                {!!move.stat && userGameRole?.role !== Roles.mc && <Button secondary label="ROLL" />}
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
