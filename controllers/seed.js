/* 
    since we can't create labs per-se, and lab is a schema,,
    this seed.js file's only purpose is for generating base stuff for the lab
*/
const mongoose = require('mongoose');
const User        = require('../model/userRegistry');   // Adjust path if needed
const Lab         = require('../model/labRegistry');    // Adjust path if needed
const Reservation = require('../model/reserveRegistry'); // Your reservation model

async function setDates() {
    const dates = [];
    for (let i = 0; i < 7; i++) {
        dates.push(new Date(`2025-07-${10 + i}`));
    }
    return dates;
}

async function generateLabs() {
    const labNames = [];
    for (let i = 0; i < 5; i++) {
        labNames.push("Laboratory " + (i + 1) + String.fromCharCode('A'.charCodeAt(0) + i));
    }

    try {
        const existingLabs = await Lab.find({ lab_name: { $in: labNames } });
        if (existingLabs.length > 0) {
            console.log('⚠️ Labs already exist. Skipping insertion.');
            return;
        }

        const labs = [];
        for (let i = 0; i < 5; i++) {
            labs.push({
                lab_id: i + 1,
                lab_name: labNames[i],
                lab_description: `Description for Lab ${i + 1}`,
                lab_sched: await setDates(),
                lab_url: `http://localhost:3000/laboratory/${i + 1}`,
                seats: Array.from({ length: 35 }, (_, j) => ({
                    seat_num: j + 1
                }))
            });
        }

        await Lab.insertMany(labs);
        console.log(`${labs.length} labs inserted successfully.`);
    } catch (err) {
        console.error('Error inserting labs:', err);
    }
}

async function insertSampleUsers() {
    const sampleUsers = [
        {
            first_name: 'John',
            last_name: 'Doe',
            role: 'STUDENT',
            email: 'john.doe@dlsu.edu.ph',
            password: 'password123',
            description: 'BS Computer Science student.',
        },
        {
            first_name: 'Jane',
            last_name: 'Smith',
            role: 'TECHNICIAN',
            email: 'jane.smith@dlsu.edu.ph',
            password: 'password123',
            description: 'Lab technician at CS department.'
        },
        {
            first_name: 'Admin',
            last_name: 'User',
            role: 'STUDENT',
            email: 'admin.user@dlsu.edu.ph',
            password: 'password123'
        }
    ];

    let insertedCount = 0;

    for (const userData of sampleUsers) {
        const existingUser = await User.findOne({ email: userData.email }).exec();
        if (!existingUser) {
            await User.create(userData);
            insertedCount++;
            console.log(`✅ Inserted user: ${userData.email}`);
        } else {
            console.log(`🟨 User already exists: ${userData.email}`);
        }
    }

    console.log(`${insertedCount} new user(s) inserted.`);
}

// List of sample emails to restrict reservations to
const SAMPLE_EMAILS = [
    'john.doe@dlsu.edu.ph',
    'jane.smith@dlsu.edu.ph',
    'admin.user@dlsu.edu.ph'
];

async function insertSampleReservations() {
    // Find only our sample users
    const users = await User.find({ email: { $in: SAMPLE_EMAILS } });
    const labs  = await Lab.find().sort({ lab_id: 1 }).limit(5); // Get 5 labs

    if (!users.length || !labs.length) {
        console.log('🟨 Need users and labs before adding reservations.');
        return;
    }

    const reservations = [];

    users.forEach(user => {
        labs.forEach((lab, idx) => {
            const day = new Date();
            day.setDate(day.getDate() + idx); // Today + index days

            const start = 900 + idx * 100;     // 0900, 1000, ...
            const end   = start + 100;         // one-hour slot

            reservations.push({
                lab_name: lab.lab_name,
                lab_description: lab.lab_description,
                lab_sched: day,
                lab_url: lab.lab_url,

                date: day.toISOString().split('T')[0], // YYYY-MM-DD format
                startTime: String(start).padStart(4, '0'),
                endTime: String(end).padStart(4, '0'),
                laboratory: lab.lab_name,
                seat: String(idx + 1),
                reservedBy: user._id,
                belongsTo: user._id
            });
        });
    });

    let inserted = 0;
    for (const r of reservations) {
        const exists = await Reservation.findOne({
            lab_name: r.lab_name,
            date: r.date,
            startTime: r.startTime,
            endTime: r.endTime,
            belongsTo: r.belongsTo
        });

        if (!exists) {
            await Reservation.create(r);
            inserted++;
        }
    }

    console.log(`✅ Inserted ${inserted} new reservation(s).`);
}

async function runSeeder() {
    try {
        await generateLabs();
        await insertSampleUsers();
        await insertSampleReservations(); // NEW: Add reservations
    } catch (err) {
        console.error('Seeder failed:', err);
    }
}

module.exports = runSeeder;