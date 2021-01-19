import React, { FC, useEffect, useState } from 'react';
import { Box } from 'grommet';

import Spinner from '../Spinner';
import { ButtonWS, HeadingWS, ParagraphWS } from '../../config/grommetConfig';
import { StyledMarkdown } from '../styledComponents';
import { PlayBookType } from '../../@types/enums';
import { Playbook } from '../../@types/staticDataInterfaces';
import { useFonts } from '../../contexts/fontContext';
import { decapitalize } from '../../helpers/decapitalize';
import '../../assets/styles/transitions.css';

interface CharacterPlaybookProps {
  creatingCharacter: boolean;
  settingPlaybook: boolean;
  checkPlaybookReset: (playbookType: PlayBookType) => void;
  playbooks?: Playbook[];
  playbook?: PlayBookType;
}

const CharacterPlaybookForm: FC<CharacterPlaybookProps> = ({
  settingPlaybook,
  creatingCharacter,
  checkPlaybookReset,
  playbooks,
  playbook,
}) => {
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | undefined>();
  const [showIntro, setShowIntro] = useState(true);
  const [startFadeOut, setStartFadeOut] = useState(false);
  const [sortedPlaybooks, setSortedPlaybooks] = useState<Playbook[]>([]);

  const { crustReady } = useFonts();

  const handlePlaybookClick = (playbook: Playbook) => {
    setShowIntro(false);
    setSelectedPlaybook(undefined);
    setTimeout(() => setSelectedPlaybook(playbook), 0);
  };

  useEffect(() => {
    if (!!playbooks) {
      const sortedPlaybooks = [...playbooks].sort((a, b) => {
        const nameA = a.playbookType.toLowerCase();
        const nameB = b.playbookType.toLowerCase();
        if (nameA < nameB) {
          return -1;
        } else {
          return 1;
        }
      });
      setSortedPlaybooks(sortedPlaybooks);
    }
  }, [playbooks]);

  // If the playbook has already been set, show that playbook to the User
  useEffect(() => {
    if (!!playbook && playbooks) {
      const setPlaybook = playbooks.filter((pb) => pb.playbookType === playbook)[0];
      setSelectedPlaybook(setPlaybook);
    }
  }, [playbook, playbooks]);

  return (
    <Box
      fill
      direction="column"
      background="transparent"
      align="center"
      justify="between"
      className={startFadeOut ? 'fadeOut' : ''}
      animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
    >
      {!selectedPlaybook && showIntro && (
        <Box>
          <HeadingWS crustReady={crustReady} level={2}>
            Choose your playbook
          </HeadingWS>
          <ParagraphWS>
            You should probably wait for your MC and the rest of your crew, tho. No headstarts for nobody in Apocalypse
            World.
          </ParagraphWS>
        </Box>
      )}
      {!!selectedPlaybook && (
        <Box direction="row" fill="horizontal" margin={{ bottom: '125px' }} justify="center">
          <Box animation="fadeIn" justify="center">
            <img
              src={selectedPlaybook.playbookImageUrl}
              alt={decapitalize(selectedPlaybook.playbookType)}
              style={{ objectFit: 'contain', maxHeight: '45vh' }}
            />
          </Box>
          <Box pad="12px" animation="fadeIn" justify="around" align="center">
            <HeadingWS crustReady={crustReady} level={2} alignSelf="center" margin="0px">
              {decapitalize(selectedPlaybook.playbookType)}
            </HeadingWS>
            <Box overflow="auto" style={{ maxWidth: '856px', maxHeight: '30vh' }}>
              <StyledMarkdown>{selectedPlaybook.intro}</StyledMarkdown>
              <em>
                <StyledMarkdown>{selectedPlaybook.introComment}</StyledMarkdown>
              </em>
            </Box>

            {[PlayBookType.angel, PlayBookType.battlebabe, PlayBookType.brainer].includes(selectedPlaybook.playbookType) && (
              <ButtonWS
                label={
                  settingPlaybook || creatingCharacter ? (
                    <Spinner fillColor="#FFF" width="200px" height="36px" />
                  ) : (
                    `SELECT ${decapitalize(selectedPlaybook.playbookType)}`
                  )
                }
                primary
                size="large"
                onClick={() => {
                  setStartFadeOut(true);
                  checkPlaybookReset(selectedPlaybook.playbookType);
                }}
                margin="12px"
              />
            )}
          </Box>
        </Box>
      )}

      <Box
        direction="row"
        gap="3px"
        pad="3px"
        align="end"
        justify="around"
        style={{ height: '125px', position: 'absolute', left: 0, bottom: 0, right: 0, top: 'unset' }}
      >
        {sortedPlaybooks.length > 0
          ? sortedPlaybooks.map((playbook) => (
              <Box
                data-testid={`${playbook.playbookType.toLowerCase()}-button`}
                key={playbook.playbookImageUrl}
                onClick={() => handlePlaybookClick(playbook)}
                hoverIndicator={{ color: 'brand', opacity: 0.4 }}
                height="95%"
                justify="center"
                align="center"
              >
                <img
                  src={playbook.playbookImageUrl}
                  alt={decapitalize(playbook.playbookType)}
                  style={{ objectFit: 'contain', maxHeight: '98%', maxWidth: '96%' }}
                />
              </Box>
            ))
          : null}
      </Box>
    </Box>
  );
};

export default CharacterPlaybookForm;
