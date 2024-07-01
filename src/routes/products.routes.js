const {Router} = require('express');
const ProductsController = require('../controllers/ProductsController');

const productsRoutes = new Router();

productsRoutes.post('/',ProductsController.criar);

module.exports = productsRoutes;