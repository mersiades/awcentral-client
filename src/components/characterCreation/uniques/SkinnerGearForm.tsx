import React, { FC, useEffect, useState } from 'react';
import { Box, CheckBox, Text } from 'grommet';

import Spinner from '../../Spinner';
import { ButtonWS, HeadingWS, ParagraphWS, TextWS } from '../../../config/grommetConfig';
import { StyledMarkdown } from '../../styledComponents';
import { useFonts } from '../../../contexts/fontContext';
import { useGame } from '../../../contexts/gameContext';
import { useMutation, useQuery } from '@apollo/client';
import PLAYBOOK_CREATOR, { PlaybookCreatorData, PlaybookCreatorVars } from '../../../queries/playbookCreator';
import SET_BRAINER_GEAR, { SetBrainerGearData, SetBrainerGearVars } from '../../../mutations/setBrainerGear';
import { useHistory } from 'react-router-dom';
import { CharacterCreationSteps, PlaybookType } from '../../../@types/enums';
import { SkinnerGearItem } from '../../../@types/staticDataInterfaces';

const SkinnerGearForm: FC = () => {
  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { game, character, userGameRole } = useGame();
  const { crustReady } = useFonts();

  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [selectedWeapon, setSelectedWeapon] = useState<SkinnerGearItem | undefined>();
  const [selectedGear, setSelectedGear] = useState<SkinnerGearItem[]>([]);

  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //
  const history = useHistory();

  // ------------------------------------------------------ graphQL -------------------------------------------------------- //
  const { data: pbCreatorData } = useQuery<PlaybookCreatorData, PlaybookCreatorVars>(PLAYBOOK_CREATOR, {
    variables: { playbookType: PlaybookType.skinner },
  });
  const gearCreator = pbCreatorData?.playbookCreator.playbookUniqueCreator?.skinnerGearCreator;

  const [setBrainerGear, { loading: settingBrainerGear }] = useMutation<SetBrainerGearData, SetBrainerGearVars>(
    SET_BRAINER_GEAR
  );

  // ------------------------------------------------- Component functions -------------------------------------------------- //
  const handleSelectGear = (item: SkinnerGearItem) => {
    if (!!gearCreator) {
      if (selectedGear.includes(item)) {
        setSelectedGear(selectedGear.filter((gear) => gear.id !== item.id));
      } else {
        selectedGear.length < gearCreator?.luxeGearCount && setSelectedGear([...selectedGear, item]);
      }
    }
  };

  // const handleSubmitBrainerGear = async (brainerGear: string[]) => {
  //   if (!!userGameRole && !!character && !!game) {
  //     try {
  //       await setBrainerGear({
  //         variables: { gameRoleId: userGameRole.id, characterId: character.id, brainerGear },
  //         // refetchQueries: [{ query: GAME, variables: { gameId } }],
  //       });
  //       history.push(`/character-creation/${game.id}?step=${CharacterCreationSteps.selectMoves}`);
  //       window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  // };
  // ------------------------------------------------------ Effects -------------------------------------------------------- //

  // Load the Character's existing SkinnerGear into component state
  useEffect(() => {
    if (!!character?.playbookUnique?.skinnerGear) {
      setSelectedWeapon(character.playbookUnique.skinnerGear.graciousWeapon);
      setSelectedGear(character.playbookUnique.skinnerGear.luxeGear);
    }
  }, [character]);

  // ------------------------------------------------------ Render -------------------------------------------------------- //
  return (
    <Box data-testid="skinner-gear-form" direction="column" width="70vw" flex="grow" align="center" justify="start">
      <HeadingWS crustReady={crustReady} level={2}>
        {!!character && !!character.name ? `WHAT SPECIAL SKINNER GEAR DOES ${character.name.toUpperCase()} HAVE?` : '...'}
      </HeadingWS>
      <Box border direction="row">
        <Box border direction="column" fill="horizontal" pad="12px">
          <ParagraphWS size="large" margin={{ bottom: '6px' }}>
            Gracious weapons (choose {gearCreator?.graciousWeaponCount})
          </ParagraphWS>
          <Box align="start" gap="12px">
            {!!gearCreator &&
              gearCreator.graciousWeaponChoices.map((item) => {
                return (
                  <CheckBox
                    key={item.id}
                    label={
                      <div>
                        <TextWS weight="bold">{item.item}</TextWS>
                      </div>
                    }
                    checked={item.id === selectedWeapon?.id}
                    onChange={() => setSelectedWeapon(item)}
                  />
                );
              })}
          </Box>
          <ParagraphWS size="large" margin={{ bottom: '6px' }}>
            Luxe gear (choose {gearCreator?.luxeGearCount})
          </ParagraphWS>
          <Box align="start" gap="12px">
            {!!gearCreator &&
              gearCreator.luxeGearChoices.map((item, index) => {
                return (
                  <CheckBox
                    key={item.id}
                    label={
                      <div style={{ maxWidth: '500px' }}>
                        <TextWS weight="bold">{item.item}</TextWS>
                        {!!item.note && (
                          <>
                            <br />
                            <TextWS>
                              <em>{item.note}</em>
                            </TextWS>
                          </>
                        )}
                      </div>
                    }
                    checked={selectedGear.includes(item)}
                    onChange={() => handleSelectGear(item)}
                  />
                );
              })}
          </Box>
        </Box>
        <Box border margin="12px" flex="grow">
          <ButtonWS
            label={settingBrainerGear ? <Spinner fillColor="#FFF" width="37px" height="36px" /> : 'SET'}
            primary
            disabled={selectedGear.length !== 2 || !selectedWeapon}
            // onClick={() => !settingBrainerGear && handleSubmitBrainerGear(selectedGear)}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SkinnerGearForm;
