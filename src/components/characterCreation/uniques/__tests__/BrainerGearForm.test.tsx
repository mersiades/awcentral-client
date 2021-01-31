import React from 'react';
import { screen } from '@testing-library/react';

import { mockKeycloakStub } from '../../../../../__mocks__/@react-keycloak/web';
import { mockCharacter2, mockGame5, mockKeycloakUserInfo1 } from '../../../../tests/mocks';
import { renderWithRouter } from '../../../../tests/test-utils';
import { PlaybookType } from '../../../../@types/enums';
import { mockPlayBookCreatorQueryBrainer } from '../../../../tests/mockQueries';
import BrainerGearForm from '../BrainerGearForm';

jest.mock('@react-keycloak/web', () => {
  const originalModule = jest.requireActual('@react-keycloak/web');
  return {
    ...originalModule,
    useKeycloak: () => ({ keycloak: mockKeycloakStub(true, mockKeycloakUserInfo1), initialized: true }),
  };
});

describe('Rendering BrainerGearForm', () => {
  test('should render BrainerGearForm in default start state', async () => {
    const game = {
      ...mockGame5,
      gameRoles: [
        mockGame5.gameRoles[0],
        mockGame5.gameRoles[1],
        {
          ...mockGame5.gameRoles[2],
          characters: [
            {
              id: mockCharacter2.id,
              hasCompletedCharacterCreation: mockCharacter2.hasCompletedCharacterCreation,
              harm: mockCharacter2.harm,
              name: mockCharacter2.name,
              playbook: PlaybookType.driver,
              looks: mockCharacter2.looks,
              statsBlock: mockCharacter2.statsBlock,
              gear: mockCharacter2.gear,
              barter: mockCharacter2.barter,
              vehicleCount: 0,
              playbookUnique: undefined,
              characterMoves: [],
              hxBlock: mockCharacter2.hxBlock,
            },
          ],
        },
      ],
    };

    renderWithRouter(
      <BrainerGearForm existingBrainerGear={undefined} setCreationStep={jest.fn()} />,
      `/character-creation/${mockGame5.id}`,
      {
        isAuthenticated: true,
        apolloMocks: [mockPlayBookCreatorQueryBrainer],
        injectedGame: game,
        injectedUserId: mockKeycloakUserInfo1.sub,
      }
    );

    await screen.findByTestId('brainer-gear-form');
    screen.getByRole('heading', { name: `WHAT SPECIAL BRAINER GEAR DOES ${mockCharacter2.name.toUpperCase()} HAVE?` });

    // FAILING: the mock query isn't being hit / registered
  });
});
