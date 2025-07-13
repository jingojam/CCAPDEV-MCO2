// controllers/reservationController.js

const Reservation = require('../model/reserveRegistry');
const mongoose = require('mongoose');

exports.createReservation = async (req, res) => {
  const {
    lab_name,
    lab_sched, // This is a string like "2025-04-05"
    startTime,
    endTime,
    seat,
    lab_url,
    reservedBy,
    belongsTo
  } = req.body;

  // Validate required fields
  if (!lab_name || !lab_sched || !startTime || !endTime || !seat || !reservedBy || !belongsTo) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields'
    });
  }

  try {
    // Convert lab_sched string to Date object
    const labScheduleDate = new Date(lab_sched);

    // Create new reservation
    const reservation = new Reservation({
      lab_name,
      lab_sched: labScheduleDate, // Now a Date object
      startTime,
      endTime,
      seat,
      lab_url,
      reservedBy,
      belongsTo
    });

    await reservation.save();

    res.json({
      success: true,
      message: 'Reservation created successfully'
    });
  } catch (err) {
    console.error('Error creating reservation:', err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};