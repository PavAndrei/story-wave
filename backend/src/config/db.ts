import { MONGO_URI } from '../constants/env.js';
import mongoose from 'mongoose';

const connectToDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to DB successfully ✅');
  } catch (err) {
    console.log('Could not connect to DB ❌: ', err);
    process.exit(1);
  }
};

export default connectToDB;
