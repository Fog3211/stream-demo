import fs from 'node:fs';
import path from 'node:path';
import { Response } from 'node-fetch';

export const requestOpenai = () => {
  const filePath = path.join(__dirname, './article.txt');
  const stream = fs.createReadStream(filePath, { encoding: 'utf-8' });

  return new Promise((resolve, reject) => {
    stream.on('open', () => {
      console.log('111')
      resolve(new Response(stream as any));
    });

    stream.on('error', (err) => {
      reject(err);
    });
  });
};
