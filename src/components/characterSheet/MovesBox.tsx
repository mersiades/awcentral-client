import { Box, Heading, Button } from 'grommet';
import { FormUp, FormDown, Edit } from 'grommet-icons';
import React, { FC, useState } from 'react';
import { Roles } from '../../@types/enums';
import { CharacterMove, Move } from '../../@types/staticDataInterfaces';
import { useGame } from '../../contexts/gameContext';
import { decapitalize } from '../../helpers/decapitalize';
import { StyledMarkdown } from '../styledComponents';

interface MovesBoxProps {
  moves: Array<CharacterMove | Move>;
  moveCategory: string;
  open?: boolean;
  navigateToCharacterCreation?: (step: number) => void;
}

const MovesBox: FC<MovesBoxProps> = ({ moves, moveCategory, open, navigateToCharacterCreation }) => {
  const [showMoves, setShowMoves] = useState(open);
  const [showMoveDetails, setShowMoveDetails] = useState<string[]>([]);

  const { userGameRole } = useGame();

  return (
    <Box fill="horizontal" align="center" justify="start" pad={{ vertical: '12px' }}>
      <Box fill="horizontal" direction="row" align="center" justify="between" pad={{ vertical: '12px' }}>
        <Heading level="3" margin="0px" alignSelf="start">
          {`${decapitalize(moveCategory)} moves`}
        </Heading>
        <Box direction="row" align="center" gap="12px">
          {showMoves ? <FormUp onClick={() => setShowMoves(false)} /> : <FormDown onClick={() => setShowMoves(true)} />}
          {!!navigateToCharacterCreation && (
            <Edit color="accent-1" onClick={() => navigateToCharacterCreation(7)} style={{ cursor: 'pointer' }} />
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
                    <FormUp onClick={() => setShowMoveDetails(showMoveDetails.filter((m) => m !== move.id))} />
                  ) : (
                    <FormDown onClick={() => setShowMoveDetails([...showMoveDetails, move.id])} />
                  )}
                  <Heading level="3" margin={{ top: '3px', bottom: '3px' }}>
                    {decapitalize(move.name)}
                  </Heading>
                </Box>
                {!!move.stat && userGameRole?.role !== Roles.mc && <Button secondary label="ROLL" />}
              </Box>

              {showMoveDetails.includes(move.id) && (
                <Box fill="horizontal" pad="12px" animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}>
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
