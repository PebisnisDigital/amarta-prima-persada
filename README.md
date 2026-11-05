# PT Amarta Prima Persada — Official Website

Standalone static website for PT Amarta Prima Persada, separated from the PESONAFLIX multi-client site with the owner's authorization.

## Publishing

- Import this repository into a **new** Vercel project named `amarta-prima-persada`.
- Select **Other** for the framework preset. This is a static site; no build command or `npm install` is needed.
- Root Directory: repository root (`.`).
- The main page is `/`, with an English page at `/en`.
- Both languages use WhatsApp `+62 852-2200-5585` (`wa.me/628522005585`).
- Images and vendored animation scripts are in `images/` and `vendor/`.
- Fleet categories: Toyota 7-seater, Daihatsu 7-seater, and Hiace / Elf Long.
- Five services: daily/monthly/yearly self-drive rental; rental with driver; monthly driver and fuel package; employee shuttle; and group tourism trips.
- Existing unit photos are Toyota examples. Daihatsu and Hiace / Elf Long categories use illustrated cards until the client supplies approved vehicle photos.
- Validate both languages, service data and WhatsApp URLs with `node scripts/verify.mjs` before deploying.
- When the client provides a paid domain, add it in **Vercel Project → Settings → Domains**, then update DNS records at the domain registrar using the values Vercel provides.
- After connecting the paid domain, update canonical, social sharing, and structured-data URLs in both `index.html` files from `amarta-prima-persada.vercel.app` to the new domain.

## Notes

`scripts/prepare-standalone.mjs` records the one-time conversion from the PESONAFLIX `/zainulhaq2` route to domain-root asset paths. Re-running it is safe. The original PESONAFLIX project and its route remain untouched.
