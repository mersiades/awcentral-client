import { useQuery } from '@apollo/client';
import { Box, Select, TextInput, Text, Tip } from 'grommet';
import React, { FC, useEffect, useReducer } from 'react';
import { Vehicle } from '../../../@types/dataInterfaces';
import { BattleOptionType, PlaybookType, VehicleFrameType } from '../../../@types/enums';
import { VehicleBattleOption, VehicleFrame } from '../../../@types/staticDataInterfaces';
import { accentColors, ButtonWS, HeadingWS, neutralColors, RedBox, TextWS } from '../../../config/grommetConfig';
import { useFonts } from '../../../contexts/fontContext';
import { useGame } from '../../../contexts/gameContext';
import PLAYBOOK_CREATOR, { PlaybookCreatorData, PlaybookCreatorVars } from '../../../queries/playbookCreator';
import Spinner from '../../Spinner';

interface VehicleFormProps {
  vehicle?: Vehicle;
}

interface VehicleFormState {
  name: string;
  frame?: VehicleFrame;
  strengths: string[];
  looks: string[];
  weaknesses: string[];
  speed: number;
  handling: number;
  massive: number;
  armor: number;
  battleOptions: VehicleBattleOption[];
}

interface Action {
  type:
    | 'SET_FRAME'
    | 'SET_NAME'
    | 'ADD_STRENGTH'
    | 'REMOVE_STRENGTH'
    | 'ADD_WEAKNESS'
    | 'REMOVE_WEAKNESS'
    | 'ADD_LOOK'
    | 'REMOVE_LOOK'
    | 'REMOVE_BATTLE_OPTION'
    | 'ADD_BATTLE_OPTION'
    | 'INCREASE_SPEED'
    | 'REDUCE_SPEED'
    | 'INCREASE_HANDLING'
    | 'REDUCE_HANDLING'
    | 'INCREASE_MASSIVE'
    | 'REDUCE_MASSIVE'
    | 'INCREASE_ARMOR'
    | 'REDUCE_ARMOR';
  payload?: any;
}

