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
  const { data: gameData } = useQuery<GameData, GameVars>(GAME, { variables: { gameId } /*pollInterval: 2500*/ });
  const game = gameData?.game;
  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { id: userId } = useKeycloakUser();
  const { userGameRole, allPlayerGameRoles, setGameRoles } = useGameRoles();

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
      <RedBox
        key={!!character?.id ? character.id : index}
        align="center"
        pad={{ top: '18px', horizontal: '12px' }}
        margin="12px"
      >
        <HeadingWS level="3" margin={{ vertical: '0' }}>
          {`${!!character?.name ? character.name : 'Name'}  --  ${
            !!character?.playbook ? decapitalize(character.playbook) : 'Playbook'
          }`}
        </HeadingWS>

        <Box direction="row" align="center" justify="around">
          <Box align="center" margin={{ horizontal: '6px' }} gap="12px">
            {!!character && character.looks.length === 5 ? (
              <Checkmark size="large" color="accent-1" />
            ) : (
              <Checkbox size="large" color="neutral-1" />
            )}
            <TextWS size="large">Looks</TextWS>
          </Box>
          <Box align="center" pad="12px" gap="12px">
            {!!character && character.statsBlock.length === 5 ? (
              <Checkmark size="large" color="accent-1" />
            ) : (
              <Checkbox size="large" color="neutral-1" />
            )}
            <TextWS size="large">Stats</TextWS>
          </Box>
          <Box align="center" pad="12px" gap="12px">
            {!!character && character.gear.length > 0 ? (
              <Checkmark size="large" color="accent-1" />
            ) : (
              <Checkbox size="large" color="neutral-1" />
            )}
            <TextWS size="large">Gear</TextWS>
          </Box>
          <Box align="center" pad="12px" gap="12px">
            {!!character && !!character.playbookUnique ? (
              <Checkmark size="large" color="accent-1" />
            ) : (
              <Checkbox size="large" color="neutral-1" />
            )}
            <TextWS size="large">Unique</TextWS>
          </Box>
          <Box align="center" pad="12px" gap="12px">
            {!!character && character.characterMoves.length > 2 ? (
              <Checkmark size="large" color="accent-1" />
            ) : (
              <Checkbox size="large" color="neutral-1" />
            )}
            <TextWS size="large">Moves</TextWS>
          </Box>
          <Box align="center" pad="12px" gap="12px">
            {!!character && character.hxBlock.length > 0 ? (
              <Checkmark size="large" color="accent-1" />
            ) : (
              <Checkbox size="large" color="neutral-1" />
            )}
            <TextWS size="large">Hx</TextWS>
          </Box>
        </Box>
      </RedBox>
    );
  };

  return (
    <Box background="black" fill align="center" justify="start" pad="24px" overflow="auto">
      <CloseButton handleClose={() => history.push(pathToGame)} />
      <HeadingWS level="2">PRE-GAME PROGRESS</HeadingWS>
      {userGameRole?.role === Roles.mc && (
        <Box flex="grow" style={{ maxWidth: '812px' }} gap="3px">
          <TextWS>Use this time to build the world you will play in.</TextWS>
          <TextWS>Ask your players lots of questions about their characters and the world.</TextWS>
          <TextWS>While the players are making their characters, here are some things to get out up-front:</TextWS>
          <ul>
            <li>Your characters don't have to be friends, but they should definitely be allies.</li>
            <li>Your characters are unique in Apocalypse World.</li>
            <li>1-armor can be armor or clothing. 2-armor is armor.</li>
            <li>
              Is <em>barter</em> a medium of exchange? What do you use?
            </li>
            <li>I'm not out to get you. I'm here to find out what's going to happen. Same as you!</li>
          </ul>
        </Box>
      )}
      <Box direction="row" wrap justify="center">
        {allPlayerGameRoles?.map((gameRole, index) => {
          return renderPlayerBox(gameRole.characters[0], index);
        })}
      </Box>
    </Box>
  );
};

export default PreGamePage;
