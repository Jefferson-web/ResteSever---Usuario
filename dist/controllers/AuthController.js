"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Usuario_1 = __importDefault(require("../models/Usuario"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const utils_1 = require("../helpers/utils");
function sign(req, res) {
    const { email, password } = req.body;
    Usuario_1.default.findOne({ email }).exec((err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectas.'
                }
            });
        }
        if (!bcrypt_1.default.compareSync(password, usuario.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectas.'
                }
            });
        }
        let token = utils_1.generateAccessToken(usuario);
        res.status(200).json({
            ok: true,
            usuario,
            token
        });
    });
}
exports.sign = sign;
