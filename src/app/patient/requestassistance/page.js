"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../components/Header/page";
import "./page.css";

export default function RequestAssistance() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    // We no longer store fullName, cnic, phone
    medicalCondition: "",
    assistanceType: "",
    medicalReport: null,
    additionalMessage: "",
    totalExpenditure: "Rs ",
    selfFinance: "Rs ",
  });
  const [errors, setErrors] = useState({});

  // List of assistance types
  const assistanceTypes = ["FINANCIAL_AID", "MEDICATION", "CONSULTATION"];

  // ───────────────────────────────────────────────────────────────────
  // 1) Auto-refresh logic (if you still need it)
  // ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    const pathname = window.location.pathname;
    const refreshKey = `page_refreshed_${pathname}`;
    const now = Date.now();
    const lastRefreshTime = localStorage.getItem(refreshKey);
    if (!lastRefreshTime || now - parseInt(lastRefreshTime) > 5000) {
      localStorage.setItem(refreshKey, now.toString());
      setTimeout(() => {
        window.location.reload();
      }, 10);
    }
  }, []);

  // ───────────────────────────────────────────────────────────────────
  // 2) Fetch the logged-in user to get userId from server
  // ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/getUser", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          const data = await response.json();
          setUserId(data.patient.patient_id);
        } else {
          throw new Error("Failed to fetch user");
        }
      } catch (error) {
        toast.error("Please log in to request assistance.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        });
        router.push("/patient/login");
      }
    };
    fetchUser();
  }, [router]);

  // ───────────────────────────────────────────────────────────────────
  // 3) Handle input changes
  // ───────────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, medicalReport: e.target.files[0] }));
    setErrors((prev) => ({ ...prev, medicalReport: "" }));
  };

  const handleTotalExpenditureChange = (e) => {
    let { value } = e.target;
    if (value.startsWith("Rs ")) {
      value = value.substring(3);
    }
    const numbersOnly = value.replace(/[^\d.]/g, "");
    setFormData((prev) => ({
      ...prev,
      totalExpenditure: numbersOnly ? `Rs ${numbersOnly}` : "",
    }));
    setErrors((prev) => ({ ...prev, totalExpenditure: "" }));
  };

  const handleSelfFinanceChange = (e) => {
    let { value } = e.target;
    if (value.startsWith("Rs ")) {
      value = value.substring(3);
    }
    const numbersOnly = value.replace(/[^\d.]/g, "");
    setFormData((prev) => ({
      ...prev,
      selfFinance: numbersOnly ? `Rs ${numbersOnly}` : "",
    }));
    setErrors((prev) => ({ ...prev, selfFinance: "" }));
  };

  // ───────────────────────────────────────────────────────────────────
  // 4) Form Submit
  // ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    // Basic validations
    if (!formData.medicalCondition) {
      newErrors.medicalCondition = "Medical Condition is required";
    }
    if (!formData.assistanceType) {
      newErrors.assistanceType = "Assistance Type is required";
    }
    if (!formData.medicalReport) {
      newErrors.medicalReport = "Medical Report is required";
    }
    if (!formData.totalExpenditure) {
      newErrors.totalExpenditure = "Total Expenditure is required";
    }
    if (!formData.selfFinance) {
      newErrors.selfFinance = "Self Finance is required";
    }

    // Check numeric validity
    let totalExpValue = formData.totalExpenditure.replace(/[^\d.]/g, "");
    let selfFinanceValue = formData.selfFinance.replace(/[^\d.]/g, "");

    if (!totalExpValue || isNaN(parseFloat(totalExpValue))) {
      newErrors.totalExpenditure = "Total Expenditure must be a valid number";
    }
    if (!selfFinanceValue || isNaN(parseFloat(selfFinanceValue))) {
      newErrors.selfFinance = "Self Finance must be a valid number";
    }
    if (
      !newErrors.totalExpenditure &&
      !newErrors.selfFinance &&
      parseFloat(selfFinanceValue) > parseFloat(totalExpValue)
    ) {
      newErrors.selfFinance =
        "Self Finance cannot be greater than Total Expenditure";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Build form data
    const fd = new FormData();
    fd.append("user_id", userId); // The server uses this to look up patient's name/cnic/phone
    fd.append("medicalCondition", formData.medicalCondition);
    fd.append("assistanceType", formData.assistanceType);
    if (formData.medicalReport) {
      fd.append("medicalReport", formData.medicalReport);
    }
    fd.append("additionalMessage", formData.additionalMessage);
    fd.append("totalExpenditure", totalExpValue);
    fd.append("selfFinance", selfFinanceValue);

    try {
      const response = await fetch("/api/auth/requestAssistance", {
        method: "POST",
        body: fd,
      });
      const data = await response.json();
      console.log("Response status:", response.status);
      console.log("Response data:", data);

      if (response.ok) {
        toast.success(data.message || "Request submitted successfully!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        });
        router.push("/patient");
      } else {
        console.error("Error:", data.error);
        toast.error(data.error || "Error submitting request. Please try again.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("An error occurred. Please try again.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer />
      <Header />
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
        <h2
          className="text-2xl font-bold text-green-600 text-center mb-4"
          style={{ paddingTop: "60px" }}
        >
          Request Assistance
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Fill out the form to request assistance from NGOs.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* No fullName, cnic, or phone fields */}
          
          {/* Medical Condition */}
          <textarea
            name="medicalCondition"
            placeholder="Describe your health condition"
            value={formData.medicalCondition}
            onChange={handleChange}
            required
            className={`w-full p-2 border rounded ${
              errors.medicalCondition ? "border-red-500" : ""
            }`}
          ></textarea>
          {errors.medicalCondition && (
            <p className="text-red-500 text-sm">{errors.medicalCondition}</p>
          )}

          {/* Assistance Type */}
          <select
            name="assistanceType"
            value={formData.assistanceType}
            onChange={handleChange}
            required
            className={`w-full p-2 border rounded ${
              errors.assistanceType ? "border-red-500" : ""
            }`}
          >
            <option value="">Select Assistance Type</option>
            {assistanceTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.assistanceType && (
            <p className="text-red-500 text-sm">{errors.assistanceType}</p>
          )}

          {/* Medical Report (file upload) */}
          <div>
            <label className="block text-gray-700 mb-2">
              Upload the medical report
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              required
              className={`w-full p-2 border rounded ${
                errors.medicalReport ? "border-red-500" : ""
              }`}
            />
            {errors.medicalReport && (
              <p className="text-red-500 text-sm">{errors.medicalReport}</p>
            )}
          </div>

          {/* Additional Message (optional) */}
          <textarea
            name="additionalMessage"
            placeholder="Additional Message (Optional)"
            value={formData.additionalMessage}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          ></textarea>

          {/* Total Expenditure */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Total Expenditure</label>
            <input
              type="text"
              name="totalExpenditure"
              placeholder="Enter total expenditure amount"
              value={formData.totalExpenditure}
              onChange={handleTotalExpenditureChange}
              className={`w-full p-2 border rounded ${
                errors.totalExpenditure ? "border-red-500" : ""
              }`}
            />
            {errors.totalExpenditure && (
              <p className="text-red-500 text-sm">{errors.totalExpenditure}</p>
            )}
          </div>

          {/* Self Finance */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Self Finance</label>
            <input
              type="text"
              name="selfFinance"
              placeholder="Enter self-financed amount"
              value={formData.selfFinance}
              onChange={handleSelfFinanceChange}
              className={`w-full p-2 border rounded ${
                errors.selfFinance ? "border-red-500" : ""
              }`}
            />
            {errors.selfFinance && (
              <p className="text-red-500 text-sm">{errors.selfFinance}</p>
            )}
          </div>

          {/* Submit Button */}
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
