import { Request, Response } from 'express';
import User from './User.js';

function sendDatabaseError(res: Response, error: unknown, action: string): Response {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 11000) {
        return res.status(409).json({ message: 'Email already exists' });
    }

    return res.status(500).json({ message: `Error ${action} user`, error });
}

export async function createUser(req: Request, res: Response): Promise<Response> {
    try {
        const { name, email, password } = req.body;
        const newUser = new User({ name, email, password });
        await newUser.save();
        return res.status(201).json(newUser);
    } catch (error) {
        return sendDatabaseError(res, error, 'creating');
    }
}

export async function getUsers(_req: Request, res: Response): Promise<Response> {
    try {
        const users = await User.find();
        return res.status(200).json(users);
    } catch (error) {
        return sendDatabaseError(res, error, 'retrieving');
    }
}

export async function getUserById(req: Request, res: Response): Promise<Response> {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        return sendDatabaseError(res, error, 'retrieving');
    }
}

export async function updateUser(req: Request, res: Response): Promise<Response> {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(updatedUser);
    } catch (error) {
        return sendDatabaseError(res, error, 'updating');
    }
}

export async function deleteUser(req: Request, res: Response): Promise<Response> {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        return sendDatabaseError(res, error, 'deleting');
    }
}
