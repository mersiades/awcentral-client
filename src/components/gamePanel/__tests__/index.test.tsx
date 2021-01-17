import React from 'react';
// import wait from 'waait';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { customRenderForComponent } from '../../../tests/test-utils';
import { mockCharacter2, mockPlaybookAngel } from '../../../tests/mocks';
import { mockPlaybook } from '../../../tests/mockQueries';
import { decapitalize } from '../../../helpers/decapitalize';
import GamePanel from '../';
import { MoveKinds } from '../../../@types/enums';

describe('Rendering GamePanel', () => {
  test('should render ...', async () => {
    customRenderForComponent(
      <GamePanel
        setShowDeleteGameDialog={jest.fn()}
        setShowCommsForm={jest.fn()}
        setShowInvitationForm={jest.fn()}
        handleRemoveInvitee={jest.fn()}
      />,
      {
        isAuthenticated: true,
        apolloMocks: [mockPlaybook],
      }
    );
  });
});
