import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';


export const create = async (req: Request, res: Response) => {
    const sessionid = uuidv4();
    res.send({sessionid});
}