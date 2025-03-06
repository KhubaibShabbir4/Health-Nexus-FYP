"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../Header/page";

export default function RequestAssistance() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: '',
        cnic: '',
        contact: '',
        medicalCondition: '',
        assistanceType: '',
        preferredNgo: '',
        medicalReport: null,
        additionalMessage: ''
    });

    const [errors, setErrors] = useState({});

    const ngos = ["Al-Khidmat", "Edhi Foundation", "Shaukat Khanum", "Saylani Welfare"];
    const assistanceTypes = ["Financial Aid", "Medication", "Consultation", "Other"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear error when user starts typing
        setErrors({ ...errors, [name]: "" });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            const validTypes = ["application/pdf", "image/jpeg", "image/png"];
            if (!validTypes.includes(file.type)) {
                setErrors({ ...errors, medicalReport: "Only PDF, JPG, and PNG files are allowed." });
                return;
            }

            setFormData({ ...formData, medicalReport: file });
            setErrors({ ...errors, medicalReport: "" });
        }
    };

    const validateForm = () => {
        let newErrors = {};

        // Full Name Validation
        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full Name is required.";
        }

        // CNIC Validation (Must be 13-digit numeric)
        if (!/^\d{13}$/.test(formData.cnic)) {
            newErrors.cnic = "CNIC must be exactly 13 numeric digits.";
        }

        // Contact Number Validation (Must be 10-digit numeric)
        if (!/^\d{10}$/.test(formData.contact)) {
            newErrors.contact = "Contact Number must be exactly 10 numeric digits.";
        }

        // Medical Condition Validation (At least 20 characters)
        if (formData.medicalCondition.trim().length < 20) {
            newErrors.medicalCondition = "Medical condition must be at least 20 characters.";
        }

        // Assistance Type Validation (Must be selected)
        if (!formData.assistanceType) {
            newErrors.assistanceType = "Please select an Assistance Type.";
        }

        // Preferred NGO Validation (Must be selected)
        if (!formData.preferredNgo) {
            newErrors.preferredNgo = "Please select a Preferred NGO.";
        }

        // Medical Report Validation (File is required)
        if (!formData.medicalReport) {
            newErrors.medicalReport = "Please upload a medical report.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (validateForm()) {
            try {
                const formDataToSend = new FormData();
                formDataToSend.append("fullName", formData.fullName);
                formDataToSend.append("cnic", formData.cnic);
                formDataToSend.append("contact", formData.contact);
                formDataToSend.append("medicalCondition", formData.medicalCondition);
                formDataToSend.append("assistanceType", formData.assistanceType);
                formDataToSend.append("preferredNgo", formData.preferredNgo);
                formDataToSend.append("medicalReport", formData.medicalReport); // File upload
                formDataToSend.append("additionalMessage", formData.additionalMessage || "");
    
                const response = await fetch("/api/auth/assistance", {
                    method: "POST",
                    body: formDataToSend, // ✅ Remove `headers` because FormData sets the correct content type
                });
    
                const result = await response.json();
                if (response.ok) {
                    alert("Assistance request submitted successfully!");
                    console.log("Server Response:", result);
                    router.push("/patient");
                } else {
                    alert("Failed to submit request.");
                    console.error("Server Error:", result);
                }
            } catch (error) {
                console.error("Submission error:", error);
            }
        }
    };
    
    
    
    

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Header />
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
                <h2 className="text-2xl font-bold text-green-600 text-center mb-4" style={{ paddingTop: "60px" }}>
                    Request Assistance
                </h2>
                <p className="text-gray-600 text-center mb-6">
                    Fill out the form to request assistance from NGOs.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                    {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}

                    <input
                        type="text"
                        name="cnic"
                        placeholder="CNIC / ID Number (13 digits)"
                        value={formData.cnic}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                    {errors.cnic && <p className="text-red-500 text-sm">{errors.cnic}</p>}

                    <input
                        type="text"
                        name="contact"
                        placeholder="Contact Number (10 digits)"
                        value={formData.contact}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                    {errors.contact && <p className="text-red-500 text-sm">{errors.contact}</p>}

                    <textarea
                        name="medicalCondition"
                        placeholder="Describe your medical condition (Min 20 characters)"
                        value={formData.medicalCondition}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                    {errors.medicalCondition && <p className="text-red-500 text-sm">{errors.medicalCondition}</p>}

                    <select
                        name="assistanceType"
                        value={formData.assistanceType}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Select Assistance Type</option>
                        {assistanceTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                    {errors.assistanceType && <p className="text-red-500 text-sm">{errors.assistanceType}</p>}

                    <select
                        name="preferredNgo"
                        value={formData.preferredNgo}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Select Preferred NGO</option>
                        {ngos.map((ngo) => (
                            <option key={ngo} value={ngo}>
                                {ngo}
                            </option>
                        ))}
                    </select>
                    {errors.preferredNgo && <p className="text-red-500 text-sm">{errors.preferredNgo}</p>}
                    <label className="block text-sm text-gray-600">Upload Medical Report</label>
                    <input type="file" onChange={handleFileChange} className="w-full p-2 border rounded" />
                    {errors.medicalReport && <p className="text-red-500 text-sm">{errors.medicalReport}</p>}

                    <textarea
                        name="additionalMessage"
                        placeholder="Additional Message (Optional)"
                        value={formData.additionalMessage}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                    >
                        Submit Request
                    </button>
                </form>
            </div>
        </div>
    );
}
