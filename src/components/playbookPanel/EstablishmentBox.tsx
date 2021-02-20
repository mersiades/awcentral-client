import React, { FC } from 'react';
import { Box } from 'grommet';

import CollapsiblePanelBox from '../CollapsiblePanelBox';
import {
  AtmosphereBox,
  AttractionsBox,
  InterestedPartiesBox,
  RegularsBox,
  SecurityBox,
} from '../characterCreation/uniques/EstablishmentForm';
import { RedBox, TextWS } from '../../config/grommetConfig';
import { CastCrew } from '../../@types/dataInterfaces';
import { useGame } from '../../contexts/gameContext';

interface EstablishmentBoxProps {
  navigateToCharacterCreation: (step: string) => void;
}

const EstablishmentBox: FC<EstablishmentBoxProps> = ({ navigateToCharacterCreation }) => {
  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { character } = useGame();

  // ------------------------------------------------- Component functions -------------------------------------------------- //
  const establishment = character?.playbookUnique?.establishment;

  // -------------------------------------------------- Render component  ---------------------------------------------------- //
  return (
    <CollapsiblePanelBox
      open
      title="Establishment"
      navigateToCharacterCreation={navigateToCharacterCreation}
      targetCreationStep="6"
    >
      <Box
        fill="horizontal"
        direction="row"
        align="start"
        animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
      >
        {!!establishment && (
          <Box fill="horizontal" align="start" justify="start" gap="12px" pad="12px">
            <Box align="center" flex="grow" fill>
              <RedBox fill justify="center" pad="12px" gap="12px">
                {establishment.castAndCrew.length > 0 &&
                  establishment.castAndCrew.map((crew: CastCrew) => {
                    return (
                      <TextWS key={crew.id}>
                        <strong>{crew.name}</strong>
                        {!!crew.description && <em> - {crew.description}</em>}
                      </TextWS>
                    );
                  })}
              </RedBox>
              <TextWS weight={600}>Cast & Crew</TextWS>
            </Box>
            <Box direction="row" fill="horizontal" justify="between" wrap height="102px">
              <AttractionsBox
                mainAttraction={establishment.mainAttraction}
                sideAttractions={establishment.sideAttractions}
                width="48.5%"
              />
              <AtmosphereBox atmospheres={establishment.atmospheres} width="48.5%" />
            </Box>
            <Box direction="row" fill="horizontal" justify="between" gap="12px" wrap height="126px">
              <RegularsBox
                regulars={establishment.regulars}
                bestRegular={establishment.bestRegular}
                worstRegular={establishment.worstRegular}
                width="48.5%"
              />
              <InterestedPartiesBox
                interestedParties={establishment.interestedParties}
                wantsInOnIt={establishment.wantsInOnIt}
                oweForIt={establishment.oweForIt}
                wantsItGone={establishment.wantsItGone}
                width="48.5%"
              />
            </Box>
            <Box direction="row" fill>
              <SecurityBox securityOptions={establishment.securityOptions} width="48.5%" />
            </Box>
          </Box>
        )}
      </Box>
    </CollapsiblePanelBox>
  );
};

export default EstablishmentBox;
