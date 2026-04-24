import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('renders the Claude Clarified Chat heading', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Claude Clarified Chat');
  });

  it('displays the main description paragraph', () => {
    render(<App />);
    expect(
      screen.getByText(/Claude Clarified Chat un-black-boxes/),
    ).toBeInTheDocument();
  });

  it('contains the app-landing container', () => {
    const { container } = render(<App />);
    const appDiv = container.querySelector('.app-landing');
    expect(appDiv).toBeInTheDocument();
  });
});
