"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/coffee';
}
else {
    urlDB = String(process.env.MONGO_URI);
}
// ===================================
// Vencimiento del token
// ===================================
process.env.CADUCIDAD_TOKEN = '24h';
// ===================================
// SEED de autenticación
// ===================================
process.env.TOKEN_SECRET = process.env.TOKEN_SECRET || 'este-es-el-seed-desarrollo';
// ===================================
// URL de la base de datos
// ===================================
process.env.URLDB = urlDB;
// ===================================
// Google CLIENT ID
// ===================================
process.env.CLIENT_ID = process.env.CLIENT_ID || '916874061262-95rns1tlduuuthnh8fgvlm8672r1ru4e.apps.googleusercontent.com';
const env = {
    PORT: process.env.PORT || 3000,
    URLDB: process.env.URLDB,
    TOKEN_SECRET: process.env.TOKEN_SECRET,
    CADUCIDAD_TOKEN: process.env.CADUCIDAD_TOKEN,
    CLIENT_ID: process.env.CLIENT_ID
};
exports.default = env;
