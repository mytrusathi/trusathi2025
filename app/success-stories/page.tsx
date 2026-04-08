import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { Heart, Star, Quote } from 'lucide-react';
import Link from 'next/link';

const SUCCESS_STORIES = [
  {
    id: 1,
    names: 'Rahul & Priya',
    story: 'We found each other through the Agarwal Community group on TruSathi. The verification process gave our families the confidence we needed to take the next step.',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800',
    date: 'Married March 2025'
  },
  {
    id: 2,
    names: 'Amit & Sneha',
    story: 'TruSathi made it so easy to find someone with shared values. Being able to see who verified the profile made all the difference in our search.',
    image: 'https://images.unsplash.com/photo-1511285560929-86b160016144?auto=format&fit=crop&q=80&w=800',
    date: 'Married January 2025'
  },
  {
    id: 3,
    names: 'Vikram & Anjali',
    story: 'Highly recommend TruSathi for anyone looking for authentic matches. The platform is clean, fast, and the community admins are incredibly helpful.',
    image: 'https://images.unsplash.com/photo-1621112904887-419379ce6824?auto=format&fit=crop&q=80&w=800',
    date: 'Married February 2025'
  }
];

export default function SuccessStoriesPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="grow">
        <div className="bg-rose-600 pt-20 pb-32 px-4 text-center">
           <div className="max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-full text-sm font-bold backdrop-blur-sm border border-white/20">
                 <Star size={18} className="fill-white" /> Real Success Stories
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Happily Ever Afters</h1>
              <p className="text-rose-100 text-lg md:text-xl font-medium opacity-90">
                 Join thousands of happy couples who found their perfect life partner through our verified community network.
              </p>
           </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 -mt-16 pb-20">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {SUCCESS_STORIES.map((story) => (
                <div key={story.id} className="bg-white rounded-4xl overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100 group">
                   <div className="h-64 relative overflow-hidden">
                      <Image 
                        src={story.image} 
                        alt={story.names}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-6 left-6 text-white font-bold text-xl">{story.names}</div>
                   </div>
                   
                   <div className="p-8 space-y-4">
                      <Quote className="text-rose-100 fill-rose-100" size={40} />
                      <p className="text-slate-600 leading-relaxed italic">
                         &quot;{story.story}&quot;
                      </p>
                      <div className="pt-4 flex items-center gap-2 text-rose-600 font-bold text-sm">
                         <Heart size={16} className="fill-rose-600" /> {story.date}
                      </div>
                   </div>
                </div>
              ))}
           </div>

           {/* Call to Action */}
           <div className="mt-20 bg-indigo-900 rounded-5xl p-12 md:p-20 text-center text-white space-y-8 relative overflow-hidden shadow-3xl shadow-indigo-100">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
              
              <h2 className="text-3xl md:text-5xl font-black tracking-tight relative z-10">Ready to start your own story?</h2>
              <p className="text-indigo-200 text-lg max-w-2xl mx-auto relative z-10">
                 Create your verified profile today and start exploring matches from your own community and beyond.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                 <Link href="/register" className="bg-rose-600 hover:bg-rose-700 text-white px-10 py-4 rounded-2xl font-black text-lg transition-all shadow-xl shadow-rose-900/20">
                    Register Free
                 </Link>
                 <Link href="/search" className="bg-white/10 hover:bg-white/20 text-white px-10 py-4 rounded-2xl font-black text-lg backdrop-blur-md border border-white/20 transition-all">
                    Browse Matches
                 </Link>
              </div>
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
