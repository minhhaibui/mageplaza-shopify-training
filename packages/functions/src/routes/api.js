import Router from 'koa-router';
import * as shopController from '@functions/controllers/shopController';
import * as subscriptionController from '@functions/controllers/subscriptionController';
import * as feedController from '@functions/controllers/feedController';
import * as mediaController from '@functions/controllers/mediaController';
import * as userController from '@functions/controllers/userController';

import checkAuthIg from '../middleware/authIgMiddleware.js';

import jsonType from '@functions/middleware/jsonType';

export default function getRoutes(prefix = '/api') {
  const router = new Router({
    prefix
  });

  router.get('/shops', shopController.getUserShops);
  router.get('/shop/get/:domain', shopController.getOne);
  router.put('/shop/set', jsonType, shopController.setOne);
  router.get('/shop/embedStatus', shopController.getEmbedStatus);
  router.put('/republish', shopController.republishTheme);
  router.get('/subscription', subscriptionController.getSubscription);
  router.get('/user', checkAuthIg, userController.getUserCurrent);
  router.get('/feed', checkAuthIg, feedController.getFeed);
  router.put('/feed', checkAuthIg, feedController.updateFeeds);
  router.get('/media', checkAuthIg, mediaController.getMedia);
  router.put('/syncMedia', checkAuthIg, mediaController.handleSyncMedia);
  return router;
}
