import React from 'react';
import { screen } from '@testing-library/react';

import Holds from '../Holds';
import { mockHolds } from '../../tests/mocks';
import { customRenderForComponent } from '../../tests/test-utils';

describe('Rendering Holds', () => {
  beforeEach(async () => {
    customRenderForComponent(<Holds holds={mockHolds} />);
  });

  test('should render three holds', () => {
    screen.getByRole('heading', { name: 'Holds' });
    const holds = screen.getAllByTestId('hold-circle');
    expect(holds.length).toEqual(3);
  });
});
