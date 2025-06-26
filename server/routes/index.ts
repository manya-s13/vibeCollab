import {Router, Request, Response} from 'express';
import Userrouter from './usersRoutes';

const router = Router();

router.use('/auth', Userrouter);

router.get('/health', (re: Request, res: Response)=>{
    res.json({status: "ok", timestamp: new Date().toISOString()})
})


export default router;