const {Router} = require ('express');
const OrdersController = require('../controllers/OrdersController');

const ordersRoutes = new Router();

ordersRoutes.post('/', OrdersController.criar);

module.exports = ordersRoutes;