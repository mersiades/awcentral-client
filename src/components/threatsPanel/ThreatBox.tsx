import { Box } from 'grommet';
import React, { FC } from 'react';
import { Threat } from '../../@types/dataInterfaces';
import { ParagraphWS } from '../../config/grommetConfig';
import { decapitalize } from '../../helpers/decapitalize';
import CollapsiblePanelBox from '../CollapsiblePanelBox';

interface ThreatBoxProps {
  threat: Threat;
  onEdit: () => void;
}

const ThreatBox: FC<ThreatBoxProps> = ({ threat, onEdit }) => {
  return (
    <CollapsiblePanelBox title={threat.name} onEdit={onEdit}>
      <Box
        fill="horizontal"
        align="start"
        animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
        flex="grow"
      >
        <ParagraphWS>
          <strong>Kind: </strong>
          {decapitalize(threat.threatKind)}
        </ParagraphWS>
        <ParagraphWS>
          <strong>Impulse: </strong>
          {threat.impulse}
        </ParagraphWS>
        {!!threat.description && (
          <ParagraphWS>
            <strong>Description & cast: </strong>
            {threat.description}
          </ParagraphWS>
        )}
        {!!threat.stakes && (
          <ParagraphWS>
            <strong>Stakes: </strong>
            {threat.stakes}
          </ParagraphWS>
        )}
      </Box>
    </CollapsiblePanelBox>
  );
};

export default ThreatBox;
