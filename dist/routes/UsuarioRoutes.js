"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UsuarioController_1 = require("../controllers/UsuarioController");
class UsuarioRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', UsuarioController_1.findAll);
        this.router.post('/', UsuarioController_1.save);
        this.router.put('/:id', UsuarioController_1.update);
        this.router.delete('/:id', UsuarioController_1.deleteUser);
    }
}
const usuarioRoutes = new UsuarioRoutes();
exports.default = usuarioRoutes.router;
