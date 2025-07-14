const mongoose = require('mongoose');
const { Schema } = mongoose;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/testDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String, // For now, store as plain text
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'technician'],
    default: 'student'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Reservation Schema
const reservationSchema = new Schema({
  date: {
    type: String,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  laboratory: {
    type: String,
    required: true
  },
  seat: {
    type: String,
    required: true
  },
  reservedBy: {
    type: String,
    ref: 'User',
    required: true
  },
  belongsTo: {
    type: String,
    ref: 'User',
    required: true
  },
  requestDate: {
    type: Date,
    default: Date.now
  }
});

// Create models
const User = mongoose.model('User', userSchema);
const Reservation = mongoose.model('Reservation', reservationSchema);

// === Seed Sample Data ===
async function seedSampleData() {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Reservation.deleteMany({});

    // Create 5 sample users with passwords
    const users = [
      {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'student'
      },
      {
        username: 'jane_tech',
        email: 'jane@example.com',
        password: 'techpass987',
        role: 'technician'
      },
      {
        username: 'alex_student',
        email: 'alex@example.com',
        password: 'studentpass',
        role: 'student'
      },
      {
        username: 'mike_tech',
        email: 'mike@example.com',
        password: 'secureTech456',
        role: 'technician'
      },
      {
        username: 'sarah_student',
        email: 'sarah@example.com',
        password: 'sarahPass123',
        role: 'student'
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log(`✓  Created ${createdUsers.length} sample users`);

    // Create 5 sample reservations
    const reservations = [
      {
        date: '06 / 17 / 2025',
        startTime: '11:00',
        endTime: '11:30',
        laboratory: 'Laboratory 1A',
        seat: 'Seat 01',
        reservedBy: 'john_doe',
        belongsTo: 'john_doe'
      },
      {
        date: '06 / 18 / 2025',
        startTime: '14:00',
        endTime: '14:30',
        laboratory: 'Laboratory 2B',
        seat: 'Seat 05',
        reservedBy: 'jane_tech',
        belongsTo: 'john_doe'
      },
      {
        date: '06 / 19 / 2025',
        startTime: '10:00',
        endTime: '10:30',
        laboratory: 'Laboratory 3C',
        seat: 'Seat 10',
        reservedBy: 'alex_student',
        belongsTo: 'alex_student'
      },
      {
        date: '06 / 20 / 2025',
        startTime: '13:00',
        endTime: '13:30',
        laboratory: 'Laboratory 4D',
        seat: 'Seat 15',
        reservedBy: 'mike_tech',
        belongsTo: 'sarah_student'
      },
      {
        date: '06 / 21 / 2025',
        startTime: '09:30',
        endTime: '10:00',
        laboratory: 'Laboratory 5E',
        seat: 'Seat 20',
        reservedBy: 'sarah_student',
        belongsTo: 'sarah_student'
      }
    ];

    const createdReservations = await Reservation.insertMany(reservations);
    console.log(`✓  Created ${createdReservations.length} sample reservations`);

  } catch (err) {
    console.error('X Error seeding data:', err);
  } finally {
    // Optional: disconnect after seeding
    // mongoose.connection.close();
  }
}

// Run the seeding function
seedSampleData();

// Export both models
module.exports = {
  User,
  Reservation
};