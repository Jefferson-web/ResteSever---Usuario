"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Usuario_1 = __importDefault(require("../models/Usuario"));
const bcrypt_1 = __importDefault(require("bcrypt"));
async function findAll(req, res) {
    let desde = Number(req.query.desde) || 1;
    await Usuario_1.default.find({}, 'nombre email rol estado').skip((desde - 1) * 5).limit(5).exec((err, usuariosDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar a los usuarios',
                error: err
            });
        }
        if (!usuariosDB) {
            return res.status(400).json({
                ok: false,
                error: 'No se pudo obtener a los usuarios.'
            });
        }
        Usuario_1.default.count({}).exec((err, conteo) => {
            res.status(200).json({
                ok: true,
                usuarios: usuariosDB,
                conteo
            });
        });
    });
}
exports.findAll = findAll;
async function save(req, res) {
    let payload = req.body;
    const usuario = new Usuario_1.default({
        nombre: payload.nombre,
        email: payload.email,
        password: bcrypt_1.default.hashSync(payload.password, 10),
        rol: payload.rol
    });
    await usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al crear un nuevo usuario',
                error: err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                error: 'Ocurrio un error en la creación del usuario.'
            });
        }
        res.status(200).json({
            ok: true,
            message: "Usuario creado satisfactoriamente.",
            usuario: usuarioDB
        });
    });
}
exports.save = save;
async function update(req, res) {
    let _id = req.params.id;
    let payload = req.body;
    await Usuario_1.default.findById(_id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'No se pudo actualizar al usuario',
                error: err
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'El usuario con el id ' + _id + " no existe en la base de datos.",
                    err
                }
            });
        }
        usuario.nombre = payload.nombre;
        usuario.email = payload.email;
        usuario.password = payload.password;
        usuario.img = payload.img;
        usuario.estado = payload.estado;
        usuario.save((err, usuarioActualizado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'El usuario no puedo ser actualizado',
                    error: err
                });
            }
            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    error: 'El usuario no puedo ser actualizado'
                });
            }
            res.status(200).json({
                ok: true,
                message: "Usuario actualizado satisfactoriamente.",
                usuario: usuarioActualizado
            });
        });
    });
}
exports.update = update;
async function deleteUser(req, res) {
    let _id = req.params.id;
    await Usuario_1.default.findByIdAndDelete({ _id }, (err, usuarioEliminado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al eliminar usuario.',
                errors: err
            });
        }
        if (!usuarioEliminado) {
            return res.status(400).json({
                ok: false,
                message: 'El usuario no existe en la base de datos.',
                errors: { message: 'No se pudo encontrar al usuario con ese id.' }
            });
        }
        res.status(200).json({
            ok: true,
            message: 'Usuario eliminado correctamente',
            usuario: usuarioEliminado
        });
    });
}
exports.deleteUser = deleteUser;
