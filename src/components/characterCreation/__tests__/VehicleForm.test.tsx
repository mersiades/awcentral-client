import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InMemoryCache } from '@apollo/client';

import VehicleForm from '../VehicleForm';
import { mockKeycloakStub } from '../../../../__mocks__/@react-keycloak/web';
import { blankCharacter, mockCarCreator, mockCharacter2, mockGame5, mockKeycloakUserInfo1 } from '../../../tests/mocks';
import { renderWithRouter } from '../../../tests/test-utils';
import { VehicleFrameType } from '../../../@types/enums';
import { mockVehicleCreatorQuery } from '../../../tests/mockQueries';
import { DEFAULT_VEHICLE_NAME } from '../../../config/constants';

jest.mock('@react-keycloak/web', () => {
  const originalModule = jest.requireActual('@react-keycloak/web');
  return {
    ...originalModule,
    useKeycloak: () => ({ keycloak: mockKeycloakStub(true, mockKeycloakUserInfo1), initialized: true }),
  };
});

describe('Rendering VehicleForm', () => {
  let cache = new InMemoryCache();

  const mockNavigationOnSet = jest.fn();

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
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    cache = new InMemoryCache();
  });

  test('should render VehicleForm with blank vehicle', async () => {
    renderWithRouter(
      <VehicleForm existingVehicle={undefined} navigateOnSet={mockNavigationOnSet} />,
      `/character-creation/${mockGame5.id}?step=8`,
      {
        isAuthenticated: true,
        apolloMocks: [mockVehicleCreatorQuery],
        injectedGame: mockGame,
        injectedUserId: mockKeycloakUserInfo1.sub,
        cache,
      }
    );

    await screen.findByTestId('vehicle-form');
    const setButton = screen.getByRole('button', { name: 'SET' }) as HTMLButtonElement;
    expect(setButton.disabled).toEqual(true);
    const nameInput = screen.getByRole('textbox', { name: 'name-input' }) as HTMLInputElement;
    expect(nameInput.value).toEqual(DEFAULT_VEHICLE_NAME);
    const frame = screen.getByRole('heading', { name: 'frame-value' }) as HTMLHeadingElement;
    expect(frame.textContent).toEqual(VehicleFrameType.medium);
    const speed = screen.getByRole('heading', { name: 'speed-value' }) as HTMLHeadingElement;
    expect(speed.textContent).toEqual('0');
    const handling = screen.getByRole('heading', { name: 'handling-value' }) as HTMLHeadingElement;
    expect(handling.textContent).toEqual('0');
    const armor = screen.getByRole('heading', { name: 'armor-value' }) as HTMLHeadingElement;
    expect(armor.textContent).toEqual('0');
    const massive = screen.getByRole('heading', { name: 'massive-value' }) as HTMLHeadingElement;
    expect(massive.textContent).toEqual('2');
  });

  test('should enable SET button once form is filled in', async () => {
    const vehicleName = 'my-vehicle';
    renderWithRouter(
      <VehicleForm existingVehicle={undefined} navigateOnSet={mockNavigationOnSet} />,
      `/character-creation/${mockGame5.id}?step=9`,
      {
        isAuthenticated: true,
        injectedGame: mockGame,
        apolloMocks: [mockVehicleCreatorQuery],
        injectedUserId: mockKeycloakUserInfo1.sub,
        cache,
      }
    );

    await screen.findByTestId('vehicle-form');

    // Enter name for battle vehicle
    const nameInput = screen.getByRole('textbox', { name: 'name-input' }) as HTMLInputElement;
    nameInput.setSelectionRange(0, DEFAULT_VEHICLE_NAME.length);
    userEvent.type(nameInput, vehicleName);
    expect(nameInput.value).toEqual(vehicleName);

    // Choose vehicle frame
    const largeFramePill = screen.getByTestId(`${VehicleFrameType.large.toLowerCase()}-bo-pill`);
    userEvent.click(largeFramePill);
    const frame = screen.getByRole('heading', { name: 'frame-value' }) as HTMLHeadingElement;
    expect(frame.textContent).toEqual(VehicleFrameType.large);

    // Select a strength
    const strengthPill = screen.getByTestId(`${mockCarCreator.strengths[0]}-option-pill`);
    userEvent.click(strengthPill);

    // Select a weakness
    const weaknessPill = screen.getByTestId(`${mockCarCreator.weaknesses[0]}-option-pill`);
    userEvent.click(weaknessPill);

    // Select a look
    const lookPill = screen.getByTestId(`${mockCarCreator.looks[0]}-option-pill`);
    userEvent.click(lookPill);

    // Select two battle options
    const speedOption = screen.getByTestId(`${mockCarCreator.battleOptions[0].name}-pill`);
    userEvent.click(speedOption);
    const speed = screen.getByRole('heading', { name: 'speed-value' }) as HTMLHeadingElement;
    expect(speed.textContent).toEqual('1');
    const armorOption = screen.getByTestId(`${mockCarCreator.battleOptions[3].name}-pill`);
    userEvent.click(armorOption);
    const armor = screen.getByRole('heading', { name: 'armor-value' }) as HTMLHeadingElement;
    expect(armor.textContent).toEqual('1');

    // Check SET enabled
    const setButton = screen.getByRole('button', { name: 'SET' }) as HTMLButtonElement;
    expect(setButton.disabled).toEqual(false);
  });
});
