import jwt from 'jsonwebtoken';
import config from '../config/config';
import { NextFunction } from 'express';
import { Request, Response } from 'express';

export function generateAccessToken(payload: Object): string {
    let token = jwt.sign(
        { payload },
        config.TOKEN_SECRET,
        { expiresIn: config.CADUCIDAD_TOKEN });
    return token;
}

export function verifyAccessToken(req: any, res: Response, next: NextFunction) {
    let token = String(req.get('Authorization')).split(" ")[1];
    console.log(token);
    jwt.verify(token, config.TOKEN_SECRET, function (err: any, decoded: any) {
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

export function verifyRole(req: any, res: any, next: NextFunction) {
    let rol = req.usuario.rol;
    if(rol === "ADMIN_ROLE"){
        next();
    } else {
        return res.status(401).json({
            ok: false,
            errors : {
                message: 'Usted no es usuario administrador'
            }
        });
    }
}