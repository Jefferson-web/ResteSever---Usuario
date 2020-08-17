import express, { Application } from 'express'
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import usuarioRoutes from './routes/UsuarioRoutes';
import authRoutes from './routes/AuthRoutes';
import env from './config/config';

class Server {

    __app: Application;

    constructor() {
        this.__app = express();
        this.__app.set('port', process.env.PORT || 3000);
        this.config();
        this.routes();
    }

    config(): void {

        // Middleware's

        this.__app.use(express.json());
        this.__app.use(express.urlencoded({ extended: false }));
        this.__app.use(morgan('dev'));
        this.__app.use(helmet());
        this.__app.use(compression());
        this.__app.use(cors({
            origin: true,
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true
        }));

        // MongoDB database connection
        
        mongoose.connect(env.URLDB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
            .then(obj => console.log('Connected database'))
            .catch(err => console.log(err))

    }

    routes(): void {
        this.__app.use('/usuarios', usuarioRoutes);
        this.__app.use('/auth', authRoutes);
    }

    __init(): void {
        this.__app.listen(env.PORT, () => {
            console.log('Listen on port ' + this.__app.get('port'));
        });
    }

}

const server = new Server();
server.__init();