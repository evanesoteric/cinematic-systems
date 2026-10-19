import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { LoadingApplet, type AppletName } from '@/components/cipher-applet';

afterEach(cleanup);

describe('cinematic scenes', () => {
  it.each([
    ['decrypt', 'The block vault', 'FILE RESTORED'],
    ['hash', 'Find the fingerprint.', 'MATCH FOUND'],
    ['bruteforce', 'No way in. Yet.', 'ACCESS GRANTED'],
    ['crypto', 'Ghost chain', 'CONSENSUS REACHED'],
  ])('%s has a distinct scene and completes its sequence', (name, title, completed) => {
    const applet = name as AppletName;
    const { rerender } = render(<LoadingApplet applet={applet} progress={0} code="X7#K9@2F" running />);
    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    rerender(<LoadingApplet applet={applet} progress={100} code="X7#K9@2F" running />);
    expect(screen.getByRole('heading', { name: completed })).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });

  it('freezes scene motion while paused and resolves password characters progressively', () => {
    const { container } = render(<LoadingApplet applet="bruteforce" progress={50} code="X7#K9@2F" running={false} />);
    expect(container.querySelector('.cinema-scene')).toHaveAttribute('data-active', 'false');
    expect(container.querySelectorAll('.password-display .locked')).toHaveLength(4);
    expect(screen.getByText('HOLD')).toBeInTheDocument();
  });
});
