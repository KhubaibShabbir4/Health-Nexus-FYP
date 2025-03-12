import { verify } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const token = req.cookies.accesstoken;

    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const decoded = verify(token, process.env.JWT_SECRET);
    
    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: "Invalid token" });
    }
    
    // Return the patient ID from the token
    return res.status(200).json({ 
      patient_id: Number(decoded.id)
    });
    
  } catch (error) {
    console.error("Error in getPatientSession:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
} 