import { PrismaClient } from "@prisma/client";
import { encryptData } from "../../../utils/encryption"; // Import encryption function
import multer from "multer";
import path from "path";
import fs from "fs";
import nc from "next-connect"; // ✅ Correct import

const prisma = new PrismaClient();

// Multer setup for file uploads
const upload = multer({ dest: "public/uploads/" });

const apiRoute = nc({ // ✅ Using nc instead of nextConnect()
    onError(error, req, res) {
        res.status(500).json({ error: `Something went wrong: ${error.message}` });
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    },
});

// Middleware to handle file uploads
apiRoute.use(upload.single("medicalReport"));

apiRoute.post(async (req, res) => {
    try {
        const { fullName, cnic, contact, medicalCondition, assistanceType, preferredNgo, additionalMessage } = req.body;
        
        // Encrypt medical condition for security
        const encryptedCondition = encryptData(medicalCondition);

        // Save the request in the database
        const newRequest = await prisma.assistanceRequest.create({
            data: {
                fullName,
                cnic,
                contact,
                medicalCondition: encryptedCondition, // Store encrypted condition
                assistanceType,
                preferredNgo,
                medicalReport: req.file ? req.file.path : null, // Store uploaded file path
                additionalMessage,
            },
        });

        res.status(201).json({ message: "Assistance request stored successfully!", newRequest });
    } catch (error) {
        console.error("Error saving request:", error);
        res.status(500).json({ error: "Failed to store assistance request." });
    }
});

export default apiRoute;
