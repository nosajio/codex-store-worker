import axios from 'axios';

export interface PostFile {
  filename: string;
  contentURI: string;
  body: string;
  slug: string;
  date: Date;
}

const FILENAME_PTN = /([a-z0-9-]*)-(\d{4}-\d{2}-\d{2})?.md/;

export async function fetchPostsFromGitHub(
  repoURI: string,
): Promise<PostFile[]> {
  const viablePosts = await listPostsFromGithub(repoURI);
  const parsedFilenames = viablePosts
    .map(p => [...p, ...parseFilename(p[1])])
    .filter(p => p.every(Boolean));
  const postContents = await Promise.all(
    parsedFilenames.map(([contentURI, filename, slug, date]) =>
      getPostContentFromGitHub(String(contentURI)).then(body => ({
        body: body as string,
        contentURI: contentURI as string,
        filename: filename as string,
        slug: slug as string,
        date: new Date(date as string),
      })),
    ),
  );
  const sortedPosts = sortPosts(postContents);
  return sortedPosts;
}

export async function getPostContentFromGitHub(
  contentURI: string,
): Promise<string> {
  const res = await axios.get(contentURI);
  const postBase64 = res.data.content;
  const postText = base64Decode(postBase64);
  return postText;
}

function base64Decode(str: string): string {
  const buf = Buffer.from(str, 'base64');
  const text = buf.toString('ascii');
  return text;
}

// Parses a filename and returns a slug and a date
function parseFilename(filename: string): [string, string] | null[] {
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

async function listPostsFromGithub(repoURI: string): Promise<string[][]> {
  try {
    const res = await axios.get<GitHubContentResponse[]>(repoURI);
    const valid = res.data.filter(p => isFilenamePost(p.name));
    if (valid.length === 0) {
      return [];
    }
    return valid.map(p => [p.url, p.name]);
  } catch (err) {
    console.error(err.response.data.message || err.response.data);
    return [];
  }
}

function isFilenamePost(filename: string): boolean {
  if (!filename) {
    throw new TypeError('Filename is required');
  }
  return FILENAME_PTN.test(filename);
}

function sortPosts(posts: PostFile[]): PostFile[] {
  return posts.sort((a, b) => b.date.getTime() - a.date.getTime());
}
