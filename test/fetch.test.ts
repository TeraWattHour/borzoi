import { borzoi, borzoiConfig } from '../src/index';

test('makes requests including global config', async () => {
  borzoiConfig({
    baseUrl: 'https://jsonplaceholder.typicode.com',
    credentials: 'include',
    headers: {
      string: 'global',
    },
  });

  const { data, ok } = await borzoi('/todos/1', {
    headers: {
      string: 'local',
    },
  });

  expect(data).not.toBeNull();
  expect(ok).toBeTruthy();
});

test('fetches data from url', async () => {
  const { data, ok } = await borzoi('https://jsonplaceholder.typicode.com/todos/1');

  expect(data).not.toBeNull();
  expect(ok).toBeTruthy();
});

test('sets query params', async () => {
  const { info } = await borzoi('https://jsonplaceholder.typicode.com/todos/1', {
    query: {
      query: 'query',
      q: 1,
    },
  });

  expect(info.url).toEqual('https://jsonplaceholder.typicode.com/todos/1?query=query&q=1');
});

test('can refetch request', async () => {
  const { data, ok, refetch } = await borzoi('https://jsonplaceholder.typicode.com/todos/2');

  let d = data;
  expect(data).not.toBeNull();
  expect(ok).toBeTruthy();

  const { ok: ok2, data: data2 } = await refetch();

  expect(ok2).toBeTruthy();
  expect(data2).toEqual(d);
});

test('encodes json data', async () => {
  const { data, ok } = await borzoi('/posts', {
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

test('sets headers', async () => {
  const { ok, data } = await borzoi('http://localhost:8000/headers', {
    method: 'get',
    credentials: 'include',
    headers: {
      cookie: 'xyz',
      nullHeader: undefined,
      undefinedHeader: null,
      numericHeader: 1,
    },
  });

  expect(data).toBe({
    cookie: 'xyz',
  });
  expect(ok).toBeTruthy();
});
