import React, { FC, useState } from 'react';
import { omit } from 'lodash';
import { useMutation, useQuery } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import { Box, FormField, TextInput } from 'grommet';

import Spinner from '../Spinner';
import StatsBox from '../playbookPanel/StatsBox';
import { ButtonWS, HeadingWS, RedBox, TextWS } from '../../config/grommetConfig';
import PLAYBOOK_CREATOR, { PlaybookCreatorData, PlaybookCreatorVars } from '../../queries/playbookCreator';
import TOGGLE_STAT_HIGHLIGHT, {
  getToggleStatHighlightOR,
  ToggleStatHighlightData,
  ToggleStatHighlightVars,
} from '../../mutations/toggleStatHighlight';
import FINISH_CHARACTER_CREATION, {
  FinishCharacterCreationData,
  FinishCharacterCreationVars,
  getFinishCharacterCreationOR,
} from '../../mutations/finishCharacterCreation';
import ADJUST_CHARACTER_HX, {
  AdjustCharacterHxData,
  AdjustCharacterHxVars,
  getAdjustCharacterHxOR,
} from '../../mutations/adjustCharacterHx';
import { StatType } from '../../@types/enums';
import { HxInput } from '../../@types';
import { Character } from '../../@types/dataInterfaces';
import { useFonts } from '../../contexts/fontContext';
import { useGame } from '../../contexts/gameContext';
import { decapitalize } from '../../helpers/decapitalize';

const StyledMarkdown = styled(ReactMarkdown)`
  & p {
    margin-top: 6px;
    margin-bottom: 6px;
    margin-left: 0px;
    margin-right: 0px;
  }
`;

