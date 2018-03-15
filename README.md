# Chrome Shots

A docker compose configuration that uses headless chrome with puppeteer to generate full page screenshots for a given set of urls and devices.

## Usage
An effective DIY solution to batch screenshot for proofing & testing devices. <br>
I use in combination with [Invision](https://www.invisionapp.com/). <br>
Of course, it is useful for several different things. 

*Proofing Scenario*
- 1) Edit **devices.js** for each desired device to test
- 2) Create Invision prototype for each of those desired device configurations
- 3) Run script*
- 4) Upload device screenshot device folder to Invison prototype

Simply repeat steps 3-4 for each set of revisions

*The script is creating a puppeteer instance and goes through each configured device to update the viewport. For each of these configurations the url list will be used to create full page screenshots, which will be stored in the **screenshots** directory that will be created/updated under **app** each time the script is ran.

<br>

## Prerequisites

#### Install Docker & Running
[Install Docker](https://docs.docker.com/install/) and make sure it is up and running before moving ahead. 
<br>Should be able to access ```docker``` commands in cli.

#### Configure devices and urls

A preconfigured list of devices is available in the applications **devices.js**. 
<br>The list was extracted from the Chromium repository: [Chromium Emulated Device Configurations Json](https://cs.chromium.org/codesearch/f/chromium/src/third_party/WebKit/Source/devtools/front_end/emulated_devices/module.json)

In the **urls.js** is the list of pages that will be requested to create screenshots.

#### Helpful Tools
- To easily collect a list of urls- use this tool [SEO Chat Website Crawler](http://tools.seochat.com/tools/online-crawl-google-sitemap-generator), download the xls file, then add desired urls to **urls.js** 
- See [puppeteer docs](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md) for more options on device viewports, configuration, loading options, etc.

<br>

## Execution 

#### Build the puppeteer container

This is required only once in order to create the Docker image.

    docker-compose build

#### Generate screenshots

Must be run each time to generate all screenshots for the devices and urls. The container will be exited once the job is done.

    docker-compose run puppeteer
    
<br>

### Credit
<hr>

- [@nezhar](https://github.com/nezhar) for putting this together 
- [@schnerd](https://github.com/GoogleChrome/puppeteer/issues/703) for the full page screenshot fix
