import express from "express";
import { createUser, getUserByEmail } from "../db/users";
import { authentication, random } from "../helpers";
import jwt from 'jsonwebtoken';

const generateToken = (id: string) => {
  return jwt.sign({ id }, 'AUTH JWT', {
      expiresIn: '30d',
  });
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const {email,password} = req.body;

    if(!email || !password) {
      return res.sendStatus(400);
    }

    const user = await getUserByEmail(email);

    if(!user) {
      return res.sendStatus(400);
    }

    if(!await user.matchPassword(password)){
      return res.sendStatus(403);
    }

    return res.status(200).json({user, token: generateToken(user._id.toString())}).end();

  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.sendStatus(400);
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await createUser({
      email,
      username,
      password,
    });

    return res.status(200).json({user, token: generateToken(user._id.toString())}).end();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server error' });
  }
};
