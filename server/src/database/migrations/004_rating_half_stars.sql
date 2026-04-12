ALTER TABLE user_books ALTER COLUMN rating TYPE NUMERIC(3,1);
ALTER TABLE user_books DROP CONSTRAINT IF EXISTS user_books_rating_check;
ALTER TABLE user_books ADD CONSTRAINT user_books_rating_check
  CHECK (rating >= 1 AND rating <= 5 AND rating * 2 = FLOOR(rating * 2));
