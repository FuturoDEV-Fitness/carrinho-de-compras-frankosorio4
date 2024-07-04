const { response } = require('express');
const { Pool } = require('pg');

const conexao = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'xxxxxxx',
    database: 'Lab_Commerce'
});

class OrdersController {
    async criar(request, response) {
        try {
            const dados = request.body;

            if (!dados.client_id || !dados.address || !dados.observations || !dados.products) {
                return response.status(400).json({ mensagen: 'Os campos client_id, address, observation, e products são obrigatorios' })
            }

            //validating client_id in DB
            const idClientExist = await conexao.query(`
                select exists (select 1 from clients where id = $1)`, [dados.client_id]);
            if (!idClientExist.rows[0].exists) {
                return response.status(400).json({ mensagen: 'O id do cliente não existe.' })
            };

            //validating client_id
            if (!Number.isInteger(dados.client_id) || dados.client_id < 0) {
                return response.status(400).json({ mensagen: 'O cliente_id tem que ser um numero inteiro positivo' })
            };

            //validating product_id
            for (const produto of dados.products) {
                let idproduto = produto.product_id;
                if (!Number.isInteger(idproduto) || idproduto < 0) {
                    return response.status(400).json({ mensagen: 'O product_id tem que ser um numero inteiro positivo' });
                };
            }

            //validating amount_id
            for (const produto of dados.products) {
                let idproduto = produto.amount;
                if (!Number.isInteger(idproduto) || idproduto < 0) {
                    return response.status(400).json({ mensagen: 'O amount tem que ser um numero inteiro positivo' })
                }
            }

            let total = 0;
            //console.log('dados.products',dados.products);

            //loop to get the order total price
            for (const produto of dados.products) {

                //validating product_id in DB
                const idProductExist = await conexao.query(`
                select exists (select 1 from products where id = $1)`, [produto.product_id]);
                if (!idProductExist.rows[0].exists) {
                    return response.status(400).json({ mensagen: 'Un dos id dos produtos não existe.' })
                };

                //query to obtain the product price
                const preco = await conexao.query(`
                    select price from products where id = $1
                `, [produto.product_id]);

                if (preco.rows.length > 0) {
                    const tempPrice = preco.rows[0].price * produto.amount;
                    total += tempPrice;
                }
            }

            //saving the order in ORDERS table
            const order_saved = await conexao.query(`
                insert into orders (client_id, total, address, observations)
                values ($1, $2, $3, $4)
                returning *
                `, [
                dados.client_id,
                total,
                dados.address,
                dados.observations
            ])

            //loop to save the products in ORDERS_ITEMS table
            for (const produto of dados.products) {

                //query to obtain the price product
                const preco = await conexao.query(`
                    select price from products where id = $1
                `, [produto.product_id]);
                
                await conexao.query(`
                    insert into orders_items (order_id, product_id, amount, price)
                    values ($1, $2, $3, $4)
                    returning *
                    `,[
                        order_saved.rows[0].id,
                        produto.product_id,
                        produto.amount,
                        preco.rows[0].price
                ])
            }

            //console.log('total', total);
            response.status(200).json({total});
        } catch (error) {
            console.log(error);
            return response.status(500).json({ mensagen: 'Erro no servidor.' });
        }
    }

};

module.exports = new OrdersController;