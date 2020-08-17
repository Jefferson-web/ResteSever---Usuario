import { Router } from 'express';
import { sign, GoogleSignIn } from '../controllers/AuthController';

class AuthRoutes {

    router: Router;

    constructor() {
        this.router = Router();
        this.config();
    }

    config(): void {
        this.router.post('/sign', sign);
        this.router.post('/google', GoogleSignIn);
    }

}

const authRoutes = new AuthRoutes();
export default authRoutes.router;