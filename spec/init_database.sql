create table customers(
customer_id serial primary key,
name varchar(254) not null,
email varchar(254) not null,
password varchar(254) not null,
address varchar(254) not null);

create table restaurants(
restaurant_id serial primary key,
name varchar(254) not null,
email varchar(254) not null,
password varchar(254) not null,
address varchar(254) not null,
restaurant_image_url varchar(254));

create table food_items(
food_item_id serial primary key,
restaurant_id int not null references restaurants(restaurant_id),
food_name varchar(254) not null,
price int not null,
veg boolean not null,
serving int not null,
food_image_url varchar(256));

create table carts(
customer_id int not null references customers(customer_id),
food_item_id int not null references food_items(food_item_id),
quantity int not null);

create table tag(
tag_id serial primary key,
tag_name varchar(254));

create table restaurant_tags(
restaurant_id int not null references restaurants(restaurant_id),
tag_id int not null references tag(tag_id));

create table rating_foods(
rating_food_id serial primary key,
customer_id int not null references customers(customer_id),
rating int not null check (rating > 0 and rating <= 5),
food_item_id int not null references food_items(food_item_id));

create table review_restaurants(
review_restaurant_id serial primary key,
customer_id int not null references customers(customer_id),
rating int not null check (rating > 0 and rating <= 5),
review varchar(1000),
restaurant_id int not null references restaurants(restaurant_id));

create table orders(
order_id serial primary key,
food_item_id int not null references food_items(food_item_id),
customer_id int not null references customers(customer_id),
quantity int not null,
timestamp timestamp not null,
delivery_location varchar(254) not null,
completed boolean not null);

create table images(
image_id serial primary key,
buffer text not null,
mimetype text not null);
