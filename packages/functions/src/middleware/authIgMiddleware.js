const checkAuth = async (ctx, next) => {
  const currentUser = ctx.state.userCurrent;
  if (!currentUser) {
    ctx.status = 401;
    ctx.body = 'Unauthorized';
    return;
  }

  try {
    // Optionally, you can add logic to verify the token if needed
    ctx.state.token = token;
    await next();
  } catch (error) {
    console.error('Error verifying token:', error);
    ctx.status = 500;
    ctx.body = 'Internal server error';
  }
};

export default checkAuth;
