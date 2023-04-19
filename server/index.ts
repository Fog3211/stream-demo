import express from 'express';
import { createStream } from './stream';
import fs from 'node:fs';
import path from 'node:path';

const app = express();

app.get('/stream', (req, res) => {
  return createStream(res);
});

app.get('/file', (req, res) => {
  const filePath = path.join(__dirname, './article.txt');
  const content = fs.readFileSync(filePath, 'utf-8');

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  let i = 0;
  function type() {
    if (i < content.length) {
      res.write(`${content[i++]}`);
      setTimeout(type, 30); // 设置30ms的延迟
    } else {
      res.end();
    }
  }

  type();
});

const port = 3006;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

