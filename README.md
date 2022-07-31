# Borzoi

## The simpliest data-fetching

Borzoi is a micro Fetch API wrapper that allows you to write less code to achieve better results.

Since Borzoi is currently in pre-alpha, expect changes that may completely change how the library functions.
<br>
<br>

## Features

- [x] Full Typescript documentation
- [x] Auto JSON, URLSearchParams, FormData transforms
- [x] Auto response body transforms
- [x] Global defaults
- [x] Simple error handling
- [x] Interceptors

<br>
<br>

## Installation

Borzoi works anywhere, where Fetch API is present, or uses `isomorphic-fetch` npm library.

Install Borzoi using the following command:

```sh
npm install borzoi
```

To determine the project's status Borzoi uses the `process.env.NODE_ENV` environment variable.
<br>
<br>

## Docs

- Making a simple request:

```ts
import { borzoi } from 'borzoi';

const { data, ok, internalError } = await borzoi({
  url: 'https://jsonplaceholder.typicode.com/todos/1',
});
// checking for potential errors
if (ok || internalError) {
  return console.error('Oops! There was an error!');
}

// decoded response data, defaults to json decoder
console.log(data);
```

<br>

- Configuring globals:

```ts
import { borzoiConfig } from 'borzoi';

borzoiConfig({
    baseUrl: "https://placekitten.com",
    credentials: "include",
});

(async () => {
   await borzoi({
        ...
    });
})();
```

<br>

- Sending requests with body:

```ts
await borzoi({
  url: 'http://example.com',
  method: 'post',
  body: {
    first_name: 'John',
    last_name: 'Doe',
  },
});
```

In this example Borzoi will stringify the object as JSON and set the according headers. If you don't want Borzoi to do this, just set the `Content-Type` header manually and transform the data yourself.  
<br>

- Decoding recieved data:

```ts
const { data } = await borzoi({
  url: 'http://someurl.com',
  bodyDecoder: 'form-data',
});

// data was decoded as form-data
console.log(data);
```

<br>

- Adding response interceptors:

```ts
import { addBorzoiResponseInterceptor } from 'borzoi';

addBorzoiResponseInterceptor(response => {
  if (response.info.url === 'https://placekitten.com/') {
    response.data = 'oh yeah';
  }

  return response;
});

const { data } = await borzoi('https://placekitten.com');

// prints 'oh yeah'
console.log(data);
```

Interceptors will run according to their registration order. Response interceptors have access to the response object value which they can change. Returned responses are passed to the next interceptors and eventually returned as the request response.

<br>

- Adding request interceptors:

```ts
import { addBorzoiRequestInterceptor } from 'borzoi';

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

/* prints {
 *   id: 101,
 *   title: 'foo',
 *   body: 'bar',
 *   userId: 1
 * }
 */
console.log(data);
```

<br><br>

## License

MIT
