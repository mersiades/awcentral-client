import React from 'react';
import userEvent from '@testing-library/user-event';
// import wait from 'waait';
import { InMemoryCache } from '@apollo/client';
import { screen } from '@testing-library/react';

import GangForm from '../GangForm';
import { mockKeycloakStub } from '../../../../../__mocks__/@react-keycloak/web';
import { blankCharacter, mockCharacter2, mockGame5, mockGangCreator, mockKeycloakUserInfo1 } from '../../../../tests/mocks';
import { renderWithRouter } from '../../../../tests/test-utils';
import { mockPlayBookCreatorQueryChopper } from '../../../../tests/mockQueries';

jest.mock('@react-keycloak/web', () => {
  const originalModule = jest.requireActual('@react-keycloak/web');
  return {
    ...originalModule,
    useKeycloak: () => ({ keycloak: mockKeycloakStub(true, mockKeycloakUserInfo1), initialized: true }),
  };
});

describe('Rendering GangForm', () => {
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

  test('should render GangForm in intial state', async () => {
    renderWithRouter(<GangForm />, `/character-creation/${mockGame5.id}`, {
      isAuthenticated: true,
      apolloMocks: [mockPlayBookCreatorQueryChopper],
      injectedGame: mockGame,
      injectedUserId: mockKeycloakUserInfo1.sub,
      cache,
    });

    await screen.findByTestId('gang-form');
    await screen.findByRole('heading', { name: `${mockCharacter2.name?.toUpperCase()}'S GANG` });
    const sizeValue = screen.getByRole('heading', { name: 'size-value' });
    expect(sizeValue.textContent).toEqual(mockGangCreator.defaultSize);
    const harmValue = screen.getByRole('heading', { name: 'harm-value' });
    expect(harmValue.textContent).toEqual(mockGangCreator.defaultHarm.toString());
    const armorValue = screen.getByRole('heading', { name: 'armor-value' });
    expect(armorValue.textContent).toEqual(mockGangCreator.defaultArmor.toString());
    const tagsBox = screen.getByTestId('tags-tags-box');
    expect('+' + tagsBox.textContent).toContain(mockGangCreator.defaultTags[0]);
    const checkBoxes = screen.getAllByRole('checkbox');
    expect(checkBoxes.length).toEqual(4);
    screen.getByRole('button', { name: 'SET' });
  });

  test('should enable SET button after completing form', async () => {
    renderWithRouter(<GangForm />, `/character-creation/${mockGame5.id}`, {
      isAuthenticated: true,
      apolloMocks: [mockPlayBookCreatorQueryChopper],
      injectedGame: mockGame,
      injectedUserId: mockKeycloakUserInfo1.sub,
      cache,
    });

    let setButton = (await screen.findByRole('button', { name: 'SET' })) as HTMLButtonElement;
    const strength1 = await screen.findByRole('checkbox', { name: mockGangCreator.strengths[0].description });
    const strength2 = screen.getByRole('checkbox', { name: mockGangCreator.strengths[1].description });
    const weakness = screen.getByRole('checkbox', { name: mockGangCreator.weaknesses[0].description });
    const harmValue = screen.getByRole('heading', { name: 'harm-value' });
    const tagsBox = screen.getByTestId('tags-tags-box');

    // Select first strength
    userEvent.click(strength1);
    expect(harmValue.textContent).toEqual('3');
    setButton = (await screen.findByRole('button', { name: 'SET' })) as HTMLButtonElement;
    expect(setButton.disabled).toEqual(true);

    // Select second strength
    userEvent.click(strength2);
    expect(tagsBox.textContent).not.toContain('savage');
    setButton = (await screen.findByRole('button', { name: 'SET' })) as HTMLButtonElement;
    expect(setButton.disabled).toEqual(true);

    // Select weakness
    userEvent.click(weakness);
    expect('+' + tagsBox.textContent).toContain(mockGangCreator.weaknesses[0].tag);
    setButton = (await screen.findByRole('button', { name: 'SET' })) as HTMLButtonElement;
    expect(setButton.disabled).toEqual(false);
  });
});
