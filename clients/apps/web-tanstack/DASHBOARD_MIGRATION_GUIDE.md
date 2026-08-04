# Dashboard Migration Guide: Next.js to TanStack Start

This guide documents the process used to migrate the dashboard shell and home/overview page from `clients/apps/web` to `clients/apps/web-tanstack`. It is intended to be a repeatable playbook for migrating the remaining dashboard pages.

The standard is **exact functional and visual parity**, not approximation or redesign. The existing Next.js implementation and the deployed production dashboard are the sources of truth. No deviation in functionality is acceptable.

The only acceptable changes are those strictly required to translate a Next.js framework boundary to its TanStack Start equivalent. Outside those boundaries, preserve the same code, component structure, data flow, state transitions, validation, errors, analytics, accessibility, styling, and behavior. Do not refactor, simplify, modernize, or otherwise "improve" portable production code during a migration.

## Core principles

1. **No functional deviation.** Every route, interaction, request, state, side effect, error path, and responsive behavior must work exactly as it does in the original implementation.
2. **Copy exactly before adapting.** Start from the original route and components. Change only the smallest framework-specific boundary that cannot run under TanStack Start.
3. **Do not recreate an existing component from a screenshot.** Screenshots reveal differences, but the original source explains how the UI is actually built.
4. **Keep framework adaptations narrow and reviewable.** Replace Next.js routing, server, metadata, and image APIs at the boundary. Do not rewrite otherwise portable React code.
5. **Use production for visual truth and the repository for implementation truth.** A production screenshot can be newer or data-dependent. Resolve differences by checking both.
6. **Use real data and authentication.** Test against the real local API and database. Do not introduce mock responses for dashboard migrations.
7. **Preserve security boundaries.** Route guards improve UX, but API permissions remain authoritative.
8. **Keep both applications standalone.** Existing workspace primitives may be reused, but a migration must not introduce new shared primitives or move app-local code into a shared package. Copy framework-neutral app-local code into `web-tanstack` instead.
9. **Do not invent CSS overrides.** Preserve `!important` modifiers only when the corresponding production implementation uses them.
10. **Keep files below the frontend 250-line limit.** If a mechanical split is required, split by responsibility without changing code behavior, rendered structure, or ownership.
11. **Treat data differences separately from visual differences.** Production and local organizations usually have different plans, avatars, metrics, orders, and balances.

## Read before editing

Read:

- `AGENTS.md`
- `clients/AGENTS.md`
- `clients/apps/web-tanstack/AGENTS.md`
- Any relevant Accepted ADR under `handbook/engineering/decisions/`

For a Next.js-to-TanStack migration task, load the repository's TanStack migration guidance before editing:

```bash
cd clients/apps/web-tanstack
pnpm dlx @tanstack/intent@latest load \
  @tanstack/react-start#lifecycle/migrate-from-nextjs
```

For browser comparison, load the Playwriter skill and its complete documentation before running Playwriter commands:

```bash
playwriter skill
```

## Existing TanStack dashboard foundation

Do not duplicate the shell or organization guard in child pages.

The current hierarchy is:

```text
src/routes/_authenticated.tsx
└── src/routes/_authenticated/dashboard/$organization.tsx
    ├── src/routes/_authenticated/dashboard/$organization/index.tsx
    └── future dashboard child routes
```

Responsibilities:

- `src/routes/_authenticated.tsx`
  - Resolves the current user on the server.
  - Redirects anonymous visitors to `/auth`.
  - Preserves a sanitized internal return URL.
- `src/routes/_authenticated/dashboard/$organization.tsx`
  - Resolves the organization from the authenticated user.
  - Handles SSO-required memberships.
  - Returns a 404 for inaccessible organizations.
  - Renders the shared dashboard shell and `<Outlet />`.
- `src/components/Layout/Dashboard/DashboardLayout.tsx`
  - Owns desktop/mobile layout, sidebar, and scroll behavior.
- `src/routes/_authenticated/dashboard/$organization/index.tsx`
  - Owns only the dashboard home route and metadata.

