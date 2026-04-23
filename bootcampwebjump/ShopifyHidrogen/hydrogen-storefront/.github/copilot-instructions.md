# Copilot Instructions — Hydrogen Storefront

## Stack
- **Shopify Hydrogen 2026.4.1** on top of **React Router 7** (not Remix)
- Runs on **Cloudflare Workers** via `@shopify/mini-oxygen` in dev
- **Tailwind CSS v4** (Vite plugin, not PostCSS)
- **JSX** throughout (no TypeScript source files; types via JSDoc `@typedef`)

## Developer Workflows
```bash
npm run dev          # Start dev server with GraphQL codegen watch
npm run build        # Production build + codegen
npm run codegen      # Re-generate storefrontapi.generated.d.ts and react-router types
npm run lint         # ESLint (eslint.config.js flat config)
```

## Architecture

### Request Lifecycle
`server.js` → `createHydrogenRouterContext` (app/lib/context.js) → React Router handler → route loaders/actions

`context` object (available as `{context}` in every loader/action) exposes:
- `context.storefront` — Storefront API client (public products, collections, etc.)
- `context.customerAccount` — Customer Account API client (authenticated, private)
- `context.cart` — Cart handler
- `context.session` — Cookie session (commit manually via `session.isPending` check in server.js)
- `context.env` — Cloudflare environment variables

### Route Naming
All routes live under `app/routes/` with the `($locale).` prefix, enabling optional locale segments (e.g. `/en-us/products/my-product`). Locale is resolved in `app/lib/i18n.js`.

### Data Loading Pattern (every route follows this)
```js
export async function loader(args) {
  const deferredData = loadDeferredData(args);        // non-blocking, must NOT throw
  const criticalData = await loadCriticalData(args);  // blocks; 400/500 on error
  return {...deferredData, ...criticalData};
}
```
- `loadCriticalData` — above-the-fold data; use `Promise.all([...])` for parallel queries
- `loadDeferredData` — below-the-fold; wrap consumer with `<Suspense>/<Await>` in the component

### Storefront API Queries
Use `context.storefront.query(GQL_TAG, { variables, cache })` with built-in cache strategies:
- `storefront.CacheLong()` — static content (menus, policies)
- Default (no cache arg) — short-lived or dynamic content

### Customer Account API
Use `context.customerAccount.query(...)` for authenticated operations. Routes that require auth should call `await customerAccount.handleAuthStatus()` (redirects automatically).

### Localized Handle Redirects
Always call `redirectIfHandleIsLocalized(request, {handle, data})` from `~/lib/redirect` after fetching a resource by handle, so the URL stays canonical.

### GraphQL Codegen
Running `npm run codegen` regenerates `storefrontapi.generated.d.ts` and `customer-accountapi.generated.d.ts`. Query/mutation files live in `app/graphql/`. Add new `.graphql` or tagged-template queries there; never hand-edit the generated files.

### Adding Context / Third-Party Clients
Extend `additionalContext` in `app/lib/context.js`. Properties are available directly on `context` in every loader.

## Key Files
| File | Purpose |
|---|---|
| `server.js` | Cloudflare Worker entry; session commit logic |
| `app/lib/context.js` | Hydrogen context factory (storefront, cart, session, i18n) |
| `app/lib/i18n.js` | Locale detection from request |
| `app/lib/fragments.js` | Shared GraphQL fragments (cart, product) |
| `app/root.jsx` | Root loader, `<Layout>`, `<ErrorBoundary>` |
| `app/components/PageLayout.jsx` | Header/Footer shell wrapping all pages |
| `app/routes/($locale).products.$handle.jsx` | Canonical product page pattern |
