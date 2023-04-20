import fs from 'node:fs';
import path from 'node:path';
import EventEmitter from 'events';

export const generateFileData = () => {
  const filePath = path.join(__dirname, './article.txt');
  const content = fs.readFileSync(filePath, 'utf-8');
  const emitter = new EventEmitter();
  let i = 0;

  function type() {
    if (i < content.length) {
      emitter.emit('data', `${content[i++]}`);
      setTimeout(type, 20);
    } else {
      emitter.emit('end');
    }
  }

  process.nextTick(type);

  return emitter;
};
