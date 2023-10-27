import Users from "../models/userModel.ts";
import dotenv from 'dotenv';
import jwt from "jsonwebtoken"
import * as argon2 from "argon2";
import { Request,Response } from "express";
dotenv.config();

const UserController = {

    async loginUser(req: Request, res: Response): Promise<void> {
      const userData = req.body
        const user = await Users.findOne({email: userData.email})
        if (user) {
          const passwordVerified = await argon2.verify(user.password,userData.password)
          if (passwordVerified) {
            const jwtSecretKey: string = process.env.JWT_SECRET_KEY;
            const token = jwt.sign(userData, jwtSecretKey);
            res.send({
              status: 200,
              message: "Login Successfull",
              token: token
            });
          }
          else{
            res.send("Wrong Password")
          }
        }
        else {
          res.send("No User exists with this email.")
        }
    },
    async getUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await Users.find({});
            res.json(users); 
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
          }
        },
    async signUpUser(req: Request, res: Response): Promise<void> {
        try {
            const userData = req.body 
            const user = await Users.findOne({email: userData.email})
            if (user) {
              res.send("User Already exists with this email")
            }
            else {
              const hashedPassword = await argon2.hash(userData.password)
              const newUser = new Users({name: userData.name, email: userData.email, password: hashedPassword});
              await newUser.save();
              res.status(200).send("Successfull Signup !! Redirect to Login");
            }
        } catch (error) {
          console.log(error);
          res.status(500);
        }
      },
    async editUser(req: Request, res: Response): Promise<void> {
      try {
        await Users.findOneAndUpdate({email:req.body.email},{name:req.body.name});
        res.status(200).send("User updated"); 
      } catch (e) {
        console.error(e);
        res.status(500).send({ error: 'Internal Server Error'});
      }
    },
    async deleteUser(req: Request, res: Response): Promise<void> {
      try {
        await Users.findOneAndDelete({email:req.body.email});
        res.status(200);
        } catch (e) {
        console.log(e);
        res.status(500).send({ error: 'Internal Server Error !' });
      }
    }
}

export default UserController;