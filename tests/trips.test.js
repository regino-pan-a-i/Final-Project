const { MongoClient, ObjectId } = require('mongodb');
const request = require('supertest');
const app = require('../app'); 
const dotenv = require('dotenv');


describe('Trip API', () => {
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

  describe('POST /trips', () => {
    test('should create a new trip', async () => {
      const res = await request(app)
        .post('/trips')
        .send({
          destination: 'Test Destination',
          startDate: '2024-07-15',
          endDate: '2024-07-20',
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('acknowledged', true);
    });

    test('should return 400 if any field is missing', async () => {
      const res = await request(app)
        .post('/trips')
        .send({
          destination: 'Test Destination',
          // Missing startDate and endDate
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', 'Please enter values for every field.');
    });
  });

  describe('GET /trips', () => {
    test('should get all trips', async () => {
      // Insert mock data directly into the database
      await db.collection('trips').insertMany([
        { destination: 'Trip 1', startDate: '2024-07-15', endDate: '2024-07-20' },
        { destination: 'Trip 2', startDate: '2024-07-18', endDate: '2024-07-22' },
      ]);

      const res = await request(app).get('/trips');
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(2);
    });
  });

  describe('GET /trips/:id', () => {
    test('should get a trip by ID', async () => {
      const trip = { destination: 'Test Destination', startDate: '2024-07-15', endDate: '2024-07-20' };
      const insertResult = await db.collection('trips').insertOne(trip);
      const tripId = insertResult.insertedId;

      const res = await request(app).get(`/trips/${tripId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toMatchObject(trip);
    });

    test('should return 404 for non-existent trip', async () => {
      const res = await request(app).get(`/trips/${new ObjectId()}`);
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error', 'Trip not found.');
    });
  });

  describe('PUT /trips/:id', () => {
    test('should update a trip', async () => {
      const trip = { destination: 'Test Destination', startDate: '2024-07-15', endDate: '2024-07-20' };
      const insertResult = await db.collection('trips').insertOne(trip);
      const tripId = insertResult.insertedId;

      const updatedTrip = { destination: 'Updated Destination', startDate: '2024-07-16', endDate: '2024-07-21' };

      const res = await request(app)
        .put(`/trips/${tripId}`)
        .send(updatedTrip);

      expect(res.statusCode).toEqual(204);

      const updatedTripFromDb = await db.collection('trips').findOne({ _id: tripId });
      expect(updatedTripFromDb).toMatchObject(updatedTrip);
    });

    test('should return 404 for non-existent trip', async () => {
      const res = await request(app)
        .put(`/trips/${new ObjectId()}`)
        .send({ destination: 'Updated Destination', startDate: '2024-07-16', endDate: '2024-07-21' });

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error', 'Trip not found or no changes made.');
    });
  });

  describe('DELETE /trips/:id', () => {
    test('should delete a trip', async () => {
      const trip = { destination: 'Test Destination', startDate: '2024-07-15', endDate: '2024-07-20' };
      const insertResult = await db.collection('trips').insertOne(trip);
      const tripId = insertResult.insertedId;

      const res = await request(app).delete(`/trips/${tripId}`);
      expect(res.statusCode).toEqual(204);

      const deletedTrip = await db.collection('trips').findOne({ _id: tripId });
      expect(deletedTrip).toBeNull(); // Ensure trip is deleted
    });

    test('should return 404 for non-existent trip', async () => {
      const res = await request(app).delete(`/trips/${new ObjectId()}`);
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error', 'Trip not found.');
    });
  });
});