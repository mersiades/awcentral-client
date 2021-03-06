import React from 'react';
import userEvent from '@testing-library/user-event';
// import wait from 'waait';
import { InMemoryCache } from '@apollo/client';
import { screen } from '@testing-library/react';

import SkinnerGearForm from '../SkinnerGearForm';
import { mockKeycloakStub } from '../../../../../__mocks__/@react-keycloak/web';
import {
  blankCharacter,
  mockCharacter2,
  mockGame5,
  mockKeycloakUserInfo1,
  mockSkinnerGearCreator,
} from '../../../../tests/mocks';
import { renderWithRouter } from '../../../../tests/test-utils';
import { mockPlayBookCreatorQuerySkinner } from '../../../../tests/mockQueries';

jest.mock('@react-keycloak/web', () => {
  const originalModule = jest.requireActual('@react-keycloak/web');
  return {
    ...originalModule,
    useKeycloak: () => ({ keycloak: mockKeycloakStub(true, mockKeycloakUserInfo1), initialized: true }),
  };
});

describe('Rendering SkinnerGearForm', () => {
  let cache = new InMemoryCache();
  const mockGame = {
    ...mockGame5,
    gameRoles: [
      mockGame5.gameRoles[0],
      mockGame5.gameRoles[1],
      {
        id: mockGame5.gameRoles[2].id,
        role: mockGame5.gameRoles[2].role,
        userId: mockGame5.gameRoles[2].userId,
        npcs: mockGame5.gameRoles[2].npcs,
        threats: mockGame5.gameRoles[2].threats,
        characters: [
          {
            ...blankCharacter,
            id: mockCharacter2.id,
            playbook: mockCharacter2.playbook,
            name: mockCharacter2.name,
            looks: mockCharacter2.looks,
            statsBlock: mockCharacter2.statsBlock,
            gear: mockCharacter2.gear,
          },
        ],
      },
    ],
  };
  beforeEach(() => {
    cache = new InMemoryCache();
  });

  test('should render SkinnerGearForm in initial state', async () => {
    renderWithRouter(<SkinnerGearForm />, `/character-creation/${mockGame5.id}`, {
      isAuthenticated: true,
      apolloMocks: [mockPlayBookCreatorQuerySkinner],
      injectedGame: mockGame,
      injectedUserId: mockKeycloakUserInfo1.sub,
      cache,
    });

    await screen.findByTestId('skinner-gear-form');
    await screen.findByRole('heading', { name: `WHAT SKINNER GEAR DOES ${mockCharacter2.name?.toUpperCase()} HAVE?` });
    const checkBoxes = screen.getAllByRole('checkbox');
    expect(checkBoxes.length).toEqual(4);
    screen.getByRole('button', { name: 'SET' });
  });

  test('should enable SET button after completing form', async () => {
    renderWithRouter(<SkinnerGearForm />, `/character-creation/${mockGame5.id}`, {
      isAuthenticated: true,
      apolloMocks: [mockPlayBookCreatorQuerySkinner],
      injectedGame: mockGame,
      injectedUserId: mockKeycloakUserInfo1.sub,
      cache,
    });

    await screen.findByTestId('skinner-gear-form');
    await screen.findByRole('heading', { name: `WHAT SKINNER GEAR DOES ${mockCharacter2.name?.toUpperCase()} HAVE?` });
    const weapon1 = screen.getByRole('checkbox', { name: mockSkinnerGearCreator.graciousWeaponChoices[0].item });
    const luxeItem1 = screen.getByRole('checkbox', {
      name: mockSkinnerGearCreator.luxeGearChoices[0].item + ' ' + mockSkinnerGearCreator.luxeGearChoices[0].note,
    });
    const luxeItem2 = screen.getByRole('checkbox', {
      name: mockSkinnerGearCreator.luxeGearChoices[1].item + ' ' + mockSkinnerGearCreator.luxeGearChoices[1].note,
    });

    // Select gracious weapon
    userEvent.click(weapon1);
    let setButton = screen.getByRole('button', { name: 'SET' }) as HTMLButtonElement;
    expect(setButton.disabled).toEqual(true);

    // Select first luxe item
    userEvent.click(luxeItem1);
    setButton = screen.getByRole('button', { name: 'SET' }) as HTMLButtonElement;
    expect(setButton.disabled).toEqual(true);

    // Select second luxe item
    userEvent.click(luxeItem2);

    // Check SET button is enabled
    setButton = screen.getByRole('button', { name: 'SET' }) as HTMLButtonElement;
    expect(setButton.disabled).toEqual(false);
  });
});
