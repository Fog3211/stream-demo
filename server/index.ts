import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import { createStream } from './stream';

const app = express();

app.get('/stream', (req, res) => {
  const filePath = path.join(__dirname, 'article.txt');
  const content = fs.readFileSync(filePath, { encoding: 'utf-8' });

  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  return createStream(res);
});

const port = 3005;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
