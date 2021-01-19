import React from 'react';
// import wait from 'waait';
import { screen } from '@testing-library/react';

import { customRenderForComponent } from '../../tests/test-utils';
import { mockAllMovesArray } from '../../tests/mocks';
import { mockPlaybook } from '../../tests/mockQueries';
import { decapitalize } from '../../helpers/decapitalize';
import { MoveType } from '../../@types/enums';
import MovesPanel from '../MovesPanel';

describe('Rendering MovesPanel', () => {
  test('should render MovesPanel properly', () => {
    customRenderForComponent(<MovesPanel allMoves={mockAllMovesArray} />, {
      isAuthenticated: true,
      apolloMocks: [mockPlaybook],
    });

    screen.getByRole('heading', { name: `${decapitalize(MoveType.basic)} moves` });
    screen.getByRole('heading', { name: `${decapitalize(MoveType.peripheral)} moves` });
    screen.getByRole('heading', { name: `${decapitalize(MoveType.battle)} moves` });
    screen.getByRole('heading', { name: `${decapitalize(MoveType.roadWar)} moves` });
  });
});
