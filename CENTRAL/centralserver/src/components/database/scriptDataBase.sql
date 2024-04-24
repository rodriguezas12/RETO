create database loginbase;
use loginbase;


CREATE TABLE login (
    username varchar(50) not null,
    password varchar(50) not null,
    primary key(username,password)
);

INSERT INTO login (username, password) VALUES
    ('user1', 'contraseña1'),
    ('user2', 'contraseña2'),
    ('user3', 'contraseña3');
