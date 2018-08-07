const RSS = require('rss');

const feed = new RSS({
  title: 'Errioxa recommends',
  description: 'Канал с красивой электронной музыкой. Подборки миксов, диджей-сетов, рассказы о музыкантах, фестивалях, вечеринках и событиях из жизни. #errioxarecommends #deep #vocal #melodic #burningman #lazysundays #festival #video Обратная связь: @katerina_errioxa',
  feed_url: 'errioxa.now.sh/feed',
  site_url: 'https://t.me/errioxa'
});

module.exports = feed;