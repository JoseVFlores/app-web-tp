create database database_links;

use database_links;

create table user(
    id int(11) not null,
    username varchar(16) not null,
    password varchar(60) not null,
    fullname varchar(100) not null,
);

alter table user
add primary key(id);

alter table user
modify id(11) not null auto_increment,auto_increment=2;

describe user;