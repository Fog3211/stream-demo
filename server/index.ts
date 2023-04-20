import express from 'express';
import { createStream } from './stream';
import { generateFileData } from './mock';

const app = express();

app.get('/file-stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream;charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive'
  });

  const eventEmitter = generateFileData();

  eventEmitter.on('data', (data) => {
    res.write(data);
  });

  eventEmitter.on('end', () => {
    res.end();
  });
});

app.get('/chat-stream', (req, res) => {
  return createStream(res);
});

const port = 3006;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

