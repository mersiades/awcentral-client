import React, { FC, useState } from 'react';

import { useQuery /*useMutation, */ } from '@apollo/client';

// import { useHistory } from 'react-router-dom';
import { Box, Text } from 'grommet';

import { StyledMarkdown } from '../../styledComponents';
import { ButtonWS, HeadingWS } from '../../../config/grommetConfig';
import PLAYBOOK_CREATOR, { PlaybookCreatorData, PlaybookCreatorVars } from '../../../queries/playbookCreator';
import { PlaybookType } from '../../../@types/enums';
import { useFonts } from '../../../contexts/fontContext';
import { useGame } from '../../../contexts/gameContext';

// import SET_ESTABLISHMENT, { SetEstablishmentData, SetEstablishmentVars } from '../../../mutations/setEstablishment';
// import Spinner from '../../Spinner';

const ITEMS_INSTRUCTIONS = 'Choose which of the following your workspace includes. Choose 3:';

const WorkspaceForm: FC = () => {
  // -------------------------------------------------- Component state ---------------------------------------------------- //
  const [items, setItems] = useState<string[]>([]);

  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { character /*game, userGameRole*/ } = useGame();
  const { crustReady } = useFonts();

  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //
  // const history = useHistory();

  // ------------------------------------------------------ graphQL -------------------------------------------------------- //
  const { data: pbCreatorData } = useQuery<PlaybookCreatorData, PlaybookCreatorVars>(PLAYBOOK_CREATOR, {
    variables: { playbookType: PlaybookType.savvyhead },
  });

  const workspaceCreator = pbCreatorData?.playbookCreator.playbookUniqueCreator?.workspaceCreator;
  // const [setEstablishment, { loading: settingEstablishment }] = useMutation<SetEstablishmentData, SetEstablishmentVars>(
  //   SET_ESTABLISHMENT
  // );

  // ------------------------------------------------- Component functions -------------------------------------------------- //

  // const handleSubmitEstablishment = async () => {
  //   if (!!userGameRole && !!character && !!game && isEstablishmentComplete) {
  //     // @ts-ignore
  //     const securityNoTypename = securityOptions.map((so: SecurityOption) => omit(so, ['__typename']));
  //     // @ts-ignore
  //     const crewNoTypename = castAndCrew.map((cc: CastCrew) => omit(cc, ['__typename']));

  //     const establishmentInput: EstablishmentInput = {
  //       id: character.playbookUnique?.establishment ? character.playbookUnique.establishment.id : undefined,
  //       mainAttraction,
  //       bestRegular,
  //       worstRegular,
  //       wantsInOnIt,
  //       oweForIt,
  //       wantsItGone,
  //       sideAttractions,
  //       atmospheres,
  //       regulars,
  //       interestedParties,
  //       securityOptions: securityNoTypename,
  //       castAndCrew: crewNoTypename,
  //     };

  //     const optimisticPlaybookUnique = {
  //       id: 'temporary-id',
  //       type: UniqueTypes.establishment,
  //       establishment: { ...establishmentInput, id: !establishmentInput.id ? 'temporary-id' : establishmentInput.id },
  //     };

  //     try {
  //       await setEstablishment({
  //         variables: { gameRoleId: userGameRole.id, characterId: character.id, establishment: establishmentInput },
  //         optimisticResponse: {
  //           __typename: 'Mutation',
  //           setEstablishment: {
  //             __typename: 'Character',
  //             ...character,
  //             playbookUnique: optimisticPlaybookUnique,
  //           },
  //         },
  //       });
  //       if (!character.hasCompletedCharacterCreation) {
  //         history.push(`/character-creation/${game.id}?step=${CharacterCreationSteps.selectMoves}`);
  //         window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  // };

  const handleItemSelect = (item: string) => {
    if (!!workspaceCreator) {
      if (items.includes(item)) {
        const newItems = items.filter((itm) => itm !== item);
        setItems(newItems);
      } else if (items.length < workspaceCreator?.itemsCount) {
        setItems([...items, item]);
      }
    }
  };

  // ------------------------------------------------------- Effects -------------------------------------------------------- //

  // // Set workingAttractions when component mounts
  // useEffect(() => {
  //   if (!!establishmentCreator && !character?.playbookUnique?.establishment) {
  //     setWorkingAttractions(establishmentCreator.attractions);
  //   } else if (!!establishmentCreator && !!character?.playbookUnique?.establishment) {
  //     const { mainAttraction } = character.playbookUnique.establishment;
  //     const filteredAttractions = establishmentCreator.attractions.filter((attr) => attr !== mainAttraction);
  //     setWorkingAttractions(filteredAttractions);
  //   }
  // }, [character, establishmentCreator]);

  // Set existing or blank Establishment when component mounts
  // useEffect(() => {
  //   if (!!character?.playbookUnique?.) {
  //     dispatch({ type: 'SET_EXISTING_ESTABLISHMENT', payload: character.playbookUnique.establishment });
  //   } else if (!!establishmentCreator) {
  //     dispatch({
  //       type: 'SET_DEFAULT_ESTABLISHMENT',
  //       payload: {
  //         ...initialState,
  //         regulars: establishmentCreator.regularsNames,
  //         interestedParties: establishmentCreator.interestedPartyNames,
  //       },
  //     });
  //   }
  // }, [character, establishmentCreator]);

  // ------------------------------------------------------ Render -------------------------------------------------------- //
  console.log('items', items);

  const renderPills = (item: string) => (
    <Box
      data-testid={`${item}-pill`}
      key={item}
      background={items.includes(item) ? { color: '#698D70', dark: true } : '#4C684C'}
      round="medium"
      pad={{ top: '3px', bottom: '1px', horizontal: '12px' }}
      margin={{ vertical: '3px', horizontal: '3px' }}
      justify="center"
      onClick={() => handleItemSelect(item)}
      style={{ boxShadow: '0 0 3px 0.5px #000' }}
      hoverIndicator={{ color: '#698D70', dark: true }}
    >
      <Text size="medium">{item}</Text>
    </Box>
  );

  return (
    <Box
      data-testid="followers-form"
      width="60vw"
      align="start"
      justify="between"
      overflow="auto"
      gap="18px"
      pad={{ bottom: '48px' }}
    >
      <Box direction="row" fill="horizontal" align="center" justify="between">
        <HeadingWS crustReady={crustReady} level={2} alignSelf="center">{`${
          !!character?.name ? character.name?.toUpperCase() : '...'
        }'S WORKSHOP`}</HeadingWS>
        <ButtonWS
          primary
          // label={settingEstablishment ? <Spinner fillColor="#FFF" width="36px" height="36px" /> : 'SET'}
          // onClick={() => !settingEstablishment && handleSubmitEstablishment()}
          // disabled={settingEstablishment || !isEstablishmentComplete}
          style={{ height: '45px' }}
        />
      </Box>

      <Box fill="horizontal" justify="between" gap="12px" margin={{ top: '6px' }}>
        <StyledMarkdown>{ITEMS_INSTRUCTIONS}</StyledMarkdown>
        <Box direction="row" gap="12px">
          <Box direction="row" wrap>
            {workspaceCreator?.workspaceItems.map((item) => renderPills(item))}
          </Box>
        </Box>
      </Box>
      <StyledMarkdown>{workspaceCreator?.workspaceInstructions}</StyledMarkdown>
      <HeadingWS crustReady={crustReady} level={3}>
        Projects
      </HeadingWS>
      <StyledMarkdown>{workspaceCreator?.projectInstructions}</StyledMarkdown>
    </Box>
  );
};

export default WorkspaceForm;
