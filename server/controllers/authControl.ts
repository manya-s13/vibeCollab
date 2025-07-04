import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
    user?: {
        id: string,
        email: string,
        name: string, 
        createdAt: Date,
    };
}

interface signupReq {
    email: string;
    password: string;
    name: string;
}

interface signinReq {
    email: string;
    password: string;
}

interface jwtPayLoad {
    userId: string;
}

function setTokenCookie(res: Response, token: string): void {
    const isProduction = process.env.NODE_ENV === 'production';
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    
    // Calculate expiration date
    const expirationTime = expiresIn.includes('d') 
      ? parseInt(expiresIn) * 24 * 60 * 60 * 1000 // days to milliseconds
      : parseInt(expiresIn) * 60 * 60 * 1000; // hours to milliseconds
    
    const expirationDate = new Date(Date.now() + expirationTime);

    res.cookie('authToken', token, {
      httpOnly: true,        // Prevents client-side JavaScript access
      secure: isProduction,  // Only send over HTTPS in production
      sameSite: 'strict',    // CSRF protection
      maxAge: expirationTime,
      expires: expirationDate,
      path: '/'
    });
  }

  function clearTokenCookie(res: Response): void {
    res.cookie('authToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0),
      path: '/'
    });
  }


export const signup = async (
    req:  Request,
    res: Response,
  ): Promise<void> => {
        try{
            const {email, password, name} :signupReq = req.body;

            if(!email || !password || !name) {
                res.status(400).json({ message: 'All fields are required' });
                return;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
              res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
              });
              return;
            }
      
            if (password.length < 6) {
            res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
              });
              return;
            }
            const existingUser = await prisma.user.findUnique({where: {email}});

            if(existingUser){
                res.status(400).json({message : "user already exists"});
                return;
            }

            const salt = 12;
            const hashedpass = await bcrypt.hash(password, salt);


            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedpass,
                    name,
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    createdAt: true
                }
            });

            const token = jwt.sign(
                {userId: user.id} as jwtPayLoad,
                process.env.JWT_SECRET!,
                {expiresIn: '1d'}
            );

            setTokenCookie(res, token);

            res.status(201).json({message : "User craeted Successfully", data: {user}});
            return;
        }
        catch(error) {
            console.log('signup error:', error);
            res.status(500).json({message: 'Internal server error'});
            return;
        }
    }

export  const  signin = async(req: Request, res: Response): Promise<void> => {
        try {
            const {email, password}:signinReq = req.body;
            if(!email || !password) {
                res.status(400).json({message : "Please provide email and password"});
                return;
            }

            const user = await prisma.user.findUnique({
                where:{email}
            })
            if(!user){
                res.status(404).json({message : "User not found"});
                return;
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if(!isPasswordValid){
                res.status(401).json({message : "Invalid credentials"});
                return;
            }

            const token = jwt.sign(
                {userId: user.id} as jwtPayLoad,
                process.env.JWT_SECRET!,
                {expiresIn: '1d'}
            );

            setTokenCookie(res, token);

            const { password: _, ...userWithoutPassword } = user;

            res.status(200).json({message : "Signin Successful", data : {user: userWithoutPassword}});
            return;
        }
        catch(error){
            console.log("Signin Failed" , error);
            res.status(500).json({message : "Internal Server error"});
            return;
        }
    }

export  const VerifyToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const token = req.cookies.authToken;

            if(!token){
                res.status(401).json({message: "Unauthorized, No token provided"});
                return;
            }

            const decoded = jwt.verify(token,  process.env.JWT_SECRET!) as jwtPayLoad;

            const user = await prisma.user.findUnique({
                where: {id: decoded.userId},
                select : {
                    id: true,
                    email: true,
                    name: true,
                    createdAt: true
                }
            });

            if(!user){
                clearTokenCookie(res);
                res.status(404).json({message: "User not found"});
                return;
            }

            req.user = user;
//             console.log("Cookies received:", req.cookies);
//             console.log("Auth token:", req.cookies.authToken);

            next();


        } catch (error) {
            console.error('Token verification error:', error);
            clearTokenCookie(res);
            res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
            return;
        }
    }

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            res.status(200).json({
                success: true,
                data: {
                    user: req.user
                }
            });
            return;
        } catch (error) {
            console.log("Get Profile error", error);
            res.status(500).json({
                success: false,
                message:" Internal server error"
            })
            return;
        }
    }


export  const signOut = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            clearTokenCookie(res);
            res.status(200).json({
                success: true,
                message: "signed out successfully",
            })
            return;
        } catch (error) {
            console.log('Sign out error:', error);
            res.status(500).json({ message: "Internal server error"});
            return;
        }
    }

export  const checkAuth = async(req: AuthRequest, res: Response) : Promise<void> => {
        try {
            res.status(200).json({
                success: true,
                message: 'User is authenticated',
                data: {
                  user: req.user
                }
              });
              return;
        } catch (error) {
            console.log('Check Auth error:', error);
            res.status(500).json({ message: "Internal server error" });
            return;
        }
    }