export type StudentProfile = {
  slug: string
  name: string
  school: string
  need: string
  account: string
  paybill: string
  image: string
  poster: string
  tag: string
  number: string
  short: string
  bio: string[]
}

export const studentProfiles: StudentProfile[] = [
  {
    slug: 'juliet-wambui',
    name: 'Juliet Wambui Gichuki',
    school: 'MacMillan Medical Training',
    need: 'KSh 35,000',
    account: '1342298071',
    paybill: '522533',
    image: '/juliet_face.jpg',
    poster: '/student-juliet.jpeg',
    tag: 'Medical training',
    number: '01',
    short: 'Help Juliet complete her medical training and keep her dream of serving others alive.',
    bio: [
      'Juliet Wambui Gichuki is a dedicated medical student at MacMillan Medical Training, pursuing her calling to serve her community through healthcare.',
      'She has come far on determination alone, but the final stretch of her training requires support that her family cannot meet. With KSh 35,000, Juliet can complete her studies and step into a career that saves lives.',
      'Your contribution — no matter how small — helps keep a bright, compassionate mind in class and moves Nakuru one step closer to the healthcare workers it needs.',
    ],
  },
  {
    slug: 'shawn-ndungu',
    name: 'Shawn Ndungu Mbugua',
    school: 'Nyeri National Polytechnic',
    need: 'KSh 29,000',
    account: '59068',
    paybill: '522533',
    image: '/ChatGPT Image Sep 17, 2026, 06_28_23 AM.png',
    poster: '/ChatGPT Image Sep 17, 2026, 06_28_23 AM.png',
    tag: 'Technical education',
    number: '02',
    short: 'Give Shawn the support to finish his technical education and step confidently into work.',
    bio: [
      'Shawn Ndungu Mbugua is a technical student at Nyeri National Polytechnic, building practical skills that lead directly to employment and self-reliance.',
      'He is close to completing his course, but the remaining fees stand between him and his qualification. KSh 29,000 covers what he needs to finish strong.',
      'By supporting Shawn, you are investing in a young person ready to work, earn, and give back to Nakuru County.',
    ],
  },
  {
    slug: 'francis-njenga',
    name: 'Francis Njenga',
    school: 'Rift Valley Institute of Business Studies',
    need: 'KSh 17,900',
    account: 'FRANCIS',
    paybill: '537816',
    image: '/student_francis_njenga_face.jpg',
    poster: '/student_francis_njenga_face.jpg',
    tag: 'Automotive engineering',
    number: '03',
    short: 'Help Francis complete his automotive engineering training and step into a trade that builds Nakuru&apos;s future.',
    bio: [
      'Francis Njenga is studying automotive engineering at the Rift Valley Institute of Business Studies, training for a trade that turns curiosity into livelihood.',
      'He is close to finishing his course, but the remaining KSh 17,900 in fees stands between him and his qualification. Pay directly to his school using Paybill 537816, account FRANCIS.',
      'By supporting Francis, you are funding a young tradesperson ready to work, repair, hire and give back to Nakuru County.',
    ],
  },
  {
    slug: 'paul-prince',
    name: 'Paul Prince',
    school: 'Rift Valley Institute of Business Studies',
    need: 'KSh 17,900',
    account: 'PAUL',
    paybill: '537816',
    image: '/student_paul_prince_face.jpg',
    poster: '/student_paul_prince_face.jpg',
    tag: 'Catering and Management',
    number: '04',
    short: 'Help Paul complete his catering and management training and step into a hospitality career serving Nakuru.',
    bio: [
      'Paul Prince is a catering and management student at the Rift Valley Institute of Business Studies, building the practical service, kitchen and hospitality skills that put food on tables and people in work.',
      'He is close to finishing his course, but the remaining KSh 17,900 in fees stands between him and his qualification. Pay directly to his school (Paybill 537816, account PAUL) and send us a note so we can credit your contribution.',
      'By supporting Paul, you are investing in a young hospitality professional ready to cook, host, employ, and give back to Nakuru County.',
    ],
  },
]
