import App from 'koa';
import cors from '@koa/cors';
import * as errorService from '../services/errorService';
import router from '../routes/instagramRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = new App();
app.proxy = true;
app.use(cors());
app.use(router.routes());
app.use(router.allowedMethods());
app.on('error', errorService.handleError);
export default app;
