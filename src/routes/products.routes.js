const {Router} = require('express');
const ProductsController = require('../controllers/ProductsController');

const productsRoutes = new Router();

productsRoutes.post('/', ProductsController.criar);
productsRoutes.get('/', ProductsController.listarTodos);
productsRoutes.get('/:id', ProductsController.listarUm)

module.exports = productsRoutes;