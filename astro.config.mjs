// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';

// System Design Primer — Astro + Starlight static docs site (T1, T4).
// React integration enables interactive islands later (U3 / RT-3).
export default defineConfig({
  integrations: [
    react(),
    starlight({
      title: 'System Design Primer',
      description:
        'Interactive, decision-oriented system design documentation.',
      // U4 / RT-2: five top-level clusters, fixed order, each with an overview page.
      sidebar: [
        {
          label: 'Design Patterns',
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
          items: [
            { label: 'Overview', slug: 'apis' },
            { label: 'REST APIs', slug: 'apis/rest' },
            { label: 'GraphQL', slug: 'apis/graphql' },
            { label: 'gRPC & RPC', slug: 'apis/grpc-rpc' },
            { label: 'API design & versioning', slug: 'apis/api-design' },
            { label: 'API gateways & BFF', slug: 'apis/api-gateways-bff' },
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
