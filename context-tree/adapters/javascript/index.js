import { parse } from 'esprima';
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
if (args.length === 0) {
  throw new Error('No root file path provided');
}

const rootPath = args[0];

function buildModuleTree(filePath) {
  if (!fs.existsSync(filePath) || !fs.lstatSync(filePath).isFile()) {
    return null;
  }

  const contents = fs.readFileSync(filePath, 'utf-8');
  const ast = parse(contents, { sourceType: 'module' });

  const directory = path.parse(filePath).dir;

  const imports = ast.body
    .filter(stmt => stmt.type === 'ImportDeclaration')
    .map(stmt => path.join(directory, stmt.source.value));

  return {
    path: filePath,
    children: imports
      .map(buildModuleTree)
      .filter(tree => tree !== null)
  };
}

const moduleTree = buildModuleTree(rootPath);

console.log(moduleTree);