A new organization dashboard page should normally be a child of `$organization.tsx` and consume the inherited route context:

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/dashboard/$organization/example',
)({
  head: () => ({ meta: [{ title: 'Example | Polar' }] }),
  component: ExamplePage,
})

function ExamplePage() {
  const { organization, user } = Route.useRouteContext()
  return <Example organization={organization} user={user} />
}
```

Do not fetch the current user or organization again unless the page needs fresher or more detailed data than the route context provides.

## Source map used for the dashboard home migration

The home migration traced the dependency graph from these production files.

### Route and page composition

- `clients/apps/web/src/app/(main)/dashboard/[organization]/layout.tsx`
- `clients/apps/web/src/app/(main)/dashboard/[organization]/(header)/layout.tsx`
- `clients/apps/web/src/app/(main)/dashboard/[organization]/(header)/(home)/page.tsx`
- `clients/apps/web/src/app/(main)/dashboard/[organization]/(header)/(home)/DashboardPage.tsx`

### Dashboard shell

- `clients/apps/web/src/components/Layout/DashboardLayout.tsx`
- `clients/apps/web/src/components/Layout/Dashboard/DashboardSidebar.tsx`
- `clients/apps/web/src/components/Layout/Dashboard/DashboardNavigation.tsx`
- `clients/apps/web/src/components/Layout/Dashboard/NavList.tsx`
- `clients/apps/web/src/components/Dashboard/navigation.tsx`
- `clients/apps/web/src/components/Dashboard/navigationProducts.tsx`

### Overview metrics

- `clients/apps/web/src/components/DashboardOverview/OverviewSection.tsx`
- `clients/apps/web/src/components/DashboardOverview/MetricSelectorModal.tsx`
- `clients/apps/web/src/components/Metrics/dashboards/MetricGroup.tsx`
- `clients/apps/web/src/components/Metrics/MetricChartBox.tsx`
- `clients/apps/web/src/components/Metrics/MetricChart.tsx`
- `clients/apps/web/src/components/Charts/GenericChart.tsx`
- `clients/apps/web/src/hooks/queries/metrics.ts`
- `clients/apps/web/src/hooks/useChartRange.ts`
- `clients/apps/web/src/utils/metrics.ts`
- `clients/apps/web/src/utils/formatters.ts`

### Home widgets

- `clients/apps/web/src/components/Widgets/WidgetContainer.tsx`
- `clients/apps/web/src/components/Widgets/RevenueWidget.tsx`
- `clients/apps/web/src/components/Widgets/OrdersWidget.tsx`
- `clients/apps/web/src/components/Widgets/AccountWidget.tsx`
- `clients/apps/web/src/components/Widgets/WidgetGuard.tsx`

The resulting TanStack implementation is primarily under:

- `src/components/Layout/Dashboard/`
- `src/components/DashboardOverview/`
- `src/hooks/useOverviewMetrics.ts`
- `src/hooks/useDashboardWidgets.ts`
- `src/routes/_authenticated/dashboard/$organization/`

Use this same source-mapping approach for every new page. Begin with the route, then follow its component, provider, hook, utility, and API dependencies.

## Migration workflow

### 1. Define the exact route scope

Before coding, record:

- Production URL.
- Next.js route directory.
- Expected TanStack route filename.
- Page title and metadata.
- Required organization permissions.
- Parent layouts and providers.
- Main API requests.
- Loading, empty, denied, error, and not-found states.
- Desktop and mobile behavior.
- Actions that must work in this migration versus controls explicitly allowed to remain inactive.

Do not silently turn an action into a nonfunctional button. If functionality is out of scope, confirm that with the task owner or omit the action until it can behave correctly.

### 2. Capture the production baseline first

Use the user's existing signed-in Chrome session through Playwriter. Production is useful for identifying:

- Exact shell geometry.
- Responsive breakpoints.
- Typography and line heights.
- Border radius and divider placement.
- Loading transitions.
- Real populated and empty states.
- Scroll ownership.
- Hover and menu behavior.

Create a dedicated Playwriter session:

```bash
playwriter session new
```

List enabled pages before taking control:

```bash
playwriter -s <session> -e '
console.log(context.pages().map((p, i) => `${i}: ${p.url()}`).join("\n"))
'
```

If the user explicitly asks you to use an existing signed-in tab, locate it by URL. Otherwise create your own page; pages in the same browser context share authentication cookies.

Capture production at a fixed desktop viewport:

```bash
playwriter -s <session> -e '
state.prodPage = await context.newPage()
await state.prodPage.setViewportSize({ width: 1440, height: 900 })
await state.prodPage.goto("https://polar.sh/dashboard/<organization>", {
  waitUntil: "domcontentloaded",
})
await waitForPageLoad({ page: state.prodPage, timeout: 10000 })
console.log("URL:", state.prodPage.url())
console.log(
  "Logs:",
  await getLatestLogs({ page: state.prodPage, sinceLastCall: true }),
)
console.log(await snapshot({ page: state.prodPage, search: /expected content/i }))
'
```

After data and chart animations settle, take the screenshot:

```bash
playwriter -s <session> -e '
await state.prodPage.waitForTimeout(1500)
console.log("URL:", state.prodPage.url())
console.log(
  "Logs:",
  await getLatestLogs({ page: state.prodPage, sinceLastCall: true }),
)
console.log(await snapshot({ locator: state.prodPage.locator("main") }))
await state.prodPage.screenshot({
  path: "/tmp/dashboard-production.png",
  scale: "css",
})
await resizeImageForAgent({
  input: "/tmp/dashboard-production.png",
  maxDimension: 1440,
})
'
```

Important Playwriter rules:

- Follow observe → act → observe.
- Print the URL and new logs after every navigation, click, submit, or scroll.
- Use `snapshot()` before screenshots.
- Use `scale: "css"` for screenshots.
- Never clear profile-wide cookies or cache.
- Remove listeners when finished.
- Do not use forced clicks or synthetic DOM events.

### 3. Inspect the original implementation before writing substitutes

Read the original page completely. Follow imports until you understand:

- Which component owns page padding and max width.
- Which component owns borders and background colors.
- Where permissions are checked.
- Which providers supply organization, account, or user state.
- How query parameters are built.
- How API timestamps and currency values are parsed and formatted.
- How the page represents loading and empty results.
- Which visual states depend on data or feature flags.

After one or two searches, read the top matching files instead of continuing to grep.

Create a small dependency table before porting:

| Original dependency                                 | Migration choice                              |
| --------------------------------------------------- | --------------------------------------------- |
| Existing workspace package component                | Import directly                               |
| App-local framework-neutral React component         | Copy exactly into `web-tanstack`              |
| `next/link` or `next/navigation`                    | Replace only the framework boundary           |
| Next.js Server Component or Server Action           | Loader, query, or `createServerFn`            |
| Next.js provider used only for available route data | Pass the same data through route context      |
| Unrelated feature not required by the task          | Defer explicitly; do not invent a replacement |

#### Do not introduce shared primitives

`clients/apps/web` and `clients/apps/web-tanstack` must remain standalone applications. During a migration:

- Reuse primitives that already exist in workspace packages such as `@polar-sh/orbit` or `@polar-sh/ui`.
- Do not extract Next.js app-local components, hooks, utilities, or state into a shared package.
- Do not add new shared primitives intended to serve both applications.
- Copy portable app-local code into `web-tanstack` and adapt only the framework-specific boundaries there.
- Do not modify the Next.js implementation solely to facilitate a TanStack migration.

Temporary duplication between the two applications is intentional. It keeps the migration isolated, prevents regressions in the production Next.js application, and allows each application to evolve independently.

#### Install external dependencies only with pnpm

All external dependency additions must be performed with `pnpm install` (`pnpm i`). Never add a dependency by manually editing `package.json`, and never manually edit `pnpm-lock.yaml`. The package manifest and lockfile must be generated together by pnpm.

Run the install from the target application directory:

```bash
cd clients/apps/web-tanstack
pnpm i <package>
```

Use `pnpm i -D <package>` for a development dependency. When the original application already declares the dependency, preserve its existing version specifier. Do not use npm, Yarn, Bun, or hand-written lockfile changes. Afterward, verify the generated dependency state from `clients/`:

```bash
pnpm install --frozen-lockfile
```

### 4. Port the route before the page body

Convert route conventions directly:

| Next.js          | TanStack Router                          |
| ---------------- | ---------------------------------------- |
| `[organization]` | `$organization`                          |
| `page.tsx`       | `index.tsx` or a named child route       |
| `layout.tsx`     | Parent route rendering `<Outlet />`      |
| `params` prop    | `Route.useParams()` or inherited context |
| Metadata export  | Route `head` property                    |
| `notFound()`     | `throw notFound()`                       |
| `redirect()`     | `throw redirect(...)`                    |

Use typed TanStack links for migrated destinations:

```tsx
<Link
  to="/dashboard/$organization/example"
  params={{ organization: organization.slug }}
