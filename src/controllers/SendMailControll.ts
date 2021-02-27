import { Request, Response } from "express";
import {resolve} from 'path';
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../repositories/UserRepository";
import {  SurveysRepository  } from "../repositories/SurveysRepository"
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import SendMailService from "../services/SendMailService";
import { AppError } from "../errors/AppErro";


class SendMailController {
    async execute(request: Request, response: Response) {
        const { email, survey_id } = request.body;

        const usersRepository = getCustomRepository(UserRepository);
        const surveyRepository = getCustomRepository(SurveysRepository);
        const surveyUserRepository = getCustomRepository(SurveysUsersRepository);

        const user = await usersRepository.findOne({email});
        if (!user)
        {
            const message = "User does not exists!"
            throw new AppError(message);            
        }

        const survey = await surveyRepository.findOne({id: survey_id});
        if(!survey)
        {
            const message = "Survey does not exists!"
            throw new AppError(message);
        }

        const npsPath = resolve(__dirname, "..", "views", "emails", "npsEmail.hbs");
        

        const surveysUserAlReadyExists = await surveyUserRepository.findOne({
            where: {user_id:user.id, value: null},
            relations: ["user", "survey"]           
            
        });

        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            id: "",
            link: process.env.URL_MAIL,

        }

        if (surveysUserAlReadyExists)
        {
            variables.id = surveysUserAlReadyExists.id
            await SendMailService.excute(email, survey.title, variables, npsPath );
            return response.json(surveysUserAlReadyExists)
        }

        const surveyUser = surveyUserRepository.create({
            user_id: user   .id,
            survey_id
        });      

        await surveyUserRepository.save(surveyUser);

        variables.id = surveyUser.id

        await SendMailService.excute(email, survey.title, variables, npsPath);

        return response.json(surveyUser)
    }
}


export {  SendMailController  }