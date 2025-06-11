import React from 'react';

const PrivacyPolicyModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-5xl p-6 rounded-lg overflow-y-auto max-h-[90vh] text-xs leading-relaxed text-gray-800">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-xl font-semibold text-gray-600 hover:text-red-600"
        >
          &times;
        </button>

        <h2 className="text-lg font-bold mb-4 text-center">Privacy Policy – Gen-ZIP</h2>
        <p><strong>1. Introduction:</strong> This Privacy Policy is published by <strong>Serenique Technologies LLP</strong>, the legal entity operating the brand <strong>Gen-ZIP</strong>, a platform designed for verified in-person candidate interviews and fraud prevention.</p>

        <p><strong>2. Legal Entity Notice:</strong> All references to “we”, “our”, or “us” in this document refer to <strong>Serenique Technologies LLP</strong>. All services and technology solutions offered under the name “Gen-ZIP” are proprietary assets of Serenique Technologies LLP.</p>

        <p><strong>3. Scope:</strong> This policy applies to users interacting with Gen-ZIP services: Employers, HRs, Interviewers, Candidates, and GenZippers (field verification agents).</p>
       
        <p><strong>4. Consent:</strong> By using the platform, you expressly consent to the collection and usage of your data as outlined herein. You may revoke consent, but core services may become inaccessible.</p>

        <p><strong>5. Use of Data:</strong> Data is used to: (i) verify identity, (ii) match candidates and companies, (iii) conduct interviews, (iv) prevent fraud or impersonation, (v) assist legal authorities upon official request.</p>

        <p><strong>6. Data Retention:</strong> All media and text logs are retained for a minimum of 180 days for compliance and dispute resolution. Users may request deletion post this period if legal and functional obligations allow.</p>

        <p><strong>7. Disclosure:</strong> We do not sell or trade your personal data. We may share it with verified stakeholders (e.g., interviewer, HR of the same company, GenZipper assigned) and legal authorities when legally obligated.</p>

        <p><strong>8. Video and Audio Data:</strong> Interviews are recorded in-person. These recordings are stored in encrypted form and are accessible only to the company’s HR and interviewer panel. Unauthorized distribution is prohibited.</p>

        <p><strong>9. Third-Party Services:</strong> We use services like Twilio (for calls, OTP), Stripe (for payments), and may use AWS/GCP for hosting. Each third-party vendor has its own privacy and compliance policies.</p>

        <p><strong>10. Candidate Responsibility:</strong> If a candidate engages in impersonation, location spoofing, or provides forged documents, Gen-ZIP reserves the right to blacklist the individual and initiate legal action under IPC Sections 417, 420, and the IT Act 66D.</p>

        <p><strong>11. HR & Company Misconduct:</strong> Uploading fake interview schedules, ghosting candidates, or exploiting the platform for non-legitimate recruitment may lead to account suspension, public blacklisting, and termination of paid services without refund.</p>

        <p><strong>12. GenZipper Conduct:</strong> Field agents are expected to maintain professionalism, confidentiality, and real-time check-ins. Misuse of power, harassment, or recording outside the scope will lead to criminal prosecution and internal blacklisting.</p>

        <p><strong>13. Security:</strong> All data is encrypted (AES-256 standard). Only authorized role-based access is allowed. Internal audits are performed quarterly. Breach incidents, if any, will be notified under CERT-IN guidelines.</p>

        <p><strong>14. Payment Security:</strong> Stripe handles card details; Gen-ZIP never stores or processes raw card numbers. Refunds are processed per our <i>Refund Policy</i>, typically within 5–7 business days of request.</p>

        <p><strong>15. Legal Compliance:</strong> We adhere to Indian laws (IT Act 2000, Personal Data Protection Bill drafts) and adopt certain GDPR principles voluntarily. Jurisdiction lies with Hyderabad courts.</p>

        <p><strong>16. Minors:</strong> This platform is strictly for users aged 18 and above. If a minor is found using our services, we will delete their data immediately upon verification.</p>
        <p><strong>17. Information We Collect:</strong> We collect identification details (name, contact, government ID), biometric identifiers (photos, video), device data, IP logs, interview metadata, payment history, and location data (for GenZippers).</p>

        <p><strong>18. Limitation of Liability:</strong> Gen-ZIP shall not be held liable for damages arising from user negligence, third-party data leaks, or use of platform data outside intended scope. Users agree to indemnify Gen-ZIP in such cases.</p>

        <p><strong>19. Changes to This Policy:</strong> We may update this policy from time to time. Changes will be reflected with a new date, and continued use of the service implies acceptance.</p>

        <p><strong>20. Contact Us:</strong> For any queries or legal notices, write to: support@gen-zip.in<br/>
        📍 Serenique Technologies LLP, Hyderabad, India
        </p>

        <h2 className="text-lg font-bold mb-4 text-center">Terms & Conditions</h2>

<p><strong>1. Agreement:</strong> These Terms and Conditions constitute a binding agreement between the user (Company, HR, Candidate, Interviewer, or GenZipper) and <strong>Serenique Technologies LLP</strong>, the owner and operator of the Gen-ZIP platform.</p>

<p><strong>2. Service Description:</strong> Gen-ZIP provides technology and manpower to enable verified candidate interviews, identity checks, and secure interview guidance.</p>

<p><strong>3. No Guarantee:</strong> While we ensure strong anti-fraud checks, we do not guarantee hiring outcomes, candidate performance, or interviewer behavior beyond the scope of platform facilitation.</p>

<p><strong>4. Payments:</strong> All payments are processed through Stripe. Invoices will reflect the name <strong>Serenique Technologies LLP</strong>. No refunds will be provided unless clearly outlined under the Refund Policy.</p>

<p><strong>5. Prohibited Activities:</strong> Any attempt to misuse the platform for impersonation, data theft, or solicitation outside Gen-ZIP interfaces will lead to legal action under applicable Indian laws.</p>

<p><strong>6. Intellectual Property:</strong> All designs, text, software, and videos on the platform are owned by Serenique Technologies LLP and cannot be reused without permission.</p>

<p><strong>7. Governing Law:</strong> These terms are governed by Indian law. Jurisdiction lies with the courts of Hyderabad, Telangana.</p>

<p><strong>8. Termination:</strong> Serenique Technologies LLP reserves the right to suspend or terminate any account found in violation of these terms without notice or refund.</p>

<p><strong>9. Company Details:</strong><br/>
Legal Entity: Serenique Technologies LLP<br/>
Brand: Gen-ZIP<br/>
Registered Address: Hyderabad, Telangana<br/>
Support: support@gen-zip.in
</p>

<p><em>Effective from: June 10, 2025</em></p>

        <p><em>Last updated: June 10, 2025</em></p>

      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
