// pages/api/auth/requestAssistance.js
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

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const form = formidable({
        multiples: false,
        uploadDir: path.join(process.cwd(), "public", "uploads"),
        keepExtensions: true,
      });

      // Parse the incoming form data
      const [fields, files] = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          else resolve([fields, files]);
        });
      });

      // Get file path for the uploaded medical report if available
      const medicalReportPath = files.medicalReport
        ? `/uploads/${files.medicalReport.newFilename}`
        : null;

      // Create a new AssistanceRequest record in the database
      const newRequest = await prisma.assistanceRequest.create({
        data: {
          fullName: Array.isArray(fields.fullName) ? fields.fullName[0] : fields.fullName,
          cnic: Array.isArray(fields.cnic) ? fields.cnic[0] : fields.cnic,
          contact: Array.isArray(fields.contact) ? fields.contact[0] : fields.contact,
          medicalCondition: Array.isArray(fields.medicalCondition)
            ? fields.medicalCondition[0]
            : fields.medicalCondition,
          assistanceType: Array.isArray(fields.assistanceType)
            ? fields.assistanceType[0]
            : fields.assistanceType,
          preferredNgo: Array.isArray(fields.preferredNgo)
            ? fields.preferredNgo[0]
            : fields.preferredNgo,
          medicalReport: medicalReportPath,
          additionalMessage: fields.additionalMessage
            ? Array.isArray(fields.additionalMessage)
              ? fields.additionalMessage[0]
              : fields.additionalMessage
            : null,
        },
      });

      return res.status(201).json({ success: true, data: newRequest });
    } catch (error) {
      console.error("[ASSISTANCE_REQUEST_ERROR]", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Internal server error",
      });
    }
  } else {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
