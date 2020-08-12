"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UsuarioController_1 = require("../controllers/UsuarioController");
const utils_1 = require("../helpers/utils");
class UsuarioRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', UsuarioController_1.findAll);
        this.router.post('/', [utils_1.verifyAccessToken, utils_1.verifyRole], UsuarioController_1.save);
        this.router.put('/:id', [utils_1.verifyAccessToken, utils_1.verifyRole], UsuarioController_1.update);
        this.router.delete('/:id', [utils_1.verifyAccessToken, utils_1.verifyRole], UsuarioController_1.deleteUser);
    }
}
const usuarioRoutes = new UsuarioRoutes();
exports.default = usuarioRoutes.router;
