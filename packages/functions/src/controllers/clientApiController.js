import {getIGDataByShopDomain} from '../repositories/clientApiRepository';

export async function getClientApi(ctx) {
  try {
    console.log('_______________________________api_____________');
    const {shoifyDomain} = ctx.query;
    const apiClient = await getIGDataByShopDomain(shoifyDomain);
    return (ctx.body = {
      success: true,
      data: apiClient
    });
  } catch (error) {
    return error;
  }
}
