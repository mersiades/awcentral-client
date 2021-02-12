import React, { FC } from 'react';
import { useMutation } from '@apollo/client';
import { Box } from 'grommet';

import CollapsiblePanelBox from '../CollapsiblePanelBox';

import { useFonts } from '../../contexts/fontContext';
import { useGame } from '../../contexts/gameContext';

import { useParams } from 'react-router-dom';

import DoubleRedBox from '../DoubleRedBox';
import SingleRedBox from '../SingleRedBox';
import RedTagsBox from '../RedTagsBox';
import UPDATE_FOLLOWERS, { UpdateFollowersData, UpdateFollowersVars } from '../../mutations/updateFollowers';
import { getFollowersDescription } from '../../helpers/getFollowersDescription';

interface FollowersBoxProps {
  navigateToCharacterCreation: (step: string) => void;
}

const FollowersBox: FC<FollowersBoxProps> = ({ navigateToCharacterCreation }) => {
  // ------------------------------------------------------- Hooks --------------------------------------------------------- //
  const { character, userGameRole } = useGame();

  // -------------------------------------------------- 3rd party hooks ---------------------------------------------------- //
  const { gameId } = useParams<{ gameId: string }>();

  // ------------------------------------------------------ graphQL -------------------------------------------------------- //

  const [updateFollowers, { loading: updatingFollowers }] = useMutation<UpdateFollowersData, UpdateFollowersVars>(
    UPDATE_FOLLOWERS
  );
  // ------------------------------------------------- Component functions -------------------------------------------------- //

  const followers = character?.playbookUnique?.followers;

  const adjustBarter = (type: 'increase' | 'decrease') => {
    if (!!userGameRole && !!character && !!character.playbookUnique && !!followers) {
      const barter = type === 'increase' ? followers.barter + 1 : followers.barter - 1;
      try {
        updateFollowers({
          variables: {
            gameRoleId: userGameRole?.id,
            characterId: character.id,
            barter,
            followers: followers.followers,
            description: followers.description,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateFollowers: {
              __typename: 'Character',
              ...character,
              playbookUnique: {
                ...character.playbookUnique,
                followers: {
                  ...followers,
                  barter,
                },
              },
            },
          },
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const adjustFollowers = (type: 'increase' | 'decrease') => {
    if (!!userGameRole && !!character && !!character.playbookUnique && !!followers) {
      const newFollowers = type === 'increase' ? followers.followers + 1 : followers.followers - 1;
      const description = getFollowersDescription(followers.characterization, newFollowers, followers.travelOption) || '';
      try {
        updateFollowers({
          variables: {
            gameRoleId: userGameRole?.id,
            characterId: character.id,
            barter: followers.barter,
            followers: newFollowers,
            description,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateFollowers: {
              __typename: 'Character',
              ...character,
              playbookUnique: {
                ...character.playbookUnique,
                followers: {
                  ...followers,
                  followers: newFollowers,
                  description,
                },
              },
            },
          },
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  // -------------------------------------------------- Render component  ---------------------------------------------------- //

  return (
    <CollapsiblePanelBox
      open
      title="Followers"
      navigateToCharacterCreation={navigateToCharacterCreation}
      targetCreationStep="6"
    >
      <Box
        fill="horizontal"
        direction="row"
        align="start"
        animation={{ type: 'fadeIn', delay: 0, duration: 500, size: 'xsmall' }}
      >
        {!!followers && (
          <Box fill="horizontal" direction="row" align="center" justify="start" wrap gap="12px" pad="12px">
            {!!followers.description && (
              <RedTagsBox tags={[followers.description]} label="Description" height="90px" maxWidth="400px" />
            )}
            <DoubleRedBox value={`fortune+${followers.fortune}`} label="Fortune" />
            {!!followers.surplus && <RedTagsBox tags={followers.surplus} label="Surplus" height="90px" />}
            {!!followers.wants && <RedTagsBox tags={followers.wants} label="Want" height="90px" />}
            <SingleRedBox
              value={followers.barter.toString()}
              label="Barter"
              loading={updatingFollowers}
              onIncrease={() => adjustBarter('increase')}
              onDecrease={() => adjustBarter('decrease')}
            />
            <SingleRedBox
              value={followers.followers.toString()}
              label="Followers"
              loading={updatingFollowers}
              onIncrease={() => adjustFollowers('increase')}
              onDecrease={() => adjustFollowers('decrease')}
            />
          </Box>
        )}
      </Box>
    </CollapsiblePanelBox>
  );
};

export default FollowersBox;
