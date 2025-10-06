import axios from 'axios';
import { chromium, type Browser, type BrowserContext, type Page } from 'playwright';

export interface StockItem {
  storeName: string;
  productTitle: string;
  pickupLabel: string;
  available: boolean;
}

export interface AppleStockCheckerConfig {
  productUrl: string;
  productUrl2: string;
  location?: string;
  postcode?: string;
  headless?: boolean;
}

interface WaitTiming {
  PAGE_LOAD: [number, number];
  BUTTON_CLICK: [number, number];
  INPUT_DELAY: [number, number];
  SCROLL_STEP: [number, number];
  FINAL_WAIT: [number, number];
  API_TIMEOUT: number;
  VISIBILITY_TIMEOUT: number;
  STORE_LIST_TIMEOUT: number;
}

const TIMING: WaitTiming = {
  PAGE_LOAD: [1000, 2000],
  BUTTON_CLICK: [800, 1200],
  INPUT_DELAY: [300, 600],
  SCROLL_STEP: [200, 400],
  FINAL_WAIT: [500, 1000],
  API_TIMEOUT: 8000,
  VISIBILITY_TIMEOUT: 3000,
  STORE_LIST_TIMEOUT: 8000
};

const SELECTORS = {
  CHECK_AVAILABILITY:
    'button:has-text("Check availability"), button:has-text("ตรวจสอบสถานะสินค้า")',
  POSTCODE_INPUT:
    'input[name="postalCode"], input[placeholder*="รหัสไปรษณีย์"], input[placeholder*="Postal"], input[type="text"][aria-label*="postal"], input#postalCode, input[data-autom="postalCodeInput"], input[placeholder*="Postcode"]',
  STORE_ELEMENTS: '[data-autom="store-selector-item"], .rf-pickup-store',
  STORE_NAME: '.store-name, [data-autom="store-name"]',
  AVAILABILITY: '.availability, [data-autom="availability"]',
  PRODUCT_TITLE: '.product-title, [data-autom="product-title"]'
};

const BROWSER_CONFIG = {
  ARGS: [
    '--disable-blink-features=AutomationControlled',
    '--disable-dev-shm-usage',
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-web-security',
    '--disable-features=IsolateOrigins,site-per-process'
  ],
  USER_AGENT:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  VIEWPORT: { width: 1920, height: 1080 },
  LOCALE: 'th-TH',
  TIMEZONE: 'Asia/Bangkok',
  GEOLOCATION: { latitude: 13.7563, longitude: 100.5018 }
};

export class AppleStockChecker {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private config: AppleStockCheckerConfig;

  constructor(config: AppleStockCheckerConfig) {
    this.config = {
      headless: true,
      postcode: '10150',
      ...config
    };
  }

  async initialize(): Promise<void> {
    console.log('[AppleStockChecker] Initializing browser...');

    this.browser = await chromium.launch({
      headless: this.config.headless,
      args: BROWSER_CONFIG.ARGS
    });

    this.context = await this.browser.newContext({
      viewport: BROWSER_CONFIG.VIEWPORT,
      userAgent: BROWSER_CONFIG.USER_AGENT,
      locale: BROWSER_CONFIG.LOCALE,
      timezoneId: BROWSER_CONFIG.TIMEZONE,
      geolocation: BROWSER_CONFIG.GEOLOCATION,
      permissions: ['geolocation']
    });

    await this.context.setExtraHTTPHeaders({
      'Accept-Language': 'th-TH,th;q=0.9,en-US;q=0.8,en;q=0.7',
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      Connection: 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Cache-Control': 'max-age=0'
    });

    console.log('[AppleStockChecker] Browser initialized successfully');
  }

