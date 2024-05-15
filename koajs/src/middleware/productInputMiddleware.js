import yup from "yup";

async function productInputMiddleware(ctx, next) {
  try {
    const productData = ctx.request.body;
    let schema = yup.object().shape({
      id: yup.string().required(),
      name: yup.string().required(),
      price: yup.string(),
      description: yup.string().required(),
      product: yup.string().required(),
      createdAt: yup.string(),

      image: yup.string(),
    });

    await schema.validate(productData, {
      strict: true,
    });
    next();
  } catch (e) {
    ctx.status = 400;
    ctx.body = {
      success: false,
      errors: e.errors,
      errorName: e.name,
    };
  }
}

export default productInputMiddleware;
