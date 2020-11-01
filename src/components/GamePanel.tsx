import React, { FC } from 'react';
import { Box, Grid, Button, Text, grommet, ThemeContext } from 'grommet';
import { Close, Edit, Trash } from 'grommet-icons';
import { deepMerge } from 'grommet/utils';
import { accentColors } from '../config/grommetConfig';
import { Game } from '../@types';
import { Roles } from '../@types/enums';
import { useDiscordUser } from '../contexts/discordUserContext';

interface GamePanelProps {
  game: Game
  closePanel: (tab: number) => void;
  setShowDeleteGameDialog: (show: boolean) => void
}

const customDefaultButtonStyles = deepMerge(grommet, {
  button: {
    default: {},
    hover: {
      backgroundColor: `${accentColors[0]}`,
      extend: 'font-weight: 700; font-size: 40px;',
    },
    extend: `
    font-family: 'Vtks good luck for you', sans-serif;
    font-size: 36px;
    line-height: 36px;
    &:hover {
      background-color: ${accentColors[0]};
      color: #fff;
    };
    &:focus {
      outline: 0;
      box-shadow: none;
      background-color: ${accentColors[0]};
    }
    `,
  },
});


const GamePanel: FC<GamePanelProps> = ({ game, closePanel, setShowDeleteGameDialog }) => {
  const { username } = useDiscordUser()

  return (
    <Grid
      fill
      rows={['xxsmall', 'xsmall', 'xsmall', 'medium', 'xsmall']}
      columns={['3/4', '1/4']}
      align="center"
      areas={[
        { name: 'top-row', start: [0, 0], end: [1, 0] },
        { name: 'title', start: [0, 1], end: [0, 1] },
        { name: 'edit-title', start: [1, 1], end: [1, 1] },
        { name: 'mc', start: [0, 2], end: [1, 2] },
        { name: 'players', start: [0, 3], end: [1, 3] },
        { name: 'delete-game', start: [0, 4], end: [1, 4] },
      ]}
    >
      <Box gridArea="top-row" align="end" alignContent="end" pad="small" alignSelf="start" animation="fadeIn">
        <Close color="accent-1" onClick={() => closePanel(3)} cursor="grab" />
      </Box>
      <Box gridArea="title" align="start" alignContent="around" pad="small" alignSelf="center" animation="fadeIn">
        <h3>{game ? game.name : 'Game name'}</h3>
      </Box>
      <Box gridArea="edit-title" align="end" alignContent="end" pad="small" alignSelf="center" animation="fadeIn">
        <Edit color="accent-1" onClick={() => console.log('clicked')} cursor="grab" />
      </Box>
      <Box gridArea="mc" align="start" alignContent="center" pad="small" alignSelf="center" animation="fadeIn">
        <h3>MC</h3>
        <Text>{!!username ? username : "MC unknown"}</Text>
      </Box>
      <Box gridArea="players" pad="small" alignSelf="center" animation="fadeIn">
        <h3>Players</h3>
        {
          game.gameRoles.filter((gameRole) => gameRole.role === Roles.player).length === 0 ? (
            <Box align="start" alignContent="center" margin={{ vertical: "small"}}><Text>No players yet</Text></Box>
          ) :
          game.gameRoles.filter((gameRole) => gameRole.role === Roles.player).map((gameRole) => gameRole.characters?.map((character) => (
            <Box key={character.name} direction="row" align="center" alignContent="end" fill margin={{ vertical: "small"}}>
            <Box align="start" fill>
              <Text>{character.name}</Text>
            </Box>
            <Box align="end" fill>
              <Trash color="accent-1" onClick={() => console.log('clicked')} cursor="grab" />
            </Box>
          </Box>
          )))
        }
        <Button label="INVITE PLAYER" primary size="large" alignSelf="center" fill onClick={() => console.log('clicked')} />
      </Box>
      <Box gridArea="delete-game" pad="small" alignSelf="end" animation="fadeIn">
        <ThemeContext.Extend value={customDefaultButtonStyles}>
          <Button label="DELETE GAME" size="large" alignSelf="center" fill onClick={() => setShowDeleteGameDialog(true)} />
        </ThemeContext.Extend>
      </Box>
    </Grid>
  );
};

export default GamePanel;
