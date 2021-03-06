import React from 'react';
import { act, screen } from '@testing-library/react';
import {
  blankCharacter,
  mockCharacter2,
  mockFollowersCreator,
  mockGame5,
  mockKeycloakUserInfo1,
  mockUniqueCreatorHocus,
} from '../../../../tests/mocks';
import { mockKeycloakStub } from '../../../../../__mocks__/@react-keycloak/web';
import { renderWithRouter } from '../../../../tests/test-utils';
import { InMemoryCache } from '@apollo/client';
import userEvent from '@testing-library/user-event';
import FollowersForm from '../FollowersForm';
import { mockPlayBookCreatorQueryHocus } from '../../../../tests/mockQueries';
import wait from 'waait';

jest.mock('@react-keycloak/web', () => {
  const originalModule = jest.requireActual('@react-keycloak/web');
  return {
    ...originalModule,
    useKeycloak: () => ({ keycloak: mockKeycloakStub(true, mockKeycloakUserInfo1), initialized: true }),
  };
});

describe('Rendering FollowersForm', () => {
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

  test('should render FollowersForm in initial state', async () => {
    renderWithRouter(<FollowersForm />, `/character-creation/${mockGame5.id}`, {
      isAuthenticated: true,
      apolloMocks: [mockPlayBookCreatorQueryHocus],
      injectedGame: mockGame,
      injectedUserId: mockKeycloakUserInfo1.sub,
      cache,
    });

    await screen.findByTestId('followers-form');
    await screen.findByRole('heading', { name: `${mockCharacter2.name?.toUpperCase()}'S FOLLOWERS` });
    mockFollowersCreator.travelOptions.forEach((opt) => screen.getByRole('checkbox', { name: opt }));
    mockFollowersCreator.strengthOptions.forEach((opt) => screen.getByRole('checkbox', { name: opt.description }));
    mockFollowersCreator.weaknessOptions.forEach((opt) => screen.getByRole('checkbox', { name: opt.description }));
    mockFollowersCreator.characterizationOptions.forEach((opt) => screen.getByTestId(`${opt}-pill`));
    const fortuneValue = screen.getByRole('heading', { name: 'fortune-value' }) as HTMLHeadingElement;
    expect(fortuneValue.textContent).toContain('1');
    screen.getByRole('button', { name: 'SET' });
  });

  test('should enable SET button after completing the form', async () => {
    renderWithRouter(<FollowersForm />, `/character-creation/${mockGame5.id}`, {
      isAuthenticated: true,
      apolloMocks: [mockPlayBookCreatorQueryHocus],
      injectedGame: mockGame,
      injectedUserId: mockKeycloakUserInfo1.sub,
      cache,
    });

    let setButton = (await screen.findByRole('button', { name: 'SET' })) as HTMLButtonElement;
    expect(setButton.disabled).toEqual(true);

    // Select characterization
    const characterization = await screen.findByTestId(`${mockFollowersCreator.characterizationOptions[0]}-pill`);
    userEvent.click(characterization);
    const descriptionBox = screen.getByTestId('description-tags-box');
    expect(descriptionBox.textContent?.toLowerCase()).toContain(mockFollowersCreator.characterizationOptions[0]);

    // Select travel option
    const travelOption = screen.getByRole('checkbox', { name: mockFollowersCreator.travelOptions[0] });
    userEvent.click(travelOption);
    expect(descriptionBox.textContent?.toLowerCase()).toContain(mockFollowersCreator.travelOptions[0]);

    // Select two strengths
    const strength1 = screen.getByRole('checkbox', { name: mockFollowersCreator.strengthOptions[0].description });
    const strength2 = screen.getByRole('checkbox', { name: mockFollowersCreator.strengthOptions[1].description });
    const surplusBox = screen.getByTestId('surplus-tags-box');
    const wantBox = screen.getByTestId('want-tags-box');
    expect(wantBox.textContent).toContain('desertion');
    expect(surplusBox.textContent).toContain('1');
    userEvent.click(strength1);
    expect(surplusBox.textContent).toContain('2');
    expect(wantBox.textContent).toContain('hungry');
    userEvent.click(strength2);
    expect(surplusBox.textContent).toContain('insight');

    // Select two weaknesses
    const weakness1 = screen.getByRole('checkbox', { name: mockFollowersCreator.weaknessOptions[0].description });
    const weakness2 = screen.getByRole('checkbox', { name: mockFollowersCreator.weaknessOptions[1].description });
    userEvent.click(weakness1);
    expect(surplusBox.textContent).toContain('violence');
    userEvent.click(weakness2);
    expect(surplusBox.textContent).toContain('1');

    // Check SET button is enabled
    setButton = (await screen.findByRole('button', { name: 'SET' })) as HTMLButtonElement;
    expect(setButton.disabled).toEqual(false);
  });
});
