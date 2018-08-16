const cheerio = require('cheerio');
const FormData = require('form-data');
const got = require('got');
const util = require('util');

const downloadServiceUrl = 'https://9soundclouddownloader.com';
const url = 'https://soundcloud.com/thedolab/uone-lib-2018';

const getMp3Url = (url) =>
  got(downloadServiceUrl)
    .then((response) => {
      const $ = cheerio.load(response.body);

      const formElement = $('form[name="myDownloadForm"]');

      if (formElement.length === 0) {
        throw new Error(`Form not found on "${downloadServiceUrl}"!`);
      }

      const fields = formElement.serializeArray();

      const csrfTokenField = (fields.find((elem) => elem.name.includes('csrf')) || {});
      const soundField = (fields.find((elem) => elem.name.includes('sound')) || {});

      const form = {
        [csrfTokenField.name]: csrfTokenField.value,
        [soundField.name]: url
      };

      return {
        form,
        token: csrfTokenField.value
      };
    })
    .then(({form, token}) => got.post(`${downloadServiceUrl}/download-sound-track`, {
      body: form,
      headers: {
        Origins: downloadServiceUrl,
        Referer: `${downloadServiceUrl}/`,
        Cookie: `csrftoken=${token}`
      },
      form: true
    }))
    .then((response) => {
      const $ = cheerio.load(response.body);

      const link = $('a[href^="https"][download]');

      if (link.length === 0) {
        throw new Error(`Link element not found!`);
      }

      return link.attr('href');
    });

module.exports = getMp3Url;