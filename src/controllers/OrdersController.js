const { response } = require('express');
const { Pool } = require('pg');

const conexao = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'XXXXXXXX',
    database: 'Lab_Commerce'
});

class OrdersController {
    async criar(request, response) {
        try {
            const dados = request.body;

            if (!dados.client_id || !dados.address || !dados.observations || !dados.products) {
                return response.status(400).json({ mensagen: 'Os campos client_id, address, observation, e products são obrigatorios' })
            }

            //TO DO, VALIDATE ID IN DB
            //select exists (select 1 from products	where id = $1)

            //validating client_id
            if (!Number.isInteger(dados.client_id) || dados.client_id < 0) {
                return response.status(400).json({ mensagen: 'O cliente_id tem que ser um numero inteiro positivo' })
            }

            //validating product_id
            for (const produto of dados.products) {
                let idproduto = produto.product_id;
                if (!Number.isInteger(idproduto) || idproduto < 0) {
                    return response.status(400).json({ mensagen: 'O product_id tem que ser um numero inteiro positivo' })
                }
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

            for (const produto of dados.products) {
                const resultado = await conexao.query(`
                    select price from products where id = $1
                `, [produto.product_id]);

                if (resultado.rows.length > 0) {
                    const tempPrice = resultado.rows[0].price * produto.amount;
                    total += tempPrice;
                }
            }

            const pedido = conexao.query(`
                insert into orders (client_id, total, address, observations)
                values ($1, $2, $3, $4)
                returning *
                `, [
                dados.client_id,
                total,
                dados.address,
                dados.observations
            ])
            //console.log('total', total);
            response.status(200).json({ total });
        } catch (error) {
            console.log(error);
            return response.status(500).json({ mensagen: 'Erro no servidor.' });
        }
    }

};

module.exports = new OrdersController;