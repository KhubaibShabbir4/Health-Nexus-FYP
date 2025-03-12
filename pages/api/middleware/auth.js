import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { writeFile } from 'fs/promises';
import { join } from 'path';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

// Create email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Extract all form fields
    const data = Object.fromEntries(formData.entries());
    
    // Validate required fields
    if (!data.email || !data.password || !data.fullName) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Handle file uploads
    let prescriptionFilePath = null;
    let financialProofPath = null;

    const prescriptionFile = formData.get('prescriptionFile');
    const financialProof = formData.get('financialProof');

    if (prescriptionFile) {
      const bytes = await prescriptionFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${Date.now()}-${prescriptionFile.name}`;
      const filePath = join(process.cwd(), 'public/uploads', fileName);
      await writeFile(filePath, buffer);
      prescriptionFilePath = `/uploads/${fileName}`;
    }

    if (financialProof) {
      const bytes = await financialProof.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${Date.now()}-${financialProof.name}`;
      const filePath = join(process.cwd(), 'public/uploads', fileName);
      await writeFile(filePath, buffer);
      financialProofPath = `/uploads/${fileName}`;
    }

    // Create patient record
    const newPatient = await prisma.patientLogin.create({
      data: {
        full_name: data.fullName,
        gender: data.gender,
        dob: data.dob ? new Date(data.dob) : null,
        email: data.email,
        password_hash: hashedPassword,
        phone: data.phone,
        cnic: data.cnic,
        cnic_expiry: data.cnicExpiry ? new Date(data.cnicExpiry) : null,
        medical_condition: data.medicalCondition,
        current_medications: data.currentMedications,
        allergies: data.allergies,
        financial_support: data.financialSupport,
        monthly_income: data.monthlyIncome,
        occupation: data.occupation,
        dependents: data.dependents ? parseInt(data.dependents) : null,
        emergency_contact_name: data.emergencyContactName,
        emergency_contact_relation: data.emergencyContactRelation,
        emergency_contact_phone: data.emergencyContactPhone,
        prescription_file: prescriptionFilePath,
        financial_proof: financialProofPath,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Patient registered successfully',
      data: {
        id: newPatient.id,
        email: newPatient.email,
      }
    });

  } catch (error) {
    console.error('Patient signup error:', error);
    return NextResponse.json(
      { error: 'Failed to register patient' },
      { status: 500 }
    );
  }
}
