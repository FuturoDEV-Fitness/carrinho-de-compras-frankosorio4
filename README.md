# **CARRINHO DE COMPRAS**

O carrinho de compras e uma aplicação simples de Back-end que permite receber os dados de um usuário via uma API para cadastrá-lo na base de dados de um site. Uma vez cadastrado, esta aplicação permite a o usuário guardar os itens de seu carrinho na base de dados, com todas as informaçoes dos itens, e retornar para o cliente o preço total do pedido.

## Tecnologias utilizadas
-NODEJS

![image](https://github.com/FuturoDEV-Fitness/carrinho-de-compras-frankosorio4/assets/141787907/46063f9a-53d7-461a-858d-9c8238e6984e)

-PGSQL

![image](https://github.com/FuturoDEV-Fitness/carrinho-de-compras-frankosorio4/assets/141787907/1d2d047d-3887-4b37-9fa4-d5e07620c1a7)

-POSTMAN

![image](https://github.com/FuturoDEV-Fitness/carrinho-de-compras-frankosorio4/assets/141787907/6875cf76-33ba-41a6-8991-36143fa5d089)

## Livrarias utilizadas:
- express (https://expressjs.com/)
- pg (https://node-postgres.com/)

## Como executar

- Clone o repositório.

- Abra o terminal no diretório do repositório descarregado e instale as seguintes bibliotecas usando ```npm install```.
- Para iniciar:

  Você pode configurar para iniciar e manter o servidor online com o comando ```npm start```. Para fazer isso, voce tem que establecer no arquivo package.json do repositório o comando de inicializaçao ```"start": "nodemon src/index.js"```.

## Documentação da API

- Método POST client:
  
  **URL** para local request: http://localhost:3000/clients/

  **Request:**
  ```
  {
    "name": "nome_cliente",
    "email": "cliente@email.com",
    "cpf": "123456789101",
    "contact": "contato_cliente"
  }
  ```
  
  **Base de dados:**
  ```
  create table clients(
  	id serial primary key,
  	name varchar(150) not null,
  	email varchar(150) unique not null, 
  	cpf varchar(50) unique not null,
  	contact varchar(20) not null
  )
  ```
    
- Método POST products:

    **URL** para local request: http://localhost:3000/clients/

  **Request:**
  ```
  {
    "name": "nome_cliente",
    "amount": quantidade,
    "color": "cor_do_produto",
    "voltage": "voltage_produto 110, 220, ou n/a",
    "description": "descriçao_produto",
    "price": preço,
    "category_id": "categoria_produto"
  }
  ```

  **Base de dados:**
  ```
  create type voltage_enum as enum('110', '220', 'n/a');

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
  ```

- Método POST orders:

  **URL** para local request: http://localhost:3000/orderss/

  **Request:**
  ```
  {
   "client_id": id_cliente,
   "address": "Endereço...",
   "observations": "Observação...",
   "products": [
     {
        "product_id": id_produto1,
        "amount": quantidade
     },
	   {
        "product_id": id_produto2,
        "amount": quantidade
     }
   ]
  }
  ```

  **Base de dados:**
  ```
  create table orders (
	  id serial primary key,
	  client_id int not null,
	  total decimal(10,2) not null,
	  address TEXT not null,
	  observations TEXT,
    FOREIGN KEY (client_id) REFERENCES clients(id)
  )
  ```
    
## Melhorias
- Criar uma aplicação front end para fazer a conexão com o Back-end.
- Implementar uma melhor forma de validação de dados e segurança.
- Implementação da função de editar, deletar para os usuários.
- Implementação da função de editar, deletar para os produtos.
- Implementação da função de inserir, editar, deletar para as categorias dos produtos.
- Implementação da função de editar, deletar para os pedidos.

## Descriçao do projeto(VIDEO)

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/dNOfMvCD)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=15330879&assignment_repo_type=AssignmentRepo)
