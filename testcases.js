import request from 'supertest';        //testing MVC ==> Routers, controllers etc etc
import app from './app';

describe('App basic routes', () => {
  test('GET / should return Welcome.html', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('<!DOCTYPE html>');
  });
});