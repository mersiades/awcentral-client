import React from 'react';
// import wait from 'waait';
import { cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { mockKeycloakStub } from '../../../../../__mocks__/@react-keycloak/web';
import { mockAngelKitCreator, mockCharacter2, mockGame5, mockKeycloakUserInfo1 } from '../../../../tests/mocks';
import { renderWithRouter } from '../../../../tests/test-utils';
import { PlaybookType } from '../../../../@types/enums';
import { mockPlayBookCreatorQueryAngel } from '../../../../tests/mockQueries';
import AngelKitForm from '../AngelKitForm';

jest.mock('@react-keycloak/web', () => {
  const originalModule = jest.requireActual('@react-keycloak/web');
  return {
    ...originalModule,
    useKeycloak: () => ({ keycloak: mockKeycloakStub(true, mockKeycloakUserInfo1), initialized: true }),
  };
});

describe('Rendering AngelKitForm', () => {
  test('should load AngelKitForm with default values and submit', async () => {
    const startCharacter = {
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
    };
    const game = {
      ...mockGame5,
      gameRoles: [
        mockGame5.gameRoles[0],
        mockGame5.gameRoles[1],
        {
          ...mockGame5.gameRoles[2],
          characters: [startCharacter],
        },
      ],
    };

    renderWithRouter(<AngelKitForm />, `/character-creation/${mockGame5.id}`, {
      isAuthenticated: true,
      apolloMocks: [mockPlayBookCreatorQueryAngel],
      injectedGame: game,
      injectedUserId: mockKeycloakUserInfo1.sub,
    });

    await screen.findByTestId('angel-kit-form');

    await screen.findByRole('heading', { name: `${mockCharacter2.name.toUpperCase()}'S ANGEL KIT` });
    screen.getByRole('heading', { name: 'Stock' });

    expect(screen.getByRole('heading', { name: 'stock-value' }).textContent).toEqual(
      mockAngelKitCreator.startingStock.toString()
    );
  });
});

/**
 * heading:

      Name "MOCK CHARACTER 2'S ANGEL KIT":
      <h2
        class="StyledHeading-sc-1rdh4aw-0 ferGzb sc-gsTCUz kNvypE"
      />

      Name "Stock":
      <h3
        class="StyledHeading-sc-1rdh4aw-0 iExjDX sc-gsTCUz kNvypE"
      />

      --------------------------------------------------
      spinbutton:

      Name "":
      <input
        autocomplete="off"
        class="StyledTextInput-sc-1x30a0s-0 hRQEmp"
        type="number"
        value=""
      />

      --------------------------------------------------
      button:

      Name "SET":
      <button
        class="StyledButtonKind-sc-1vhfpnt-0 krbYCw sc-hKgILt iNFPrP"
        kind="primary"
        type="button"
      />
 */
