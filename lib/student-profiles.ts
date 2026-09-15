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
    image: '/shawn_face.jpg',
    poster: '/student-shawn.jpeg',
    tag: 'Technical education',
    number: '02',
    short: 'Give Shawn the support to finish his technical education and step confidently into work.',
    bio: [
      'Shawn Ndungu Mbugua is a technical student at Nyeri National Polytechnic, building practical skills that lead directly to employment and self-reliance.',
      'He is close to completing his course, but the remaining fees stand between him and his qualification. KSh 29,000 covers what he needs to finish strong.',
      'By supporting Shawn, you are investing in a young person ready to work, earn, and give back to Nakuru County.',
    ],
  },
]
