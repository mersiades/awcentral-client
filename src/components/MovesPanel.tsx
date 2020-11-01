import React, { FC } from 'react'
import ReactMarkdown from 'react-markdown'
import { Accordion, AccordionPanel, Box, Heading } from 'grommet'
import { Close } from 'grommet-icons'
import styled from 'styled-components'
import { Move } from '../@types'
import { MoveKinds } from '../@types/enums'

interface MovesPanelProps {
  allMoves: Move[]
  closePanel: (tab: number) => void;
}

interface LevelOneAccordionLabelProps {
  moveKind: MoveKinds
}

const accordionLabelBackground = {
  size: "250%",
  image: 'url(/images/black-line.png)',
};

const CustomHeading = styled(Heading)`
  background-color: #fff;
  width: fit-content;
  padding-left: 6px;
  padding-right: 6px;
`;

const LevelOneAccordionLabel: FC<LevelOneAccordionLabelProps> = ({moveKind}) => {
  return (
    <Box fill="horizontal" pad="12px" background={accordionLabelBackground}>
      <CustomHeading level={3} >{moveKind}</CustomHeading>
    </Box>
  )
}

const MovesPanel: FC<MovesPanelProps> = ({allMoves, closePanel}) => {

  const basicMoves = allMoves.filter((move) => move.kind === MoveKinds.basic)
  const peripheralMoves = allMoves.filter((move) => move.kind === MoveKinds.peripheral)
  const battleMoves = allMoves.filter((move) => move.kind === MoveKinds.battle)
  const roadWarMoves = allMoves.filter((move) => move.kind === MoveKinds.roadWar)

  
  return (
    <Box fill justify="start" >
      <Box fill="horizontal" align="end" pad="small" animation="fadeIn">
        <Close color="accent-1" onClick={() => closePanel(3)} cursor="grab" />
      </Box>
      <Box overflow="auto">
        <Accordion>
          <AccordionPanel label={<LevelOneAccordionLabel moveKind={MoveKinds.basic}/>}>
            <Accordion >
            {basicMoves.map((move) => (
                <AccordionPanel label={move.name}>
                  <Box pad="12px">
                    <ReactMarkdown>{move.description}</ReactMarkdown>
                  </Box>
                </AccordionPanel>

            ))}
            </Accordion>
          </AccordionPanel>
          <AccordionPanel label={<LevelOneAccordionLabel moveKind={MoveKinds.peripheral}/>}>
            <Accordion >
            {peripheralMoves.map((move) => (
                <AccordionPanel label={move.name}>
                  <Box pad="12px">
                    <ReactMarkdown>{move.description}</ReactMarkdown>
                  </Box>
                </AccordionPanel>

            ))}
            </Accordion>
          </AccordionPanel>
          <AccordionPanel label={<LevelOneAccordionLabel moveKind={MoveKinds.battle}/>}>
            <Accordion >
            {battleMoves.map((move) => (
                <AccordionPanel label={move.name}>
                  <Box pad="12px">
                    <ReactMarkdown>{move.description}</ReactMarkdown>
                  </Box>
                </AccordionPanel>

            ))}
            </Accordion>
          </AccordionPanel>
          <AccordionPanel label={<LevelOneAccordionLabel moveKind={MoveKinds.roadWar}/>}>
            <Accordion >
            {roadWarMoves.map((move) => (
                <AccordionPanel label={move.name}>
                  <Box pad="12px">
                    <ReactMarkdown>{move.description}</ReactMarkdown>
                  </Box>
                </AccordionPanel>

            ))}
            </Accordion>
          </AccordionPanel>
        </Accordion>
      </Box>
      
      

    </Box>
  )
}

export default MovesPanel
