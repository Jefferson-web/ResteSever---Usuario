import { Router } from "express";
import { findAll, save, update, deleteUser } from '../controllers/UsuarioController';
import { verifyAccessToken, verifyRole } from '../helpers/utils';

class UsuarioRoutes {

    router: Router;

    constructor() {
        this.router = Router();
        this.config();
    }

    config(): void {
        this.router.get('/', findAll);
        this.router.post('/', [verifyAccessToken, verifyRole], save);
        this.router.put('/:id', [verifyAccessToken, verifyRole], update);
        this.router.delete('/:id', [verifyAccessToken, verifyRole], deleteUser);
    }

}

const usuarioRoutes = new UsuarioRoutes();
export default usuarioRoutes.router;