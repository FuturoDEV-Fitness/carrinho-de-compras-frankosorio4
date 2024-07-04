const { response } = require('express');
const { Pool } = require('pg');

const conexao = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'xxxxxx',
    database: 'Lab_Commerce'
})

class ProductsController {
    async criar(request, response) {
        const dados = request.body;
        if (!dados.name || !dados.amount || !dados.category_id || !dados.price) {
            return response.status(400).json({ mensagen: 'O nome, a quantidade, o preco, e a categoria são obrigatorios' })
        }

        //validating amount
        if (typeof dados.amount != 'number' || dados.amount < 0) {
            return response.status(400).json({ mensagen: 'A quantidade tem que ser um numero inteiro positivo' })
        }

        //validating voltage
        const array = [110, 220, '110', '220', 'n/a']
        if (!array.includes(dados.voltage)) {
            return response.status(400).json({ mensagen: 'Voltagem nao valido. O voltagem pode ter valores de 110, 220, ou n/a.' })
        }

        //validating price
        if (typeof dados.price != 'number' || dados.price < 0) {
            return response.status(400).json({ mensagen: 'O preço tem que ser um numero inteiro positivo' });
        };

        //validating category_id
        if (!Number.isInteger(dados.category_id) || dados.category_id < 0) {
            return response.status(400).json({ mensagen: 'O Id da categoria tem que ser um numero inteiro positivo' });
        };

        //validating category_id in DB
        const idcategoryExists = await conexao.query(`
            select exists (select 1 from categories where id = $1)`, [dados.category_id]);
        if (!idcategoryExists.rows[0].exists) {
            return response.status(400).json({ mensagen: 'O id da categoria não existe.' });
        };

        try {
            const product = await conexao.query(`
                insert into products
                (name, amount, color, voltage, description, price, category_id)
                values ($1, $2, $3, $4, $5, $6, $7)
                returning *
                `, [
                dados.name,
                dados.amount,
                dados.color || '',
                dados.voltage,
                dados.description || '',
                dados.price,
                dados.category_id
            ]);
            response.status(201).json(product.rows[0]);
        } catch (error) {
            //console.log(error);
            return response.status(500).json({ mensagen: 'Erro no servidor.' });
        }
    }

    async listarTodos(request, response) {
        try {
            //"filtro" comes in the request params
            const filtros = request.query
            if (filtros.filtro) {//finding with a filter
                const produtos = await conexao.query(`
                    select * from products
                    where name ilike $1
                    or description ilike $1
                    `, [`%${filtros.filtro}%`])
                response.status(200).json(produtos.rows);
            } else {//list all
                const produtos = await conexao.query(`
                    select * from products
                    `);
                response.status(200).json(produtos.rows);
            }
        } catch (error) {
            //console.log(error);
            return response.status(500).json({ mensagen: 'Erro no servidor.' });
        }
    }

    async listarUm(request, response) {
        try {
            const id = request.params.id
            const produto = await conexao.query(`
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
                where p.id = $1
                `,
                [id])
            if (produto.rows.length === 0) {
                return response.status(404).json({ mensagen: 'Produto não encontrado.' })
            }
            response.status(200).json(produto.rows[0])
        } catch (error) {
            console.log(error)
            return response.status(500).json({ mensagen: 'Erro no servidor.' })
        }
    }
}

module.exports = new ProductsController;

// create table products(
// 	id serial primary key,
// 	name varchar(150) not null,
// 	amount int default 0 not null,
// 	color varchar(50),
// 	voltage voltage_enum,
// 	description text,
//  price decimal(10,2) not null,
// 	category_id int not null,
// 	foreign key (category_id)
// 		references categories(id)
// )