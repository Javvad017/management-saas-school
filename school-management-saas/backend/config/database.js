import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);
    console.log(`Connection State: ${conn.connection.readyState === 1 ? 'Connected' : 'Not Connected'}`);
    
    // Log collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`Collections in database: ${collections.map(c => c.name).join(', ') || 'None'}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
