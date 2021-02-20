import React, { FC, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { Box, Tab, Tabs, Tip } from 'grommet';
import { AddCircle } from 'grommet-icons';

import Spinner from '../Spinner';
import BattleVehicleForm from './BattleVehicleForm';
import { ButtonWS, ParagraphWS } from '../../config/grommetConfig';
import SET_BATTLE_VEHICLE_COUNT, {
  SetBattleVehicleCountData,
  SetBattleVehicleCountVars,
} from '../../mutations/setBattleVehicleCount';
import { CharacterCreationSteps } from '../../@types/enums';
import { useGame } from '../../contexts/gameContext';
import { decapitalize } from '../../helpers/decapitalize';

const BattleVehiclesFormContainer: FC = () => {
  // -------------------------------------------------- Component state ---------------------------------------------------- //

  const [activeTab, setActiveTab] = useState(0);

  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { game, character, userGameRole } = useGame();

  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //
  const history = useHistory();

  // --------------------------------------------------- Graphql hooks ----------------------------------------------------- //
  const [setBattleVehicleCount, { loading: settingBattleVehicleCount }] = useMutation<
    SetBattleVehicleCountData,
    SetBattleVehicleCountVars
  >(SET_BATTLE_VEHICLE_COUNT);

  // ------------------------------------------------- Component functions -------------------------------------------------- //

  const handleAddVehicle = async () => {
    if (!!userGameRole && !!character && !!game) {
      const battleVehicleCount = character.battleVehicleCount + 1;
      try {
        await setBattleVehicleCount({
          variables: { gameRoleId: userGameRole.id, characterId: character.id, battleVehicleCount },
          optimisticResponse: {
            __typename: 'Mutation',
            setBattleVehicleCount: {
              __typename: 'Character',
              ...character,
              battleVehicleCount,
            },
          },
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const navigateOnSet = (numVehicles: number) => {
    if (!character?.hasCompletedCharacterCreation && !!game) {
      if (character?.battleVehicleCount === numVehicles) {
        history.push(`/character-creation/${game.id}?step=${CharacterCreationSteps.setHx}`);
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      } else {
        !!character && setActiveTab((prevTab) => (prevTab < character.vehicleCount ? prevTab + 1 : prevTab));
      }
    }
  };

  // ------------------------------------------------------ Render -------------------------------------------------------- //

  if (!character) {
    return <Spinner />;
  }

  if (character.battleVehicleCount === 0) {
    // If a non-vehicle character makes it here accidentally, they can use the stepper to navigate away.
    // In future, may give the ability to add vehicles outside the rules
    return (
      <Box
        fill
        direction="column"
        animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
        pad="12px"
        align="center"
        justify="start"
      >
        <ParagraphWS>By default, the {decapitalize(character.playbook)} has no battle vehicles.</ParagraphWS>
        <ParagraphWS>If you’d like to start play with a battle vehicle, get with the MC.</ParagraphWS>
        <Box direction="row" gap="12px">
          <Box style={{ minHeight: 52 }}>
            <ButtonWS
              label="ADD VEHICLE"
              secondary
              onClick={() => !settingBattleVehicleCount && handleAddVehicle()}
              disabled={settingBattleVehicleCount}
            />
          </Box>
          <Box style={{ minHeight: 52 }}>
            <ButtonWS
              label="PASS"
              primary
              onClick={() => !!game && history.push(`/character-creation/${game.id}?step=${CharacterCreationSteps.setHx}`)}
            />
          </Box>
        </Box>
      </Box>
    );
  } else if (character.battleVehicleCount > 0) {
    return (
      <Box
        fill
        direction="column"
        animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
        pad="12px"
        align="center"
        justify="start"
      >
        <Tabs activeIndex={activeTab} onActive={(tab) => setActiveTab(tab)}>
          {/*
          // @ts-ignore */}
          {[...Array(character.battleVehicleCount).keys()].map((number) => (
            <Tab key={number} title={`Battle Vehicle ${number + 1}`}>
              <BattleVehicleForm navigateOnSet={navigateOnSet} existingVehicle={character.battleVehicles[number]} />
            </Tab>
          ))}
          {character.battleVehicleCount === character.battleVehicles.length && (
            <Tip content="Add another vehicle">
              <Box margin={{ horizontal: '24px' }} justify="center" align="center">
                <AddCircle color="brand" style={{ cursor: 'pointer' }} onClick={() => handleAddVehicle()} />
              </Box>
            </Tip>
          )}
        </Tabs>
      </Box>
    );
  } else {
    return <Spinner />;
  }
};

export default BattleVehiclesFormContainer;
