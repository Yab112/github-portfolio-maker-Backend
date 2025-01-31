import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

export const setupDB = async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    console.log('MongoMemoryServer started at:', uri);
    await mongoose.disconnect(); // Ensure any previous connection is closed
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000 // Increase the timeout to 30 seconds
    });
    console.log('Mongoose connected to:', uri);
  } catch (error) {
    console.error('Failed to set up the database:', error);
  }
};

export const teardownDB = async () => {
  try {
    await mongoose.disconnect();
    await mongoServer.stop();
    console.log('MongoMemoryServer stopped and Mongoose disconnected');
  } catch (error) {
    console.error('Failed to tear down the database:', error);
  }
};

export const clearDB = async () => {
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany();
    }
    console.log('Database cleared');
  } catch (error) {
    console.error('Failed to clear the database:', error);
  }
};
