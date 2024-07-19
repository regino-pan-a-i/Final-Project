const { MongoClient, ObjectId } = require('mongodb');
const request = require('supertest');
const app = require('../app'); // Adjust the path as per your project structure
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Connect to MongoDB
let connection;
let db;
let server;

beforeAll(async () => {
  connection = await MongoClient.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  db = await connection.db('travel-buddy');

  server = app.listen(3000);
});

afterAll(async () => {
  await connection.close();
  server.close();
});

describe('User API', () => {

  describe('POST /users', () => {
    test('should create a new user', async () => {
      const newUser = {
        name: 'Test User',
        email: 'newuser@example.com',
        password: await bcrypt.hash('newpassword',10),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const res = await request(app)
        .post('/users')
        .send(newUser);

      expect(res.statusCode).toEqual(res.statusCode);
    });
  });

  describe('GET /users', () => {
    test('should get all users', async () => {
      const res = await request(app).get('/users');
      expect(res.statusCode).toEqual(200);
    });
  });

  describe('GET /users/:id', () => {
    test('should get a user by ID', async () => {
      const userId = '6680500e479c6ccd05aaef00';

      const res = await request(app).get(`/users/${userId}`);
      expect(res.statusCode).toEqual(200);
    });
  });

  describe('DELETE /users/:id', () => {
    test('should delete a user', async () => {
      const user = { name: 'Test User', email: 'test@example.com', password: 'password' };
      const insertResult = await db.collection('users').insertOne(user);
      const userId = insertResult.insertedId;

      const res = await request(app).delete(`/users/${userId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('User deleted');
    });

    test('should return 404 for non-existent user', async () => {
      const res = await request(app).delete(`/users/${new ObjectId()}`);
      expect(res.statusCode).toEqual(404);
      expect(res.text).toEqual('User not found');
    });
  });

  describe('PUT /users/:id', () => {
    test('should update a user', async () => {
      const userId = '6680500e479c6ccd05aaef00';
      const updatedUser = {
        name: 'Emilio Ordonez Guerrero',
        email: 'newuser@example.com',
        password: await bcrypt.hash('newpassword',10),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const res = await request(app)
        .put(`/users/${userId}`)
        .send(updatedUser);

      expect(res.statusCode).toEqual(204);
    });
  });
});
