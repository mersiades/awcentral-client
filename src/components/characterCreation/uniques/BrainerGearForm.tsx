import React, { FC, useState } from 'react';
import { Box, CheckBox, Text } from 'grommet';

import Spinner from '../../Spinner';
import { ButtonWS, HeadingWS, ParagraphWS } from '../../../config/grommetConfig';
import { StyledMarkdown } from '../../styledComponents';
import { useFonts } from '../../../contexts/fontContext';
import { useGame } from '../../../contexts/gameContext';
import { useMutation, useQuery } from '@apollo/client';
import PLAYBOOK_CREATOR, { PlaybookCreatorData, PlaybookCreatorVars } from '../../../queries/playbookCreator';
import SET_BRAINER_GEAR, { SetBrainerGearData, SetBrainerGearVars } from '../../../mutations/setBrainerGear';
import { useHistory } from 'react-router-dom';
import { CharacterCreationSteps, PlaybookType } from '../../../@types/enums';

const BrainerGearForm: FC = () => {
  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { game, character, userGameRole } = useGame();
  const { crustReady } = useFonts();

  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [selectedGear, setSelectedGear] = useState(
    !!character?.playbookUnique?.brainerGear ? character.playbookUnique.brainerGear.brainerGear : []
  );

  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //
  const history = useHistory();

  // ------------------------------------------------------ graphQL -------------------------------------------------------- //
  const { data: pbCreatorData } = useQuery<PlaybookCreatorData, PlaybookCreatorVars>(PLAYBOOK_CREATOR, {
    variables: { playbookType: PlaybookType.brainer },
    skip: !character,
  });
  const playbookUniqueCreator = pbCreatorData?.playbookCreator.playbookUniqueCreator;
  const [setBrainerGear, { loading: settingBrainerGear }] = useMutation<SetBrainerGearData, SetBrainerGearVars>(
    SET_BRAINER_GEAR
  );

  // ------------------------------------------------- Component functions -------------------------------------------------- //
  const handleSelectItem = (item: string) => {
    if (selectedGear.includes(item)) {
      setSelectedGear(selectedGear.filter((gear) => gear !== item));
    } else {
      selectedGear.length < 2 && setSelectedGear([...selectedGear, item]);
    }
  };

  const handleSubmitBrainerGear = async (brainerGear: string[]) => {
    if (!!userGameRole && !!character && !!game) {
      try {
        await setBrainerGear({
          variables: { gameRoleId: userGameRole.id, characterId: character.id, brainerGear },
          // refetchQueries: [{ query: GAME, variables: { gameId } }],
        });
        history.push(`/character-creation/${game.id}?step=${CharacterCreationSteps.selectMoves}`);
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      } catch (error) {
        console.error(error);
      }
    }
  };

  // ------------------------------------------------------ Render -------------------------------------------------------- //
  return (
    <Box data-testid="brainer-gear-form" justify="start" width="85vw" align="start" pad="24px" style={{ maxWidth: '763px' }}>
      <Box direction="row" fill="horizontal" justify="between" align="center">
        <HeadingWS crustReady={crustReady} level={2} style={{ lineHeight: '44px' }}>
          {!!character && !!character.name ? `WHAT SPECIAL BRAINER GEAR DOES ${character.name.toUpperCase()} HAVE?` : '...'}
        </HeadingWS>
        <ButtonWS
          label={settingBrainerGear ? <Spinner fillColor="#FFF" width="37px" height="36px" /> : 'SET'}
          primary
          disabled={selectedGear.length !== 2}
          onClick={() => !settingBrainerGear && handleSubmitBrainerGear(selectedGear)}
        />
      </Box>
      <ParagraphWS size="large">Choose two</ParagraphWS>
      <Box align="start" gap="12px">
        {!!playbookUniqueCreator &&
          playbookUniqueCreator.brainerGearCreator?.gear.map((item, index) => {
            const splitItem = item.split(')');
            return (
              <CheckBox
                key={index}
                label={
                  <div>
                    <Text weight="bold">{splitItem[0] + ') '}</Text>
                    <StyledMarkdown>{splitItem[1]}</StyledMarkdown>
                  </div>
                }
                checked={selectedGear.includes(item)}
                onChange={() => handleSelectItem(item)}
              />
            );
          })}
      </Box>
    </Box>
  );
};

export default BrainerGearForm;
