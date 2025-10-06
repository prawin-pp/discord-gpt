import cron from 'node-cron';
import { config } from './config';
import { AppleStockChecker } from './services/appleStockChecker';

interface CronJobState {
  checker: AppleStockChecker | null;
  isRunning: boolean;
  consecutiveNoStockCount: number;
  lastStockFoundAt: Date | null;
}

const state: CronJobState = {
  checker: null,
  isRunning: false,
  consecutiveNoStockCount: 0,
  lastStockFoundAt: null
};

const TIMING = {
  FAST_CHECK_INTERVAL: '*/1 * * * *',
  NORMAL_CHECK_INTERVAL: '*/2 * * * *',
  SLOW_CHECK_INTERVAL: '*/5 * * * *',
  NO_STOCK_THRESHOLD: 12,
  RECENT_STOCK_WINDOW_MS: 3600000
};

let currentSchedule: cron.ScheduledTask | null = null;
let currentInterval: string = config.apple.crontab;

const initializeChecker = async (): Promise<void> => {
  state.checker = new AppleStockChecker({
    productUrl: config.apple.link,
    productUrl2: config.apple.link2,
    postcode: config.apple.postcode,
    headless: true
  });
  await state.checker.initialize();
};

const cleanupChecker = async (): Promise<void> => {
  if (!state.checker) return;

  try {
    await state.checker.close();
  } catch (err) {
    console.error('[CRONJOB] Error closing checker:', err);
  } finally {
    state.checker = null;
  }
};

const processStockCheck = async (): Promise<void> => {
  const stockItems = await state.checker!.checkStock();
  const availableItems = stockItems.filter((item) => item.available);

  if (availableItems.length > 0) {
    console.log(`[CRONJOB] Found ${availableItems.length} available items!`);
    state.consecutiveNoStockCount = 0;
    state.lastStockFoundAt = new Date();
    await state.checker!.sendDiscordNotification(config.apple.webhook, stockItems);
    adjustCheckInterval();
  } else {
    console.log('[CRONJOB] No items available at this time');
    state.consecutiveNoStockCount++;
    adjustCheckInterval();
  }
};

const adjustCheckInterval = (): void => {
  const now = Date.now();
  const recentStockFound =
    state.lastStockFoundAt &&
    now - state.lastStockFoundAt.getTime() < TIMING.RECENT_STOCK_WINDOW_MS;

  let newInterval: string;

  if (recentStockFound) {
    newInterval = TIMING.FAST_CHECK_INTERVAL;
    console.log('[CRONJOB] Recent stock found - using fast check interval (1 min)');
  } else if (state.consecutiveNoStockCount >= TIMING.NO_STOCK_THRESHOLD) {
    newInterval = TIMING.SLOW_CHECK_INTERVAL;
    console.log('[CRONJOB] No stock for extended period - using slow check interval (5 min)');
  } else {
    newInterval = TIMING.NORMAL_CHECK_INTERVAL;
    console.log('[CRONJOB] Using normal check interval (2 min)');
  }

  if (currentSchedule && currentInterval !== newInterval) {
    currentSchedule.stop();
    currentSchedule = cron.schedule(newInterval, executeStockCheck);
    currentInterval = newInterval;
    console.log(`[CRONJOB] Schedule updated to: ${newInterval}`);
  }
};

const executeStockCheck = async (): Promise<void> => {
  if (state.isRunning) {
    console.log('[CRONJOB] Previous check still running, skipping...');
    return;
  }

  state.isRunning = true;

  try {
    console.log(`[CRONJOB] Running stock check at ${new Date().toISOString()}`);

    if (!state.checker) {
      await initializeChecker();
    }

    await processStockCheck();
  } catch (err) {
    console.error('[CRONJOB] Error during stock check:', err);
    await cleanupChecker();
  } finally {
    state.isRunning = false;
  }
};

const handleShutdown = async (): Promise<void> => {
  console.log('[CRONJOB] Shutting down gracefully...');
  if (currentSchedule) {
    currentSchedule.stop();
  }
  await cleanupChecker();
  process.exit(0);
};

currentSchedule = cron.schedule(config.apple.crontab, executeStockCheck);

process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);
