import React, { FC, useEffect, useState } from 'react';
import { omit } from 'lodash';
import { useMutation, useQuery } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { Box, CheckBox } from 'grommet';

import Spinner from '../../Spinner';
import { ButtonWS, HeadingWS, ParagraphWS, TextWS } from '../../../config/grommetConfig';
import PLAYBOOK_CREATOR, { PlaybookCreatorData, PlaybookCreatorVars } from '../../../queries/playbookCreator';
import SET_SKINNER_GEAR, { SetSkinnerGearData, SetSkinnerGearVars } from '../../../mutations/setSkinnerGear';
import { CharacterCreationSteps, PlaybookType, UniqueTypes } from '../../../@types/enums';
import { SkinnerGearInput } from '../../../@types';
import { SkinnerGearItem } from '../../../@types/staticDataInterfaces';
import { useFonts } from '../../../contexts/fontContext';
import { useGame } from '../../../contexts/gameContext';

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

  const [setSkinnerGear, { loading: settingSkinnerGear }] = useMutation<SetSkinnerGearData, SetSkinnerGearVars>(
    SET_SKINNER_GEAR
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

  const handleSubmitSkinnerGear = async () => {
    if (!!userGameRole && !!character && !!game && !!selectedWeapon && selectedGear.length === 2) {
      const skinnerGear: SkinnerGearInput = {
        id: character.playbookUnique?.skinnerGear ? character.playbookUnique.skinnerGear.id : undefined,
        graciousWeapon: omit(selectedWeapon, ['__typename']) as SkinnerGearItem,
        luxeGear: selectedGear.map((item) => omit(item, ['__typename']) as SkinnerGearItem),
      };
      try {
        await setSkinnerGear({
          variables: { gameRoleId: userGameRole.id, characterId: character.id, skinnerGear },
          optimisticResponse: {
            __typename: 'Mutation',
            setSkinnerGear: {
              __typename: 'Character',
              ...character,
              playbookUnique: {
                id: character.playbookUnique ? character.playbookUnique.id : 'temporary-id',
                type: character.playbookUnique ? character.playbookUnique.type : UniqueTypes.skinnerGear,
                skinnerGear: {
                  ...skinnerGear,
                  id: character.playbookUnique?.skinnerGear ? character.playbookUnique.skinnerGear.id : 'temporary-id',
                },
              },
            },
          },
        });
        history.push(`/character-creation/${game.id}?step=${CharacterCreationSteps.selectMoves}`);
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      } catch (error) {
        console.error(error);
      }
    }
  };
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
    <Box
      data-testid="skinner-gear-form"
      direction="column"
      width="70vw"
      align="center"
      justify="start"
      overflow="auto"
      flex="grow"
    >
      <HeadingWS crustReady={crustReady} level={2}>
        {!!character && !!character.name ? `WHAT SPECIAL SKINNER GEAR DOES ${character.name.toUpperCase()} HAVE?` : '...'}
      </HeadingWS>
      <Box direction="row">
        <Box direction="column" fill="horizontal" pad="12px">
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
              gearCreator.luxeGearChoices.map((item) => {
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
                    checked={selectedGear.map((gear) => gear.id).includes(item.id)}
                    onChange={() => handleSelectGear(item)}
                  />
                );
              })}
          </Box>
        </Box>
        <Box margin="12px" flex="grow">
          <ButtonWS
            label={settingSkinnerGear ? <Spinner fillColor="#FFF" width="37px" height="36px" /> : 'SET'}
            primary
            disabled={selectedGear.length !== 2 || !selectedWeapon}
            onClick={() => !settingSkinnerGear && handleSubmitSkinnerGear()}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SkinnerGearForm;
