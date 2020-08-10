"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/coffee';
}
else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;
const env = {
    PORT: process.env.PORT || 3000,
    URLDB: process.env.URLDB
};
exports.default = env;
