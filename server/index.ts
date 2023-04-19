import express from 'express';
import { createStream } from './stream';
import fs from 'node:fs';
import path from 'node:path';

const app = express();

app.get('/stream', (req, res) => {
  return createStream(res);
});

const port = 3006;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
