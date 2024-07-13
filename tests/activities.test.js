const { MongoClient, ObjectId } = require('mongodb');
const request = require('supertest');
const app = require('../app'); // Adjust the path as per your project structure
const mongodb = require('../database/connect');

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

describe('Activity API', () => {

  describe('POST /trips/:id/activities', () => {
    test('should add a new activity to a trip', async () => {
      const tripId = new ObjectId(); // Assuming a valid trip ID
      const newActivity = {
        name: 'New Activity',
        type: 'Sightseeing',
        date: '2024-07-15',
        time: '09:00',
      };

      const res = await request(app)
        .post(`/trips/${tripId}/activities`)
        .send(newActivity);

      expect(res.statusCode).toEqual(201);
      expect(res.body.acknowledged).toBeTruthy();
    });

    test('should return 500 if activity creation fails', async () => {
      const tripId = new ObjectId(); // Assuming a valid trip ID
      const invalidActivity = {
        // Missing required fields
      };

      const res = await request(app)
        .post(`/trips/${tripId}/activities`)
        .send(invalidActivity);

      expect(res.statusCode).toEqual(500);
      expect(res.body.error).toBeDefined();
    });
  });

  describe('GET /trips/:id/activities', () => {
    test('should get all activities in a trip', async () => {
      const tripId = new ObjectId(); // Assuming a valid trip ID
      const res = await request(app).get(`/trips/${tripId}/activities`);
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    test('should return 404 for non-existent trip', async () => {
      const res = await request(app).get(`/trips/${new ObjectId()}/activities`);
      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toEqual('Trip not found.');
    });
  });

  describe('GET /activities/:id', () => {
    test('should get an activity by ID', async () => {
      const activity = { name: 'Test Activity', type: 'Adventure', date: '2024-07-16', time: '10:00' };
      const insertResult = await db.collection('activities').insertOne(activity);
      const activityId = insertResult.insertedId;

      const res = await request(app).get(`/activities/${activityId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.name).toEqual(activity.name);
      expect(res.body.type).toEqual(activity.type);
    });

    test('should return 404 for non-existent activity', async () => {
      const res = await request(app).get(`/activities/${new ObjectId()}`);
      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toEqual('Activity not found.');
    });
  });

  describe('PUT /activities/:id', () => {
    test('should update an activity', async () => {
      const activity = { name: 'Test Activity', type: 'Adventure', date: '2024-07-16', time: '10:00' };
      const insertResult = await db.collection('activities').insertOne(activity);
      const activityId = insertResult.insertedId;

      const updatedActivity = { name: 'Updated Activity', type: 'Relaxation', date: '2024-07-17', time: '11:00' };

      const res = await request(app)
        .put(`/activities/${activityId}`)
        .send(updatedActivity);

      expect(res.statusCode).toEqual(204);

      // Verify the activity has been updated in the database
      const updatedResult = await db.collection('activities').findOne({ _id: activityId });
      expect(updatedResult.name).toEqual(updatedActivity.name);
      expect(updatedResult.type).toEqual(updatedActivity.type);
    });

    test('should return 404 for non-existent activity or no changes made', async () => {
      const res = await request(app)
        .put(`/activities/${new ObjectId()}`)
        .send({ name: 'Updated Activity' });

      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toEqual('Activity not found or no changes made.');
    });
  });

  describe('DELETE /activities/:id', () => {
    test('should delete an activity', async () => {
      const activity = { name: 'Test Activity', type: 'Adventure', date: '2024-07-16', time: '10:00' };
      const insertResult = await db.collection('activities').insertOne(activity);
      const activityId = insertResult.insertedId;

      const res = await request(app).delete(`/activities/${activityId}`);
      expect(res.statusCode).toEqual(204);

      // Verify the activity has been deleted from the database
      const deletedResult = await db.collection('activities').findOne({ _id: activityId });
      expect(deletedResult).toBeNull();
    });

    test('should return 404 for non-existent activity', async () => {
      const res = await request(app).delete(`/activities/${new ObjectId()}`);
      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toEqual('Activity not found.');
    });
  });

});