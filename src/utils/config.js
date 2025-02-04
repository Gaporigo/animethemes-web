const { error, warn } = require("next/dist/build/output/log");
const chalk = require("next/dist/lib/chalk").default;

// Server-side

const SERVER_API_URL = process.env.ANIMETHEMES_API_URL;
const SERVER_API_KEY = process.env.ANIMETHEMES_API_KEY;

const REVALIDATE_TOKEN = process.env.REVALIDATE_TOKEN;
const ANALYZE = !!process.env.ANALYZE;

// Server-side + Client-side

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const CLIENT_API_URL = process.env.NEXT_PUBLIC_API_URL;
const VIDEO_URL = process.env.NEXT_PUBLIC_VIDEO_URL;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

const STAGING = !!process.env.NEXT_PUBLIC_STAGING;

function validateConfig() {
    let isValid = true;
    if (!SERVER_API_URL && !CLIENT_API_URL) {
        error(`You need to either specify ${chalk.cyan("ANIMETHEMES_API_URL")} or ${chalk.cyan("NEXT_PUBLIC_API_URL")} for API requests to work.`);
        isValid = false;
    }
    if (SERVER_API_URL && !CLIENT_API_URL) {
        warn(`It is highly recommended to specify ${chalk.cyan("NEXT_PUBLIC_API_URL")}. Otherwise API on the client-side won't work.`);
    }
    if (!VIDEO_URL) {
        warn(`It is recommended to specify ${chalk.cyan("NEXT_PUBLIC_VIDEO_URL")}. Otherwise videos won't play.`);
    }
    if (!APP_URL) {
        warn(`You haven't specified ${chalk.cyan("NEXT_PUBLIC_APP_URL")}. This is fine for development, but should be fixed in production.`);
    }
    return isValid;
}

module.exports = {
    SERVER_API_URL,
    SERVER_API_KEY,
    REVALIDATE_TOKEN,
    ANALYZE,
    BASE_PATH,
    CLIENT_API_URL,
    VIDEO_URL,
    APP_URL,
    STAGING,
    validateConfig,
};
