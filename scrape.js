const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
const useProxy = require("puppeteer-page-proxy");
const { once } = require("events");
const { createReadStream } = require("fs");
const { createInterface } = require("readline");
puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

let users;
(async function processLineByLine() {
	try {
		const data = [];
		const rl = createInterface({
			input: createReadStream("sample.txt"),
			crlfDelay: Infinity,
		});

		rl.on("line", (line) => {
			data.push(line);
		});

		await once(rl, "close");

		users = data;
		automate();
	} catch (err) {
		console.error(err);
	}
})();

automate = async () => {
	const launchOptions = {
		executablePath: "/usr/bin/google-chrome",
		headless: false,
		args: [
			"--ignore-certificate-errors",
			"--disable-web-security",
			"--start-maximized",
			"--disable-setuid-sandbox",
			`--proxy-server=14.99.235.171:80`,
		],
		ignoreHTTPSErrors: true,
		// slowMo: 33,
	};

	const browser = await puppeteer.launch(launchOptions);
	// const context = await browser.createIncognitoBrowserContext();
	// const page = await context.newPage();
	const page = await browser.newPage();
	await page.close();
	await browser.close();
};
