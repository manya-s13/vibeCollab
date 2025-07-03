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

  // Helper method to clear cookie
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
    req: Request<{}, {}, signupReq>,
    res: Response,
  ): Promise<Response> => {
        try{
            const {email, password, name} = req.body;

            if(!email || !password || !name) {
                return res.status(400).json({ message: 'All fields are required' });
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
              return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
              });
            }
      
            // Validate password strength
            if (password.length < 6) {
              return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
              });
            }
            const existingUser = await prisma.user.findUnique({where: {email}});

            if(existingUser){
                return res.status(400).json({message : "user already exists"});
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

            return res.status(201).json({message : "User craeted Successfully", data: {user}});
        }
        catch(error) {
            console.log('signup error:', error);
            return res.status(500).json({message: 'Internal server error'});
        }
    }

    export  const  signin = async(req: Request<{}, {}, signinReq>, res: Response): Promise<Response> => {
        try {
            const {email, password} = req.body;
            if(!email || !password) {
                return res.status(400).json({message : "Please provide email and password"});
            }

            const user = await prisma.user.findUnique({
                where:{email}
            })
            if(!user){
                return res.status(404).json({message : "User not found"});
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if(!isPasswordValid){
                return res.status(401).json({message : "Invalid credentials"});
            }

            const token = jwt.sign(
                {userId: user.id} as jwtPayLoad,
                process.env.JWT_SECRET!,
                {expiresIn: '1d'}
            );

            setTokenCookie(res, token);

            const { password: _, ...userWithoutPassword } = user;

            return res.status(200).json({message : "Signin Successful", data : {user: userWithoutPassword}});
        }
        catch(error){
            console.log("Signin Failed" , error);
            return res.status(500).json({message : "Internal Server error"});
        }
    }

    export  const VerifyToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const token = req.cookies.authToken;

            if(!token){
                return res.status(401).json({message: "Unauthorized, No token provided"});
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
                return res.status(404).json({message: "User not found"});
            }

            req.user = user;
            next();

        } catch (error) {
            console.error('Token verification error:', error);
            clearTokenCookie(res);
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
    }

    export const getProfile = async (req: AuthRequest, res: Response): Promise<Response> => {
        try {
            return res.status(200).json({
                success: true,
                data: {
                    user: req.user
                }
            });
        } catch (error) {
            console.log("Get Profile error", error);
            return res.status(500).json({
                success: false,
                message:" Internal server error"
            })
        }
    }


    export  const signOut = async (req: AuthRequest, res: Response): Promise<Response> => {
        try {
            clearTokenCookie(res);
            return res.status(200).json({
                success: true,
                message: "signed out successfully"
            })
        } catch (error) {
            console.log('Sign out error:', error);
            return res.status(500).json({ message: "Internal server error"});
        }
    }

  export  const checkAuth = async(req: AuthRequest, res: Response) : Promise<Response> => {
        try {
            return res.status(200).json({
                success: true,
                message: 'User is authenticated',
                data: {
                  user: req.user
                }
              });
        } catch (error) {
            console.log('Check Auth error:', error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }