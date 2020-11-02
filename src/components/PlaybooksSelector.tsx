import React, { FC, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Box, Button, Grid, Heading, Paragraph } from 'grommet'

import { Playbook } from '../@types'
import { PlayBooks } from '../@types/enums'
import { formatPlaybookType } from '../helpers/formatPlaybookType'

interface PlaybookSelectorProps {
  playbooks: Playbook[]
  handlePlaybookSelect: (playbookType: PlayBooks) => void
}

const PlaybookSelector: FC<PlaybookSelectorProps> = ({playbooks, handlePlaybookSelect}) => {

  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | undefined>()
  const [showIntro, setShowIntro] = useState(true)

  const sortedPlaybooks = [...playbooks].sort((a, b) => {
    const nameA = a.playbookType.toLowerCase()
    const nameB = b.playbookType.toLowerCase()
    if (nameA < nameB) {
      return -1
    } else {
      return 1
    }
  })

  const leftPlaybooks = sortedPlaybooks.filter((playbook, index) => index % 2 === 0)
  const rightPlaybooks = sortedPlaybooks.filter((playbook, index) => index % 2 === 1)

  const handlePlaybookClick = (playbook: Playbook) => {
    setShowIntro(false)
    setSelectedPlaybook(undefined)
    setTimeout(() => setSelectedPlaybook(playbook), 0)
  }
  
  return (
    <Box direction="row" height="65vh" width="75vw" background="black">
      <Box justify="between" width="10vw" align="center">
        { leftPlaybooks.map((playbook) => (
          <Heading key={playbook.playbookType} level={3} truncate onClick={() => handlePlaybookClick(playbook)}>{formatPlaybookType(playbook.playbookType)}</Heading>
        ))}
      </Box>
      <Box width="55vw" align="center" justify="center">
        { !selectedPlaybook && showIntro && (
          <>
          <Heading level={1}>Choose your playbook</Heading>
          <Paragraph>You should probably wait for your MC and the rest of your crew, tho. No headstarts for nobody in Apocalypse World.</Paragraph>
          </>
        )}
        { !!selectedPlaybook && (
           <Grid
           fill
           rows={["90%", "10%"]}
           columns={['40%', '60%']}
           areas={[
             { name: 'image', start: [0,0], end: [0,1]},
             { name: 'text', start: [1,0], end: [1,0]},
             { name: 'footer', start: [0,1], end: [1,1]},

           ]}
         >
          <Box gridArea="image" background="black" animation="fadeIn">
            <img src={selectedPlaybook.playbookImageUrl} alt={formatPlaybookType(selectedPlaybook.playbookType)} style={{ objectFit: "contain", maxHeight: "60vh" }}/>
          </Box>
          <Box gridArea="text" pad="24px" animation="fadeIn">
            <Heading level={2} alignSelf="center">{formatPlaybookType(selectedPlaybook.playbookType)}</Heading>
            <Box overflow="auto">
            <ReactMarkdown>{selectedPlaybook.intro}</ReactMarkdown>
            <em><ReactMarkdown>{selectedPlaybook.introComment}</ReactMarkdown></em>
            </Box>
          </Box>
          <Box  gridArea="footer" animation="fadeIn">
            <Button label={`SELECT ${formatPlaybookType(selectedPlaybook.playbookType)}`} primary size="large" onClick={() => handlePlaybookSelect(selectedPlaybook.playbookType)}/>
          </Box>

         </Grid>
        )}
      
      </Box>
      <Box justify="between" width="10vw" align="center">
        { rightPlaybooks.map((playbook) => (
          <Heading key={playbook.playbookType} level={3} onClick={() => handlePlaybookClick(playbook)}>{formatPlaybookType(playbook.playbookType)}</Heading>
        ))}
      </Box>
    </Box>
  )
}

export default PlaybookSelector
