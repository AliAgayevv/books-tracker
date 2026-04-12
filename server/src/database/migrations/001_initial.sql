CREATE TYPE book_status AS ENUM ('want_to_read', 'currently_reading', 'read');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    ol_work_id VARCHAR(50)  NOT NULL,
    ol_edition_id VARCHAR(50)  UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    publisher VARCHAR(255),
    published_year SMALLINT,
    isbn VARCHAR(20),
    cover_url VARCHAR(500),
    language VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_books(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
    status book_status NOT NULL,
    rating SMALLINT CHECK (rating >= 1 AND rating <= 5),
    started_at TIMESTAMPTZ,
    finished_at TIMESTAMPTZ,
    added_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (user_id, book_id)
);

