create table
    photos (
        id serial primary key,
        name text not null,
        position integer not null,
        public boolean not null default true,
        photosession_id int,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (photosession_id) REFERENCES photosessions (id) ON DELETE CASCADE
    );