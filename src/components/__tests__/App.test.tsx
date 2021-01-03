import React from 'react';
import { render } from '../../utils/test-utils';
import { screen } from '@testing-library/react';
import App from '../App';
import TestRoot from '../../tests/TestRoot';

test('renders nothing worth testing yet', () => {
  const { getByText } = render(
    <TestRoot>
      <App />
    </TestRoot>
  );
});
