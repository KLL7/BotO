import { Router } from 'express';
import ProfessionalController from '../controllers/professional.controller';

const professionalRouter = Router();

professionalRouter
  .get('/', ProfessionalController.getAll)
  .get('/:id', ProfessionalController.getOne)
  .put('/:id', ProfessionalController.update)
  .delete('/:id', ProfessionalController.delete);

professionalRouter
  .post('/sign-in', ProfessionalController.signIn)
  .post('/sign-up', ProfessionalController.signUp)
  .post('/fill-bot-model', ProfessionalController.fillBotModel);

export default professionalRouter;
