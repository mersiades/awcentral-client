import { useQuery } from '@apollo/client';
import { Box } from 'grommet';
import React, { FC } from 'react';
import { PlayBooks } from '../@types/enums';
import PLAYBOOK_CREATOR, { PlaybookCreatorData, PlaybookCreatorVars } from '../queries/playbookCreator';
import Spinner from './Spinner';
import UniqueFormBrainer from './UniqueFormBrainer';

interface PlaybookUniqueFormContainerProps {
  playbookType: PlayBooks;
  characterName: string;
  handleSubmitBrainerGear: (brainerGear: string[]) => void;
}

const PlaybookUniqueFormContainer: FC<PlaybookUniqueFormContainerProps> = ({
  playbookType,
  characterName,
  handleSubmitBrainerGear,
}) => {
  const { data: pbCreatorData } = useQuery<PlaybookCreatorData, PlaybookCreatorVars>(PLAYBOOK_CREATOR, {
    variables: { playbookType },
  });

  const playbookUniqueCreator = pbCreatorData?.playbookCreator.playbookUniqueCreator;

  if (!playbookUniqueCreator) {
    return (
      <Box fill background="black" justify="center" align="center">
        <Spinner />
      </Box>
    );
  }

  const renderForm = () => {
    switch (playbookType) {
      case PlayBooks.angel:
        return null;
      case PlayBooks.battlebabe:
        return null;
      case PlayBooks.brainer:
        return (
          <UniqueFormBrainer
            characterName={characterName}
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
      background="black"
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
