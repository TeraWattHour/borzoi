import 'isomorphic-fetch';
import borzoi, { borzoiInterceptors } from '../src';

test('intercepts responses', async () => {
    borzoiInterceptors.response = [
        (response) => {
            if (response.url === 'https://placekitten.com/') {
                response.data = 'oh yeah';
            }

            return response;
        },
    ];

    const { data } = await borzoi('https://placekitten.com');

    expect(data).toBe('oh yeah');
});

test('intercepts request', async () => {
    borzoiInterceptors.request = [
        (url, options) => {
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
        },
    ];

    const { data } = await borzoi('https://jsonplaceholder.typicode.com/posts');

    expect(data).toStrictEqual({
        id: 101,
        title: 'foo',
        body: 'bar',
        userId: 1,
    });
});
