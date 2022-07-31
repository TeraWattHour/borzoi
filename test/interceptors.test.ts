import { addBorzoiRequestInterceptor, addBorzoiResponseInterceptor, borzoi } from '../src/index';

test('intercepts responses', async () => {
  addBorzoiResponseInterceptor(response => {
    if (response.info.url === 'https://placekitten.com/') {
      response.data = 'oh yeah';
    }

    return response;
  });

  const { data } = await borzoi('https://placekitten.com');

  expect(data).toBe('oh yeah');
});

test('intercepts request', async () => {
  addBorzoiRequestInterceptor((url, options) => {
    if (url === 'https://jsonplaceholder.typicode.com/posts') {
      options = {
        method: 'post',
        body: {
          title: 'foo',
          body: 'bar',
          userId: 1,
        },
      };
    }

    return [url, options];
  });

  const { data } = await borzoi('https://jsonplaceholder.typicode.com/posts');

  expect(data).toStrictEqual({
    id: 101,
    title: 'foo',
    body: 'bar',
    userId: 1,
  });
});
