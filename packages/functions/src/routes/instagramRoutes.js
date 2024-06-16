import Router from 'koa-router';
import {
  authInstagram,
  callbackInstagram,
  disconnectInstagram
} from '../controllers/authIgController.js';
import checkAuthIg from '../middleware/authIgMiddleware.js';

const router = new Router({
  prefix: '/authInsApi'
});
router.get('/auth', authInstagram);
router.get('/callback', callbackInstagram);
router.post('/disconnect', checkAuthIg, disconnectInstagram);
export default router;
