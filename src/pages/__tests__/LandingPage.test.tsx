import React from 'react';
import { screen } from '@testing-library/react';

import LandingPage from '../LandingPage';
import { customRenderForComponent } from '../../tests/test-utils';

describe('Rendering LandingPage', () => {
  test('should render LandingPage with User unauthorised', () => {
    customRenderForComponent(<LandingPage />, {
      isAuthenticated: false,
    });

    const Box = screen.getByTestId('landing-page-box');
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toBeInTheDocument();
    expect(Box).toBeInTheDocument();
  });

  test('should render LandingPage with User authorised', () => {
    customRenderForComponent(<LandingPage />, {
      isAuthenticated: true,
    });

    const Box = screen.getByTestId('landing-page-box');
    expect(Box).toBeInTheDocument();
  });
});
