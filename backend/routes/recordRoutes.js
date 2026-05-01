import express from 'express';
import {
  getRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
} from '../controllers/recordController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

router.route('/')
  .get(getRecords)
  .post(upload.single('image'), createRecord);

router.route('/:id')
  .get(getRecordById)
  .put(upload.single('image'), updateRecord)
  .delete(deleteRecord);

export default router;
