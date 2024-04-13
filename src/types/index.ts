export interface DirectoryTree {
  [key: string]: string | DirectoryTree;
}