import { randomInt } from "crypto"
import { Page } from "puppeteer"
import { delay } from "src/utils/helper"

interface GoogleReportProps {
  page: Page
  url: string
  directories: string[]
  filename: string
}

export default async function googleReport(props: GoogleReportProps) {
  const { page, url, directories, filename } = props

  page.setViewport({ width: 1920, height: 1080 })

  console.log("Navigate to url")
  await page.goto(url)

  console.log("Close Popup")
  const closeButton = await page.waitForSelector(
    `material-button[aria-label="Close notifications"]`,
    { visible: true },
  )
  await closeButton?.click()

  console.log("Click the Download Button")
  await delay(randomInt(10, 15) * 1000)
  const downloadButton = await page.waitForSelector(`material-button[aria-label="Download"]`)
  await downloadButton?.click()

  console.log("Find the Download Dropdown Buttons")
  await delay(randomInt(5, 6) * 1000)
  const downloadDropdown = await page.waitForSelector(`material-list.download-dropdown`)
  const downloadButtons = await downloadDropdown?.$$(`material-list-item`)

  console.log("Click the Google Sheets Button")
  if (downloadButtons)
    for (const button of downloadButtons) {
      const textContent = await (await button.getProperty("textContent")).jsonValue()
      if (textContent === "Google Sheets") button.click()
    }

  console.log("Find the export form")
  await delay(randomInt(1, 5) * 1000)
  const exportToSheet = await page.waitForSelector(`export-to-sheets`)

  console.log("Replace filename with a proper filename")
  const nameInput = await exportToSheet?.waitForSelector(`material-input`)
  await nameInput?.click({ count: 3 })
  await page.keyboard.press("Backspace")
  await page.keyboard.type(filename, { delay: 250 })

  console.log("Folder drive selection")
  const dropdownButton = await exportToSheet?.waitForSelector(`dropdown-button`)
  await dropdownButton?.click()

  console.log("Select shared folders")
  await delay(randomInt(5, 6) * 1000)
  const googleDrive = await page.waitForSelector(`iframe[aria-label="Drive"]`)
  const driveFrame = await googleDrive?.contentFrame()
  const myDrive = await driveFrame?.waitForSelector(
    `div[aria-label="My Drive Google Drive Folder"]`,
  )
  await myDrive?.click({ count: 2 })

  await Promise.allSettled(
    directories.map(async (label) => {
      const currentLabel = await driveFrame?.waitForSelector(`div[aria-label="${label}"]`)
      await currentLabel?.click({ count: 2 })
    }),
  )

  console.log("Set current folder")
  await delay(randomInt(5, 6) * 1000)
  const saveButton = await driveFrame?.waitForSelector(`div[aria-label="Save here"]`)
  await saveButton?.click()

  console.log("Confirm export")
  await delay(randomInt(5, 6) * 1000)
  const confirmButtons = await page.waitForSelector(`div.download-cancel-buttons`)
  const doneButton = await confirmButtons?.waitForSelector(`material-button.btn-yes`)
  await doneButton?.click()
}
