import { Request, Response } from 'express';
import { getCustomRepository, IsNull, Not } from 'typeorm';

import { SurveysUserRepository } from '../repositories/SurveysUsersRepository';

class NpsController {
  async execute(request: Request, response: Response) {
    const { survey_id } = request.params;

    const surveysUserRepository = getCustomRepository(SurveysUserRepository);

    const surveysUsers = await surveysUserRepository.find({
      survey_id,
      value: Not(IsNull()),
    });

    const detractor = surveysUsers.filter(
      (survey) => survey.value >= 0 && survey.value <= 6,
    ).length;

    const promoters = surveysUsers.filter(
      (survey) => survey.value >= 9 && survey.value <= 10,
    ).length;

    const passive = surveysUsers.filter(
      (survey) => survey.value >= 0 && survey.value <= 6,
    ).length;

    const totalAnswers = surveysUsers.length;

    const calcule = Number(
      (((promoters - detractor) / totalAnswers) * 100).toFixed(2),
    );

    return response.json({
      detractor,
      promoters,
      passive,
      totalAnswers,
      nps: calcule,
    });
  }
}

export { NpsController };
