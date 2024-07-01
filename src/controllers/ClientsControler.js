const { response } = require('express');
const { Pool } = require('pg');

const conexao = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'xxxxxxx',
    database: 'Lab_Commerce'
})

class ClientsControler {
    async criar(request, response) {
        const dados = request.body;
        if (!dados.name || !dados.email || !dados.cpf || !dados.contact) {
            return response.status(400).json({ mensagen: 'O nome, email, cpf, e o contato são obrigatorios' })
        }

        //validating email-cpf format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const cpfRegex = /^\d{11}$/;
        if (!emailRegex.test(dados.email)) {
            return response.status(400).json({ mensagem: 'Email inválido.' });
        }
        if (!cpfRegex.test(dados.cpf)) {
            return response.status(400).json({ mensagem: 'CPF inválido. Forneça só os numeros do seu CPF.' });
        }

        //validating if the cpf there exist
        const isCpfDb = await conexao.query("select * from clients where cpf = $1", [dados.cpf])

        if (isCpfDb.rows.length != 0) {
            return response.status(400).json({ mensagem: 'O CPF fornecido ja esta cadastrado' })
        }

        //validating if the email there exist
        const isemailDb = await conexao.query("select * from clients where email = $1", [dados.email])

        if (isemailDb.rows.length != 0) {
            return response.status(400).json({ mensagem: 'O EMAIL fornecido ja esta cadastrado' })
        }

        try {
            const client = await conexao.query(`
                insert into clients
                (name, email, cpf, contact)
                values
                ($1, $2, $3, $4)
                returning *
                `, [dados.name, dados.email, dados.cpf, dados.contact])
            response.status(201).json(client.rows[0])
        } catch (error) {
            console.log(error)
            return response.status(500).json({ mensagen: 'Erro no servidor.' })
        }
    }
}

module.exports = new ClientsControler()
