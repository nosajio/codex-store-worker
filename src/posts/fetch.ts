import { base64Decode, isFilenamePost } from './util';

async function getJSON<T = any>(url: string, headers?: string[][]): Promise<T> {
  try {
    const fetchInit = {
      headers,
    };
    const f = await fetch(url, fetchInit).catch(err => console.error(err));
    if (!f) {
      throw new Error('Request error');
    }
    return f.json();
  } catch (err) {
    throw err;
  }
}

export async function getPostContentFromGitHub(
  contentURI: string,
): Promise<string> {
  try {
    const res = await getJSON(contentURI, [['User-Agent', 'codex']]);
    const postBase64 = res.content;
    const postText = base64Decode(postBase64);
    return postText;
  } catch (err) {
    console.error('Error getting posts content');
    console.error(err);
    return '';
  }
}

export async function listPostsFromGithub(
  repoURI: string,
): Promise<string[][]> {
  try {
    const res = await getJSON<GitHubContentResponse[]>(repoURI, [
      ['User-Agent', 'codex'],
    ]);
    const valid = res.filter(p => isFilenamePost(p.name));
    if (valid.length === 0) {
      return [];
    }
    return valid.map(p => [p.url, p.name]);
  } catch (err) {
    console.error('Error listing posts');
    console.error(err);
    return [];
  }
}
