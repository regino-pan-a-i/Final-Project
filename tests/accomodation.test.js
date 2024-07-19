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

describe('Accommodation API', () => {

  describe('POST /trips/:id/accommodations', () => {
    test('should add a new accommodation to a trip', async () => {
      const tripId = new ObjectId(); // Assuming a valid trip ID
      const newAccommodation = {
        name: 'New Accommodation',
        address: '123 Main St',
        checkInDate: '2024-07-15',
        checkOutDate: '2024-07-18',
      };

      const res = await request(app)
        .post(`/trips/${tripId}/accommodations`)
        .send(newAccommodation);

      expect(res.statusCode).toEqual(201);
      expect(res.body.acknowledged).toBeTruthy();
    });

    test('should return 500 if accommodation creation fails', async () => {
      const tripId = new ObjectId(); // Assuming a valid trip ID
      const invalidAccommodation = {
        // Missing required fields
      };

      const res = await request(app)
        .post(`/trips/${tripId}/accommodations`)
        .send(invalidAccommodation);

      expect(res.statusCode).toEqual(500);
      expect(res.body.error).toBeDefined();
    });
  });

  describe('GET /trips/:id/accommodations', () => {
    test('should get all accommodations in a trip', async () => {
      const tripId = new ObjectId(); // Assuming a valid trip ID
      const res = await request(app).get(`/trips/${tripId}/accommodations`);
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    test('should return 404 for non-existent trip', async () => {
      const res = await request(app).get(`/trips/${new ObjectId()}/accommodations`);
      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toEqual('Trip not found.');
    });
  });

  describe('GET /accommodations/:id', () => {
    test('should get an accommodation by ID', async () => {
      const accommodation = { name: 'Test Accommodation', address: '456 Elm St', checkInDate: '2024-07-16', checkOutDate: '2024-07-18' };
      const insertResult = await db.collection('accommodations').insertOne(accommodation);
      const accommodationId = insertResult.insertedId;

      const res = await request(app).get(`/accommodations/${accommodationId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.name).toEqual(accommodation.name);
      expect(res.body.address).toEqual(accommodation.address);
    });

    test('should return 404 for non-existent accommodation', async () => {
      const res = await request(app).get(`/accommodations/${new ObjectId()}`);
      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toEqual('Accommodation not found.');
    });
  });

  describe('PUT /accommodations/:id', () => {
    test('should update an accommodation', async () => {
      const accommodation = { name: 'Test Accommodation', address: '456 Elm St', checkInDate: '2024-07-16', checkOutDate: '2024-07-18' };
      const insertResult = await db.collection('accommodations').insertOne(accommodation);
      const accommodationId = insertResult.insertedId;

      const updatedAccommodation = { name: 'Updated Accommodation', address: '789 Oak St', checkInDate: '2024-07-19', checkOutDate: '2024-07-21' };

      const res = await request(app)
        .put(`/accommodations/${accommodationId}`)
        .send(updatedAccommodation);

      expect(res.statusCode).toEqual(204);

      // Verify the accommodation has been updated in the database
      const updatedResult = await db.collection('accommodations').findOne({ _id: accommodationId });
      expect(updatedResult.name).toEqual(updatedAccommodation.name);
      expect(updatedResult.address).toEqual(updatedAccommodation.address);
    });

    test('should return 404 for non-existent accommodation or no changes made', async () => {
      const res = await request(app)
        .put(`/accommodations/${new ObjectId()}`)
        .send({ name: 'Updated Accommodation' });

      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toEqual('Accommodation not found or no changes made.');
    });
  });

  describe('DELETE /accommodations/:id', () => {
    test('should delete an accommodation', async () => {
      const accommodation = { name: 'Test Accommodation', address: '456 Elm St', checkInDate: '2024-07-16', checkOutDate: '2024-07-18' };
      const insertResult = await db.collection('accommodations').insertOne(accommodation);
      const accommodationId = insertResult.insertedId;

      const res = await request(app).delete(`/accommodations/${accommodationId}`);
      expect(res.statusCode).toEqual(204);

      // Verify the accommodation has been deleted from the database
      const deletedResult = await db.collection('accommodations').findOne({ _id: accommodationId });
      expect(deletedResult).toBeNull();
    });

    test('should return 404 for non-existent accommodation', async () => {
      const res = await request(app).delete(`/accommodations/${new ObjectId()}`);
      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toEqual('Accommodation not found.');
    });
  });

});