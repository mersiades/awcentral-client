import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { Menu, Tip, Button, Header } from 'grommet';

import CharacterPreview from './CharacterPreview';
import { ThemeContext } from 'styled-components';
import { Character, GameRole } from '../@types/dataInterfaces';
import { accentColors, customDefaultButtonStyles } from '../config/grommetConfig';
import { useGame } from '../contexts/gameContext';
import { gamePageTopNavbarHeight } from '../config/constants';

interface GameNavbarProps {
  isMc: boolean;
}

const GameNavbar: FC<GameNavbarProps> = ({ isMc }) => {
  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //
  const history = useHistory();
  const { keycloak } = useKeycloak();

  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { game, otherPlayerGameRoles, allPlayerGameRoles } = useGame();

  // ------------------------------------------------------ Render -------------------------------------------------------- //
  const renderCharacterPreviews = (gameRoles: GameRole[]) => {
    return gameRoles.map((gameRole: GameRole) =>
      gameRole.characters?.map((character: Character) => (
        <Tip key={character.id} content={<CharacterPreview character={character} isMc={isMc} />}>
          <Button label={character.name} style={{ backgroundColor: 'transparent', height: '4vh', lineHeight: '16px' }} />
        </Tip>
      ))
    );
  };

  return (
    <Header
      background={{ color: 'rgba(76, 104, 76, 0.5)' }}
      style={{ borderBottom: `1px solid ${accentColors[0]}` }}
      height={`${gamePageTopNavbarHeight}px`}
    >
      {/*
        // @ts-ignore */}
      <ThemeContext.Extend value={customDefaultButtonStyles}>
        <Menu
          style={{ backgroundColor: 'transparent' }}
          dropBackground={{ color: 'rgba(76, 104, 76, 0.5)' }}
          label="AW Central"
          items={[
            { label: 'Main menu', onClick: () => history.push('/menu') },
            {
              label: 'Log out',
              onClick: () => keycloak.logout(),
            },
          ]}
        />
        {isMc
          ? allPlayerGameRoles && renderCharacterPreviews(allPlayerGameRoles)
          : otherPlayerGameRoles && renderCharacterPreviews(otherPlayerGameRoles)}
        {isMc && <Button label="Threat map" style={{ backgroundColor: 'transparent', height: '4vh', lineHeight: '16px' }} />}
        {!!game && !game?.hasFinishedPreGame && (
          <Button
            label="Pre-game"
            onClick={() => history.push(`/pre-game/${game.id}`)}
            style={{ backgroundColor: 'transparent', height: '4vh', lineHeight: '16px' }}
          />
        )}
        {/*
        // @ts-ignore */}
      </ThemeContext.Extend>
    </Header>
  );
};

export default GameNavbar;
