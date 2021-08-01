// we will use supertest to test HTTP requests/responses
const request = require("supertest");
// we also need our app for the correct routes!
const app = require("../app");
const user = require(('../services/user'));
var cookieParser = require('cookie-parser');
let cookie;

describe("Unit Tests of Components",  () => {
  test('Validate User Succeed', () => {
    if (user.validateUser('username','password')) {
        console.log("Login worked")
    } else {
        throw new Error('Failed to login OK');
    }
  }),

test('Validate User Fail', () => {
    if (!user.validateUser('username','badpassword')) {
        console.log("login failed as expected")
    } else {
        throw new Error('Should Not have Validated');
    }
  })
})

describe("Use Case Testing", () => {
  test("Failed Authenticate no username password match", async () => {
    const response = await request(app).get("/authenticate")
    .query({ username: 'username', password: 'password1' })
    expect(response.statusCode).toBe(400);
  }),

  test("Failed Authenticate invalid username", async () => {
    const response = await request(app).get("/authenticate")
    .query({ username: 'badusername', password: 'password1' })
    expect(response.statusCode).toBe(400);
  }),

  test("Happy Path: Authenticate and get Welcome", async () => {
    const response = await request(app).get("/authenticate")
    .query({
      username: 'username',
      password: 'password',
    })
    .expect(200)
    .then((response) => {
      const cookies = response.headers['set-cookie'][0].split(',').map(item => item.split(';')[0]);
      cookie = cookies.join(';');
      })
    const welcomeResponse = await request(app).get("/welcome")
    .set('Cookie', cookie)
    .send()
    .expect(200)
  }),

  test("Fail Authenticate and then go to Welcome Page - Denied Access", async () => {
    const response = await request(app).get("/authenticate")
    .query({
      username: 'test',
      password: 'password1',
    })
    .expect(400)
    .then((response) => {
      const cookies = response.headers['set-cookie'][0].split(',').map(item => item.split(';')[0]);
      cookie = cookies.join(';');
      })
    const welcomeResponse = await request(app).get("/welcome")
    .set('Cookie', cookie)
    .send()
    .expect(400)
  }),

  test("Successful Authenticate and expire tokens then Welcome Page - Denied Access", async () => {
    const response = await request(app).get("/authenticate")
    .query({
      username: 'username',
      password: 'password',
    })
    .expect(200)
    .then((response) => {
      const cookies = response.headers['set-cookie'][0].split(',').map(item => item.split(';')[0]);
      cookie = cookies.join(';');
      })
    const clearResponse = await request(app).get("/cleartokens")
    .set('Cookie', cookie)
    .expect(200)
    const welcomeResponse = await request(app).get("/welcome")
    .set('Cookie', cookie)
    .send()
    .expect(400)
  });
});
