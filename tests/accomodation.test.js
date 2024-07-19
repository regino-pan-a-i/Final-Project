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
  server = app.listen(5000);
});

afterAll(async () => {
  await connection.close();
  server.close();
});

describe('Accommodation API', () => {

  describe('POST /trips/:id/accommodations', () => {
    test('should add a new accommodation to a trip', async () => {
      const tripId = '66898c57bb2c2466975597d7'; // Rome Trip
      const newAccommodation = {
        name: 'Test Accomodation',
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

    test('should return 412 if accommodation creation fails', async () => {
      const tripId = new ObjectId(); // Assuming a valid trip ID
      const invalidAccommodation = {
      };

      const res = await request(app)
        .post(`/trips/${tripId}/accommodations`)
        .send(invalidAccommodation);

      expect(res.statusCode).toEqual(412);
    });
  });

  describe('GET /trips/:id/accommodations', () => {
    test('should get all accommodations in a trip', async () => {
      const tripId = '66898c57bb2c2466975597d7' 
      const res = await request(app).get(`/trips/${tripId}/accommodations`);
      expect(res.statusCode).toEqual(200);
    });

    test('should return 404 for non-existent trip', async () => {
      const res = await request(app).get(`/trips/${new ObjectId()}/accommodations`);
      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toEqual('Trip not found.');
    });
  });

  describe('GET /trips/accommodations/:id', () => {
    test('should get an accommodation by ID', async () => {
      const accommodationId = '66898d58bb2c2466975597db'

      const res = await request(app).get(`/trips/accommodations/${accommodationId}`);
      expect(res.statusCode).toEqual(200);
    });

    test('should return 404 for non-existent accommodation', async () => {
      const res = await request(app).get(`/trips/accommodations/${new ObjectId()}`);
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('PUT /trips/accommodations/:id', () => {
    test('should update an accommodation', async () => {
      const accommodationId = '66898d58bb2c2466975597db';

      const updatedAccommodation = { 
        name: 'Updated Accomodation',
        address: '123 Main St',
        checkInDate: '2024-07-15',
        checkOutDate: '2024-07-18',
       };

      const res = await request(app)
        .put(`/trips/accommodations/${accommodationId}`)
        .send(updatedAccommodation);

      expect(res.statusCode).toEqual(204);
    });

    test('should return 412 for non-existent accommodation or no changes made', async () => {
      const res = await request(app)
        .put(`/trips/accommodations/${new ObjectId()}`)
        .send({ name: 'Updated Accomodation' });

      expect(res.statusCode).toEqual(412);
    });
  });

  describe('DELETE /trips/accommodations/:id', () => {
    test('should delete an accommodation', async () => {
      const accommodation = {tripId: '66898c57bb2c2466975597d7', name: 'Test Accommodation', address: '456 Elm St', checkInDate: '2024-07-16', checkOutDate: '2024-07-18' };
      const insertResult = await db.collection('accomodations').insertOne(accommodation);
      const accommodationId = insertResult.insertedId;

      const res = await request(app).delete(`/trips/accommodations/${accommodationId}`);
      expect(res.statusCode).toEqual(204);

      // Verify the accommodation has been deleted from the database
      const deletedResult = await db.collection('accomodations').findOne({ _id: accommodationId });
      expect(deletedResult).toBeNull();
    });

    test('should return 404 for non-existent accommodation', async () => {
      const res = await request(app).delete(`/trips/accommodations/${new ObjectId()}`);
      expect(res.statusCode).toEqual(404);
      expect(res.body.error).toEqual('Accommodation not found.');
    });
  });

});