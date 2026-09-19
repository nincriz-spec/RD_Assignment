drop database if exists recipes;
create database recipes;
use recipes;

create table cuisines(
    cuisine_id int unsigned auto_increment primary key,
    name varchar(255) not null
) engine = innodb;

create table users(
    user_id int unsigned auto_increment primary key,
    email varchar(255) not null unique, -- so two users cannot register the same email
    password varchar(255) not null
) engine = innodb;

create table tags (
    tag_id int unsigned auto_increment primary key,
    name varchar(255) not null
) engine = innodb;

create table recipes (
    recipe_id int unsigned auto_increment primary key,
    title varchar(255) not null,
    instructions text not null,
    date_created datetime not null default current_timestamp,
    last_updated datetime null default current_timestamp on update current_timestamp,
    cuisine_id int unsigned not null,
    user_id int unsigned not null,

    constraint fk_recipe_cuisines
    foreign key (cuisine_id) references cuisines(cuisine_id),

    constraint fk_recipe_users
    foreign key (user_id) references users(user_id)

    on delete cascade
    on update restrict
) engine = innodb;

create table recipes_tags (
    recipes_tag_id int unsigned auto_increment primary key,
    recipe_id int unsigned not null, -- renamed from ingredient_recipe_id
    tag_id int unsigned not null, -- adjusted name(was ingredient_id) 

    constraint fk_recipe_tags_recipe
    foreign key (recipe_id) references recipes(recipe_id)
    on delete cascade
    on update restrict,

    constraint fk_recipe_tags_tags
    foreign key (tag_id) references tags(tag_id)

    on delete cascade
    on update restrict,

    constraint uq_recipe_tag unique (recipe_id, tag_id) -- prevents adding the same tag to a recipe twice
) engine = innodb;