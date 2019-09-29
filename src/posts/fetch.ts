import axios from 'axios'

export interface PostFile {
  filename: string
  contentURI: string
  body: string
}

const FILENAME_PTN = /([a-z0-9-]*)-(\d{4}-\d{2}-\d{2})?.md/g

export async function fetchPostsFromGitHub(
  repoURI: string,
): Promise<PostFile[]> {
  const viablePosts = await listPostsFromGithub(repoURI)
  const postContents = await Promise.all(
    viablePosts.map(([contentURI, filename]) =>
      getPostContentFromGitHub(contentURI).then(body => ({
        body,
        contentURI,
        filename,
      })),
    ),
  );
  return postContents;
}

export async function getPostContentFromGitHub(
  contentURI: string,
): Promise<string> {
  const res = await axios.get(contentURI)
  const postBase64 = res.data.content;
  const postText = base64Decode(postBase64)
  return postText
}

function base64Decode(str: string): string {
  const buf = new Buffer(str, 'base64')
  const text = buf.toString('ascii')
  return text
}

async function listPostsFromGithub(repoURI: string): Promise<string[][]> {
  const res = await axios.get<GitHubContentResponse[]>(repoURI)
  const valid = res.data.filter(p => isFilenamePost(p.name))
  if (valid.length === 0) {
    return []
  }
  return valid.map(p => [p.url, p.name])
}

function isFilenamePost(filename: string): boolean {
  if (!filename) {
    throw new TypeError('Filename is required')
  }
  return FILENAME_PTN.test(filename)
}
