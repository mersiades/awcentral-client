import React, { FC } from 'react';
import { useQuery } from '@apollo/client';
import { Box } from 'grommet';

import Spinner from '../Spinner';
import AngelKitForm from './uniques/AngelKitForm';
import CustomWeaponsForm from './uniques/CustomWeaponsForm';
import BrainerGearForm from './uniques/BrainerGearForm';
import { AngelKit, BrainerGear, CustomWeapons } from '../../@types/dataInterfaces';
import { PlayBooks } from '../../@types/enums';
import PLAYBOOK_CREATOR, { PlaybookCreatorData, PlaybookCreatorVars } from '../../queries/playbookCreator';

interface PlaybookUniqueRouterProps {
  playbookType: PlayBooks;
  characterName: string;
  settingAngelKit: boolean;
  settingCustomWeapons: boolean;
  settingBrainerGear: boolean;
  handleSubmitBrainerGear: (brainerGear: string[]) => void;
  handleSubmitAngelKit: (stock: number, hasSupplier: boolean) => void;
  handleSubmitCustomWeapons: (weapons: string[]) => void;
  existingCustomWeapons?: CustomWeapons;
  existingAngelKit?: AngelKit;
  existingBrainerGear?: BrainerGear;
}

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
const PlaybookUniqueRouter: FC<PlaybookUniqueRouterProps> = ({
  playbookType,
  characterName,
  settingAngelKit,
  settingCustomWeapons,
  settingBrainerGear,
  handleSubmitAngelKit,
  handleSubmitBrainerGear,
  handleSubmitCustomWeapons,
  existingCustomWeapons,
  existingAngelKit,
  existingBrainerGear,
}) => {
  const { data: pbCreatorData } = useQuery<PlaybookCreatorData, PlaybookCreatorVars>(PLAYBOOK_CREATOR, {
    variables: { playbookType },
  });

  const playbookUniqueCreator = pbCreatorData?.playbookCreator.playbookUniqueCreator;

  if (!playbookUniqueCreator) {
    return (
      <Box fill background="transparent" justify="center" align="center">
        <Spinner />
      </Box>
    );
  }

  const renderForm = () => {
    switch (playbookType) {
      case PlayBooks.angel:
        return (
          <AngelKitForm
            characterName={characterName}
            settingAngelKit={settingAngelKit}
            playbookUniqueCreator={playbookUniqueCreator}
            handleSubmitAngelKit={handleSubmitAngelKit}
            existingAngelKit={existingAngelKit}
          />
        );
      case PlayBooks.battlebabe:
        return (
          <CustomWeaponsForm
            characterName={characterName}
            settingCustomWeapons={settingCustomWeapons}
            playbookUniqueCreator={playbookUniqueCreator}
            handleSubmitCustomWeapons={handleSubmitCustomWeapons}
            existingCustomWeapons={existingCustomWeapons}
          />
        );
      case PlayBooks.brainer:
        return (
          <BrainerGearForm
            characterName={characterName}
            settingBrainerGear={settingBrainerGear}
            playbookUniqueCreator={playbookUniqueCreator}
            handleSubmitBrainerGear={handleSubmitBrainerGear}
            existingBrainerGear={existingBrainerGear}
          />
        );
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
      {renderForm()}
    </Box>
  );
};

export default PlaybookUniqueRouter;
