import {getCurrentShop} from '../helpers/auth';
import InstagramApi from '../helpers/instagramApi';
import {findMediaByShopId, addOrUpdateMedia} from '../repositories/mediaIgRepository';

const igApi = new InstagramApi();

export async function getMedia(ctx) {
  console.log('_________________________media______________________');
  const shopId = getCurrentShop(ctx);
  console.log({shopId});
  const mediaCurrent = await findMediaByShopId(shopId);
  console.log({mediaCurrent});
  const token = ctx.cookies.get('instagram_token');

  if (mediaCurrent.empty) {
    const [media, currentUser] = await Promise.all([
      igApi.fetchMediaData(token),
      igApi.getCurrentUser(token)
    ]);

    await addOrUpdateMedia(shopId, media, currentUser.id);

    return (ctx.body = {
      success: true,
      data: {
        userId: currentUser.id,
        shopId: shopId,
        media: media.slice(0, 10) // Trả về dữ liệu đã lưu (giới hạn 10 mục)
      }
    });
  }

  let allMedia = [];
  mediaCurrent.forEach(doc => {
    allMedia = allMedia.concat(doc.data().media);
  });

  return (ctx.body = {
    success: true,
    data: {
      userId: mediaCurrent.docs[0].data().userId,
      shopId: shopId,
      media: allMedia
    }
  });
}
