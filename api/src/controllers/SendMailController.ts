import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { resolve } from 'path';
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUserRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UserRepository";
import SendMailServices from "../services/SendMailServices";
import { AppError } from "../errors/AppError";

class SendMailController {

    async execute(request: Request, response: Response) {
        const { email, survey_id } = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUserRepository);

        const user = await usersRepository.findOne({ email });

        if (!user) {
            throw new AppError("User does not exists!");
        }

        const survey = await surveysRepository.findOne({ id: survey_id, });

        if (!survey) {
            throw new AppError("Survey does not exists!");
        }

        const npsPath = resolve(__dirname, "..", "views", "email", "npsMail.hbs");

        const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
            where: { user_id: user.id, value: null },
            relations: ["user", "survey"],
        });
        const variebles = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            id: "",
            link: process.env.URL_MAIL
        }

        if (surveyUserAlreadyExists) {
            variebles.id = surveyUserAlreadyExists.id;
            await SendMailServices.execute(email, survey.title, variebles, npsPath);
            return response.json(surveyUserAlreadyExists);
        }

        //Salvar as  informações na tabela surveyUser
        const surveyUser = surveysUsersRepository.create({
            user_id: user.id,
            survey_id,
        });

        await surveysUsersRepository.save(surveyUser);


        // // Enviar e-mail para o usuário 
        variebles.id = surveyUser.id;

        await SendMailServices.execute(email, survey.title, variebles, npsPath);

        return response.json(surveyUser);


    }

}
export { SendMailController };