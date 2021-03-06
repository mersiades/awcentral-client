import React, { FC, useEffect, useReducer } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Box, TextInput, Text, Tip, CheckBox, FormField } from 'grommet';
import { omit } from 'lodash';

import DoubleRedBox from '../DoubleRedBox';
import SingleRedBox from '../SingleRedBox';
import Spinner from '../Spinner';
import { accentColors, ButtonWS, HeadingWS, neutralColors, TextWS } from '../../config/grommetConfig';
import VEHICLE_CREATOR, { VehicleCreatorData, VehicleCreatorVars } from '../../queries/vehicleCreator';
import SET_BATTLE_VEHICLE, { SetBattleVehicleData, SetBattleVehicleVars } from '../../mutations/setBattleVehicle';
import { BattleOptionType, VehicleFrameType, VehicleType } from '../../@types/enums';
import { BattleVehicleInput } from '../../@types';
import { BattleVehicle } from '../../@types/dataInterfaces';
import { VehicleBattleOption, VehicleFrame } from '../../@types/staticDataInterfaces';
import { useGame } from '../../contexts/gameContext';
import { VehicleTagsBox } from './VehicleForm';

interface BattleVehicleFormProps {
  navigateOnSet: (numVehicles: number) => void;
  existingVehicle?: BattleVehicle;
}

interface BattleVehicleFormState {
  vehicleType: VehicleType;
  name: string;
  vehicleFrame?: VehicleFrame;
  speed: number;
  handling: number;
  armor: number;
  massive: number;
  strengths: string[];
  weaknesses: string[];
  looks: string[];
  weapons: string[];
  battleOptions: VehicleBattleOption[];
  battleVehicleOptions: VehicleBattleOption[];
}

interface Action {
  type: 'REPLACE_VEHICLE' | 'UPDATE_BVEHICLE' | 'SET_FRAME' | 'SET_NAME';
  payload?: any;
}

const battleVehicleFormReducer = (state: BattleVehicleFormState, action: Action) => {
  switch (action.type) {
    case 'REPLACE_VEHICLE':
      return action.payload;
    case 'UPDATE_BVEHICLE':
      return {
        ...state,
        ...action.payload,
      };
    case 'SET_FRAME':
      return {
        ...state,
        vehicleFrame: action.payload,
        vehicleType: action.payload === VehicleFrameType.bike ? VehicleType.bike : VehicleType.car,
        strengths: [] as string[],
        weaknesses: [] as string[],
        looks: [] as string[],
        battleOptions: [] as VehicleBattleOption[],
        speed: 0,
        handling: 0,
        armor: 0,
        massive: action.payload.massive,
      };
    case 'SET_NAME':
      return { ...state, name: action.payload };

    default:
      return state;
  }
};

