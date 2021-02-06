import React, { ChangeEvent, FC, Reducer, useEffect, useReducer, useState } from 'react';
import { shuffle } from 'lodash';
import { useMutation, useQuery } from '@apollo/client';
import { Box, FormField, TextArea } from 'grommet';

import DialogWrapper from '../DialogWrapper';
import Spinner from '../Spinner';
import { ButtonWS, HeadingWS, npcDialogBackground, TextInputWS } from '../../config/grommetConfig';
import THREAT_CREATOR, { ThreatCreatorData, ThreatCreatorVars } from '../../queries/threatCreator';
import ADD_NPC, { AddNpcData, AddNpcVars } from '../../mutations/addNpc';
import { NpcInput } from '../../@types';
import { Npc } from '../../@types/dataInterfaces';
import { useFonts } from '../../contexts/fontContext';
import { useGame } from '../../contexts/gameContext';

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
  const { mcGameRole } = useGame();
  const { crustReady } = useFonts();

  // ------------------------------------------------------ graphQL -------------------------------------------------------- //
  const { data } = useQuery<ThreatCreatorData, ThreatCreatorVars>(THREAT_CREATOR);
  const threatCreator = data?.threatCreator;
  const [addNpc, { loading: addingNpc }] = useMutation<AddNpcData, AddNpcVars>(ADD_NPC);
  // ---------------------------------------- Component functions and variables ------------------------------------------ //

  const handleSetNpc = async () => {
    if (!!mcGameRole) {
      const npc: NpcInput = {
        id: existingNpc ? existingNpc.id : undefined,
        name,
        description,
      };
      try {
        await addNpc({
          variables: { gameRoleId: mcGameRole.id, npc },
        });
        handleClose();
      } catch (error) {
        console.error(error);
      }
    }
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
            suggestions={name === '' ? shuffle(threatCreator.threatNames) : filteredNames}
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
      label={addingNpc ? <Spinner fillColor="#FFF" width="100%" height="36px" /> : 'SET'}
      onClick={() => !addingNpc && !!name && handleSetNpc()}
      disabled={!!addingNpc || !name}
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
