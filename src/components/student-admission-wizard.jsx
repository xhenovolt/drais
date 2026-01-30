/**
 * Student Admission Wizard Component
 * DRAIS v0.0.0045
 * 
 * Multi-step wizard for admitting new students
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentAdmissionWizard({ onComplete, onSuccess, onCancel }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState([]);

  // Form data state
  const [formData, setFormData] = useState({
    basicInfo: {
      firstName: '',
      lastName: '',
      givenName: '',
      dateOfBirth: '',
      gender: ''
    },
    familyInfo: {
      fatherName: '',
      fatherContact: '',
      fatherOccupation: '',
      fatherDeceased: false,
      guardianName: '',
      guardianContact: '',
      guardianOccupation: '',
      orphanStatus: null,
      familyNotes: '',
      nextOfKin: []
    },
    contactInfo: {
      studentPhone: '',
      studentEmail: '',
      homeAddress: '',
      contacts: []
    },
    additionalInfo: {
      placeOfBirth: '',
      placeOfResidence: '',
      previousSchool: '',
      orphanStatus: '',
      notes: ''
    },
    documents: [],
    classId: null
  });

  const steps = [
    { id: 1, name: 'Basic Info', desc: 'Student personal details' },
    { id: 2, name: 'Parent/Guardian', desc: 'Family information' },
    { id: 3, name: 'Contacts & Address', desc: 'Contact details' },
    { id: 4, name: 'Additional Details', desc: 'Extra information' },
    { id: 5, name: 'Documents', desc: 'Upload files (optional)' },
    { id: 6, name: 'Review & Confirm', desc: 'Review before submission' }
  ];

  const handleNext = () => {
    // Validate current step
    const validation = validateStep(currentStep);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors([]);
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors([]);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setErrors([]);

      const response = await fetch('/api/students/admit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to admit student');
      }

      // Generate admission form PDF
      const studentId = result.data.studentId;
      const pdfResponse = await fetch(`/api/students/${studentId}/admission-form`, {
        method: 'POST',
      });

      const pdfResult = await pdfResponse.json();

      // Trigger download
      if (pdfResult.success && pdfResult.data.fileUrl) {
        const link = document.createElement('a');
        link.href = pdfResult.data.fileUrl;
        link.download = pdfResult.data.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // Call onSuccess/onComplete callback or redirect
      if (onSuccess) {
        onSuccess(result.data);
      } else if (onComplete) {
        onComplete(result.data);
      } else {
        router.push(`/students?success=admitted&id=${studentId}`);
      }

    } catch (error) {
      console.error('Admission error:', error);
      setErrors([error.message]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateStep = (step) => {
    const errors = [];

    switch (step) {
      case 1: // Basic Info
        if (!formData.basicInfo.firstName) errors.push('First name is required');
        if (!formData.basicInfo.lastName) errors.push('Last name is required');
        if (!formData.basicInfo.dateOfBirth) errors.push('Date of birth is required');
        if (!formData.basicInfo.gender) errors.push('Gender is required');
        break;
      
      case 2: // Family Info
        // Optional - no mandatory fields, but can validate format
        break;

      case 3: // Contacts
        // Optional but validate email format if provided
        if (formData.contactInfo.studentEmail) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(formData.contactInfo.studentEmail)) {
            errors.push('Invalid email format');
          }
        }
        break;

      case 4: // Additional Details
        // All optional
        break;

      case 5: // Documents
        // Validate file types
        if (formData.documents && formData.documents.length > 0) {
          const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
          for (const doc of formData.documents) {
            if (!allowedTypes.includes(doc.mimeType)) {
              errors.push(`Invalid file type: ${doc.fileName}. Only PDF, JPG, PNG allowed`);
            }
            if (doc.fileSize > 5 * 1024 * 1024) {
              errors.push(`File too large: ${doc.fileName}. Max 5MB`);
            }
          }
        }
        break;
    }

    return {
      valid: errors.length === 0,
      errors
    };
  };

  const updateFormData = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicInfo formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <Step2FamilyInfo formData={formData} updateFormData={updateFormData} setFormData={setFormData} />;
      case 3:
        return <Step3Contacts formData={formData} updateFormData={updateFormData} setFormData={setFormData} />;
      case 4:
        return <Step4AdditionalInfo formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <Step5Documents formData={formData} setFormData={setFormData} />;
      case 6:
        return <Step6Review formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                    currentStep >= step.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step.id}
                </div>
                <div className="text-xs mt-2 text-center">
                  <div className="font-medium">{step.name}</div>
                  <div className="text-gray-500">{step.desc}</div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-2 transition-colors ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-semibold text-red-800 mb-2">Please fix the following errors:</h4>
          <ul className="list-disc list-inside text-red-700">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {steps[currentStep - 1].name}
        </h2>
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <div>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>

        <div className="flex gap-4">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrevious}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
          )}

          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit & Generate Form'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Step 1: Basic Information
function Step1BasicInfo({ formData, updateFormData }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.basicInfo.firstName}
            onChange={(e) => updateFormData('basicInfo', 'firstName', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.basicInfo.lastName}
            onChange={(e) => updateFormData('basicInfo', 'lastName', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Given Name (Optional)
        </label>
        <input
          type="text"
          value={formData.basicInfo.givenName}
          onChange={(e) => updateFormData('basicInfo', 'givenName', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-sm text-gray-500 mt-1">Middle name or additional name</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.basicInfo.dateOfBirth}
            onChange={(e) => updateFormData('basicInfo', 'dateOfBirth', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.basicInfo.gender}
            onChange={(e) => updateFormData('basicInfo', 'gender', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// Step 2: Family Information
function Step2FamilyInfo({ formData, updateFormData, setFormData }) {
  const [showGuardianSection, setShowGuardianSection] = useState(false);

  return (
    <div className="space-y-6">
      {/* Father Information */}
      <div className="border-b pb-4">
        <h3 className="font-semibold text-lg mb-4">Father's Information</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Father's Name
            </label>
            <input
              type="text"
              value={formData.familyInfo.fatherName}
              onChange={(e) => {
                updateFormData('familyInfo', 'fatherName', e.target.value);
                if (!e.target.value) setShowGuardianSection(true);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Father's Contact
              </label>
              <input
                type="tel"
                value={formData.familyInfo.fatherContact}
                onChange={(e) => updateFormData('familyInfo', 'fatherContact', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Father's Occupation
              </label>
              <input
                type="text"
                value={formData.familyInfo.fatherOccupation}
                onChange={(e) => updateFormData('familyInfo', 'fatherOccupation', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="fatherDeceased"
              checked={formData.familyInfo.fatherDeceased}
              onChange={(e) => {
                updateFormData('familyInfo', 'fatherDeceased', e.target.checked);
                if (e.target.checked) setShowGuardianSection(true);
              }}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="fatherDeceased" className="ml-2 text-sm text-gray-700">
              Father is deceased
            </label>
          </div>
        </div>
      </div>

      {/* Guardian Information */}
      {(showGuardianSection || !formData.familyInfo.fatherName) && (
        <div>
          <h3 className="font-semibold text-lg mb-4">Guardian Information</h3>
          <p className="text-sm text-gray-600 mb-4">
            {formData.familyInfo.fatherDeceased
              ? 'Father is deceased. Please provide guardian information.'
              : 'No father information provided. Please add guardian details.'}
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Guardian's Name
              </label>
              <input
                type="text"
                value={formData.familyInfo.guardianName}
                onChange={(e) => updateFormData('familyInfo', 'guardianName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guardian's Contact
                </label>
                <input
                  type="tel"
                  value={formData.familyInfo.guardianContact}
                  onChange={(e) => updateFormData('familyInfo', 'guardianContact', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guardian's Occupation
                </label>
                <input
                  type="text"
                  value={formData.familyInfo.guardianOccupation}
                  onChange={(e) => updateFormData('familyInfo', 'guardianOccupation', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Death Certificate Upload (if father deceased) */}
      {formData.familyInfo.fatherDeceased && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Death Certificate (Optional)</h4>
          <p className="text-sm text-blue-700 mb-3">
            You can upload the father's death certificate if available.
          </p>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="text-sm"
          />
        </div>
      )}

      {/* Letter from Imaam (Optional) */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Letter from Imaam (Optional)</h4>
        <p className="text-sm text-gray-700 mb-3">
          Upload a recommendation letter from Imaam if available.
        </p>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="text-sm"
        />
      </div>
    </div>
  );
}

// Step 3: Contacts & Address
function Step3Contacts({ formData, updateFormData }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.contactInfo.studentPhone}
            onChange={(e) => updateFormData('contactInfo', 'studentPhone', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+256 XXX XXXXXX"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={formData.contactInfo.studentEmail}
            onChange={(e) => updateFormData('contactInfo', 'studentEmail', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="student@example.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Home Address
        </label>
        <textarea
          value={formData.contactInfo.homeAddress}
          onChange={(e) => updateFormData('contactInfo', 'homeAddress', e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter full home address"
        />
      </div>
    </div>
  );
}

// Step 4: Additional Details
function Step4AdditionalInfo({ formData, updateFormData }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Place of Birth
          </label>
          <input
            type="text"
            value={formData.additionalInfo.placeOfBirth}
            onChange={(e) => updateFormData('additionalInfo', 'placeOfBirth', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Place of Residence
          </label>
          <input
            type="text"
            value={formData.additionalInfo.placeOfResidence}
            onChange={(e) => updateFormData('additionalInfo', 'placeOfResidence', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Orphan Status
        </label>
        <select
          value={formData.additionalInfo.orphanStatus}
          onChange={(e) => updateFormData('additionalInfo', 'orphanStatus', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select status</option>
          <option value="none">Not an orphan</option>
          <option value="maternal">Maternal orphan</option>
          <option value="paternal">Paternal orphan</option>
          <option value="double">Double orphan</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Previous School (if any)
        </label>
        <input
          type="text"
          value={formData.additionalInfo.previousSchool}
          onChange={(e) => updateFormData('additionalInfo', 'previousSchool', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Name of previous school"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Special Notes
        </label>
        <textarea
          value={formData.additionalInfo.notes}
          onChange={(e) => updateFormData('additionalInfo', 'notes', e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Any additional information, special needs, allergies, etc."
        />
      </div>
    </div>
  );
}

// Step 5: Documents Upload
function Step5Documents({ formData, setFormData }) {
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    // Process files
    const processedFiles = files.map(file => ({
      fileName: file.name,
      mimeType: file.type,
      fileSize: file.size,
      fileUrl: URL.createObjectURL(file), // Temporary URL
      file: file // Store file object for actual upload
    }));

    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...processedFiles]
    }));
  };

  const removeDocument = (index) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <input
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileUpload}
          className="hidden"
          id="document-upload"
        />
        <label
          htmlFor="document-upload"
          className="cursor-pointer inline-flex flex-col items-center"
        >
          <svg
            className="w-12 h-12 text-gray-400 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <span className="text-sm text-gray-600">
            Click to upload documents or drag and drop
          </span>
          <span className="text-xs text-gray-500 mt-1">
            PDF, JPG, PNG up to 5MB each
          </span>
        </label>
      </div>

      {/* Uploaded Documents */}
      {formData.documents.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Uploaded Documents</h4>
          {formData.documents.map((doc, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-blue-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-900">{doc.fileName}</p>
                  <p className="text-xs text-gray-500">
                    {(doc.fileSize / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeDocument(index)}
                className="text-red-600 hover:text-red-800"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Step 6: Review & Confirm
function Step6Review({ formData }) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">Review Information</h3>
        <p className="text-sm text-blue-700">
          Please review all information before submitting. You can go back to any step to make changes.
        </p>
      </div>

      {/* Basic Info */}
      <div className="border-b pb-4">
        <h4 className="font-semibold text-gray-800 mb-3">Basic Information</h4>
        <dl className="grid grid-cols-2 gap-3">
          <div>
            <dt className="text-sm text-gray-600">Full Name</dt>
            <dd className="font-medium">
              {formData.basicInfo.firstName} {formData.basicInfo.givenName} {formData.basicInfo.lastName}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-600">Date of Birth</dt>
            <dd className="font-medium">{formData.basicInfo.dateOfBirth || 'N/A'}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-600">Gender</dt>
            <dd className="font-medium capitalize">{formData.basicInfo.gender || 'N/A'}</dd>
          </div>
        </dl>
      </div>

      {/* Family Info */}
      {(formData.familyInfo.fatherName || formData.familyInfo.guardianName) && (
        <div className="border-b pb-4">
          <h4 className="font-semibold text-gray-800 mb-3">Family Information</h4>
          <dl className="grid grid-cols-2 gap-3">
            {formData.familyInfo.fatherName && (
              <>
                <div>
                  <dt className="text-sm text-gray-600">Father's Name</dt>
                  <dd className="font-medium">{formData.familyInfo.fatherName}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">Father's Contact</dt>
                  <dd className="font-medium">{formData.familyInfo.fatherContact || 'N/A'}</dd>
                </div>
              </>
            )}
            {formData.familyInfo.guardianName && (
              <>
                <div>
                  <dt className="text-sm text-gray-600">Guardian's Name</dt>
                  <dd className="font-medium">{formData.familyInfo.guardianName}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">Guardian's Contact</dt>
                  <dd className="font-medium">{formData.familyInfo.guardianContact || 'N/A'}</dd>
                </div>
              </>
            )}
          </dl>
        </div>
      )}

      {/* Contact Info */}
      {(formData.contactInfo.studentPhone || formData.contactInfo.studentEmail) && (
        <div className="border-b pb-4">
          <h4 className="font-semibold text-gray-800 mb-3">Contact Information</h4>
          <dl className="grid grid-cols-2 gap-3">
            {formData.contactInfo.studentPhone && (
              <div>
                <dt className="text-sm text-gray-600">Phone</dt>
                <dd className="font-medium">{formData.contactInfo.studentPhone}</dd>
              </div>
            )}
            {formData.contactInfo.studentEmail && (
              <div>
                <dt className="text-sm text-gray-600">Email</dt>
                <dd className="font-medium">{formData.contactInfo.studentEmail}</dd>
              </div>
            )}
            {formData.contactInfo.homeAddress && (
              <div className="col-span-2">
                <dt className="text-sm text-gray-600">Address</dt>
                <dd className="font-medium">{formData.contactInfo.homeAddress}</dd>
              </div>
            )}
          </dl>
        </div>
      )}

      {/* Documents */}
      {formData.documents.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Documents</h4>
          <p className="text-sm text-gray-600">{formData.documents.length} document(s) attached</p>
        </div>
      )}

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
        <p className="text-sm text-green-800">
          ✓ After submission, an admission form will be automatically generated and downloaded.
        </p>
      </div>
    </div>
  );
}
