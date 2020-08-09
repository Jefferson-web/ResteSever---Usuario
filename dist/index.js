"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const UsuarioRoutes_1 = __importDefault(require("./routes/UsuarioRoutes"));
const config_1 = __importDefault(require("./config/config"));
class Server {
    constructor() {
        this.__app = express_1.default();
        this.__app.set('port', process.env.PORT || 3000);
        this.config();
        this.routes();
    }
    config() {
        // Middleware's
        this.__app.use(express_1.default.json());
        this.__app.use(express_1.default.urlencoded({ extended: false }));
        this.__app.use(morgan_1.default('dev'));
        this.__app.use(helmet_1.default());
        this.__app.use(compression_1.default());
        this.__app.use(cors_1.default({
            origin: 'http://localhost:3000',
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true
        }));
        // MongoDB database connection
        mongoose_1.default.connect(config_1.default.URLDB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
            .then(obj => console.log('Connected database'))
            .catch(err => console.log(err));
    }
    routes() {
        this.__app.use('/usuarios', UsuarioRoutes_1.default);
    }
    __init() {
        this.__app.listen(config_1.default.PORT, () => {
            console.log('Listen on port ' + this.__app.get('port'));
        });
    }
}
const server = new Server();
server.__init();
