import React from 'react';
// import wait from 'waait';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { customRenderForComponent } from '../../tests/test-utils';
import { mockAllMovesArray, mockCharacter2, mockPlaybookAngel } from '../../tests/mocks';
import { mockPlaybook } from '../../tests/mockQueries';
import { decapitalize } from '../../helpers/decapitalize';
import { MoveKinds } from '../../@types/enums';
import MovesPanel from '../MovesPanel';

describe('Rendering MovesPanel', () => {
  test('should render MovesPanel properly', () => {
    customRenderForComponent(<MovesPanel allMoves={mockAllMovesArray} />, {
      isAuthenticated: true,
      apolloMocks: [mockPlaybook],
    });

    screen.getByRole('heading', { name: `${decapitalize(MoveKinds.basic)} moves` });
    screen.getByRole('heading', { name: `${decapitalize(MoveKinds.peripheral)} moves` });
    screen.getByRole('heading', { name: `${decapitalize(MoveKinds.battle)} moves` });
    screen.getByRole('heading', { name: `${decapitalize(MoveKinds.roadWar)} moves` });
  });
});
