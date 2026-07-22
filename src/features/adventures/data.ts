/* Past adventures content — the four stops on the index rail, plus the one
   scaffolded case study. Kept separate from the page component so the rail,
   jump bar and content column all read off the same list instead of drifting. */

export interface Adventure {
  id: string
  name: string
  shortName: string
  role: string
  tagline: string
  years: string
  brief: string
  /** "visit" links under the brief — one per product (a stop can span two,
      e.g. Titan.Email and Neo.Space). Omit for stops with nothing to link to. */
  links?: { label: string; href: string }[]
}

export const ORGS: Adventure[] = [
  {
    id: 'adv-membean',
    name: 'Membean',
    shortName: 'Membean',
    links: [{ label: 'Membean', href: 'https://membean.com' }],
    role: 'Lead Product Designer',
    tagline: 'A team of one, owning the whole product.',
    years: '2024 – now',
    brief:
      "A one-person design team, which meant I owned the whole product: separate modules for teachers, admins, and students, each with different needs. I built a design system that could serve all three without pulling in three directions, and brought in a product roadmap to replace ad hoc decisions with something visible everyone could plan around. I also set up surveys and interview sessions so users' voices actually reached the people building the product, and led several of the higher-stakes features end to end.",
  },
  {
    id: 'adv-titan',
    name: 'Titan.Email / Neo.Space',
    shortName: 'Titan.Email',
    links: [
      { label: 'Titan.Email', href: 'https://titan.email' },
      { label: 'Neo.Space', href: 'https://neo.space/' },
    ],
    role: 'Sr. Manager, Product Design',
    tagline: 'Building and leading the design team.',
    years: '2021 – 2023',
    brief:
      "Here the work was mostly about people, not screens. I built and scaled the product design team, and brought in design rituals and critique sessions so quality and collaboration became a shared habit rather than any one person's job. I led design's OKRs across NPS, monetization, and growth, and carried the design perspective into leadership decisions.",
  },
  {
    id: 'adv-strategy-zero',
    name: 'Strategy.Zero / Gravity iLabs',
    shortName: 'Strategy.Zero',
    role: 'Lead Product Design & Innovation',
    tagline: 'Finding product-market fit from scratch.',
    years: '2014 – 2021',
    brief:
      'A complex enterprise platform, many users and modules, and no certainty yet about what the market wanted. My job was to find that out. I built a team set up for rapid prototyping, ran workshops with key enterprise clients to shape the roadmap around what they actually needed, and used experiments on the core features to learn demand and user personas.',
  },
  {
    id: 'adv-rhythm-hues',
    name: 'Rhythm & Hues',
    shortName: 'Rhythm & Hues',
    role: 'VFX Artist',
    tagline: 'Where it all started.',
    years: '2011 – 2014',
    brief:
      "My first real work, across three departments: camera, technical animation, and FX simulation. The job was mostly problem-solving, finding creative ways to reach the director's vision and working with other departments to deliver it as efficiently as we could. It's also where I worked on Life of Pi and ended up part of the team that won an Oscar for it. Most of what we made was meant to go unnoticed, and learning to care about things nobody would ever see is where a lot of how I design now began.",
  },
]

/* The case-study section (card grid + the #cs/ deep-linked reader in
   CaseStudySheet.tsx). The studies themselves live in caseStudies.tsx (each
   carries its own narrative body). Kept as a flag so the section can be pulled
   without touching the rail/jump-bar wiring if it's ever emptied out. */
export const SHOW_CASE_STUDIES = true as boolean
