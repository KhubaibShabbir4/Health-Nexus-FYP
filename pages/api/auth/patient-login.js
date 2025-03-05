import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  
  const { email, password } = req.body;
  
  try {
    // Look for the patient using the email in the patient-signup table.
    const patient = await prisma.PatientLogin.findUnique({
      where: { email },
    });
    
    if (!patient) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    
    // Compare the given password with the hashed password in the database.
    const isPasswordValid = await bcrypt.compare(password, patient.password_hash);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    
    // If you have session/token creation logic, include it here.
    // For example, you might generate a JWT or establish a server-side session.
    
    // Respond with success if credentials are valid.
    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
