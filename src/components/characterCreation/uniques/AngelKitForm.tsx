import React, { FC, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Box, FormField, TextInput } from 'grommet';

import Spinner from '../../Spinner';
import { ButtonWS, HeadingWS, RedBox } from '../../../config/grommetConfig';
import { PlaybookUniqueCreator } from '../../../@types';
import { useFonts } from '../../../contexts/fontContext';

interface AngelKitFormProps {
  characterName: string;
  settingAngelKit: boolean;
  playbookUniqueCreator: PlaybookUniqueCreator;
  handleSubmitAngelKit: (stock: number, hasSupplier: boolean) => void;
}

const AngelKitForm: FC<AngelKitFormProps> = ({
  characterName,
  settingAngelKit,
  playbookUniqueCreator,
  handleSubmitAngelKit,
}) => {
  const { angelKitInstructions, startingStock } = playbookUniqueCreator.angelKitCreator;
  const [stock, setStock] = useState(startingStock);

  const { crustReady } = useFonts();

  return (
    <Box width="60vw" direction="column" align="start" justify="between" overflow="auto" flex="grow">
      <HeadingWS
        crustReady={crustReady}
        level={2}
        alignSelf="center"
      >{`${characterName.toUpperCase()}'S ANGEL KIT`}</HeadingWS>
      <Box flex="grow" direction="row" align="start">
        <Box fill="horizontal">
          <ReactMarkdown>{angelKitInstructions}</ReactMarkdown>
        </Box>
        <RedBox
          width="150px"
          align="center"
          justify="between"
          pad="24px"
          margin={{ left: '24px', right: '5px', top: '18px' }}
        >
          <HeadingWS crustReady={crustReady} level={3}>
            Stock
          </HeadingWS>
          <FormField>
            <TextInput
              type="number"
              value={stock}
              size="xlarge"
              textAlign="center"
              onChange={(e) => setStock(parseInt(e.target.value))}
            />
          </FormField>
        </RedBox>
      </Box>
      <Box fill direction="row" justify="end" align="center" style={{ minHeight: 52 }}>
        <ButtonWS
          label={settingAngelKit ? <Spinner fillColor="#FFF" width="37px" height="36px" /> : 'SET'}
          primary
          onClick={() => !settingAngelKit && handleSubmitAngelKit(startingStock, false)}
          margin={{ right: '5px' }}
        />
      </Box>
    </Box>
  );
};

export default AngelKitForm;
