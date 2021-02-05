import { useMutation, useQuery } from '@apollo/client';
import { Box, FormField, TextArea } from 'grommet';
import React, { ChangeEvent, FC, Reducer, useEffect, useReducer, useState } from 'react';
import { Npc } from '../../@types/dataInterfaces';
import { ButtonWS, HeadingWS, npcDialogBackground, TextInputWS } from '../../config/grommetConfig';
import { useFonts } from '../../contexts/fontContext';
import { useGame } from '../../contexts/gameContext';
import ADD_THREAT, { AddThreatData, AddThreatVars } from '../../mutations/addThreat';
import THREAT_CREATOR, { ThreatCreatorData, ThreatCreatorVars } from '../../queries/threatCreator';
import DialogWrapper from '../DialogWrapper';
import Spinner from '../Spinner';

interface NpcDialogProps {
  handleClose: () => void;
  existingNpc?: Npc;
}

interface NpcFormState {
  name: string;
  description?: string;
}

interface Action {
  type: 'SET_NAME' | 'SET_DESC';
  payload?: any;
}

const npcFormReducer: Reducer<NpcFormState, Action> = (state: NpcFormState, action: Action) => {
  switch (action.type) {
    case 'SET_NAME':
      return {
        ...state,
        name: action.payload,
      };
    case 'SET_DESC':
      return {
        ...state,
        description: action.payload,
      };
    default:
      return state;
  }
};

const NpcDialog: FC<NpcDialogProps> = ({ handleClose, existingNpc }) => {
  const initialState: NpcFormState = {
    name: !!existingNpc ? existingNpc.name : '',
    description: !!existingNpc?.description ? existingNpc.description : '',
  };

  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [{ name, description }, dispatch] = useReducer(npcFormReducer, initialState);
  const [filteredNames, setFilteredNames] = useState<string[]>([]);

  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { game, mcGameRole } = useGame();
  const { crustReady } = useFonts();

  // ------------------------------------------------------ graphQL -------------------------------------------------------- //
  const { data } = useQuery<ThreatCreatorData, ThreatCreatorVars>(THREAT_CREATOR);
  const threatCreator = data?.threatCreator;
  const [addThreat, { loading: addingThreat }] = useMutation<AddThreatData, AddThreatVars>(ADD_THREAT);
  // ---------------------------------------- Component functions and variables ------------------------------------------ //

  const handleSetNpc = async () => {
    // if (!!game && mcGameRole) {
    //   const threat: ThreatInput = {
    //     id: existingThreat ? existingThreat.id : undefined,
    //     name,
    //     threatKind,
    //     impulse,
    //     description,
    //     stakes,
    //   };
    //   try {
    //     await addThreat({
    //       variables: { gameRoleId: mcGameRole.id, threat },
    //     });
    //     handleClose();
    //   } catch (error) {
    //     console.error(error);
    //   }
    // }
  };

  // ------------------------------------------------------- Effects -------------------------------------------------------- //
  useEffect(() => {
    if (!!threatCreator) {
      const filteredNames = threatCreator.threatNames.filter((n) => n.toLowerCase().includes(name.toLowerCase()));
      setFilteredNames(filteredNames);
    }
  }, [threatCreator, name]);

  // -------------------------------------------------- Render component  ---------------------------------------------------- //

  const renderNameForm = () => (
    <Box flex="grow">
      <FormField label="Name" name="threatName" width="100%">
        {!!threatCreator && (
          <TextInputWS
            placeholder="Type or select name"
            name="threatName"
            value={name}
            size="xlarge"
            suggestions={name === '' ? threatCreator.threatNames : filteredNames}
            onChange={(e) => dispatch({ type: 'SET_NAME', payload: e.target.value })}
            // @ts-ignore
            onSuggestionSelect={({ suggestion }) => dispatch({ type: 'SET_NAME', payload: suggestion })}
          />
        )}
      </FormField>
    </Box>
  );

  const renderDescriptionForm = () => (
    <Box flex="grow">
      <FormField label="Description & notes" name="description" width="100%">
        <TextArea
          name="description"
          fill
          size="xlarge"
          value={description}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => dispatch({ type: 'SET_DESC', payload: e.target.value })}
          style={{ whiteSpace: 'pre-wrap', height: '250px' }}
        />
      </FormField>
    </Box>
  );

  const renderButton = () => (
    <ButtonWS
      primary
      fill="horizontal"
      label="SET"
      // label={addingThreat ? <Spinner fillColor="#FFF" width="100%" height="36px" /> : 'SET'}
      // onClick={() => !addingThreat && !!name && !!threatKind && !!impulse && handleSetNpc()}
      // disabled={!!addingThreat || !name}
    />
  );

  return (
    <DialogWrapper background={npcDialogBackground} handleClose={handleClose}>
      <Box fill gap="18px" overflow="auto" style={{ minWidth: '400px' }}>
        <HeadingWS crustReady={crustReady} level="3">
          {!!existingNpc ? `Edit ${existingNpc.name}` : 'Add npc'}
        </HeadingWS>
        {renderNameForm()}
        {renderDescriptionForm()}
        {renderButton()}
      </Box>
    </DialogWrapper>
  );
};

export default NpcDialog;
