import { getContent } from '@/lib/site-content'

export const HOME_CONTENT_KEY = 'home'

export interface ManifestoCard {
  label: string
  title: string
  text: string
  linkLabel: string
  href: string
  image: string
  imageAlt: string
}

export interface HomeContent {
  hero: {
    eyebrow: string
    title: string
    titleAccent: string
    kicker: string
    text: string
    primaryCtaLabel: string
    primaryCtaHref: string
    secondaryCtaLabel: string
    secondaryCtaHref: string
    image: string
    imageAlt: string
    stampTitle: string
    stampText: string
  }
  manifesto: {
    eyebrow: string
    title: string
    titleAccent: string
    text: string
    cards: ManifestoCard[]
  }
  jawabu: {
    logo: string
    brandLabel: string
    eyebrow: string
    title: string
    text: string
    primaryCtaLabel: string
    primaryCtaHref: string
    secondaryCtaLabel: string
    secondaryCtaHref: string
  }
  message: {
    eyebrow: string
    quote: string
    author: string
    askLabel: string
    askTitle: string
    askText: string
  }
  newsroom: {
    eyebrow: string
    title: string
    titleAccent: string
    text: string
    featureImage: string
    featureImageAlt: string
    featureLabel: string
    featureTitle: string
    featureLinkLabel: string
  }
  donate: {
    eyebrow: string
    title: string
    text: string
    buttonLabel: string
    buttonHref: string
  }
}

export const DEFAULT_HOME_CONTENT: HomeContent = {
  hero: {
    eyebrow: 'A PEOPLE-POWERED CAMPAIGN',
    title: 'Richie Githatu',
    titleAccent: 'Nakuru Kwetu',
    kicker: '2027 GOVERNOR · NAKURU COUNTY',
    text: 'A necessary vision for a healthier, better-governed, youth-driven and economically empowered Nakuru — built with the people, for the people.',
    primaryCtaLabel: 'Learn more',
    primaryCtaHref: '/manifesto',
    secondaryCtaLabel: 'Meet Richie Githatu',
    secondaryCtaHref: '/about',
    image: '/WhatsApp%20Image%202026-09-28%20at%2016.58.34.jpeg',
    imageAlt: 'Nakuru residents taking part in a community walk together.',
    stampTitle: 'NAKURU KWETU',
    stampText: 'Our future, together.',
  },
  manifesto: {
    eyebrow: 'THE MANIFESTO',
    title: 'A Nakuru that works',
    titleAccent: 'for everyone.',
    text: 'For the mama at the market, the boda rider on the road, the graduate at home, and the family waiting at the clinic — not just for the few.',
    cards: [
      {
        label: 'THE AGENDA',
        title: 'Ideas that move people forward.',
        text: 'Explore the plans for jobs, education, health, and accountable leadership.',
        linkLabel: 'Explore the manifesto',
        href: '/manifesto',
        image: '',
        imageAlt: '',
      },
      {
        label: 'FROM THE TRAIL',
        title: 'Walking the county, one ward at a time.',
        text: "Listen, learn, and shape Nakuru's future together.",
        linkLabel: 'Follow the journey',
        href: '/updates',
        image: '/WhatsApp%20Image%202026-09-28%20at%2016.57.04.jpeg',
        imageAlt: 'Richie Githatu sharing food with a local resident during a Nakuru community visit.',
      },
      {
        label: 'NEWSROOM',
        title: 'Stories and updates from Nakuru.',
        text: 'See the conversations, events, and work happening across the county.',
        linkLabel: 'Visit the newsroom',
        href: '/updates',
        image: '/WhatsApp%20Image%202026-09-28%20at%2020.04.39.jpeg',
        imageAlt: 'Richie Githatu in conversation during a Pawa Radio interview.',
      },
      {
        label: 'JAWABU KENYA · ADOPT-A-STUDENT',
        title: 'Help a student stay in school.',
        text: 'Choose a student and support their education directly through their school.',
        linkLabel: 'Adopt a student',
        href: '/students#meet-students',
        image: '',
        imageAlt: '',
      },
    ],
  },
  jawabu: {
    logo: '/jawabu_logo_logo-removebg-preview.png',
    brandLabel: 'COMMUNITY PROGRAMMES',
    eyebrow: 'JAWABU KENYA',
    title: 'Change begins when people can take part.',
    text: 'We believe meaningful change begins when people understand their rights, participate in decisions that affect them, and have the opportunity to shape their communities.',
    primaryCtaLabel: 'Adopt a student',
    primaryCtaHref: '/students#meet-students',
    secondaryCtaLabel: 'Community drives',
    secondaryCtaHref: '/join',
  },
  message: {
    eyebrow: 'A MESSAGE FOR NAKURU',
    quote: "If you are eligible to vote, register. Your voice is your power, and your participation will help shape Nakuru County's future.",
    author: 'Richie Githatu',
    askLabel: 'ASK ME?',
    askTitle: 'Have a question?',
    askText: 'Ask about the manifesto, community drives, education support, or the campaign.',
  },
  newsroom: {
    eyebrow: 'NEWSROOM',
    title: 'Updates from',
    titleAccent: 'around Nakuru.',
    text: 'A few recent stories from the campaign trail and the people shaping our county.',
    featureImage: '/WhatsApp%20Image%202026-09-28%20at%2020.04.39.jpeg',
    featureImageAlt: 'Richie Githatu in conversation during a Pawa Radio interview.',
    featureLabel: 'NAKURU KWETU IN CONVERSATION',
    featureTitle: 'News, voices, and moments from the county.',
    featureLinkLabel: 'Visit the newsroom',
  },
  donate: {
    eyebrow: 'SUPPORT NAKURU KWETU',
    title: 'Help move the campaign forward.',
    text: 'Your contribution helps us keep listening, sharing our plans, and working alongside Nakuru communities.',
    buttonLabel: 'Donate to the campaign',
    buttonHref: '/donate',
  },
}

export function getHomeContent(): Promise<HomeContent> {
  return getContent(HOME_CONTENT_KEY, DEFAULT_HOME_CONTENT)
}
