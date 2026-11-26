# YUG-API website (Next.js)

Pages
- `/`            Landing page (day/night toggle, parallax, pricing tabs, AI audience tabs)
- `/onboarding`  3 steps: Select the plan, Make the payment, Start chatting

## Run on Windows (PowerShell, inside this folder)
```
npm install
npm run dev
```
Open http://localhost:3000 and http://localhost:3000/onboarding

Production check: `npm run build` then `npm start`.

## Where to edit
- Onboarding prices, plan names, features: `lib/plans.ts` (`[PRICE]`, `[TOTAL]` placeholders)
- Landing page prices and stats (`[PRICE]`, `[N]+`, `[X.X]`): `components/LandingMarkup.tsx` (search for the brackets)
- Colors, fonts, animations: `app/globals.css`
- Payment hook: `startPay()` in `components/Onboarding.tsx` (currently a simulated 2-second payment)
- Theme logic: `lib/useTheme.ts`

Needs Node 18.18 or newer (you have 24, fine).
