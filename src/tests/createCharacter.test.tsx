import React from 'react';
// import wait from 'waait';
import { cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../components/App';
import { renderWithRouter } from './test-utils';
import { mockKeycloakStub } from '../../__mocks__/@react-keycloak/web';
import { mockCharacter1, mockCharacter2, mockGame5, mockKeycloakUserInfo, mockPlaybookCreatorAngel } from './mocks';
import {
  mockCreateCharacter,
  mockfinishCharacterCreation,
  mockGameForCharacterCreation1,
  mockGameForCharacterCreation10,
  mockGameForCharacterCreation11,
  mockGameForCharacterCreation12,
  mockGameForCharacterCreation13,
  mockGameForCharacterCreation14,
  mockGameForCharacterCreation15,
  mockGameForCharacterCreation2,
  mockGameForCharacterCreation3,
  mockGameForCharacterCreation4,
  mockGameForCharacterCreation5,
  mockGameForCharacterCreation6,
  mockGameForCharacterCreation7,
  mockGameForCharacterCreation8,
  mockGameForCharacterCreation9,
  mockPlaybookCreator,
  mockPlaybooksQuery,
  mockSetAngelKit,
  mockSetCharacterGear,
  mockSetCharacterHx,
  mockSetCharacterLook1,
  mockSetCharacterLook2,
  mockSetCharacterLook3,
  mockSetCharacterLook4,
  mockSetCharacterLook5,
  mockSetCharacterMoves,
  mockSetCharacterName,
  mockSetCharacterPlaybook,
  mockSetCharacterStats,
} from './mockQueries';

jest.mock('@react-keycloak/web', () => {
  const originalModule = jest.requireActual('@react-keycloak/web');
  return {
    ...originalModule,
    useKeycloak: () => ({ keycloak: mockKeycloakStub(true, mockKeycloakUserInfo), initialized: true }),
  };
});

describe('Testing character creation flow', () => {
  afterEach(cleanup);

  test('should create an ANGEL character - part 1', async () => {
    renderWithRouter(<App />, `/character-creation/${mockGame5.id}`, {
      isAuthenticated: true,
      apolloMocks: [
        mockGameForCharacterCreation1,
        mockPlaybooksQuery,
        mockCreateCharacter,
        mockSetCharacterPlaybook,
        mockGameForCharacterCreation2,
        mockPlaybookCreator,
        mockSetCharacterName,
        mockGameForCharacterCreation3,
        mockSetCharacterLook1,
        mockGameForCharacterCreation4,
        mockSetCharacterLook2,
        mockGameForCharacterCreation5,
        mockSetCharacterLook3,
        mockGameForCharacterCreation6,
        mockSetCharacterLook4,
        mockGameForCharacterCreation7,
        mockSetCharacterLook5,
        mockGameForCharacterCreation8,
        mockSetCharacterStats,
        mockGameForCharacterCreation9,
      ],
    });

    await screen.findAllByTestId('character-creation-page');

    // ------------------------------------------------ NewGameIntro ------------------------------------------------ //
    // Check comms channel has been rendered
    const commsLink = screen.getByRole('link', { name: mockGame5.commsApp });
    expect(commsLink.getAttribute('href')).toEqual(mockGame5.commsUrl);

    // Click NEXT to go to CharacterPlaybookForm
    userEvent.click(screen.getByRole('button', { name: /NEXT/i }));

    // -------------------------------------------- CharacterPlaybookForm -------------------------------------------- //
    // Click on ANGEL image to reveal Angel introduction
    userEvent.click(screen.getByTestId('angel-button'));

    const selectAngelButton = await screen.findByRole('button', { name: /SELECT ANGEL/i });

    // Click SELECT ANGEL
    userEvent.click(selectAngelButton);

    // ---------------------------------------------- CharacterNameForm ---------------------------------------------- //
    const playbookBox = await screen.findByTestId('playbook-box');

    expect(playbookBox.textContent).toContain('Angel');

    // Check that CharacterNameForm is open
    await screen.findByRole('heading', { name: `WHAT IS THE ANGEL CALLED?` });

    // @ts-ignore
    expect(screen.getByRole('textbox').value).toEqual('');

    // Click on a name pill and check input value
    userEvent.click(screen.getByTestId(`${mockPlaybookCreatorAngel.names[0].name}-pill`));
    // @ts-ignore
    expect(screen.getByRole('textbox').value).toEqual(mockPlaybookCreatorAngel.names[0].name);

    // Clear clear to clear value from input
    userEvent.click(screen.getByRole('button', { name: /CLEAR/i }));
    // @ts-ignore
    expect(screen.getByRole('textbox').value).toEqual('');

    // Type a character name instead
    userEvent.type(screen.getByRole('textbox'), mockCharacter2.name as string);
    // @ts-ignore
    expect(screen.getByRole('textbox').value).toEqual(mockCharacter2.name);

    // Click SET to submit name
    userEvent.click(screen.getByRole('button', { name: /SET/i }));

    // --------------------------------------------- CharacterLooksForm --------------------------------------------- //
    // Check that CharacterLooksForm is open
    await screen.findByRole('heading', { name: `WHAT DOES ${mockCharacter2.name?.toUpperCase()} LOOK LIKE?` });
    expect(screen.getByTestId('name-box').textContent).toContain(mockCharacter2.name);
    // @ts-ignore
    expect(screen.getByRole('textbox').value).toEqual('');

    // Click on pill for a gender look
    userEvent.click(screen.getByTestId(`${mockPlaybookCreatorAngel.looks[0].look}-pill`));

    // @ts-ignore
    expect(screen.getByRole('textbox').value).toEqual(mockPlaybookCreatorAngel.looks[0].look);

    // Click SET to submit gender look
    userEvent.click(screen.getByRole('button', { name: /SET/i }));

    // Check gender look added to CharacterCreationStepper
    let looksBox = await screen.findByTestId('looks-box');
    expect(looksBox.textContent).toContain(mockPlaybookCreatorAngel.looks[0].look);
    // @ts-ignore
    expect(screen.getByRole('textbox').value).toEqual('');

    // Click on pill for a clothes look
    userEvent.click(screen.getByTestId(`${mockPlaybookCreatorAngel.looks[2].look}-pill`));
    // @ts-ignore
    expect(screen.getByRole('textbox').value).toEqual(mockPlaybookCreatorAngel.looks[2].look);

    // Click SET to submit clothes look
    userEvent.click(screen.getByRole('button', { name: /SET/i }));

    // Check clothes look added to CharacterCreationStepper
    looksBox = await screen.findByTestId('looks-box');
    expect(looksBox.textContent).toContain(mockPlaybookCreatorAngel.looks[2].look);

    // Click on pill for a face look
    userEvent.click(screen.getByTestId(`${mockPlaybookCreatorAngel.looks[4].look}-pill`));
    // @ts-ignore
    expect(screen.getByRole('textbox').value).toEqual(mockPlaybookCreatorAngel.looks[4].look);

    // Click SET to submit face look
    userEvent.click(screen.getByRole('button', { name: /SET/i }));

    // Check face look added to CharacterCreationStepper
    looksBox = await screen.findByTestId('looks-box');
    expect(looksBox.textContent).toContain(mockPlaybookCreatorAngel.looks[4].look);

    // Click on pill for a eyes look
    userEvent.click(screen.getByTestId(`${mockPlaybookCreatorAngel.looks[6].look}-pill`));
    // @ts-ignore
    expect(screen.getByRole('textbox').value).toEqual(mockPlaybookCreatorAngel.looks[6].look);

    // Click SET to submit eyes look
    userEvent.click(screen.getByRole('button', { name: /SET/i }));

    // Check eyes look added to CharacterCreationStepper
    looksBox = await screen.findByTestId('looks-box');
    expect(looksBox.textContent).toContain(mockPlaybookCreatorAngel.looks[6].look);

    // Click on pill for a body look
    userEvent.click(screen.getByTestId(`${mockPlaybookCreatorAngel.looks[8].look}-pill`));
    // @ts-ignore
    expect(screen.getByRole('textbox').value).toEqual(mockPlaybookCreatorAngel.looks[8].look);

    // Click SET to submit body look
    userEvent.click(screen.getByRole('button', { name: /SET/i }));

    // Check body look added to CharacterCreationStepper
    looksBox = await screen.findByTestId('looks-box');
    expect(looksBox.textContent).toContain(mockPlaybookCreatorAngel.looks[8].look);

    // --------------------------------------------- CharacterStatsForm --------------------------------------------- //
    // Check CharacterStatsForm is open
    screen.getByRole('heading', { name: `WHAT ARE ${mockCharacter2.name?.toUpperCase()}'S STRENGTHS AND WEAKNESSES?` });

    // Check correct number of stats options
    //(3 mock statsOptions sets, each with 5 stats.
    // Each stat has a heading for the stat and the number)
    // Plus two more heading for the form semantic headings
    // (3 * 5 * 2) + 2 = 32
    expect(screen.getAllByRole('heading').length).toEqual(mockPlaybookCreatorAngel.statsOptions.length * 5 * 2 + 2);

    // Click on a statsOption set
    userEvent.click(screen.getByTestId(`${mockPlaybookCreatorAngel.statsOptions[0].id}-stats-option-box`));

    // Click SET to set the statsOption
    userEvent.click(screen.getByRole('button', { name: /SET/i }));

    // Check correct stats added to CharacterCreationStepper
    await screen.findByTestId('stats-box'); // I have to do this twice because the statsBox shifts to the left
    const statsBox = await screen.findByTestId('stats-box');
    mockCharacter2.statsBlock.forEach((stat) =>
      expect(statsBox.textContent).toContain(`${stat.stat} ${'--'.repeat(8 - stat.stat.length)} ${stat.value}`)
    );

    // --------------------------------------------- CharacterGearForm --------------------------------------------- //
    // Check CharacterGearForm is open
    screen.getByRole('heading', { name: `WHAT IS ${mockCharacter2.name?.toUpperCase()}'S GEAR?` });
  });

  test('should create an ANGEL character - part 2', async () => {
    renderWithRouter(<App />, `/character-creation/${mockGame5.id}`, {
      isAuthenticated: true,
      apolloMocks: [
        mockPlaybookCreator,
        mockGameForCharacterCreation9,
        mockSetCharacterGear,
        mockGameForCharacterCreation10,
        mockSetAngelKit,
        mockGameForCharacterCreation11,
        mockSetCharacterMoves,
        mockGameForCharacterCreation12,
        mockSetCharacterHx,
        mockGameForCharacterCreation13,
        mockGameForCharacterCreation14,
        mockfinishCharacterCreation,
        mockGameForCharacterCreation15,
      ],
    });

    // --------------------------------------------- CharacterGearForm --------------------------------------------- //
    // Check CharacterGearForm is open
    await screen.findByRole('heading', { name: `WHAT IS ${mockCharacter2.name?.toUpperCase()}'S GEAR?` });

    // CLick on an item in the options list
    userEvent.click(screen.getByTestId(`${mockPlaybookCreatorAngel.gearInstructions.youGetItems[0]}-listitem`));
    // @ts-ignore
    expect(screen.getByRole('textbox').value).toEqual(mockPlaybookCreatorAngel.gearInstructions.youGetItems[0]);

    // "Select all" on the fashion item in the text box
    let input = screen.getByRole('textbox');
    // @ts-ignore
    input.setSelectionRange(0, input.value.length);

    // Manually type a better fashion option
    userEvent.type(input, mockCharacter2.gear[0]);
    // @ts-ignore
    expect(screen.getByRole('textbox').value).toEqual(mockCharacter2.gear[0]);

    // Click ADD to add the item to the interim list
    userEvent.click(screen.getByRole('button', { name: /ADD/i }));
    expect(screen.getByTestId('interim-gear-list').textContent).toContain(mockCharacter2.gear[0]);

    // Add an item from the chooseable gear list
    userEvent.click(
      screen.getByTestId(`${mockPlaybookCreatorAngel.gearInstructions.chooseableGear[0]}-chooseable-listitem`)
    );
    // @ts-ignore
    expect(screen.getByRole('textbox').value).toEqual(mockPlaybookCreatorAngel.gearInstructions.chooseableGear[0]);

    // Click ADD to add the item to the interim list
    userEvent.click(screen.getByRole('button', { name: /ADD/i }));
    expect(screen.getByTestId('interim-gear-list').textContent).toContain(mockCharacter2.gear[0]);
    expect(screen.getByTestId('interim-gear-list').textContent).toContain(
      mockPlaybookCreatorAngel.gearInstructions.chooseableGear[0]
    );
    // @ts-ignore
    expect(screen.getByRole('textbox').value).toEqual('');

    // Remove an item from the interim gear list
    userEvent.click(screen.getByTestId(`${mockPlaybookCreatorAngel.gearInstructions.chooseableGear[0]}-interim-listitem`));
    // @ts-ignore
    expect(screen.getByRole('textbox').value).toEqual(mockPlaybookCreatorAngel.gearInstructions.chooseableGear[0]);
    userEvent.click(screen.getByRole('button', { name: /REMOVE/i }));
    // @ts-ignore
    expect(screen.getByRole('textbox').value).toEqual('');
    expect(screen.getByTestId('interim-gear-list').textContent).not.toContain(
      mockPlaybookCreatorAngel.gearInstructions.chooseableGear[0]
    );

    // Add a different chooseable option item
    userEvent.click(
      screen.getByTestId(`${mockPlaybookCreatorAngel.gearInstructions.chooseableGear[1]}-chooseable-listitem`)
    );
    // @ts-ignore
    expect(screen.getByRole('textbox').value).toEqual(mockPlaybookCreatorAngel.gearInstructions.chooseableGear[1]);

    // Click ADD to add the item to the interim list
    userEvent.click(screen.getByRole('button', { name: /ADD/i }));
    expect(screen.getByTestId('interim-gear-list').textContent).toContain(mockCharacter2.gear[0]);
    expect(screen.getByTestId('interim-gear-list').textContent).toContain(
      mockPlaybookCreatorAngel.gearInstructions.chooseableGear[1]
    );

    // Click SET to set the gear
    userEvent.click(screen.getByRole('button', { name: /SET/i }));

    // ----------------------------------------------- AngelKitForm ----------------------------------------------- //
    // Check AngelKitform is open and gear correctly rendered
    await screen.findByRole('heading', { name: `${mockCharacter2.name?.toUpperCase()}'S ANGEL KIT` });
    const gearBox = await screen.findByTestId('gear-box');
    expect(gearBox.textContent).toContain(mockCharacter2.gear[0]);
    expect(gearBox.textContent).toContain(mockCharacter2.gear[1]);

    // Click SET
    userEvent.click(screen.getByRole('button', { name: /SET/i }));

    const angelKitBox = await screen.findByTestId('angel-kit-box');
    expect(angelKitBox.textContent).toContain('6');
    expect(angelKitBox.textContent).toContain('No supplier yet');

    // -------------------------------------------- CharacterMovesForm -------------------------------------------- //
    // Check CharacterMovesForm is open
    await screen.findByRole('heading', { name: `WHAT ARE ${mockCharacter2.name?.toUpperCase()}'S MOVES?` });
    expect(screen.getByRole('button', { name: /SET/ }).getAttribute('disabled')).toBeDefined();
    // Check that ANGEL SPECIAL move is already checked
    expect(screen.getByRole('checkbox', { name: /ANGEL SPECIAL/ }).getAttribute('checked')).toBeDefined();

    // Check that ANGEL SPECIAL can't be unchecked
    userEvent.click(screen.getByRole('checkbox', { name: /ANGEL SPECIAL/ }));
    expect(screen.getByRole('checkbox', { name: /ANGEL SPECIAL/ }).getAttribute('checked')).toBeDefined();

    // Choose two more moves
    userEvent.click(screen.getByRole('checkbox', { name: /SIXTH SENSE/ }));
    userEvent.click(screen.getByRole('checkbox', { name: /INFIRMARY/ }));

    // Click SET
    userEvent.click(screen.getByRole('button', { name: /SET/ }));

    // -------------------------------------------- CharacterHxForm -------------------------------------------- //
    await screen.findByRole('heading', { name: /HISTORY/ });
    const movesBox = await screen.findByTestId('moves-box');
    mockCharacter2.characterMoves?.forEach((move) => expect(movesBox.textContent?.toUpperCase()).toContain(move.name));

    // Check character box is rendered properly
    screen.getByTestId(`${mockCharacter1.name}-hx-box`);
    // @ts-ignore
    expect(screen.getByRole('spinbutton').value).toEqual('0');

    // Adjust Hx value
    input = screen.getByRole('spinbutton');
    userEvent.type(input, '{selectAll}{backspace}');
    userEvent.type(input, '1');
    // @ts-ignore
    expect(screen.getByRole('spinbutton').value).toEqual('1');

    // Click SET
    userEvent.click(screen.getByRole('button', { name: /SET/ }));
    const goButton = await screen.findByRole('button', { name: /GO TO GAME/ });

    // Click GO button to finish character creation and go to PlayerPage
    userEvent.click(goButton);

    // Check that PlayerPage is open
    screen.findByTestId('player-page');
    // await screen.findByTestId('player-page');
  });
});
