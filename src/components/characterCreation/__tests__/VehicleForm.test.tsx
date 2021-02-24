import React from 'react';
import { screen } from '@testing-library/react';

import VehicleForm from '../VehicleForm';
import { mockKeycloakStub } from '../../../../__mocks__/@react-keycloak/web';
import { mockCharacter2, mockGame5, mockKeycloakUserInfo1 } from '../../../tests/mocks';
import { renderWithRouter } from '../../../tests/test-utils';
import { PlaybookType } from '../../../@types/enums';
import { mockVehicleCreatorQuery } from '../../../tests/mockQueries';

jest.mock('@react-keycloak/web', () => {
  const originalModule = jest.requireActual('@react-keycloak/web');
  return {
    ...originalModule,
    useKeycloak: () => ({ keycloak: mockKeycloakStub(true, mockKeycloakUserInfo1), initialized: true }),
  };
});

describe('Rendering VehicleForm', () => {
  test('should load an empty vehicle into the form', async () => {
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
              hasPlusOneForward: false,
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
              vehicles: [],
              battleVehicles: [],
              holds: [],
              battleVehicleCount: 0,
            },
          ],
        },
      ],
    };

    const mockNavigationOnSet = jest.fn();

    renderWithRouter(
      <VehicleForm existingVehicle={undefined} navigateOnSet={mockNavigationOnSet} />,
      `/character-creation/${mockGame5.id}?step=8`,
      {
        isAuthenticated: true,
        apolloMocks: [mockVehicleCreatorQuery],
        injectedGame: game,
        injectedUserId: mockKeycloakUserInfo1.sub,
      }
    );

    await screen.findByTestId('vehicle-form');
    // @ts-ignore
    expect(screen.getByRole('textbox', { name: 'name-input' }).value).toEqual('Unnamed vehicle');
    expect(screen.getByRole('heading', { name: 'vehicle-name' }).textContent).toEqual('Unnamed vehicle');
    screen.getByRole('heading', { name: 'MEDIUM' });
    expect(screen.getAllByRole('heading', { name: '0' }).length).toEqual(3);
    expect(screen.getAllByRole('heading', { name: '2' }).length).toEqual(1);
  });
});

/**
 * textbox:

      Name "name-input":
      <input
        aria-label="name-input"
        autocomplete="off"
        class="StyledTextInput-sc-1x30a0s-0 jKshUE"
        name="name"
        value="Unnamed vehicle"
      />

      --------------------------------------------------
      heading:

      Name "vehicle-name":
      <h3
        aria-label="vehicle-name"
        class="StyledHeading-sc-1rdh4aw-0 gYMaOl sc-gsTCUz kNvypE"
      />

      Name "frame-type":
      <h2
        aria-label="frame-type"
        class="StyledHeading-sc-1rdh4aw-0 jhNgTF sc-gsTCUz kNvypE"
      />

      Name "speed":
      <h2
        aria-label="speed"
        class="StyledHeading-sc-1rdh4aw-0 jhNgTF sc-gsTCUz kNvypE"
      />

      Name "handling":
      <h2
        aria-label="handling"
        class="StyledHeading-sc-1rdh4aw-0 jhNgTF sc-gsTCUz kNvypE"
      />

      Name "massive":
      <h2
        aria-label="massive"
        class="StyledHeading-sc-1rdh4aw-0 jhNgTF sc-gsTCUz kNvypE"
      />

      Name "armor":
      <h2
        aria-label="armor"
        class="StyledHeading-sc-1rdh4aw-0 jhNgTF sc-gsTCUz kNvypE"
      />

      --------------------------------------------------
      button:

      Name "SET":
      <button
        class="StyledButtonKind-sc-1vhfpnt-0 geDuxv sc-hKgILt iNFPrP"
        kind="primary"
        type="button"
      />
 */
