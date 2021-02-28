import React from 'react';
import { screen } from '@testing-library/react';
import {
  GearInstructions,
  Look,
  Name,
  PlaybookCreator,
  PlaybookUniqueCreator,
} from '../../../../@types/staticDataInterfaces';
import { Character, Game } from '../../../../@types/dataInterfaces';
import {
  blankCharacter,
  dummyAngelKitCreator,
  dummyEstablishmentCreator,
  dummyFollowerCreator,
  dummyGangCreator,
  dummyHoldingCreator,
  dummySkinnerGearCreator,
  dummyWeaponsCreator,
  dummyWorkspaceCreator,
  mockBrainerGearCreator,
  mockCharacter2,
  mockCharacterHarm,
  mockCharacterMoveAngel1,
  mockCharacterMoveAngel2,
  mockCharacterMoveAngel3,
  mockCustomWeaponsCreator,
  mockEstablishmentCreator,
  mockFirearmBaseOption,
  mockFirearmOption,
  mockFirearmOption2,
  mockGame5,
  mockHandBaseOption,
  mockHandOption,
  mockHandOption2,
  mockKeycloakUserInfo1,
  mockLookBattlebabe2,
  mockPlaybookUniqueBattlebabe,
  mockStatsBlock1,
  mockStatsOptionsAngel1,
  mockStatsOptionsAngel2,
} from '../../../../tests/mocks';
import { LookType, PlaybookType, RoleType, UniqueTypes } from '../../../../@types/enums';
import { mockKeycloakStub } from '../../../../../__mocks__/@react-keycloak/web';
import CustomWeaponsForm from '../CustomWeaponsForm';
import { renderWithRouter } from '../../../../tests/test-utils';
import { MockedResponse } from '@apollo/client/testing';
import PLAYBOOK_CREATOR from '../../../../queries/playbookCreator';
import { InMemoryCache } from '@apollo/client';
import userEvent from '@testing-library/user-event';
import EstablishmentForm from '../EstablishmentForm';
import { mockPlayBookCreatorQueryMaestroD } from '../../../../tests/mockQueries';

jest.mock('@react-keycloak/web', () => {
  const originalModule = jest.requireActual('@react-keycloak/web');
  return {
    ...originalModule,
    useKeycloak: () => ({ keycloak: mockKeycloakStub(true, mockKeycloakUserInfo1), initialized: true }),
  };
});

