import React, { FC, useState } from 'react';
import { useMutation } from '@apollo/client';
import { Box } from 'grommet';
import { CaretUpFill, CaretDownFill, FormDown, FormUp } from 'grommet-icons';

import CollapsiblePanelBox from '../CollapsiblePanelBox';
import { RedBox, HeadingWS, brandColor } from '../../config/grommetConfig';
import SET_ANGEL_KIT, { SetAngelKitData, SetAngelKitVars } from '../../mutations/setAngelKit';
import { RoleType } from '../../@types/enums';
import { AngelKit } from '../../@types/dataInterfaces';
import { CharacterMove, Move } from '../../@types/staticDataInterfaces';
import { useFonts } from '../../contexts/fontContext';
import { useGame } from '../../contexts/gameContext';
import { decapitalize } from '../../helpers/decapitalize';
import { StyledMarkdown } from '../styledComponents';
import SingleRedBox from '../SingleRedBox';

interface AngelKitBoxProps {
  angelKit: AngelKit;
  navigateToCharacterCreation: (step: string) => void;
  openDialog: (move: Move | CharacterMove) => void;
}

const AngelKitBox: FC<AngelKitBoxProps> = ({ angelKit, navigateToCharacterCreation, openDialog }) => {
  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [showMoveDetails, setShowMoveDetails] = useState<string[]>([]);

  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { crustReady } = useFonts();
  const { userGameRole } = useGame();

  // ------------------------------------------------------ graphQL -------------------------------------------------------- //
  const [setAngelKit, { loading: settingAngelKit }] = useMutation<SetAngelKitData, SetAngelKitVars>(SET_ANGEL_KIT);

  // ------------------------------------------------- Component functions -------------------------------------------------- //
  const clickableStyle = {
    cursor: 'pointer',
    '&:hover': {
      color: brandColor,
    },
  };

  const unClickableStyle = {
    cursor: 'default',
  };

  const toggleShowMoveDetails = (moveId: string) => {
    if (showMoveDetails.includes(moveId)) {
      setShowMoveDetails(showMoveDetails.filter((m) => m !== moveId));
    } else {
      setShowMoveDetails([...showMoveDetails, moveId]);
    }
  };

  const handleSetAngelKit = (stock: number, hasSupplier: boolean) => {
    if (!!userGameRole) {
      try {
        setAngelKit({
          variables: {
            gameRoleId: userGameRole.id,
            characterId: userGameRole.characters[0].id,
            stock,
            hasSupplier,
          },
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <CollapsiblePanelBox
      open
      title="Angel kit"
      navigateToCharacterCreation={navigateToCharacterCreation}
      targetCreationStep="6"
    >
      <Box fill="horizontal" align="start" animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}>
        <Box fill="horizontal" direction="row" align="start" justify="between" margin={{ bottom: '6px' }}>
          <Box>{angelKit.description}</Box>
          <Box flex="grow">
            <Box direction="row" align="center" gap="12px" margin={{ left: '12px' }}>
              <SingleRedBox
                value={angelKit.stock.toString()}
                label="Stock"
                loading={settingAngelKit}
                onIncrease={() => handleSetAngelKit(angelKit.stock + 1, angelKit.hasSupplier)}
                onDecrease={() => handleSetAngelKit(angelKit.stock - 1, angelKit.hasSupplier)}
              />
            </Box>
          </Box>
        </Box>
        {angelKit.angelKitMoves.map((move) => {
          const canPerformMove = !!move.moveAction && userGameRole?.role !== RoleType.mc;
          return (
            <Box key={move.id} fill="horizontal" direction="row" justify="between" align="center">
              <Box>
                <Box direction="row" justify="start" align="center" pad="12px" gap="12px">
                  {showMoveDetails.includes(move.id) ? (
                    <FormUp
                      data-testid="hide-move-details-icon"
                      onClick={() => toggleShowMoveDetails(move.id)}
                      style={{ cursor: 'pointer' }}
                    />
                  ) : (
                    <FormDown
                      data-testid="show-move-details-icon"
                      onClick={() => toggleShowMoveDetails(move.id)}
                      style={{ cursor: 'pointer' }}
                    />
                  )}
                  <HeadingWS
                    crustReady={crustReady}
                    level="3"
                    margin={{ top: '3px', bottom: '3px' }}
                    onClick={() => canPerformMove && !!openDialog && openDialog(move)}
                    onMouseOver={(e: React.MouseEvent<HTMLHeadingElement>) =>
                      // @ts-ignore
                      (e.target.style.color = canPerformMove ? '#CD3F3E' : '#FFF')
                    }
                    // @ts-ignore
                    onMouseOut={(e: React.MouseEvent<HTMLHeadingElement>) => (e.target.style.color = '#FFF')}
                    style={canPerformMove ? clickableStyle : unClickableStyle}
                  >
                    {decapitalize(move.name)}
                  </HeadingWS>
                </Box>
                {showMoveDetails.includes(move.id) && (
                  <Box pad="24px">
                    <StyledMarkdown>{move.description}</StyledMarkdown>
                  </Box>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
    </CollapsiblePanelBox>
  );
};

export default AngelKitBox;
