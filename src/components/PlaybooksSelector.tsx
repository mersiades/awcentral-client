import React, { FC, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Box, Button, Grid, Heading, Paragraph } from 'grommet';

import { Playbook } from '../@types';
import { PlayBooks } from '../@types/enums';
import { formatPlaybookType } from '../helpers/formatPlaybookType';
import '../assets/styles/transitions.css';
import CharacterCreator from './CharacterCreator';

interface PlaybookSelectorProps {
  playbooks: Playbook[];
  handlePlaybookSelect: (playbookType: PlayBooks) => void;
}

const PlaybookSelector: FC<PlaybookSelectorProps> = ({ playbooks, handlePlaybookSelect }) => {
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | undefined>();
  const [showIntro, setShowIntro] = useState(true);
  const [startFadeOut, setStartFadeOut] = useState(false);

  const sortedPlaybooks = [...playbooks].sort((a, b) => {
    const nameA = a.playbookType.toLowerCase();
    const nameB = b.playbookType.toLowerCase();
    if (nameA < nameB) {
      return -1;
    } else {
      return 1;
    }
  });

  const handlePlaybookClick = (playbook: Playbook) => {
    setShowIntro(false);
    setSelectedPlaybook(undefined);
    setTimeout(() => setSelectedPlaybook(playbook), 0);
  };

  return (
    <Box
      className={startFadeOut ? 'fadeOut' : ''}
      fill
      direction="column"
      background="black"
      animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
    >
      <Grid
        fill
        rows={['85%', '15%']}
        columns={['100%', '0%']}
        areas={[
          { name: 'playbook-display', start: [0, 0], end: [1, 0] },
          { name: 'playbook-previews', start: [0, 1], end: [0, 1] },
        ]}
      >
        <Box gridArea="playbook-display" fill align="center" justify="center">
          {!selectedPlaybook && showIntro && (
            <>
              <Heading level={1}>Choose your playbook</Heading>
              <Paragraph>
                You should probably wait for your MC and the rest of your crew, tho. No headstarts for nobody in Apocalypse
                World.
              </Paragraph>
            </>
          )}
          {!!selectedPlaybook && (
            <Grid
              fill
              rows={['100%', '0%']}
              columns={['40%', '60%']}
              areas={[
                { name: 'image', start: [0, 0], end: [0, 0] },
                { name: 'text', start: [1, 0], end: [1, 0] },
              ]}
            >
              <Box gridArea="image" background="black" animation="fadeIn" justify="center">
                <img
                  src={selectedPlaybook.playbookImageUrl}
                  alt={formatPlaybookType(selectedPlaybook.playbookType)}
                  style={{ objectFit: 'contain', maxHeight: '60vh' }}
                />
              </Box>
              <Box gridArea="text" pad="24px" animation="fadeIn" justify="around" align="center">
                <Heading level={2} alignSelf="center">
                  {formatPlaybookType(selectedPlaybook.playbookType)}
                </Heading>
                <Box overflow="auto" style={{ maxWidth: '600px' }}>
                  <ReactMarkdown>{selectedPlaybook.intro}</ReactMarkdown>
                  <em>
                    <ReactMarkdown>{selectedPlaybook.introComment}</ReactMarkdown>
                  </em>
                </Box>

                <Button
                  label={`SELECT ${formatPlaybookType(selectedPlaybook.playbookType)}`}
                  primary
                  size="large"
                  onClick={() => {
                    setStartFadeOut(true);
                    handlePlaybookSelect(selectedPlaybook.playbookType);
                  }}
                />
              </Box>
            </Grid>
          )}
        </Box>
        <Box gridArea="playbook-previews" direction="row" justify="around">
          {sortedPlaybooks.map((playbook) => (
            <Box
              key={playbook.playbookImageUrl}
              onClick={() => handlePlaybookClick(playbook)}
              hoverIndicator={{ color: 'brand', opacity: 0.4 }}
              height="95%"
              justify="center"
              align="center"
            >
              <img
                src={playbook.playbookImageUrl}
                alt={formatPlaybookType(playbook.playbookType)}
                style={{ objectFit: 'contain', maxHeight: '98%', maxWidth: '96%' }}
              />
            </Box>
          ))}
        </Box>
      </Grid>
    </Box>
  );
};

export default PlaybookSelector;
