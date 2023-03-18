import { test, expect } from 'vitest';
import borzoi, { borzoiConfig } from '../src';

test('sets and uses global config values', async () => {
    borzoiConfig.baseUrl = 'https://placekitten.com';

    const { url } = await borzoi('/300/300');

    expect(url).toBe('https://placekitten.com/300/300');
});
