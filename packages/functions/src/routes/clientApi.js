import Router from 'koa-router';
import {getClientApi} from '../controllers/clientApiController.js';

const router = new Router({
  prefix: '/clientApi'
});
router.get('/instagram', getClientApi);

export default router;
