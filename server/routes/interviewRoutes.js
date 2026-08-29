// Interview routes
import express from 'express';
const router = express.Router();
import * as interviewController from '../controllers/interviewController.js';
import userAuth from '../middleware/userAuth.js';
import { checkAIInterviewAccess, incrementAIInterviewUsage } from '../middleware/subscriptionMiddleware.js';

router.post('/start', userAuth, checkAIInterviewAccess, interviewController.startInterview);
router.post('/message', userAuth, interviewController.sendMessage);
router.post('/end', userAuth, incrementAIInterviewUsage, interviewController.endInterview);
router.get('/:id', userAuth, interviewController.getInterview);

export default router;
