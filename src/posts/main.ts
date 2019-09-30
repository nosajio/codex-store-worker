import { getPostContentFromGitHub, listPostsFromGithub } from './fetch';
import { parseFilename, sortPosts } from './util';

export interface PostFile {
  filename: string;
  contentURI: string;
  body: string;
  slug: string;
  date: Date;
}

export async function githubPosts(
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