>
  Example
</Link>
```

Do not interpolate route params into `to` when a typed route exists.

After adding or moving routes, regenerate the tree:

```bash
cd clients
pnpm --filter web-tanstack generate-routes
```

Never hand-edit `src/routeTree.gen.ts`.

### 5. Adapt framework boundaries, not component design

TanStack Start is isomorphic by default. Unlike Next.js App Router, a component is not server-only unless it calls a server function or imports through an explicit server boundary.

Framework substitutions:

| Next.js API                    | TanStack equivalent                                                 |
| ------------------------------ | ------------------------------------------------------------------- |
| `next/link`                    | `@tanstack/react-router` `Link` or the local link adapter           |
| `useRouter().push()`           | `useNavigate()`                                                     |
| `usePathname()`                | `useLocation()` or route APIs                                       |
| Server Action / `"use server"` | `createServerFn()`                                                  |
| API `route.ts`                 | TanStack route `server.handlers`                                    |
| `metadata`                     | Route `head`                                                        |
| `next/image`                   | Existing TanStack image adapter or a normal image where appropriate |
| Server Component data access   | Route loader, server function, or TanStack Query                    |

Do not carry over `"use client"` or `"use server"` directives.

Browser-only APIs such as `window`, `document`, and `localStorage` must run in effects or guarded client code. The overview range preference is initialized safely and read from `localStorage` in an effect.

### 6. Preserve API and query behavior

The TanStack app already exposes the generated API client:

```ts
import { api } from '@/utils/client'
import { unwrap } from '@polar-sh/client'
```

Use TanStack Query for dashboard requests. Preserve:

- Endpoint path.
- Query parameters.
- Sorting.
- Pagination limits.
- Query enable conditions.
- Permission gates.
- Response parsing.
- Query-key dimensions that affect the response.

Example:

```ts
const orders = useQuery({
  queryKey: ['orders', { organizationId: organization.id, limit: 10 }],
  queryFn: () =>
    unwrap(
      api.GET('/v1/orders/', {
        params: {
          query: {
            organization_id: organization.id,
            limit: 10,
            sorting: ['-created_at'],
          },
        },
      }),
    ),
  enabled: organization.permissions.includes('sales:read'),
})
```

Do not add another `QueryClientProvider`. The router already integrates TanStack Query for SSR.

#### Date and metric fidelity

The first overview attempt used hand-written rolling date calculations. The production implementation instead used `getMetricsRangeDates`, interval selection, and local-time ISO conversion. Copying those details fixed date ranges and x-axis labels.

For metrics:

- Use the same range keys and labels.
- Preserve the raw localStorage representation used by the existing app.
- Include timezone in the query key and API request.
- Convert API timestamps to `Date` objects before passing them to chart and date-formatting components.
- Use production formatters such as `@polar-sh/currency`; do not approximate currency behavior with a different `Intl.NumberFormat` configuration.

#### Permissions

Match the original permission before mounting a querying component. Examples include:

- `analytics:read`
- `sales:read`
- `finance:read`
- `organization:manage`

When permission is denied, preserve the original restricted state and do not fire its private query merely to discover that the API returns 403.

### 7. Copy the visual structure closely

The successful overview port copied the original component hierarchy and classes rather than translating every production class into a new design.

This distinction matters:

- Reuse Orbit and `@polar-sh/ui` components when production already uses them.
- New UI should follow Orbit conventions.
- During a parity migration, preserve existing production utility classes when they encode exact legacy layout, typography, chart, or responsive behavior.
- Do not replace production classes with approximate Orbit variants if the responsive type scale or spacing differs.

For example, the initial overview heading used an Orbit responsive heading variant. It rendered 24px on desktop but 20px on mobile, while production used a fixed `text-2xl`. Copying the original heading class corrected both the size and downstream vertical alignment.

#### `!important` modifiers

Only preserve a Tailwind important modifier when the corresponding production element uses it. The home port verified these exact pairs:

- TanStack `DashboardNavigation.tsx` ↔ production `Layout/Dashboard/NavList.tsx`
  - `dark:!bg-polar-900`
  - `bg-white!`
  - `overflow-visible!`
- TanStack `OverviewMetricCard.tsx` ↔ production `Metrics/dashboards/MetricGroup.tsx`
  - `rounded-none!`
- TanStack sidebar buttons ↔ production `NotificationsPopover.tsx` and `DashboardSidebar.tsx`
  - `size-8!`

If the original does not use an important modifier, fix class ownership, ordering, or component structure instead.

### 8. Port all meaningful states

Do not validate only the ideal screenshot. Inventory and preserve:

- Initial loading.
- Loaded data.
- Empty list.
- Restricted permission.
- 403 from a more specific resource.
- API error.
- Organization feature flag enabled/disabled.
- Free versus paid plan.
- SSO-required organization.
- Mobile drawer open/closed.
- Hover, selected range, menu, and modal states.

Production data may show an upsell, orders, payouts, or active subscription while the local seeded organization does not. Ensure the implementation can render both states even when only one is available locally.

### 9. Compare local and production at identical conditions

Use the same:

- Viewport.
- Color theme.
- Chart range.
- Scroll position.
- Loading completion point.
- Browser zoom.

Capture local after the page is stable:

```bash
playwriter -s <session> -e '
state.localPage = await context.newPage()
await state.localPage.setViewportSize({ width: 1440, height: 900 })
await state.localPage.goto(
  "http://localhost:<port>/dashboard/<local-organization>",
  { waitUntil: "domcontentloaded" },
)
await waitForPageLoad({ page: state.localPage, timeout: 8000 })
await state.localPage.waitForTimeout(1500)
console.log("URL:", state.localPage.url())
console.log(
  "Logs:",
  await getLatestLogs({ page: state.localPage, sinceLastCall: true }),
)
console.log(await snapshot({ locator: state.localPage.locator("main") }))
await state.localPage.screenshot({
  path: "/tmp/dashboard-tanstack.png",
  scale: "css",
})
await resizeImageForAgent({
  input: "/tmp/dashboard-tanstack.png",
  maxDimension: 1440,
})
'
```

Use ImageMagick for a side-by-side image:

```bash
magick \
  /tmp/dashboard-production.png \
  /tmp/dashboard-tanstack.png \
  +append \
  -resize 1600x \
  /tmp/dashboard-comparison.png
