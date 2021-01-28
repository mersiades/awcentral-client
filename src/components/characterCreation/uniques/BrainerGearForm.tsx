import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { Box, CheckBox, Text } from 'grommet';

import Spinner from '../../Spinner';
import { ButtonWS, HeadingWS, ParagraphWS } from '../../../config/grommetConfig';
import { StyledMarkdown } from '../../styledComponents';
import { BrainerGear } from '../../../@types/dataInterfaces';
import { useFonts } from '../../../contexts/fontContext';
import { useGame } from '../../../contexts/gameContext';
import { useMutation, useQuery } from '@apollo/client';
import PLAYBOOK_CREATOR, { PlaybookCreatorData, PlaybookCreatorVars } from '../../../queries/playbookCreator';
import SET_BRAINER_GEAR, { SetBrainerGearData, SetBrainerGearVars } from '../../../mutations/setBrainerGear';

interface BrainerGearFormProps {
  existingBrainerGear?: BrainerGear;
  setCreationStep: Dispatch<SetStateAction<number>>;
}

const BrainerGearForm: FC<BrainerGearFormProps> = ({ setCreationStep, existingBrainerGear }) => {
  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [selectedGear, setSelectedGear] = useState(!!existingBrainerGear ? existingBrainerGear.brainerGear : []);

  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { character, userGameRole } = useGame();
  const { crustReady } = useFonts();

  // ------------------------------------------------------ graphQL -------------------------------------------------------- //
  const { data: pbCreatorData } = useQuery<PlaybookCreatorData, PlaybookCreatorVars>(PLAYBOOK_CREATOR, {
    // @ts-ignore
    variables: { playbookType: character?.playbook },
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
    if (!!userGameRole && !!character) {
      try {
        await setBrainerGear({
          variables: { gameRoleId: userGameRole.id, characterId: character.id, brainerGear },
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
  return (
    <Box data-testid="brainer-gear-form" width="70vw" flex="grow" direction="column" align="center" justify="between">
      <HeadingWS crustReady={crustReady} level={2}>
        {!!character && !!character.name ? `WHAT SPECIAL BRAINER GEAR DOES ${character.name.toUpperCase()} HAVE?` : '...'}
      </HeadingWS>
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
      <Box fill="horizontal" direction="row" justify="end">
        <ButtonWS
          label={settingBrainerGear ? <Spinner fillColor="#FFF" width="37px" height="36px" /> : 'SET'}
          primary
          disabled={selectedGear.length !== 2}
          onClick={() => !settingBrainerGear && handleSubmitBrainerGear(selectedGear)}
        />
      </Box>
    </Box>
  );
};

export default BrainerGearForm;
