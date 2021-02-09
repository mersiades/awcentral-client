import React, { FC, useEffect } from 'react';
import { Box } from 'grommet';

import Spinner from '../Spinner';
import AngelKitForm from './uniques/AngelKitForm';
import CustomWeaponsForm from './uniques/CustomWeaponsForm';
import BrainerGearForm from './uniques/BrainerGearForm';
import { CharacterCreationSteps, PlaybookType } from '../../@types/enums';
import { useGame } from '../../contexts/gameContext';
import { useHistory } from 'react-router-dom';
import GangForm from './uniques/GangForm';
import WeaponsForm from './uniques/WeaponsForm';
import HoldingForm from './uniques/HoldingForm';

/**
 * This component acts as a router/switcher, to render the correct
 * PlaybookUnique form for the given PlaybookType.
 *
 * Each PlaybookType has its own property that is unique to it. These are
 * called PlayBookUniques and a different form is required for each one.
 *
 * For example, only the BATTLEBABE has a Custom Weapons property,
 * so only the BATTLEBABE needs a CustomWeaponsForm.
 */
const PlaybookUniqueRouter: FC = () => {
  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { game, character } = useGame();

  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //
  const history = useHistory();

  // ------------------------------------------------------ Render -------------------------------------------------------- //
  const renderForm = () => {
    switch (character?.playbook) {
      case PlaybookType.angel:
        return <AngelKitForm />;
      case PlaybookType.battlebabe:
        return <CustomWeaponsForm />;
      case PlaybookType.brainer:
        return <BrainerGearForm />;
      case PlaybookType.chopper:
        return <GangForm />;
      case PlaybookType.driver:
        break;
      case PlaybookType.gunlugger:
        return <WeaponsForm />;
      case PlaybookType.hardholder:
        return <HoldingForm />;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (character?.playbook === PlaybookType.driver) {
      !!game && history.push(`/character-creation/${game.id}?step=${CharacterCreationSteps.selectMoves}`);
    }
  }, [game, character, history]);

  return (
    <Box
      fill
      direction="column"
      animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
      pad="12px"
      align="center"
      justify="start"
    >
      {!!character ? renderForm() : <Spinner />}
    </Box>
  );
};

export default PlaybookUniqueRouter;
