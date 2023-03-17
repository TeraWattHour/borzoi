import { test, expect } from 'vitest';
import 'isomorphic-fetch';
import borzoi, { borzoiConfig } from '../src/index';

test('makes requests including global config', async () => {
    borzoiConfig.baseUrl = 'https://jsonplaceholder.typicode.com';
    borzoiConfig.credentials = 'include';
    borzoiConfig.headers = {
        string: 'global',
    };
    borzoiConfig.cache = 'no-cache';
    borzoiConfig.next = {
        revalidate: 20,
    };

    const { data, ok } = await borzoi('/todos/1', {
        headers: {
            string: 'local',
        },
        cache: 'force-cache',
        next: {
            revalidate: 10,
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
    const { url } = await borzoi('https://jsonplaceholder.typicode.com/todos/1', {
        query: {
            query: 'query',
            q: 1,
        },
    });

    expect(url).toEqual('https://jsonplaceholder.typicode.com/todos/1?query=query&q=1');
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
        headers: null,
        body: {
            title: 'foo',
            body: 'bar',
            userId: 2,
        },
    });

    expect(ok).toBeTruthy();
    expect(data).not.toBeNull();
});

interface OkData {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
}

interface ErrData {
    message: string;
}

test('typescript big boy', async () => {
    const { data, ok } = await borzoi<OkData, ErrData>('https://jsonplaceholder.typicode.com/todos/2');

    if (ok) {
        console.log(data.completed);
        expect(data.completed).toBeDefined();
    }
    if (!ok) {
        // if `ok` is false data also may be null because it is unknown if request even got to the server
        console.log(data?.message);
        expect(ok).toBeFalsy();
    }
});
