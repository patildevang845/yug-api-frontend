'use client';
import { useRef, useState } from 'react';
import Icon from './Icon';
import OnboardingShell from './OnboardingShell';
import { useTheme, useToggleLabel } from '@/lib/useTheme';
import { ACCOUNT_TYPES, PERIODS, PLANS, totalFor, type AccountType, type Period, type PlanId } from '@/lib/plans';

type PayState = 'idle' | 'loading' | 'done';
const STEP_HINTS = ['Step 1 of 3 · Select the plan', 'Step 2 of 3 · Make the payment', 'Step 3 of 3 · Start chatting'];
const STEP_NAMES = ['Select plan', 'Make payment', 'Start chatting'];

const Tick = () => <span className="tick" style={{ position: 'absolute', top: 12, right: 12, width: 22, height: 22, borderRadius: '50%', display: 'grid', placeItems: 'center', background: 'var(--accent)', color: 'var(--btnText)' }}><Icon name="check" size={14} /></span>;

export default function Onboarding() {
  const { mode, toggle } = useTheme();
  const root = useRef<HTMLDivElement>(null);
  useToggleLabel(root, mode);

  const [step, setStep] = useState(0);
  const [plan, setPlan] = useState<PlanId>('pro');
  const [period, setPeriod] = useState<Period>('quarterly');
  const [type, setType] = useState<AccountType>('verified');
  const [method, setMethod] = useState<'upi' | 'card' | 'net'>('upi');
  const [agree, setAgree] = useState(false);
  const [pay, setPay] = useState<PayState>('idle');

  const planInfo = PLANS.find((p) => p.id === plan)!;
  const periodInfo = PERIODS.find((p) => p.id === period)!;
  const typeInfo = ACCOUNT_TYPES.find((t) => t.id === type)!;
  const verified = type === 'verified';
  const total = totalFor(plan, period);
  const color = typeInfo.tone;

  function startPay() {
    if (!agree || pay !== 'idle') return;
    setPay('loading');
    setTimeout(() => setPay('done'), 1300);
    setTimeout(() => setStep(2), 2100); // TODO: replace with real payment confirmation
  }
  function restart() { setStep(0); setPay('idle'); setAgree(false); }

  const sec: React.CSSProperties = { maxWidth: 760, width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 22 };

  return (
    <div
      ref={root}
      className={`rl ${mode}`}
      style={{ minHeight: '100vh', display: 'flex', flexWrap: 'wrap' }}
      onClick={(e) => { if ((e.target as HTMLElement).closest('.tgl')) toggle(); }}
    >
      <OnboardingShell>
        {/* progress */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 760, width: '100%', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 30 }}>
            <span className="muted" style={{ fontSize: 13 }}>{STEP_HINTS[step]}</span>
            {step === 1 && <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setStep(0); setPay('idle'); }} style={{ height: 30 }}>Back</button>}
          </div>
          <div className="stp" role="list" aria-label="Onboarding steps">
            {STEP_NAMES.map((n, i) => (
              <span key={n} style={{ display: 'contents' }}>
                <span className={`nd ${i < step ? 'ok' : i === step ? 'now' : ''}`}><i>{i < step ? '✓' : i + 1}</i>{n}</span>
                {i < 2 && <span className={`ln ${i < step ? 'ok' : ''}`}><b /></span>}
              </span>
            ))}
          </div>
        </div>

        {/* STEP 1: select the plan */}
        {step === 0 && (
          <section className="fade" style={sec}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <h2 style={{ fontSize: 32, fontWeight: 600 }}>Select your plan</h2>
              <p className="muted" style={{ fontSize: 14, lineHeight: 1.6 }}>Simple pricing, no setup fees. Messaging is charged at cost.</p>
            </div>
            <div className="tabs" role="group" aria-label="Billing period" style={{ alignSelf: 'flex-start' }}>
              {PERIODS.map((p) => (
                <button key={p.id} type="button" className={`tab ${period === p.id ? 'on' : ''}`} aria-pressed={period === p.id} onClick={() => setPeriod(p.id)}>{p.label}</button>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12, alignItems: 'stretch' }}>
              {PLANS.map((p) => (
                <button key={p.id} type="button" className={`card plan ${plan === p.id ? 'on' : ''}`} aria-pressed={plan === p.id} onClick={() => setPlan(p.id)}>
                  <span className="tick"><Icon name="check" size={14} /></span>
                  <span>
                    <b className="hf" style={{ fontSize: 20 }}>{p.name}</b>
                    {p.badge && <span className="chip" style={{ height: 22, fontSize: 11, marginLeft: 8, verticalAlign: 3 }}>{p.badge}</span>}
                    <span className="muted" style={{ display: 'block', fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>{p.blurb}</span>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span className="hf" style={{ fontSize: 30, fontWeight: 600 }}>{p.price[period]}</span>
                    <span className="muted" style={{ fontSize: 12 }}>/ month</span>
                  </span>
                  <ul>{p.features.map((f) => <li key={f}><Icon name="check" size={14} />{f}</li>)}</ul>
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <b style={{ fontSize: 14 }}>What best describes your business account?</b>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
                {ACCOUNT_TYPES.map((t) => (
                  <button key={t.id} type="button" className={`card opt ${type === t.id ? 'on' : ''}`} aria-pressed={type === t.id} onClick={() => setType(t.id)} style={{ padding: 16, display: 'flex', gap: 14, alignItems: 'center', position: 'relative' }}>
                    <Tick />
                    <span style={{ flex: 'none', width: 40, height: 40, borderRadius: 12, display: 'grid', placeItems: 'center', background: 'var(--surface2)', color: t.tone }}><Icon name={t.icon} size={18} /></span>
                    <span><b style={{ fontSize: 14 }}>{t.title}</b><span className="muted" style={{ display: 'block', fontSize: 12, marginTop: 3, lineHeight: 1.45 }}>{t.sub}</span></span>
                  </button>
                ))}
              </div>
            </div>
            <button type="button" className="btn btn-orbit btn-lg" onClick={() => setStep(1)} style={{ width: '100%' }}>Continue to payment<Icon name="arrow" size={16} className="arr" /></button>
          </section>
        )}

        {/* STEP 2: make the payment */}
        {step === 1 && (
          <section className="fade" style={sec}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <h2 style={{ fontSize: 32, fontWeight: 600 }}>Make the payment</h2>
              <p className="muted" style={{ fontSize: 14, lineHeight: 1.6 }}>Tell us who to contact, then pay securely.</p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ flex: '3 1 340px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14 }}>
                  <label className="field">First name<input className="inp" placeholder="Aarav" /></label>
                  <label className="field">Last name<input className="inp" placeholder="Shah" /></label>
                  <label className="field" style={{ gridColumn: 'span 2' }}>Business name<input className="inp" placeholder="Acme Traders" /></label>
                  <label className="field" style={{ gridColumn: 'span 2' }}>Work email<input className="inp" type="email" placeholder="you@company.com" /></label>
                  <label className="field" style={{ gridColumn: 'span 2' }}>WhatsApp number
                    <span style={{ display: 'flex', gap: 8 }}>
                      <select className="inp" style={{ width: 92 }} aria-label="Country code"><option>+91</option><option>+1</option><option>+44</option><option>+971</option></select>
                      <input className="inp" placeholder="98765 43210" aria-label="WhatsApp number" />
                    </span>
                  </label>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <b style={{ fontSize: 14 }}>Pay with</b>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {([['upi', 'UPI'], ['card', 'Card'], ['net', 'Net banking']] as const).map(([id, label]) => (
                      <button key={id} type="button" className={`pill ${method === id ? 'on' : ''}`} aria-pressed={method === id} onClick={() => setMethod(id)}>{label}</button>
                    ))}
                  </div>
                </div>
              </div>
              <aside className="card" style={{ flex: '2 1 240px', padding: 20, display: 'flex', flexDirection: 'column', gap: 4, position: 'sticky', top: 24 }}>
                <b style={{ fontSize: 14, marginBottom: 8 }}>Order summary</b>
                <div className="sum"><span className="muted">Plan</span><b>{planInfo.name}</b></div>
                <div className="sum"><span className="muted">Billing</span><b>{periodInfo.name}</b></div>
                <div className="sum"><span className="muted">Account type</span><b style={{ textAlign: 'right' }}>{typeInfo.short}</b></div>
                <div className="sum"><span className="muted">Activation</span><b style={{ color, textAlign: 'right' }}>{typeInfo.eta}</b></div>
                <div className="sum" style={{ paddingTop: 14 }}><span style={{ fontSize: 14, fontWeight: 600 }}>Total due today</span><b className="hf" style={{ fontSize: 22 }}>{total}</b></div>
              </aside>
            </div>
            <button type="button" className={`agree ${agree ? 'on' : ''}`} aria-pressed={agree} onClick={() => setAgree((a) => !a)}>
              <span className="box">{agree && <Icon name="check" size={14} />}</span>
              <span>I agree to the <a href="#">Terms</a> and <a href="#">Privacy Policy</a>, and to receive account updates on WhatsApp.</span>
            </button>
            <button type="button" className={`btn btn-orbit btn-lg btn-connect ${agree ? '' : 'off'} ${pay === 'idle' ? '' : pay}`} onClick={startPay} style={{ width: '100%' }} aria-live="polite">
              {pay === 'idle' && <>Pay {total} securely<Icon name="arrow" size={16} className="arr" /></>}
              {pay === 'loading' && <><span className="spinner" />Processing payment</>}
              {pay === 'done' && <><svg className="check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7" /></svg>Payment received</>}
            </button>
          </section>
        )}

        {/* STEP 3: start chatting */}
        {step === 2 && (
          <section className="fade" style={sec}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span className="who" style={{ alignSelf: 'flex-start', background: `color-mix(in srgb, ${color} 16%, transparent)`, color }}>{typeInfo.eta}</span>
              <h2 style={{ fontSize: 34, fontWeight: 600 }}>{verified ? 'You’re live. Start chatting.' : 'Payment received. You’re next in line.'}</h2>
              <p className="muted" style={{ fontSize: 14, lineHeight: 1.6 }}>
                {verified
                  ? 'Your verified business account is activated today. Open your workspace and send your first message.'
                  : 'Our team is onboarding your account and it may take 1–2 days. We’ll message you on WhatsApp as soon as you can start chatting.'}
              </p>
            </div>
            <div className="card" style={{ padding: 22 }}>
              <ol className="tl">
                <li className="ok"><span className="dot"><Icon name="check" size={13} strokeWidth={2.4} /></span><span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 4 }}><b style={{ fontSize: 14, fontWeight: 600 }}>Plan selected</b><span className="muted" style={{ fontSize: 12 }}>{planInfo.name} · {periodInfo.name}</span></span><span className="st" style={{ paddingTop: 6, color: 'var(--ok)' }}>Done</span></li>
                <li className="ok"><span className="dot"><Icon name="check" size={13} strokeWidth={2.4} /></span><span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 4 }}><b style={{ fontSize: 14, fontWeight: 600 }}>Payment received</b><span className="muted" style={{ fontSize: 12 }}>Confirmation sent to your email</span></span><span className="st" style={{ paddingTop: 6, color: 'var(--ok)' }}>Done</span></li>
                <li className={verified ? 'ok' : 'run'}>
                  <span className="dot">{verified ? <Icon name="check" size={13} strokeWidth={2.4} /> : <span className="spinner" style={{ width: 12, height: 12 }} />}</span>
                  <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 4 }}><b style={{ fontSize: 14, fontWeight: 600 }}>{verified ? 'Account activated' : 'Account onboarding'}</b><span className="muted" style={{ fontSize: 12 }}>{verified ? 'Your workspace is ready to use' : 'Handled by our team, nothing for you to do'}</span></span>
                  <span className="st" style={{ paddingTop: 6, color }}>{verified ? 'Done' : 'In progress'}</span>
                </li>
              </ol>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
              {[['inbox', 'Team Inbox', 'Reply to every chat with your team in one place.', 'Open inbox'], ['megaphone', 'Campaigns', 'Broadcast approved messages to opted-in contacts.', 'New campaign'], ['bot', 'AI agent', 'Let YUG AI answer common questions for you.', 'Set up agent']].map(([icon, t, sub, cta]) => (
                <a key={t} className="card lift" href="#" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10, textDecoration: 'none', color: 'var(--text)' }}>
                  <span style={{ width: 38, height: 38, borderRadius: 11, display: 'grid', placeItems: 'center', background: 'var(--surface2)', color: 'var(--accent)' }}><Icon name={icon} size={18} /></span>
                  <b style={{ fontSize: 15 }}>{t}</b>
                  <span className="muted" style={{ fontSize: 13, lineHeight: 1.5, flex: 1 }}>{sub}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 6 }}>{cta}<Icon name="arrow" size={14} /></span>
                </a>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a className="btn btn-orbit btn-lg" href="#">{verified ? 'Go to my workspace' : 'Preview my workspace'}<Icon name="arrow" size={16} className="arr" /></a>
              <button type="button" className="btn btn-ghost btn-lg" onClick={restart}>Replay onboarding</button>
            </div>
          </section>
        )}
      </OnboardingShell>
    </div>
  );
}
