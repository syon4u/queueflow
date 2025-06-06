
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/i18n';
import LanguageSelector from '@/components/landing/LanguageSelector';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        {component}
      </I18nextProvider>
    </BrowserRouter>
  );
};

describe('LanguageSelector', () => {
  it('renders language selector with globe icon', () => {
    renderWithProviders(<LanguageSelector />);
    
    const selector = screen.getByRole('button');
    expect(selector).toBeInTheDocument();
  });

  it('opens dropdown and shows language options', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LanguageSelector />);
    
    const selector = screen.getByRole('button');
    await user.click(selector);
    
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Español')).toBeInTheDocument();
  });

  it('changes language when option is selected', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LanguageSelector />);
    
    const selector = screen.getByRole('button');
    await user.click(selector);
    
    const spanishOption = screen.getByText('Español');
    await user.click(spanishOption);
    
    expect(localStorage.getItem('preferred-language')).toBe('es');
  });
});
