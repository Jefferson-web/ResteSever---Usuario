"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
let rolesPermitidos = [
    'USER_ROLE',
    'ADMIN_ROLE',
    'SALES_ROLE'
];
const usuarioSchema = new mongoose_1.default.Schema({
    nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
    email: { type: String, required: [true, 'El email es obligatorio'], unique: true },
    password: { type: String, required: [true, 'La contraseña es obligatoria'] },
    rol: { type: String, default: 'USER_ROLE', required: false, enum: rolesPermitidos },
    img: { type: String, required: false },
    estado: { type: Boolean, default: true },
    google: { type: Boolean, default: false }
}, { collection: 'usuario' });
usuarioSchema.plugin(mongoose_unique_validator_1.default, { message: 'El campo {PATH} debe ser único.' });
exports.default = mongoose_1.default.model('Usuario', usuarioSchema);
