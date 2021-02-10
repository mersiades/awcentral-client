import React, { FC } from 'react';
import styled, { css } from 'styled-components';
import { useQuery } from '@apollo/client';
import { Box, Text } from 'grommet';
import { IconProps, Next, Previous } from 'grommet-icons';

import { CustomUL } from '../../config/grommetConfig';
import PLAYBOOK_CREATOR, { PlaybookCreatorData, PlaybookCreatorVars } from '../../queries/playbookCreator';
import { CharacterCreationSteps, PlaybookType, UniqueTypes } from '../../@types/enums';
import { useGame } from '../../contexts/gameContext';
import { decapitalize } from '../../helpers/decapitalize';
import { useHistory, useLocation } from 'react-router-dom';
import Spinner from '../Spinner';

const NextWithHover = styled(Next as React.FC<IconProps & JSX.IntrinsicElements['svg']>)(() => {
  return css`
    &:hover {
      stroke: #fff;
    }
  `;
});

const PreviousWithHover = styled(Previous as React.FC<IconProps & JSX.IntrinsicElements['svg']>)(() => {
  return css`
    &:hover {
      stroke: #fff;
    }
  `;
});

const CharacterCreationStepper: FC = () => {
  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { character, game } = useGame();

  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //
  const history = useHistory();
  const query = new URLSearchParams(useLocation().search);
  const step = query.get('step');
  const currentStep = !!step ? parseInt(step) : undefined;

  // ------------------------------------------------------ graphQL -------------------------------------------------------- //
  const { data: pbCreatorData } = useQuery<PlaybookCreatorData, PlaybookCreatorVars>(PLAYBOOK_CREATOR, {
    // @ts-ignore
    variables: { playbookType: character?.playbook },
    skip: !character?.playbook,
  });

  const pbCreator = pbCreatorData?.playbookCreator;

  // ------------------------------------------------- Component functions -------------------------------------------------- //
  let reversedLooks: string[] = [];
  if (!!character && !!character.looks) {
    reversedLooks = character.looks.map((look) => look.look).reverse();
  }

  const changeStep = (nextStep: number) => {
    !!game && history.push(`/character-creation/${game.id}?step=${nextStep}`);
  };

  const handlePrevious = () => {
    if (!!character?.name && !!character?.playbook && !!currentStep) {
      // Skip over playbookUnique page for Driver
      if (currentStep === CharacterCreationSteps.selectMoves && character.playbook === PlaybookType.driver) {
        changeStep(currentStep - 2);
      } else {
        changeStep(currentStep - 1);
      }
    }
  };

  const handleNext = () => {
    if (!!character?.name && !!character?.playbook && !!currentStep) {
      // Skip over playbookUnique page for Driver
      if (currentStep === CharacterCreationSteps.selectGear && character.playbook === PlaybookType.driver) {
        changeStep(currentStep + 2);
      } else {
        changeStep(currentStep + 1);
      }
    }
  };

  // ------------------------------------------------------ Render -------------------------------------------------------- //
  const box0Step1 = (
    <Box margin={{ left: 'xsmall', right: 'xsmall' }} justify="between" width="11em" height="10rem" gap="small">
      <Box
        data-testid="playbook-box"
        align="center"
        fill="horizontal"
        pad="small"
        height="5rem"
        border
        background={{ color: 'neutral-1', opacity: CharacterCreationSteps.selectPlaybook === currentStep ? 1 : 0.5 }}
        onClick={(e: any) => {
          e.currentTarget.blur();
          changeStep(CharacterCreationSteps.selectPlaybook);
        }}
      >
        <Text color="white" weight="bold">
          Playbook
        </Text>
        {!!character?.playbook ? <Text>{decapitalize(character?.playbook)}</Text> : <Text>...</Text>}
      </Box>
      <Box
        data-testid="name-box"
        align="center"
        fill="horizontal"
        pad="small"
        border
        height="5rem"
        background={{ color: 'neutral-1', opacity: CharacterCreationSteps.selectName === currentStep ? 1 : 0.5 }}
        onClick={(e: any) => {
          e.currentTarget.blur();
          !!character?.playbook && changeStep(CharacterCreationSteps.selectName);
        }}
      >
        <Text color="white" weight="bold">
          Name
        </Text>
        {!!character?.name ? <Text>{character.name}</Text> : <Text>...</Text>}
      </Box>
    </Box>
  );

  const box1Step3 = (
    <Box
      data-testid="looks-box"
      margin={{ left: 'xsmall', right: 'xsmall' }}
      justify="start"
      width="11rem"
      height="10rem"
      gap="small"
      align="center"
      pad="small"
      border
      background={{ color: 'neutral-1', opacity: CharacterCreationSteps.selectLooks === currentStep ? 1 : 0.5 }}
      onClick={(e: any) => {
        e.currentTarget.blur();
        !!character?.name && !!character?.playbook && changeStep(CharacterCreationSteps.selectLooks);
      }}
    >
      <Text color="white" weight="bold">
        Looks
      </Text>
      {reversedLooks.length > 0 ? (
        <CustomUL>
          {reversedLooks.map((look) => (
            <li key={look} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {look}
            </li>
          ))}
        </CustomUL>
      ) : (
        <Text>...</Text>
      )}
    </Box>
  );

  const box2Step4 = (
    <Box
      data-testid="stats-box"
      margin={{ left: 'xsmall', right: 'xsmall' }}
      justify="start"
      width="11rem"
      height="10rem"
      gap="small"
      align="center"
      pad="small"
      border
      background={{ color: 'neutral-1', opacity: CharacterCreationSteps.selectStats === currentStep ? 1 : 0.5 }}
      onClick={(e: any) => {
        e.currentTarget.blur();
        !!character?.name && !!character?.playbook && changeStep(CharacterCreationSteps.selectStats);
      }}
    >
      <Text color="white" weight="bold">
        Stats
      </Text>
      {!!character && character.statsBlock?.stats.length > 0 ? (
        <CustomUL>
          {character.statsBlock.stats.map((stat) => (
            <li key={stat.id}>{`${stat.stat} ${'--'.repeat(8 - stat.stat.length)} ${stat.value}`}</li>
          ))}
        </CustomUL>
      ) : (
        <Text>...</Text>
      )}
    </Box>
  );

  const box3Step5 = (
    <Box
      data-testid="gear-box"
      margin={{ left: 'xsmall', right: 'xsmall' }}
      justify="start"
      width="11rem"
      height="10rem"
      gap="small"
      align="center"
      pad="small"
      border
      background={{ color: 'neutral-1', opacity: CharacterCreationSteps.selectGear === currentStep ? 1 : 0.5 }}
      onClick={(e: any) => {
        e.currentTarget.blur();
        !!character?.name && !!character?.playbook && changeStep(CharacterCreationSteps.selectGear);
      }}
    >
      <Text color="white" weight="bold">
        Gear
      </Text>
      {!!character && character.gear?.length > 0 ? (
        <CustomUL>
          {character.gear.map((item, index) => (
            <li key={index} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item}
            </li>
          ))}
        </CustomUL>
      ) : (
        <Text>...</Text>
      )}
    </Box>
  );

  const renderUnique = () => {
    if (!!character?.playbookUnique) {
      switch (character?.playbookUnique.type) {
        case UniqueTypes.angelKit:
          if (!!character.playbookUnique.angelKit) {
            const { stock, hasSupplier } = character.playbookUnique.angelKit;
            return (
              <CustomUL data-testid="angel-kit-box">
                <li key={1}>{`Stock: ${stock}`}</li>
                <li key={2}>{hasSupplier ? 'Has supplier' : 'No supplier yet'}</li>
              </CustomUL>
            );
          }
          return null;
        case UniqueTypes.customWeapons:
          if (!!character.playbookUnique.customWeapons) {
            const { weapons } = character.playbookUnique.customWeapons;
            return (
              <CustomUL>
                {weapons.map((weapon, index) => (
                  <li key={index} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {weapon}
                  </li>
                ))}
              </CustomUL>
            );
          }
          return null;
        case UniqueTypes.brainerGear:
          if (!!character.playbookUnique.brainerGear) {
            const concatGear = character.playbookUnique.brainerGear.brainerGear.map((gear) => gear.split('('));
            return (
              <CustomUL>
                {concatGear.map((item, index) => (
                  <li key={index} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item[0]}
                  </li>
                ))}
              </CustomUL>
            );
          }
          return null;
        case UniqueTypes.gang:
          if (!!character.playbookUnique.gang) {
            const { size, harm, armor, tags } = character.playbookUnique.gang;
            return (
              <CustomUL>
                <li>Size: {size}</li>
                <li>Harm: {harm}</li>
                <li>Armor: {armor}</li>
                <li>Tags: {tags.join(', ')}</li>
              </CustomUL>
            );
          }
          return null;
        case UniqueTypes.weapons:
          if (!!character.playbookUnique.weapons) {
            return (
              <CustomUL>
                {character.playbookUnique.weapons.weapons.map((weapon) => {
                  const weaponName = weapon.substring(0, weapon.indexOf(' ('));
                  return <li key={weapon}>{weaponName}</li>;
                })}
              </CustomUL>
            );
          }
          return null;
        case UniqueTypes.holding:
          if (!!character.playbookUnique.holding) {
            const { holdingSize, gangSize, barter, wants } = character.playbookUnique.holding;
            return (
              <CustomUL>
                <li>Holding size: {decapitalize(holdingSize)}</li>
                <li>Gang size: {decapitalize(gangSize)}</li>
                <li>Barter: {barter}</li>
                <li>Wants: {wants.join(', ')}</li>
              </CustomUL>
            );
          }
          return null;
        default:
          return null;
      }
    }
  };

  const box4Step6 = (
    <Box
      margin={{ left: 'xsmall', right: 'xsmall' }}
      justify="start"
      width="11rem"
      height="10rem"
      gap="small"
      align="center"
      pad="small"
      border
      background={{ color: 'neutral-1', opacity: CharacterCreationSteps.setUnique === currentStep ? 1 : 0.5 }}
      onClick={(e: any) => {
        e.currentTarget.blur();
        !!character?.name && !!character?.playbook && changeStep(CharacterCreationSteps.setUnique);
      }}
    >
      <Text color="white" weight="bold" alignSelf="center">
        {!!pbCreator && pbCreator.playbookUniqueCreator ? decapitalize(pbCreator.playbookUniqueCreator.type) : '...'}
      </Text>
      {!!character && !!character.playbookUnique ? renderUnique() : <Text>...</Text>}
    </Box>
  );

  const box5Step7 = (
    <Box
      data-testid="moves-box"
      margin={{ left: 'xsmall', right: 'xsmall' }}
      justify="start"
      width="11rem"
      height="10rem"
      gap="small"
      align="center"
      pad="small"
      border
      background={{ color: 'neutral-1', opacity: CharacterCreationSteps.selectMoves === currentStep ? 1 : 0.5 }}
      onClick={(e: any) => {
        e.currentTarget.blur();
        !!character?.name && !!character?.playbook && changeStep(CharacterCreationSteps.selectMoves);
      }}
    >
      <Text color="white" weight="bold" alignSelf="center">
        Moves
      </Text>
      {!!character && !!character.characterMoves && character.characterMoves.length > 0 ? (
        <CustomUL>
          {character.characterMoves.map((move) => {
            if (move.isSelected) {
              return (
                <li key={move.id} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {decapitalize(move.name)}
                </li>
              );
            }
            return null;
          })}
        </CustomUL>
      ) : (
        <Text>...</Text>
      )}
    </Box>
  );

  const box6Step8 = (
    <Box
      data-testid="vehicles-box"
      margin={{ left: 'xsmall', right: 'xsmall' }}
      justify="start"
      width="11rem"
      height="10rem"
      gap="small"
      align="center"
      pad="small"
      border
      background={{ color: 'neutral-1', opacity: CharacterCreationSteps.setVehicle === currentStep ? 1 : 0.5 }}
      onClick={(e: any) => {
        e.currentTarget.blur();
        !!character?.name && !!character?.playbook && changeStep(CharacterCreationSteps.setVehicle);
      }}
    >
      <Text color="white" weight="bold" alignSelf="center">
        Vehicles
      </Text>
      {!!character && !!character.vehicles && character.vehicles.length > 0 ? (
        <CustomUL>
          {character.vehicles.map((vehicle) => {
            return (
              <li key={vehicle.id} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {vehicle.name}
              </li>
            );
          })}
        </CustomUL>
      ) : (
        <Text>...</Text>
      )}
    </Box>
  );

  const box7Step9 = (
    <Box
      margin={{ left: 'xsmall', right: 'xsmall' }}
      justify="start"
      width="11rem"
      height="10rem"
      gap="small"
      align="center"
      pad="small"
      border
      background={{ color: 'neutral-1', opacity: CharacterCreationSteps.setHx === currentStep ? 1 : 0.5 }}
      onClick={(e: any) => {
        e.currentTarget.blur();
        !!character?.name && !!character?.playbook && changeStep(CharacterCreationSteps.setHx);
      }}
    >
      <Text color="white" weight="bold" alignSelf="center">
        Hx
      </Text>
      {!!character && !!character.hxBlock && character.hxBlock.length > 0 ? (
        <CustomUL>
          {character.hxBlock.map((hxStat) => {
            return (
              <li key={hxStat.characterId}>{`${hxStat.characterName} ${'--'.repeat(
                hxStat.characterName.length > 9 ? 1 : 10 - hxStat.characterName.length
              )} ${hxStat.hxValue}`}</li>
            );
          })}
        </CustomUL>
      ) : (
        <Text>...</Text>
      )}
    </Box>
  );

  // Omit box for PlayBookUniques for Driver
  const boxesArray =
    character?.playbook !== PlaybookType.driver
      ? [box0Step1, box1Step3, box2Step4, box3Step5, box4Step6, box5Step7, box6Step8, box7Step9]
      : [box0Step1, box1Step3, box2Step4, box3Step5, box5Step7, box6Step8, box7Step9];

  const renderBoxesSmall = () => {
    if (currentStep !== undefined) {
      switch (currentStep) {
        case 0:
        // Intentionally falls through
        case 1:
        // Intentionally falls through
        case 2:
          return (
            <>
              {boxesArray[0]}
              {boxesArray[1]}
              {boxesArray[2]}
            </>
          );
        case 8:
          return (
            <>
              {boxesArray[4]}
              {boxesArray[5]}
              {boxesArray[6]}
            </>
          );
        default:
          return (
            <>
              {boxesArray[currentStep - 3]}
              {boxesArray[currentStep - 2]}
              {boxesArray[currentStep - 1]}
            </>
          );
      }
    }
  };

  const renderBoxes = () => {
    if (currentStep !== undefined) {
      switch (currentStep) {
        case 0:
        // Intentionally falls through
        case 1:
        // Intentionally falls through
        case 2:
          return (
            <>
              {boxesArray[0]}
              {boxesArray[1]}
              {boxesArray[2]}
              {boxesArray[3]}
            </>
          );
        case 3:
          return (
            <>
              {boxesArray[0]}
              {boxesArray[1]}
              {boxesArray[2]}
              {boxesArray[3]}
            </>
          );
        case 4:
          return (
            <>
              {boxesArray[0]}
              {boxesArray[1]}
              {boxesArray[2]}
              {boxesArray[3]}
            </>
          );

        case 9:
          return (
            <>
              {boxesArray[4]}
              {boxesArray[5]}
              {boxesArray[6]}
              {boxesArray[7]}
            </>
          );

        default:
          return (
            <>
              {boxesArray[currentStep - 4]}
              {boxesArray[currentStep - 3]}
              {boxesArray[currentStep - 2]}
              {boxesArray[currentStep - 1]}
            </>
          );
      }
    }
  };

  if (currentStep === undefined || !game) {
    return <Spinner />;
  }

  return (
    <Box
      data-testid="character-creation-stepper"
      direction="row"
      fill="horizontal"
      justify="center"
      pad="12px"
      align="center"
      flex="grow"
      style={{ maxHeight: '180px' }}
    >
      {!!currentStep && currentStep > 1 ? (
        <PreviousWithHover cursor="pointer" onClick={() => handlePrevious()} size="large" color="accent-1" />
      ) : (
        <div style={{ height: 48, width: 48, background: 'transparent' }} />
      )}
      {window.innerWidth < 800 ? renderBoxesSmall() : renderBoxes()}
      {!!currentStep && currentStep < 9 && currentStep > 1 && !!character?.name ? (
        <NextWithHover cursor="pointer" onClick={() => handleNext()} size="large" color="accent-1" />
      ) : (
        <div style={{ height: 48, width: 48, background: 'transparent' }} />
      )}
    </Box>
  );
};

export default CharacterCreationStepper;
