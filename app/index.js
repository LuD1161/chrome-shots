const puppeteer = require('puppeteer');

const fs = require('fs');

function readURLFile(path) {
    return fs.readFileSync(path, 'utf-8').split('\n');
}

var ArgumentParser = require('argparse').ArgumentParser;
var parser = new ArgumentParser({
  version: '0.1',
  addHelp:true,
  description: 'Puppeteer based multi chrome instance fast screenshotter'
});
const requiredArgs = parser.addArgumentGroup({ title: 'required arguments' });
requiredArgs.addArgument(
  [ '-f', '--file' ],
  {
    help: 'file with urls ( default urls.txt )',
    required: true
  }
);
requiredArgs.addArgument(
  [ '-nb', '--num_browsers' ],
  {
    help: 'Number of browser instances to launch',
    required: false,
    defaultValue: 2
  }
);
requiredArgs.addArgument(
    [ '-np', '--num_pages' ],
    {
      help: 'Number of pages per browser instances to start',
      required: false,
      defaultValue: 2
  }
);
requiredArgs.addArgument(
    [ '-o', '--output' ],
    {
      help: 'Output directory',
      required: false,
      defaultValue: "screenshots"
  }
);
var args = parser.parseArgs();

const NUM_BROWSERS = args['num_browsers'];
const NUM_PAGES = args['num_pages'];
const output = args['output'];
if (!fs.existsSync(output)){
    fs.mkdirSync(output);
}
const urls = readURLFile(args['file']);
const devices = require('./devices.js');
const colors = require('./terminalColors');
let counter = 0;
let len = urls.length;

(async () => {
    const startDate = new Date().getTime();
    const device = devices[0];

    const promisesBrowsers = [];
    for (let numBrowser= 0; numBrowser < NUM_BROWSERS; numBrowser++) {
        promisesBrowsers.push(new Promise(async (resBrowser) => {
            const browser = await puppeteer.launch({ headless:true,
                args: ['--no-sandbox', '--disable-setuid-sandbox', '--ignore-certificate-errors']
            });
            const promisesPages = [];

            for (let numPage = 0; numPage < NUM_PAGES; numPage++ ) {
                promisesPages.push(new Promise(async(resPage) => {
                    while(urls.length > 0) {
                        const url = urls.pop();
                        counter++;
                        console.log( colors.FgRed + counter + colors.Reset + colors.Bright +"/" + colors.FgGreen + len + colors.FgBlue +" "+ url + colors.Reset );
                        let page = await browser.newPage();
                        await page.setViewport({
                            width: device.width,
                            height: device.height,
                            isMobile: device.mobile,
                            hasTouch: device.touch,
                            deviceScaleFactor: device.deviceScaleFactor
                        });
                        await page.setUserAgent(device.userAgent);

                        try{
                            await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
                            let fileName = url.replace(/(\.|\/|:|%|#)/g, "_");
                            if (fileName.length > 100) {
                                fileName = fileName.substring(0, 100);
                            }
                            await page.screenshot({ path: `${output}/${fileName}.jpeg`, fullPage: true });
                        } catch(err) {
                            // console.log(`An error occured on url: ${url}`);
                            console.log(colors.FgRed + err.message + colors.FgWhite + " ==> " + colors.FgBlue + `${url}` + colors.Reset);
                        } finally {
                            await page.close();
                        }
                    }
                    resPage();
                }));
            }

            await Promise.all(promisesPages);
            await browser.close();
            resBrowser();
        }));
    }

    await Promise.all(promisesBrowsers);
    console.log(`Time elapsed ${Math.round((new Date().getTime() - startDate) / 1000)} s`);
})();
