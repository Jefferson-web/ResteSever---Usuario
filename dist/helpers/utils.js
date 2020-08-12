"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
function generateAccessToken(payload) {
    let token = jsonwebtoken_1.default.sign({ payload }, config_1.default.TOKEN_SECRET, { expiresIn: config_1.default.CADUCIDAD_TOKEN });
    return token;
}
exports.generateAccessToken = generateAccessToken;
function verifyAccessToken(req, res, next) {
    let token = String(req.get('Authorization')).split(" ")[1];
    console.log(token);
    jsonwebtoken_1.default.verify(token, config_1.default.TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(401).json({
                ok: false,
                errors: err,
                message: 'Token inválido o no proveido'
            });
        }
        req.usuario = decoded.payload;
        next();
    });
}
exports.verifyAccessToken = verifyAccessToken;
function verifyRole(req, res, next) {
    let rol = req.usuario.rol;
    if (rol === "ADMIN_ROLE") {
        next();
    }
    else {
        return res.status(401).json({
            ok: false,
            errors: {
                message: 'Usted no es usuario administrador'
            }
        });
    }
}
exports.verifyRole = verifyRole;
