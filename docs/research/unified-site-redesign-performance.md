# Unified Site Redesign Performance Record

## Measurement contract

- Environment: local Next.js production build in `DISPLYFY_PROVIDER_MODE=demo` on Node.js 24.20.0.
- Tool: Lighthouse 13.5.0, run with simulated throttling against `http://127.0.0.1:3200`.
- Mobile viewport: 375 × 900 at device scale factor 2.625.
- Desktop viewport: 1440 × 1000 at device scale factor 1.
- Compare the redesign with the same Lighthouse version, URL, viewport, throttling method, and production mode.
- Script and image transfer totals come from Lighthouse's network request records for the initial homepage load.

## Pre-redesign checkpoint — 2026-10-08

| Viewport | Performance | LCP | CLS | Total transfer | Script transfer | Image transfer | Script requests | Image requests |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | 90 | 3,531 ms | 0 | 593,932 B | 308,496 B | 195,274 B | 14 | 7 |
| Desktop | 100 | 653 ms | 0 | 596,504 B | 308,496 B | 197,846 B | 14 | 8 |

The checkpoint meets the score and layout-shift targets but misses the mobile LCP target of 2.5 seconds. The redesign must reduce initial script transfer and bring mobile LCP to 2.5 seconds or less without worsening CLS.

## Commands

```sh
npm run build
DISPLYFY_PROVIDER_MODE=demo npm run start -- --hostname 127.0.0.1 --port 3200
npx --yes lighthouse@13.5.0 http://127.0.0.1:3200 --only-categories=performance --output=json --chrome-flags='--headless --no-sandbox' --form-factor=mobile --screenEmulation.mobile=true --screenEmulation.width=375 --screenEmulation.height=900 --screenEmulation.deviceScaleFactor=2.625 --throttling-method=simulate --quiet
npx --yes lighthouse@13.5.0 http://127.0.0.1:3200 --only-categories=performance --output=json --chrome-flags='--headless --no-sandbox' --preset=desktop --screenEmulation.mobile=false --screenEmulation.width=1440 --screenEmulation.height=1000 --screenEmulation.deviceScaleFactor=1 --throttling-method=simulate --quiet
```

## Final redesign

Measured on the verified production build with the same Lighthouse 13.5.0 contract.

| Viewport | Performance | LCP | CLS | Total transfer | Script transfer | Image transfer | Script requests | Image requests |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | 99 | 2,139 ms | 0 | 396,538 B | 257,122 B | 97,741 B | 12 | 6 |
| Desktop | 100 | 502 ms | 0 | 430,340 B | 257,122 B | 131,543 B | 12 | 7 |

Compared with the checkpoint, initial JavaScript fell by 51,374 B (16.7%) and two script requests at both viewports. Mobile image transfer fell by 97,533 B (49.9%), total transfer fell by 197,394 B (33.2%), and simulated mobile LCP improved by 1,392 ms (39.4%). Desktop total transfer fell by 166,164 B (27.9%). Both viewports meet the score, LCP, and CLS gates.

The final image policy uses native lazy loading for homepage editorial media, an eager lightweight SVG logo, accurate responsive candidates, and quality 50 only for the three images Chrome requests during the initial mobile navigation. The 828 px mobile candidates still provide more than 2× pixel density at the 375 px test viewport while avoiding 1080 px transfers. Measured desktop navigation prefetching added roughly 136 KB of route JavaScript before interaction, so primary navigation links deliberately opt out; clicks still use Next.js client transitions and retain the in-page runtime.
