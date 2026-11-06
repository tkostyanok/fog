const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { createApp } = require('../src/app');

const app = createApp();

test('GET /health returns service status', async () => {
  const response = await request(app).get('/health');

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.status, 'ok');
  assert.equal(response.body.service, 'fog-server');
  assert.equal(typeof response.body.ts, 'string');
});

test('GET /health returns JSON content type', async () => {
  const response = await request(app).get('/health');

  assert.match(response.headers['content-type'], /application\/json/);
});

test('GET / returns server message', async () => {
  const response = await request(app).get('/');

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.message, 'FOG server is running');
});

test('GET / returns JSON content type', async () => {
  const response = await request(app).get('/');

  assert.match(response.headers['content-type'], /application\/json/);
});

test('GET unknown route returns 404 json', async () => {
  const response = await request(app).get('/not-found');

  assert.equal(response.statusCode, 404);
  assert.equal(response.body.error, 'Unknown endpoint');
  assert.match(response.headers['content-type'], /application\/json/);
});

test('CORS allows localhost:5173 origin', async () => {
  const response = await request(app)
    .get('/health')
    .set('Origin', 'http://localhost:5173');

  assert.equal(response.statusCode, 200);
  assert.equal(response.headers['access-control-allow-origin'], 'http://localhost:5173');
});

test('CORS blocks untrusted origin with 403 json', async () => {
  const response = await request(app)
    .get('/health')
    .set('Origin', 'http://malicious.example');

  assert.equal(response.statusCode, 403);
  assert.equal(response.body.error, 'Not allowed by CORS');
  assert.match(response.headers['content-type'], /application\/json/);
});
