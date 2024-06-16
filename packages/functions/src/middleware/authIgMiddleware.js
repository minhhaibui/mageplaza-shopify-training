import {getUser} from '../repositories/userRepository';

const checkAuthIg = async (ctx, next) => {
  const currentUser = await getUser();
  if (!currentUser) {
    ctx.status = 401;
    ctx.body = 'Unauthorized';
    return;
  }

  try {
    ctx.state.currentUserIg = currentUser;
    await next();
  } catch (error) {
    ctx.status = 500;
    ctx.body = 'Internal server error';
  }
};

export default checkAuthIg;
