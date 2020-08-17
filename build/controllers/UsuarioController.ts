import { Request, Response } from 'express';
import Usuario from '../models/Usuario';
import bcrypt from 'bcrypt';

export async function findAll(req: Request, res: Response) {
    let desde = Number(req.query.desde) || 1;
    await Usuario.find({}, 'nombre email rol estado').skip((desde - 1) * 5).limit(5).exec((err, usuariosDB) => {
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
        Usuario.count({}).exec((err, conteo) => {
            res.status(200).json({
                ok: true,
                usuarios: usuariosDB,
                conteo
            });
        });
    });
}

export async function save(req: any, res: Response) {
    let payload = req.body;
    const usuario = new Usuario({
        nombre: payload.nombre,
        email: payload.email,
        password: bcrypt.hashSync(payload.password, 10),
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

export async function update(req: Request, res: Response) {
    let _id = req.params.id;
    let payload = req.body;
    await Usuario.findByIdAndUpdate(_id, payload, { new: true }, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'No se pudo actualizar al usuario',
                error: err
            });
        }
        res.status(200).json({
            ok: true,
            message: "Usuario actualizado satisfactoriamente.",
            usuario: usuario
        });
    });
}

export async function deleteUser(req: Request, res: Response) {
    let _id = req.params.id;
    await Usuario.findByIdAndDelete({ _id }, (err, usuarioEliminado) => {
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