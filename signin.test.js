const request = require('supertest');
const app = require('./app');

describe('Sign-in an Account', () => {
  beforeAll(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  it('user redirected to Home', async () => {
    const res = await request(app)
      .post('/sign_in')
      .type('form')
      .send({
        DLSUemail: 'juan.menchaca@dlsu.edu.ph',
        password: 'password123'
      })
      .redirects(1); //maximum redirect counter

    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('<title>Home Page');
  });
});
