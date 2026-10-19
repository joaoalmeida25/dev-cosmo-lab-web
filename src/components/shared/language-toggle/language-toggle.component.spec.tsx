import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderLocalized } from '../../../../test/render-localized';
import { LanguageToggle } from './language-toggle.component';
import pt from '@/messages/pt-BR/common.json';

vi.mock('@/i18n/navigation', () => import('../../../../test/navigation-mock'));

describe('LanguageToggle - Unit Test', () => {
  it('Should offer only alternative languages, close on Escape and restore its trigger', async () => {
    // Given: a Portuguese locale and a closed language selector.
    const user = userEvent.setup();
    renderLocalized(<LanguageToggle />);
    const toggle = screen.getByRole('button', { name: /Idioma|idioma/ });

    // When: opening the alternatives and cancelling by keyboard.
    await user.click(toggle);
    const options = screen.getByRole('group', { name: pt.language.options });
    const openedOptions = options.isConnected;
    const buttonCount = screen.getAllByRole('button').length;
    const englishOption = screen
      .getByRole('button', { name: /English|inglês/i })
      .getAttribute('aria-label');

    await user.keyboard('{Escape}');

    // Then: only alternative languages were offered and Escape removes them while restoring the trigger.
    expect(openedOptions).toBe(true);
    expect(buttonCount).toBe(3);
    expect(englishOption).toMatch(/English|inglês/i);
    expect(screen.queryByRole('group')).not.toBeInTheDocument();
    expect(toggle).toHaveFocus();
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  it('Should ignore inside clicks and unrelated keys but dismiss on an outside pointer', async () => {
    // Given: an open language selector.
    const user = userEvent.setup();
    renderLocalized(<LanguageToggle />);
    const toggle = screen.getByRole('button');
    await user.click(toggle);

    // When: interacting inside, typing a non-Escape key and then clicking outside.
    fireEvent.pointerDown(toggle);
    await user.keyboard('x');
    const insideExpanded = toggle.getAttribute('aria-expanded');
    fireEvent.pointerDown(document.body);

    // Then: internal interaction keeps options open and only the outside pointer dismisses them.
    expect(insideExpanded).toBe('true');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });
});
