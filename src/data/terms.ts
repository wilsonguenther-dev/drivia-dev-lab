/**
 * Auto-generated from Wilson's CTO Vocabulary Guide PDF.
 * Source: ~/Desktop/_Organized/Drivia/Wilson-Developer-Vocab-Guide.pdf
 * Regenerate via `npm run parse-vocab`.
 *
 * DO NOT hand-edit. The PDF is the source of truth.
 */

export interface DevTerm {
  slug: string;
  title: string;
  chapterIndex: number;
  chapterTitle: string;
  plain: string;
  analogy?: string;
  example?: string;
  whenToUse?: string;
  watchOut?: string;
  rule?: string;
}

export interface DevChapter {
  index: number;
  title: string;
  blurb: string;
  terms: DevTerm[];
}

export const CHAPTERS: DevChapter[] = [
  {
    "index": 1,
    "title": "Testing",
    "blurb": "How engineers prove the code works without shipping it and hoping.",
    "terms": [
      {
        "slug": "unit-test",
        "title": "Unit test",
        "chapterIndex": 1,
        "chapterTitle": "Testing",
        "plain": "A test that checks one small piece of code — usually a single function — in isolation. No database, no network, no file system. Just: given this input, did the function return the right output?",
        "analogy": "Testing a single ingredient before you put it in the recipe. You taste the salt alone to make sure it's salt and not sugar. You don't need the whole soup to verify that.",
        "example": "A function calculateXP(lessonsCompleted, difficulty) in Drivia. You pass it (5, 'hard') and assert the return is 250. That's a unit test.",
        "whenToUse": "For pure logic: calculations, transformations, validators. Cheap, fast, and the first thing you write when a bug slips through.",
        "watchOut": "If your unit test needs the database or a network call, it isn't a unit test anymore — that's an integration test, and it's slower and flakier. Keep unit tests pure."
      },
      {
        "slug": "integration-test",
        "title": "Integration test",
        "chapterIndex": 1,
        "chapterTitle": "Testing",
        "plain": "A test that verifies two or more pieces work correctly together. Typically your code plus a real dependency: a database, an API, a queue.",
        "analogy": "Tasting the whole soup after you've added the salt, the broth, and the vegetables. You're not testing each ingredient — you're testing whether they play nice in the same pot.",
        "example": "Calling your Supabase insert function against a real test database and verifying the row actually lands with the right RLS policies applied.",
        "whenToUse": "When the risk isn't in any single function but in the boundary between them — your code meeting Postgres, your API meeting Stripe."
      },
      {
        "slug": "end-to-end-test",
        "title": "End-to-end test (E2E)",
        "chapterIndex": 1,
        "chapterTitle": "Testing",
        "plain": "A test that drives the entire system the way a real user would — open the browser, click the button, see the result.",
        "analogy": "Ordering a pizza online to make sure the restaurant works. You don't care about the oven or the driver in isolation; you care that a hungry person gets a pizza.",
        "example": "A Playwright test that logs into Drivia, starts a lesson, answers a quiz, and asserts the XP counter went up by the expected amount.",
        "whenToUse": "For critical user journeys you can't afford to break — signup, payment, the JAX tutor. One E2E test is worth a hundred unit tests for catching integration surprises.",
        "watchOut": "E2E tests are slow and flaky. If you have more than a few dozen, you'll hate them. Write them for the journeys that would cost you money if they broke."
      },
      {
        "slug": "tdd",
        "title": "TDD (Test-Driven Development)",
        "chapterIndex": 1,
        "chapterTitle": "Testing",
        "plain": "Write the failing test first, then write the code that makes it pass. Sounds backwards. Works surprisingly well. Four words that all mean ‘a fake version of something so the real thing doesn't get used in a test.’ The distinctions matter to pedants:",
        "analogy": "A carpenter marking the wood before cutting it. The test is your pencil line — it defines exactly where the code should land.",
        "example": "You want a function that formats currency. You write: expect(format(1234.5)).toBe('$1,234.50'). It fails because the function doesn't exist yet. Then you write the function until the test passes. A stub returns hard-coded answers ('always return user #1'). A mock is a stub that also records how it was called, so you can assert sendEmail was called once with these arguments. A spy wraps the real thing and just records calls. A fake is a working lightweight replacement — an in-memory database instead of Postgres.",
        "whenToUse": "When you're genuinely uncertain about the design. Writing the test first forces you to think about how the code will be used before you write it. Mock / Stub / Spy / Fake Whenever the real dependency is slow, flaky, expensive, or has side effects (sends email, charges a credit card). Never mock something you own — just use the real thing.",
        "watchOut": "Over-mocking makes tests that pass with broken production code. If the test and the thing it's testing are both fake, you're testing fiction."
      },
      {
        "slug": "fixture",
        "title": "Fixture",
        "chapterIndex": 1,
        "chapterTitle": "Testing",
        "plain": "Pre-built test data that your tests start from. 'A user with 3 completed lessons' is a fixture.",
        "analogy": "The set dressing on a movie stage. You don't rebuild the kitchen every time you shoot the kitchen scene — you keep it ready.",
        "example": "A seedTestUser() helper that creates a learner row, a subscription, and five lessons in one call, so every test can start from that baseline."
      },
      {
        "slug": "snapshot-test",
        "title": "Snapshot test",
        "chapterIndex": 1,
        "chapterTitle": "Testing",
        "plain": "A test that saves the output of a function the first time it runs, and then fails if the output ever changes.",
        "analogy": "Taking a photograph of your living room and checking it every week. If something moved, you want to know — even if you don't know what should be there.",
        "example": "Rendering a React component and saving the HTML. The next run compares the new HTML to the saved snapshot. If anyone changed the component accidentally, the test screams.",
        "watchOut": "Easy to abuse. People update the snapshot without reading it and the test becomes a rubber stamp. Review snapshot changes like you'd review code."
      },
      {
        "slug": "test-coverage",
        "title": "Test coverage",
        "chapterIndex": 1,
        "chapterTitle": "Testing",
        "plain": "The percentage of your code that gets executed when the test suite runs.",
        "analogy": "How much of the field the spotlight lights up. 100% coverage doesn't mean the code works — it means no line was untouched. You can still shoot yourself with a fully lit spotlight.",
        "rule": "coverage = (lines run by tests / total lines) × 100",
        "whenToUse": "As a floor, not a goal. Aim for 60-80% on business logic, 0% is fine on glue code. Chasing 100% produces garbage tests that exist to hit the number.",
        "watchOut": "Coverage measures execution, not verification. A test that runs a line but asserts nothing still counts toward coverage. Don't cargo-cult the number."
      },
      {
        "slug": "flaky-test",
        "title": "Flaky test",
        "chapterIndex": 1,
        "chapterTitle": "Testing",
        "plain": "A test that sometimes passes and sometimes fails on the same code.",
        "analogy": "A car that starts most mornings but not every morning. You can't trust it to take you to work.",
        "example": "A test that relies on setTimeout(500) and fails on a slow CI runner. Or a test that depends on the order other tests ran in.",
        "whenToUse": "Never. Flaky tests are worse than no tests because they teach the team to ignore red builds. Fix them or delete them.",
        "watchOut": "Root causes are almost always time (race conditions), shared state between tests, or real network calls. Find the cause; don't add retries."
      },
      {
        "slug": "regression",
        "title": "Regression",
        "chapterIndex": 1,
        "chapterTitle": "Testing",
        "plain": "A bug that re-appears after it was fixed. The code 'regressed.'",
        "example": "You fixed the XP calculator last sprint. This sprint, someone refactored the scoring service and the bug came back. That's a regression.",
        "whenToUse": "When you fix a bug, write a test for it the same day. That test becomes a regression test — its whole job is to scream if the bug ever returns."
      }
    ]
  },
  {
    "index": 2,
    "title": "Refactoring & Code Smells",
    "blurb": "Changing the shape of code without changing what it does.",
    "terms": [
      {
        "slug": "refactoring",
        "title": "Refactoring",
        "chapterIndex": 2,
        "chapterTitle": "Refactoring & Code Smells",
        "plain": "Changing the internal structure of code without changing its behavior. Same inputs, same outputs, different insides.",
        "analogy": "Reorganizing your garage. The same tools, boxes, and bikes are in there — but now you can actually find them. The car still parks the same way.",
        "example": "Extracting a 200-line handleCheckout function into five smaller functions, one per step (validate, charge, fulfill, email, log). The user still checks out identically, but the code is readable.",
        "whenToUse": "Before you add a feature to messy code. Cleaning up first makes the new feature take half the time. The ‘two hats’ rule: refactor with one hat, add features with the other — never both at once.",
        "watchOut": "Refactoring without tests is renovation without blueprints. Write tests first so you can prove behavior didn't change."
      },
      {
        "slug": "code-smell",
        "title": "Code smell",
        "chapterIndex": 2,
        "chapterTitle": "Refactoring & Code Smells",
        "plain": "A surface-level symptom that hints at a deeper problem. The code ‘smells off’ — not necessarily wrong, but suspicious.",
        "analogy": "A weird noise from your car engine. Might be nothing. Might be about to leave you stranded on I-35. A mechanic knows which noises matter.",
        "example": "A function with 400 lines, a file with 15 nested if statements, a class with 30 methods. None of these are illegal — they just reek."
      },
      {
        "slug": "dry",
        "title": "DRY (Don't Repeat Yourself)",
        "chapterIndex": 2,
        "chapterTitle": "Refactoring & Code Smells",
        "plain": "Every piece of knowledge should live in exactly one place. If you have the same business rule in three files, any change has to hunt all three down.",
        "analogy": "One source of truth for your wedding guest list. If you let your mom, your sister, and your venue each keep their own copy, they will disagree the day of.",
        "example": "Stripe pricing logic copy-pasted into checkout, invoices, and the admin dashboard. Extract it to lib/pricing.ts and import it everywhere.",
        "watchOut": "Juniors over-apply DRY. Two pieces of code that look the same but exist for different reasons should stay separate — deduping them creates coupling that hurts later. Rule of thumb: dedupe on the third occurrence."
      },
      {
        "slug": "kiss",
        "title": "KISS (Keep It Simple, Stupid)",
        "chapterIndex": 2,
        "chapterTitle": "Refactoring & Code Smells",
        "plain": "When in doubt, pick the boring solution. Simple code is cheaper to read, debug, and change. Cleverness is a debt you pay back with interest. Don't build something because you might need it someday. Build it when you actually need it.",
        "example": "A for loop is often better than a recursive reduce with three lambdas. YAGNI (You Aren't Gonna Need It) Adding multi-currency support to Drivia now because ‘we might expand to Europe’ is YAGNI. Ship USD. When Europe shows up, add it then — and you'll build it better with real requirements.",
        "whenToUse": "Every time a developer says 'let's make this flexible for the future.' The future almost never looks like they imagined."
      },
      {
        "slug": "solid",
        "title": "SOLID",
        "chapterIndex": 2,
        "chapterTitle": "Refactoring & Code Smells",
        "plain": "Five design principles for object-oriented code, named by the acronym: Single responsibility, Open/closed, Liskov substitution, Interface segregation, Dependency inversion.",
        "analogy": "Building codes for a house. None of them are laws of physics — they're hard-won rules that keep houses from collapsing.",
        "example": "Single responsibility: a class that sends email should only send email, not also calculate taxes. Dependency inversion: your checkout code should depend on an EmailSender interface, not directly on Resend, so you can swap providers.",
        "whenToUse": "SOLID is best as a lens, not a checklist. If your code is hard to test or hard to change, one of the SOLID principles is being violated. Ask which one."
      },
      {
        "slug": "technical-debt",
        "title": "Technical debt",
        "chapterIndex": 2,
        "chapterTitle": "Refactoring & Code Smells",
        "plain": "Shortcuts you took in code that you'll have to pay for later — with interest. Sometimes the shortcut is worth it; sometimes you should never have taken it.",
        "analogy": "Borrowing money. Sometimes a loan helps you buy a house you couldn't otherwise. Sometimes it's a payday loan that bleeds you for years. Tech debt is the same.",
        "example": "You copy-pasted the Stripe webhook handler three times to ship a deadline. It worked. Now every Stripe change means editing three places and forgetting one. That's the interest on the debt.",
        "whenToUse": "Deliberate tech debt to hit a deadline is fine — if you write down what you did and schedule the payoff. Undocumented tech debt is just a future outage with your name on it."
      },
      {
        "slug": "spaghetti-code",
        "title": "Spaghetti code",
        "chapterIndex": 2,
        "chapterTitle": "Refactoring & Code Smells",
        "plain": "Code where everything is tangled with everything else, so pulling on one strand moves ten others.",
        "example": "A React component that reads from three contexts, writes to a global Zustand store, side-effects into localStorage, and calls an API — all in one useEffect. Touch it and something you don't expect breaks."
      },
      {
        "slug": "god-object-god-class",
        "title": "God object / God class",
        "chapterIndex": 2,
        "chapterTitle": "Refactoring & Code Smells",
        "plain": "A class or file that knows too much and does too much. It becomes the center of the universe, and every change passes through it.",
        "example": "A UserManager class with 5,000 lines that handles auth, profiles, billing, email, notifications, and the kitchen sink. Break it up."
      }
    ]
  },
  {
    "index": 3,
    "title": "Change Management & Blast Radius",
    "blurb": "How engineers reason about the cost of getting it wrong.",
    "terms": [
      {
        "slug": "blast-radius",
        "title": "Blast radius",
        "chapterIndex": 3,
        "chapterTitle": "Change Management & Blast Radius",
        "plain": "How much damage a bad deploy, a bad query, or a bad decision can do. 'Small blast radius' = you only break yourself. 'Large blast radius' = you break every paying customer.",
        "analogy": "A firework in your backyard vs. a firework in a gas station. Same spark, very different consequences.",
        "example": "Running a migration on one tenant's database = small blast radius. Running it on the shared production Postgres during business hours = large blast radius.",
        "whenToUse": "Every time before you push, run, delete, or force-push. Ask: if this is wrong, who pays? If the answer is 'everyone,' slow down and get a second set of eyes.",
        "watchOut": "The most dangerous blast radius is the one you didn't see coming. Shared databases, shared caches, shared queues — they look local and turn out to be global."
      },
      {
        "slug": "feature-flag",
        "title": "Feature flag",
        "chapterIndex": 3,
        "chapterTitle": "Change Management & Blast Radius",
        "plain": "A switch in code that lets you turn a feature on or off without redeploying. New code ships dark, then you flip it on for 1% of users, then 10%, then everyone.",
        "analogy": "A dimmer switch instead of a light switch. You can turn on a feature just a little to see how it goes, then crank it up when you're confident.",
        "example": "Wrap the new JAX tutor in a flag jax_v2_enabled. Ship the code. Enable it for your own account first. Then internal admins. Then 1% of learners. At every step you can kill it in 10 seconds without a deploy.",
        "whenToUse": "Anytime a change could break things. Feature flags convert a scary deploy into a boring one and a rollback into a config change."
      },
      {
        "slug": "canary-deploy",
        "title": "Canary deploy",
        "chapterIndex": 3,
        "chapterTitle": "Change Management & Blast Radius",
        "plain": "Rolling out a new version to a tiny slice of traffic first. If the canary (small sample of users) is fine, you push to more. If it dies, you roll back.",
        "analogy": "Miners used to send a canary into the mineshaft. If the bird survived, the air was safe. Same idea with less bird cruelty.",
        "example": "Vercel routes 5% of traffic to the new Drivia build for 15 minutes. If error rates don't spike, the rest of traffic flips over."
      },
      {
        "slug": "blue-green-deploy",
        "title": "Blue-green deploy",
        "chapterIndex": 3,
        "chapterTitle": "Change Management & Blast Radius",
        "plain": "Run two full copies of production (blue and green). Blue is live; green is the new version. Once green is ready, flip the router — one second, everyone's on green. If green breaks, flip back.",
        "analogy": "Two identical stages at a concert. The band sets up on stage B while the old band plays on stage A. The lights flip over instantly and nobody missed a beat."
      },
      {
        "slug": "rollback",
        "title": "Rollback",
        "chapterIndex": 3,
        "chapterTitle": "Change Management & Blast Radius",
        "plain": "Reverting a bad deploy to the previous version.",
        "whenToUse": "Fast, always fast. The moment you suspect a deploy is bad, roll back first, then investigate. Don't debug in prod while customers are angry."
      },
      {
        "slug": "hotfix",
        "title": "Hotfix",
        "chapterIndex": 3,
        "chapterTitle": "Change Management & Blast Radius",
        "plain": "An emergency patch that skips the normal release train because something is actively broken in production.",
        "watchOut": "Hotfixes are how bugs get worse. A hotfix with no tests and no review is how you cause the second outage while fixing the first. Keep hotfixes tiny and paired with at least one other engineer."
      },
      {
        "slug": "idempotent",
        "title": "Idempotent",
        "chapterIndex": 3,
        "chapterTitle": "Change Management & Blast Radius",
        "plain": "An operation you can run many times and the result is the same as running it once. Safe to retry.",
        "analogy": "Pressing the elevator button. Hitting it ten times is the same as hitting it once — the elevator still comes. Compare that to pushing the gas pedal, which is not idempotent.",
        "example": "‘Set user's plan to pro’ is idempotent. ‘Charge the user $29’ is NOT — retry it and you double-charge them. Use idempotency keys on payment operations so retries are safe.",
        "rule": "f(f(x)) = f(x)",
        "whenToUse": "Anytime a request might be retried: webhooks, background jobs, anything over a flaky network. Design operations to be idempotent by default."
      },
      {
        "slug": "graceful-degradation",
        "title": "Graceful degradation",
        "chapterIndex": 3,
        "chapterTitle": "Change Management & Blast Radius",
        "plain": "When a part of the system fails, the rest keeps working — just worse.",
        "example": "If the AI provider is down, Drivia shows the last cached response and a ‘JAX is taking a nap’ banner instead of blowing up the whole lesson page."
      }
    ]
  },
  {
    "index": 4,
    "title": "Architecture & System Design",
    "blurb": "How the pieces fit together at the highest level.",
    "terms": [
      {
        "slug": "monolith",
        "title": "Monolith",
        "chapterIndex": 4,
        "chapterTitle": "Architecture & System Design",
        "plain": "One big codebase that does everything. Frontend, backend, database, auth, billing — all in one repo, deployed as one unit.",
        "analogy": "A single big-box store. Everything under one roof, one manager, one opening hour. Efficient and simple until the store gets too big to run.",
        "example": "Early Drivia was a monolith and that was correct. One Next.js app handles everything. You can ship features fast because there's no cross-service coordination.",
        "whenToUse": "Almost always, until you have at least 20 engineers or a clear scaling bottleneck. Most ‘microservices’ startups would've shipped faster as monoliths.",
        "watchOut": "‘Monolith’ is often used as an insult, which is junior thinking. A clean monolith beats messy microservices every day of the week."
      },
      {
        "slug": "microservices",
        "title": "Microservices",
        "chapterIndex": 4,
        "chapterTitle": "Architecture & System Design",
        "plain": "Many small codebases, each owning one capability (auth, billing, search), each deployed independently, talking to each other over the network.",
        "analogy": "A mall instead of a big-box store. Each store has its own owner, hours, and inventory. Way more flexibility — and way more hallways and security and rent.",
        "example": "Netflix has hundreds of microservices — one for recommendations, one for video streaming, one for billing. It works because Netflix has thousands of engineers.",
        "whenToUse": "When you have enough engineers to staff each service and the org is hurting from teams stepping on each other in one codebase. Rarely the right call for a small company.",
        "watchOut": "Microservices trade code complexity for operational complexity. You now have 40 deploys, 40 databases, 40 alert channels. The bugs move from ‘hard to find in code’ to ‘hard to find across the network.’"
      },
      {
        "slug": "serverless",
        "title": "Serverless",
        "chapterIndex": 4,
        "chapterTitle": "Architecture & System Design",
        "plain": "Code that runs only when it's called and you don't manage the server. You upload a function; the cloud runs it on demand and bills you per invocation. Four ways to render a webpage. CSR = Client-Side Rendering (browser builds the page in JS). SSR = Server-Side Rendering (server builds the HTML per request). SSG = Static Site Generation (HTML built once at deploy time). ISR = Incremental Static Regeneration (static, but refreshes on a schedule).",
        "analogy": "Uber instead of owning a car. You don't pay for a parked car — you pay when you ride. Great for unpredictable usage, expensive if you ride 24/7.",
        "example": "Supabase Edge Functions. Vercel serverless routes. AWS Lambda. Drivia's generate-course edge function is serverless — it only runs when an intake form is submitted. A blog post — SSG (never changes). A user's dashboard — SSR (personalized per request). Drivia's marketing pages are SSG. The dashboard is SSR.",
        "whenToUse": "Bursty or unpredictable workloads. APIs that get 100 requests one hour and 0 the next. Default to static. Use SSR when the page depends on the user. Use ISR when the page is static but needs to update every few minutes (catalog pages).",
        "watchOut": "Cold starts (the first call after idle is slow). Per-invocation pricing that bites at scale. And you're locked into the cloud provider's runtime quirks. SSR / SSG / ISR / CSR React Server Components and the App Router muddy all these terms. The modern answer is 'render the page on the server, stream chunks to the client, hydrate the interactive parts.' Don't fight the framework; learn its model."
      },
      {
        "slug": "cdn",
        "title": "CDN (Content Delivery Network)",
        "chapterIndex": 4,
        "chapterTitle": "Architecture & System Design",
        "plain": "A network of servers around the world that cache your static content (images, JS, CSS) near your users. A learner in Tokyo hits a CDN node in Tokyo, not your server in Virginia.",
        "analogy": "Franchise restaurants. McDonald's doesn't fly burgers from Illinois — they have a location near you. CDNs do the same thing with your files.",
        "example": "Cloudflare, Vercel Edge Network, AWS CloudFront. Drivia's static assets and marketing HTML are served from Vercel's CDN.",
        "whenToUse": "Always, for static files. The performance gain is free and massive."
      },
      {
        "slug": "edge-computing",
        "title": "Edge computing",
        "chapterIndex": 4,
        "chapterTitle": "Architecture & System Design",
        "plain": "Running your code at the CDN level, close to the user — not in a single data center. Latency drops from 200ms to 20ms.",
        "example": "Vercel Edge Functions, Cloudflare Workers. Great for A/B testing, geolocation, and personalization that needs to happen before the page renders."
      },
      {
        "slug": "load-balancer",
        "title": "Load balancer",
        "chapterIndex": 4,
        "chapterTitle": "Architecture & System Design",
        "plain": "A traffic cop that spreads incoming requests across multiple servers so no single server gets slammed.",
        "analogy": "The host at a busy restaurant sending you to an open table. Without them, everyone piles up at one booth and the rest sit empty."
      },
      {
        "slug": "horizontal-vs-vertical-scaling",
        "title": "Horizontal vs vertical scaling",
        "chapterIndex": 4,
        "chapterTitle": "Architecture & System Design",
        "plain": "Vertical = make the server bigger (more CPU, more RAM). Horizontal = add more servers and share the load.",
        "analogy": "Vertical: buying a bigger truck. Horizontal: buying more trucks. The bigger truck has a ceiling; more trucks scale forever (until the roads jam).",
        "whenToUse": "Default to horizontal. Vertical is a temporary patch; horizontal is the architecture that survives success."
      },
      {
        "slug": "stateless-vs-stateful",
        "title": "Stateless vs stateful",
        "chapterIndex": 4,
        "chapterTitle": "Architecture & System Design",
        "plain": "Stateless = each request contains everything the server needs; the server remembers nothing between requests. Stateful = the server remembers you.",
        "analogy": "Stateless is a vending machine (put in money, get a snack, it doesn't care who you are). Stateful is your barber (remembers your usual cut).",
        "whenToUse": "Stateless web apps scale horizontally with zero effort — any server can handle any request. Push state into the database or Redis, not into the server's memory."
      },
      {
        "slug": "cache",
        "title": "Cache",
        "chapterIndex": 4,
        "chapterTitle": "Architecture & System Design",
        "plain": "Temporary storage of expensive-to-compute results so you don't redo the work.",
        "analogy": "Keeping milk in the fridge instead of driving to the store every time you want cereal. Fast, until the milk goes bad — which is why caches need expiration.",
        "example": "Caching the ‘top 10 lessons’ query result in Redis for 5 minutes. Instead of hitting Postgres 10,000 times per hour, you hit it 12 times.",
        "watchOut": "“There are only two hard problems in computer science: cache invalidation, naming things, and off-by-one errors.” Cache invalidation means: knowing when the cached copy is stale and needs to be refreshed. It is much harder than it looks."
      },
      {
        "slug": "queue",
        "title": "Queue",
        "chapterIndex": 4,
        "chapterTitle": "Architecture & System Design",
        "plain": "A list of jobs waiting to be processed, in order. Producers add jobs to the back; workers pull jobs from the front.",
        "analogy": "A line at the DMV. You take a ticket (produce), you wait, a clerk calls your number (consume). More clerks = faster line.",
        "example": "Drivia's course generation queue. When a Scholars' Day attendee submits the form, the job goes in the queue. A worker picks it up, runs the edge function, and sends the email."
      },
      {
        "slug": "pub-sub",
        "title": "Pub/Sub (Publish/Subscribe)",
        "chapterIndex": 4,
        "chapterTitle": "Architecture & System Design",
        "plain": "A pattern where publishers broadcast events and subscribers listen for the ones they care about. The publisher doesn't know who's listening.",
        "analogy": "A radio station. The DJ plays a song; anyone with a radio can tune in. The DJ doesn't have a list of listeners.",
        "example": "Supabase Realtime. Your app publishes ‘lesson_completed’; the leaderboard, the XP tracker, and the notification service all subscribe and update independently."
      }
    ]
  },
  {
    "index": 5,
    "title": "Design Patterns",
    "blurb": "Proven solutions to problems developers keep running into.",
    "terms": [
      {
        "slug": "mvc",
        "title": "MVC (Model-View-Controller)",
        "chapterIndex": 5,
        "chapterTitle": "Design Patterns",
        "plain": "Split your app into three layers: Model (data and business rules), View (what the user sees), Controller (glue that responds to input).",
        "analogy": "A restaurant. The kitchen is the model (makes the food). The dining room is the view (where you eat). The waiter is the controller (takes your order, brings the food, handles complaints)."
      },
      {
        "slug": "dependency-injection",
        "title": "Dependency injection (DI)",
        "chapterIndex": 5,
        "chapterTitle": "Design Patterns",
        "plain": "Instead of a class creating its own dependencies, you pass them in from outside. Makes testing and swapping providers trivial.",
        "example": "Bad: class EmailService { resend = new Resend() }. Good: class EmailService { constructor(provider) {} }. Now in tests you pass a fake provider; in prod you pass Resend.",
        "whenToUse": "Whenever a class talks to the outside world (database, API, file system). DI is how you keep your business logic testable."
      },
      {
        "slug": "factory",
        "title": "Factory",
        "chapterIndex": 5,
        "chapterTitle": "Design Patterns",
        "plain": "A function whose job is to create objects, often choosing which kind to create based on input.",
        "example": "A createPaymentProvider(country) that returns a Stripe client for most countries, Adyen for Brazil, and a mock for tests."
      },
      {
        "slug": "singleton",
        "title": "Singleton",
        "chapterIndex": 5,
        "chapterTitle": "Design Patterns",
        "plain": "A class where only one instance is ever created, shared everywhere.",
        "example": "A database connection pool. You want one pool, not 500.",
        "watchOut": "Abused constantly. Singletons are global variables in a suit. They make testing painful because tests can't get a fresh one. Use sparingly."
      },
      {
        "slug": "observer",
        "title": "Observer",
        "chapterIndex": 5,
        "chapterTitle": "Design Patterns",
        "plain": "An object announces when something changes; any other object that cares subscribes and gets notified.",
        "example": "React's useState. When state changes, every component that reads it re-renders. That's the observer pattern — you just don't see the plumbing."
      },
      {
        "slug": "adapter",
        "title": "Adapter",
        "chapterIndex": 5,
        "chapterTitle": "Design Patterns",
        "plain": "A wrapper that makes one interface look like another. Glue between two things that weren't designed to talk.",
        "example": "Your code expects an ILogger interface, but the library you want to use has winston.info(). You write a WinstonAdapter that exposes ILogger and forwards calls to winston."
      },
      {
        "slug": "middleware",
        "title": "Middleware",
        "chapterIndex": 5,
        "chapterTitle": "Design Patterns",
        "plain": "A function that runs between the request and the handler. Each middleware can inspect, modify, reject, or pass the request along.",
        "analogy": "Airport security. Every passenger walks through it on the way to the gate. Security inspects, stops some, lets most pass.",
        "example": "Next.js middleware that checks for a valid auth cookie before letting the request reach the dashboard. If there's no cookie, redirect to login."
      }
    ]
  },
  {
    "index": 6,
    "title": "Data Structures",
    "blurb": "The shapes data takes in memory and why each shape matters.",
    "terms": [
      {
        "slug": "array",
        "title": "Array",
        "chapterIndex": 6,
        "chapterTitle": "Data Structures",
        "plain": "An ordered list of values, indexed by position. Keys mapped to values, with lightning-fast lookup by key.",
        "analogy": "A row of numbered mailboxes. You go to mailbox 7 and grab whatever's inside. The index at the back of a textbook. You want ‘photosynthesis’ — you look it up and it tells you page 243. You don't flip through every page.",
        "rule": "access = O(1), insert/delete in middle = O(n) lookup = O(1) average, O(n) worst case",
        "whenToUse": "When order matters and you mostly access by index or iterate top-to-bottom. Hash map / Hash table / Dictionary When you ask 'give me the thing with this key' a lot. This is 90% of what you'll build with.",
        "example": "userIdToProfile[userId] — instant lookup of any user's profile by their ID. Far faster than scanning a list."
      },
      {
        "slug": "set",
        "title": "Set",
        "chapterIndex": 6,
        "chapterTitle": "Data Structures",
        "plain": "A collection of unique values. No duplicates, no ordering guarantees.",
        "example": "Tracking which lesson IDs a user has completed. Adding the same ID twice is a no-op. Checking if they completed it is instant."
      },
      {
        "slug": "linked-list",
        "title": "Linked list",
        "chapterIndex": 6,
        "chapterTitle": "Data Structures",
        "plain": "A chain of nodes where each node points to the next. Insert and delete are fast; random access is slow.",
        "whenToUse": "Rarely, in modern app code. Useful when you're building low-level structures (queues, undo stacks) and need cheap insertion in the middle."
      },
      {
        "slug": "stack",
        "title": "Stack (LIFO)",
        "chapterIndex": 6,
        "chapterTitle": "Data Structures",
        "plain": "Last In, First Out. You push things on top and pop things off the top.",
        "analogy": "A stack of plates. You grab from the top, you add to the top. The plate at the bottom waits forever.",
        "example": "The browser's back button. Every page you visit gets pushed. Back pops the top."
      },
      {
        "slug": "queue",
        "title": "Queue (FIFO)",
        "chapterIndex": 6,
        "chapterTitle": "Data Structures",
        "plain": "First In, First Out. You add to the back and take from the front.",
        "analogy": "A line at Starbucks. First person in line is first to get coffee.",
        "example": "A job queue. Tasks come in, workers pull them in order."
      },
      {
        "slug": "tree",
        "title": "Tree",
        "chapterIndex": 6,
        "chapterTitle": "Data Structures",
        "plain": "A hierarchical structure: one root node, each node has children. No cycles.",
        "analogy": "A family tree. One ancestor at the top, branches below. You can always trace back to the root.",
        "example": "The DOM (HTML document). html is the root; body and head are children; everything nests from there."
      },
      {
        "slug": "binary-search-tree",
        "title": "Binary search tree",
        "chapterIndex": 6,
        "chapterTitle": "Data Structures",
        "plain": "A tree where each node has at most two children, and left children are smaller, right children are larger.",
        "rule": "search = O(log n) if balanced, O(n) if degenerate",
        "whenToUse": "When you need sorted data with fast lookup, insertion, and deletion."
      },
      {
        "slug": "graph",
        "title": "Graph",
        "chapterIndex": 6,
        "chapterTitle": "Data Structures",
        "plain": "Nodes connected by edges. Can have cycles. The most flexible data structure — almost anything in the real world can be modeled as a graph.",
        "example": "Social networks (people are nodes, friendships are edges). Google Maps (cities are nodes, roads are edges). A learning graph in Drivia (concepts are nodes, ‘prerequisite of’ is an edge)."
      },
      {
        "slug": "heap-priority-queue",
        "title": "Heap / Priority queue",
        "chapterIndex": 6,
        "chapterTitle": "Data Structures",
        "plain": "A queue where the item with the highest (or lowest) priority always comes out first, regardless of insertion order.",
        "example": "An ER waiting room. A heart attack jumps ahead of a sprained ankle, even if the sprain showed up first.",
        "whenToUse": "Task schedulers, A* pathfinding, top-K problems ('give me the 10 most recent lessons')."
      }
    ]
  },
  {
    "index": 7,
    "title": "Algorithms & Big O Notation",
    "blurb": "How fast a thing is when the data grows.",
    "terms": [
      {
        "slug": "big-o-notation",
        "title": "Big O notation",
        "chapterIndex": 7,
        "chapterTitle": "Algorithms & Big O Notation",
        "plain": "A way to describe how an algorithm's speed scales with input size. It ignores constants and focuses on the shape of the growth.",
        "example": "Finding a user in a hash map = O(1) (instant, doesn't matter if you have 10 or 10 million users). Sorting a list = O(n log n). Checking all pairs in a list = O(n²).",
        "rule": "O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2■) < O(n!)",
        "whenToUse": "Every code review where someone writes a nested loop over a big table. The question 'what's the Big O of this?' is how you catch a slow query before it hits production.",
        "watchOut": "Big O is about scaling, not raw speed. O(n²) on 10 items is faster than O(n log n) on 10 million. Don't optimize blindly — profile first."
      },
      {
        "slug": "o-constant-time",
        "title": "O(1) — Constant time",
        "chapterIndex": 7,
        "chapterTitle": "Algorithms & Big O Notation",
        "plain": "Same speed no matter how big the input. Hash map lookup, array index, pushing to a stack.",
        "example": "users[userId] takes the same time whether users has 10 or 10 million entries."
      },
      {
        "slug": "o-logarithmic-time",
        "title": "O(log n) — Logarithmic time",
        "chapterIndex": 7,
        "chapterTitle": "Algorithms & Big O Notation",
        "plain": "Doubling the input adds only one more step. Binary search is the classic example.",
        "analogy": "Guessing a number 1-1000. 'Higher or lower' gets you there in 10 guesses, not 1000. Every guess cuts the remaining range in half."
      },
      {
        "slug": "o-linear-time",
        "title": "O(n) — Linear time",
        "chapterIndex": 7,
        "chapterTitle": "Algorithms & Big O Notation",
        "plain": "Twice the input, twice the work. Scanning a list, printing every element.",
        "example": "array.filter(fn) — has to look at every element."
      },
      {
        "slug": "o-quadratic-time",
        "title": "O(n²) — Quadratic time",
        "chapterIndex": 7,
        "chapterTitle": "Algorithms & Big O Notation",
        "plain": "Twice the input, four times the work. Usually a nested loop.",
        "example": "Checking every user against every other user for duplicates. 1000 users = 1,000,000 comparisons. Painful on big data."
      },
      {
        "slug": "binary-search",
        "title": "Binary search",
        "chapterIndex": 7,
        "chapterTitle": "Algorithms & Big O Notation",
        "plain": "Searching a sorted list by repeatedly halving the remaining range.",
        "rule": "lo = 0; hi = arr.length - 1 while (lo <= hi) { const mid = (lo + hi) >> 1; if (arr[mid] === target) return mid; if (arr[mid] < target) lo = mid + 1; else hi = mid - 1; } return -1;"
      },
      {
        "slug": "recursion",
        "title": "Recursion",
        "chapterIndex": 7,
        "chapterTitle": "Algorithms & Big O Notation",
        "plain": "A function that calls itself with a smaller version of the problem, until it hits a base case.",
        "analogy": "Russian nesting dolls. To count them, you count yourself (1), then count the smaller one inside. Eventually you hit the smallest doll with nothing inside — the base case.",
        "example": "Calculating a factorial: factorial(n) = n * factorial(n - 1), with factorial(0) = 1 as the base case.",
        "watchOut": "Forgetting the base case = infinite recursion = stack overflow. Every recursive function needs a clear exit."
      },
      {
        "slug": "memoization",
        "title": "Memoization",
        "chapterIndex": 7,
        "chapterTitle": "Algorithms & Big O Notation",
        "plain": "Caching the result of a function call so the next time you ask with the same input, you skip the work.",
        "analogy": "The first time someone asks you how to get to the DMV, you figure it out. The second time, you just recite the directions from memory.",
        "example": "Fibonacci without memoization is O(2■). With memoization it's O(n). Same algorithm, massive difference."
      },
      {
        "slug": "dynamic-programming",
        "title": "Dynamic programming",
        "chapterIndex": 7,
        "chapterTitle": "Algorithms & Big O Notation",
        "plain": "Breaking a problem into smaller overlapping sub-problems, solving each once, and reusing the answers. Memoization is a form of DP.",
        "whenToUse": "Interview questions and certain real problems (pathfinding, diff algorithms, sequence alignment). Not something you do casually in product code."
      },
      {
        "slug": "greedy-algorithm",
        "title": "Greedy algorithm",
        "chapterIndex": 7,
        "chapterTitle": "Algorithms & Big O Notation",
        "plain": "At every step, pick the best local option and hope it adds up to the best global answer.",
        "example": "Making change for $0.67 with US coins: pick the biggest coin that fits each time. Works for US coins, fails for some other currencies."
      },
      {
        "slug": "hashing",
        "title": "Hashing",
        "chapterIndex": 7,
        "chapterTitle": "Algorithms & Big O Notation",
        "plain": "Converting a chunk of data into a fixed-size number via a deterministic function. Same input → same output, always.",
        "example": "sha256('hello') = 2cf24d.... The output looks random but it's reproducible. Used for hash maps, file integrity checks, passwords, and blockchain."
      }
    ]
  },
  {
    "index": 8,
    "title": "Async, Concurrency & Race Conditions",
    "blurb": "How code handles multiple things happening at once.",
    "terms": [
      {
        "slug": "synchronous-vs-asynchronous",
        "title": "Synchronous vs asynchronous",
        "chapterIndex": 8,
        "chapterTitle": "Async, Concurrency & Race Conditions",
        "plain": "Synchronous = one thing at a time, in order. Asynchronous = start something, walk away, come back when it's done.",
        "analogy": "Synchronous = standing in line at the microwave waiting for your food. Asynchronous = starting the microwave and going back to your desk until it beeps."
      },
      {
        "slug": "callback",
        "title": "Callback",
        "chapterIndex": 8,
        "chapterTitle": "Async, Concurrency & Race Conditions",
        "plain": "A function you pass to another function, to be called when that function is done. The OG way async worked in JavaScript.",
        "example": "fs.readFile('x.txt', (err, data) => { ... }). When the read finishes, your callback runs.",
        "watchOut": "Callbacks nested in callbacks nested in callbacks = 'callback hell'. Use promises or async/await to flatten it."
      },
      {
        "slug": "promise",
        "title": "Promise",
        "chapterIndex": 8,
        "chapterTitle": "Async, Concurrency & Race Conditions",
        "plain": "An object that represents a future result — a value that isn't available yet but will be. Syntactic sugar over promises that makes async code look synchronous. async function loadCourse(id) { const course = await db.courses.get(id); const lessons = await db.lessons.forCourse(id); return { course, lessons }; }",
        "analogy": "A pizza order receipt. The pizza isn't here yet, but the receipt is a promise it will be (or that you'll get your money back).",
        "example": "fetch(url).then(r => r.json()).catch(handleError) async / await",
        "whenToUse": "Default for modern JavaScript/TypeScript. Way easier to read and debug than .then() chains."
      },
      {
        "slug": "race-condition",
        "title": "Race condition",
        "chapterIndex": 8,
        "chapterTitle": "Async, Concurrency & Race Conditions",
        "plain": "A bug where the outcome depends on the timing of events that shouldn't matter. Two things happen at almost the same time and corrupt each other.",
        "example": "User clicks ‘Save’ twice fast. Both requests read the old profile, both write their version. The second write silently overwrites the first.",
        "whenToUse": "To describe the class of bugs that only happen in production, only sometimes, only under load, and nobody can reproduce in dev.",
        "watchOut": "Race conditions are the hardest bugs to debug. The fix is usually a database transaction, an optimistic lock (update where version = X), or a queue."
      },
      {
        "slug": "deadlock",
        "title": "Deadlock",
        "chapterIndex": 8,
        "chapterTitle": "Async, Concurrency & Race Conditions",
        "plain": "Two operations each holding a resource the other needs, and neither will let go. Everything freezes.",
        "analogy": "Two cars at a one-lane bridge, nose-to-nose. Neither backs up. Traffic stops forever.",
        "example": "Transaction A locks row 1 and waits for row 2. Transaction B locks row 2 and waits for row 1. Postgres detects this and kills one of them."
      },
      {
        "slug": "mutex-lock",
        "title": "Mutex / Lock",
        "chapterIndex": 8,
        "chapterTitle": "Async, Concurrency & Race Conditions",
        "plain": "A gate that lets exactly one thread or process hold something at a time. Everyone else waits.",
        "example": "lock.acquire() — do work — lock.release(). If someone else called acquire first, you wait your turn."
      },
      {
        "slug": "debounce",
        "title": "Debounce",
        "chapterIndex": 8,
        "chapterTitle": "Async, Concurrency & Race Conditions",
        "plain": "Wait until a burst of events has stopped before actually running the handler. Typing-triggered searches use this.",
        "example": "A search box that waits 300ms after the user stops typing before hitting the API. Typing 'lesson' triggers one request instead of six.",
        "whenToUse": "Search-as-you-type, window resize handlers, form validation on input."
      },
      {
        "slug": "throttle",
        "title": "Throttle",
        "chapterIndex": 8,
        "chapterTitle": "Async, Concurrency & Race Conditions",
        "plain": "Allow a handler to run at most once per time window. Extra calls are dropped (or delayed to the next window).",
        "example": "A scroll handler that runs at most once every 100ms instead of 60 times a second.",
        "whenToUse": "Scroll/resize/mouse-move handlers. Rate-limiting API calls from the client."
      },
      {
        "slug": "backpressure",
        "title": "Backpressure",
        "chapterIndex": 8,
        "chapterTitle": "Async, Concurrency & Race Conditions",
        "plain": "When a consumer can't keep up with a producer, and you need a way to slow the producer down instead of dropping data or running out of memory.",
        "example": "Your course generation queue is filling up faster than workers can drain it. Backpressure tells the intake endpoint ‘stop accepting new jobs for a minute.’"
      }
    ]
  },
  {
    "index": 9,
    "title": "Databases",
    "blurb": "Where your data lives and how you talk to it.",
    "terms": [
      {
        "slug": "sql-vs-nosql",
        "title": "SQL vs NoSQL",
        "chapterIndex": 9,
        "chapterTitle": "Databases",
        "plain": "SQL = tables with strict columns, joined by relationships, queried by a standard language (Postgres, MySQL). NoSQL = looser schemas, documents or key-value pairs, often faster to iterate on but harder to query (MongoDB, DynamoDB, Firestore).",
        "whenToUse": "Default to SQL (Postgres specifically). NoSQL is tempting for its schema-less start but punishes you the moment you need relationships, reports, or consistency guarantees."
      },
      {
        "slug": "acid",
        "title": "ACID",
        "chapterIndex": 9,
        "chapterTitle": "Databases",
        "plain": "Four guarantees a real database gives you: Atomicity (transactions happen fully or not at all), Consistency (valid data in, valid data out), Isolation (concurrent transactions don't see each other's half-done work), Durability (once committed, it survives a crash).",
        "example": "Transferring money between bank accounts. Atomicity means the withdrawal and the deposit either both happen or neither does. Without ACID, you get lost money."
      },
      {
        "slug": "transaction",
        "title": "Transaction",
        "chapterIndex": 9,
        "chapterTitle": "Databases",
        "plain": "A group of database operations that either all succeed or all fail together. BEGIN; UPDATE accounts SET balance = balance - 100 WHERE id = 1; UPDATE accounts SET balance = balance + 100 WHERE id = 2; COMMIT;",
        "whenToUse": "Any time two or more writes have to agree on reality."
      },
      {
        "slug": "index",
        "title": "Index",
        "chapterIndex": 9,
        "chapterTitle": "Databases",
        "plain": "A sorted lookup structure on one or more columns that makes queries against those columns dramatically faster.",
        "analogy": "The index at the back of a book. Without it, you read every page to find 'photosynthesis.' With it, you flip to page 243 in one step.",
        "example": "Adding an index on lessons.learning_path_id so pulling all lessons for a course drops from 2 seconds to 2 milliseconds.",
        "rule": "Query without index: O(n). Query with index: O(log n).",
        "watchOut": "Indexes speed up reads but slow down writes (every insert has to update the index). Index the columns you query by, not every column you have."
      },
      {
        "slug": "join",
        "title": "Join",
        "chapterIndex": 9,
        "chapterTitle": "Databases",
        "plain": "Combining rows from two tables based on a shared column.",
        "example": "Pulling a user and their subscription in one query instead of two. SELECT u.name, s.plan FROM users u JOIN subscriptions s ON s.user_id = u.id WHERE s.plan = 'pro';"
      },
      {
        "slug": "normalization",
        "title": "Normalization",
        "chapterIndex": 9,
        "chapterTitle": "Databases",
        "plain": "Organizing data so each fact lives in exactly one place. Reduces storage and prevents update anomalies.",
        "example": "Bad: every orders row stores the customer's address. If they move, you have to update every order. Good: orders has a customer_id; address lives in the customers table once."
      },
      {
        "slug": "denormalization",
        "title": "Denormalization",
        "chapterIndex": 9,
        "chapterTitle": "Databases",
        "plain": "Deliberately duplicating data to make reads faster, accepting the cost of keeping copies in sync.",
        "whenToUse": "When read performance matters more than write simplicity — analytics dashboards, leaderboards, feeds."
      },
      {
        "slug": "n-1-query-problem",
        "title": "N+1 query problem",
        "chapterIndex": 9,
        "chapterTitle": "Databases",
        "plain": "A performance bug where loading N items triggers N+1 database queries instead of 1 or 2.",
        "example": "Fetching 100 users, then for each one fetching their profile = 1 + 100 = 101 queries. The fix: a single JOIN or an IN query.",
        "watchOut": "ORMs hide this. You write user.posts.forEach(...) and it looks innocent. Turn on query logging and watch the database scream."
      },
      {
        "slug": "migration",
        "title": "Migration",
        "chapterIndex": 9,
        "chapterTitle": "Databases",
        "plain": "A script that changes the database schema (add a column, create a table, add an index) in a reproducible, versioned way.",
        "example": "20260411_add_live_intake_source.sql. Run in dev, staging, prod in order. Everyone's database stays in sync.",
        "whenToUse": "Every schema change, without exception. Never edit the schema by hand in prod — you lose the audit trail and break every other environment."
      },
      {
        "slug": "rls",
        "title": "RLS (Row-Level Security)",
        "chapterIndex": 9,
        "chapterTitle": "Databases",
        "plain": "Database-enforced rules that decide which rows a user can see or modify. Policies run inside Postgres; the app can't bypass them.",
        "example": "Drivia's RLS policy: user can only SELECT their own rows from lesson_progress. Even if someone bypasses the app, the database refuses.",
        "whenToUse": "Multi-tenant SaaS. RLS is your last line of defense — an app bug should not turn into a data leak."
      },
      {
        "slug": "connection-pool",
        "title": "Connection pool",
        "chapterIndex": 9,
        "chapterTitle": "Databases",
        "plain": "A shared collection of database connections that the app reuses instead of opening a fresh one for every request.",
        "example": "A pool of 20 Postgres connections. 200 requests coming in? They wait for an idle connection, use it, return it. You don't DOS your own database."
      }
    ]
  },
  {
    "index": 10,
    "title": "Networking & APIs",
    "blurb": "How one piece of software talks to another across a wire.",
    "terms": [
      {
        "slug": "http",
        "title": "HTTP",
        "chapterIndex": 10,
        "chapterTitle": "Networking & APIs",
        "plain": "The protocol the web runs on. Client sends a request, server sends a response. Methods include GET, POST, PUT, PATCH, DELETE."
      },
      {
        "slug": "rest",
        "title": "REST",
        "chapterIndex": 10,
        "chapterTitle": "Networking & APIs",
        "plain": "A style of API where URLs are resources (/users/123) and HTTP methods are verbs on those resources. GET reads, POST creates, PUT replaces, PATCH updates, DELETE deletes.",
        "example": "GET /api/users/123 returns user 123. POST /api/lessons creates a lesson. DELETE /api/sessions/456 logs out session 456."
      },
      {
        "slug": "graphql",
        "title": "GraphQL",
        "chapterIndex": 10,
        "chapterTitle": "Networking & APIs",
        "plain": "A query language where the client says exactly which fields it wants and the server returns just those. One endpoint, flexible shape.",
        "whenToUse": "When you have many different clients (mobile, web, partner) all needing different slices of the same data. Overkill for a single web app."
      },
      {
        "slug": "websocket",
        "title": "WebSocket",
        "chapterIndex": 10,
        "chapterTitle": "Networking & APIs",
        "plain": "A persistent, two-way connection between client and server. Unlike HTTP (one request, one response, done), a WebSocket stays open so either side can push messages anytime.",
        "example": "Supabase Realtime. Live chat. LiveKit audio/video. JAX streaming tokens as they're generated.",
        "whenToUse": "Real-time updates, chat, collaborative editing, live notifications."
      },
      {
        "slug": "webhook",
        "title": "Webhook",
        "chapterIndex": 10,
        "chapterTitle": "Networking & APIs",
        "plain": "A URL you hand to someone else so they can POST you an event when something happens on their side. Inverse of an API call.",
        "example": "Stripe POSTs to /api/stripe/webhook when a payment succeeds. You don't have to poll Stripe — Stripe tells you.",
        "watchOut": "Always verify the signature. Webhooks are public URLs; anyone can POST to them unless you cryptographically check the sender."
      },
      {
        "slug": "http-status-codes",
        "title": "HTTP status codes",
        "chapterIndex": 10,
        "chapterTitle": "Networking & APIs",
        "plain": "Numbers that tell the client what happened. 2xx = success, 3xx = redirect, 4xx = client's fault, 5xx = server's fault.",
        "example": "200 OK. 201 Created. 301 Moved. 400 Bad Request. 401 Unauthorized. 403 Forbidden. 404 Not Found. 409 Conflict. 429 Too Many Requests. 500 Server Error. 502 Bad Gateway. 503 Service Unavailable."
      },
      {
        "slug": "cors",
        "title": "CORS (Cross-Origin Resource Sharing)",
        "chapterIndex": 10,
        "chapterTitle": "Networking & APIs",
        "plain": "A browser security rule that blocks JavaScript on site A from calling site B, unless site B explicitly allows it with a special header.",
        "watchOut": "If you see 'CORS error' in the browser console, the fix is on the server, not the client. Add Access-Control-Allow-Origin on the API side."
      },
      {
        "slug": "tls-ssl-https",
        "title": "TLS / SSL / HTTPS",
        "chapterIndex": 10,
        "chapterTitle": "Networking & APIs",
        "plain": "The encryption layer on HTTPS. When you see the padlock, TLS is doing its job — the traffic between your browser and the server is unreadable to anyone in the middle.",
        "watchOut": "SSL is the old name; TLS is the current one. ‘SSL certificate’ usually means TLS certificate. No one except pedants cares."
      },
      {
        "slug": "cdn-edge-caching",
        "title": "CDN edge caching",
        "chapterIndex": 10,
        "chapterTitle": "Networking & APIs",
        "plain": "When the CDN saves a copy of a response and serves it directly to future users without asking your server.",
        "example": "Cloudflare caches your marketing page. The next 10,000 visitors never touch your server."
      },
      {
        "slug": "rate-limiting",
        "title": "Rate limiting",
        "chapterIndex": 10,
        "chapterTitle": "Networking & APIs",
        "plain": "Capping how many requests a client can make in a window. Prevents abuse and protects the service from itself.",
        "example": "100 requests per minute per IP. Beyond that, return 429."
      }
    ]
  },
  {
    "index": 11,
    "title": "Security",
    "blurb": "The ways attackers try to break your app, and the words we use to stop them.",
    "terms": [
      {
        "slug": "authentication",
        "title": "Authentication (authn)",
        "chapterIndex": 11,
        "chapterTitle": "Security",
        "plain": "Proving who the user is. Username + password, magic link, OAuth.",
        "watchOut": "Don't confuse authentication (who) with authorization (what). Different problems, different solutions."
      },
      {
        "slug": "authorization",
        "title": "Authorization (authz)",
        "chapterIndex": 11,
        "chapterTitle": "Security",
        "plain": "Deciding what an authenticated user is allowed to do.",
        "example": "User is logged in (authenticated), but they're not a super_admin, so they can't delete other users (authorization check failed)."
      },
      {
        "slug": "oauth-oauth-2-0",
        "title": "OAuth / OAuth 2.0",
        "chapterIndex": 11,
        "chapterTitle": "Security",
        "plain": "A protocol that lets a user grant one app access to another app's data without sharing their password.",
        "example": "‘Sign in with Google’. Drivia asks Google for a token; Google asks the user to approve; Google hands Drivia a scoped token. Drivia never sees the user's Google password."
      },
      {
        "slug": "jwt",
        "title": "JWT (JSON Web Token)",
        "chapterIndex": 11,
        "chapterTitle": "Security",
        "plain": "A signed string that encodes a user's identity and claims. The server verifies the signature without hitting the database.",
        "example": "Supabase Auth hands the client a JWT after login. Every subsequent API call includes it in the Authorization header.",
        "watchOut": "JWTs can't be revoked mid-flight (without extra infrastructure). Keep their lifetime short (minutes, not days) and use refresh tokens."
      },
      {
        "slug": "xss",
        "title": "XSS (Cross-Site Scripting)",
        "chapterIndex": 11,
        "chapterTitle": "Security",
        "plain": "An attack where the attacker injects JavaScript into your site that runs in another user's browser.",
        "example": "A user sets their bio to <script>steal(cookie)</script>. When another user views the profile, the script runs in their browser with their cookies.",
        "whenToUse": "As a reason to escape user content before rendering. React does this by default; dangerouslySetInnerHTML is where XSS creeps in."
      },
      {
        "slug": "csrf",
        "title": "CSRF (Cross-Site Request Forgery)",
        "chapterIndex": 11,
        "chapterTitle": "Security",
        "plain": "An attack where a malicious site tricks your logged-in user's browser into making a request to your site without their knowledge.",
        "example": "Evil site has <img src=https://bank.com/transfer?to=evil&amount;=1000>. If you're logged into bank.com, the browser happily sends your session cookie with that image request.",
        "whenToUse": "When deciding whether to use SameSite=Lax or Strict cookies, or CSRF tokens on form submissions. Modern frameworks handle this for you; know the word so you can verify."
      },
      {
        "slug": "sql-injection",
        "title": "SQL injection",
        "chapterIndex": 11,
        "chapterTitle": "Security",
        "plain": "Tricking a database into running attacker-supplied SQL by shoving it into a query string that wasn't properly escaped.",
        "example": "query = 'SELECT * FROM users WHERE name = ' + input. If input is '; DROP TABLE users; --, your users table is gone.",
        "watchOut": "The fix is parameterized queries, always. db.query('... WHERE name = $1', [input]). Never concatenate user input into SQL. Ever."
      },
      {
        "slug": "hashing-vs-encryption",
        "title": "Hashing vs encryption",
        "chapterIndex": 11,
        "chapterTitle": "Security",
        "plain": "Hashing is one-way: you can turn input into a hash, but not the hash back into input. Encryption is two-way: with the key, you can recover the original.",
        "example": "Passwords are hashed (bcrypt, argon2). Your database column never stores the real password, only the hash. Credit card tokens are encrypted because you need to retrieve the original.",
        "watchOut": "Never store passwords plain. Never use MD5 or SHA1 for passwords — they're too fast, which makes cracking them cheap. Use bcrypt or argon2."
      },
      {
        "slug": "salt",
        "title": "Salt",
        "chapterIndex": 11,
        "chapterTitle": "Security",
        "plain": "Random data added to a password before hashing so that two users with the same password don't produce the same hash.",
        "example": "Without salt, an attacker can precompute hashes for common passwords (a 'rainbow table') and match yours. With salt, they'd need a table per user."
      },
      {
        "slug": "secrets-management",
        "title": "Secrets management",
        "chapterIndex": 11,
        "chapterTitle": "Security",
        "plain": "Keeping API keys, database passwords, and private tokens out of code and out of git history.",
        "example": "Vercel environment variables, AWS Secrets Manager, a .env.local file that is in .gitignore.",
        "watchOut": "Once a secret hits git, assume it's compromised even if you force-push to delete it. Rotate immediately."
      },
      {
        "slug": "owasp-top-10",
        "title": "OWASP Top 10",
        "chapterIndex": 11,
        "chapterTitle": "Security",
        "plain": "A regularly-updated list of the most common web-app vulnerabilities, maintained by the Open Web Application Security Project.",
        "whenToUse": "Reviewing code or talking to a security auditor. Everyone in security assumes you've read it."
      }
    ]
  },
  {
    "index": 12,
    "title": "Git & Version Control",
    "blurb": "The time machine every developer uses and half of them fear.",
    "terms": [
      {
        "slug": "commit",
        "title": "Commit",
        "chapterIndex": 12,
        "chapterTitle": "Git & Version Control",
        "plain": "A saved snapshot of the project at a moment in time, with a message explaining what changed and why."
      },
      {
        "slug": "branch",
        "title": "Branch",
        "chapterIndex": 12,
        "chapterTitle": "Git & Version Control",
        "plain": "A separate line of commits. You can experiment on a branch without affecting main, then merge the branch back in when you're happy.",
        "analogy": "A writer working on a draft of a chapter in a separate document, then pasting the finished version back into the book."
      },
      {
        "slug": "merge",
        "title": "Merge",
        "chapterIndex": 12,
        "chapterTitle": "Git & Version Control",
        "plain": "Combining two branches. Git tries to integrate both sets of changes; if they touched the same lines, you get a merge conflict to resolve."
      },
      {
        "slug": "rebase",
        "title": "Rebase",
        "chapterIndex": 12,
        "chapterTitle": "Git & Version Control",
        "plain": "Rewriting your branch's history so it looks like it was built on top of the latest main, instead of branching off an older commit.",
        "analogy": "Merge is stapling your work onto the book. Rebase is re-typing your chapter as if you'd written it yesterday, after everyone else's edits.",
        "whenToUse": "Before merging, to keep history linear. Great for your own branches. Never rebase public branches others have pulled — you rewrite their history."
      },
      {
        "slug": "squash",
        "title": "Squash",
        "chapterIndex": 12,
        "chapterTitle": "Git & Version Control",
        "plain": "Combining a bunch of commits into one. 'Fix typo', 'oops', 'actually fix typo' becomes one clean commit.",
        "whenToUse": "Before merging a feature branch, so main stays readable."
      },
      {
        "slug": "cherry-pick",
        "title": "Cherry-pick",
        "chapterIndex": 12,
        "chapterTitle": "Git & Version Control",
        "plain": "Copying a single commit from one branch to another, without merging everything else."
      },
      {
        "slug": "pull-request",
        "title": "Pull request (PR)",
        "chapterIndex": 12,
        "chapterTitle": "Git & Version Control",
        "plain": "A formal request to merge your branch into another branch, usually reviewed by a teammate before it's approved.",
        "example": "You push feature/live-onboarding, open a PR to main on GitHub, a teammate reviews, you address comments, the PR gets merged.",
        "whenToUse": "Every change to main in a team setting. PRs are where code quality and culture live."
      },
      {
        "slug": "head",
        "title": "HEAD",
        "chapterIndex": 12,
        "chapterTitle": "Git & Version Control",
        "plain": "A pointer to the current commit — 'where you are right now' in git."
      },
      {
        "slug": "detached-head",
        "title": "Detached HEAD",
        "chapterIndex": 12,
        "chapterTitle": "Git & Version Control",
        "plain": "When HEAD points at a specific commit instead of a branch. Anything you commit here is orphaned unless you create a branch from it.",
        "watchOut": "Not a bug, but junior devs panic when they see it. It's just git saying 'you're visiting this commit directly.'"
      },
      {
        "slug": "stash",
        "title": "Stash",
        "chapterIndex": 12,
        "chapterTitle": "Git & Version Control",
        "plain": "A temporary drawer for work you haven't committed yet. git stash hides your changes; git stash pop brings them back.",
        "whenToUse": "You need to quickly switch branches but aren't ready to commit."
      },
      {
        "slug": "force-push",
        "title": "Force push",
        "chapterIndex": 12,
        "chapterTitle": "Git & Version Control",
        "plain": "Overwriting the remote branch with your local version, even if they diverge.",
        "watchOut": "Destroys remote commits. NEVER force-push to main or any shared branch. Fine on your own feature branch after a rebase."
      },
      {
        "slug": "reflog",
        "title": "Reflog",
        "chapterIndex": 12,
        "chapterTitle": "Git & Version Control",
        "plain": "Git's private history of where HEAD has been. Saves your life when you think you lost commits.",
        "whenToUse": "After any 'oh no' moment. git reflog usually shows the commit you thought you lost, and you can reset to it."
      },
      {
        "slug": "worktree",
        "title": "Worktree",
        "chapterIndex": 12,
        "chapterTitle": "Git & Version Control",
        "plain": "Check out a second branch into a separate folder without touching your current working directory."
      }
    ]
  },
  {
    "index": 13,
    "title": "CI / CD & Deployment",
    "blurb": "How code goes from your laptop to real users.",
    "terms": [
      {
        "slug": "ci",
        "title": "CI (Continuous Integration)",
        "chapterIndex": 13,
        "chapterTitle": "CI / CD & Deployment",
        "plain": "Automatically running tests and checks on every push. If the build or tests fail, the PR can't merge.",
        "example": "GitHub Actions running npm run test and npm run build on every PR. Red build = merge blocked."
      },
      {
        "slug": "cd",
        "title": "CD (Continuous Deployment / Delivery)",
        "chapterIndex": 13,
        "chapterTitle": "CI / CD & Deployment",
        "plain": "Delivery = every successful build produces a deployable artifact. Deployment = it also ships to production automatically.",
        "example": "Vercel on Drivia is continuous deployment. Push to main, it's on the internet in 90 seconds. No human in the loop."
      },
      {
        "slug": "pipeline",
        "title": "Pipeline",
        "chapterIndex": 13,
        "chapterTitle": "CI / CD & Deployment",
        "plain": "An ordered sequence of CI steps — lint, test, build, deploy. Each step depends on the previous one passing.",
        "example": "Lint → unit tests → integration tests → build → deploy to staging → E2E tests → deploy to prod."
      },
      {
        "slug": "artifact",
        "title": "Artifact",
        "chapterIndex": 13,
        "chapterTitle": "CI / CD & Deployment",
        "plain": "The thing your build produces that you actually deploy. A compiled binary, a Docker image, a zipped JS bundle.",
        "whenToUse": "Whenever you're talking about reproducible deploys. The key rule: the same artifact ships to staging and prod, so you know what you're promoting."
      },
      {
        "slug": "environment",
        "title": "Environment",
        "chapterIndex": 13,
        "chapterTitle": "CI / CD & Deployment",
        "plain": "A distinct copy of your app with its own config: development, staging, production. Same code, different secrets and data.",
        "example": "Dev points at a local Postgres. Staging points at a staging Supabase project. Prod points at the real one. Same Next.js build everywhere."
      },
      {
        "slug": "staging",
        "title": "Staging",
        "chapterIndex": 13,
        "chapterTitle": "CI / CD & Deployment",
        "plain": "A near-identical copy of production used for final testing before a release.",
        "whenToUse": "Anytime the cost of a bad prod deploy is bigger than the cost of maintaining staging."
      },
      {
        "slug": "ephemeral-preview-environment",
        "title": "Ephemeral / preview environment",
        "chapterIndex": 13,
        "chapterTitle": "CI / CD & Deployment",
        "plain": "A throwaway environment spun up for each pull request, so reviewers can click around the actual running version of the PR.",
        "example": "Vercel automatically spins up drivia-git-feature-live-onboarding.vercel.app for every PR."
      },
      {
        "slug": "zero-downtime-deploy",
        "title": "Zero-downtime deploy",
        "chapterIndex": 13,
        "chapterTitle": "CI / CD & Deployment",
        "plain": "A deployment strategy where users never see an error during a rollout. Old version keeps serving traffic until the new version is ready to take over.",
        "example": "Vercel does this by default. The old deployment keeps running until the new one has fully built and passed health checks."
      }
    ]
  },
  {
    "index": 14,
    "title": "Observability",
    "blurb": "Knowing what your system is doing, while it's doing it.",
    "terms": [
      {
        "slug": "logs",
        "title": "Logs",
        "chapterIndex": 14,
        "chapterTitle": "Observability",
        "plain": "Text lines your code writes describing what happened. The oldest and still the most useful debugging tool.",
        "example": "console.log('[travel/intake] submission saved', id). In production, these land in a log aggregator like Datadog or Logtail."
      },
      {
        "slug": "metrics",
        "title": "Metrics",
        "chapterIndex": 14,
        "chapterTitle": "Observability",
        "plain": "Numerical measurements over time. ‘Requests per second,’ ‘average response time,’ ‘error rate.’",
        "example": "Grafana showing Drivia's request latency over the last 24 hours. You see a spike at 3am and know when to dig into logs."
      },
      {
        "slug": "traces",
        "title": "Traces",
        "chapterIndex": 14,
        "chapterTitle": "Observability",
        "plain": "A record of a single request's entire journey across your system — every function it touched, every database query, every external call, and how long each took.",
        "example": "OpenTelemetry traces show you the Scholars' Day intake took 240ms, of which 180ms was waiting on auth.admin.listUsers. Now you know where to optimize.",
        "whenToUse": "Debugging slow requests across microservices or edge functions where logs alone lose the thread."
      },
      {
        "slug": "sla-slo-sli",
        "title": "SLA / SLO / SLI",
        "chapterIndex": 14,
        "chapterTitle": "Observability",
        "plain": "SLA = Service Level Agreement, the contract with the customer ('99.9% uptime or your money back'). SLO = Service Level Objective, your internal target ('99.95% uptime'). SLI = Service Level Indicator, the thing you actually measure (uptime percentage from a probe).",
        "example": "Drivia promises 99.9% uptime (SLA). Internally we target 99.95% (SLO) so we have buffer. We measure uptime via synthetic probes every 60 seconds (SLI)."
      },
      {
        "slug": "error-budget",
        "title": "Error budget",
        "chapterIndex": 14,
        "chapterTitle": "Observability",
        "plain": "How much failure you can tolerate before breaking your SLO. A 99.9% SLO gives you ~43 minutes of downtime per month — that's your budget.",
        "whenToUse": "To decide whether to slow down and fix reliability (burning budget fast) or speed up and ship features (budget healthy)."
      },
      {
        "slug": "alert",
        "title": "Alert",
        "chapterIndex": 14,
        "chapterTitle": "Observability",
        "plain": "An automated message that fires when a metric crosses a threshold — paging oncall, sending a Slack ping, opening a ticket."
      },
      {
        "slug": "on-call",
        "title": "On-call",
        "chapterIndex": 14,
        "chapterTitle": "Observability",
        "plain": "A rotation where one engineer is the first responder for production incidents, usually for a week at a time."
      },
      {
        "slug": "postmortem",
        "title": "Postmortem",
        "chapterIndex": 14,
        "chapterTitle": "Observability",
        "plain": "A blameless written report after an incident. Timeline of what happened, what was broken, what the fix was, and how to prevent it next time.",
        "watchOut": "Blameless is the key word. The goal is to fix the system, not the person."
      },
      {
        "slug": "mttr-mtbf",
        "title": "MTTR / MTBF",
        "chapterIndex": 14,
        "chapterTitle": "Observability",
        "plain": "MTTR = Mean Time To Recover (how fast you get back up). MTBF = Mean Time Between Failures (how often you go down). The goal is high MTBF, low MTTR."
      }
    ]
  },
  {
    "index": 15,
    "title": "AI / ML Vocabulary",
    "blurb": "The words every CTO building on LLMs needs to speak fluently.",
    "terms": [
      {
        "slug": "llm",
        "title": "LLM (Large Language Model)",
        "chapterIndex": 15,
        "chapterTitle": "AI / ML Vocabulary",
        "plain": "A neural network trained on billions of words that can predict the next token given previous tokens. GPT-4, Claude, Gemini, Llama.",
        "example": "JAX in Drivia is an LLM wrapped in a system prompt, a retrieval layer, and the H2E adaptive context."
      },
      {
        "slug": "token",
        "title": "Token",
        "chapterIndex": 15,
        "chapterTitle": "AI / ML Vocabulary",
        "plain": "The unit an LLM processes. Not quite a word, not quite a letter — somewhere in between. 'hello' is 1 token; 'unbelievable' might be 3.",
        "example": "A 500-word lesson is roughly 650 tokens. An 8k-token context window can hold about 6,000 words of conversation + system prompt + retrieved context.",
        "rule": "~1 token = 4 characters of English = ¾ of a word"
      },
      {
        "slug": "context-window",
        "title": "Context window",
        "chapterIndex": 15,
        "chapterTitle": "AI / ML Vocabulary",
        "plain": "The maximum number of tokens a model can consider at once — prompt + response combined.",
        "example": "GPT-4 Turbo: 128k tokens (~96,000 words). Claude: 200k+. If you exceed it, the model forgets the oldest parts.",
        "whenToUse": "Designing prompts. If your prompt + expected response is near the limit, you need a retrieval strategy."
      },
      {
        "slug": "prompt-engineering",
        "title": "Prompt engineering",
        "chapterIndex": 15,
        "chapterTitle": "AI / ML Vocabulary",
        "plain": "The craft of writing model inputs (system prompts, user prompts, examples) to get reliable outputs.",
        "example": "Telling JAX ‘You are an expert tutor. Respond in 3 sentences. Address the student by name.’ gets very different outputs than ‘help’."
      },
      {
        "slug": "system-prompt",
        "title": "System prompt",
        "chapterIndex": 15,
        "chapterTitle": "AI / ML Vocabulary",
        "plain": "The instructions you give the model before the user's message. Sets persona, rules, tone, and constraints.",
        "example": "Drivia's JAX system prompt includes the H2E context, Wilson's voice, and the rule 'never break character.'"
      },
      {
        "slug": "fine-tuning",
        "title": "Fine-tuning",
        "chapterIndex": 15,
        "chapterTitle": "AI / ML Vocabulary",
        "plain": "Training a pre-trained model further on your own data so it specializes in your task or voice.",
        "whenToUse": "When prompt engineering isn't enough and you have thousands of high-quality examples. Expensive; usually prompt engineering + RAG beats fine-tuning in cost and flexibility."
      },
      {
        "slug": "rag",
        "title": "RAG (Retrieval-Augmented Generation)",
        "chapterIndex": 15,
        "chapterTitle": "AI / ML Vocabulary",
        "plain": "Before calling the LLM, look up relevant documents from a database and stuff them into the prompt. The model answers with fresh, specific knowledge you didn't have to train it on.",
        "example": "A student asks JAX 'what's on slide 3 of today's lesson?' Drivia retrieves the lesson content from Postgres, pastes it into the prompt, and JAX answers from real context instead of hallucinating.",
        "whenToUse": "Anytime the answer lives in your own data. RAG is the default pattern for ‘AI that knows my stuff.’"
      },
      {
        "slug": "embedding",
        "title": "Embedding",
        "chapterIndex": 15,
        "chapterTitle": "AI / ML Vocabulary",
        "plain": "A fixed-length vector of numbers that represents the meaning of a piece of text. Similar meaning = similar vectors.",
        "analogy": "GPS coordinates for ideas. 'puppy' and 'dog' are close together; 'puppy' and 'calculus' are far apart.",
        "example": "Drivia turns every lesson into an embedding and stores them in a vector index. When a student asks a question, we embed the question and find the closest lessons by vector distance.",
        "rule": "similarity = cosine(vec_A, vec_B), range [-1, 1]"
      },
      {
        "slug": "vector-database",
        "title": "Vector database",
        "chapterIndex": 15,
        "chapterTitle": "AI / ML Vocabulary",
        "plain": "A database optimized for similarity search over embeddings. Pinecone, pgvector, Weaviate, Chroma.",
        "example": "Drivia uses pgvector, Postgres's vector extension, so the embeddings live next to the rest of the data."
      },
      {
        "slug": "hallucination",
        "title": "Hallucination",
        "chapterIndex": 15,
        "chapterTitle": "AI / ML Vocabulary",
        "plain": "When an LLM confidently makes up facts that aren't true. It's not lying; it's generating statistically plausible text without a grounding in reality.",
        "watchOut": "The #1 product risk with LLMs. Mitigations: RAG, citations, 'I don't know' prompting, and user-facing disclaimers."
      },
      {
        "slug": "temperature",
        "title": "Temperature",
        "chapterIndex": 15,
        "chapterTitle": "AI / ML Vocabulary",
        "plain": "A knob on LLM generation. Low (0.0) = deterministic, boring, factual. High (1.5+) = creative, varied, weird.",
        "whenToUse": "Temperature 0.2 for factual answers. Temperature 0.7-0.9 for creative writing. Match it to the task."
      },
      {
        "slug": "chain-of-thought",
        "title": "Chain of thought (CoT)",
        "chapterIndex": 15,
        "chapterTitle": "AI / ML Vocabulary",
        "plain": "Asking the model to show its reasoning step by step before the final answer. Reasoning visibly often beats reasoning in one shot.",
        "example": "'Solve this problem step by step. Then give the answer.' Accuracy on math problems jumps dramatically."
      },
      {
        "slug": "function-calling-tool-use",
        "title": "Function calling / Tool use",
        "chapterIndex": 15,
        "chapterTitle": "AI / ML Vocabulary",
        "plain": "A feature where the LLM can request a structured call to an external tool (database, API, calculator) and use the result in its answer. Training method where humans rank model outputs, and the model learns to prefer the highly-ranked kind. How ChatGPT became agreeable.",
        "example": "JAX calls getStudentProgress(userId), gets a real number, and uses it in the response instead of making one up. RLHF (Reinforcement Learning from Human Feedback)",
        "whenToUse": "To explain why modern LLMs are so polite. It's not natural — it was trained in."
      },
      {
        "slug": "zero-shot-few-shot-many-shot",
        "title": "Zero-shot / Few-shot / Many-shot",
        "chapterIndex": 15,
        "chapterTitle": "AI / ML Vocabulary",
        "plain": "Zero-shot = ask the model directly with no examples. Few-shot = include a handful of examples in the prompt. Many-shot = dozens of examples.",
        "whenToUse": "Few-shot is usually the sweet spot for niche tasks where the model needs a pattern to match."
      },
      {
        "slug": "distillation",
        "title": "Distillation",
        "chapterIndex": 15,
        "chapterTitle": "AI / ML Vocabulary",
        "plain": "Training a small, fast model to imitate a big, slow one. You get most of the quality at a fraction of the cost.",
        "example": "DeepSeek-R1-Distill-Llama-70B, mentioned on your Scholars' Day slide 13, is a smaller model trained to imitate DeepSeek-R1's reasoning."
      },
      {
        "slug": "quantization",
        "title": "Quantization",
        "chapterIndex": 15,
        "chapterTitle": "AI / ML Vocabulary",
        "plain": "Compressing a model's weights to smaller numbers (int8, int4) so it runs faster on cheaper hardware, with a small quality hit.",
        "example": "Qwen2.5-3B-Instruct-AWQ on your RunPod endpoint — AWQ is a quantization method. A 3B-parameter model runs on a single consumer GPU."
      }
    ]
  },
  {
    "index": 16,
    "title": "Team & Process Vocabulary",
    "blurb": "The words engineering teams use to coordinate and decide.",
    "terms": [
      {
        "slug": "mvp",
        "title": "MVP (Minimum Viable Product)",
        "chapterIndex": 16,
        "chapterTitle": "Team & Process Vocabulary",
        "plain": "The smallest version of a product that delivers real value to real users and lets you learn whether anyone cares. Not 'cheap' — 'minimum to learn.'",
        "watchOut": "MVP is not 'shoddy and incomplete.' It's 'ruthlessly scoped and actually good at the one thing it does.'"
      },
      {
        "slug": "spike",
        "title": "Spike",
        "chapterIndex": 16,
        "chapterTitle": "Team & Process Vocabulary",
        "plain": "A time-boxed investigation to answer a technical question before committing to a plan. 'Can we actually do this in 2 days?' 'Is this library fast enough?'"
      },
      {
        "slug": "rfc",
        "title": "RFC (Request for Comments)",
        "chapterIndex": 16,
        "chapterTitle": "Team & Process Vocabulary",
        "plain": "A written proposal for a technical change, circulated for team feedback before building anything. Forces clarity and catches objections cheap.",
        "whenToUse": "Any change that affects more than one person's area. 'I'm going to restructure the billing service' — write the RFC, circulate, discuss, then build."
      },
      {
        "slug": "code-review",
        "title": "Code review",
        "chapterIndex": 16,
        "chapterTitle": "Team & Process Vocabulary",
        "plain": "Another engineer reads your PR and comments before it merges. The single highest-ROI activity in engineering culture.",
        "watchOut": "Good reviews are kind, specific, and focused on impact. Bad reviews are pedantic, ego-driven, or a rubber stamp. Train the team on what a good review looks like."
      },
      {
        "slug": "sprint",
        "title": "Sprint",
        "chapterIndex": 16,
        "chapterTitle": "Team & Process Vocabulary",
        "plain": "A fixed time-box (usually 1-2 weeks) in which a team commits to a set of work and ships it."
      },
      {
        "slug": "standup",
        "title": "Standup",
        "chapterIndex": 16,
        "chapterTitle": "Team & Process Vocabulary",
        "plain": "A short daily meeting where each engineer says what they did yesterday, what they'll do today, and what's blocking them.",
        "watchOut": "Easy to ruin by turning into status theater for a manager. Keep it under 10 minutes and focused on unblocking each other."
      },
      {
        "slug": "retrospective",
        "title": "Retrospective (retro)",
        "chapterIndex": 16,
        "chapterTitle": "Team & Process Vocabulary",
        "plain": "A team meeting at the end of a sprint or project to talk about what went well, what didn't, and what to change.",
        "whenToUse": "After anything that mattered — a launch, an outage, a finished sprint. The team that runs good retros gets better. The team that skips them plateaus."
      },
      {
        "slug": "backlog",
        "title": "Backlog",
        "chapterIndex": 16,
        "chapterTitle": "Team & Process Vocabulary",
        "plain": "The prioritized list of work waiting to be done."
      },
      {
        "slug": "kanban",
        "title": "Kanban",
        "chapterIndex": 16,
        "chapterTitle": "Team & Process Vocabulary",
        "plain": "A work management style where tasks flow across columns (To Do → In Progress → Review → Done) and you cap work-in-progress to avoid chaos."
      },
      {
        "slug": "paging-oncall-rotation",
        "title": "Paging / oncall rotation",
        "chapterIndex": 16,
        "chapterTitle": "Team & Process Vocabulary",
        "plain": "The practice of having one engineer on-call 24/7 to respond to production incidents, usually rotating weekly."
      },
      {
        "slug": "sev",
        "title": "SEV (Severity)",
        "chapterIndex": 16,
        "chapterTitle": "Team & Process Vocabulary",
        "plain": "How bad an incident is. SEV-1 = complete outage, all hands. SEV-4 = minor, fix during business hours. You don't need to memorize this. You need to recognize patterns. When a developer on your team says ‘we're hitting an N+1 on the lessons query,’ you already know the shape of the problem (too many queries), the shape of the fix (JOIN or batch fetch), and the right follow-up question ('is this blocking a user-facing page or a background job?'). That recognition is what separates a CTO who leads engineers from a CTO who gets led. The vocabulary is the thin end of the wedge — knowing the word gives you the permission to ask the right question. The right question gets you the real answer. Keep this open next to your editor. Come back to sections when real code forces them on you. The terms will stop being words and start being instincts — and when they do, you'll be running the best engineering org UMHB ever produced. — Your terminal AI, 2026-04-11"
      }
    ]
  }
];

export const TERMS: DevTerm[] = CHAPTERS.flatMap((c) => c.terms);
