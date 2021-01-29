import React, { FC } from 'react';
import { Box } from 'grommet';

import Spinner from '../Spinner';
import AngelKitForm from './uniques/AngelKitForm';
import CustomWeaponsForm from './uniques/CustomWeaponsForm';
import BrainerGearForm from './uniques/BrainerGearForm';
import { PlaybookType } from '../../@types/enums';
import VehiclesFormContainer from './uniques/VehiclesFormContainer';
import { useGame } from '../../contexts/gameContext';

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
  const { character } = useGame();

  // ------------------------------------------------------ Render -------------------------------------------------------- //
  const renderForm = () => {
    switch (character?.playbook) {
      case PlaybookType.angel:
        return <AngelKitForm />;
      case PlaybookType.battlebabe:
        return <CustomWeaponsForm />;
      case PlaybookType.brainer:
        return <BrainerGearForm />;
      case PlaybookType.driver:
        return <VehiclesFormContainer />;
      default:
        return null;
    }
  };

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
