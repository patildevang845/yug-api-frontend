'use client';
import { useEffect, useRef } from 'react';
import LandingMarkup from './LandingMarkup';
import { useTheme, useToggleLabel } from '@/lib/useTheme';

const BILL: Record<string, string> = { monthly: 'billed monthly', quarterly: 'billed quarterly', annual: 'billed yearly' };

export default function Landing() {
  const { mode, toggle } = useTheme();
  const root = useRef<HTMLDivElement>(null);
  useToggleLabel(root, mode);

  // Parallax: mouse sets --mx/--my, scroll sets --sy. No React re-render, so it stays smooth.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0, mx = 0, my = 0, sy = 0;
    const apply = () => {
      raf = 0;
      el.style.setProperty('--mx', mx.toFixed(3));
      el.style.setProperty('--my', my.toFixed(3));
      el.style.setProperty('--sy', String(sy));
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(apply); };
    const onMove = (e: MouseEvent) => { mx = e.clientX / window.innerWidth - 0.5; my = e.clientY / window.innerHeight - 0.5; queue(); };
    const onScroll = () => { sy = Math.min(window.scrollY, 900); queue(); };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  // Remember the original display of the "team" AI panel so the audience tabs can show/hide it.
  useEffect(() => {
    const team = root.current?.querySelector<HTMLElement>('[data-aud="team"]');
    if (team && team.dataset.d === undefined) team.dataset.d = team.style.display;
  }, []);

  function onClick(e: React.MouseEvent<HTMLDivElement>) {
    const t = e.target as HTMLElement;
    if (t.closest('.tgl')) { toggle(); return; }
    const tab = t.closest<HTMLButtonElement>('.tabs button.tab');
    if (!tab) return;
    const group = tab.closest('.tabs') as HTMLElement;
    const buttons = Array.from(group.querySelectorAll<HTMLButtonElement>('button.tab'));
    buttons.forEach((b) => { const on = b === tab; b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); });
    const label = group.getAttribute('aria-label');
    if (label === 'Billing period') {
      const key = tab.textContent!.toLowerCase().startsWith('month') ? 'monthly' : tab.textContent!.toLowerCase().startsWith('quarter') ? 'quarterly' : 'annual';
      root.current?.querySelectorAll('[data-bill]').forEach((n) => { n.textContent = BILL[key]; });
    }
    if (label === 'Audience') {
      const which = buttons.indexOf(tab) === 0 ? 'team' : 'cust';
      root.current?.querySelectorAll<HTMLElement>('[data-aud]').forEach((p) => { p.style.display = p.dataset.aud === which ? (p.dataset.d ?? '') : 'none'; });
    }
  }

  return (
    <div
      ref={root}
      className={`rl ${mode}`}
      style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', ['--mx' as string]: 0, ['--my' as string]: 0, ['--sy' as string]: 0 }}
      onClick={onClick}
    >
      <LandingMarkup />
    </div>
  );
}
