const Shopify = require('shopify-api-node');

const shopify = new Shopify({
  // shopName: 'avada-tranining.myshopify.com',
});

// Hàm kiểm tra và tạo hoặc cập nhật metafield
export async function createOrUpdateMetafield(metafieldValue) {
  try {
    const metafieldNamespace = 'global';
    const metafieldKey = 'shop_test';
    const metafieldType = 'json_string';

    const metafields = await shopify.metafield.list({
      namespace: metafieldNamespace,
      key: metafieldKey
    });

    if (metafields.length > 0) {
      const metafield = metafields[0];
      const updatedMetafield = await shopify.metafield.update(metafield.id, {
        value: JSON.stringify(metafieldValue),
        type: metafieldType
      });
      console.log('Metafield updated successfully:', updatedMetafield);
    } else {
      const newMetafield = await shopify.metafield.create({
        namespace: metafieldNamespace,
        key: metafieldKey,
        value: JSON.stringify(metafieldValue),
        type: metafieldType,
        owner_resource: 'shop',
        owner_id: null
      });
      console.log('Metafield created successfully:', newMetafield);
    }
  } catch (err) {
    console.error('Error creating or updating metafield:', err);
  }
}

// const metafieldValue = JSON.stringify({
//   id: 'qcthItUxWt5XeKlR9V8n',
//   layout: 'Grid',
//   rows: 2,
//   title: 'main feed',
//   shopId: 'GfhUrGU2TOAKwGscMUD2',
//   columns: '3',
//   postSpacing: '7',
//   countMedia: 7
// });
