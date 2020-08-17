"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
class AuthRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/sign', AuthController_1.sign);
        this.router.post('/google', AuthController_1.GoogleSignIn);
    }
}
const authRoutes = new AuthRoutes();
exports.default = authRoutes.router;
