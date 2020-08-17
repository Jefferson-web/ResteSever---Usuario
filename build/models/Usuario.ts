import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

let rolesPermitidos = [
    'USER_ROLE',
    'ADMIN_ROLE',
    'SALES_ROLE'
];

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
    email: { type: String, required: [true, 'El email es obligatorio'], unique: true },
    password: { type: String, required: [true, 'La contraseña es obligatoria'] },
    rol: { type: String, default: 'USER_ROLE', required: false, enum: rolesPermitidos },
    img: { type: String, required: false },
    estado: { type: Boolean, default: true },
    google: { type: Boolean, default: false }
}, { collection: 'usuario' });

usuarioSchema.plugin(uniqueValidator, { message: 'El campo {PATH} debe ser único.' });

interface IUsuario extends mongoose.Document {
    nombre: String;
    email: String;
    password: string;
    rol: String;
    img: String;
    estado: Boolean;
    google: Boolean;
}

export default mongoose.model<IUsuario>('Usuario', usuarioSchema);