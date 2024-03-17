create table if not exists account (
    id integer primary key,
    username text unique not null,
    bcryptPassword text not null,
    level int not null default 1, /* 1=user, 2=admin */
    rank int not null default 0,
    credits int not null default 0
);

create table if not exists request (
    id integer primary key,
    time_sent timestamp not null default current_timestamp,
    status int not null default 0, /* 0=pending, 1=accepted (TODO creates match), 2=declined */
    from_id int not null references account(id),
    to_id int not null references account(id)
);

create table if not exists game (
    id integer primary key,
    player1_id int not null references account(id),
    player2_id int not null references account(id),
    time_start timestamp not null default current_timestamp,
    time_end timestamp,
    playing boolean not null default true,
    winning_player_id int references account(id) /* null if draw or still playing */
);

create table if not exists message (
    id integer primary key,
    from_id int not null references account(id),
    time_sent timestamp not null default current_timestamp,
    content text
);

/* only static ship data */
create table if not exists ship (
    id integer primary key,
    name text not null,
    size int not null, /* how many grid positions it occupies */
    health int not null /* how many hits it can take before being destroyed */
);


/*
 * === POPULATE DEFAULTS ===
 */

insert or replace into account(id, username, bcryptPassword, level, rank, credits) values
    (1, 'admin', '$2b$12$9BwyzrkCBioedc6.YLh6xO8jWpHfMeN6hrguMR7qAY7m8CSGrt8Si', 2, 10, 999), /* admin */
    (2, 'user', '$2b$12$aSC4i0puHmBhEOPdm/ocKOJD4Se3KiajWMznvdx4vN.p./yEWfuee', 1, 0, 0) /* user */
;

insert or replace into ship(id, name, size, health) values
    (1, 'Carrier', 5, 5),
    (2, 'Battleship', 4, 4),
    (3, 'Cruiser', 3, 3),
    (4, 'Submarine', 3, 3),
    (5, 'Destroyer', 2, 2)
;

insert or replace into message(id, from_id, time_sent, content) values
    (1, 1, '2022-01-01 00:00:00', 'Hello, world!')
;
