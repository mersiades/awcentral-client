import React from 'react';
import userEvent from '@testing-library/user-event';
// import wait from 'waait';
import { InMemoryCache } from '@apollo/client';
import { screen } from '@testing-library/react';

import WeaponsForm from '../WeaponsForm';
import { mockKeycloakStub } from '../../../../../__mocks__/@react-keycloak/web';
import {
  blankCharacter,
  mockCharacter2,
  mockGame5,
  mockKeycloakUserInfo1,
  mockWeaponsCreator,
} from '../../../../tests/mocks';
import { renderWithRouter } from '../../../../tests/test-utils';
import { mockPlayBookCreatorQueryGunlugger } from '../../../../tests/mockQueries';

jest.mock('@react-keycloak/web', () => {
  const originalModule = jest.requireActual('@react-keycloak/web');
  return {
    ...originalModule,
    useKeycloak: () => ({ keycloak: mockKeycloakStub(true, mockKeycloakUserInfo1), initialized: true }),
  };
});

describe('Rendering WeaponsForm', () => {
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

  test('should render WeaponsForm in intial state', async () => {
    renderWithRouter(<WeaponsForm />, `/character-creation/${mockGame5.id}`, {
      isAuthenticated: true,
      apolloMocks: [mockPlayBookCreatorQueryGunlugger],
      injectedGame: mockGame,
      injectedUserId: mockKeycloakUserInfo1.sub,
      cache,
    });

    await screen.findByTestId('weapons-form');
    await screen.findByRole('heading', { name: `${mockCharacter2.name?.toUpperCase()}'S WEAPONS` });
    mockWeaponsCreator.bigFuckOffGuns.forEach((gun) => screen.getByTestId(`${gun}-pill`));
    mockWeaponsCreator.seriousGuns.forEach((gun) => screen.getByTestId(`${gun}-pill`));
    mockWeaponsCreator.backupWeapons.forEach((gun) => screen.getByTestId(`${gun}-pill`));
    screen.getByRole('button', { name: 'SET' });
  });

  test('should enable SET button after form completion', async () => {
    renderWithRouter(<WeaponsForm />, `/character-creation/${mockGame5.id}`, {
      isAuthenticated: true,
      apolloMocks: [mockPlayBookCreatorQueryGunlugger],
      injectedGame: mockGame,
      injectedUserId: mockKeycloakUserInfo1.sub,
      cache,
    });

    await screen.findByTestId('weapons-form');
    await screen.findByRole('heading', { name: `${mockCharacter2.name?.toUpperCase()}'S WEAPONS` });
    const bigGun = screen.getByTestId(`${mockWeaponsCreator.bigFuckOffGuns[0]}-pill`);
    const seriousGun1 = screen.getByTestId(`${mockWeaponsCreator.seriousGuns[0]}-pill`);
    const seriousGun2 = screen.getByTestId(`${mockWeaponsCreator.seriousGuns[1]}-pill`);
    const backupWeapon = screen.getByTestId(`${mockWeaponsCreator.backupWeapons[0]}-pill`);

    // Select big gun
    userEvent.click(bigGun);

    // Select first serious gun
    userEvent.click(seriousGun1);

    // Select second serious gun
    userEvent.click(seriousGun2);

    // Select backup weapon
    userEvent.click(backupWeapon);
    let setButton = screen.getByRole('button', { name: 'SET' }) as HTMLButtonElement;
    expect(setButton.disabled).toEqual(false);

    // De-select backup weapon
    userEvent.click(backupWeapon);
    setButton = screen.getByRole('button', { name: 'SET' }) as HTMLButtonElement;
    expect(setButton.disabled).toEqual(true);
  });
});
