import React from 'react';
import { render } from '../../utils/test-utils';
import { screen } from '@testing-library/react';
import LandingPage from '../LandingPage';
import TestRoot from '../../tests/TestRoot';

jest.mock('../../utils/generateRandomString');

describe('Rendering Landing Page', () => {
  test('should render LandingPage in initial state', async () => {
    render(
      <TestRoot>
        <LandingPage />
      </TestRoot>
    );

    const Box = await screen.findByTestId('landing-page-box');
    expect(Box).toBeInTheDocument();
    jest.clearAllMocks();
  });
});
