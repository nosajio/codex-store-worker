import { githubPosts } from './posts/main';
import { clearStore, bulkSaveToStore } from './posts/store';

const githubRepoURI = 'https://api.github.com/repos/nosajio/writing/contents';

export async function handleRequest(event: FetchEvent): Promise<Response> {
  try {
    console.log('Fetching posts from github [%s]...', githubRepoURI);

    // Fetch and prepare raw posts
    const posts = await githubPosts(githubRepoURI);

    // Save posts to k/v store

    // Make sure store is empty and ready to accept fresh data
    await clearStore(codex_store);
    // Save the full PostFile objects into the store, indexed by slug.
    // Indexing with the slug will allow requests to quickly access posts from
    // the URL, removing the need for filtering
    await bulkSaveToStore(
      codex_store,
      posts.map(p => [p.slug, JSON.stringify(p)]),
    );

    // Respond with 200 (success)
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
