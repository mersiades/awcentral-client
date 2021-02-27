import React from 'react';
import wait from 'waait';
import userEvent from '@testing-library/user-event';
import { InMemoryCache } from '@apollo/client';
import { act, fireEvent, screen } from '@testing-library/react';

import CharacterHxForm from '../CharacterHxForm';
import { mockKeycloakStub } from '../../../../__mocks__/@react-keycloak/web';
import {
  blankCharacter,
  mockCharacter1,
  mockCharacter2,
  mockGame5,
  mockKeycloakUserInfo1,
  mockPlaybookCreatorAngel,
} from '../../../tests/mocks';
import { renderWithRouter } from '../../../tests/test-utils';
import { mockPlaybookCreator, mockToggleStatHighlight } from '../../../tests/mockQueries';

jest.mock('@react-keycloak/web', () => {
  const originalModule = jest.requireActual('@react-keycloak/web');
  return {
    ...originalModule,
    useKeycloak: () => ({ keycloak: mockKeycloakStub(true, mockKeycloakUserInfo1), initialized: true }),
  };
});

describe('Rendering CharacterHxForm', () => {
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
            ...mockCharacter2,
            hxBlock: [],
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    cache = new InMemoryCache();
  });

  // test('should render CharacterHxForm in initial state', async () => {
  //   renderWithRouter(<CharacterHxForm />, `/character-creation/${mockGame5.id}?step=10`, {
  //     isAuthenticated: true,
  //     injectedGame: mockGame,
  //     apolloMocks: [mockPlaybookCreator],
  //     injectedUserId: mockKeycloakUserInfo1.sub,
  //     cache,
  //   });

  //   await screen.findByTestId('character-hx-form');
  //   await act(async () => await wait());
  //   screen.getByRole('button', { name: 'SET' });
  //   screen.getByRole('heading', { name: `WHAT HISTORY DOES ${mockCharacter2.name?.toUpperCase()} HAVE?` });
  //   screen.getByRole('heading', { name: mockCharacter1.name });
  //   // There's only one other mock Character, so only one spinbutton
  //   const hxButton = screen.getAllByRole('spinbutton')[0] as HTMLInputElement;
  //   expect(hxButton.value).toEqual('0');
  //   const coolValue = screen.getByRole('heading', { name: 'cool-value' }) as HTMLHeadingElement;
  //   expect(coolValue.textContent).toEqual(mockCharacter2.statsBlock?.stats[0].value.toString());
  //   const hardValue = screen.getByRole('heading', { name: 'hard-value' }) as HTMLHeadingElement;
  //   expect(hardValue.textContent).toEqual(mockCharacter2.statsBlock?.stats[1].value.toString());
  //   const hotValue = screen.getByRole('heading', { name: 'hot-value' }) as HTMLHeadingElement;
  //   expect(hotValue.textContent).toEqual(mockCharacter2.statsBlock?.stats[2].value.toString());
  //   const sharpValue = screen.getByRole('heading', { name: 'sharp-value' }) as HTMLHeadingElement;
  //   expect(sharpValue.textContent).toEqual(mockCharacter2.statsBlock?.stats[3].value.toString());
  //   const weirdValue = screen.getByRole('heading', { name: 'weird-value' }) as HTMLHeadingElement;
  //   expect(weirdValue.textContent).toEqual(mockCharacter2.statsBlock?.stats[4].value.toString());
  // });

  test('should enable SET button after setting Hx and highlighting stats', async () => {
    renderWithRouter(<CharacterHxForm />, `/character-creation/${mockGame5.id}?step=10`, {
      isAuthenticated: true,
      injectedGame: mockGame,
      apolloMocks: [mockPlaybookCreator, mockToggleStatHighlight],
      injectedUserId: mockKeycloakUserInfo1.sub,
      cache,
    });

    await screen.findByTestId('character-hx-form');
    const setButton = screen.getByRole('button', { name: 'SET' }) as HTMLButtonElement;
    expect(setButton.disabled).toEqual(true);

    // Set Hx for the one other mock character
    const hxButton = screen.getAllByRole('spinbutton')[0] as HTMLInputElement;
    fireEvent.input(hxButton, { target: { value: 2 } });
    expect(hxButton.value).toEqual('2');

    // Highlight two stats
    const coolBox = screen.getByTestId('COOL');
    userEvent.click(coolBox);
    // Mutation result is not updating graphql cache
    const hardBox = await screen.findByTestId('HARD');
    userEvent.click(hardBox);

    // Check SET button is enabled

    expect(setButton.disabled).toEqual(false);
  });
});