```

A raw pixel-difference score can help find large geometry or color mistakes:

```bash
magick compare -metric AE \
  /tmp/dashboard-production.png \
  /tmp/dashboard-tanstack.png \
  /tmp/dashboard-diff.png 2>&1 || true
```

Do not use the score as the acceptance criterion when organizations contain different data.

#### What to compare systematically

Compare from outside inward:

1. Viewport background.
2. Sidebar width and shell inset.
3. Main panel x/y position, width, height, radius, and border.
4. Page max width and horizontal padding.
5. Header position and controls.
6. Section gaps.
7. Card padding and dividers.
8. Typography family, size, weight, line height, and color.
9. Table/chart axes, grid, plot margins, and labels.
10. Empty-state card sizes.
11. Scrollbar owner and maximum scroll.
12. Mobile header, content radius, wrapping, and control visibility.

Pixel sampling can disambiguate nearly identical dark surfaces. The overview comparison found that the initial TanStack implementation had the outer and panel background tokens reversed. Sampling known empty pixels and checking the production source identified the correct ownership.

### 10. Verify desktop, lower content, and mobile

A single top-of-page screenshot is insufficient.

Recommended captures:

- Desktop top: `1440 × 900`.
- Desktop lower page after scrolling to tables/widgets.
- Mobile top: `390 × 844`.
- Any open drawer, dropdown, modal, or context panel relevant to the page.

For nested dashboard scroll containers, move the pointer over the main panel and use a real wheel action:

```bash
playwriter -s <session> -e '
await state.localPage.mouse.move(1200, 700)
await state.localPage.mouse.wheel(0, 1000)
await state.localPage.waitForTimeout(300)
console.log("URL:", state.localPage.url())
console.log(
  "Logs:",
  await getLatestLogs({ page: state.localPage, sinceLastCall: true }),
)
console.log(await snapshot({ locator: state.localPage.locator("main") }))
'
```

At mobile width, compare more than component stacking. The home migration found mismatches in:

- Mobile header controls.
- User avatar placement.
- Rounded top corners.
- Fixed versus responsive heading size.
- Metric action visibility.
- Chart tick density.

### 11. Verify behavior, not only screenshots

For every interactive or data-driven page, exercise its main behavior.

The overview migration verified:

- Changing range refetched metrics.
- Metric totals changed with the range.
- Hovering one chart synchronized the hovered period and displayed values across all metric cards.
- Reload preserved the selected range.
- Anonymous dashboard requests redirected to auth.
- Inaccessible organizations returned 404.
- Real session cookies survived SSR and reload.

For another page, identify equivalent assertions: filters alter requests, pagination moves, forms submit, dialogs open, exports download, and permission denial prevents requests.

### 12. Validate with the real local stack

Use the project's real backend, worker, database, and auth flow. Follow the local-environment skill and use `dev/cli/dev`, not a bare `dev` command.

The dashboard home migration used an isolated local stack with:

- API on `http://localhost:8102`
- TanStack web on `http://localhost:3102`
- A real seeded `admin@polar.sh` login
- Email OTP read from the API container logs

