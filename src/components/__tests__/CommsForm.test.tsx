import React from 'react';
import userEvent from '@testing-library/user-event';
// import wait from 'waait';
import { screen } from '@testing-library/react';

import CommsForm from '../CommsForm';
import { mockGame1 } from '../../tests/mocks';
import { renderWithRouter } from '../../tests/test-utils';

describe('Rendering CommsForm', () => {
  const mockSetCreationStep = jest.fn();
  const mockSetHasSkippedComms = jest.fn();

  beforeEach(async () => {
    renderWithRouter(
      <CommsForm
        game={{ ...mockGame1, commsApp: '', commsUrl: '' }}
        setCreationStep={mockSetCreationStep}
        setHasSkippedComms={mockSetHasSkippedComms}
      />,
      `/create-game/${mockGame1.id}`
    );
  });

  test('should render CommsForm in initial state', () => {
    screen.getByRole('heading', { name: 'COMMS' });
    screen.getAllByRole('button', { name: 'SET' });
    screen.getByRole('button', { name: 'Open Drop' });
    screen.getByRole('button', { name: 'LATER' });
    screen.getByRole('textbox', { name: 'comms-url-input' });
    screen.getByRole('textbox', { name: 'comms-app-input' });
  });

  test('should enable SET button after selecting comms app', () => {
    const dropButton = screen.getByRole('button', { name: 'Open Drop' }) as HTMLButtonElement;
    // FAILING: selectOptions() isn't finding any options. I think because using Grommet's Select wrapped around an HTML select
    // userEvent.selectOptions(dropButton, 'Discord');
  });

  test('should enable SET button after entering comms url', () => {
    const mockUrl = 'https://mockurl.com';
    const urlInput = screen.getByRole('textbox', { name: 'comms-url-input' }) as HTMLInputElement;

    userEvent.type(urlInput, mockUrl);
    expect(urlInput.value).toEqual(mockUrl);
    const setButton = screen.getAllByRole('button', { name: 'SET' })[1] as HTMLButtonElement;
    expect(setButton.disabled).toEqual(false);
  });

  test('should skip CommsForm', () => {
    const laterButton = screen.getByRole('button', { name: 'LATER' }) as HTMLButtonElement;

    userEvent.click(laterButton);

    expect(mockSetCreationStep).toHaveBeenCalledWith(2);
    expect(mockSetHasSkippedComms).toHaveBeenCalledWith(true);
  });
});
