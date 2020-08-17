import { Request, Response } from 'express';
import Usuario from '../models/Usuario';
import bcrypt from 'bcrypt';
import { generateAccessToken } from '../helpers/utils';
import config from '../config/config';
import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client(config.CLIENT_ID);

export function sign(req: Request, res: Response) {
    const { email, password } = req.body;
    Usuario.findOne({ email }).exec((err, usuario) => {
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
        if (!bcrypt.compareSync(password, usuario.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectas.'
                }
            });
        }
        let token = generateAccessToken(usuario);
        res.status(200).json({
            ok: true,
            usuario,
            token
        });
    });
}

// CONFIGURACIONES DE GOOGLE

async function verify(token: any) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: config.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload?.name,
        email: payload?.email,
        img: payload?.picture,
        google: true
    }
}

export async function GoogleSignIn(req: Request, res: Response) {
    const token = req.body.idtoken;
    let googleUser: any = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        });
    Usuario.findOne({ email: googleUser.email }, (err, usuario: any) => {
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
            } else {
                let token = generateAccessToken(usuario);
                return res.status(200).json({
                    ok: true,
                    usuario,
                    token
                });
            }
        } else {
            // Si el usuario no existe en la base de datos
            let usuario = new Usuario();
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
                let token = generateAccessToken(usuario);
                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            });
        }
    });
}