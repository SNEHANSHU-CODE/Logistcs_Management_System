const express = require("express");
const app = express();
const port =8080;
const connector = require("./connector");


const cors = require('cors');
//Cross-Origin Resource Sharing for client and server communication
app.use(cors());

// Parse JSON bodies
app.use(express.json());


// Import and use each route file
app.use('/item', require('./Router/itemsRouter'));
app.use('/customer', require('./Router/customersRouter'));
app.use('/delivery', require('./Router/delhiveryVehiclesRouter'));
app.use('/order', require('./Router/ordersRouter'));


app.listen(port, () => console.log(`App listening on port ${port}!`));