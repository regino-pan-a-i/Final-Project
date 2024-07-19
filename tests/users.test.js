const { MongoClient, ObjectId } = require('mongodb');
const request = require('supertest');
const app = require('../app'); // Adjust the path as per your project structure
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Connect to MongoDB
let connection;
let db;

beforeAll(async () => {
  connection = await MongoClient.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  db = await connection.db('travel-buddy');
});

afterAll(async () => {
  await connection.close();
});

describe('User API', () => {

  describe('POST /users', () => {
    test('should create a new user', async () => {
      const newUser = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'newpassword',
      };

      const res = await request(app)
        .post('/users')
        .send(newUser);

      expect(res.statusCode).toEqual(201);
      expect(res.text).toContain('ID for the new user');
    });

    test('should return 500 if user creation fails', async () => {
      const invalidUser = {
        name: 'Invalid User',
        // Missing email and password
      };

      const res = await request(app)
        .post('/users')
        .send(invalidUser);

      expect(res.statusCode).toEqual(500);
      expect(res.body.status).toEqual('fail');
    });
  });

  describe('GET /users', () => {
    test('should get all users', async () => {
      const res = await request(app).get('/users');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /users/:id', () => {
    test('should get a user by ID', async () => {
      const user = { name: 'Test User', email: 'test@example.com', password: 'password' };
      const insertResult = await db.collection('users').insertOne(user);
      const userId = insertResult.insertedId;

      const res = await request(app).get(`/users/${userId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.name).toEqual(user.name);
      expect(res.body.email).toEqual(user.email);
    });

    test('should return 404 for non-existent user', async () => {
      const res = await request(app).get(`/users/${new ObjectId()}`);
      expect(res.statusCode).toEqual(404);
      expect(res.text).toEqual('User not found');
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

  describe('GET /users/:id/likedTrips', () => {
    test('should get liked trips for a user', async () => {
      const user = { name: 'Test User', email: 'test@example.com', password: 'password' };
      const insertResult = await db.collection('users').insertOne(user);
      const userId = insertResult.insertedId;

      const res = await request(app).get(`/users/${userId}/likedTrips`);
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    test('should return 404 for non-existent user', async () => {
      const res = await request(app).get(`/users/${new ObjectId()}/likedTrips`);
      expect(res.statusCode).toEqual(404);
      expect(res.text).toEqual('User not found');
    });
  });

  describe('DELETE /users/:id/likedTrips/:tripId', () => {
    test('should delete a liked trip for a user', async () => {
      const user = { name: 'Test User', email: 'test@example.com', password: 'password' };
      const insertResult = await db.collection('users').insertOne(user);
      const userId = insertResult.insertedId;
      const tripId = new ObjectId();

      await db.collection('likedTrips').insertOne({ userID: userId, tripID: tripId });

      const res = await request(app).delete(`/users/${userId}/likedTrips/${tripId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Trip deleted');
    });

    test('should return 404 for non-existent user or trip', async () => {
      const res = await request(app).delete(`/users/${new ObjectId()}/likedTrips/${new ObjectId()}`);
      expect(res.statusCode).toEqual(404);
      expect(res.text).toEqual('Liked trip not found');
    });
  });

  describe('GET /users/:id/pastTrips', () => {
    test('should get past trips for a user', async () => {
      const user = { name: 'Test User', email: 'test@example.com', password: 'password' };
      const insertResult = await db.collection('users').insertOne(user);
      const userId = insertResult.insertedId;

      const res = await request(app).get(`/users/${userId}/pastTrips`);
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    test('should return 404 for non-existent user', async () => {
      const res = await request(app).get(`/users/${new ObjectId()}/pastTrips`);
      expect(res.statusCode).toEqual(404);
      expect(res.text).toEqual('User not found');
    });
  });

  describe('DELETE /users/:id/pastTrips/:tripId', () => {
    test('should delete a past trip for a user', async () => {
      const user = { name: 'Test User', email: 'test@example.com', password: 'password' };
      const insertResult = await db.collection('users').insertOne(user);
      const userId = insertResult.insertedId;
      const tripId = new ObjectId();

      await db.collection('pastTrips').insertOne({ userID: userId, tripID: tripId });

      const res = await request(app).delete(`/users/${userId}/pastTrips/${tripId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Trip deleted');
    });

    test('should return 404 for non-existent user or trip', async () => {
      const res = await request(app).delete(`/users/${new ObjectId()}/pastTrips/${new ObjectId()}`);
      expect(res.statusCode).toEqual(404);
      expect(res.text).toEqual('Past trip not found');
    });
  });

  describe('GET /users/:id/futureTrips', () => {
    test('should get future trips for a user', async () => {
      const user = { name: 'Test User', email: 'test@example.com', password: 'password' };
      const insertResult = await db.collection('users').insertOne(user);
      const userId = insertResult.insertedId;

      const res = await request(app).get(`/users/${userId}/futureTrips`);
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    test('should return 404 for non-existent user', async () => {
      const res = await request(app).get(`/users/${new ObjectId()}/futureTrips`);
      expect(res.statusCode).toEqual(404);
      expect(res.text).toEqual('User not found');
    });
  });

  describe('DELETE /users/:id/futureTrips/:tripId', () => {
    test('should delete a future trip for a user', async () => {
      const user = { name: 'Test User', email: 'test@example.com', password: 'password' };
      const insertResult = await db.collection('users').insertOne(user);
      const userId = insertResult.insertedId;
      const tripId = new ObjectId();

      await db.collection('futureTrips').insertOne({ userID: userId, tripID: tripId });

      const res = await request(app).delete(`/users/${userId}/futureTrips/${tripId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Trip deleted');
    });

    test('should return 404 for non-existent user or trip', async () => {
      const res = await request(app).delete(`/users/${new ObjectId()}/futureTrips/${new ObjectId()}`);
      expect(res.statusCode).toEqual(404);
      expect(res.text).toEqual('Future trip not found');
    });
  });

});

