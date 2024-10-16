create table users (
    id SERIAL PRIMARY KEY,
    login VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_login UNIQUE (login),
    CONSTRAINT unique_email UNIQUE (email)
);