# Asa Nirwana Selaras — Rental Mobil & Kemitraan KJANS

Standalone static website for **Koperasi Jasa Asa Nirwana Selaras**, with the public-facing brand **Asa Nirwana Selaras**. This is a rebrand of the standalone car-rental website, separate from PESONAFLIX.

## Publishing

- The current Vercel project and legacy URL remain `amarta-prima-persada` until a new domain is selected. Keeping this URL ensures existing links continue working during the rebrand.
- Framework preset **Other**. This is a static site; no build command or `npm install` is needed.
- Root Directory: repository root (`.`).
- The main page is `/`, with an English page at `/en`.
- Both languages retain the previously approved **rental WhatsApp** `+62 852-2200-5585` (`wa.me/628522005585`).
- Partnership contact from the client-provided proposal: CS telephone `+62 815-184-0631` (Monday–Thursday, 09:00–13:00 WIB), email `asanirwanaselaras@gmail.com`, and location East Bekasi, West Java. The proposal does **not** explicitly establish that the partnership number has WhatsApp, so it is linked as `tel:` rather than `wa.me`.
- The cooperative's official KJANS logo is preserved from the supplied PDF as `images/logo-kjans-official.svg` and `images/icon-kjans-official.svg` (used in the site and favicon). The former temporary ANS art remains in the repository only for reference, not in the live HTML.
- Images and vendored animation scripts are in `images/` and `vendor/`.
- Fleet categories: Toyota 7-seater, Daihatsu 7-seater, and Hiace / Elf Long.
- Five services: daily/monthly/yearly self-drive rental; rental with driver; monthly driver and fuel package; employee shuttle; and group tourism trips.
- Three cooperative programs: Titip Mobil (eligible vehicle management), Sewa Murni (new vehicle procurement), and Sewa Kepemilikan (conditional lease-to-own). Pages also feature cooperative values and the four-step partnership application process.
- The proposal states legal registration but does not include AHU/NIB IDs. It also lists conflicting lease-to-own tenors (60 vs. 60–72 months) and a buyout amount requiring clarification. Financial figures and unverified legal claims are intentionally not presented as confirmed website offers.
- Existing unit photos are Toyota examples. Daihatsu and Hiace / Elf Long categories use illustrated cards until the client supplies approved vehicle photos.
- Validate both languages, service data and WhatsApp URLs with `node scripts/verify.mjs` before deploying.
- To regenerate the logos from the client PDF if required, render its cover to SVG using Poppler and run `node scripts/extract-kjans-logo.mjs <cover-svg> images`.
- When the client provides a paid domain, add it in **Vercel Project → Settings → Domains**, then update DNS records at the domain registrar using the values Vercel provides.
- After connecting the paid domain, update canonical, social sharing, and structured-data URLs in both `index.html` files from `amarta-prima-persada.vercel.app` to the new domain.

## Notes

`scripts/prepare-standalone.mjs` records the one-time conversion from the PESONAFLIX `/zainulhaq2` route to domain-root asset paths. Re-running it is safe. The original PESONAFLIX project and its route remain untouched.
