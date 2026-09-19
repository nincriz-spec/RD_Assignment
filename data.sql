use recipes;


-- 1. Insert Users
INSERT INTO users (email, password) VALUES
('alice@example.com', '$2y$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGH'),
('bob@example.com', '$2y$10$zyxwvutsrqponmlkjihgfedcba0987654321FEDCBA'),
('carol@example.com', '$2y$10$1234567890abcdefghijklmnopqrstuvwxyzABCDEFGH'),
('dave@example.com', '$2y$10$ABCDEFGHIJKLMNOPQRSTUVWXYZ0987654321abcdefgh'),
('eve@example.com', '$2y$10$mnopqrstuvwxyzabcdefghijkl0123456789ABCDEFGH');

-- 2. Insert Cuisines
INSERT INTO cuisines (name) VALUES
('Italian'),
('Mexican'),
('Japanese'),
('Indian'),
('Thai'),
('French'),
('Chinese'),
('Mediterranean'),
('American'),
('Korean');

-- 3. Insert Tags
INSERT INTO tags (name) VALUES
('vegetarian'),
('vegan'),
('gluten-free'),
('dairy-free'),
('quick'),
('easy'),
('spicy'),
('sweet'),
('healthy'),
('comfort-food'),
('low-carb'),
('high-protein'),
('kid-friendly'),
('meal-prep'),
('one-pot');

-- 4. Insert Recipes
INSERT INTO recipes (title, instructions, cuisine_id, user_id) VALUES
('Spaghetti Carbonara',
 '1. Cook spaghetti in salted boiling water until al dente.\n2. Whisk eggs with grated Parmesan and black pepper.\n3. Fry pancetta until crispy.\n4. Toss hot pasta with pancetta, then remove from heat.\n5. Quickly stir in egg mixture, adding pasta water to loosen.\n6. Serve immediately with extra Parmesan.',
 1, 1),

('Chicken Tikka Masala',
 '1. Marinate chicken in yogurt, lemon, and spices for 2 hours.\n2. Grill or pan-sear chicken until charred.\n3. Sauté onions, garlic, ginger, and spices.\n4. Add tomato puree and simmer 15 minutes.\n5. Stir in cream and add chicken.\n6. Simmer 10 minutes and serve with rice.',
 4, 2),

('Beef Tacos',
 '1. Brown ground beef with onion and garlic.\n2. Add taco seasoning and a splash of water; simmer.\n3. Warm corn tortillas on a dry skillet.\n4. Fill tortillas with beef.\n5. Top with lettuce, tomato, cheese, and salsa.\n6. Serve with lime wedges.',
 2, 3),

('Vegetable Pad Thai',
 '1. Soak rice noodles in warm water for 20 minutes.\n2. Stir-fry tofu until golden; set aside.\n3. Sauté garlic, shallots, and egg.\n4. Add noodles, tamarind sauce, and soy sauce.\n5. Toss in bean sprouts, tofu, and peanuts.\n6. Garnish with lime and cilantro.',
 5, 4),

('Miso Soup',
 '1. Bring dashi stock to a gentle simmer.\n2. Add diced tofu and wakame seaweed.\n3. Whisk miso paste with a ladle of hot broth.\n4. Stir miso mixture back into pot (do not boil).\n5. Add sliced green onions.\n6. Serve immediately.',
 3, 5),

('Margherita Pizza',
 '1. Stretch pizza dough onto a floured peel.\n2. Spread crushed San Marzano tomatoes.\n3. Add fresh mozzarella slices.\n4. Bake at 500°F (260°C) for 8-10 minutes.\n5. Top with fresh basil leaves.\n6. Drizzle with olive oil and serve.',
 1, 1),

('Guacamole',
 '1. Mash ripe avocados in a bowl.\n2. Add lime juice, salt, and cumin.\n3. Fold in diced onion, tomato, and jalapeño.\n4. Stir in chopped cilantro.\n5. Adjust seasoning to taste.\n6. Serve with tortilla chips.',
 2, 3),

('Butter Chicken',
 '1. Marinate chicken in yogurt and spices for 1 hour.\n2. Sear chicken and set aside.\n3. Sauté onion, garlic, ginger, and spices.\n4. Blend tomato mixture until smooth.\n5. Add butter, cream, and chicken; simmer.\n6. Serve with naan or basmati rice.',
 4, 2),

('Sushi Rolls',
 '1. Cook and season sushi rice with vinegar and sugar.\n2. Place nori on a bamboo mat.\n3. Spread rice evenly, leaving a 1-inch border.\n4. Add fillings (cucumber, avocado, fish) in a line.\n5. Roll tightly using the mat.\n6. Slice with a wet knife and serve with soy sauce.',
 3, 5),

('French Onion Soup',
 '1. Caramelize sliced onions in butter for 45 minutes.\n2. Deglaze with white wine.\n3. Add beef stock and thyme; simmer 30 minutes.\n4. Ladle into oven-safe bowls.\n5. Top with baguette slices and Gruyère.\n6. Broil until cheese is bubbly and golden.',
 6, 4),

('Kung Pao Chicken',
 '1. Marinate diced chicken in soy sauce and cornstarch.\n2. Stir-fry chicken in a wok until cooked.\n3. Add dried chilies and Sichuan peppercorns.\n4. Toss in peanuts and vegetables.\n5. Add sauce (soy, vinegar, sugar, garlic).\n6. Stir-fry until glossy and serve with rice.',
 7, 2),

