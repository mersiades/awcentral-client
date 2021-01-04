import React from 'react';
import { render } from '../../utils/test-utils';
import { screen } from '@testing-library/react';
import LandingPage from '../LandingPage';
import TestRoot from '../../tests/TestRoot';

describe('Rendering LandingPage', () => {
  test('should render LandingPage with User unauthorised', () => {
    render(
      <TestRoot keycloakStubOptions={{ isAuthenticated: false }}>
        <LandingPage />
      </TestRoot>
    );

    const Box = screen.getByTestId('landing-page-box');
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toBeInTheDocument();
    expect(Box).toBeInTheDocument();
  });

  test('should render LandingPage with User authorised', () => {
    render(
      <TestRoot>
        <LandingPage />
      </TestRoot>
    );

    const Box = screen.getByTestId('landing-page-box');
    expect(Box).toBeInTheDocument();
  });
});
