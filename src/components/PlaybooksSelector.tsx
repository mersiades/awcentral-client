import React, { FC, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Box, Button, Grid, Heading, Paragraph } from 'grommet';

import { Playbook } from '../@types';
import { PlayBooks } from '../@types/enums';
import { formatPlaybookType } from '../helpers/formatPlaybookType';

interface PlaybookSelectorProps {
  playbooks: Playbook[];
  handlePlaybookSelect: (playbookType: PlayBooks) => void;
}

const PlaybookSelector: FC<PlaybookSelectorProps> = ({ playbooks, handlePlaybookSelect }) => {
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | undefined>();
  const [showIntro, setShowIntro] = useState(true);

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
    <Box direction="column" height="90vh" width="98vw" background="black">
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
              rows={['90%', '10%']}
              columns={['15%', '20%', '30%', '20%', '15%']}
              areas={[
                { name: 'image', start: [0, 0], end: [1, 0] },
                { name: 'text', start: [2, 0], end: [4, 0] },
                { name: 'footer', start: [2, 1], end: [2, 1] },
              ]}
            >
              <Box gridArea="image" background="black" animation="fadeIn" justify="center">
                <img
                  src={selectedPlaybook.playbookImageUrl}
                  alt={formatPlaybookType(selectedPlaybook.playbookType)}
                  style={{ objectFit: 'contain', maxHeight: '60vh' }}
                />
              </Box>
              <Box gridArea="text" pad="24px" animation="fadeIn" justify="center">
                <Heading level={2} alignSelf="center">
                  {formatPlaybookType(selectedPlaybook.playbookType)}
                </Heading>
                <Box overflow="auto">
                  <ReactMarkdown>{selectedPlaybook.intro}</ReactMarkdown>
                  <em>
                    <ReactMarkdown>{selectedPlaybook.introComment}</ReactMarkdown>
                  </em>
                </Box>
              </Box>
              <Box gridArea="footer" animation="fadeIn">
                <Button
                  label={`SELECT ${formatPlaybookType(selectedPlaybook.playbookType)}`}
                  primary
                  size="large"
                  onClick={() => handlePlaybookSelect(selectedPlaybook.playbookType)}
                />
              </Box>
            </Grid>
          )}
        </Box>
        <Box gridArea="playbook-previews" direction="row" justify="around">
          {sortedPlaybooks.map((playbook) => (
            <Box
              onClick={() => handlePlaybookClick(playbook)}
              hoverIndicator={{ color: 'brand' }}
              height="95%"
              justify="center"
              align="center"
              // alignContent="center"
            >
              <img
                key={playbook.playbookImageUrl}
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

  // );

  // return (
  //   <Box direction="row" height="90vh" width="98vw" background="black">
  //     <Box justify="between" width="19vw" align="center">
  //       {leftPlaybooks.map((playbook) => (
  //         <Heading key={playbook.playbookType} level={3} truncate onClick={() => handlePlaybookClick(playbook)}>
  //           <img
  //             src={playbook.playbookImageUrl}
  //             alt={formatPlaybookType(playbook.playbookType)}
  //             style={{ objectFit: 'contain', maxHeight: '5vh' }}
  //           />
  //           {formatPlaybookType(playbook.playbookType)}
  //         </Heading>
  //       ))}
  //     </Box>
  //     <Box width="60vw" align="center" justify="center">
  //       {!selectedPlaybook && showIntro && (
  //         <>
  //           <Heading level={1}>Choose your playbook</Heading>
  //           <Paragraph>
  //             You should probably wait for your MC and the rest of your crew, tho. No headstarts for nobody in Apocalypse
  //             World.
  //           </Paragraph>
  //         </>
  //       )}
  //       {!!selectedPlaybook && (
  //         <Grid
  //           fill
  //           rows={['90%', '10%']}
  //           columns={['40%', '60%']}
  //           areas={[
  //             { name: 'image', start: [0, 0], end: [0, 1] },
  //             { name: 'text', start: [1, 0], end: [1, 0] },
  //             { name: 'footer', start: [0, 1], end: [1, 1] },
  //           ]}
  //         >
  //           <Box gridArea="image" background="black" animation="fadeIn">
  //             <img
  //               src={selectedPlaybook.playbookImageUrl}
  //               alt={formatPlaybookType(selectedPlaybook.playbookType)}
  //               style={{ objectFit: 'contain', maxHeight: '60vh' }}
  //             />
  //           </Box>
  //           <Box gridArea="text" pad="24px" animation="fadeIn">
  //             <Heading level={2} alignSelf="center">
  //               {formatPlaybookType(selectedPlaybook.playbookType)}
  //             </Heading>
  //             <Box overflow="auto">
  //               <ReactMarkdown>{selectedPlaybook.intro}</ReactMarkdown>
  //               <em>
  //                 <ReactMarkdown>{selectedPlaybook.introComment}</ReactMarkdown>
  //               </em>
  //             </Box>
  //           </Box>
  //           <Box gridArea="footer" animation="fadeIn">
  //             <Button
  //               label={`SELECT ${formatPlaybookType(selectedPlaybook.playbookType)}`}
  //               primary
  //               size="large"
  //               onClick={() => handlePlaybookSelect(selectedPlaybook.playbookType)}
  //             />
  //           </Box>
  //         </Grid>
  //       )}
  //     </Box>
  //     <Box justify="between" width="19vw" align="center">
  //       {rightPlaybooks.map((playbook) => (
  //         <Heading key={playbook.playbookType} level={3} onClick={() => handlePlaybookClick(playbook)}>
  //           {formatPlaybookType(playbook.playbookType)}
  //         </Heading>
  //       ))}
  //     </Box>
  //   </Box>
  // );
};

export default PlaybookSelector;
