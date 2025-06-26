import {Request, Response} from 'express';
import { PrismaClient } from '../generated/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const signup = async(req: Request, res: Response) => {
    const {email, name, password} = req.body;
    if(!email || !name || !password){
        return res.status(400).json("Please fill in all details");
    }
    
    const existingUser = await prisma.user.findFirst({where : {email}});
    if(existingUser){
        return res.status(400).json({
            status: "failed",
            data: [],
            message : "It seems you already have an account! Please log in"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
       data: {email, name, password: hashedPassword}
    });
    try{
        res.status(201).json({
            message: "SignUp Successfull",
            user: {
                id: newUser.id,
                email: newUser.email
            }
        })
    }
    catch(error){
        res.status(500).json("Registration Failed");
    }
}

export const signin = async(req: Request, res: Response) => {
    const {email, password} = req.body;
    if(!email || !password) {
        return res.status(400).json({message: "Please provide both email and password"});
    }

    try{

        const user = await prisma.user.findUnique({where: {email}});
        if(!user){
            return res.status(400).json("User not found");
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({message: "Invalid Credentials"});
        }

        const token = jwt.sign(
            {id: user.id, email: user.email},
            process.env.JWT_SECRET as string,
            {expiresIn: '1h'}
        );

        res
        .cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/'
        })
        .status(200)
        .json({
            message : "Login Successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        })

    } catch(error){
        res.status(500).json("Internal Server error");
    }
}


export const logout = async(req: Request, res: Response) =>{
    try{
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            path:'/'
        })
    
       res.status(200).json({
            message: "Logout successful",
            isAuthenticated : false
        })
    }
    catch(error){
        res.status(500).json({
            message: "Something went wrong",
        })
    }
}