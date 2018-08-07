const express = require('express');
const multipart = require('connect-multiparty');

const feed = require('./feed');

const app = express();

app.get('/feed', (req, res) => {
  res.end(feed.xml({indent: true}));
});

app.post('/feed', multipart(), (req, res) => {
  feed.item({
    title: req.body.title,
    description: req.body.description,
    url: req.body.url,
    date: new Date
  });
  res.end('OK!');
});

app.get('/', (req, res) => {
  res.send(`
    <form method="POST" action="/feed" enctype="multipart/form-data">
      <label>
        Title: <input type="text" name="title" required />
      </label>
      <br />
      <label>
        Description:<br />
        <textarea cols="120" rows="10" name="description" required></textarea>
      </label>
      <br />
      <label>
        URL: <input type="text" name="url" required />
      </label>
      <br />
      <button>Add</button>
    </form>
  `)
});

app.listen(8881);