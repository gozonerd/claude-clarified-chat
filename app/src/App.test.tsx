import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

vi.mock('./ui/shell/Shell', () => ({
  Shell: () => (
    <div>
      <h1>Claude Clarified Chat</h1>
      <p>Test shell</p>
    </div>
  ),
}));

describe('App', () => {
  it('renders the Claude Clarified Chat heading', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Claude Clarified Chat');
  });

  it('renders without throwing', () => {
    expect(() => render(<App />)).not.toThrow();
  });
});
