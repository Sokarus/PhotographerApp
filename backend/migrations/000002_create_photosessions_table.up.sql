create table
    photosessions (
        id serial primary key,
        title varchar(100) not null,
        folder_name varchar(100) not null,
        position integer not null,
        public boolean not null default true,
        type varchar(100) not null,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_folder_name UNIQUE (folder_name)
    );