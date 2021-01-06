import React from 'react';
import { customRenderForComponent, render } from '../../tests/test-utils';
import { screen } from '@testing-library/react';
import LandingPage from '../LandingPage';

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
