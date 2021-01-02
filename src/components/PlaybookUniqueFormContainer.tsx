import React, { FC } from 'react';
import { useQuery } from '@apollo/client';
import { Box } from 'grommet';

import Spinner from './Spinner';
import UniqueFormAngel from './UniqueFormAngel';
import UniqueFormBattlebabe from './UniqueFormBattlebabe';
import UniqueFormBrainer from './UniqueFormBrainer';
import { CustomWeapons } from '../@types';
import { PlayBooks } from '../@types/enums';
import PLAYBOOK_CREATOR, { PlaybookCreatorData, PlaybookCreatorVars } from '../queries/playbookCreator';

interface PlaybookUniqueFormContainerProps {
  playbookType: PlayBooks;
  characterName: string;
  settingAngelKit: boolean;
  settingCustomWeapons: boolean;
  settingBrainerGear: boolean;
  handleSubmitBrainerGear: (brainerGear: string[]) => void;
  handleSubmitAngelKit: (stock: number, hasSupplier: boolean) => void;
  handleSubmitCustomWeapons: (weapons: string[]) => void;
  customWeapons?: CustomWeapons;
}

const PlaybookUniqueFormContainer: FC<PlaybookUniqueFormContainerProps> = ({
  playbookType,
  characterName,
  settingAngelKit,
  settingCustomWeapons,
  settingBrainerGear,
  handleSubmitAngelKit,
  handleSubmitBrainerGear,
  handleSubmitCustomWeapons,
  customWeapons,
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
          <UniqueFormAngel
            characterName={characterName}
            settingAngelKit={settingAngelKit}
            playbookUniqueCreator={playbookUniqueCreator}
            handleSubmitAngelKit={handleSubmitAngelKit}
          />
        );
      case PlayBooks.battlebabe:
        return (
          <UniqueFormBattlebabe
            characterName={characterName}
            settingCustomWeapons={settingCustomWeapons}
            playbookUniqueCreator={playbookUniqueCreator}
            handleSubmitCustomWeapons={handleSubmitCustomWeapons}
            customWeapons={customWeapons}
          />
        );
      case PlayBooks.brainer:
        return (
          <UniqueFormBrainer
            characterName={characterName}
            settingBrainerGear={settingBrainerGear}
            playbookUniqueCreator={playbookUniqueCreator}
            handleSubmitBrainerGear={handleSubmitBrainerGear}
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

export default PlaybookUniqueFormContainer;
