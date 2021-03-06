import React from 'react';
import userEvent from '@testing-library/user-event';
// import wait from 'waait';
import { InMemoryCache } from '@apollo/client';
import { screen } from '@testing-library/react';

import HoldingForm from '../HoldingForm';
import { mockKeycloakStub } from '../../../../../__mocks__/@react-keycloak/web';
import {
  blankCharacter,
  holdingOption1,
  mockCharacter2,
  mockGame5,
  mockHoldingCreator,
  mockKeycloakUserInfo1,
} from '../../../../tests/mocks';
import { renderWithRouter } from '../../../../tests/test-utils';
import { mockPlayBookCreatorQueryHardHolder } from '../../../../tests/mockQueries';

jest.mock('@react-keycloak/web', () => {
  const originalModule = jest.requireActual('@react-keycloak/web');
  return {
    ...originalModule,
    useKeycloak: () => ({ keycloak: mockKeycloakStub(true, mockKeycloakUserInfo1), initialized: true }),
  };
});

describe('Rendering HoldingForm', () => {
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

  test('should render HoldingForm in intial state', async () => {
    renderWithRouter(<HoldingForm />, `/character-creation/${mockGame5.id}`, {
      isAuthenticated: true,
      apolloMocks: [mockPlayBookCreatorQueryHardHolder],
      injectedGame: mockGame,
      injectedUserId: mockKeycloakUserInfo1.sub,
      cache,
    });

    await screen.findByTestId('holding-form');
    await screen.findByRole('heading', { name: `${mockCharacter2.name?.toUpperCase()}'S HOLDING` });
    const holdingSize = screen.getByRole('heading', { name: 'holding size-value' });
    expect(holdingSize.textContent).toEqual(mockHoldingCreator.defaultHoldingSize);
    const gangSize = screen.getByRole('heading', { name: 'gang size-value' });
    expect(gangSize.textContent).toEqual(mockHoldingCreator.defaultGangSize);
    const surplusValue = screen.getByRole('heading', { name: 'surplus-value' });
    expect(surplusValue.textContent).toContain(mockHoldingCreator.defaultSurplus.toString());
    const defenseBonusValue = screen.getByRole('heading', { name: 'defense bonus-value' });
    expect(defenseBonusValue.textContent).toContain(mockHoldingCreator.defaultArmorBonus.toString());
    const harmValue = screen.getByRole('heading', { name: 'harm-value' });
    expect(harmValue.textContent).toEqual(mockHoldingCreator.defaultGangHarm.toString());
    const armorValue = screen.getByRole('heading', { name: 'armor-value' });
    expect(armorValue.textContent).toEqual(mockHoldingCreator.defaultGangArmor.toString());
    const checkBoxes = screen.getAllByRole('checkbox');
    expect(checkBoxes.length).toEqual(6);
    screen.getByRole('button', { name: 'SET' });
  });

  test('should enable SET button when form is complete', async () => {
    renderWithRouter(<HoldingForm />, `/character-creation/${mockGame5.id}`, {
      isAuthenticated: true,
      apolloMocks: [mockPlayBookCreatorQueryHardHolder],
      injectedGame: mockGame,
      injectedUserId: mockKeycloakUserInfo1.sub,
      cache,
    });

    let setButton = (await screen.findByRole('button', { name: 'SET' })) as HTMLButtonElement;
    const strength1 = await screen.findByRole('checkbox', { name: mockHoldingCreator.strengthOptions[0].description });
    const strength2 = screen.getByRole('checkbox', { name: mockHoldingCreator.strengthOptions[1].description });
    const strength3 = screen.getByRole('checkbox', { name: mockHoldingCreator.strengthOptions[2].description });
    const strength4 = screen.getByRole('checkbox', { name: mockHoldingCreator.strengthOptions[3].description });
    const weakness1 = screen.getByRole('checkbox', { name: mockHoldingCreator.weaknessOptions[0].description });
    const weakness2 = screen.getByRole('checkbox', { name: mockHoldingCreator.weaknessOptions[1].description });

    // Select first strength
    userEvent.click(strength1);
    const holdingSizeBox = screen.getByRole('heading', { name: 'holding size-value' });
    expect(holdingSizeBox.textContent).toEqual(holdingOption1.newHoldingSize);
    const wantsBox = screen.getByTestId('wants-tags-box');
    expect(wantsBox.textContent).toContain('disease');

    // Select second strength
    userEvent.click(strength2);
    const surplusValue = screen.getByRole('heading', { name: 'surplus-value' });
    expect(surplusValue.textContent).toContain('3');
    expect(wantsBox.textContent).toContain('strangers');
    const gigsBox = screen.getByTestId('gigs-tags-box');
    expect(gigsBox.textContent).toContain('market commons');

    // Select third strength
    userEvent.click(strength3);
    const tagsBox = screen.getByTestId('tags-tags-box');
    expect(tagsBox.textContent).toEqual('Tags');

    // Select fourth strength
    userEvent.click(strength4);
    const harmValue = screen.getByRole('heading', { name: 'harm-value' });
    expect(harmValue.textContent).toEqual('3');
    setButton = screen.getByRole('button', { name: 'SET' }) as HTMLButtonElement;
    expect(setButton.disabled).toEqual(true);

    // Select first weakness
    userEvent.click(weakness1);
    expect(surplusValue.textContent).toContain('2');
    expect(wantsBox.textContent).toContain('savagery');

    // Select second weakness
    userEvent.click(weakness2);
    // No screen updates to check for with weakness2 (it updates vehicle counts)

    // Check SET button is enabled
    setButton = screen.getByRole('button', { name: 'SET' }) as HTMLButtonElement;
    expect(setButton.disabled).toEqual(false);
  });
});