('Greek Salad',
 '1. Chop tomatoes, cucumber, and red onion.\n2. Add Kalamata olives and green pepper.\n3. Top with a block of feta cheese.\n4. Sprinkle with oregano.\n5. Drizzle with olive oil and red wine vinegar.\n6. Toss gently and serve.',
 8, 1),

('BBQ Pulled Pork',
 '1. Rub pork shoulder with spice blend.\n2. Slow cook for 8 hours until tender.\n3. Shred with two forks.\n4. Mix with BBQ sauce.\n5. Pile onto brioche buns.\n6. Top with coleslaw and pickles.',
 9, 3),

('Bibimbap',
 '1. Cook rice and set aside.\n2. Sauté separately: spinach, carrots, mushrooms, zucchini.\n3. Cook marinated beef.\n4. Fry an egg sunny-side up.\n5. Arrange toppings over rice in a bowl.\n6. Add gochujang and mix before eating.',
 10, 5),

('Ratatouille',
 '1. Thinly slice eggplant, zucchini, squash, and tomatoes.\n2. Spread tomato sauce in a baking dish.\n3. Arrange sliced vegetables in a spiral.\n4. Drizzle with olive oil and herbs.\n5. Cover with parchment and bake at 375°F (190°C) for 45 minutes.\n6. Uncover and bake 15 more minutes.',
 6, 4),

('Chicken Fried Rice',
 '1. Cook rice and chill overnight.\n2. Scramble eggs and set aside.\n3. Stir-fry chicken until cooked.\n4. Add cold rice and vegetables.\n5. Season with soy sauce and sesame oil.\n6. Fold in eggs and green onions.',
 7, 2),

('Tom Yum Soup',
 '1. Bring chicken stock to a boil.\n2. Add lemongrass, galangal, and kaffir lime leaves.\n3. Add shrimp and mushrooms.\n4. Season with fish sauce, lime juice, and chili paste.\n5. Simmer until shrimp is cooked.\n6. Garnish with cilantro.',
 5, 3),

('Falafel Wrap',
 '1. Blend soaked chickpeas with herbs and spices.\n2. Form into balls and fry until golden.\n3. Warm pita bread.\n4. Spread hummus on pita.\n5. Add falafel, lettuce, tomato, and pickles.\n6. Drizzle with tahini sauce and wrap.',
 8, 1),

('Cheeseburger',
 '1. Form ground beef into patties; season both sides.\n2. Grill 4 minutes per side for medium.\n3. Top with cheddar during last minute.\n4. Toast burger buns.\n5. Assemble with lettuce, tomato, onion, and pickles.\n6. Add ketchup, mustard, and mayo.',
 9, 3),

('Kimchi Jjigae',
 '1. Sauté chopped kimchi and pork belly.\n2. Add gochugaru and garlic.\n3. Pour in water or stock; simmer 20 minutes.\n4. Add tofu cubes.\n5. Simmer 10 more minutes.\n6. Garnish with green onions and serve with rice.',
 10, 5);

-- 5. Insert Recipes_Tags (junction data)
INSERT INTO recipes_tags (recipe_id, tag_id) VALUES
-- Spaghetti Carbonara (1): comfort-food, quick
(1, 10), (1, 5),
-- Chicken Tikka Masala (2): spicy, high-protein
(2, 7), (2, 12),
-- Beef Tacos (3): kid-friendly, quick
(3, 13), (3, 5),
-- Vegetable Pad Thai (4): vegetarian, dairy-free
(4, 1), (4, 4),
-- Miso Soup (5): vegan, healthy, low-carb
(5, 2), (5, 9), (5, 11),
-- Margherita Pizza (6): vegetarian, comfort-food, kid-friendly
(6, 1), (6, 10), (6, 13),
-- Guacamole (7): vegan, gluten-free, healthy
(7, 2), (7, 3), (7, 9),
-- Butter Chicken (8): high-protein, comfort-food
(8, 12), (8, 10),
-- Sushi Rolls (9): healthy, dairy-free
(9, 9), (9, 4),
-- French Onion Soup (10): comfort-food
(10, 10),
-- Kung Pao Chicken (11): spicy, high-protein
(11, 7), (11, 12),
-- Greek Salad (12): vegetarian, healthy, gluten-free
(12, 1), (12, 9), (12, 3),
-- BBQ Pulled Pork (13): comfort-food, kid-friendly
(13, 10), (13, 13),
-- Bibimbap (14): healthy, spicy
(14, 9), (14, 7),
-- Ratatouille (15): vegan, gluten-free, healthy
(15, 2), (15, 3), (15, 9),
-- Chicken Fried Rice (16): quick, kid-friendly, meal-prep
(16, 5), (16, 13), (16, 14),
-- Tom Yum Soup (17): spicy, dairy-free, low-carb
(17, 7), (17, 4), (17, 11),
-- Falafel Wrap (18): vegan, healthy
(18, 2), (18, 9),
-- Cheeseburger (19): comfort-food, kid-friendly, high-protein
(19, 10), (19, 13), (19, 12),
-- Kimchi Jjigae (20): spicy, high-protein, one-pot
(20, 7), (20, 12), (20, 15);