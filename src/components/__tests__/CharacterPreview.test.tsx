import React from 'react';
// import wait from 'waait';
import { screen } from '@testing-library/react';

import CharacterPreview from '../CharacterPreview';
import { mockCharacter2 } from '../../tests/mocks';
import { customRenderForComponent } from '../../tests/test-utils';
import { decapitalize } from '../../helpers/decapitalize';

describe('Rendering CharacterPreview', () => {
  test('should render CharacterPreview for player', async () => {
    customRenderForComponent(<CharacterPreview character={mockCharacter2} isMc={false} />);

    screen.getByTestId('harm-clock');
    const name = screen.getByTestId('character-preview-name');
    expect(name.textContent).toEqual(`${mockCharacter2.name} the ${decapitalize(mockCharacter2.playbook)}`);
    const looks = screen.getByTestId('character-preview-looks');
    mockCharacter2.looks.forEach((look) => expect(looks.textContent).toContain(look.look));
  });

  test('should render CharacterPreview for MC', async () => {
    customRenderForComponent(<CharacterPreview character={mockCharacter2} isMc={true} />);

    screen.getByTestId('harm-clock');
    const stats = screen.getByTestId('character-preview-stats');
    mockCharacter2.statsBlock?.stats.forEach((stat) => stat.isHighlighted && expect(stats.textContent).toContain(stat.stat));
    const barter = screen.getByTestId('character-preview-barter');
    expect(barter.textContent).toContain(mockCharacter2.barter);
  });
});
