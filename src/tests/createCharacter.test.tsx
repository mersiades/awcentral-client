import React from 'react';
import { findByTestId, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../components/App';
import { renderWithRouter } from './test-utils';
import { mockKeycloakStub } from '../../__mocks__/@react-keycloak/web';
import { mockGame5, mockKeycloakUserInfo } from './mocks';
import {
  mockCreateCharacter,
  mockGameForCharacterCreation1,
  mockGameForCharacterCreation2,
  mockPlaybookCreator,
  mockPlaybooksQuery,
  mockSetCharacterPlaybook,
} from './mockQueries';

jest.mock('@react-keycloak/web', () => {
  const originalModule = jest.requireActual('@react-keycloak/web');
  return {
    ...originalModule,
    useKeycloak: () => ({ keycloak: mockKeycloakStub(true, mockKeycloakUserInfo), initialized: true }),
  };
});

describe('Testing character creation flow', () => {
  test('should create an ANGEL character', async () => {
    renderWithRouter(<App />, `/character-creation/${mockGame5.id}`, {
      isAuthenticated: true,
      apolloMocks: [
        mockGameForCharacterCreation1,
        mockPlaybooksQuery,
        mockCreateCharacter,
        mockSetCharacterPlaybook,
        mockGameForCharacterCreation2,
        mockPlaybookCreator,
      ],
    });

    await screen.findAllByTestId('character-creation-page');

    // Check comms channel has been rendered
    const commsLink = screen.getByRole('link', { name: mockGame5.commsApp });
    expect(commsLink.getAttribute('href')).toEqual(mockGame5.commsUrl);

    // Click NEXT to go to CharacterPlaybookForm
    userEvent.click(screen.getByRole('button', { name: /NEXT/i }));

    // Click on ANGEL image to reveal Angel introduction
    userEvent.click(screen.getByTestId('angel-button'));

    const selectAngelButton = await screen.findByRole('button', { name: /SELECT ANGEL/i });

    // Click SELECT ANGEL
    userEvent.click(selectAngelButton);

    const playbookBox = await screen.findByTestId('playbook-box');
    expect(playbookBox.textContent).toContain('Angel');

    await screen.findByRole('heading');

    // const input = await screen.findByRole('textbox');

    screen.debug();
  });
});
