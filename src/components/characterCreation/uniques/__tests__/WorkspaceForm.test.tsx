import React from 'react';
import userEvent from '@testing-library/user-event';
import wait from 'waait';
import { InMemoryCache } from '@apollo/client';
import { act, screen } from '@testing-library/react';

import WorkspaceForm from '../WorkspaceForm';
import { mockKeycloakStub } from '../../../../../__mocks__/@react-keycloak/web';
import {
  blankCharacter,
  mockCharacter2,
  mockGame5,
  mockKeycloakUserInfo1,
  mockWorkspaceCreator,
} from '../../../../tests/mocks';
import { renderWithRouter } from '../../../../tests/test-utils';
import { mockPlayBookCreatorQuerySavvyhead } from '../../../../tests/mockQueries';

jest.mock('@react-keycloak/web', () => {
  const originalModule = jest.requireActual('@react-keycloak/web');
  return {
    ...originalModule,
    useKeycloak: () => ({ keycloak: mockKeycloakStub(true, mockKeycloakUserInfo1), initialized: true }),
  };
});

describe('Rendering WorkspaceForm', () => {
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
  beforeEach(async () => {
    cache = new InMemoryCache();
    renderWithRouter(<WorkspaceForm />, `/character-creation/${mockGame5.id}`, {
      isAuthenticated: true,
      apolloMocks: [mockPlayBookCreatorQuerySavvyhead],
      injectedGame: mockGame,
      injectedUserId: mockKeycloakUserInfo1.sub,
      cache,
    });
    await act(async () => await wait());
  });

  test('should render WorkspaceForm in initial state', async () => {
    await screen.findByTestId('workspace-form');
    screen.getByRole('heading', { name: `${mockCharacter2.name?.toUpperCase()}'S WORKSPACE` });
    screen.getByRole('heading', { name: 'Projects' });
    screen.getByRole;
  });

  test('should enable SET button when form is completed', async () => {
    await screen.findByTestId('workspace-form');
    let setButton = screen.getByRole('button', { name: 'SET' }) as HTMLButtonElement;
    const item1 = screen.getByTestId(`${mockWorkspaceCreator.workspaceItems[0]}-pill`);
    const item2 = screen.getByTestId(`${mockWorkspaceCreator.workspaceItems[1]}-pill`);
    const item3 = screen.getByTestId(`${mockWorkspaceCreator.workspaceItems[2]}-pill`);

    // Select first workspace item
    userEvent.click(item1);

    // Select second workspace item
    userEvent.click(item2);
    setButton = screen.getByRole('button', { name: 'SET' }) as HTMLButtonElement;
    expect(setButton.disabled).toEqual(true);

    // Select second workspace item
    userEvent.click(item3);
    setButton = screen.getByRole('button', { name: 'SET' }) as HTMLButtonElement;
    expect(setButton.disabled).toEqual(false);
  });
});
