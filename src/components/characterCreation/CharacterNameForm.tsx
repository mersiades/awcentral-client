import React, { FC, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { Box, TextInput, Text, Form, FormField } from 'grommet';

import Spinner from '../Spinner';
import { ButtonWS, HeadingWS } from '../../config/grommetConfig';
import PLAYBOOK_CREATOR, { PlaybookCreatorData, PlaybookCreatorVars } from '../../queries/playbookCreator';
import SET_CHARACTER_NAME, { SetCharacterNameData, SetCharacterNameVars } from '../../mutations/setCharacterName';
import { CharacterCreationSteps } from '../../@types/enums';
import { useFonts } from '../../contexts/fontContext';
import { useGame } from '../../contexts/gameContext';
import { decapitalize } from '../../helpers/decapitalize';

const CharacterNameForm: FC = () => {
  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { game, character, userGameRole } = useGame();
  const { crustReady } = useFonts();

  // --------------------------------------------------3rd party hooks ----------------------------------------------------- //
  const history = useHistory();

  const [value, setValue] = useState(!!character?.name ? { characterName: character.name } : { characterName: '' });

  // ------------------------------------------------------ graphQL -------------------------------------------------------- //
  const { data: pbCreatorData } = useQuery<PlaybookCreatorData, PlaybookCreatorVars>(
    PLAYBOOK_CREATOR,
    // @ts-ignore
    { variables: { playbookType: character?.playbook }, skip: !character?.playbook }
  );
  const names = pbCreatorData?.playbookCreator.names;
  const [setCharacterName, { loading: settingName }] = useMutation<SetCharacterNameData, SetCharacterNameVars>(
    SET_CHARACTER_NAME
  );

  // ---------------------------------------- Component functions and variables ------------------------------------------ //
  const handleSubmitName = async (name: string) => {
    if (!!userGameRole && !!character && !!game) {
      try {
        await setCharacterName({
          variables: { gameRoleId: userGameRole.id, characterId: character.id, name },
        });
        history.push(`/character-creation/${game.id}?step=${CharacterCreationSteps.selectLooks}`);
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      } catch (error) {
        console.error(error);
      }
    }
  };

  // -------------------------------------------------- Render component  ---------------------------------------------------- //

  // Force navigation back to playbook selection if somehow the character doesn't have a playbook at this stage
  if (!!character && !!game && !character.playbook) {
    history.push(`/character-creation/${game.id}?step=${CharacterCreationSteps.selectPlaybook}`);
    return <div />;
  }

  return (
    <Box
      fill
      direction="column"
      background="transparent"
      pad="24px"
      align="center"
      justify="start"
      animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
    >
      <Form
        value={value}
        onChange={(nextValue: any) => setValue(nextValue)}
        onReset={() => setValue({ characterName: '' })}
        onSubmit={({ value }: any) => handleSubmitName(value.characterName)}
      >
        <Box width="50vw" flex="grow" align="center">
          <HeadingWS crustReady={crustReady} level={2}>{`WHAT IS THE ${
            !!character?.playbook ? decapitalize(character?.playbook).toUpperCase() : '...'
          } CALLED?`}</HeadingWS>
          <Box direction="row" align="center" gap="12px">
            <FormField name="characterName" width="100%">
              <TextInput placeholder="Type or select name" name="characterName" size="xxlarge" />
            </FormField>

            <ButtonWS type="reset" label="CLEAR" />
            <ButtonWS
              type="submit"
              primary
              label={settingName ? <Spinner fillColor="#FFF" width="37px" height="36px" /> : 'SET'}
              disabled={value.characterName === ''}
            />
          </Box>
          <Box direction="row" margin={{ top: '3px' }} wrap overflow="auto">
            {!!names &&
              names.map((name) => (
                <Box
                  data-testid={`${name.name}-pill`}
                  key={name.id}
                  background="#4C684C"
                  round="medium"
                  pad={{ top: '3px', bottom: '1px', horizontal: '12px' }}
                  margin={{ vertical: '3px', horizontal: '3px' }}
                  justify="center"
                  onClick={() => setValue({ characterName: name.name })}
                  hoverIndicator={{ color: '#698D70', dark: true }}
                >
                  <Text weight="bold" size="large">
                    {name.name}
                  </Text>
                </Box>
              ))}
          </Box>
        </Box>
      </Form>
    </Box>
  );
};

export default CharacterNameForm;
