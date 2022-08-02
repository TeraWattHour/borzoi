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
  const { ok } = await borzoi('http://localhost:8000/return-headers', {
    method: 'get',
    credentials: 'include',
    headers: {
      cookie: 'xyz',
    },
  });

  expect(ok).toBeTruthy();
});
