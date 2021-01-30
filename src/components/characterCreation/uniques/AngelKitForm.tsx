import React, { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import { useMutation, useQuery } from '@apollo/client';
import { Box } from 'grommet';

import Spinner from '../../Spinner';
import { ButtonWS, HeadingWS, RedBox } from '../../../config/grommetConfig';
import SET_ANGEL_KIT, { SetAngelKitData, SetAngelKitVars } from '../../../mutations/setAngelKit';
import PLAYBOOK_CREATOR, { PlaybookCreatorData, PlaybookCreatorVars } from '../../../queries/playbookCreator';
import { useFonts } from '../../../contexts/fontContext';
import { useGame } from '../../../contexts/gameContext';
import { useHistory } from 'react-router-dom';
import { CharacterCreationSteps, PlaybookType } from '../../../@types/enums';

const AngelKitForm: FC = () => {
  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { game, character, userGameRole } = useGame();
  const { crustReady } = useFonts();

  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //
  const history = useHistory();

  // ------------------------------------------------------ graphQL -------------------------------------------------------- //
  const { data: pbCreatorData } = useQuery<PlaybookCreatorData, PlaybookCreatorVars>(PLAYBOOK_CREATOR, {
    variables: { playbookType: PlaybookType.angel },
  });
  const { angelKitInstructions, startingStock } =
    pbCreatorData?.playbookCreator.playbookUniqueCreator?.angelKitCreator || {};
  const [setAngelKit, { loading: settingAngelKit }] = useMutation<SetAngelKitData, SetAngelKitVars>(SET_ANGEL_KIT);

  // ------------------------------------------------- Component functions -------------------------------------------------- //
  const handleSubmitAngelKit = async (stock: number, hasSupplier: boolean) => {
    if (!!userGameRole && !!character && !!game) {
      try {
        await setAngelKit({
          variables: { gameRoleId: userGameRole.id, characterId: character.id, stock, hasSupplier },
        });

        if (!character.hasCompletedCharacterCreation) {
          history.push(`/character-creation/${game.id}?step=${CharacterCreationSteps.selectMoves}`);
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  // ------------------------------------------------------ Render -------------------------------------------------------- //

  return (
    <Box
      data-testid="angel-kit-form"
      width="60vw"
      direction="column"
      align="start"
      justify="between"
      overflow="auto"
      flex="grow"
    >
      <HeadingWS crustReady={crustReady} level={2} alignSelf="center">{`${
        !!character?.name ? character.name?.toUpperCase() : '...'
      }'S ANGEL KIT`}</HeadingWS>
      <Box flex="grow" direction="row" align="start">
        <Box fill="horizontal">{!!angelKitInstructions && <ReactMarkdown>{angelKitInstructions}</ReactMarkdown>}</Box>
        <Box gap="12px" width="150px" margin={{ left: '24px', right: '5px', top: '18px' }} align="center">
          <RedBox align="center" justify="between" pad="24px" fill="horizontal">
            <HeadingWS crustReady={crustReady} level={3} margin="6px">
              Stock
            </HeadingWS>
            <HeadingWS aria-label="stock-value" crustReady={crustReady} level={2} margin={{ vertical: '3px' }}>
              {startingStock}
            </HeadingWS>
          </RedBox>
          <Box fill style={{ minHeight: 52 }}>
            <ButtonWS
              label={settingAngelKit ? <Spinner fillColor="#FFF" width="37px" height="36px" /> : 'SET'}
              primary
              onClick={() => !settingAngelKit && !!startingStock && handleSubmitAngelKit(startingStock, false)}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AngelKitForm;
