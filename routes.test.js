const request = require('supertest');
const app = require('./app'); // adjust path if needed
const agent = request.agent(app); // use agent to persist session

describe('Route Tests', () => {
  // Simulate login before accessing protected routes
  beforeAll(async () => {
    await agent
      .post('/sign_in')
      .type('form')
      .send({
        DLSUemail: 'juan.menchaca@dlsu.edu.ph',
        password: 'password123'
      });
  });

  // Public route
  it('GET / should return Welcome.html', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('<title>Welcome'); // adjust to real title
  });

  it('GET /logout should redirect to /sign_in', async () => {
    const res = await agent.get('/logout');
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('/sign_in');
  });

  // Auth
  it('GET /sign_in should return sign in page', async () => {
    const res = await request(app).get('/sign_in');
    expect(res.statusCode).toBe(200);
  });

  it('GET /sign_up should return sign up page', async () => {
    const res = await request(app).get('/sign_up');
    expect(res.statusCode).toBe(200);
  });

  // Authenticated routes
  it('GET /home should return home page', async () => {
    const res = await agent.get('/home?userId=USERID&baseId=USERID');
    expect(res.statusCode).toBe(200);
  });

  it('GET /create should render creation page', async () => {
    const res = await agent.get('/create?userId=USERID&baseId=USERID');
    expect(res.statusCode).toBe(200);
  });

  it('GET /laboratory/:id should render lab details', async () => {
    const res = await agent.get('/laboratory/LABID?userId=USERID&baseId=USERID');
    expect(res.statusCode).toBe(200);
  });

  it('GET /view should show reservation view', async () => {
    const res = await agent.get('/view?userId=USERID&baseId=USERID');
    expect(res.statusCode).toBe(200);
  });

  it('GET /res_edit should render reservation edit', async () => {
    const res = await agent.get('/res_edit?resId=RESID&userId=USERID&baseId=USERID');
    expect(res.statusCode).toBe(200);
  });

  it('GET /res_info should render reservation info', async () => {
    const res = await agent.get('/res_info?resId=RESID&userId=USERID&baseId=USERID');
    expect(res.statusCode).toBe(200);
  });

  it('GET /prof_info should render profile info', async () => {
    const res = await agent.get('/prof_info?userId=USERID&baseId=USERID');
    expect(res.statusCode).toBe(200);
  });

  it('GET /prof_edit should render profile edit', async () => {
    const res = await agent.get('/prof_edit?userId=USERID&baseId=USERID');
    expect(res.statusCode).toBe(200);
  });

  it('GET /index should render index dashboard', async () => {
    const res = await agent.get('/index');
    expect(res.statusCode).toBe(200);
  });

  it('GET /user/:id/image returns image or alert', async () => {
    const res = await agent.get('/user/USERID/image');
    expect(res.statusCode).toBe(200);
  });

  it('POST /api/reservations should handle reservation logic', async () => {
    const res = await agent.post('/api/reservations').send({
      seat: 5,
      lab_sched: '2025-08-04',
      startTime: '09:00',
      endTime: '10:00',
      userId: 'USERID'
    });

    // Expect either 200 or 400 depending on your logic
    expect([200, 400]).toContain(res.statusCode);
  });
});
