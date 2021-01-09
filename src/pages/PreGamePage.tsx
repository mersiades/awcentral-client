import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useHistory, useParams } from 'react-router-dom';

import { Box, Button } from 'grommet';
import CloseButton from '../components/CloseButton';
import { HeadingWS, RedBox, TextWS } from '../config/grommetConfig';
import GAME, { GameData, GameVars } from '../queries/game';
import { useGameRoles } from '../contexts/gameRoleContext';
import { useKeycloakUser } from '../contexts/keycloakUserContext';
import { Character } from '../@types/dataInterfaces';
import { PlayBooks, Roles } from '../@types/enums';
import { decapitalize } from '../helpers/decapitalize';
import { Checkbox, Checkmark } from 'grommet-icons';
import ScrollableIndicator from '../components/ScrollableIndicator';

const PreGamePage = () => {
  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [havePlayersFinished, setHavePlayersFinished] = useState(false);
  const [showScrollable, setShowScrollable] = useState(false);

  // ------------------------------------------------------- Refs -------------------------------------------------------- //
  const containerRef = useRef<HTMLDivElement>(null);

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

  // TODO: refactor out into HOC
  const handleScroll = (e: any) => {
    if (!e.currentTarget) {
      return;
    }
    if (e.currentTarget.scrollHeight <= e.currentTarget.offsetHeight) {
      setShowScrollable(false);
      return;
    }

    if (e.currentTarget.scrollTop > 0) {
      setShowScrollable(false);
      return;
    }

    if (e.currentTarget.scrollTop === 0) {
      setShowScrollable(true);
      return;
    }
  };

  const getUnique = (playbookType: PlayBooks) => {
    switch (playbookType) {
      case PlayBooks.angel:
        return 'Angel kit';
      case PlayBooks.battlebabe:
        return 'Custom weapons';
      case PlayBooks.brainer:
        return 'Brainer gear';
      case PlayBooks.chopper:
        return 'Bike & gang';
      case PlayBooks.driver:
        return 'Cars';
      case PlayBooks.gunlugger:
        return 'Weapons';
      case PlayBooks.hardholder:
        return 'Holding';
      case PlayBooks.hocus:
        return 'Followers';
      case PlayBooks.maestroD:
        return 'Establishment';
      case PlayBooks.savvyhead:
        return 'Workspace';
      case PlayBooks.skinner:
        return 'Skinner gear';
      default:
        return 'Unique';
    }
  };

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

  useEffect(() => {
    const unfinishedPlayers = allPlayerGameRoles?.filter((gameRole) => {
      console.log('gameRoles.characters', gameRole?.characters);
      if (!gameRole.characters[0]) {
        return true;
      } else if (!gameRole.characters[0].hasCompletedCharacterCreation) {
        return true;
      } else {
        return false;
      }
    });
    console.log('unfinishedPlayers?.length', unfinishedPlayers?.length);
    unfinishedPlayers?.length === 0 ? setHavePlayersFinished(true) : setHavePlayersFinished(false);
  }, [allPlayerGameRoles]);

  useEffect(() => {
    if (!!containerRef.current) {
      containerRef.current.addEventListener('scroll', (e) => handleScroll(e));
      if (containerRef.current.scrollHeight >= containerRef.current.offsetHeight) {
        setShowScrollable(true);
      } else {
        setShowScrollable(false);
      }
      containerRef.current.scrollTop = 0;
    }
  }, [containerRef]);

  // ------------------------------------------------------ Render -------------------------------------------------------- //

  const renderPlayerBox = (character: Character, index: number) => {
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

        <Box direction="row" align="start" justify="around">
          <Box align="center" pad="12px" gap="12px" width="80px">
            {!!character && character.looks.length === 5 ? (
              <Checkmark size="large" color="accent-1" />
            ) : (
              <Checkbox size="large" color="neutral-1" />
            )}
            <TextWS size="large">Looks</TextWS>
          </Box>
          <Box align="center" pad="12px" gap="12px" width="80px">
            {!!character && character.statsBlock.length === 5 ? (
              <Checkmark size="large" color="accent-1" />
            ) : (
              <Checkbox size="large" color="neutral-1" />
            )}
            <TextWS size="large">Stats</TextWS>
          </Box>
          <Box align="center" pad="12px" gap="12px" width="80px">
            {!!character && character.gear.length > 0 ? (
              <Checkmark size="large" color="accent-1" />
            ) : (
              <Checkbox size="large" color="neutral-1" />
            )}
            <TextWS size="large">Gear</TextWS>
          </Box>
          <Box align="center" pad="12px" gap="12px" width="80px">
            {!!character && !!character.playbookUnique ? (
              <Checkmark size="large" color="accent-1" />
            ) : (
              <Checkbox size="large" color="neutral-1" />
            )}
            <TextWS size="large" textAlign="center">
              {!!character && !!character.playbook ? getUnique(character.playbook) : 'Unique'}
            </TextWS>
          </Box>
          <Box align="center" pad="12px" gap="12px" width="80px">
            {!!character && character.characterMoves.length > 2 ? (
              <Checkmark size="large" color="accent-1" />
            ) : (
              <Checkbox size="large" color="neutral-1" />
            )}
            <TextWS size="large">Moves</TextWS>
          </Box>
          <Box align="center" pad="12px" gap="12px" width="80px">
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
    <Box ref={containerRef} background="black" fill align="center" justify="start" pad="24px" overflow="auto">
      <CloseButton handleClose={() => history.push(pathToGame)} />
      <ScrollableIndicator show={showScrollable} />
      <HeadingWS level="2">PRE-GAME</HeadingWS>
      {userGameRole?.role === Roles.mc && (
        <Box flex="grow" style={{ maxWidth: '812px' }} gap="3px">
          <Button
            alignSelf="center"
            label="START GAME"
            primary
            onClick={() => {}}
            disabled={!havePlayersFinished}
            size="large"
            margin="12px"
          />
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
      <Box direction="row" wrap justify="center" flex="shrink" margin={{ bottom: '12px' }}>
        {allPlayerGameRoles?.map((gameRole, index) => {
          return renderPlayerBox(gameRole.characters[0], index);
        })}
      </Box>
    </Box>
  );
};

export default PreGamePage;
