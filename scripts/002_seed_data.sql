-- Seed data for LinguaFlash
-- This script adds sample languages, categories, and words

-- Insert Languages
INSERT INTO languages (name, code, flag_emoji) VALUES
  ('Ingles', 'en', '🇺🇸'),
  ('Espanhol', 'es', '🇪🇸'),
  ('Frances', 'fr', '🇫🇷')
ON CONFLICT DO NOTHING;

-- Insert Categories for English
INSERT INTO categories (name, description, language_id)
SELECT 'Saudacoes', 'Palavras e expressoes para cumprimentar pessoas', id
FROM languages WHERE code = 'en'
ON CONFLICT DO NOTHING;

INSERT INTO categories (name, description, language_id)
SELECT 'Viagens', 'Vocabulario essencial para viagens', id
FROM languages WHERE code = 'en'
ON CONFLICT DO NOTHING;

INSERT INTO categories (name, description, language_id)
SELECT 'Comida', 'Palavras relacionadas a alimentacao', id
FROM languages WHERE code = 'en'
ON CONFLICT DO NOTHING;

INSERT INTO categories (name, description, language_id)
SELECT 'Negocios', 'Vocabulario profissional e de escritorio', id
FROM languages WHERE code = 'en'
ON CONFLICT DO NOTHING;

-- Insert Categories for Spanish
INSERT INTO categories (name, description, language_id)
SELECT 'Saludos', 'Palabras y expresiones para saludar', id
FROM languages WHERE code = 'es'
ON CONFLICT DO NOTHING;

INSERT INTO categories (name, description, language_id)
SELECT 'Viajes', 'Vocabulario esencial para viajar', id
FROM languages WHERE code = 'es'
ON CONFLICT DO NOTHING;

-- Insert Categories for French
INSERT INTO categories (name, description, language_id)
SELECT 'Salutations', 'Mots et expressions pour saluer', id
FROM languages WHERE code = 'fr'
ON CONFLICT DO NOTHING;

-- Insert Words for English - Greetings
INSERT INTO words (original_word, translated_word, pronunciation, example_sentence, category_id, language_id, difficulty_level)
SELECT 'Hello', 'Ola', 'heh-LOH', 'Hello, how are you today?', c.id, l.id, 'easy'
FROM categories c JOIN languages l ON c.language_id = l.id
WHERE c.name = 'Saudacoes' AND l.code = 'en'
ON CONFLICT DO NOTHING;

INSERT INTO words (original_word, translated_word, pronunciation, example_sentence, category_id, language_id, difficulty_level)
SELECT 'Goodbye', 'Adeus', 'good-BYE', 'Goodbye, see you tomorrow!', c.id, l.id, 'easy'
FROM categories c JOIN languages l ON c.language_id = l.id
WHERE c.name = 'Saudacoes' AND l.code = 'en'
ON CONFLICT DO NOTHING;

INSERT INTO words (original_word, translated_word, pronunciation, example_sentence, category_id, language_id, difficulty_level)
SELECT 'Good morning', 'Bom dia', 'good MOR-ning', 'Good morning, beautiful day!', c.id, l.id, 'easy'
FROM categories c JOIN languages l ON c.language_id = l.id
WHERE c.name = 'Saudacoes' AND l.code = 'en'
ON CONFLICT DO NOTHING;

INSERT INTO words (original_word, translated_word, pronunciation, example_sentence, category_id, language_id, difficulty_level)
SELECT 'Good night', 'Boa noite', 'good NIGHT', 'Good night, sleep well.', c.id, l.id, 'easy'
FROM categories c JOIN languages l ON c.language_id = l.id
WHERE c.name = 'Saudacoes' AND l.code = 'en'
ON CONFLICT DO NOTHING;

INSERT INTO words (original_word, translated_word, pronunciation, example_sentence, category_id, language_id, difficulty_level)
SELECT 'Thank you', 'Obrigado', 'THANK yoo', 'Thank you for your help!', c.id, l.id, 'easy'
FROM categories c JOIN languages l ON c.language_id = l.id
WHERE c.name = 'Saudacoes' AND l.code = 'en'
ON CONFLICT DO NOTHING;