These ports and container names are not permanent. Discover the active instance before testing.

When running TanStack directly against a local API, ensure the expected environment variables point to that API and restart Vite after dependency changes.

A dependency or prebundle change can cause transient development-only errors such as:

```text
Invalid hook call
Cannot read properties of null (reading 'useContext')
You are loading @emotion/react when it is already loaded
```

If typecheck is clean and the error appears immediately after adding a dependency or hot-reloading a prebundled package, restart Vite with `--force` before changing application code:

```bash
pnpm exec vite dev --port <port> --force
```

Do not treat every HMR/prebundle failure as a React component bug.

### 13. Run static validation

From `clients/`:

```bash
pnpm exec oxfmt --check \
  apps/web-tanstack/src/routes/_authenticated/dashboard \
  apps/web-tanstack/src/components/<ported-area> \
  apps/web-tanstack/src/hooks/<ported-hooks>

pnpm --filter web-tanstack typecheck
pnpm --filter web-tanstack build
git diff --check
```

Expected existing build warnings may include:

- Large chunks.
- Shiki WebAssembly fallback.

Do not ignore new warnings introduced by the migrated page without understanding them.

Also verify line counts:

```bash
wc -l \
  clients/apps/web-tanstack/src/components/<ported-area>/*.tsx \
  clients/apps/web-tanstack/src/hooks/<ported-hooks>
```

