import { Request, Response } from "express";

import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppErro";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";


class AnswerController {
    async execute(request: Request, response: Response) {

        const { value } = request.params;
        const { u } = request.query;

        const surveyUserRepository = getCustomRepository(SurveysUsersRepository);

        const surveyUser = await surveyUserRepository.findOne({
            id: String(u)
        });

        if (!surveyUser)
        {
            const message = "Survey User does not exists!"            
            throw new AppError(message);
            
        }

        surveyUser.value = Number(value);

        await surveyUserRepository.save(surveyUser);

        return response.json(surveyUser);

    }
}

export { AnswerController }