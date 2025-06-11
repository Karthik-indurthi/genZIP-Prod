import React from 'react';
import { Interview } from '../../pages/Dashboard/Dashboard.js';
import {
  CheckCircle,
  Clock,
  UploadCloud,
  AlertTriangle,
} from 'lucide-react'; // ✅ Optional icon set (or use emojis)

interface InterviewListProps {
  interviews: Interview[];
}

const statusStyles: Record<Interview['status'], { label: string; color: string; icon: JSX.Element }> = {
  awaiting_confirmation: {
    label: 'Awaiting',
    color: 'bg-blue-100 text-blue-800',
    icon: <Clock size={16} className="inline-block mr-1" />,
  },
  scheduled: {
    label: 'Scheduled',
    color: 'bg-yellow-100 text-yellow-800',
    icon: <AlertTriangle size={16} className="inline-block mr-1" />,
  },
  completed: {
    label: 'completed',
    color: 'bg-green-100 text-green-800',
    icon: <CheckCircle size={16} className="inline-block mr-1" />,
  },
  processed: {
    label: 'Processed',
    color: 'bg-indigo-100 text-indigo-800',
    icon: <UploadCloud size={16} className="inline-block mr-1" />,
  },
};

const InterviewList: React.FC<InterviewListProps> = ({ interviews }) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow-md">
      <table className="min-w-full bg-white border border-gray-200 text-sm">
        <thead className="bg-gray-50 text-gray-700 font-semibold">
          <tr>
            <th className="py-2 px-4 border-b text-left">Candidate</th>
            <th className="py-2 px-4 border-b text-left">Email</th>
            <th className="py-2 px-4 border-b text-left">Phone</th>
            <th className="py-2 px-4 border-b text-left">Location</th>
            <th className="py-2 px-4 border-b text-left">Date</th>
            <th className="py-2 px-4 border-b text-left">Time</th>
            <th className="py-2 px-4 border-b text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {interviews.map((interview, index) => {
            const statusInfo = statusStyles[interview.status];
            return (
              <tr key={index} className="hover:bg-gray-50 transition">
                <td className="py-2 px-4 border-b">{interview.candidateName} {interview.lastName}</td>
                <td className="py-2 px-4 border-b">{interview.candidateEmail}</td>
                <td className="py-2 px-4 border-b">{interview.candidatePhone}</td>
                <td className="py-2 px-4 border-b">{interview.location}</td>
                <td className="py-2 px-4 border-b">{interview.date}</td>
                <td className="py-2 px-4 border-b">{interview.time}</td>
                <td className="py-2 px-4 border-b">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}>
                    {statusInfo.icon}
                    {statusInfo.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default InterviewList;
