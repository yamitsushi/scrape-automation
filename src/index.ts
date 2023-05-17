import fs from "fs"
import googleReport from "./scraper/googleReport"
import { DateTime } from "luxon"
import cron from "node-cron"
import { LaunchOptions, Puppeteer } from "./utils/puppeteer"
import { googleLogin } from "./utils/login"

interface statusLog {
  running: boolean
  timestamp: string
}

let status: Record<string, statusLog | undefined> = {}

importStatus()

cron.schedule("* * * * *", () => {
  const hour = DateTime.now().setZone("America/Los_Angeles").hour
  if (hour == 0) {
    runGoogleReport()
  }
})

async function runGoogleReport() {
  if (status["runGoogleReport"] === undefined)
    status["runGoogleReport"] = {
      running: false,
      timestamp: "",
    }

  if (status["runGoogleReport"].running) return
  let retries = 0

  const date = DateTime.now().setZone("America/Los_Angeles").minus({ days: 1 }).toISODate()

  if (date === null) return
  if (status["runGoogleReport"].timestamp === date) return

  status["runGoogleReport"].running = true

  const browser = await Puppeteer.launch(LaunchOptions)
  const page = await browser.newPage()

  await googleLogin({ page })

  while (true) {
    try {
      await googleReport({
        page,
        url: "https://ads.google.com/aw/reporting/reporteditor/view?ocid=371418874&euid=142463123&__u=4329706427&uscid=136317083&__c=8089518467&authuser=1&reportId=925447195&download=false",
        directories: [
          "MAX REPORTING Shared Google Drive Folder",
          "Source Shared Google Drive Folder",
          "Call Ads View Shared Google Drive Folder",
          "LaLigaDefensora_6017711315 Shared Google Drive Folder",
        ],
        filename: `${date}-ca-laliga`,
      })

      status["runGoogleReport"] = {
        running: false,
        timestamp: date,
      }
      exportStatus()
      break
    } catch (e) {
      if (retries == 3) {
        console.log("Max retries")
        break
      }
      retries++
    }
  }

  await browser.close()
}

function importStatus() {
  status = JSON.parse(fs.readFileSync("./currentStatus.json", "utf8"))
}

function exportStatus() {
  fs.writeFileSync("./currentStatus.json", JSON.stringify(status))
}