## What did not work in the first home implementation

The first dashboard home implementation was functional but visually too approximate. These failures are useful warnings for future pages.

### Invented SVG charts

The first metric cards used custom SVG polylines. They omitted or mismatched:

- Date interval text.
- X-axis ticks.
- Vertical grid lines.
- Area fills.
- Chart margins.
- Hover behavior.
- Shared hover state.
- Production card height.

The fix was to follow the production chain from `MetricGroup` through `MetricChartBox`, `MetricChart`, and `GenericChart`, then reproduce the same Recharts structure and production classes.

**Lesson:** if the original page already has a sophisticated visualization, port its implementation. Do not draw a visual approximation.

### Approximate typography

An Orbit heading variant was selected because it matched desktop size. Its responsive mobile size differed from production, and a display heading variant used a visibly different numeral style.

The fix was to copy the production `text-2xl`, `text-lg`, and `text-5xl xl:font-[350]` typography and use the production currency/metric formatters.

**Lesson:** compare font family, responsive size, weight, line height, and numeral formatting—not just nominal desktop size.

### Reversed surface colors

The initial shell used the correct two dark colors on the wrong elements. It looked plausible but did not match production.

The fix combined:

- Production source inspection.
- Screenshot pixel sampling.
- Identical viewport comparison.

**Lesson:** subtle dark-mode surfaces need exact ownership, not eyeballed color similarity.

