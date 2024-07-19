const { MongoClient, ObjectId } = require('mongodb');
const request = require('supertest');
const app = require('../app'); // Adjust the path as per your project structure
const mongodb = require('../database/connect');

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

  // Start the server
  server = app.listen(1000);
});

afterAll(async () => {
  await connection.close();
  server.close();
});

describe('Activity API', () => {

  describe('POST /trips/:id/activities', () => {
    test('should add a new activity to a trip', async () => {
      const tripId = '66898c57bb2c2466975597d7'; // Rome Trip
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
    });

    test('should return 412 if activity creation fails', async () => {
      const tripId = '66898c57bb2c2466975597d7' // Assuming a valid trip ID
      const invalidActivity = {
        // Missing required fields
      };

      const res = await request(app)
        .post(`/trips/${tripId}/activities`)
        .send(invalidActivity);

      expect(res.statusCode).toEqual(412);
    });
  });

  describe('GET /trips/:id/activities', () => {
    test('should get all activities in a trip', async () => {
      const tripId = '66898c57bb2c2466975597d7'; // Assuming a valid trip ID
      const res = await request(app).get(`/trips/${tripId}/activities`);
      expect(res.statusCode).toEqual(200);
    });

    test('should return 404 for non-existent trip', async () => {
      const res = await request(app).get(`/trips/${new ObjectId()}/activities`);
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('GET /trips/activities/:id', () => {
    test('should get an activity by ID', async () => {
      const activityId = '669ac142a386368522d0c5c0'

      const res = await request(app).get(`/trips/activities/${activityId}`);
      expect(res.statusCode).toEqual(200);
    });

    test('should return 404 for non-existent activity', async () => {
      const res = await request(app).get(`/activities/${new ObjectId()}`);
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('PUT /activities/:id', () => {
    test('should update an activity', async () => {
      const activityId = '669ac142a386368522d0c5c0'

      const updatedActivity = { name: 'Updated Activity', type: 'Relaxation', date: '2024-07-17', time: '11:00' };

      const res = await request(app)
        .put(`/trips/activities/${activityId}`)
        .send(updatedActivity);

      expect(res.statusCode).toEqual(204);
    });

    test('should return 412 for non-existent activity or no changes made', async () => {
      const res = await request(app)
        .put(`/trips/activities/${new ObjectId()}`)
        .send({ name: 'Updated Activity' });

      expect(res.statusCode).toEqual(412);
    });
  });

  describe('DELETE /activities/:id', () => {
    test('should delete an activity', async () => {
      const activity = { tripId: '66898c57bb2c2466975597d7',name: 'Test Activity', type: 'Adventure', date: '2024-07-16', time: '10:00' };
      const insertResult = await db.collection('activities').insertOne(activity);
      const activityId = insertResult.insertedId;

      const res = await request(app).delete(`/trips/activities/${activityId}`);
      expect(res.statusCode).toEqual(204);

      // Verify the activity has been deleted from the database
      const deletedResult = await db.collection('activities').findOne({ _id: activityId });
      expect(deletedResult).toBeNull();
    });

    test('should return 404 for non-existent activity', async () => {
      const res = await request(app).delete(`/trips/activities/${new ObjectId()}`);
      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toEqual('Activity not found.');
    });
  });

});