INSERT INTO words (original_word, translated_word, pronunciation, example_sentence, category_id, language_id, difficulty_level)
SELECT 'Please', 'Por favor', 'pleez', 'Please, can you help me?', c.id, l.id, 'easy'
FROM categories c JOIN languages l ON c.language_id = l.id
WHERE c.name = 'Saudacoes' AND l.code = 'en'
ON CONFLICT DO NOTHING;

-- Insert Words for English - Travel
INSERT INTO words (original_word, translated_word, pronunciation, example_sentence, category_id, language_id, difficulty_level)
SELECT 'Airport', 'Aeroporto', 'AIR-port', 'The airport is very busy today.', c.id, l.id, 'easy'
FROM categories c JOIN languages l ON c.language_id = l.id
WHERE c.name = 'Viagens' AND l.code = 'en'
ON CONFLICT DO NOTHING;

INSERT INTO words (original_word, translated_word, pronunciation, example_sentence, category_id, language_id, difficulty_level)
SELECT 'Hotel', 'Hotel', 'hoh-TEL', 'I booked a hotel near the beach.', c.id, l.id, 'easy'
FROM categories c JOIN languages l ON c.language_id = l.id
WHERE c.name = 'Viagens' AND l.code = 'en'
ON CONFLICT DO NOTHING;

INSERT INTO words (original_word, translated_word, pronunciation, example_sentence, category_id, language_id, difficulty_level)
SELECT 'Passport', 'Passaporte', 'PASS-port', 'Don''t forget your passport!', c.id, l.id, 'medium'
FROM categories c JOIN languages l ON c.language_id = l.id
WHERE c.name = 'Viagens' AND l.code = 'en'
ON CONFLICT DO NOTHING;

INSERT INTO words (original_word, translated_word, pronunciation, example_sentence, category_id, language_id, difficulty_level)
SELECT 'Luggage', 'Bagagem', 'LUG-ij', 'My luggage was lost at the airport.', c.id, l.id, 'medium'
FROM categories c JOIN languages l ON c.language_id = l.id
WHERE c.name = 'Viagens' AND l.code = 'en'
ON CONFLICT DO NOTHING;

INSERT INTO words (original_word, translated_word, pronunciation, example_sentence, category_id, language_id, difficulty_level)
SELECT 'Reservation', 'Reserva', 'rez-er-VAY-shun', 'I have a reservation for tonight.', c.id, l.id, 'medium'
FROM categories c JOIN languages l ON c.language_id = l.id
WHERE c.name = 'Viagens' AND l.code = 'en'
ON CONFLICT DO NOTHING;

-- Insert Words for English - Food
INSERT INTO words (original_word, translated_word, pronunciation, example_sentence, category_id, language_id, difficulty_level)
SELECT 'Restaurant', 'Restaurante', 'RES-tuh-rahnt', 'Let''s go to a restaurant.', c.id, l.id, 'easy'
FROM categories c JOIN languages l ON c.language_id = l.id
WHERE c.name = 'Comida' AND l.code = 'en'
ON CONFLICT DO NOTHING;

INSERT INTO words (original_word, translated_word, pronunciation, example_sentence, category_id, language_id, difficulty_level)
SELECT 'Water', 'Agua', 'WAH-ter', 'Can I have some water, please?', c.id, l.id, 'easy'
FROM categories c JOIN languages l ON c.language_id = l.id
WHERE c.name = 'Comida' AND l.code = 'en'
ON CONFLICT DO NOTHING;

INSERT INTO words (original_word, translated_word, pronunciation, example_sentence, category_id, language_id, difficulty_level)
SELECT 'Breakfast', 'Cafe da manha', 'BREK-fust', 'Breakfast is served at 8 AM.', c.id, l.id, 'medium'
FROM categories c JOIN languages l ON c.language_id = l.id
WHERE c.name = 'Comida' AND l.code = 'en'
ON CONFLICT DO NOTHING;

INSERT INTO words (original_word, translated_word, pronunciation, example_sentence, category_id, language_id, difficulty_level)
SELECT 'Delicious', 'Delicioso', 'dih-LISH-us', 'This food is delicious!', c.id, l.id, 'medium'
FROM categories c JOIN languages l ON c.language_id = l.id
WHERE c.name = 'Comida' AND l.code = 'en'
ON CONFLICT DO NOTHING;

