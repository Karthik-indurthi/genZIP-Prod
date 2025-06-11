// utils/sendWelcomeEmail.ts
import emailjs from 'emailjs-com';

export const sendWelcomeEmail = async (
  toEmail: string,
  tempPassword: string,
  toName: string
) => {
  const serviceId = 'service_gxh3kin'; // replace with your actual ID
  const templateId = 'template_xlpeky5'; // from EmailJS template
  const publicKey = 'jNoKhPLJc9aK6QdIn'; // from EmailJS dashboard
  const baseUrl = window.location.origin; // gets localhost or production domain
  const loginUrl = `${baseUrl}/login`; 
  console.log("EmailJS login link:", loginUrl);  

  const templateParams = {
    to_name: toName,
    email: toEmail,
    password: tempPassword,
    login_link: loginUrl,
  };
  console.log('Sending EmailJS with params:', templateParams);

  return emailjs.send(serviceId, templateId, templateParams, publicKey);
};