const BattleVehicleForm: FC<BattleVehicleFormProps> = ({ navigateOnSet, existingVehicle }) => {
  const initialState: BattleVehicleFormState = {
    vehicleType: !!existingVehicle ? existingVehicle.vehicleType : VehicleType.battle,
    name: !!existingVehicle ? existingVehicle.name : 'Unnamed vehicle',
    vehicleFrame: !!existingVehicle ? omit(existingVehicle.vehicleFrame, ['__typename']) : undefined,
    speed: !!existingVehicle ? existingVehicle.speed : 0,
    handling: !!existingVehicle ? existingVehicle.handling : 0,
    armor: !!existingVehicle ? existingVehicle.armor : 0,
    massive: !!existingVehicle ? existingVehicle.massive : 2,
    strengths: !!existingVehicle ? existingVehicle.strengths : [],
    weaknesses: !!existingVehicle ? existingVehicle.weaknesses : [],
    looks: !!existingVehicle ? existingVehicle.looks : [],
    weapons: !!existingVehicle ? existingVehicle.weapons : [],
    battleOptions: !!existingVehicle
      ? (existingVehicle.battleOptions.map((bo) => omit(bo, ['__typename'])) as VehicleBattleOption[])
      : [],
    battleVehicleOptions: !!existingVehicle
      ? (existingVehicle.battleVehicleOptions.map((bo) => omit(bo, ['__typename'])) as VehicleBattleOption[])
      : [],
  };

  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [
    {
      vehicleFrame,
      vehicleType,
      name,
      speed,
      handling,
      massive,
      armor,
      strengths,
      weaknesses,
      looks,
      weapons,
      battleOptions,
      battleVehicleOptions,
    },
    dispatch,
  ] = useReducer(battleVehicleFormReducer, initialState);
  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { character, userGameRole } = useGame();

  // ------------------------------------------------------ graphQL -------------------------------------------------------- //
  const { data: vehicleCreatorData, loading } = useQuery<VehicleCreatorData, VehicleCreatorVars>(VEHICLE_CREATOR);
  const carCreator = vehicleCreatorData?.vehicleCreator.carCreator;
  const bikeCreator = vehicleCreatorData?.vehicleCreator.bikeCreator;
  const battleVehicleCreator = vehicleCreatorData?.vehicleCreator.battleVehicleCreator;
  const [setBattleVehicle, { loading: settingBattleVehicle }] = useMutation<SetBattleVehicleData, SetBattleVehicleVars>(
    SET_BATTLE_VEHICLE
  );
  // ------------------------------------------------- Component functions -------------------------------------------------- //

  const introText =
    vehicleFrame?.frameType === VehicleFrameType.bike ? bikeCreator?.introInstructions : carCreator?.introInstructions;
  const strengthOptions: string[] | undefined =
    vehicleFrame?.frameType === VehicleFrameType.bike ? bikeCreator?.strengths : carCreator?.strengths;

  const lookOptions: string[] | undefined =
    vehicleFrame?.frameType === VehicleFrameType.bike ? bikeCreator?.looks : carCreator?.looks;

  const weaknessOptions: string[] | undefined =
    vehicleFrame?.frameType === VehicleFrameType.bike ? bikeCreator?.weaknesses : carCreator?.weaknesses;

  const battleOptionOptions: VehicleBattleOption[] | undefined =
    vehicleFrame?.frameType === VehicleFrameType.bike ? bikeCreator?.battleOptions : carCreator?.battleOptions;

  const battleVehicleOptionOptions: VehicleBattleOption[] | undefined = battleVehicleCreator?.battleVehicleOptions;

  const increaseStats = (update: Partial<BattleVehicleInput>, option: VehicleBattleOption) => {
    let newUpdate = update;
    switch (option.battleOptionType) {
      case BattleOptionType.speed:
        newUpdate = { ...newUpdate, speed: speed + 1 };
        break;
      case BattleOptionType.handling:
        newUpdate = { ...newUpdate, handling: handling + 1 };
        break;
      case BattleOptionType.massive:
        newUpdate = { ...newUpdate, massive: massive + 1 };
        break;
      case BattleOptionType.armor:
        newUpdate = { ...newUpdate, armor: armor + 1 };
        break;
      case BattleOptionType.weapon:
        newUpdate = { ...newUpdate, weapons: [...weapons, option.name] };
        break;
      default:
    }

    return newUpdate;
  };

  const decreaseStats = (update: Partial<BattleVehicleInput>, option: VehicleBattleOption) => {
    let newUpdate = update;
    switch (option.battleOptionType) {
      case BattleOptionType.speed:
        newUpdate = { ...newUpdate, speed: speed - 1 };
        break;
      case BattleOptionType.handling:
        newUpdate = { ...newUpdate, handling: handling - 1 };
        break;
      case BattleOptionType.massive:
        newUpdate = { ...newUpdate, massive: massive - 1 };
        break;
      case BattleOptionType.armor:
        newUpdate = { ...newUpdate, armor: armor - 1 };
        break;
      case BattleOptionType.weapon:
        newUpdate = { ...newUpdate, weapons: weapons.filter((weapon: string) => weapon != option.name) };
        break;
      default:
    }

    return newUpdate;
  };

  const handleOptionSelect = (
    option: string | VehicleBattleOption,
    type: 'strength' | 'weakness' | 'look' | 'battleOption' | 'battleVehicleOption',
    isSelected: boolean
  ) => {
    let update: Partial<BattleVehicleInput> = {};

    if (type === 'strength') {
      if (isSelected) {
        update = { ...update, strengths: strengths.filter((str: string) => str !== option) };
      } else if (strengths.length < 2) {
        update = { ...update, strengths: [...strengths, option] };
      }
    }

    if (type === 'weakness') {
      if (isSelected) {
        update = { ...update, weaknesses: weaknesses.filter((wk: string) => wk !== option) };
      } else if (weaknesses.length < 2) {
        update = { ...update, weaknesses: [...weaknesses, option] };
      }
    }
    if (type === 'look') {
      if (isSelected) {
        update = { ...update, looks: looks.filter((lk: string) => lk !== option) };
      } else if (looks.length < 2) {
        update = { ...update, looks: [...looks, option] };
      }
    }

    if (type === 'battleOption') {
      const castOption = option as VehicleBattleOption; // Because the option parameter could also be a string
      if (isSelected) {
        update = {
          ...update,
          battleOptions: battleOptions.filter((bo: VehicleBattleOption) => bo.id !== castOption.id),
        };
        update = decreaseStats(update, castOption);
      } else if (battleOptions.length < vehicleFrame.battleOptionCount) {
        update = {
          ...update,
          battleOptions: [...battleOptions, omit(castOption, ['__typename'])] as VehicleBattleOption[],
        };
        update = increaseStats(update, castOption);
      }
    }

    if (type === 'battleVehicleOption') {
      const castOption = option as VehicleBattleOption; // Because the option parameter could also be a string
      if (isSelected) {
        update = {
          ...update,
          battleVehicleOptions: battleVehicleOptions.filter((bo: VehicleBattleOption) => bo.id !== castOption.id),
        };
        update = decreaseStats(update, castOption);
      } else if (battleVehicleOptions.length < 2) {
        update = {
          ...update,
          battleVehicleOptions: [...battleVehicleOptions, omit(castOption, ['__typename'])] as VehicleBattleOption[],
        };
        update = increaseStats(update, castOption);
      }
    }

    dispatch({ type: 'UPDATE_BVEHICLE', payload: update });
  };

  const handleSetVehicle = async () => {
    if (!!userGameRole && !!character && vehicleFrame) {
      const battleVehicleInput: BattleVehicleInput = {
        id: !!existingVehicle ? existingVehicle.id : undefined,
        vehicleType,
        name,
        vehicleFrame,
        speed,
        handling,
        armor,
        massive,
        strengths,
        weaknesses,
        looks,
        weapons,
        battleOptions,
        battleVehicleOptions,
      };
      const index = character.battleVehicles.findIndex((vehicle) => vehicle.id === existingVehicle?.id);
      let replacementVehicles = character.battleVehicles;
      if (index > -1) {
        replacementVehicles[index] = battleVehicleInput as BattleVehicle;
      } else {
        replacementVehicles = [...replacementVehicles, { ...battleVehicleInput, id: 'temporary-id' }];
      }

      try {
        const { data } = await setBattleVehicle({
          variables: {
            gameRoleId: userGameRole.id,
            characterId: character.id,
            battleVehicle: battleVehicleInput,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            setBattleVehicle: {
              __typename: 'Character',
              ...character,
              battleVehicles: replacementVehicles,
            },
          },
        });
        !!data && navigateOnSet(data.setBattleVehicle.battleVehicles.length);
      } catch (error) {
        console.error(error);
      }
    }
  };

  // ------------------------------------------------------- Effects -------------------------------------------------------- //

  // Change component state if vehicle changes (ie, when user click on a tab for another vehicle)
  useEffect(() => {
    if (!!character && !!bikeCreator && !!carCreator) {
      const payload: BattleVehicleFormState = {
        vehicleType: !!existingVehicle ? existingVehicle.vehicleType : VehicleType.battle,
        name: !!existingVehicle ? existingVehicle.name : 'Unnamed vehicle',
        vehicleFrame: !!existingVehicle
          ? omit(existingVehicle.vehicleFrame, ['__typename'])
          : omit(carCreator.frames[2], ['__typename']),
        strengths: !!existingVehicle ? existingVehicle.strengths : [],
        weaknesses: !!existingVehicle ? existingVehicle.weaknesses : [],
        looks: !!existingVehicle ? existingVehicle.looks : [],
        speed: !!existingVehicle ? existingVehicle.speed : 0,
        handling: !!existingVehicle ? existingVehicle.handling : 0,
        massive: !!existingVehicle ? existingVehicle.massive : (carCreator.frames[2].massive as number),
        armor: !!existingVehicle ? existingVehicle.armor : 0,
        weapons: !!existingVehicle ? existingVehicle.weapons : [],
        battleOptions: !!existingVehicle
          ? (existingVehicle.battleOptions.map((bo) => omit(bo, ['__typename'])) as VehicleBattleOption[])
          : [],
        battleVehicleOptions: !!existingVehicle
          ? (existingVehicle.battleVehicleOptions.map((bo) => omit(bo, ['__typename'])) as VehicleBattleOption[])
          : [],
      };
      dispatch({ type: 'REPLACE_VEHICLE', payload });
    }
  }, [existingVehicle, character, bikeCreator, carCreator]);

  // ------------------------------------------------------ Render -------------------------------------------------------- //

  const renderPill = (item: string, isSelected: boolean, callback: (item: string) => void) => {
    return (
      <Box
        data-testid={`${item}-option-pill`}
        key={item}
        height="fit-content"
        background={isSelected ? { color: accentColors[0], dark: true } : neutralColors[0]}
        round="medium"
        pad={{ top: '3px', bottom: '1px', horizontal: '12px' }}
        margin={{ vertical: '3px', horizontal: '3px' }}
        justify="center"
        onClick={() => callback(item)}
        hoverIndicator={{ color: '#698D70', dark: true }}
      >
        <Text weight="bold" size="medium">
          {item}
        </Text>
      </Box>
    );
  };

  const renderBattleOptionPill = (battleOption: VehicleBattleOption, isSelected: boolean, callback: () => void) => {
    return (
      <Tip key={battleOption.id} content={battleOption.name}>
        <Box
          data-testid={`${battleOption.name}-pill`}
          key={battleOption.id}
          height="fit-content"
          background={isSelected ? { color: accentColors[0], dark: true } : neutralColors[0]}
          round="medium"
          pad={{ top: '3px', bottom: '1px', horizontal: '12px' }}
          margin={{ vertical: '3px', horizontal: '3px' }}
          justify="center"
          onClick={() => callback()}
          hoverIndicator={{ color: '#698D70', dark: true }}
        >
          <Text weight="bold" size="medium">
            {battleOption.battleOptionType}
          </Text>
        </Box>
      </Tip>
    );
  };

  const renderFramePill = (frameArg: VehicleFrame) => {
    const isSelected = vehicleFrame.id === frameArg.id;
    return (
      <Tip key={frameArg.id} content={`Battle options: ${frameArg.battleOptionCount}, massive: ${frameArg.massive}`}>
        <Box
          data-testid={`${frameArg.frameType.toLowerCase()}-bo-pill`}
          height="fit-content"
          background={isSelected ? { color: accentColors[0], dark: true } : neutralColors[0]}
          round="medium"
          pad={{ top: '3px', bottom: '1px', horizontal: '12px' }}
          margin={{ vertical: '3px', horizontal: '3px' }}
          justify="center"
          onClick={() => dispatch({ type: 'SET_FRAME', payload: omit(frameArg, ['__typename']) })}
          hoverIndicator={{ color: '#698D70', dark: true }}
        >
          <Text weight="bold" size="medium">
            {frameArg.frameType.toLowerCase()}
          </Text>
        </Box>
      </Tip>
    );
  };

  if (loading || !character || !carCreator || !vehicleFrame) {
    return <Spinner />;
  }

  return (
    <Box data-testid="battle-vehicle-form" width="80vw" align="start" justify="start" gap="12px" flex="grow">
      <Box fill="horizontal" justify="between" gap="12px">
        <Box direction="row" justify="between" align="center" gap="12px">
          <TextWS margin={{ bottom: '12px' }}>{introText}</TextWS>
          <ButtonWS
            primary
            alignSelf="start"
            style={{ width: '100px' }}
            label={settingBattleVehicle ? <Spinner fillColor="#FFF" width="56px" height="36px" /> : 'SET'}
            onClick={() => !settingBattleVehicle && handleSetVehicle()}
            disabled={
              settingBattleVehicle ||
              battleOptions.length < vehicleFrame.battleOptionCount ||
              battleVehicleOptions.length < 2
            }
          />
        </Box>
        <Box flex="grow">
          <TextWS>
            <strong>Give your vehicle a name</strong> (make/model, nickname, whatever):
          </TextWS>
          <FormField>
            <TextInput
              aria-label="name-input"
              size="xlarge"
              value={name}
              onChange={(e) => dispatch({ type: 'SET_NAME', payload: e.target.value })}
            />
          </FormField>
        </Box>
      </Box>

      <Box fill="horizontal" justify="between" gap="12px" margin={{ top: '6px' }}>
        <TextWS>Choose its frame (resets other settings):</TextWS>
        <Box direction="row" fill="horizontal" justify="between" gap="12px">
          <Box direction="row" margin={{ top: '3px' }} wrap>
            {carCreator.frames.map((frame) => renderFramePill(frame))}
          </Box>
          <DoubleRedBox value={vehicleFrame?.frameType} label="Frame" width="175px" />
        </Box>
      </Box>

      <Box fill="horizontal" justify="between" margin={{ top: '6px' }}>
        <TextWS>
          <strong>Strengths</strong> (choose 1 or 2):
        </TextWS>
        <Box direction="row" gap="12px">
          <Box direction="row" fill align="start" wrap>
            {strengthOptions?.map((strength) => {
              const isSelected = strengths.includes(strength);
              return renderPill(strength, isSelected, () => handleOptionSelect(strength, 'strength', isSelected));
            })}
          </Box>
          <VehicleTagsBox tags={strengths} title="Strengths" width="175px" minHeight="90px" />
        </Box>
      </Box>

      <Box fill="horizontal" justify="between" margin={{ top: '6px' }}>
        <TextWS>
          <strong>Weaknesses</strong> (choose 1 or 2):
        </TextWS>
        <Box direction="row" gap="12px">
          <Box direction="row" fill align="start" wrap>
            {weaknessOptions?.map((weakness) => {
              const isSelected = weaknesses.includes(weakness);
              return renderPill(weakness, isSelected, () => handleOptionSelect(weakness, 'weakness', isSelected));
            })}
          </Box>
          <VehicleTagsBox tags={weaknesses} title="Weaknesses" width="175px" minHeight="90px" />
        </Box>
      </Box>

      <Box fill="horizontal" justify="between" margin={{ top: '6px' }}>
        <TextWS>
          <strong>Looks</strong> (choose 1 or 2):
        </TextWS>
        <Box direction="row" gap="12px">
          <Box direction="row" fill align="start" wrap>
            {lookOptions?.map((look) => {
              const isSelected = looks.includes(look);
              return renderPill(look, isSelected, () => handleOptionSelect(look, 'look', isSelected));
            })}
          </Box>
          <VehicleTagsBox tags={looks} title="Looks" width="175px" minHeight="90px" />
        </Box>
      </Box>

      <Box fill="horizontal" justify="between" margin={{ top: '6px' }}>
        <TextWS>
          <strong>Battle options</strong> (choose {vehicleFrame.battleOptionCount})
        </TextWS>
        <Box direction="row" justify="between" margin={{ top: '6px' }} gap="12px">
          <Box>
            <Box direction="row" align="start" wrap margin={{ bottom: '12px' }} flex="grow">
              {battleOptionOptions?.map((battleOption) => {
                const isSelected = !!battleOptions.find((bo: VehicleBattleOption) => bo.id === battleOption.id);
                return renderBattleOptionPill(battleOption, isSelected, () =>
                  handleOptionSelect(battleOption, 'battleOption', isSelected)
                );
              })}
            </Box>
            <TextWS>
              <strong>Battle vehicle options</strong> (choose 2)
            </TextWS>
            <Box fill align="start" margin={{ top: '3px' }} gap="6px">
              {battleVehicleOptionOptions?.map((battleOption) => {
                const isSelected = !!battleVehicleOptions.find((bo: VehicleBattleOption) => bo.id === battleOption.id);
                return (
                  <CheckBox
                    key={battleOption.id}
                    checked={isSelected}
                    label={battleOption.name}
                    onChange={() => handleOptionSelect(battleOption, 'battleVehicleOption', isSelected)}
                  />
                );
              })}
            </Box>
          </Box>
          <Box align="center" width="175px" flex="grow" fill="vertical" style={{ maxWidth: '175px' }}>
            <Box direction="row" justify="between">
              <SingleRedBox value={speed} label="Speed" width="80px" />
              <SingleRedBox value={handling} label="Handling" width="80px" />
            </Box>
            <Box direction="row" justify="between">
              <SingleRedBox value={armor} label="Armor" width="80px" />
              <SingleRedBox value={massive} label="Massive" width="80px" />
            </Box>
            <VehicleTagsBox tags={weapons} title="Weapons" width="175px" minHeight="90px" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BattleVehicleForm;
