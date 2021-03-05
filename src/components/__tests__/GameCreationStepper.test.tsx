import React from 'react';
import userEvent from '@testing-library/user-event';
// import wait from 'waait';
import { screen } from '@testing-library/react';

import GameCreationStepper from '../GameCreationStepper';
import { mockGame1 } from '../../tests/mocks';
import { renderWithRouter } from '../../tests/test-utils';

describe('Rendering GameCreationStepper', () => {
  const mockSetCreationStep = jest.fn();
  const mockSetHasSkippedComms = jest.fn();

  beforeEach(async () => {
    renderWithRouter(
      <GameCreationStepper
        currentStep={0}
        setCreationStep={mockSetCreationStep}
        setHasSkippedComms={mockSetHasSkippedComms}
        game={{ ...mockGame1, commsApp: '', commsUrl: '' }}
      />,
      `/create-game/${mockGame1.id}`
    );
  });

  test('should render GameCreationStepper in initial state', () => {
    const nameBox = screen.getByTestId('name-box');
    expect(nameBox.textContent).toContain(mockGame1.name);
    const channelBox = screen.getByTestId('channel-box');
    expect(channelBox.textContent).toContain('...');
    const invitationsBox = screen.getByTestId('invitations-box');
    expect(invitationsBox.textContent).toContain('...');
  });
});