### Oversized sidebar rows and icons

The initial navigation used MUI `fontSize="small"` and a custom 36px row. Production wrapped inherited-size icons in a 15px container and used the default sidebar row height.

The fix copied `NavList` structure and active classes, including the important modifiers already present in production.

**Lesson:** reuse the original wrapper structure. Icon props alone do not describe final rendered size.

### Static widget placeholders

The first lower widgets matched only the empty-state concept and did not use the production queries or populated cards.

The fix ported the original widget container and query behavior for revenue, orders, account balance, and payouts.

**Lesson:** a visual port should support both populated and empty states, even if the local screenshot currently shows only one.

### Incorrect mobile header

The first mobile header reused desktop notification/search actions. Production used the authenticated profile presentation and sidebar trigger.

The fix traced `MobileNav`, `TopbarRight`, and `PublicProfileDropdown` and copied their relevant structure.

**Lesson:** always inspect the mobile branch of the original component; do not infer it from desktop.

### Screenshots captured before chart animation completed

One comparison showed truncated blue chart lines. The implementation was correct; the screenshot was taken during the Recharts animation.

The fix was to wait for data and animation completion before capture.

**Lesson:** distinguish unstable capture timing from layout defects.

## Handling production/local data differences

The production comparison used `https://polar.sh/dashboard/kopia`, while local validation used a seeded organization. Differences included:

- Organization avatar and name.
- Free-plan upsell visibility.
- Active subscription count.
- Order history.
- Available balance.
- Payout history.

Do not hardcode production values to make screenshots match. Verify that the same source-derived component renders the correct state for each dataset.

A production free-plan card and a missing local card can both be correct if the subscription responses differ. Inspect requests and responses before changing rendering logic.

Use a temporary response listener when needed:

```bash
playwriter -s <session> -e '
state.failedResponses = []
state.localPage.on("response", (response) => {
  if (response.status() >= 400) {
    state.failedResponses.push({
      status: response.status(),
      url: response.url(),
    })
  }
})
await state.localPage.reload({ waitUntil: "domcontentloaded" })
await waitForPageLoad({ page: state.localPage, timeout: 8000 })
console.log("URL:", state.localPage.url())
console.log("Failed:", state.failedResponses)
console.log(
  "Logs:",
  await getLatestLogs({ page: state.localPage, sinceLastCall: true }),
)
state.localPage.removeAllListeners("response")
'
```

## Known dashboard-home migration boundaries

Do not assume every visible control in the current TanStack dashboard is fully migrated.

At the time this guide was written:

- The shared shell and overview route are present.
- Sidebar destination pages are still being migrated incrementally.
- Some sidebar links may intentionally be inactive.
- Metric customization and chart action menus require separate end-to-end verification before being treated as complete.
- New users without organizations still depend on onboarding routes that must be migrated separately.

When a new page makes one of these controls relevant, port the original behavior rather than extending the placeholder behavior.

## Suggested page-by-page migration order

