import mongoose from 'mongoose';

export default function connectDatabase() {
  mongoose.Promise = global.Promise;
  // Connecting to the database
  mongoose
    .connect(process.env.DB_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Successfully connected to the database');
    })
    .catch((err) => {
      console.log(`Could not connect to the database. Exiting now...\n${err}`);
      process.exit();
    });
}
