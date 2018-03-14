# Chrome Shots

A docker compose configuration that uses headless chrome with puppeteer to generate full page screenshots for a given set of urls and devices.

## Usage

The script is creating a puppeteer instance and goes trough each configured device to update the viewport. For each of these configurations the url list will be used to create full page screenshots, which will be stored in the **screenshots** directory that will be created under **app**.

### Configure devices and urls

A preconfigured list of devices is available in the applications **devices.js**. The list was extracted from the Chromium repository: [Chromium Emulated Device Configurations Json](https://cs.chromium.org/codesearch/f/chromium/src/third_party/WebKit/Source/devtools/front_end/emulated_devices/module.json)

In the **urls.js** is the list of pages that will be requested to create screenshots.

#### Helpful Tools
- To easily collect a list of urls- use this tool [SEO Chat Website Crawler](http://tools.seochat.com/tools/online-crawl-google-sitemap-generator), then download the xls file and the urls to **urls.js** 
- See [puppeteer docs](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md)


### Build the puppeteer container

This is required only once in order to create the Docker image.

    docker-compose build

### Generate screenshots

Must be run each time to generate all screenshots for the devices and urls. The container will be exited once the job is done.

    docker-compose run puppeteer
