import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useMutation, useQuery } from '@apollo/client';
import { Box, FormField, TextInput } from 'grommet';

import Spinner from '../../Spinner';
import { ButtonWS, HeadingWS, RedBox } from '../../../config/grommetConfig';
import SET_ANGEL_KIT, { SetAngelKitData, SetAngelKitVars } from '../../../mutations/setAngelKit';
import PLAYBOOK_CREATOR, { PlaybookCreatorData, PlaybookCreatorVars } from '../../../queries/playbookCreator';
import { AngelKit } from '../../../@types/dataInterfaces';
import { useFonts } from '../../../contexts/fontContext';
import { useGame } from '../../../contexts/gameContext';

interface AngelKitFormProps {
  existingAngelKit?: AngelKit;
  setCreationStep: Dispatch<SetStateAction<number>>;
}

const AngelKitForm: FC<AngelKitFormProps> = ({ existingAngelKit, setCreationStep }) => {
  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { character, userGameRole } = useGame();
  const { crustReady } = useFonts();

  // ------------------------------------------------------ graphQL -------------------------------------------------------- //
  const { data: pbCreatorData, loading } = useQuery<PlaybookCreatorData, PlaybookCreatorVars>(PLAYBOOK_CREATOR, {
    // @ts-ignore
    variables: { playbookType: character?.playbook },
    skip: !character,
  });
  const { angelKitInstructions, startingStock } = pbCreatorData?.playbookCreator.playbookUniqueCreator.angelKitCreator || {};
  const [setAngelKit, { loading: settingAngelKit }] = useMutation<SetAngelKitData, SetAngelKitVars>(SET_ANGEL_KIT);

  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [stock, setStock] = useState(!!existingAngelKit ? existingAngelKit.stock : startingStock);

  // ------------------------------------------------- Component functions -------------------------------------------------- //
  const handleSubmitAngelKit = async (stock: number, hasSupplier: boolean) => {
    if (!!userGameRole && !!character) {
      try {
        await setAngelKit({
          variables: { gameRoleId: userGameRole.id, characterId: character.id, stock, hasSupplier },
          // refetchQueries: [{ query: GAME, variables: { gameId } }],
        });
        setCreationStep((prevState) => prevState + 1);
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      } catch (error) {
        console.error(error);
      }
    }
  };

  // ------------------------------------------------------ Render -------------------------------------------------------- //

  if (loading || !character) {
    return <Spinner />;
  }

  return (
    <Box width="60vw" direction="column" align="start" justify="between" overflow="auto" flex="grow">
      <HeadingWS
        crustReady={crustReady}
        level={2}
        alignSelf="center"
      >{`${character.name?.toUpperCase()}'S ANGEL KIT`}</HeadingWS>
      <Box flex="grow" direction="row" align="start">
        <Box fill="horizontal">{!!angelKitInstructions && <ReactMarkdown>{angelKitInstructions}</ReactMarkdown>}</Box>
        <RedBox
          width="150px"
          align="center"
          justify="between"
          pad="24px"
          margin={{ left: '24px', right: '5px', top: '18px' }}
        >
          <HeadingWS crustReady={crustReady} level={3}>
            Stock
          </HeadingWS>
          <FormField>
            <TextInput
              type="number"
              value={stock}
              size="xlarge"
              textAlign="center"
              onChange={(e) => !!existingAngelKit && setStock(parseInt(e.target.value))}
            />
          </FormField>
        </RedBox>
      </Box>
      <Box fill direction="row" justify="end" align="center" style={{ minHeight: 52 }}>
        <ButtonWS
          label={settingAngelKit ? <Spinner fillColor="#FFF" width="37px" height="36px" /> : 'SET'}
          primary
          onClick={() => !settingAngelKit && !!startingStock && handleSubmitAngelKit(startingStock, false)}
          margin={{ right: '5px' }}
        />
      </Box>
    </Box>
  );
};

export default AngelKitForm;
