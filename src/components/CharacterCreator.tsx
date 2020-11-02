import React, { FC, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@apollo/client'

import PlaybooksSelector from './PlaybooksSelector'
import CREATE_CHARACTER, { CreateCharacterData, CreateCharacterVars } from '../mutations/createCharacter'
import SET_CHARACTER_PLAYBOOK, { SetCharacterPlaybookData, SetCharacterPlaybookVars } from '../mutations/setCharacterPlaybook'
import GAME_FOR_PLAYER from '../queries/gameForPlayer'
import PLAYBOOKS, { PlaybooksData } from '../queries/playbooks'
import { PlayBooks } from '../@types/enums'


interface CharacterCreatorProps {
  gameRoleId: string
  userId: string
}

const CharacterCreator: FC<CharacterCreatorProps> = ({ gameRoleId, userId }) => {
  /**
   * Step 0 = Choose a playbook
   */
  const [creationStep, setCreationStep] = useState<number>(0)
  const { gameID: textChannelId} = useParams<{ gameID: string}>()

  const { data: playbooksData, loading: loadingPlaybooks } = useQuery<PlaybooksData>(PLAYBOOKS)
  const [ createCharacter ] = useMutation<CreateCharacterData, CreateCharacterVars>(CREATE_CHARACTER)
  const [ setCharacterPlaybook ] =  useMutation<SetCharacterPlaybookData, SetCharacterPlaybookVars>(SET_CHARACTER_PLAYBOOK)

  const playbooks = playbooksData?.playbooks 

  const handlePlaybookSelect = async (playbookType: PlayBooks) => {
    let characterId
    try {
      const { data: characterData } = await createCharacter({ variables: { gameRoleId }})
      characterId = characterData?.createCharacter.id
    } catch (error) {
      console.error(error)
    }
    if (!characterId) {
      console.warn('No character id, playbook not set')
      return
    }
    
    try {
      await setCharacterPlaybook({ variables: { gameRoleId, characterId, playbookType }, refetchQueries: [{ query: GAME_FOR_PLAYER, variables: { textChannelId, userId }}]})
    } catch (error) {
      console.error(error)
    }
    
    setCreationStep(1)
  }

  if (loadingPlaybooks || !playbooks) {
    return <p>Loading...</p>
  }
  
  return (
    <>
    { creationStep === 0 && (
      <PlaybooksSelector playbooks={playbooks} handlePlaybookSelect={handlePlaybookSelect}/>
    )}
    { creationStep === 1 && (
      <p>Next step</p>
    )}
    </>
  )
}

export default CharacterCreator
