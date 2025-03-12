import { PrismaClient } from "@prisma/client";
import formidable from "formidable";
import path from "path";

// Disable Next.js's default body parser so Formidable can handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

const prisma = new PrismaClient();

// Define valid enum values based on your Prisma schema
const VALID_ASSISTANCE_TYPES = {
  FINANCIAL_AID: "FINANCIAL_AID",
  MEDICATION: "MEDICATION",
  CONSULTATION: "CONSULTATION",
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    const form = formidable({
      multiples: false,
      uploadDir: path.join(process.cwd(), "public", "uploads"),
      keepExtensions: true,
    });

    // 1) Parse the incoming form data
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    // Helper function to safely get the string value of a field
    const getValue = (field) =>
      Array.isArray(fields[field]) ? fields[field][0] : fields[field];

    // 2) Validate & convert assistanceType to your enum
    const rawType = getValue("assistanceType");
    if (!rawType || !VALID_ASSISTANCE_TYPES[rawType]) {
      return res.status(400).json({
        success: false,
        error: `Invalid assistance type. Valid options: ${Object.keys(
          VALID_ASSISTANCE_TYPES
        ).join(", ")}`,
      });
    }

    // 3) Parse numeric user_id
    const userId = parseInt(getValue("user_id"), 10);
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        error: "Missing or invalid user_id. Please log in again.",
      });
    }

    // 4) Lookup the patient's info from patientLogin
    const patient = await prisma.patientLogin.findUnique({
      where: { patient_id: userId },
    });
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: "Patient not found. Please log in again or register.",
      });
    }

    // 5) If a medical report file was uploaded, get the path
    let medicalReportPath = null;
    if (files.medicalReport) {
      medicalReportPath = `/uploads/${files.medicalReport.newFilename}`;
    }

    // 6) Convert totalExpenditure & selfFinance
    const totalExpenditure = parseFloat(getValue("totalExpenditure"));
    const selfFinance = parseFloat(getValue("selfFinance"));
    if (isNaN(totalExpenditure) || isNaN(selfFinance)) {
      return res.status(400).json({
        success: false,
        error: "Total Expenditure and Self Finance must be valid numbers",
      });
    }

    // 7) Create the new assistance request
    const newRequest = await prisma.assistanceRequest.create({
      data: {
        user_id: userId,

        // Auto-fill from patientLogin:
        fullName: patient.full_name,
        cnic: patient.cnic || "N/A",
        contact: patient.phone || "N/A",

        // Fields from the form:
        medicalCondition: getValue("medicalCondition"),
        assistanceType: rawType,
        medicalReport: medicalReportPath,
        additionalMessage: getValue("additionalMessage") || null,
        totalExpenditure,
        selfFinance,
        createdAt: new Date(),
      },
    });

    return res.status(201).json({
      success: true,
      message: "Assistance request submitted successfully",
      data: newRequest,
    });
  } catch (error) {
    console.error("[ASSISTANCE_REQUEST_ERROR]", error);
    return res.status(500).json({
      success: false,
      error: "Failed to submit assistance request. Please try again.",
    });
  }
}
