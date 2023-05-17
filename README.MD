# scrape-automation

A script that use scraping to automated the things that's not possible using REST API

## Installation

```bash
npm run ci
pnpm run ci
yarn run ci
```

## Environment

- ESB_USER_DATA_DIR: use to relocate browser data to your preffered absolute path
- ESB_EXECUTABLE_PATH: absolute path of a already installed Chrome/Chromium Browser, used if built-in browser is not working
- ESB_GOOGLE_USERNAME: username of the google account that will be used
- ESB_GOOGLE_PASSWORD: password of the google account that will be used

## Development

- copy `.env.example` to `.env` and fill details
- copy `currentStatus.json.example` to `currentStatus.json`

```bash
npm run dev
```

## Production

```bash
npm run build

# run using cli
node .

# run using pm2
pm2 start index.cjs
```
