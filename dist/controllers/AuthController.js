"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Usuario_1 = __importDefault(require("../models/Usuario"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const utils_1 = require("../helpers/utils");
const config_1 = __importDefault(require("../config/config"));
const google_auth_library_1 = require("google-auth-library");
const client = new google_auth_library_1.OAuth2Client(config_1.default.CLIENT_ID);
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
// CONFIGURACIONES DE GOOGLE
async function verify(token) {
    var _a, _b, _c;
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: config_1.default.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return {
        nombre: (_a = payload) === null || _a === void 0 ? void 0 : _a.name,
        email: (_b = payload) === null || _b === void 0 ? void 0 : _b.email,
        img: (_c = payload) === null || _c === void 0 ? void 0 : _c.picture,
        google: true
    };
}
async function GoogleSignIn(req, res) {
    const token = req.body.idtoken;
    let googleUser = await verify(token)
        .catch(e => {
        return res.status(403).json({
            ok: false,
            err: e
        });
    });
    Usuario_1.default.findOne({ email: googleUser.email }, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (usuario) {
            if (usuario.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe realizar la autenticación normal'
                    }
                });
            }
            else {
                let token = utils_1.generateAccessToken(usuario);
                return res.status(200).json({
                    ok: true,
                    usuario,
                    token
                });
            }
        }
        else {
            // Si el usuario no existe en la base de datos
            let usuario = new Usuario_1.default();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = googleUser.google;
            usuario.password = ':)';
            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                let token = utils_1.generateAccessToken(usuario);
                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            });
        }
    });
}
exports.GoogleSignIn = GoogleSignIn;
