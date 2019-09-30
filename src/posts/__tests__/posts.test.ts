import { githubPosts, PostFile } from '../main';

const githubURI = 'https://api.github.com/repos/nosajio/writing/contents';

describe('githubPosts', () => {
  let posts: PostFile[];
  beforeAll(async () => {
    posts = await githubPosts(githubURI);
  });

  test('returns a array of PostFile objects', () => {
    const keys = Object.keys(posts[0]);
    expect(keys).toEqual(
      expect.arrayContaining([
        'body',
        'contentURI',
        'filename',
        'date',
        'slug',
      ]),
    );
  });

  test('returned posts have content', () => {
    expect(posts.every(p => Boolean(p.body) && p.body.length > 0)).toBeTruthy();
  });

  test('returned posts have filenames', () => {
    expect(
      posts.every(p => Boolean(p.filename) && p.filename.length > 0),
    ).toBeTruthy();
  });

  test('returned posts should contain dates', () => {
    expect(posts.every(p => Boolean(p.date) && p.date instanceof Date));
  });

  test('should sort posts descending by date', () => {
    expect(
      posts.every((p, i) => (i === 0 ? true : p.date < posts[i - 1].date)),
    ).toBeTruthy();
  });
});
