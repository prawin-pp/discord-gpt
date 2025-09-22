import axios from 'axios';
import cron from 'node-cron';
import { config } from './config';
import type { Welcome } from './types/apple';

cron.schedule(config.apple.crontab, async () => {
  console.log(`Running cronjob at ${new Date().toISOString()}`);

  const resp = await axios.get<Welcome>(config.apple.link);
  if (resp.status !== 200) {
    console.error(`Failed to fetch data: ${resp.status}`);
    return;
  }

  const items = resp.data?.body?.content?.pickupMessage?.stores?.reduce((prev, store) => {
    const { storeName } = store;
    Object.keys(store.partsAvailability).forEach((key) => {
      const part = store.partsAvailability[key];
      const { messageTypes, buyability } = part;
      const { storePickupLabel, storePickupProductTitle } = messageTypes.compact;
      if (buyability.isBuyable) {
        prev.push(`${storePickupLabel} ${storeName} ${storePickupProductTitle}`);
      }
    });
    return prev;
  }, [] as string[]);

  if (items.length > 0) {
    console.log(`Found ${items.length} items`);
    const msg = items.join('\n');
    await axios.post(config.apple.webhook, { content: msg });
  }
});
