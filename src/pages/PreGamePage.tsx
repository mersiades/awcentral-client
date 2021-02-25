import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useHistory, useParams } from 'react-router-dom';

import { Box, Button } from 'grommet';
import CloseButton from '../components/CloseButton';
import { HeadingWS, RedBox, TextWS } from '../config/grommetConfig';
import FINISH_PRE_GAME, { FinishPreGameData, FinishPreGameVars } from '../mutations/finishPreGame';
import { useGame } from '../contexts/gameContext';
import { useKeycloakUser } from '../contexts/keycloakUserContext';
import { Character } from '../@types/dataInterfaces';
import { PlaybookType, RoleType } from '../@types/enums';
import { decapitalize } from '../helpers/decapitalize';
import { Checkbox, Checkmark } from 'grommet-icons';
import ScrollableIndicator from '../components/ScrollableIndicator';
import Spinner from '../components/Spinner';
import styled from 'styled-components';

export const background = {
  color: 'black',
  dark: true,
  size: 'contain',
  image: 'url(/images/background-image-7.jpg)',
  position: 'bottom left',
};

const StyledLi = styled.li`
  text-shadow: 0 0 2px #000, 0 0 4px #000;
  cursor: default;
`;

const PreGamePage = () => {
  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [havePlayersFinished, setHavePlayersFinished] = useState(false);
  const [showScrollable, setShowScrollable] = useState(false);

  // ------------------------------------------------------- Refs -------------------------------------------------------- //
  const containerRef = useRef<HTMLDivElement>(null);

  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //
  const { gameId } = useParams<{ gameId: string }>();
  const history = useHistory();
  const [finishPreGame, { loading: finishingPreGame }] = useMutation<FinishPreGameData, FinishPreGameVars>(FINISH_PRE_GAME);

  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { id: userId } = useKeycloakUser();
  const { game, userGameRole, allPlayerGameRoles, setGameContext } = useGame();

  // ----------------------------------------- Component functions and variables ------------------------------------------- //

  const pathToGame = userGameRole?.role === RoleType.mc ? `/mc-game/${game?.id}` : `/player-game/${game?.id}`;

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

  const getUnique = (playbookType: PlaybookType) => {
    switch (playbookType) {
      case PlaybookType.angel:
        return 'Angel kit';
      case PlaybookType.battlebabe:
        return 'Custom weapons';
      case PlaybookType.brainer:
        return 'Brainer gear';
      case PlaybookType.chopper:
        return 'gang';
      case PlaybookType.gunlugger:
        return 'Weapons';
      case PlaybookType.hardholder:
        return 'Holding';
      case PlaybookType.hocus:
        return 'Followers';
      case PlaybookType.maestroD:
        return 'Establishment';
      case PlaybookType.savvyhead:
        return 'Workspace';
      case PlaybookType.skinner:
        return 'Skinner gear';
      default:
        return 'Unique';
    }
  };

  const handleStartGame = async () => {
    if (!!game) {
      try {
        await finishPreGame({ variables: { gameId: game.id } });
        history.push(pathToGame);
      } catch (error) {
        console.error(error);
      }
    }
  };

  // ------------------------------------------------------ Effects -------------------------------------------------------- //

  // Send User to MenuPage if not a member of this game
  useEffect(() => {
    if (!!game && !!userId) {
      const memberIds = game.gameRoles.map((gameRole) => gameRole.userId);
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

  // Set the GameContext
  useEffect(() => {
    if (!!gameId && !!userId && !!setGameContext) {
      setGameContext(gameId, userId);
    }
  }, [gameId, userId, setGameContext]);

  useEffect(() => {
    const unfinishedPlayers = allPlayerGameRoles?.filter((gameRole) => {
      if (!gameRole.characters[0]) {
        return true;
      } else if (!gameRole.characters[0].hasCompletedCharacterCreation) {
        return true;
      } else {
        return false;
      }
    });
    unfinishedPlayers?.length === 0 ? setHavePlayersFinished(true) : setHavePlayersFinished(false);
  }, [allPlayerGameRoles]);

  useEffect(() => {
    if (!!containerRef.current) {
      containerRef.current.addEventListener('scroll', (e) => handleScroll(e));
      if (containerRef.current.scrollHeight > containerRef.current.offsetHeight) {
        setShowScrollable(true);
      } else {
        setShowScrollable(false);
      }
      containerRef.current.scrollTop = 0;
    }
  }, [containerRef]);

  // ------------------------------------------------------ Render -------------------------------------------------------- //

  const renderVehicleProgress = (character: Character) => {
    if ([PlaybookType.driver, PlaybookType.chopper].includes(character.playbook)) {
      return character.vehicles.length > 0 ? (
        <Box align="center" pad="12px" gap="12px" width="80px">
          <Checkmark size="large" color="accent-1" />
          <TextWS size="large">Vehicles</TextWS>
        </Box>
      ) : (
        <Box align="center" pad="12px" gap="12px" width="80px">
          <Checkbox size="large" color="neutral-1" />
          <TextWS size="large">Vehicles</TextWS>
        </Box>
      );
    } else {
      return null;
    }
  };

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
          <Box
            data-testid={`${character?.id ? character.id : index}-looks-box`}
            align="center"
            pad="12px"
            gap="12px"
            width="80px"
          >
            {!!character && character.looks.length === 5 ? (
              <Checkmark size="large" color="accent-1" />
            ) : (
              <Checkbox size="large" color="neutral-1" />
            )}
            <TextWS size="large">Looks</TextWS>
          </Box>
          <Box align="center" pad="12px" gap="12px" width="80px">
            {!!character && character.statsBlock?.stats.length === 5 ? (
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
          {!!character && character.playbook !== PlaybookType.driver && (
            <Box align="center" pad="12px" gap="12px" width="80px">
              {!!character.playbookUnique ? (
                <Checkmark size="large" color="accent-1" />
              ) : (
                <Checkbox size="large" color="neutral-1" />
              )}
              <TextWS size="large" textAlign="center">
                {!!character.playbook ? getUnique(character.playbook) : 'Unique'}
              </TextWS>
            </Box>
          )}
          <Box align="center" pad="12px" gap="12px" width="80px">
            {!!character && character.characterMoves.length > 2 ? (
              <Checkmark size="large" color="accent-1" />
            ) : (
              <Checkbox size="large" color="neutral-1" />
            )}
            <TextWS size="large">Moves</TextWS>
          </Box>

          {!!character && renderVehicleProgress(character)}

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
    <Box
      data-testid="pre-game-page"
      ref={containerRef}
      background={background}
      fill
      align="center"
      justify="start"
      pad="24px"
      overflow="auto"
    >
      <CloseButton handleClose={() => history.push(pathToGame)} />
      <ScrollableIndicator show={showScrollable} />
      <HeadingWS level="2">PRE-GAME</HeadingWS>
      {userGameRole?.role === RoleType.mc && (
        <Box flex="grow" style={{ maxWidth: '812px' }} gap="3px">
          <Button
            alignSelf="center"
            label={finishingPreGame ? <Spinner fillColor="#FFF" width="37px" height="36px" /> : 'START GAME'}
            primary
            onClick={() => !finishingPreGame && handleStartGame()}
            disabled={!havePlayersFinished}
            size="large"
            margin="12px"
          />
          <TextWS>Use this time to build the world you will play in.</TextWS>
          <TextWS>Ask your players lots of questions about their characters and the world.</TextWS>
          <TextWS>While the players are making their characters, here are some things to get out up-front:</TextWS>
          <ul>
            <StyledLi>Your characters don't have to be friends, but they should definitely be allies.</StyledLi>
            <StyledLi>Your characters are unique in Apocalypse World.</StyledLi>
            <StyledLi>1-armor can be armor or clothing. 2-armor is armor.</StyledLi>
            <StyledLi>
              Is <em>barter</em> a medium of exchange? What do you use?
            </StyledLi>
            <StyledLi>I'm not out to get you. I'm here to find out what's going to happen. Same as you!</StyledLi>
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
