import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false, // Disable bodyParser so Formidable can handle file uploads
  },
};

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const form = formidable({
        multiples: true,
        uploadDir: "./public/uploads",
        keepExtensions: true
      });

      const [fields, files] = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          resolve([fields, files]);
        });
      });

      // Validate and parse dates
      const dobDate = fields.dob[0] ? new Date(fields.dob[0]) : null;
      const cnicExpiryDate = fields.cnicExpiry && fields.cnicExpiry[0] 
        ? new Date(fields.cnicExpiry[0]) 
        : null;

      // Validate dates
      if (dobDate && isNaN(dobDate.getTime())) {
        return res.status(400).json({ success: false, error: "Invalid date of birth" });
      }
      if (cnicExpiryDate && isNaN(cnicExpiryDate.getTime())) {
        return res.status(400).json({ success: false, error: "Invalid CNIC expiry date" });
      }

      const hashedPassword = await bcrypt.hash(fields.password[0], 10);

      // File paths
      const prescriptionFilePath = files.prescriptionFile ? `/uploads/${files.prescriptionFile.newFilename}` : null;
      const healthReportsPath = files.healthReports ? `/uploads/${files.healthReports.newFilename}` : null;
      const financialProofPath = files.financialProof ? `/uploads/${files.financialProof.newFilename}` : null;

      const newPatient = await prisma.PatientLogin.create({
        data: {
          full_name: fields.fullName[0] || null,
          gender: fields.gender[0] || null,
          dob: dobDate,
          email: fields.email[0] || null,
          medical_condition: fields.medicalCondition[0] || null,
          financial_support: fields.financialSupport[0] || null,
          emergency_contact_name: fields.emergencyContactName[0] || null,
          emergency_contact_relation: fields.emergencyContactRelation[0] || null,
          emergency_contact_phone: fields.emergencyContactPhone[0] || null,
          password_hash: hashedPassword,
          phone: fields.phone[0] || null,
          cnic: fields.cnic[0] || null,
          cnic_expiry: cnicExpiryDate,
          address: fields.address[0] || null,
          city: fields.city[0] || null,
          province: fields.province[0] || null,
          country: fields.country[0] || null,
          current_medications: fields.currentMedications[0] || null,
          allergies: fields.allergies[0] || null,
          monthly_income: fields.monthlyIncome[0] || null,
          occupation: fields.occupation[0] || null,
          dependents: fields.dependents ? parseInt(fields.dependents[0], 10) : null,
          preferred_ngo: fields.preferredNGO[0] || null,
          preferred_city: fields.preferredCity[0] || null,
          prescription_file: prescriptionFilePath,
          health_reports: healthReportsPath,
          financial_proof: financialProofPath,
        },
      });

      return res.status(201).json({ success: true, data: newPatient });

    } catch (error) {
      console.error("[PATIENT_SIGNUP_ERROR]", error);
      return res.status(500).json({ 
        success: false, 
        error: error.message || "Internal server error" 
      });
    }
  } else {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
