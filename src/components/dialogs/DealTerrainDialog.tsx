import React, { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Box, Select } from 'grommet';

import DialogWrapper from '../DialogWrapper';
import { StyledMarkdown } from '../styledComponents';
import { HeadingWS, ParagraphWS, ButtonWS, dealTerrainDialogBackground } from '../../config/grommetConfig';
import PERFORM_SPEED_ROLL_MOVE, {
  PerformSpeedRollMoveData,
  PerformSpeedRollMoveVars,
} from '../../mutations/performSpeedRollMove';
import { CharacterMove, Move } from '../../@types/staticDataInterfaces';
import { useFonts } from '../../contexts/fontContext';
import { useGame } from '../../contexts/gameContext';
import { Vehicle } from '../../@types/dataInterfaces';
import { dummyVehicleFrame } from '../../tests/mocks';
import { VehicleType } from '../../@types/enums';

interface DealTerrainDialogProps {
  move: Move | CharacterMove;
  handleClose: () => void;
}

const DealTerrainDialog: FC<DealTerrainDialogProps> = ({ move, handleClose }) => {
  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [myHandling, setMyHandling] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | undefined>();
  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //
  const { gameId } = useParams<{ gameId: string }>();

  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { crustReady } = useFonts();
  const { userGameRole, character } = useGame();

  // ------------------------------------------------------ graphQL -------------------------------------------------------- //
  const [performSpeedRollMove, { loading: performingSpeedRollMove }] = useMutation<
    PerformSpeedRollMoveData,
    PerformSpeedRollMoveVars
  >(PERFORM_SPEED_ROLL_MOVE);

  // ------------------------------------------------- Component functions -------------------------------------------------- //
  const otherVehicle: Vehicle = {
    id: 'other-vehicle-id',
    vehicleType: VehicleType.car,
    name: 'Other',
    vehicleFrame: dummyVehicleFrame,
    speed: 0,
    handling: 0,
    armor: 0,
    massive: 0,
    strengths: [],
    weaknesses: [],
    looks: [],
    battleOptions: [],
  };

  const handleSpeedRollMove = () => {
    if (!!userGameRole && !!character && !performingSpeedRollMove && !!myHandling) {
      const modifier = parseInt(myHandling);
      try {
        performSpeedRollMove({
          variables: {
            gameId,
            gameroleId: userGameRole.id,
            characterId: userGameRole.characters[0].id,
            moveId: move.id,
            modifier,
          },
        });
        handleClose();
      } catch (error) {
        console.error(error);
      }
    }
  };

  // ------------------------------------------------------ Render -------------------------------------------------------- //
  const renderVehicleChoice = () => {
    if (!!character && character.vehicles.length > 0) {
      return (
        <Box fill align="start" justify="start">
          <ParagraphWS alignSelf="start">What are you driving?</ParagraphWS>
          <Select
            id="target-character-input"
            aria-label="target-character-input"
            name="target-character"
            placeholder="My vehicle"
            options={[...character.vehicles, otherVehicle]}
            labelKey="name"
            valueKey="name"
            onChange={(e) => {
              setSelectedVehicle(e.value);
              if (e.value.id !== 'other-vehicle-id') {
                setMyHandling(e.value.handling.toString());
              } else {
                setMyHandling('');
              }
            }}
          />
          {selectedVehicle?.id === 'other-vehicle-id' && (
            <Select
              id="target-character-input"
              aria-label="target-character-input"
              name="target-character"
              placeholder="My handling"
              options={['0', '1', '2', '3']}
              value={myHandling}
              onChange={(e) => setMyHandling(e.value)}
              margin={{ top: '12px' }}
            />
          )}
        </Box>
      );
    } else if (!!character) {
      return (
        <Box fill align="start" justify="start">
          <ParagraphWS alignSelf="start">What is the speed of your vehicle?</ParagraphWS>
          <Select
            id="target-character-input"
            aria-label="target-character-input"
            name="target-character"
            placeholder="My handling"
            options={['0', '1', '2', '3']}
            value={myHandling}
            onChange={(e) => setMyHandling(e.value)}
          />
        </Box>
      );
    }
  };

  return (
    <DialogWrapper background={dealTerrainDialogBackground} handleClose={handleClose}>
      <Box gap="12px">
        <HeadingWS crustReady={crustReady} level={4} alignSelf="start">
          {move.name}
        </HeadingWS>
        <StyledMarkdown>{move.description}</StyledMarkdown>
        <Box direction="row" gap="24px">
          {character && renderVehicleChoice()}
        </Box>
        <Box fill="horizontal" direction="row" justify="end" gap="small">
          <ButtonWS
            label="CANCEL"
            style={{
              background: 'transparent',
              textShadow: '0 0 1px #000, 0 0 3px #000, 0 0 5px #000, 0 0 10px #000',
            }}
            onClick={handleClose}
          />
          <ButtonWS
            label={'DRIVE'}
            primary
            onClick={() => !performingSpeedRollMove && handleSpeedRollMove()}
            disabled={performingSpeedRollMove || !myHandling}
          />
        </Box>
      </Box>
    </DialogWrapper>
  );
};

export default DealTerrainDialog;
