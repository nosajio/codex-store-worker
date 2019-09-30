import { githubPosts } from './posts/main';

const githubRepoURI = 'https://api.github.com/repos/nosajio/writing/contents';

export async function handleRequest(request: Request): Promise<Response> {
  try {
    console.log('Fetching posts from github [%s]...', githubRepoURI);
    const posts = await githubPosts(githubRepoURI);
    const response = new Response(
      `${posts.length} posts successfully processed and stored`,
      {
        status: 200,
      },
    );
    return response;
  } catch (err) {
    console.error(err);
    return new Response('There was an error fetching and storing posts', {
      status: 500,
    });
  }
}