const vehicleFormReducer = (state: VehicleFormState, action: Action) => {
  switch (action.type) {
    case 'SET_FRAME':
      return {
        ...state,
        frame: action.payload,
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
    case 'ADD_STRENGTH':
      return {
        ...state,
        strengths: [...state.strengths, action.payload],
      };
    case 'REMOVE_STRENGTH':
      return {
        ...state,
        strengths: state.strengths.filter((str) => str !== action.payload),
      };
    case 'ADD_WEAKNESS':
      return {
        ...state,
        weaknesses: [...state.weaknesses, action.payload],
      };
    case 'REMOVE_WEAKNESS':
      return {
        ...state,
        weaknesses: state.weaknesses.filter((str) => str !== action.payload),
      };
    case 'ADD_LOOK':
      return {
        ...state,
        looks: [...state.looks, action.payload],
      };
    case 'REMOVE_LOOK':
      return {
        ...state,
        looks: state.looks.filter((str) => str !== action.payload),
      };

    case 'ADD_BATTLE_OPTION':
      return {
        ...state,
        battleOptions: [...state.battleOptions, action.payload],
      };
    case 'REMOVE_BATTLE_OPTION':
      return {
        ...state,
        battleOptions: state.battleOptions.filter((bo) => bo.id !== action.payload.id),
      };
    case 'INCREASE_SPEED':
      return {
        ...state,
        speed: 1,
      };
    case 'REDUCE_SPEED':
      return {
        ...state,
        speed: 0,
      };
    case 'INCREASE_HANDLING':
      return {
        ...state,
        handling: 1,
      };
    case 'REDUCE_HANDLING':
      return {
        ...state,
        handling: 0,
      };
    case 'INCREASE_MASSIVE':
      return {
        ...state,
        massive: !!state.frame ? state.frame.massive + 1 : 1,
      };
    case 'REDUCE_MASSIVE':
      return {
        ...state,
        massive: !!state.frame ? state.frame.massive : 0,
      };
    case 'INCREASE_ARMOR':
      return {
        ...state,
        armor: 1,
      };
    case 'REDUCE_ARMOR':
      return {
        ...state,
        armor: 0,
      };
    default:
      return state;
  }
};

const VehicleForm: FC<VehicleFormProps> = ({ vehicle }) => {
  const initialState: VehicleFormState = {
    name: !!vehicle ? vehicle.name : 'Unnamed vehicle',
    frame: !!vehicle ? vehicle.vehicleFrame : undefined,
    strengths: !!vehicle ? vehicle.strengths : [],
    weaknesses: !!vehicle ? vehicle.weaknesses : [],
    looks: !!vehicle ? vehicle.looks : [],
    speed: !!vehicle ? vehicle.speed : 0,
    handling: !!vehicle ? vehicle.handling : 0,
    massive: !!vehicle ? vehicle.massive : 0,
    armor: !!vehicle ? vehicle.armor : 0,
    battleOptions: !!vehicle ? vehicle.battleOptions : [],
  };

  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [
    { frame, name, strengths, weaknesses, looks, speed, handling, massive, armor, battleOptions },
    dispatch,
  ] = useReducer(vehicleFormReducer, initialState);
  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //
  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { character } = useGame();
  const { crustReady } = useFonts();
  // ------------------------------------------------------ graphQL -------------------------------------------------------- //
  const { data: pbCreatorData, loading } = useQuery<PlaybookCreatorData, PlaybookCreatorVars>(PLAYBOOK_CREATOR, {
    // @ts-ignore
    variables: { playbookType: character?.playbook },
    skip: !character,
  });

  const carCreator = pbCreatorData?.playbookCreator.playbookUniqueCreator.carCreator;
  const bikeCreator = pbCreatorData?.playbookCreator.playbookUniqueCreator.bikeCreator;
  // ------------------------------------------------- Component functions -------------------------------------------------- //
  const redBoxLabelStyling = {
    fontWeight: 600,
    marginTop: '3px',
    marginBottom: '6px',
  };
  const titleText =
    frame?.frameType === VehicleFrameType.bike
      ? `WHAT DOES ${character?.name?.toUpperCase()} RIDE?`
      : `WHAT DOES ${character?.name?.toUpperCase()} DRIVE?`;

  const introText =
    frame?.frameType === VehicleFrameType.bike ? bikeCreator?.introInstructions : carCreator?.introInstructions;
  const strengthOptions: string[] | undefined =
    frame?.frameType === VehicleFrameType.bike ? bikeCreator?.strengths : carCreator?.strengths;

  const lookOptions: string[] | undefined =
    frame?.frameType === VehicleFrameType.bike ? bikeCreator?.looks : carCreator?.looks;

  const weaknessOptions: string[] | undefined =
    frame?.frameType === VehicleFrameType.bike ? bikeCreator?.weaknesses : carCreator?.weaknesses;

  const battleOptionOptions: VehicleBattleOption[] | undefined =
    frame?.frameType === VehicleFrameType.bike ? bikeCreator?.battleOptions : carCreator?.battleOptions;

  const handleClickStrength = (strength: string) => {
    if (strengths.includes(strength)) {
      dispatch({ type: 'REMOVE_STRENGTH', payload: strength });
    } else if (strengths.length < 2) {
      dispatch({ type: 'ADD_STRENGTH', payload: strength });
    }
  };

  const handleClickLook = (look: string) => {
    if (looks.includes(look)) {
      dispatch({ type: 'REMOVE_LOOK', payload: look });
    } else if (looks.length < 2) {
      dispatch({ type: 'ADD_LOOK', payload: look });
    }
  };

  const handleClickWeakness = (weakness: string) => {
    if (weaknesses.includes(weakness)) {
      dispatch({ type: 'REMOVE_WEAKNESS', payload: weakness });
    } else if (weaknesses.length < 2) {
      dispatch({ type: 'ADD_WEAKNESS', payload: weakness });
    }
  };

  const handleClickBattleOption = (battleOption: VehicleBattleOption, isSelected: boolean) => {
    if (!!frame) {
      if (isSelected) {
        dispatch({ type: 'REMOVE_BATTLE_OPTION', payload: battleOption });
        switch (battleOption.battleOptionType) {
          case BattleOptionType.speed:
            dispatch({ type: 'REDUCE_SPEED' });
            break;
          case BattleOptionType.handling:
            dispatch({ type: 'REDUCE_HANDLING' });
            break;
          case BattleOptionType.massive:
            dispatch({ type: 'REDUCE_MASSIVE' });
            break;
          case BattleOptionType.armor:
            dispatch({ type: 'REDUCE_ARMOR' });
            break;
          default:
        }
      } else if (battleOptions.length < frame.battleOptionCount) {
        dispatch({ type: 'ADD_BATTLE_OPTION', payload: battleOption });
        switch (battleOption.battleOptionType) {
          case BattleOptionType.speed:
            dispatch({ type: 'INCREASE_SPEED' });
            break;
          case BattleOptionType.handling:
            dispatch({ type: 'INCREASE_HANDLING' });
            break;
          case BattleOptionType.massive:
            dispatch({ type: 'INCREASE_MASSIVE' });
            break;
          case BattleOptionType.armor:
            dispatch({ type: 'INCREASE_ARMOR' });
            break;
          default:
        }
      }
    }
  };

  // ------------------------------------------------------- Effects -------------------------------------------------------- //

  // Set initial frame if none set already
  useEffect(() => {
    if (!!character && !!bikeCreator && !!carCreator && !vehicle) {
      if (character.playbook === PlaybookType.chopper) {
        dispatch({ type: 'SET_FRAME', payload: bikeCreator.frame });
      } else {
        dispatch({ type: 'SET_FRAME', payload: carCreator.frames[2] });
      }
    }
  }, [character, vehicle, bikeCreator, carCreator]);

  // ------------------------------------------------------ Render -------------------------------------------------------- //

  const renderPill = (item: string, isSelected: boolean, callback: (item: string) => void) => {
    return (
      <Box
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

  const renderBattleOptionPill = (battleOption: VehicleBattleOption) => {
    const isSelected = battleOptions.includes(battleOption);
    return (
      <Tip key={battleOption.id} content={battleOption.name}>
        <Box
          key={battleOption.id}
          height="fit-content"
          background={isSelected ? { color: accentColors[0], dark: true } : neutralColors[0]}
          round="medium"
          pad={{ top: '3px', bottom: '1px', horizontal: '12px' }}
          margin={{ vertical: '3px', horizontal: '3px' }}
          justify="center"
          onClick={() => handleClickBattleOption(battleOption, isSelected)}
          hoverIndicator={{ color: '#698D70', dark: true }}
        >
          <Text weight="bold" size="medium">
            {battleOption.battleOptionType}
          </Text>
        </Box>
      </Tip>
    );
  };

  if (loading || !character || !carCreator || !frame) {
    return <Spinner />;
  }

  return (
    <Box width="80vw" direction="column" align="start" justify="start" overflow="auto" flex="grow">
      <HeadingWS crustReady={crustReady} level={2} alignSelf="center" margin={{ vertical: '6px' }}>
        {titleText}
      </HeadingWS>
      <Box border direction="row" fill="horizontal" justify="end">
        <Box border pad="12px" fill="vertical" justify="between">
          <TextWS>{introText}</TextWS>
          <Box>
            <TextWS>Give your vehicle a name (make/model, nickname, whatever):</TextWS>
            <TextInput name="name" value={name} onChange={(e) => dispatch({ type: 'SET_NAME', payload: e.target.value })} />
          </Box>
          <Box>
            <TextWS>Choose its frame (resets other settings):</TextWS>
            <Select
              options={carCreator.frames}
              labelKey="frameType"
              value={frame}
              onChange={(event) => dispatch({ type: 'SET_FRAME', payload: event.value })}
            />
          </Box>
          <Box>
            <TextWS>Strengths (choose 1 or 2)</TextWS>
            <Box direction="row" margin={{ top: '3px' }} wrap>
              {strengthOptions?.map((strength) => {
                const isSelected = strengths.includes(strength);
                return renderPill(strength, isSelected, handleClickStrength);
              })}
            </Box>
          </Box>
          <Box>
            <TextWS>Looks (choose 1 or 2)</TextWS>
            <Box direction="row" margin={{ top: '3px' }} wrap>
              {lookOptions?.map((look) => {
                const isSelected = looks.includes(look);
                return renderPill(look, isSelected, handleClickLook);
              })}
            </Box>
          </Box>
          <Box>
            <TextWS>Weaknesses (choose 1 or 2)</TextWS>
            <Box direction="row" margin={{ top: '3px' }} wrap>
              {weaknessOptions?.map((weakness) => {
                const isSelected = weaknesses.includes(weakness);
                return renderPill(weakness, isSelected, handleClickWeakness);
              })}
            </Box>
          </Box>
          <Box>
            <TextWS>Battle options (choose {frame.battleOptionCount})</TextWS>
            <Box direction="row" margin={{ top: '3px' }} wrap>
              {battleOptionOptions?.map((battleOption) => renderBattleOptionPill(battleOption))}
            </Box>
          </Box>
        </Box>
        <Box
          border
          direction="row"
          justify="between"
          align="start"
          wrap
          width="200px"
          pad="12px"
          style={{ minWidth: '200px' }}
        >
          <Box fill="horizontal" align="center" justify="center">
            <HeadingWS level={3} crustReady={crustReady} margin={{ vertical: '3px' }}>
              {name}
            </HeadingWS>
          </Box>
          <Box fill="horizontal" justify="start" align="center">
            <RedBox align="center" justify="center" pad="12px" width="200px">
              <HeadingWS level={2} crustReady={crustReady} margin={{ bottom: '0px', top: '6px' }}>
                {frame?.frameType}
              </HeadingWS>
            </RedBox>
            <TextWS style={redBoxLabelStyling}>Frame</TextWS>
          </Box>
          <Box justify="start" align="center">
            <RedBox align="center" justify="center" pad="12px" width="80px">
              <HeadingWS level={2} crustReady={crustReady} margin={{ bottom: '0px', top: '6px' }}>
                {speed}
              </HeadingWS>
            </RedBox>
            <TextWS style={redBoxLabelStyling}>Speed</TextWS>
          </Box>
          <Box justify="start" align="center">
            <RedBox align="center" justify="center" pad="12px" width="80px">
              <HeadingWS level={2} crustReady={crustReady} margin={{ bottom: '0px', top: '6px' }}>
                {handling}
              </HeadingWS>
            </RedBox>
            <TextWS style={redBoxLabelStyling}>Handling</TextWS>
          </Box>
          <Box justify="start" align="center">
            <RedBox align="center" justify="center" pad="12px" width="80px">
              <HeadingWS level={2} crustReady={crustReady} margin={{ bottom: '0px', top: '6px' }}>
                {massive}
              </HeadingWS>
            </RedBox>
            <TextWS style={redBoxLabelStyling}>Massive</TextWS>
          </Box>
          <Box justify="start" align="center">
            <RedBox align="center" justify="center" pad="12px" width="80px">
              <HeadingWS level={2} crustReady={crustReady} margin={{ bottom: '0px', top: '6px' }}>
                {armor}
              </HeadingWS>
            </RedBox>
            <TextWS style={redBoxLabelStyling}>Armor</TextWS>
          </Box>

          <Box fill="horizontal" justify="start" align="center">
            <RedBox align="center" justify="center" pad="12px" width="200px" height="132px">
              <TextWS>{strengths.concat(looks).concat(weaknesses).join(', ')}</TextWS>
            </RedBox>
            <TextWS style={redBoxLabelStyling}>Tags</TextWS>
          </Box>

          <ButtonWS primary fill="horizontal" label="SET" />
        </Box>
      </Box>
    </Box>
  );
};

export default VehicleForm;
