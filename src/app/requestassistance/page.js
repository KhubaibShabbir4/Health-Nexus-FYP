'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

    const ngos = ['Al-Khidmat', 'Edhi Foundation', 'Shaukat Khanum', 'Saylani Welfare'];
    const assistanceTypes = ['Financial Aid', 'Medication', 'Consultation', 'Other'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, medicalReport: e.target.files[0] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Assistance request submitted successfully!');
        router.push('/patient');
    };

    return (
        
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
             <Header /> 
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
                <h2 className="text-2xl font-bold text-green-600 text-center mb-4"  style={{ paddingTop: "60px" }}>Request Assistance</h2>
                <p className="text-gray-600 text-center mb-6">Fill out the form to request assistance from NGOs.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required className="w-full p-2 border rounded" />
                    <input type="text" name="cnic" placeholder="CNIC / ID Number" value={formData.cnic} onChange={handleChange} required className="w-full p-2 border rounded" />
                    <input type="text" name="contact" placeholder="Contact Number" value={formData.contact} onChange={handleChange} required className="w-full p-2 border rounded" />
                    <textarea name="medicalCondition" placeholder="Describe your medical condition" value={formData.medicalCondition} onChange={handleChange} required className="w-full p-2 border rounded"></textarea>
                    <select name="assistanceType" value={formData.assistanceType} onChange={handleChange} required className="w-full p-2 border rounded">
                        <option value="">Select Assistance Type</option>
                        {assistanceTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                    <select name="preferredNgo" value={formData.preferredNgo} onChange={handleChange} required className="w-full p-2 border rounded">
                        <option value="">Select Preferred NGO</option>
                        {ngos.map(ngo => <option key={ngo} value={ngo}>{ngo}</option>)}
                    </select>
                    <input type="file" onChange={handleFileChange} required className="w-full p-2 border rounded" />
                    <textarea name="additionalMessage" placeholder="Additional Message (Optional)" value={formData.additionalMessage} onChange={handleChange} className="w-full p-2 border rounded"></textarea>
                    <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">Submit Request</button>
                </form>
            </div>
        </div>
    );
}
