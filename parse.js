const cheerio = require('cheerio');
const got = require('got');

module.exports = (index) => got(`https://t.me/errioxa/${index}?embed=1`)
  .then((response) => {
    const $ = cheerio.load(response.body);

    const errorElement = $('.tgme_widget_message_error');

    if (errorElement.length === 1) {
      throw new Error(errorElement.text());
    }

    const widget = $('.tgme_widget_message_bubble');

    const messageElement = $('.tgme_widget_message_text', widget);
    $('a', messageElement).remove();
    const url = $('.tgme_widget_message_link_preview', widget).attr('href');

    return {
      description: messageElement.text(),
      index,
      url
    };
  })
  .catch((err) => ({
    error: err.message,
    index
  }));