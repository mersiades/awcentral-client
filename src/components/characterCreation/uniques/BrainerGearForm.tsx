import React, { FC, useState } from 'react';
import { Box, CheckBox, Text } from 'grommet';

import Spinner from '../../Spinner';
import { ButtonWS, HeadingWS, ParagraphWS } from '../../../config/grommetConfig';
import { StyledMarkdown } from '../../styledComponents';
import { PlaybookUniqueCreator } from '../../../@types/staticDataInterfaces';
import { BrainerGear } from '../../../@types/dataInterfaces';
import { useFonts } from '../../../contexts/fontContext';

interface BrainerGearFormProps {
  characterName: string;
  settingBrainerGear: boolean;
  playbookUniqueCreator: PlaybookUniqueCreator;
  handleSubmitBrainerGear: (brainerGear: string[]) => void;
  existingBrainerGear?: BrainerGear;
}

const BrainerGearForm: FC<BrainerGearFormProps> = ({
  characterName,
  settingBrainerGear,
  playbookUniqueCreator,
  handleSubmitBrainerGear,
  existingBrainerGear,
}) => {
  const [selectedGear, setSelectedGear] = useState(!!existingBrainerGear ? existingBrainerGear.brainerGear : []);

  const { crustReady } = useFonts();

  const handleSelectItem = (item: string) => {
    if (selectedGear.includes(item)) {
      setSelectedGear(selectedGear.filter((gear) => gear !== item));
    } else {
      selectedGear.length < 2 && setSelectedGear([...selectedGear, item]);
    }
  };

  return (
    <Box width="70vw" flex="grow" direction="column" align="center" justify="between">
      <HeadingWS
        crustReady={crustReady}
        level={2}
      >{`WHAT SPECIAL BRAINER GEAR DOES ${characterName.toUpperCase()} HAVE?`}</HeadingWS>
      <ParagraphWS size="large">Choose two</ParagraphWS>
      <Box align="start" gap="12px">
        {playbookUniqueCreator.brainerGearCreator?.gear.map((item, index) => {
          const splitItem = item.split(')');
          return (
            <CheckBox
              key={index}
              label={
                <div>
                  <Text weight="bold">{splitItem[0] + ') '}</Text>
                  <StyledMarkdown>{splitItem[1]}</StyledMarkdown>
                </div>
              }
              checked={selectedGear.includes(item)}
              onChange={() => handleSelectItem(item)}
            />
          );
        })}
      </Box>
      <Box fill="horizontal" direction="row" justify="end">
        <ButtonWS
          label={settingBrainerGear ? <Spinner fillColor="#FFF" width="37px" height="36px" /> : 'SET'}
          primary
          disabled={selectedGear.length !== 2}
          onClick={() => !settingBrainerGear && handleSubmitBrainerGear(selectedGear)}
        />
      </Box>
    </Box>
  );
};

export default BrainerGearForm;
