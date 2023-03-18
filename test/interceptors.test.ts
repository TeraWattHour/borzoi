import { test, expect } from 'vitest';
import borzoi, { borzoiInterceptors } from '../src';

test('intercepts requests', async () => {
    borzoiInterceptors.response = [
        (response) => {
            if (response.url?.startsWith('https://jsonplaceholder.typicode.com/posts?intercept=true')) {
                response.data = 'oh yeah';
            }
            return response;
        },
    ];

    borzoiInterceptors.request = [
        async (url, options) => {
            if (url === 'intercept me') {
                url = 'https://jsonplaceholder.typicode.com/posts?intercept=true';
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
        },
    ];

    const { data } = await borzoi('intercept me');

    expect(data).toStrictEqual('oh yeah');
});
