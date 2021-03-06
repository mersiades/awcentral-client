import React from 'react';
import { act, screen } from '@testing-library/react';

import { mockKeycloakStub } from '../../../../../__mocks__/@react-keycloak/web';
import {
  blankCharacter,
  mockBrainerGearCreator,
  mockCharacter2,
  mockGame5,
  mockKeycloakUserInfo1,
} from '../../../../tests/mocks';
import { renderWithRouter } from '../../../../tests/test-utils';
import { PlaybookType } from '../../../../@types/enums';
import { mockPlayBookCreatorQueryBrainer } from '../../../../tests/mockQueries';
import BrainerGearForm from '../BrainerGearForm';
import { InMemoryCache } from '@apollo/client';
import wait from 'waait';
import userEvent from '@testing-library/user-event';

jest.mock('@react-keycloak/web', () => {
  const originalModule = jest.requireActual('@react-keycloak/web');
  return {
    ...originalModule,
    useKeycloak: () => ({ keycloak: mockKeycloakStub(true, mockKeycloakUserInfo1), initialized: true }),
  };
});

describe('Rendering BrainerGearForm', () => {
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
            playbook: PlaybookType.brainer,
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

  test('should render BrainerGearForm in initial state', async () => {
    renderWithRouter(<BrainerGearForm />, `/character-creation/${mockGame5.id}`, {
      isAuthenticated: true,
      apolloMocks: [mockPlayBookCreatorQueryBrainer],
      injectedGame: mockGame,
      injectedUserId: mockKeycloakUserInfo1.sub,
      cache,
    });

    await screen.findByTestId('brainer-gear-form');

    await screen.findByRole('heading', {
      name: `WHAT SPECIAL BRAINER GEAR DOES ${mockCharacter2.name?.toUpperCase()} HAVE?`,
    });
    screen.getByRole('button', { name: 'SET' });
    screen.getByRole('checkbox', { name: /implant syringe/i });
    screen.getByRole('checkbox', { name: /brain relay/i });
  });

  test('should enable SET button after selecting two items', async () => {
    renderWithRouter(<BrainerGearForm />, `/character-creation/${mockGame5.id}`, {
      isAuthenticated: true,
      apolloMocks: [mockPlayBookCreatorQueryBrainer],
      injectedGame: mockGame,
      injectedUserId: mockKeycloakUserInfo1.sub,
      cache,
    });

    const setButton = (await screen.findByRole('button', { name: 'SET' })) as HTMLButtonElement;
    expect(setButton.disabled).toEqual(true);
    const item1 = (await screen.findByRole('checkbox', { name: /implant syringe/i })) as HTMLInputElement;
    expect(item1.checked).toEqual(false);
    const item2 = screen.getByRole('checkbox', { name: /brain relay/i }) as HTMLInputElement;
    expect(item1.checked).toEqual(false);

    userEvent.click(item1);
    expect(item1.checked).toEqual(true);
    userEvent.click(item2);
    expect(item2.checked).toEqual(true);
    expect(setButton.disabled).toEqual(false);
  });
});