Prefer a vertical slice over porting every shared dependency first:

1. Simple read-only organization page.
2. Its exact navigation destination and active state.
3. Query and permission handling.
4. Loading, empty, denied, and populated states.
5. Desktop/mobile parity.
6. One primary interaction.
7. Keep copied app-local code inside `web-tanstack`; do not extract cross-application primitives as part of migration work.

Good early candidates are pages with:

- One route.
- One or two read queries.
- No payment mutation.
- No complex editor.
- Existing local seeded data.

Defer high-risk flows such as payouts, account setup, product editors, checkout mutations, or destructive actions until the shared route and form patterns are proven.

## Completion checklist

### Source and scope

- [ ] Original route and all parent layouts were read.
- [ ] Imported production components, hooks, and utilities were traced.
- [ ] Required permissions and feature flags were recorded.
- [ ] In-scope interactions were explicitly identified.

### Routing and security

- [ ] Route is nested under the organization guard where appropriate.
- [ ] Metadata matches production.
- [ ] Typed route params are used.
- [ ] Anonymous redirect still works.
- [ ] Inaccessible organization returns 404.
- [ ] SSO-required behavior is preserved.
- [ ] API calls remain permission-protected.

### Data

- [ ] Generated client and `unwrap` are used.
- [ ] Query keys include every response-changing input.
- [ ] Queries are disabled when permission or required IDs are absent.
- [ ] Dates, currency, percentages, and scalar values use production formatting.
- [ ] Loading, empty, populated, and error states were tested.

### Visual parity

- [ ] Desktop production screenshot captured.
- [ ] Desktop local screenshot captured at the same viewport.
- [ ] Lower/scrolling content compared.
- [ ] Mobile production and local screenshots captured.
- [ ] Backgrounds, spacing, typography, borders, and scroll ownership compared.
- [ ] Data-specific differences were separated from implementation differences.
- [ ] Every copied `!important` modifier exists on the corresponding production element.

### Behavior

- [ ] Every original interaction, request, state transition, side effect, validation path, and error path is preserved.
- [ ] No functionality was removed, approximated, stubbed, or silently changed.
- [ ] Every code change from the original is strictly required by a Next.js-to-TanStack framework boundary.
- [ ] Main filter/action changes real requests or state.
- [ ] Reload behavior was checked.
- [ ] Hover, menus, dialogs, and mobile controls were checked where relevant.
- [ ] Browser logs were inspected after each interaction.
- [ ] Temporary Playwriter listeners were removed.

### Dependencies

- [ ] No new shared primitive or cross-application abstraction was introduced.
- [ ] Existing workspace primitives are reused without moving app-local code into shared packages.
- [ ] The Next.js application was not modified solely to support the migration.
- [ ] Every external dependency was added with `pnpm i` from the target package.
- [ ] `package.json` and `pnpm-lock.yaml` were not manually edited.
- [ ] `pnpm install --frozen-lockfile` passes from `clients/`.

### Static checks

- [ ] Routes regenerated.
- [ ] Formatting passes.
- [ ] Typecheck passes.
- [ ] Production build passes.
- [ ] `git diff --check` passes.
- [ ] New files remain below 250 lines.
- [ ] No unrelated files were modified.

## Final standard

A dashboard page is not complete because it renders or because its top-level screenshot looks plausible. It is complete only when it is functionally and visually equivalent to the original:

- Its route and access behavior match the original exactly.
- It uses the same backend protocol, payloads, ordering, and permission model.
- Every production state, interaction, side effect, validation path, analytics event, and error path is preserved.
- Desktop and mobile geometry are compared against production.
- Any remaining difference is caused only by real data or a strictly necessary, explicitly documented Next.js-to-TanStack framework boundary.
- All portable code and component structure remain the same as the original within the standalone TanStack application.
- No new primitive or abstraction is shared between the Next.js and TanStack applications as part of the migration.
- Framework-specific changes are minimal, isolated, and reviewable.

A migration with avoidable functional, structural, behavioral, or visual deviation is not acceptable.
