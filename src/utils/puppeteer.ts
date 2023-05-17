import { PuppeteerLaunchOptions } from "puppeteer-core"
import puppeteer from "puppeteer-extra"
import stealth from "puppeteer-extra-plugin-stealth"

puppeteer.use(stealth())

export const Puppeteer = puppeteer

export const LaunchOptions: PuppeteerLaunchOptions = {
  executablePath: process.env.ESB_EXECUTABLE_PATH,
  userDataDir: process.env.ESB_USER_DATA_DIR,
  headless: process.env.NODE_ENV !== "production" ? false : "new",
}
