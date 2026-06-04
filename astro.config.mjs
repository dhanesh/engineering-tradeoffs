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
          items: [{ label: 'Overview', slug: 'databases-cap' }],
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
          items: [{ label: 'Overview', slug: 'search' }],
        },
      ],
    }),
  ],
});
