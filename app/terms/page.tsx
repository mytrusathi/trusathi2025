// app/terms/page.tsx

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Header Section */}
      <div className="bg-indigo-50 py-12 border-b border-indigo-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">
            Terms and Conditions
          </h1>
          <p className="text-gray-600">
            Please read these terms carefully before using Trusathi.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last Updated: December 2025
          </p>
        </div>
      </div>

      {/* Content Section */}
      <main className="grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12 text-gray-700 leading-relaxed">
          
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="mb-4">
              Welcome to <strong>Trusathi</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). By accessing or using our website, mobile application, and services (collectively, the &quot;Platform&quot;), you agree to be bound by these Terms and Conditions (&quot;Terms&quot;). If you do not agree to these Terms, please do not use our Platform.
            </p>
            <p>
              Trusathi is a community-verified matrimony platform designed to connect individuals for the purpose of marriage through trusted Community Group Admins.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Eligibility</h2>
            <p className="mb-4">
              To use our Platform, you must represent and warrant that:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>You are at least 18 years of age (if female) or 21 years of age (if male), adhering to the legal marriageable age in India.</li>
              <li>You are legally competent to enter into a valid marriage under the laws applicable to you.</li>
              <li>You are not prohibited by any law from entering into matrimony.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Role of Group Admins</h2>
            <p className="mb-4">
              Trusathi operates on a decentralized model relying on <strong>Group Admins</strong>. By using the service, you acknowledge that:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Verification:</strong> Group Admins are responsible for verifying the authenticity of the profiles they upload or approve within their community groups.</li>
              <li><strong>Trust:</strong> While Trusathi provides the technology, the primary trust layer resides with the Group Admin. We encourage users to only join groups administered by individuals they know or trust.</li>
              <li><strong>Liability:</strong> Trusathi is an intermediary. We do not personally verify every profile and are not liable for the conduct or accuracy of Group Admins.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User Accounts & Security</h2>
            <p className="mb-4">
              You agree to provide accurate, current, and complete information during the registration process. You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Code of Conduct</h2>
            <p className="mb-4">Users agree NOT to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Create fake profiles or misrepresent their identity.</li>
              <li>Use the platform for dating, soliciting, or commercial purposes unrelated to matrimony.</li>
              <li>Harass, abuse, or harm another person.</li>
              <li>Post content that is defamatory, obscene, or offensive.</li>
            </ul>
            <p className="mt-4">
              We reserve the right to terminate accounts that violate these guidelines without prior notice.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Disclaimer of Warranties</h2>
            <p className="mb-4">
              The Platform is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. Trusathi does not guarantee that the platform will function without interruption or errors. We do not guarantee a successful match or marriage. Background checks are the responsibility of the users and their families.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
            <p className="mb-4">
              To the fullest extent permitted by law, Trusathi shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Platform.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
              <br />
              <a href="mailto:legal@trusathi.com" className="text-indigo-600 hover:underline font-medium">
                legal@trusathi.com
              </a>
            </p>
          </section>

        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-100 text-center">
            <Link href="/" className="text-indigo-600 font-semibold hover:underline">
                &larr; Back to Home
            </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}