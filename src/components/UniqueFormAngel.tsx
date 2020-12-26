import React, { FC, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Box, Button, FormField, Heading, TextInput } from 'grommet';

import { PlaybookUniqueCreator } from '../@types';
import { brandColor } from '../config/grommetConfig';

interface UniqueFormAngelProps {
  characterName: string;
  playbookUniqueCreator: PlaybookUniqueCreator;
  handleSubmitAngelKit: (stock: number, hasSupplier: boolean) => void;
}

const boxShadow = {
  boxShadow: `0px 0px 1px 1px ${brandColor}, 0px 0px 3px 3px ${brandColor}, 0px 0px 5px 5px ${brandColor}`,
};

const UniqueFormAngel: FC<UniqueFormAngelProps> = ({ characterName, playbookUniqueCreator, handleSubmitAngelKit }) => {
  const { angelKitInstructions, startingStock } = playbookUniqueCreator.angelKitCreator;
  const [stock, setStock] = useState(startingStock);
  return (
    <Box width="60vw" direction="column" align="start" justify="between" overflow="auto">
      <Heading level={2} alignSelf="center">{`${characterName.toUpperCase()}'S ANGEL KIT`}</Heading>
      <Box flex="grow" direction="row" align="start">
        <Box fill="horizontal">
          <ReactMarkdown>{angelKitInstructions}</ReactMarkdown>
        </Box>
        <Box width="150px" align="center" pad="24px" margin={{ left: '24px', right: '5px', top: '18px' }} style={boxShadow}>
          <Heading level={3}>Stock</Heading>
          <FormField>
            <TextInput
              type="number"
              value={stock}
              size="xlarge"
              textAlign="center"
              onChange={(e) => setStock(parseInt(e.target.value))}
            />
          </FormField>
        </Box>
      </Box>
      <Box fill direction="row" justify="end" align="center" style={{ minHeight: 52 }}>
        <Button label="SET" primary onClick={() => handleSubmitAngelKit(startingStock, false)} margin={{ right: '5px' }} />
      </Box>
    </Box>
  );
};

export default UniqueFormAngel;
