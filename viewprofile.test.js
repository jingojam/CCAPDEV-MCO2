const request = require('supertest');
const app = require('./app');

describe('Sign In and View Profile Page Render Test', () => {
  const agent = request.agent(app);

  it('should sign in and view the profile page using URL query parameters', async () => {
    // Sign in
    const signInRes = await agent
      .post('/sign_in')
      .type('form')
      .send({
        DLSUemail: 'juan.menchaca@dlsu.edu.ph',
        password: 'password123'
      });

    expect(signInRes.statusCode).toBe(302);
    expect(signInRes.headers.location).toMatch(/^\/home\?userId=.*&baseId=.*/);

    // Extract IDs from redirect URL
    const redirectUrl = new URL('http://localhost' + signInRes.headers.location);
    const userId = redirectUrl.searchParams.get('userId');
    const baseId = redirectUrl.searchParams.get('baseId');

    expect(userId).toBeTruthy();
    expect(baseId).toBeTruthy();

    // Visit profile using extracted IDs
    const profileRes = await agent.get(`/prof_info?userId=${userId}&baseId=${baseId}`);
    expect(profileRes.statusCode).toBe(200);

    // Check page content
    expect(profileRes.text).toContain('< Return to Home');
    expect(profileRes.text).toContain('Juan Menchaca');
    expect(profileRes.text).toContain('Current Reservations');
  });
});