-- Insert Words for English - Business
INSERT INTO words (original_word, translated_word, pronunciation, example_sentence, category_id, language_id, difficulty_level)
SELECT 'Meeting', 'Reuniao', 'MEE-ting', 'We have a meeting at 3 PM.', c.id, l.id, 'medium'
FROM categories c JOIN languages l ON c.language_id = l.id
WHERE c.name = 'Negocios' AND l.code = 'en'
ON CONFLICT DO NOTHING;

INSERT INTO words (original_word, translated_word, pronunciation, example_sentence, category_id, language_id, difficulty_level)
SELECT 'Deadline', 'Prazo', 'DED-line', 'The deadline is next Friday.', c.id, l.id, 'hard'
FROM categories c JOIN languages l ON c.language_id = l.id
WHERE c.name = 'Negocios' AND l.code = 'en'
ON CONFLICT DO NOTHING;

INSERT INTO words (original_word, translated_word, pronunciation, example_sentence, category_id, language_id, difficulty_level)
SELECT 'Schedule', 'Agenda', 'SKED-jool', 'Check my schedule for tomorrow.', c.id, l.id, 'hard'
FROM categories c JOIN languages l ON c.language_id = l.id
WHERE c.name = 'Negocios' AND l.code = 'en'
ON CONFLICT DO NOTHING;

-- Insert Words for Spanish - Greetings
INSERT INTO words (original_word, translated_word, pronunciation, example_sentence, category_id, language_id, difficulty_level)
SELECT 'Hola', 'Ola', 'OH-lah', 'Hola, como estas?', c.id, l.id, 'easy'
FROM categories c JOIN languages l ON c.language_id = l.id
WHERE c.name = 'Saludos' AND l.code = 'es'
ON CONFLICT DO NOTHING;

INSERT INTO words (original_word, translated_word, pronunciation, example_sentence, category_id, language_id, difficulty_level)
SELECT 'Buenos dias', 'Bom dia', 'BWEH-nohs DEE-ahs', 'Buenos dias, senor!', c.id, l.id, 'easy'
FROM categories c JOIN languages l ON c.language_id = l.id
WHERE c.name = 'Saludos' AND l.code = 'es'
ON CONFLICT DO NOTHING;

INSERT INTO words (original_word, translated_word, pronunciation, example_sentence, category_id, language_id, difficulty_level)
SELECT 'Gracias', 'Obrigado', 'GRAH-syahs', 'Muchas gracias por tu ayuda.', c.id, l.id, 'easy'
FROM categories c JOIN languages l ON c.language_id = l.id
WHERE c.name = 'Saludos' AND l.code = 'es'
ON CONFLICT DO NOTHING;

-- Insert Words for French - Greetings
INSERT INTO words (original_word, translated_word, pronunciation, example_sentence, category_id, language_id, difficulty_level)
SELECT 'Bonjour', 'Bom dia / Ola', 'bohn-ZHOOR', 'Bonjour, comment allez-vous?', c.id, l.id, 'easy'
FROM categories c JOIN languages l ON c.language_id = l.id
WHERE c.name = 'Salutations' AND l.code = 'fr'
ON CONFLICT DO NOTHING;

INSERT INTO words (original_word, translated_word, pronunciation, example_sentence, category_id, language_id, difficulty_level)
SELECT 'Merci', 'Obrigado', 'mehr-SEE', 'Merci beaucoup!', c.id, l.id, 'easy'
FROM categories c JOIN languages l ON c.language_id = l.id
WHERE c.name = 'Salutations' AND l.code = 'fr'
ON CONFLICT DO NOTHING;

INSERT INTO words (original_word, translated_word, pronunciation, example_sentence, category_id, language_id, difficulty_level)
SELECT 'Au revoir', 'Adeus', 'oh ruh-VWAHR', 'Au revoir, a bientot!', c.id, l.id, 'medium'
FROM categories c JOIN languages l ON c.language_id = l.id
WHERE c.name = 'Salutations' AND l.code = 'fr'
ON CONFLICT DO NOTHING;