const CharacterHxForm: FC = () => {
  // ------------------------------------------------------- State --------------------------------------------------------- //]
  const [errorIds, setErrorIds] = useState<string[]>([]);
  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { game, character, userGameRole, otherPlayerGameRoles } = useGame();
  const { crustReady } = useFonts();

  // --------------------------------------------------3rd party hooks ----------------------------------------------------- //
  const history = useHistory();

  // -------------------------------------------------- Graphql hooks ---------------------------------------------------- //
  const { data: pbCreatorData } = useQuery<PlaybookCreatorData, PlaybookCreatorVars>(
    PLAYBOOK_CREATOR,
    // @ts-ignore
    { variables: { playbookType: character?.playbook }, skip: !character?.playbook }
  );
  const hxInstructions = pbCreatorData?.playbookCreator.hxInstructions;
  const [toggleStatHighlight, { loading: togglingHighlight }] = useMutation<
    ToggleStatHighlightData,
    ToggleStatHighlightVars
  >(TOGGLE_STAT_HIGHLIGHT);
  const [adjustCharacterHx, { loading: adjustingHx }] = useMutation<AdjustCharacterHxData, AdjustCharacterHxVars>(
    ADJUST_CHARACTER_HX
  );
  const [finishCharacterCreation, { loading: finishingCreation }] = useMutation<
    FinishCharacterCreationData,
    FinishCharacterCreationVars
  >(FINISH_CHARACTER_CREATION);

  // ------------------------------------------ Component functions and variables ------------------------------------------ //
  let characters: Character[] = [];
  otherPlayerGameRoles?.forEach((gameRole) => {
    if (!!gameRole.characters && gameRole.characters.length === 1) {
      characters = [...characters, gameRole.characters[0]];
    }
  });

  const handleToggleHighlight = async (stat: StatType) => {
    if (!!userGameRole && !!character) {
      try {
        await toggleStatHighlight({
          variables: { gameRoleId: userGameRole.id, characterId: character.id, stat },
          optimisticResponse: getToggleStatHighlightOR(character, stat) as ToggleStatHighlightData,
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleAdjustHx = async (hxInput: HxInput) => {
    if (!!userGameRole && !!character) {
      try {
        await adjustCharacterHx({
          variables: { gameRoleId: userGameRole.id, characterId: character.id, hxStat: hxInput },
          optimisticResponse: getAdjustCharacterHxOR(character, hxInput) as AdjustCharacterHxData,
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleFinishCreation = async () => {
    if (!!userGameRole && !!character && !!game) {
      try {
        if (!character.hasCompletedCharacterCreation) {
          await finishCharacterCreation({
            variables: { gameRoleId: userGameRole.id, characterId: character.id },
            optimisticResponse: getFinishCharacterCreationOR(character) as FinishCharacterCreationData,
          });
        }
        history.push(`/pre-game/${game.id}`);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <Box
      data-testid="character-hx-form"
      fill
      align="center"
      justify="start"
      animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
    >
      <Box width="85vw" align="start" style={{ maxWidth: '742px' }} margin={{ bottom: '24px' }}>
        <Box direction="row" fill="horizontal" justify="between" align="center">
          <HeadingWS
            level={2}
            crustReady={crustReady}
            textAlign="center"
            style={{ maxWidth: 'unset', height: '34px' }}
          >{`WHAT HISTORY DOES ${!!character?.name ? character.name.toUpperCase() : '...'} HAVE?`}</HeadingWS>
          <ButtonWS
            primary
            label={finishingCreation ? <Spinner fillColor="#FFF" width="138px" height="36px" /> : 'GO TO GAME'}
            style={{ minHeight: '52px' }}
            disabled={
              character?.hxBlock.length !== otherPlayerGameRoles?.length ||
              character?.statsBlock?.stats.filter((stat) => stat.isHighlighted === true).length !== 2
            }
            onClick={() => !finishingCreation && handleFinishCreation()}
          />
        </Box>
        <Box direction="row" wrap justify="around">
          {characters.map((char) => {
            const looks = char.looks?.map((look) => look.look);
            let hxStat: HxInput;
            const existingHxStat = character?.hxBlock.find((hxStat) => hxStat.characterId === char.id);
            if (!!existingHxStat) {
              hxStat = omit(existingHxStat, ['__typename']) as HxInput;
            } else {
              // Create new HxStat
              hxStat = {
                id: undefined,
                characterId: char.id,
                characterName: char.name as string,
                hxValue: 0,
              };
            }
            return (
              !!char.name && (
                <RedBox
                  data-testid={`${char.name}-hx-box`}
                  key={char.id}
                  direction="row"
                  width="350px"
                  margin={{ right: '12px', bottom: '12px' }}
                >
                  <Box pad="12px" fill="vertical" justify="center" width="100px" align="center">
                    <HeadingWS level={4} style={{ marginTop: '6px', marginBottom: '6px' }}>
                      {char.name}
                    </HeadingWS>
                    <FormField name={char.id}>
                      <TextInput
                        name={char.id}
                        aria-label={`${char.name}-hx-input`}
                        size="xlarge"
                        textAlign="center"
                        type="text"
                        maxLength={2}
                        defaultValue={existingHxStat?.hxValue.toString() || '0'}
                        onChange={(e) => {
                          const match = e.target.value.match(/^-?[1-3]$/gm);
                          if (!!match) {
                            setErrorIds(errorIds.filter((id) => id !== char.id));
                            match.length == 1 && !adjustingHx && handleAdjustHx({ ...hxStat, hxValue: parseInt(match[0]) });
                          } else {
                            e.preventDefault();
                            if (!['', '-'].includes(e.target.value)) {
                              setErrorIds([...errorIds, char.id]);
                            } else {
                              setErrorIds(errorIds.filter((id) => id !== char.id));
                            }
                          }
                        }}
                      />
                    </FormField>
                  </Box>
                  <Box width="250px" pad="12px">
                    <HeadingWS level={4} style={{ marginTop: '6px', marginBottom: '6px' }}>
                      {!!char.playbook && 'the ' + decapitalize(char.playbook)}
                    </HeadingWS>
                    {!!looks && <TextWS size="small">{looks.join(', ')}</TextWS>}
                    {errorIds.includes(char.id) && (
                      <TextWS color="accent-3" size="small">
                        Enter digits from -3 to 3
                      </TextWS>
                    )}
                  </Box>
                </RedBox>
              )
            );
          })}
        </Box>
        <Box pad="6px" style={{ maxWidth: '812px' }}>
          <StyledMarkdown>{hxInstructions}</StyledMarkdown>
        </Box>
        {!!character?.statsBlock && (
          <StatsBox
            stats={character.statsBlock.stats}
            togglingHighlight={togglingHighlight}
            handleToggleHighlight={handleToggleHighlight}
          />
        )}
      </Box>
    </Box>
  );
};

export default CharacterHxForm;
