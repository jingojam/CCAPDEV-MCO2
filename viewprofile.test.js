const request = require('supertest');
const app = require('./app');

describe('Sign In and View Profile Page Render Test', () => {
  const agent = request.agent(app);
  const userId = '688fb894d68a51daf589936a';
  const baseId = '688fb894d68a51daf589936a';

  it('should sign in and view the profile page', async () => {
    // Sign in user
    const signInRes = await agent
      .post('/sign_in')
      .type('form')
      .send({
        DLSUemail: 'juan.menchaca@dlsu.edu.ph',
        password: 'password123'
      });

    expect(signInRes.statusCode).toBe(302); // Should redirect

    // Go to profile page directly
    const profileRes = await agent.get(`/prof_info?userId=${userId}&baseId=${baseId}`);

    expect(profileRes.statusCode).toBe(200);

    // Check for expected text (adjust these strings as needed)
    expect(profileRes.text).toContain('< Return to Home');
    expect(profileRes.text).toContain('Juan Menchaca');
    expect(profileRes.text).toContain('Current Reservations');
  });
});
