import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Interview } from '../../pages/Dashboard/Dashboard.js';
import { supabase } from '../../supabase.js';


interface InterviewFormProps {
  onAddInterview: (interview: Interview) => void;
}

const steps = [
  'firstName',
  'lastName',
  'emailPhone',
  'companyLocation',
  'dateTimeDuration',
  'comments',
  'review',
  'status',
] as const;

type StepType = (typeof steps)[number];

const InterviewForm: React.FC<InterviewFormProps> = ({ onAddInterview }) => {
  const [step, setStep] = useState<StepType>('firstName');

  const [formData, setFormData] = useState<Interview>({
    candidateName: '',
    lastName: '',
    candidateEmail: '',
    candidatePhone: '',
    location: '',
    date: '',
    time: '',
    duration: '',
    companyName: '',
    zipCode: '',
    comments: '',
    status: 'awaiting_confirmation',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const next = () => {
    const currentIndex = steps.indexOf(step);
    setStep(steps[currentIndex + 1]);
  };

  const back = () => {
    const currentIndex = steps.indexOf(step);
    setStep(steps[currentIndex - 1]);
  };

  const jumpTo = (field: StepType) => {
    setStep(field);
  };

  // Only one handleSubmit function for the entire form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fullData = {
      ...formData,
      candidateName: `${formData.candidateName} ${formData.lastName || ''}`.trim(),
      status:  'awaiting_confirmation' as 'awaiting_confirmation',
    };

    // Call the parent callback
    onAddInterview(fullData);

    // Save to Supabase
    try {
      const { data: userData } = await supabase.auth.getUser();
      await supabase.from('InterviewsTable').insert([
        {
          ...fullData,
          created_by: userData?.user?.id || ''
        }
      ]);
      console.log('Interview saved to Supabase');
    } catch (error) {
      console.error('Error saving to Supabase:', error);
    }

    alert('Interview scheduled!');
    setFormData({
      candidateName: '',
      lastName: '',
      candidateEmail: '',
      candidatePhone: '',
      location: '',
      date: '',
      time: '',
      duration: '',
      companyName: '',
      zipCode: '',
      comments: '',
      status: 'awaiting_confirmation',
    });

    setStep('firstName');
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {step === 'firstName' && (
          <motion.div
            key="firstName"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              type="text"
              name="candidateName"
              value={formData.candidateName}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded mb-4"
              required
            />
            <button onClick={next} className="bg-blue-600 text-white px-4 py-2 rounded">
              Next
            </button>
          </motion.div>
        )}

        {step === 'lastName' && (
          <motion.div
            key="lastName"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded mb-4"
            />
            <div className="flex justify-between">
              <button onClick={back} className="text-sm text-gray-500">Back</button>
              <button onClick={next} className="bg-blue-600 text-white px-4 py-2 rounded">
                Next
              </button>
            </div>
          </motion.div>
        )}

        {step === 'emailPhone' && (
          <motion.div
            key="emailPhone"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="candidateEmail"
              value={formData.candidateEmail}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded mb-4"
              required
            />
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              name="candidatePhone"
              value={formData.candidatePhone}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded mb-4"
              required
            />
            <div className="flex justify-between">
              <button onClick={back} className="text-sm text-gray-500">Back</button>
              <button onClick={next} className="bg-blue-600 text-white px-4 py-2 rounded">
                Next
              </button>
            </div>
          </motion.div>
        )}

        {step === 'companyLocation' && (
          <motion.div
            key="companyLocation"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <label className="block text-sm font-medium mb-1">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded mb-4"
              required
            />
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded mb-4"
              required
            />
            <label className="block text-sm font-medium mb-1">Zip Code</label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded mb-4"
              required
            />
            <div className="flex justify-between">
              <button onClick={back} className="text-sm text-gray-500">Back</button>
              <button onClick={next} className="bg-blue-600 text-white px-4 py-2 rounded">
                Next
              </button>
            </div>
          </motion.div>
        )}

        {step === 'dateTimeDuration' && (
          <motion.div
            key="dateTimeDuration"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded mb-4"
              required
            />
            <label className="block text-sm font-medium mb-1">Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded mb-4"
              required
            />
            <label className="block text-sm font-medium mb-1">Duration (in minutes)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded mb-4"
              required
            />
            <div className="flex justify-between">
              <button onClick={back} className="text-sm text-gray-500">Back</button>
              <button onClick={next} className="bg-blue-600 text-white px-4 py-2 rounded">
                Next
              </button>
            </div>
          </motion.div>
        )}

        {step === 'comments' && (
          <motion.div
            key="comments"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <label className="block text-sm font-medium mb-1">Comments</label>
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded mb-4"
              rows={3}
            />
            <div className="flex justify-between">
              <button onClick={back} className="text-sm text-gray-500">Back</button>
              <button onClick={next} className="bg-blue-600 text-white px-4 py-2 rounded">
                Review
              </button>
            </div>
          </motion.div>
        )}

        {step === 'review' && (
          <motion.div
            key="review"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-bold mb-2">Review Your Details</h3>
            <ul className="text-sm text-gray-700 space-y-2 mb-4">
              <li>👤 {formData.candidateName} {(formData as any).lastName}</li>
              <li>📧 {formData.candidateEmail}</li>
              <li>📱 {formData.candidatePhone}</li>
              <li>🏢 {formData.companyName}</li>
              <li>📍 {formData.location} - {formData.zipCode}</li>
              <li>🗓️ {formData.date} at {formData.time} ({formData.duration} mins)</li>
              <li>📝 {formData.comments || 'No comments'}</li>
            </ul>
            <div className="flex justify-between">
              <button onClick={() => jumpTo('firstName')} className="text-blue-600 underline text-sm">
                Edit
              </button>
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Confirm & Schedule
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InterviewForm;
