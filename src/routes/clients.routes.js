const {Router} = require('express')
const ClientsControler = require('../controllers/ClientsControler')

const clientsRoutes = new Router();

clientsRoutes.post('/', ClientsControler.criar);

module.exports = clientsRoutes