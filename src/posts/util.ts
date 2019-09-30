import { PostFile } from './main';

export const FILENAME_PTN = /([a-z0-9-]*)-(\d{4}-\d{2}-\d{2})?.md/;

export function base64Decode(str: string): string {
  const buf = Buffer.from(str, 'base64');
  const text = buf.toString('ascii');
  return text;
}

export function isFilenamePost(filename: string): boolean {
  if (!filename) {
    throw new TypeError('Filename is required');
  }
  return FILENAME_PTN.test(filename);
}

// Parses a filename and returns a slug and a date
export function parseFilename(filename: string): [string, string] | null[] {
  if (!filename || !isFilenamePost(filename)) {
    throw new TypeError(
      `Filename is not a valid post file: ${String(filename)}`,
    );
  }
  const captures = FILENAME_PTN.exec(filename);
  if (!captures) {
    console.error('Cannot capture %s', filename);
    return [null, null];
  }
  const [_, slug, date] = captures;
  return [slug, date];
}

export function sortPosts(posts: PostFile[]): PostFile[] {
  return posts.sort((a, b) => b.date.getTime() - a.date.getTime());
}
