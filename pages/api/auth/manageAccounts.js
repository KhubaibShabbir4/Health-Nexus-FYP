import { PrismaClient } from "@prisma/client";

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      // Fetch from all tables concurrently
      const [
        manageAccounts,
        doctors,
        ngos,
        pharmacies,
        admins,
        patients,
      ] = await Promise.all([
        prisma.manageAccount.findMany(),
        prisma.doctor.findMany(),
        prisma.nGO.findMany(),
        prisma.pharmacy.findMany(),
        prisma.admin.findMany(),
        prisma.patientLogin.findMany(),
      ]);

      // Transform each into a common structure
      const allAccounts = [
        ...manageAccounts.map((acc) => ({
          id: acc.id,
          name: acc.name,
          email: acc.email,
          password: acc.password,
          phone: acc.phone ?? "N/A",
          role: acc.role || "user",
          createdAt: acc.createdAt,
        })),

        ...doctors.map((doc) => ({
          id: doc.id,
          name: `${doc.firstName} ${doc.lastName}`,
          email: doc.email,
          password: doc.password,
          phone: "N/A",
          role: doc.role || "doctor",
          createdAt: doc.createdAt,
        })),

        ...ngos.map((ngo) => ({
          id: ngo.id,
          name: ngo.name,
          email: ngo.email,
          password: ngo.password,
          phone: ngo.phone ?? "N/A",
          role: ngo.role || "ngo",
          createdAt: ngo.createdAt,
        })),

        ...pharmacies.map((pharma) => ({
          id: pharma.id,
          name: pharma.name,
          email: pharma.email,
          password: pharma.password,
          phone: pharma.phone ?? "N/A",
          role: pharma.role || "pharmacy",
          createdAt: pharma.createdAt,
        })),

        ...admins.map((adm) => ({
          id: adm.id,
          name: `${adm.firstName} ${adm.lastName}`,
          email: adm.email,
          password: adm.password,
          phone: "N/A",
          role: adm.role || "admin",
          createdAt: adm.createdAt,
        })),

        ...patients.map((pat) => ({
          id: pat.patient_id,
          name: pat.full_name,
          email: pat.email,
          password: pat.password_hash || "********",
          phone: pat.phone ?? "N/A",
          role: "Patient",
          createdAt: pat.created_at,
        })),
      ];

      return res.status(200).json(allAccounts);
    }
    // ─────────────────────────────────────────────────────────────────────────
    //  PUT: Update record in the correct table
    // ─────────────────────────────────────────────────────────────────────────
    if (req.method === "PUT") {
      const { id, name, email, phone, role } = req.body;
      if (!id) {
        return res.status(400).json({ error: "ID is required" });
      }

      // Convert ID to number
      const recordId = Number(id);

      let updatedRecord;
      // role-based logic
      if (role === "doctor") {
        updatedRecord = await prisma.doctor.update({
          where: { id: recordId },
          data: {
            firstName: name, // or split the name into first/last if you prefer
            email,
            // phone not in doctor schema by default? If you have it, add it
          },
        });
      } else if (role === "ngo") {
        updatedRecord = await prisma.nGO.update({
          where: { id: recordId },
          data: {
            name,
            email,
            phone,
          },
        });
      } else if (role === "pharmacy") {
        updatedRecord = await prisma.pharmacy.update({
          where: { id: recordId },
          data: {
            name,
            email,
            phone,
          },
        });
      } else if (role === "admin") {
        // admin has firstName/lastName by default
        // We'll store entire "name" in firstName, or split if needed
        updatedRecord = await prisma.admin.update({
          where: { id: recordId },
          data: {
            firstName: name,
            email,
            // no phone in admin schema by default
          },
        });
      } else if (role === "Patient") {
        // patient table uses "patientLogin" with fields like full_name, phone, etc.
        updatedRecord = await prisma.patientLogin.update({
          where: { patient_id: recordId },
          data: {
            full_name: name,
            email,
            phone,
          },
        });
      } else {
        // default = manageAccount
        updatedRecord = await prisma.manageAccount.update({
          where: { id: recordId },
          data: {
            name,
            email,
            phone,
          },
        });
      }

      return res.status(200).json(updatedRecord);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  DELETE: Remove record from the correct table
    // ─────────────────────────────────────────────────────────────────────────
    if (req.method === "DELETE") {
      const { id, role } = req.body;
      if (!id) {
        return res.status(400).json({ error: "ID is required" });
      }

      const recordId = Number(id);

      // role-based logic again
      if (role === "doctor") {
        await prisma.doctor.delete({ where: { id: recordId } });
      } else if (role === "ngo") {
        await prisma.nGO.delete({ where: { id: recordId } });
      } else if (role === "pharmacy") {
        await prisma.pharmacy.delete({ where: { id: recordId } });
      } else if (role === "admin") {
        await prisma.admin.delete({ where: { id: recordId } });
      } else if (role === "Patient") {
        await prisma.patientLogin.delete({ where: { patient_id: recordId } });
      } else {
        // default = manageAccount
        await prisma.manageAccount.delete({ where: { id: recordId } });
      }

      return res.status(200).json({ message: "Account deleted successfully" });
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  If none matched
    // ─────────────────────────────────────────────────────────────────────────
    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("API Error:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
