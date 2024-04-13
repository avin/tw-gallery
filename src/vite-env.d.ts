/// <reference types="vite/client" />

declare module 'virtual:directory-tree' {
  interface DirectoryTree {
    [key: string]: string | DirectoryTree;
  }

  const directoryTree: DirectoryTree;
  export default directoryTree;
}