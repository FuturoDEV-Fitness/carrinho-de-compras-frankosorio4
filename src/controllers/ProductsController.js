const { response } = require('express');
const { Pool } = require('pg');
const ProductsRoutes = require('../routes/products.routes');

const conexao = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'xxxxxxx',
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
            return response.status(400).json({ mensagen: 'O preço tem que ser um numero inteiro positivo' })
        }

        //validating id
        if (!Number.isInteger(dados.category_id) || dados.category_id < 0) {
            return response.status(400).json({ mensagen: 'O Id da categoria tem que ser um numero inteiro positivo' })
        }

        try {
            const product = await conexao.query(`
                insert into products
                (name, amount, color, voltage, description, price, category_id)
                values
                ($1, $2, $3, $4, $5, $6, $7)
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
            console.log(error);
            return response.status(500).json({ mensagen: 'Erro no servidor.' });
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