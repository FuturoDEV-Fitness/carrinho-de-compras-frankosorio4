-- ex1 -----------------------------------------
-------------------------------------------------
-- Convite: https://classroom.github.com/a/dNOfMvCD
-- Crie as branchs usando o formato de gitflow.
-- Essa atividade é individual, portanto, o aluno deverá criar toda estrutura inicial do projeto.


create table clients(
	id serial primary key,
	name varchar(150) not null,
	email varchar(150) unique not null, 
	cpf varchar(50) unique not null,
	contact varchar(20) not null
)

-- ex2.1 ----------------------------------------
-------------------------------------------------
-- 1 - Crie uma tabela chamada clients com os seguintes campos:
-- id serial auto incremento;
-- name varchar(150) not null;
-- email varchar(150) unique not null;
-- cpf varchar(50) unique not null;
-- contact varchar(20) not null;
-- 2 - Implemente no arquivo clients.routes.js uma rota  POST para cadastrar um cliente
-- Implemente os métodos de cada rota dentro do arquivo ClientController.js.

create table categories(
	id serial primary key,
	name varchar(150) not null
)

insert into categories (name)
	values ('Eletrônicos')
insert into categories (name)
	values ('Roupas e Acessórios')
insert into categories (name)
	values ('Alimentos e Bebidas')
insert into categories (name)
	values ('Saúde e Beleza')
insert into categories (name)
	values ('Casa e Decoração')
insert into categories (name)
	values ('Livros e Papelaria')
insert into categories (name)
	values ('Esportes')
insert into categories (name)
	values ('Brinquedos e Jogos')
insert into categories (name)
	values ('Automotivo')
insert into categories (name)
	values ('Ferramentas e Construção')

-- ex2.2 ----------------------------------------
create type voltage_enum as enum('220', '110', 'n/a');

create table products(
	id serial primary key,
	name varchar(150) not null,
	amount int default 0 not null, 
	color varchar(50),
	voltage voltage_enum,
	description text,
	price decimal(10,2) not null,
	category_id int not null,
	foreign key (category_id) 
		references categories(id)
)

-- alter table to add column price to table products
alter table products add column price decimal(10,2)

-- ex3 ------------------------------------------
-------------------------------------------------
-- >>>>>>>>> ETAPA 1
-- 1 - Crie uma tabela chamada categories com os seguintes campos:
-- id serial auto incremento;
-- name varchar(150) NOT NULL;Crie um script SQL inserindo 10 categorias no banco de dados.>>>>>>>>> ETAPA 2Crie uma tabela chamada products com os seguintes campos:
-- id serial auto incremento;
-- name varchar(150) NOT NULL;
-- amount varchar(150) unique default 0;
-- color varchar(50)
-- voltage ENUM (110 ou 220)
-- description TEXT
-- category_id fk NOT NULL
-- 2 - Implemente no arquivo products.routes.js uma rota para cadastrar um produto
-- Implemente os métodos de cada rota dentro do arquivo ProductController.js.

--para adjuntar una nueva columna a una tabla existente pero que esta este viinculada a otra tabla (foreign key)
alter table nome_table
	add column nome_column integer 

	alter table nome_table 
		add constraint nome_column
	    FOREIGN KEY(nome_column) 
	    REFERENCES tabla_reference(column_reference)

-- ex4 ------------------------------------------
-------------------------------------------------
-- 1 - Implemente no arquivo products.routes.js uma rota para listar todos os produtos.
-- Implemente os métodos de cada rota dentro do arquivo ProductController.js.

with postman get
http://localhost:3000/products/

-- query implemente in th nodejs file
select * from products

-- ex5 ------------------------------------------
-------------------------------------------------
-- 1 - Implemente no arquivo products.routes.js uma rota para listar um produto com detalhes (use join para os relacionamentos com a categoria).
-- Implemente os métodos de cada rota dentro do arquivo ProductController.js.

with postman get
http://localhost:3000/products/id

-- query implemente in th nodejs file
select 
	p.id,
	p.name as product_name,
	p.price,
	p.amount, 
	p.color, 
	p.voltage,
	p.description,
	c.name as category
	from products p
inner join categories c on 
	p.category_id = c.id
where p.id = 7

-- ex6 ------------------------------------------
-------------------------------------------------
-- 1 - Crie uma tabela chamada orders com os seguintes campos:
-- id serial auto incremento;
-- client_id FK;
-- total decimal (10,2);
-- address TEXT;
-- observations.

-- 2 - Crie uma tabela chamada orders_items com os seguintes campos:
-- id serial auto incremento;
-- order_id FK;
-- product_id (10,2);
-- amount TEXT;
-- price.

-- 3 - Implemente no arquivo orders.js uma rota para cadastrar um carrinho juntamente com os itens.

create table orders (
	id serial primary key,
	client_id int not null,
	total decimal(10,2) not null,
	address TEXT not null,
	observations TEXT,
    FOREIGN KEY (client_id) REFERENCES clients(id)
)

create table orders_items(
	id serial primary key,
	order_id int not null,
	product_id int not null,
	amount int not null,
	price decimal(10,2) not null,
	foreign key (order_id) 
		references orders(id),
	foreign key (product_id) 
		references products(id)
)

-------------------------------------------------------
-- REQUESTS
-------------------------------------------------------

-- json request POST CLIENT
---- http://localhost:3000/clients/
{
    "name": "andrea",
    "email": "andrea@email.com",
    "cpf": "123456789101",
    "contact": "555555"
}

-- json request POST PRODUCT
-- http://localhost:3000/products/
{
    "name": "fisica",
    "amount": 10,
    "color": "blue",
    "voltage": "n/a",
    "description": "fisica universitaria",
    "price": 75,
    "category_id": 15
}

-- json request POST ORDER
--http://localhost:3000/orders/
{
   "client_id": 8,
   "address": "Endereço...",
   "observations": "Observação...",
   "products": [
     {
        "product_id": 6,
        "amount": 1
     },
	 {
        "product_id": 7,
        "amount": 1
     },
	 {
        "product_id": 8,
        "amount": 1
     }
   ]
}