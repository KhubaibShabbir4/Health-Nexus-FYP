import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    try {
        if (req.method === "GET") {
            // Fetch all accounts from different tables
            const patients = await prisma.patients_signup.findMany({
                select: {
                    patient_id: true,
                    patient_name: true,
                    patient_email: true,
                    password: true,
                    phone: true,
                },
            });

            const doctors = await prisma.Doctor.findMany({
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    password: true,
                    specialization: true,
                    role: true,
                },
            });

            const ngos = await prisma.NGO.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    password: true,
                    phone: true,
                    role: true,
                },
            });

            const pharmacies = await prisma.Pharmacy.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    password: true,
                    phone: true,
                    role: true,
                },
            });

            const admins = await prisma.Admin.findMany({
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    password: true,
                    role: true,
                },
            });

            // Standardize all data into one array
            const allAccounts = [
                ...patients.map(p => ({
                    id: p.patient_id,
                    name: p.patient_name,
                    email: p.patient_email,
                    password: p.password,
                    phone: p.phone,
                    role: "Patient",
                })),
                ...doctors.map(d => ({
                    id: d.id,
                    name: `${d.firstName} ${d.lastName}`,
                    email: d.email,
                    password: d.password,
                    phone: "N/A",
                    role: "Doctor",
                })),
                ...ngos.map(n => ({
                    id: n.id,
                    name: n.name,
                    email: n.email,
                    password: n.password,
                    phone: n.phone,
                    role: "NGO",
                })),
                ...pharmacies.map(ph => ({
                    id: ph.id,
                    name: ph.name,
                    email: ph.email,
                    password: ph.password,
                    phone: ph.phone,
                    role: "Pharmacy",
                })),
                ...admins.map(a => ({
                    id: a.id,
                    name: `${a.firstName} ${a.lastName}`,
                    email: a.email,
                    password: a.password,
                    phone: "N/A",
                    role: "Admin",
                })),
            ];

            return res.status(200).json(allAccounts);
        }

        // 📌 Handle DELETE request
        if (req.method === "DELETE") {
            const { id, role } = req.body;

            if (!id || !role) {
                return res.status(400).json({ error: "Missing account ID or role" });
            }

            let deletedRecord;
            switch (role) {
                case "Patient":
                    deletedRecord = await prisma.patients_signup.delete({
                        where: { patient_id: id },
                    });
                    break;
                case "Doctor":
                    deletedRecord = await prisma.Doctor.delete({
                        where: { id },
                    });
                    break;
                case "NGO":
                    deletedRecord = await prisma.NGO.delete({
                        where: { id },
                    });
                    break;
                case "Pharmacy":
                    deletedRecord = await prisma.Pharmacy.delete({
                        where: { id },
                    });
                    break;
                case "Admin":
                    deletedRecord = await prisma.Admin.delete({
                        where: { id },
                    });
                    break;
                default:
                    return res.status(400).json({ error: "Invalid role" });
            }

            return res.status(200).json({ message: "Account deleted successfully", deletedRecord });
        }

        return res.status(405).json({ error: "Method not allowed" });
    } catch (error) {
        console.error("Error managing accounts:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
