import { FastifyInstance } from "fastify";
import UserController from "../controllers/UserController";
import PlayerController from "../controllers/PlayerController";
import ProductController from "../controllers/ProductController";
import SalesOrderController from "../controllers/SalesOrderController";
import ClientController from "../controllers/ClientController";

const clientController = new ClientController();
const userController = new UserController();
const playerController = new PlayerController();
const productController = new ProductController();
const salesOrderController = new SalesOrderController();

export async function Routes(app: FastifyInstance) {
    app.get('/users', userController.list);
    app.get('/users/:id', userController.listById)
    app.delete('/users/delete/:id', userController.deleteById)
    app.post('/users/create', userController.createUser)
    app.put('/users/modify/:id', userController.modify)

    app.get('/clients', clientController.list);
    app.get('/clients/:id', clientController.listById)
    app.delete('/clients/delete/:id', clientController.deleteById)
    app.post('/clients/create', clientController.create)
    app.put('/clients/modify/:id', clientController.modify)

    app.get('/players', playerController.list);
    app.get('/players/:id', playerController.listById)
    app.post('/players/create/:id', playerController.createPlayer)

    app.get('/products', productController.list);
    app.get('/products/:id', productController.listById)
    app.delete('/products/delete/:id', productController.deleteById)
    app.post('/products/create', productController.createProduct)
    app.put('/products/modify/:id', productController.modify)

    app.get('/sales', salesOrderController.list);
    app.get('/sales/:id', salesOrderController.listById)
    app.get('/sales/filter/:price', salesOrderController.listFiltered)
    app.delete('/sales/delete/:id', salesOrderController.deleteById)
    app.post('/sales/create', salesOrderController.create)
    app.put('/sales/modify/:id', salesOrderController.modifyOrder)
}