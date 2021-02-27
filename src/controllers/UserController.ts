import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../repositories/UserRepository';
import * as yup from 'yup'
import { AppError } from '../errors/AppErro';



class UserController {
    async create(request: Request, response: Response ) {
        const { name, email } = request.body;

        const schema = yup.object().shape({
            name: yup.string().required(),
            email: yup.string().email().required()
        });


        try {
            await schema.validate(request.body, {  abortEarly: false });
        } catch (err) {
            throw new AppError(err);            
        }
        
        const usersRepository = getCustomRepository(UserRepository);

        const userAlreadyExists = await usersRepository.findOne({
            email
        });

        if (userAlreadyExists){
            const message = "User already exists!";
            throw new AppError(message);
        };
        const user = usersRepository.create({
            name, email
        });

        await usersRepository.save(user);

        return  response.status(201).json(user);
    }
}

export { UserController };
