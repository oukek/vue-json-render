import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { adminLogin, getActivities, getActivityById, createActivity, updateActivity, uploadActivity } from './controllers/admin';
import { userLogin, getUserInfo, getUserActivityConfig } from './controllers/user';
import { authenticate } from './middleware/auth';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const upload = multer();

// Admin Routes
app.post('/admin/login', adminLogin);
app.get('/admin/activities', authenticate('admin'), getActivities);
app.get('/admin/activities/:id', authenticate('admin'), getActivityById);
app.post('/admin/activities', authenticate('admin'), createActivity);
app.put('/admin/activities/:id', authenticate('admin'), updateActivity);
app.post('/admin/activities/:id/upload', authenticate('admin'), upload.single('file'), uploadActivity);

// User Routes
app.post('/user/login', userLogin);
app.get('/user/info', authenticate('user'), getUserInfo);
app.get('/user/activities/:id', getUserActivityConfig);

app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});
