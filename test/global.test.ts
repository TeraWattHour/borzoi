import 'isomorphic-fetch';
import borzoi, { borzoiConfig } from '../src';

test('sets and uses global config values', async () => {
    borzoiConfig.baseUrl = 'https://placekitten.com';

    const { url } = await borzoi('/300/300', {
        headers: {
            local: 'from request',
        },
    });

    expect(url).toBe('https://placekitten.com/300/300');
});
