// Interview routes
import express from 'express';
const router = express.Router();
import * as interviewController from '../controllers/interviewController.js';

router.post('/start', interviewController.startInterview);
router.post('/message', interviewController.sendMessage);
router.post('/end', interviewController.endInterview);
router.get('/:id', interviewController.getInterview);

export default router;
