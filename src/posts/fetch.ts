import axios from 'axios';
import { base64Decode, isFilenamePost } from './util';

export async function getPostContentFromGitHub(
  contentURI: string,
): Promise<string> {
  const res = await axios.get(contentURI);
  const postBase64 = res.data.content;
  const postText = base64Decode(postBase64);
  return postText;
}

export async function listPostsFromGithub(
  repoURI: string,
): Promise<string[][]> {
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
