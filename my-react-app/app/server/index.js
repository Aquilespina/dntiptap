import express from 'express';
import { renderToString } from 'react-dom/server';
import App from '../src/App';
import React from 'react';

const app = express();

app.use(express.static('build'));

app.get('*', (req, res) => {
  const html = renderToString(<App />);
  res.send(`
    <!DOCTYPE html>
    <html>
      <head><title>SSR App</title></head>
      <body>
        <div id="root">${html}</div>
        <script src="/main.js"></script>
      </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});
