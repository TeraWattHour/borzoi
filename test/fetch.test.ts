import { borzoi, borzoiConfig } from '../src/index';

test('fetches data from url', async () => {
  const { data, ok } = await borzoi({
    url: 'https://jsonplaceholder.typicode.com/todos/1',
  });

  expect(data).not.toBeNull();
  expect(ok).toBeTruthy();
});

test('can refetch request', async () => {
  const { data, ok, refetch } = await borzoi({
    url: 'https://jsonplaceholder.typicode.com/todos/2',
  });

  let d = data;
  expect(data).not.toBeNull();
  expect(ok).toBeTruthy();

  const { ok: ok2, data: data2 } = await refetch();

  expect(ok2).toBeTruthy();
  expect(data2).toEqual(d);
});

test('makes requests including global config', async () => {
  borzoiConfig({
    baseUrl: 'https://jsonplaceholder.typicode.com',
  });

  const { data, ok } = await borzoi({
    url: '/todos/1',
  });

  expect(data).not.toBeNull();
  expect(ok).toBeTruthy();
});

test('encodes json data', async () => {
  const { data, ok } = await borzoi({
    url: '/posts',
    method: 'post',
    body: {
      title: 'foo',
      body: 'bar',
      userId: 2,
    },
  });

  expect(ok).toBeTruthy();
  expect(data).not.toBeNull();
});
