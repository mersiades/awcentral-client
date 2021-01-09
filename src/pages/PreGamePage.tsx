import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useHistory, useParams } from 'react-router-dom';

import { Box } from 'grommet';
import CloseButton from '../components/CloseButton';
import { HeadingWS, RedBox, TextWS } from '../config/grommetConfig';
import GAME, { GameData, GameVars } from '../queries/game';
import { useGameRoles } from '../contexts/gameRoleContext';
import { useKeycloakUser } from '../contexts/keycloakUserContext';
import { Character } from '../@types/dataInterfaces';
import { Roles } from '../@types/enums';
import { decapitalize } from '../helpers/decapitalize';
import { Checkbox, Checkmark } from 'grommet-icons';

const PreGamePage = () => {
  // -------------------------------------------------- Component state ---------------------------------------------------- //
  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //
  const { gameId } = useParams<{ gameId: string }>();
  const history = useHistory();
  const { data: gameData } = useQuery<GameData, GameVars>(GAME, { variables: { gameId } });
  const game = gameData?.game;
  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { id: userId } = useKeycloakUser();
  const { userGameRole, mcGameRole, allPlayerGameRoles, otherPlayerGameRoles, setGameRoles } = useGameRoles();

  // ----------------------------------------- Component functions and variables ------------------------------------------- //

  const pathToGame = userGameRole?.role === Roles.mc ? `/mc-game/${game?.id}` : `/player-game/${game?.id}`;

  // ------------------------------------------------------ Effects -------------------------------------------------------- //

  // Send User to MenuPage if not a member of this game
  useEffect(() => {
    if (!!game && !!userId) {
      const memberIds = game?.gameRoles.map((gameRole) => gameRole.userId);
      if (!memberIds.includes(userId)) {
        history.push('/menu');
      }
    }
  }, [game, userId, history]);

  // Send User to MCPage or PlayerPage if pre-game is already complete
  useEffect(() => {
    if (!!userGameRole && !!game && game?.hasFinishedPreGame) {
      history.push(pathToGame);
    }
  }, [game, userGameRole, pathToGame, history]);

  // Set the Game's GameRoles
  useEffect(() => {
    if (!!game && game.gameRoles.length > 0 && !!userId && !!setGameRoles) {
      setGameRoles(game.gameRoles, userId);
    }
  }, [game, userId, setGameRoles]);

  // ------------------------------------------------------ Render -------------------------------------------------------- //

  const renderPlayerBox = (character: Character, index: number) => {
    console.log('character', character);
    return (
      <RedBox key={!!character?.id ? character.id : index} align="center" pad={{ horizontal: '12px' }}>
        <HeadingWS level="3" margin={{ vertical: '12px' }}>
          {`${!!character?.name ? character.name : 'Name'}  --  ${
            !!character?.playbook ? decapitalize(character.playbook) : 'Playbook'
          }`}
        </HeadingWS>

        <Box direction="row" align="center" justify="around">
          <Box align="center" margin="12px" gap="12px">
            {!!character && character.looks.length === 5 ? (
              <Checkmark size="xlarge" color="accent-1" />
            ) : (
              <Checkbox size="xlarge" color="neutral-1" />
            )}
            <TextWS size="large">Looks</TextWS>
          </Box>
          <Box align="center" pad="12px" gap="12px">
            {!!character && character.statsBlock.length === 5 ? (
              <Checkmark size="xlarge" color="accent-1" />
            ) : (
              <Checkbox size="xlarge" color="neutral-1" />
            )}
            <TextWS size="large">Stats</TextWS>
          </Box>
          <Box align="center" pad="12px" gap="12px">
            {!!character && character.gear.length > 0 ? (
              <Checkmark size="xlarge" color="accent-1" />
            ) : (
              <Checkbox size="xlarge" color="neutral-1" />
            )}
            <TextWS size="large">Gear</TextWS>
          </Box>
          <Box align="center" pad="12px" gap="12px">
            {!!character && !!character.playbookUnique ? (
              <Checkmark size="xlarge" color="accent-1" />
            ) : (
              <Checkbox size="xlarge" color="neutral-1" />
            )}
            <TextWS size="large">Unique</TextWS>
          </Box>
          <Box align="center" pad="12px" gap="12px">
            {!!character && character.characterMoves.length > 2 ? (
              <Checkmark size="xlarge" color="accent-1" />
            ) : (
              <Checkbox size="xlarge" color="neutral-1" />
            )}
            <TextWS size="large">Moves</TextWS>
          </Box>
          <Box align="center" pad="12px" gap="12px">
            {!!character && character.hxBlock.length > 0 ? (
              <Checkmark size="xlarge" color="accent-1" />
            ) : (
              <Checkbox size="xlarge" color="neutral-1" />
            )}
            <TextWS size="large">Hx</TextWS>
          </Box>
        </Box>
      </RedBox>
    );
  };

  return (
    <Box background="black" fill align="center" justify="start" pad="24px">
      <CloseButton handleClose={() => history.push(pathToGame)} />
      <HeadingWS level="2">PRE-GAME PROGRESS</HeadingWS>
      {allPlayerGameRoles?.map((gameRole, index) => {
        return renderPlayerBox(gameRole.characters[0], index);
      })}
    </Box>
  );
};

export default PreGamePage;
