const express = require("express")

const clientsRoutes = require('./routes/clients.routes');
const productsRoutes = require('./routes/products.routes');

const app = express();
app.use(express.json());

app.use('/clients', clientsRoutes);
app.use('/products', productsRoutes)

app.listen(3000, () => {
    console.log("Servidor Online")
})