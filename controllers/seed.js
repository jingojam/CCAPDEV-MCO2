const mongoose = require('mongoose');
const User = require('../model/userRegistry');
const Lab = require('../model/labRegistry');
const Reservation = require('../model/reserveRegistry');

function getUTCDateOffset(daysToAdd = 0) {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() + daysToAdd);
    date.setUTCHours(0, 0, 0, 0); // Set to midnight UTC
    return date;
}

async function setDates() {
    const dates = [];
    for (let i = 0; i < 7; i++) {
        dates.push(getUTCDateOffset(i));
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
            role: 'STUDENT',
            email: 'jane.smith@dlsu.edu.ph',
            password: 'password123',
            description: 'BS Information Systems student.'
        },
        {
            first_name: 'Admin',
            last_name: 'User',
            role: 'TECHNICIAN',
            email: 'admin.user@dlsu.edu.ph',
            password: 'password123',
            description: 'Lab technician at CS department.'
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

const SAMPLE_EMAILS = [
    'john.doe@dlsu.edu.ph',
    'jane.smith@dlsu.edu.ph',
    'admin.user@dlsu.edu.ph'
];

async function insertSampleReservations() {
    const users = await User.find({ email: { $in: SAMPLE_EMAILS } });
    const labs = await Lab.find().sort({ lab_id: 1 }).limit(5);

    if (!users.length || !labs.length) {
        console.log('🟨 Need users and labs before adding reservations.');
        return;
    }

    const reservations = [];

    users.forEach(user => {
        labs.forEach((lab, idx) => {
            let offset;
            if (idx < 3) {
                // 3 active: today + 1, 2, 3 days
                offset = idx + 1;
            } else {
                // 2 completed: today - 1, -2 days
                offset = -(idx - 2);
            }

            const day = getUTCDateOffset(offset); // Use raw UTC date
            const start = 900 + idx * 100;
            const end = start + 100;

            reservations.push({
                lab_name: lab.lab_name,
                lab_sched: day,
                lab_url: lab.lab_url,
                startTime: String(start).padStart(4, '0'),
                endTime: String(end).padStart(4, '0'),
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
            lab_sched: r.lab_sched,
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
        await insertSampleReservations();
    } catch (err) {
        console.error('Seeder failed:', err);
    }
}

module.exports = runSeeder;
