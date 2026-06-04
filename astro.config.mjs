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
          items: [{ label: 'Overview', slug: 'design-patterns' }],
        },
        {
          label: 'Event-Driven Architecture',
          items: [{ label: 'Overview', slug: 'event-driven' }],
        },
        {
          label: 'Databases & CAP',
          items: [{ label: 'Overview', slug: 'databases-cap' }],
        },
        {
          label: 'Caching & Performance',
          items: [{ label: 'Overview', slug: 'caching' }],
        },
        {
          label: 'Search Indexes',
          items: [{ label: 'Overview', slug: 'search' }],
        },
      ],
    }),
  ],
});
