import Router from 'koa-router';
import {
  authInstagram,
  callbackInstagram,
  getMedia,
  disconnectInstagram
} from '../controllers/authIgController.js';
const router = new Router({
  prefix: '/authInsApi'
});
router.get('/auth', authInstagram);
router.get('/callback', callbackInstagram);
router.post('/disconnect', disconnectInstagram);
router.get('/me', getMedia);
export default router;
