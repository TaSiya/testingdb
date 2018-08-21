create table users(
    id serial not null primary key,
    greet_count int not null,
    name varchar(20) not null
);