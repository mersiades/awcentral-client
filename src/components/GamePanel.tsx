import React, { FC } from 'react';
import { Box, Grid, Button, grommet, ThemeContext } from 'grommet';
import { useGame } from '../contexts/gameContext';
import { Close, Edit, Trash } from 'grommet-icons';
import { deepMerge } from 'grommet/utils';
import { accentColors } from '../config/grommetConfig';

interface GamePanelProps {
  closePanel: (tab: number) => void;
}

const dummyData = {
  players: [{ name: 'Abe' }, { name: 'Snow' }, { name: 'Joyette' }, { name: 'Hammer' }],
};

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

const handleDeleteGame = () => {
  
}

const GamePanel: FC<GamePanelProps> = ({ closePanel }) => {
  const { game } = useGame();
  return (
    <Grid
      fill
      rows={['xxsmall', 'xsmall', 'medium', 'xsmall']}
      columns={['3/4', '1/4']}
      align="center"
      areas={[
        { name: 'top-row', start: [0, 0], end: [1, 0] },
        { name: 'title', start: [0, 1], end: [0, 1] },
        { name: 'edit-title', start: [1, 1], end: [1, 1] },
        { name: 'players', start: [0, 2], end: [1, 2] },
        { name: 'delete-game', start: [0, 3], end: [1, 3] },
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
      <Box gridArea="players" pad="small" alignSelf="center" animation="fadeIn">
        <h3>Players</h3>
        {dummyData.players.map((player) => (
          <Box key={player.name} direction="row" align="center" alignContent="end" fill>
            <Box align="start" fill>
              <p>{player.name}</p>
            </Box>
            <Box align="end" fill>
              <Trash color="accent-1" onClick={() => console.log('clicked')} cursor="grab" />
            </Box>
          </Box>
        ))}
        <Button label="INVITE PLAYER" primary size="large" alignSelf="center" fill onClick={() => console.log('clicked')} />
      </Box>
      <Box gridArea="delete-game" pad="small" alignSelf="end" animation="fadeIn">
        <ThemeContext.Extend value={customDefaultButtonStyles}>
          <Button label="DELETE GAME" size="large" alignSelf="center" fill onClick={() => console.log('clicked')} />
        </ThemeContext.Extend>
      </Box>
    </Grid>
  );
};

export default GamePanel;