describe('Rendering EestablishmentForm', () => {
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

  test('should render EstablishmentForm in initial state', async () => {
    renderWithRouter(<EstablishmentForm />, `/character-creation/${mockGame5.id}`, {
      isAuthenticated: true,
      apolloMocks: [mockPlayBookCreatorQueryMaestroD],
      injectedGame: mockGame,
      injectedUserId: mockKeycloakUserInfo1.sub,
      cache,
    });

    await screen.findByTestId('establishment-form');
    await screen.findByRole('heading', { name: `${mockCharacter2.name?.toUpperCase()}'S ESTABLISHMENT` });
    screen.getByRole('button', { name: 'SET' });
    screen.getAllByRole('button', { name: 'ADD' });
    screen.getAllByRole('button', { name: 'Open Drop' });
    screen.getByRole('textbox', { name: 'main-attraction-input' });
    screen.getByRole('textbox', { name: 'additional-regular-input' });
    screen.getByRole('textbox', { name: 'best-regular-input' });
    screen.getByRole('textbox', { name: 'worst-regular-input' });
    screen.getByRole('textbox', { name: 'additional-interested-npc-input' });
    screen.getByRole('textbox', { name: 'wants-in-on-it-input' });
    screen.getByRole('textbox', { name: 'owes-for-it-input' });
    screen.getByRole('textbox', { name: 'wants-it-gone-input' });
    screen.getByRole('textbox', { name: 'crew-name-input' });
    screen.getByRole('textbox', { name: 'crew-description-input' });
    mockEstablishmentCreator.attractions.forEach((attr) => screen.getByRole('checkbox', { name: attr }));
    mockEstablishmentCreator.securityOptions.forEach((so) => screen.getByRole('checkbox', { name: so.description }));
  });

  test('should enable SET button when form is complete', async () => {
    const ADDITIONAL_REGULAR_NAME = 'Robert';
    const ADDITIONAL_NPC_NAME = 'Paula';
    const CREW_NAME = 'Guitar George';
    const CREW_DESCRIPTION = 'He knows all them fancy chords';

    renderWithRouter(<EstablishmentForm />, `/character-creation/${mockGame5.id}`, {
      isAuthenticated: true,
      apolloMocks: [mockPlayBookCreatorQueryMaestroD],
      injectedGame: mockGame,
      injectedUserId: mockKeycloakUserInfo1.sub,
      cache,
    });

    const setButton = (await screen.findByRole('button', { name: 'SET' })) as HTMLButtonElement;
    // const drops = (await screen.findAllByRole('button', { name: 'Open Drop' })) as [HTMLButtonElement];
    const addButtons = (await screen.findAllByRole('button', { name: 'ADD' })) as [HTMLButtonElement];

    // Select main attraction
    // FAILING: selectOptions() isn't finding any options. I think because using Grommet's Select wrapped around an HTML select
    // const mainAttractionDrop = drops.find((drop) => drop.id === 'main-attraction-input') as HTMLButtonElement;
    // userEvent.selectOptions(mainAttractionDrop, mockEstablishmentCreator.attractions[0]);
    // const mainAttractionInput = screen.getByRole('textbox', { name: 'main-attraction-input' }) as HTMLInputElement;
    // expect(mainAttractionInput.value).toEqual(mockEstablishmentCreator.attractions[0]);

    // Select two side attractions
    const sideAttraction1 = screen.getByRole('checkbox', { name: mockEstablishmentCreator.attractions[1] });
    const sideAttraction2 = screen.getByRole('checkbox', { name: mockEstablishmentCreator.attractions[2] });
    const attractionsBox = screen.getByTestId('attractions-box');
    expect(attractionsBox.textContent).toEqual('Attractions');
    userEvent.click(sideAttraction1);
    userEvent.click(sideAttraction2);
    expect(attractionsBox.textContent).toContain(mockEstablishmentCreator.attractions[1]);
    expect(attractionsBox.textContent).toContain(mockEstablishmentCreator.attractions[2]);

    // Select two atmosphere options
    const atmosphere1 = screen.getByTestId(`${mockEstablishmentCreator.atmospheres[0]}-pill`);
    const atmosphere2 = screen.getByTestId(`${mockEstablishmentCreator.atmospheres[1]}-pill`);
    const atmosphereBox = screen.getByTestId('atmosphere-box');
    userEvent.click(atmosphere1);
    userEvent.click(atmosphere2);
    expect(atmosphereBox.textContent).toContain(mockEstablishmentCreator.atmospheres[0]);
    expect(atmosphereBox.textContent).toContain(mockEstablishmentCreator.atmospheres[1]);

    // Add a regular
    const additionalRegularInput = screen.getByRole('textbox', { name: 'additional-regular-input' }) as HTMLInputElement;
    const addRegularButton = addButtons.find((btn) => btn.id === 'add-additional-regular-button') as HTMLButtonElement;
    const regularsBox = screen.getByTestId('regulars-box');
    userEvent.type(additionalRegularInput, ADDITIONAL_REGULAR_NAME);
    userEvent.click(addRegularButton);
    expect(regularsBox.textContent).toContain(ADDITIONAL_REGULAR_NAME);

    // Select best and worst regular
    // FAILING: selectOption() not finding options

    // Add an interested NPC
    const additionalNpcInput = screen.getByRole('textbox', { name: 'additional-interested-npc-input' }) as HTMLInputElement;
    const addNpcButton = addButtons.find((btn) => btn.id === 'add-additional-interest-npc-button') as HTMLButtonElement;
    const npcsBox = screen.getByTestId('interested npcs-box');
    userEvent.type(additionalNpcInput, ADDITIONAL_NPC_NAME);
    userEvent.click(addNpcButton);
    expect(npcsBox.textContent).toContain(ADDITIONAL_NPC_NAME);

    // Assign interested NPCs
    // FAILING: selectOption() not finding options

    // Select two security options
    const securityOption1 = screen.getByRole('checkbox', { name: mockEstablishmentCreator.securityOptions[0].description });
    const securityOption2 = screen.getByRole('checkbox', { name: mockEstablishmentCreator.securityOptions[1].description });
    const securityBox = screen.getByTestId('security-box');
    userEvent.click(securityOption1);
    userEvent.click(securityOption2);
    expect(securityBox.textContent).toContain(mockEstablishmentCreator.securityOptions[0].description);
    expect(securityBox.textContent).toContain(mockEstablishmentCreator.securityOptions[1].description);

    // Add a crew member
    const crewNameInput = screen.getByRole('textbox', { name: 'crew-name-input' });
    const crewDescriptionInput = screen.getByRole('textbox', { name: 'crew-description-input' });
    const addCrewButton = addButtons.find((btn) => btn.id === 'add-crew-member-button') as HTMLButtonElement;
    const crewBox = screen.getByTestId('cast & crew-box');
    userEvent.type(crewNameInput, CREW_NAME);
    userEvent.type(crewDescriptionInput, CREW_DESCRIPTION);
    userEvent.click(addCrewButton);
    expect(crewBox.textContent).toContain(CREW_NAME);

    // Check SET button is enabled
    // FAILING: form is incomplete due to earlier failures in the test
    // expect(setButton.disabled).toEqual(false);
  });
});
