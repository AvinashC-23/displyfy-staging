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

To be recorded after the verified production build.