  async checkStock(): Promise<StockItem[]> {
    if (!this.context) {
      throw new Error('Browser not initialized. Call initialize() first.');
    }

    const page = await this.context.newPage();
    const stockItems: StockItem[] = [];

    try {
      await this.navigateToProductPages(page);
      const apiData = await this.handleStockAvailabilityCheck(page);

      if (apiData) {
        console.log('[AppleStockChecker] Successfully intercepted API data');
        stockItems.push(...this.parseStockData(apiData));
      } else {
        console.log('[AppleStockChecker] Falling back to page scraping...');
        const scrapedItems = await this.scrapeStockFromPage(page);
        stockItems.push(...scrapedItems);
      }

      console.log(`[AppleStockChecker] Found ${stockItems.length} total items`);
    } catch (error) {
      console.error('[AppleStockChecker] Error checking stock:', error);
      throw error;
    } finally {
      await page.close();
    }

    return stockItems;
  }

  private async navigateToProductPages(page: Page): Promise<void> {
    console.log(`[AppleStockChecker] Navigating to ${this.config.productUrl}`);
    await page.goto(this.config.productUrl, {
      waitUntil: 'networkidle',
      timeout: 60000
    });

    await this.randomDelay(...TIMING.PAGE_LOAD);
    await this.humanScroll(page);

    console.log(`[AppleStockChecker] Navigating to ${this.config.productUrl2}`);
    await page.goto(this.config.productUrl2, {
      waitUntil: 'networkidle',
      timeout: 60000
    });

    await this.randomDelay(...TIMING.PAGE_LOAD);
  }

  private async handleStockAvailabilityCheck(page: Page): Promise<any> {
    console.log('[AppleStockChecker] Waiting for pickup availability section...');

    const postcode = this.config.postcode || '10150';
    let apiData: any = null;

    try {
      const checkAvailabilityButton = page.locator(SELECTORS.CHECK_AVAILABILITY).first();
      if (await checkAvailabilityButton.isVisible({ timeout: TIMING.VISIBILITY_TIMEOUT })) {
        console.log('[AppleStockChecker] Clicking check availability button...');
        await checkAvailabilityButton.click();
        await this.randomDelay(...TIMING.BUTTON_CLICK);

        apiData = await this.handlePostcodeInput(page, postcode);
      }
    } catch (e) {
      console.log('[AppleStockChecker] No check availability button found, continuing...');
    }

    await this.randomDelay(...TIMING.FINAL_WAIT);
    return apiData;
  }

  private async handlePostcodeInput(page: Page, postcode: string): Promise<any> {
    console.log('[AppleStockChecker] Looking for postcode input...');

    try {
      const postcodeInput = page.locator(SELECTORS.POSTCODE_INPUT).first();

      if (await postcodeInput.isVisible({ timeout: TIMING.VISIBILITY_TIMEOUT })) {
        console.log(`[AppleStockChecker] Found postcode input, entering ${postcode}...`);

        await postcodeInput.clear();
        await this.randomDelay(...TIMING.INPUT_DELAY);

        await postcodeInput.click();
        await postcodeInput.pressSequentially(postcode, { delay: 100 });
        await this.randomDelay(...TIMING.INPUT_DELAY);

        const promiseApiData = this.interceptStockAPI(page, postcode);

        await postcodeInput.press('Enter');
        await this.randomDelay(...TIMING.INPUT_DELAY);

        await page
          .locator(`text=Pick it up at an Apple Store near: ${postcode}`)
          .waitFor({ timeout: TIMING.STORE_LIST_TIMEOUT, state: 'visible' });

        const apiData = await promiseApiData;
        console.log(`[AppleStockChecker] Postcode ${postcode} entered and submitted`);
        return apiData;
      } else {
        console.log('[AppleStockChecker] Postcode input not found, continuing...');
      }
    } catch (postcodeError) {
      console.log('[AppleStockChecker] Error entering postcode:', postcodeError);
    }

    return null;
  }

  private async interceptStockAPI(page: Page, postcode: string): Promise<any> {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => resolve(null), TIMING.API_TIMEOUT);

