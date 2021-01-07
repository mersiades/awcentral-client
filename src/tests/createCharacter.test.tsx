import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../components/App';
import { renderWithRouter } from './test-utils';
import { mockKeycloakStub } from '../../__mocks__/@react-keycloak/web';
import { mockGame5, mockKeycloakUserInfo } from './mocks';
import { mockGameForCharacterCreation1, mockPlaybooksQuery } from './mockQueries';

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
      apolloMocks: [mockGameForCharacterCreation1, mockPlaybooksQuery],
    });

    await screen.findAllByTestId('character-creation-page');

    screen.debug();
  });
});
