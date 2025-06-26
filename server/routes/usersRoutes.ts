import {Router} from 'express';

const Userrouter = Router();

Userrouter.post('/signin');
Userrouter.post('/signup');

export default Userrouter;