      page.on('response', async (response) => {
        const url = response.url();
        if (
          (url.includes('fulfillment-messages') || url.includes('pickup-message')) &&
          url.includes(postcode)
        ) {
          try {
            const data = await response.json();
            clearTimeout(timeout);
            resolve(data);
          } catch (e) {
            console.log('[AppleStockChecker] Failed to parse API response');
          }
        }
      });
    });
  }

  private parseStockData(data: any): StockItem[] {
    const items: StockItem[] = [];

    try {
      const stores = data?.body?.content?.pickupMessage?.stores || [];

      for (const store of stores) {
        const { storeName } = store;
        const partsAvailability = store.partsAvailability || {};

        for (const partKey of Object.keys(partsAvailability)) {
          const part = partsAvailability[partKey];
          const { messageTypes, buyability } = part;
          const { storePickupLabel, storePickupProductTitle } =
            messageTypes?.regular || messageTypes?.compact || {};

          items.push({
            storeName,
            productTitle: storePickupProductTitle || 'Unknown Product',
            pickupLabel: storePickupLabel || 'Unknown',
            available: buyability?.isBuyable || false
          });
        }
      }
    } catch (error) {
      console.error('[AppleStockChecker] Error parsing stock data:', error);
    }

    return items;
  }

  private async scrapeStockFromPage(page: Page): Promise<StockItem[]> {
    const items: StockItem[] = [];

    try {
      const storeElements = await page.locator(SELECTORS.STORE_ELEMENTS).all();

      for (const storeElement of storeElements) {
        try {
          const storeName =
            (await storeElement.locator(SELECTORS.STORE_NAME).textContent()) || 'Unknown Store';
          const availabilityText =
            (await storeElement.locator(SELECTORS.AVAILABILITY).textContent()) || '';
          const productTitle =
            (await storeElement.locator(SELECTORS.PRODUCT_TITLE).textContent()) || 'iPhone';

          const available =
            availabilityText.toLowerCase().includes('available') ||
            availabilityText.toLowerCase().includes('มีสินค้า');

          items.push({
            storeName: storeName.trim(),
            productTitle: productTitle.trim(),
            pickupLabel: availabilityText.trim(),
            available
          });
        } catch (e) {
          console.log('[AppleStockChecker] Failed to parse store element:', e);
        }
      }
    } catch (error) {
      console.error('[AppleStockChecker] Error scraping page:', error);
    }

    return items;
  }

  private async humanScroll(page: Page): Promise<void> {
    const scrollSteps = 3;

    for (let i = 0; i < scrollSteps; i++) {
      await page.evaluate(() => {
        // @ts-expect-error - window is available in browser context
        window.scrollBy({
          // @ts-expect-error - window is available in browser context
          top: window.innerHeight * 0.8,
          behavior: 'smooth'
        });
      });
      await this.randomDelay(...TIMING.SCROLL_STEP);
    }

    await page.evaluate(() => {
      // @ts-expect-error - window is available in browser context
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    await this.randomDelay(...TIMING.SCROLL_STEP);
  }

  private async randomDelay(min: number, max: number): Promise<void> {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  async close(): Promise<void> {
    if (this.context) {
      await this.context.close();
      this.context = null;
    }
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
    console.log('[AppleStockChecker] Browser closed');
  }

  async sendDiscordNotification(webhook: string, items: StockItem[]): Promise<void> {
    const availableItems = items.filter((item) => item.available);

    if (availableItems.length === 0) {
      console.log('[AppleStockChecker] No available items to notify');
      return;
    }

    const message = availableItems
      .map((item) => `🟢 **${item.storeName}**\n${item.productTitle}\n${item.pickupLabel}`)
      .join('\n\n');

    const payload = {
      content: `🚨 **iPhone Stock Alert!** 🚨\n\n${message}`,
      username: 'Apple Stock Bot',
      avatar_url: 'https://www.apple.com/ac/structured-data/images/knowledge_graph_logo.png'
    };

    try {
      await axios.post(webhook, payload);
      console.log(
        `[AppleStockChecker] Sent notification for ${availableItems.length} available items`
      );
    } catch (error) {
      console.error('[AppleStockChecker] Failed to send Discord notification:', error);
    }
  }
}
