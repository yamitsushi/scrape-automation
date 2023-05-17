import { Page } from "puppeteer"
import { delay } from "./helper"
import { randomInt } from "crypto"

interface GoogleLoginProps {
  page: Page
}

export async function googleLogin(props: GoogleLoginProps) {
  const { page } = props
  console.log("Checking Google")
  await page.goto("https://accounts.google.com")

  try {
    await page.waitForSelector(`input[type="email"]`, { visible: true })
    await page.keyboard.type(process.env.ESB_GOOGLE_USERNAME ?? "")
    await page.keyboard.press("Enter")
    console.log("Username Submitted")

    await page.waitForSelector(`input[type="password"]`, { visible: true })
    await page.keyboard.type(process.env.ESB_GOOGLE_PASSWORD ?? "")
    await page.keyboard.press("Enter")
    console.log("Password Submitted")

    await delay(randomInt(5, 10) * 1000)
  } catch (e) {
    console.log("Skipping Login")
  }

  console.log("Account Active")
}
