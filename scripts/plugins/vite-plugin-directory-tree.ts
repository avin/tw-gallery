import { readdirSync, statSync } from 'fs';
import { join, resolve, sep } from 'path';
import { Plugin } from 'vite';

interface DirectoryTree {
  [key: string]: string | DirectoryTree;
}

function directoryTree(rootPath: string): DirectoryTree {
  const getTree = (path: string): DirectoryTree => {
    const result: DirectoryTree = {};
    readdirSync(path).forEach((name) => {
      const filePath = join(path, name);
      const isDirectory = statSync(filePath).isDirectory();
      if (isDirectory) {
        result[name] = getTree(filePath);
      } else {
        const cleanFilePath = filePath
          .replace(join(process.cwd(), 'public', 'assets', 'components'), '')
          .replaceAll(sep, '/');
        result[name] = cleanFilePath;
      }
    });
    return result;
  };
  return getTree(rootPath);
}

export default function vitePluginDirectoryTree(): Plugin {
  return {
    name: 'vite-plugin-directory-tree',
    resolveId(source) {
      if (source === 'virtual:directory-tree') {
        return source;
      }
      return null;
    },
    load(id) {
      if (id === 'virtual:directory-tree') {
        const tree = directoryTree(resolve(process.cwd(), './public/assets/components'));
        const code = `export default ${JSON.stringify(tree)};`;
        return code;
      }
      return null;
    },
  };
}
