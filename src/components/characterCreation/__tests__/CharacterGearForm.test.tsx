import React from 'react';
// import wait from 'waait';
import userEvent from '@testing-library/user-event';
import { InMemoryCache } from '@apollo/client';
import { screen } from '@testing-library/react';

import CharacterGearForm from '../CharacterGearForm';
import { mockKeycloakStub } from '../../../../__mocks__/@react-keycloak/web';
import { blankCharacter, mockCharacter2, mockGame5, mockKeycloakUserInfo1 } from '../../../tests/mocks';
import { renderWithRouter } from '../../../tests/test-utils';
import { mockPlaybookCreator } from '../../../tests/mockQueries';

jest.mock('@react-keycloak/web', () => {
  const originalModule = jest.requireActual('@react-keycloak/web');
  return {
    ...originalModule,
    useKeycloak: () => ({ keycloak: mockKeycloakStub(true, mockKeycloakUserInfo1), initialized: true }),
  };
});

describe('Rendering CharacterStatsForm', () => {
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
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    cache = new InMemoryCache();
  });

  test('should render CharacterGearForm in initial state', async () => {
    renderWithRouter(<CharacterGearForm />, `/character-creation/${mockGame5.id}?step=5`, {
      isAuthenticated: true,
      injectedGame: mockGame,
      apolloMocks: [mockPlaybookCreator],
      injectedUserId: mockKeycloakUserInfo1.sub,
      cache,
    });

    await screen.findByTestId('character-gear-form');
    await screen.findByRole('heading', { name: `WHAT IS ${mockCharacter2.name?.toUpperCase()}'S GEAR?` });

    screen.getByRole('heading', { name: 'Options' });
    screen.getByRole('heading', { name: 'Gear' });
    screen.getByRole('button', { name: 'SET' });
    screen.getByRole('button', { name: 'ADD' });
    screen.getByRole('button', { name: 'REMOVE' });
    screen.getByRole('list', { name: 'interim-gear-list' });
    screen.getByRole('list', { name: 'items-you-can-choose-list' });
    screen.getByRole('list', { name: 'items-you-get-list' });
    screen.getByRole('textbox', { name: 'item-input' });
  });

  test('should select item, modify it, add to interim item list, and then remove it', async () => {
    renderWithRouter(<CharacterGearForm />, `/character-creation/${mockGame5.id}?step=5`, {
      isAuthenticated: true,
      injectedGame: mockGame,
      apolloMocks: [mockPlaybookCreator],
      injectedUserId: mockKeycloakUserInfo1.sub,
      cache,
    });

    await screen.findByTestId('character-gear-form');
    const item = await screen.findByRole('listitem', { name: 'you-get-item-0' });
    userEvent.click(item);

    // Check the item has been put into the textarea
    const itemInput = screen.getByRole('textbox', { name: 'item-input' }) as HTMLInputElement;
    expect(itemInput.value).toEqual(item.textContent);

    // "Select all" on the fashion item in the text box
    itemInput.setSelectionRange(0, itemInput.value.length);

    // Manually type a better fashion option
    userEvent.type(itemInput, mockCharacter2.gear[0]);
    expect(itemInput.value).toEqual(mockCharacter2.gear[0]);

    // Click ADD to add the item to the interim list
    userEvent.click(screen.getByRole('button', { name: /ADD/i }));
    expect(screen.getByRole('list', { name: 'interim-gear-list' }).textContent).toContain(mockCharacter2.gear[0]);
    expect(itemInput.value).toEqual('');
    const setButton = screen.getByRole('button', { name: 'SET' }) as HTMLButtonElement;
    expect(setButton.disabled).toEqual(false);

    // Click on item in interim list
    const interimItem = await screen.findByRole('listitem', { name: 'interim-list-item-0' });
    const removeButton = screen.getByRole('button', { name: 'REMOVE' }) as HTMLButtonElement;
    expect(removeButton.disabled).toEqual(true);
    userEvent.click(interimItem);
    expect(itemInput.value).toEqual(mockCharacter2.gear[0]);
    expect(removeButton.disabled).toEqual(false);

    // Click the REMOVE button
    userEvent.click(removeButton);
    expect(screen.getByRole('list', { name: 'interim-gear-list' }).textContent).toEqual('');
    expect(itemInput.value).toEqual('');
    expect(removeButton.disabled).toEqual(true);
  });

  test('should select item from chooseable item list and add it to interim list', async () => {
    renderWithRouter(<CharacterGearForm />, `/character-creation/${mockGame5.id}?step=5`, {
      isAuthenticated: true,
      injectedGame: mockGame,
      apolloMocks: [mockPlaybookCreator],
      injectedUserId: mockKeycloakUserInfo1.sub,
      cache,
    });

    await screen.findByTestId('character-gear-form');
    const item = await screen.findByRole('listitem', { name: 'chooseable-listitem-0' });
    const addButton = screen.getByRole('button', { name: /ADD/i }) as HTMLButtonElement;
    expect(addButton.disabled).toEqual(true);

    // Click on chooseable item
    userEvent.click(item);

    // Check the item has been put into the textarea
    const itemInput = screen.getByRole('textbox', { name: 'item-input' }) as HTMLInputElement;
    expect(itemInput.value).toEqual(item.textContent);
    expect(addButton.disabled).toEqual(false);

    // Add the item to interim list
    userEvent.click(addButton);
    expect(screen.getByRole('list', { name: 'interim-gear-list' }).textContent).toContain(item.textContent);
    expect(itemInput.value).toEqual('');
    expect(addButton.disabled).toEqual(true);
  });
});
