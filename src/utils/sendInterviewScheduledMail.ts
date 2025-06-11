import emailjs from 'emailjs-com';

export const sendInterviewScheduledMail = async ({
  candidateName,
  candidateEmail,
  jobTitle,
  interviewerName,
  interviewDate,
  fromTime,
  toTime,
  interviewId,
}: {
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  interviewerName: string;
  interviewDate: string;
  fromTime: string;
  toTime: string;
  interviewId: string;
}) => {
  const serviceId = 'service_gxh3kin';         // ✅ From working welcome email
  const templateId = 'template_uisways';       // ✅ Matches your confirmed template
  const publicKey = 'jNoKhPLJc9aK6QdIn';        // ✅ Your working public key

  const baseUrl = window.location.origin;
  const locationUploadLink = `${baseUrl}/location-upload/${interviewId}`;

  const templateParams = {
    candidate_name: candidateName,
    to_email: candidateEmail,
    job_title: jobTitle,
    interview_date: interviewDate,
    interview_time: `${fromTime} to ${toTime}`,
    interviewer_name: interviewerName,
    location_upload_link: locationUploadLink,
  };

  try {
    const result = await emailjs.send(serviceId, templateId, templateParams, publicKey);
    console.log('📧 Interview email sent successfully:', result.text);
    return true;
  } catch (error) {
    console.error('❌ Failed to send interview email:', error);
    return false;
  }
};
