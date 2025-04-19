import { parse } from 'esprima';
import fs from 'fs';

const args = process.argv.slice(2);
if (args.length === 0) {
  throw new Error('No root file path provided');
}

const rootPath = args[0];
if (!fs.existsSync(rootPath) || !fs.lstatSync(rootPath).isFile()) {
    throw new Error('Invalid file path');
}

const contents = fs.readFileSync(rootPath, 'utf-8');
const ast = parse(contents, { sourceType: 'module' });
console.log(ast);
