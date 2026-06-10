// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';

// Single source of truth for the deploy base path. Used for `base` AND to
// rewrite in-content absolute links (see rehypeBaseLinks below).
const BASE = '/engineering-tradeoffs';

// rehype plugin: prefix the deploy base onto absolute, in-content internal links.
// Markdown/MDX links written as `/cluster/page/` are NOT base-prefixed by Astro,
// so under a project-page base they 404. This rewrites them at build time, so
// authors keep writing clean `/cluster/page/` links and they resolve everywhere.
// Dependency-free walk over the HTML AST (no unist-util-visit needed).
function rehypeBaseLinks({ base } = {}) {
  const prefix = (base || '').replace(/\/$/, '');
  const fix = (node) => {
    if (
      node.type === 'element' &&
      node.tagName === 'a' &&
      node.properties &&
      typeof node.properties.href === 'string'
    ) {
      const h = node.properties.href;
      // only internal absolute links not already under the base
      if (h.startsWith('/') && !h.startsWith('//') && h !== prefix && !h.startsWith(prefix + '/')) {
        node.properties.href = prefix + h;
      }
    }
    if (node.children) for (const child of node.children) fix(child);
  };
  return (tree) => fix(tree);
}

// Engineering Tradeoffs — Astro + Starlight static docs site (T1, T4).
// React integration enables interactive islands later (U3 / RT-3).
export default defineConfig({
  // GitHub Pages PROJECT page: served under a sub-path. The repo
  // `dhanesh/engineering-tradeoffs` publishes to dhanesh.github.io/engineering-tradeoffs/.
  // `base` must match the repo name so internal links/assets resolve.
  site: 'https://dhanesh.github.io',
  base: BASE,
  markdown: {
    rehypePlugins: [[rehypeBaseLinks, { base: BASE }]],
  },
  integrations: [
    react(),
    starlight({
      title: 'Engineering Tradeoffs',
      description:
        'An interactive, decision-oriented software engineering handbook.',
      // Bring the active topic into focus in the sidebar on load: scroll the
      // sidebar's own scroll-pane (never the window) so the current page —
      // inside its auto-expanded, collapsed group — is centred and visible.
      head: [
        {
          tag: 'script',
          content: `
            (function () {
              function focusActive() {
                try {
                  var link = document.querySelector('nav[aria-label="Main"] a[aria-current="page"]');
                  if (!link) return;
                  var pane = link.closest('.sidebar-pane');
                  if (!pane) { link.scrollIntoView({ block: 'center' }); return; }
                  var lr = link.getBoundingClientRect();
                  var pr = pane.getBoundingClientRect();
                  if (lr.top < pr.top || lr.bottom > pr.bottom) {
                    pane.scrollTop += (lr.top - pr.top) - pane.clientHeight / 2 + link.offsetHeight / 2;
                  }
                } catch (e) {}
              }
              document.addEventListener('DOMContentLoaded', focusActive);
              document.addEventListener('astro:page-load', focusActive);
            })();
          `,
        },
      ],
      // U4 / RT-2: five top-level clusters, fixed order, each with an overview page.
      sidebar: [
        {
          label: 'Design Patterns',
          collapsed: true,
          items: [
            { label: 'Overview', slug: 'design-patterns' },
            { label: 'Creational patterns', slug: 'design-patterns/creational-patterns' },
            { label: 'Structural patterns', slug: 'design-patterns/structural-patterns' },
            { label: 'Behavioral patterns', slug: 'design-patterns/behavioral-patterns' },
            { label: 'Architectural patterns', slug: 'design-patterns/architectural-patterns' },
          ],
        },
        {
          label: 'Event-Driven Architecture',
          collapsed: true,
          items: [
            { label: 'Overview', slug: 'event-driven' },
            { label: 'Message brokers', slug: 'event-driven/message-brokers' },
            { label: 'Broker comparison', slug: 'event-driven/broker-comparison' },
            { label: 'Delivery semantics', slug: 'event-driven/delivery-semantics' },
            { label: 'Event-driven patterns', slug: 'event-driven/event-driven-patterns' },
          ],
        },
        {
          label: 'Databases & CAP',
          collapsed: true,
          items: [
            { label: 'CAP theorem', slug: 'databases-cap' },
            { label: 'Consistency models', slug: 'databases-cap/consistency-models' },
            { label: 'Database types', slug: 'databases-cap/database-types' },
            { label: 'Replication & partitioning', slug: 'databases-cap/replication-partitioning' },
            { label: 'Transactions & isolation', slug: 'databases-cap/transactions-isolation' },
          ],
        },
        {
          label: 'Caching & Performance',
          collapsed: true,
          items: [
            { label: 'Overview', slug: 'caching' },
            { label: 'Caching strategies', slug: 'caching/caching-strategies' },
            { label: 'Eviction policies', slug: 'caching/eviction-policies' },
            { label: 'Cache invalidation', slug: 'caching/cache-invalidation' },
            { label: 'Distributed caching', slug: 'caching/distributed-caching' },
            { label: 'CDN & edge caching', slug: 'caching/cdn-edge-caching' },
          ],
        },
        {
          label: 'Search Indexes',
          collapsed: true,
          items: [
            { label: 'Overview', slug: 'search' },
            { label: 'Inverted index', slug: 'search/inverted-index' },
            { label: 'Relevance & ranking', slug: 'search/relevance-ranking' },
            { label: 'Engine comparison', slug: 'search/engine-comparison' },
            { label: 'Search architecture', slug: 'search/search-architecture' },
          ],
        },
        {
          label: 'Networking & Protocols',
          collapsed: true,
          items: [
            { label: 'Overview', slug: 'networking' },
            { label: 'TCP vs UDP', slug: 'networking/tcp-udp' },
            { label: 'HTTP evolution', slug: 'networking/http-evolution' },
            { label: 'TLS & security', slug: 'networking/tls-security' },
            { label: 'DNS', slug: 'networking/dns' },
            { label: 'Load balancing & proxies', slug: 'networking/load-balancing-proxies' },
          ],
        },
        {
          label: 'APIs & Service Communication',
          collapsed: true,
          items: [
            { label: 'Overview', slug: 'apis' },
            { label: 'REST APIs', slug: 'apis/rest' },
            { label: 'GraphQL', slug: 'apis/graphql' },
            { label: 'gRPC & RPC', slug: 'apis/grpc-rpc' },
            { label: 'API design & versioning', slug: 'apis/api-design' },
            { label: 'API gateways & BFF', slug: 'apis/api-gateways-bff' },
          ],
        },
        {
          label: 'Concurrency & Parallelism',
          collapsed: true,
          items: [
            { label: 'Overview', slug: 'concurrency' },
            { label: 'Threads, event loops & async', slug: 'concurrency/threads-async' },
            { label: 'Synchronization & locking', slug: 'concurrency/synchronization' },
            { label: 'Memory models & visibility', slug: 'concurrency/memory-models' },
            { label: 'Concurrency models', slug: 'concurrency/concurrency-models' },
            { label: 'Parallel patterns', slug: 'concurrency/parallel-patterns' },
          ],
        },
        {
          label: 'Distributed Systems',
          collapsed: true,
          items: [
            { label: 'Overview', slug: 'distributed-systems' },
            { label: 'Consensus', slug: 'distributed-systems/consensus' },
            { label: 'Time & ordering', slug: 'distributed-systems/time-ordering' },
            { label: 'Replication & convergence', slug: 'distributed-systems/replication-consistency' },
            { label: 'Coordination', slug: 'distributed-systems/coordination' },
            { label: 'Distributed failure', slug: 'distributed-systems/distributed-failure' },
          ],
        },
        {
          label: 'Scalability & System Design',
          collapsed: true,
          items: [
            { label: 'Overview', slug: 'scalability' },
            { label: 'Back-of-the-envelope estimation', slug: 'scalability/back-of-envelope' },
            { label: 'Sharding & partitioning', slug: 'scalability/sharding-partitioning' },
            { label: 'Statelessness & sessions', slug: 'scalability/statelessness-sessions' },
            { label: 'Rate limiting & throttling', slug: 'scalability/rate-limiting-throttling' },
            { label: 'Scaling the data tier', slug: 'scalability/scaling-the-data-tier' },
          ],
        },
        {
          label: 'Reliability & Resilience',
          collapsed: true,
          items: [
            { label: 'Overview', slug: 'reliability' },
            { label: 'Resilience patterns', slug: 'reliability/resilience-patterns' },
            { label: 'Redundancy & failover', slug: 'reliability/redundancy-failover' },
            { label: 'SLOs, SLIs & error budgets', slug: 'reliability/slo-sli-error-budgets' },
            { label: 'Failure handling', slug: 'reliability/failure-handling' },
            { label: 'Incident management', slug: 'reliability/incident-management' },
          ],
        },
        {
          label: 'Observability',
          collapsed: true,
          items: [
            { label: 'Overview', slug: 'observability' },
            { label: 'Metrics', slug: 'observability/metrics' },
            { label: 'Logging', slug: 'observability/logging' },
            { label: 'Distributed tracing', slug: 'observability/tracing' },
            { label: 'Alerting', slug: 'observability/alerting' },
            { label: 'Dashboards & debugging', slug: 'observability/dashboards-debugging' },
          ],
        },
        {
          label: 'Security & Auth',
          collapsed: true,
          items: [
            { label: 'Security foundations', slug: 'security' },
            { label: 'Authentication', slug: 'security/authentication' },
            { label: 'Authorization', slug: 'security/authorization' },
            { label: 'OAuth, OIDC & JWT', slug: 'security/oauth-oidc-jwt' },
            { label: 'Common vulnerabilities', slug: 'security/common-vulnerabilities' },
            { label: 'Cryptography & secrets', slug: 'security/crypto-secrets' },
          ],
        },
        {
          label: 'Software Architecture',
          collapsed: true,
          items: [
            { label: 'Overview', slug: 'architecture' },
            { label: 'Monolith to microservices', slug: 'architecture/monolith-microservices' },
            { label: 'Domain-driven design', slug: 'architecture/domain-driven-design' },
            { label: 'Architectural styles', slug: 'architecture/architectural-styles' },
            { label: 'Integration & communication', slug: 'architecture/integration-communication' },
            { label: 'Architecture decisions', slug: 'architecture/architecture-decisions' },
          ],
        },
        {
          label: 'Data Structures & Algorithms',
          collapsed: true,
          items: [
            { label: 'Overview', slug: 'algorithms' },
            { label: 'Complexity analysis', slug: 'algorithms/complexity' },
            { label: 'Core data structures', slug: 'algorithms/core-data-structures' },
            { label: 'Trees & graphs', slug: 'algorithms/trees-and-graphs' },
            { label: 'Algorithmic paradigms', slug: 'algorithms/algorithmic-paradigms' },
            { label: 'Sorting & searching', slug: 'algorithms/sorting-searching' },
          ],
        },
        {
          label: 'OS & Computer Architecture',
          collapsed: true,
          items: [
            { label: 'Overview', slug: 'systems-fundamentals' },
            { label: 'Processes, threads & scheduling', slug: 'systems-fundamentals/processes-threads-scheduling' },
            { label: 'Memory management', slug: 'systems-fundamentals/memory-management' },
            { label: 'I/O & filesystems', slug: 'systems-fundamentals/io-filesystems' },
            { label: 'CPU architecture', slug: 'systems-fundamentals/cpu-architecture' },
            { label: 'Runtime & memory management', slug: 'systems-fundamentals/runtime-memory' },
          ],
        },
        {
          label: 'Testing & Quality',
          collapsed: true,
          items: [
            { label: 'Overview', slug: 'testing' },
            { label: 'Test types', slug: 'testing/test-types' },
            { label: 'Test design', slug: 'testing/test-design' },
            { label: 'TDD, BDD & beyond', slug: 'testing/tdd-bdd' },
            { label: 'Testing distributed systems', slug: 'testing/testing-distributed-systems' },
            { label: 'Quality practices', slug: 'testing/quality-practices' },
          ],
        },
        {
          label: 'Delivery & Operations',
          collapsed: true,
          items: [
            { label: 'Overview', slug: 'delivery' },
            { label: 'CI/CD pipelines', slug: 'delivery/ci-cd-pipelines' },
            { label: 'Deployment strategies', slug: 'delivery/deployment-strategies' },
            { label: 'Containers', slug: 'delivery/containers' },
            { label: 'Orchestration & Kubernetes', slug: 'delivery/orchestration-kubernetes' },
            { label: 'Infrastructure as Code & Cloud', slug: 'delivery/iac-cloud' },
          ],
        },
        {
          label: 'Frontend Fundamentals',
          collapsed: true,
          items: [
            { label: 'The browser as a platform', slug: 'frontend' },
            { label: 'Rendering strategies', slug: 'frontend/rendering-strategies' },
            { label: 'State management', slug: 'frontend/state-management' },
            { label: 'Frontend performance', slug: 'frontend/performance' },
            { label: 'Accessibility & UX', slug: 'frontend/accessibility-ux' },
            { label: 'Frontend architecture', slug: 'frontend/frontend-architecture' },
          ],
        },
        {
          label: 'Mobile Development',
          collapsed: true,
          items: [
            { label: 'Overview', slug: 'mobile' },
            { label: 'Native vs cross-platform', slug: 'mobile/native-vs-crossplatform' },
            { label: 'Mobile app architecture', slug: 'mobile/mobile-architecture' },
            { label: 'Offline data & sync', slug: 'mobile/offline-data-sync' },
            { label: 'Mobile networking & performance', slug: 'mobile/mobile-networking-perf' },
            { label: 'Mobile platform concerns', slug: 'mobile/mobile-platform-concerns' },
          ],
        },
        {
          label: 'Data Engineering & Pipelines',
          collapsed: true,
          items: [
            { label: 'Overview', slug: 'data-engineering' },
            { label: 'Batch vs streaming', slug: 'data-engineering/batch-vs-streaming' },
            { label: 'Pipelines, ETL & ELT', slug: 'data-engineering/pipelines-etl-elt' },
            { label: 'Storage: warehouses & lakes', slug: 'data-engineering/storage-warehouses-lakes' },
            { label: 'Data modeling & quality', slug: 'data-engineering/data-modeling-quality' },
            { label: 'Pipeline scale & cost', slug: 'data-engineering/pipeline-scale-cost' },
          ],
        },
        {
          label: 'ML / AI Systems',
          collapsed: true,
          items: [
            { label: 'Overview', slug: 'ml-systems' },
            { label: 'The ML lifecycle & data', slug: 'ml-systems/ml-lifecycle-data' },
            { label: 'Serving & inference', slug: 'ml-systems/serving-inference' },
            { label: 'MLOps', slug: 'ml-systems/mlops' },
            { label: 'LLM applications', slug: 'ml-systems/llm-applications' },
            { label: 'LLMs in production', slug: 'ml-systems/llm-production' },
          ],
        },
        {
          label: 'Programming Language Concepts',
          collapsed: true,
          items: [
            { label: 'Overview', slug: 'languages' },
            { label: 'Type systems', slug: 'languages/type-systems' },
            { label: 'Programming paradigms', slug: 'languages/paradigms' },
            { label: 'Memory models', slug: 'languages/memory-models' },
            { label: 'Language mechanics', slug: 'languages/language-mechanics' },
            { label: 'Choosing a language', slug: 'languages/choosing-a-language' },
          ],
        },
        {
          label: 'Code Quality & Craft',
          collapsed: true,
          items: [
            { label: 'Overview', slug: 'craft' },
            { label: 'Clean code principles', slug: 'craft/clean-code-principles' },
            { label: 'Design principles', slug: 'craft/design-principles' },
            { label: 'Refactoring & tech debt', slug: 'craft/refactoring-tech-debt' },
            { label: 'Code review & collaboration', slug: 'craft/code-review-collaboration' },
            { label: 'Version control & Git', slug: 'craft/version-control-git' },
          ],
        },
      ],
    }),
  ],

  // Build environments that SYMLINK node_modules (Paketo/Cloud Native Buildpacks,
  // pnpm, Nix) can break Astro's compile-metadata cache: the .astro compiler keys a
  // module by one path while Vite requests its style virtual-module by the resolved
  // symlink path → "No cached compile metadata found". Don't resolve symlinks so
  // both sides use the same path. (No effect on a normal local build.)
  vite: {
    resolve: { preserveSymlinks: true },
  },
});
