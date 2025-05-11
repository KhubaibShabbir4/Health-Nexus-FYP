import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(request) {
  try {
    const data = await request.json();

    // Create MySQL connection
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });

    // Insert the gig into the database
    const [result] = await connection.execute(
      `INSERT INTO gigs (
        medicationId,
        medicationName,
        pharmacistId,
        prescriptionId,
        quantity,
        price,
        totalAmount,
        availability,
        deliveryPreference,
        status,
        patientId,
        patientName,
        createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.medicationId,
        data.medicationName,
        data.pharmacistId,
        data.prescriptionId,
        data.quantity,
        data.price,
        data.totalAmount,
        data.availability,
        data.deliveryPreference,
        data.status,
        data.patientId,
        data.patientName,
        data.createdAt
      ]
    );

    await connection.end();

    return NextResponse.json({ 
      success: true, 
      message: 'Gig saved successfully',
      gigId: result.insertId 
    });

  } catch (error) {
    console.error('Error saving gig:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save gig', error: error.message },
      { status: 500 }
    );
  }
} 