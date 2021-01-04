import React from 'react';
import { render } from '../../utils/test-utils';
import { screen } from '@testing-library/react';
import App from '../App';
import TestRoot from '../../tests/TestRoot';
import { mockKeycloakStub } from '../../../__mocks__/@react-keycloak/web';
import { mockKeycloakUserInfo } from '../../tests/mocks';

jest.mock('@react-keycloak/web', () => {
  const originalModule = jest.requireActual('@react-keycloak/web');
  return {
    ...originalModule,
    useKeycloak: () => ({ keycloak: mockKeycloakStub(true, mockKeycloakUserInfo), initialized: true }),
  };
});

jest.mock('../../contexts/fontContext', () => {
  return {
    useFonts: () => ({ vtksReady: true, crustReady: true }),
  };
});

describe('Rendering App', () => {
  test('renders nothing worth testing yet', () => {
    render(
      <TestRoot>
        <App />
      </TestRoot>
    );

    const MenuPageBox = screen.getByTestId('menu-page');
    expect(MenuPageBox).toBeInTheDocument();
  });
});
