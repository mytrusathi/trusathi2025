"use client";
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  HelpCircle, Mail, MessageSquare, ShieldCheck, 
  ChevronDown, ChevronUp, Send, CheckCircle2 
} from 'lucide-react';

const FAQS = [
  {
    question: "How does the community verification work?",
    answer: "Every Group Admin on TruSathi is personally verified by our super admins. When an admin uploads a profile, they are vouching for the authenticity of that candidate within their specific community (e.g., local samaj or religious group)."
  },
  {
    question: "Is TruSathi free to use?",
    answer: "Registration and profile browsing are currently free. We believe in making authentic matchmaking accessible to everyone through their trusted community networks."
  },
  {
    question: "How can I hide my profile?",
    answer: "You can toggle your profile visibility between 'Public' and 'Hidden' at any time from your dashboard settings. If hidden, your profile will not appear in search results."
  },
  {
    question: "How do I contact a match?",
    answer: "To ensure safety, contact details are only visible to logged-in users. Once you find a match, you can view their guardian's or their own contact number as provided in the biodata."
  },
  {
    id: "safety",
    question: "What safety measures should I take?",
    answer: "Always verify details independently before making financial commitments. TruSathi provides a layer of trust through community admins, but we recommend meeting in public places and involving family members in the initial conversations."
  }
];

export default function SupportPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [submitted, setSubmitted] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Logic for contact form submission would go here
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="grow">
        {/* Header */}
        <div className="bg-slate-900 pt-20 pb-32 px-4 text-center">
           <div className="max-w-3xl mx-auto space-y-6">
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">How can we help?</h1>
              <p className="text-slate-400 text-lg md:text-xl font-medium">
                 Find answers to common questions or reach out to our dedicated support team.
              </p>
           </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 -mt-16 pb-20 grid grid-cols-1 lg:grid-cols-3 gap-12">
           
           {/* FAQ Section */}
           <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100">
                 <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                    <HelpCircle className="text-rose-500" /> Frequently Asked Questions
                 </h2>
                 
                 <div className="space-y-4">
                    {FAQS.map((faq, index) => (
                      <div 
                        key={index} 
                        id={faq.id}
                        className={`border rounded-2xl transition-all ${openIndex === index ? 'border-rose-200 bg-rose-50/30' : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'}`}
                      >
                         <button 
                           onClick={() => toggleFaq(index)}
                           className="w-full px-6 py-5 text-left flex items-center justify-between gap-4"
                         >
                            <span className={`font-bold ${openIndex === index ? 'text-rose-700' : 'text-slate-700'}`}>{faq.question}</span>
                            {openIndex === index ? <ChevronUp className="text-rose-500 shrink-0" /> : <ChevronDown className="text-slate-400 shrink-0" />}
                         </button>
                         
                         {openIndex === index && (
                           <div className="px-6 pb-6 text-slate-600 leading-relaxed text-sm animate-in fade-in slide-in-from-top-1 duration-300">
                              {faq.answer}
                           </div>
                         )}
                      </div>
                    ))}
                 </div>
              </div>

              {/* Safety Badge */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6">
                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                    <ShieldCheck size={32} />
                 </div>
                 <div>
                    <h3 className="text-lg font-bold text-indigo-900 mb-1">Your Safety is Our Priority</h3>
                    <p className="text-indigo-700/80 text-sm">
                       We use a combination of automated systems and manual community verification to keep TruSathi safe for everyone. Never share financial information with matches.
                    </p>
                 </div>
              </div>
           </div>

           {/* Contact Form */}
           <div className="space-y-8">
              <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-24">
                 {submitted ? (
                    <div className="text-center py-12 space-y-4">
                       <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
                          <CheckCircle2 size={40} />
                       </div>
                       <h3 className="text-2xl font-bold text-slate-900">Message Sent!</h3>
                       <p className="text-slate-500">
                          Thank you for reaching out. Our support team will respond to your inquiry via email within 24 hours.
                       </p>
                       <button 
                         onClick={() => setSubmitted(false)}
                         className="text-rose-600 font-bold hover:underline pt-4"
                       >
                          Send another message
                       </button>
                    </div>
                 ) : (
                    <>
                       <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                          <MessageSquare className="text-rose-500" size={20} /> Contact Us
                       </h2>
                       
                       <form onSubmit={handleContact} className="space-y-4">
                          <div className="space-y-1">
                             <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                             <input 
                               type="text" 
                               required 
                               className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                               placeholder="John Doe"
                             />
                          </div>
                          <div className="space-y-1">
                             <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                             <input 
                               type="email" 
                               required 
                               className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                               placeholder="john@example.com"
                             />
                          </div>
                          <div className="space-y-1">
                             <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                             <select className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-rose-500/20 outline-none transition-all">
                                <option>Technical Issue</option>
                                <option>Account Approval</option>
                                <option>Report a Profile</option>
                                <option>General Inquiry</option>
                             </select>
                          </div>
                          <div className="space-y-1">
                             <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Message</label>
                             <textarea 
                               required 
                               rows={4}
                               className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-rose-500/20 outline-none transition-all resize-none"
                               placeholder="How can we help you today?"
                             ></textarea>
                          </div>
                          
                          <button 
                            type="submit"
                            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-2"
                          >
                             <Send size={18} /> Send Message
                          </button>
                       </form>

                       <div className="mt-8 pt-8 border-t border-slate-50 text-center">
                          <p className="text-sm text-slate-400 mb-2 font-medium">Or email us directly at</p>
                          <a href="mailto:support@trusathi.com" className="text-indigo-600 font-bold hover:underline flex items-center justify-center gap-2">
                             <Mail size={16} /> support@trusathi.com
                          </a>
                       </div>
                    </>
                 )}
              </div>
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
