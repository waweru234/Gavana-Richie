-- Seed script for existing students
-- Run this AFTER running the schema

INSERT INTO students (id, slug, name, school, need, paybill, account, image, poster, tag, "number", short, bio, sponsored, sponsored_by, sponsored_date, sponsored_quote, published, sort_order, created_at, updated_at) VALUES
(gen_random_uuid(), 'juliet-wambui', 'Juliet Wambui Gichuki', 'MacMillan Medical Training', 'KSh 35,000', '522533', '1342298071', '/juliet_face.jpg', '/student-juliet.jpeg', 'Medical training', '01', 'Help Juliet complete her medical training and keep her dream of serving others alive.', ARRAY[
  'Juliet Wambui Gichuki is a dedicated medical student at MacMillan Medical Training, pursuing her calling to serve her community through healthcare.',
  'She has come far on determination alone, but the final stretch of her training requires support that her family cannot meet. With KSh 35,000, Juliet can complete her studies and step into a career that saves lives.',
  'Your contribution — no matter how small — helps keep a bright, compassionate mind in class and moves Nakuru one step closer to the healthcare workers it needs.'
], FALSE, NULL, NULL, NULL, TRUE, 1, '2026-09-20 10:00:00+03', '2026-09-20 10:00:00+03'),

(gen_random_uuid(), 'shawn-ndungu', 'Shawn Ndungu Mbugua', 'Nyeri National Polytechnic', 'KSh 29,000', '522533', '59068', '/ChatGPT Image Sep 17, 2026, 06_28_23 AM.png', '/ChatGPT Image Sep 17, 2026, 06_28_23 AM.png', 'Technical education', '02', 'Shawn is back in class — fully sponsored. Meet the next student waiting.', ARRAY[
  'Shawn Ndungu Mbugua is a technical student at Nyeri National Polytechnic, building practical skills that lead directly to employment and self-reliance.',
  'His full KSh 29,000 was covered by an early supporter of the Adopt-a-Student programme. He is back in class and on track to complete his qualification.',
  'Shawn is what this campaign is about — when we put small support from many people together, a determined young person finishes school. Pick the next student waiting and do the same.'
], TRUE, 'A Richie Githatu 2027 supporter', 'August 2026', 'Shawn''s KSh 29,000 fees have been fully covered by an early supporter. He is now back in class and on track to complete his course.', TRUE, 2, '2026-09-20 10:00:00+03', '2026-09-20 10:00:00+03'),

(gen_random_uuid(), 'francis-njenga', 'Francis Njenga', 'Rift Valley Institute of Business Studies', 'KSh 17,900', '537816', 'FRANCIS', '/student_francis_njenga_face.jpg', '/student_francis_njenga_face.jpg', 'Automotive engineering', '03', 'Help Francis complete his automotive engineering training and step into a trade that builds Nakuru''s future.', ARRAY[
  'Francis Njenga is studying automotive engineering at the Rift Valley Institute of Business Studies, training for a trade that turns curiosity into livelihood.',
  'He is close to finishing his course, but the remaining KSh 17,900 in fees stands between him and his qualification. Pay directly to his school using Paybill 537816, account FRANCIS.',
  'By supporting Francis, you are funding a young tradesperson ready to work, repair, hire and give back to Nakuru County.'
], FALSE, NULL, NULL, NULL, TRUE, 3, '2026-09-20 10:00:00+03', '2026-09-20 10:00:00+03'),

(gen_random_uuid(), 'paul-prince', 'Paul Prince', 'Rift Valley Institute of Business Studies', 'KSh 18,900', '537816', 'PAUL', '/Paul_Prince_student_portrait.jpg', '/Paul_Prince_student_portrait.jpg', 'Catering and Management', '04', 'Help Paul complete his catering and management training and step into a hospitality career serving Nakuru.', ARRAY[
  'Paul Prince is a catering and management student at the Rift Valley Institute of Business Studies, building the practical service, kitchen and hospitality skills that put food on tables and people in work.',
  'He is close to finishing his course, but the remaining KSh 18,900 in fees stands between him and his qualification. Pay directly to his school (Paybill 537816, account PAUL) and send us a note so we can credit your contribution.',
  'By supporting Paul, you are investing in a young hospitality professional ready to cook, host, employ, and give back to Nakuru County.'
], FALSE, NULL, NULL, NULL, TRUE, 4, '2026-09-20 10:00:00+03', '2026-09-20 10:00:00+03')
ON CONFLICT (slug) DO NOTHING;