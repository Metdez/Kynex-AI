import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Monitor, Smartphone, Save, Globe, Copy, GripVertical, Edit3, Check, Star, Shield, Phone, ChevronRight, MessageSquare, Quote, HelpCircle } from 'lucide-react';

const defaultSections = [
  { id: 'hero', name: 'Hero', icon: Star },
  { id: 'social-proof', name: 'Social Proof', icon: Shield },
  { id: 'benefits', name: 'Benefits', icon: Check },
  { id: 'testimonials', name: 'Testimonials', icon: Quote },
  { id: 'cta', name: 'Final CTA', icon: Phone },
  { id: 'faq', name: 'FAQ', icon: HelpCircle },
];

const pageContent = {
  hero: {
    headline: 'Transform Your Kitchen Into the Heart of Your Home',
    subheadline: 'Free in-home design consultation with 3D preview. Trusted by 500+ Austin homeowners.',
    cta: 'Book Your Free Consultation',
  },
  socialProof: {
    text: 'Trusted by 500+ Austin Homeowners',
    stats: [
      { label: 'Projects Completed', value: '500+' },
      { label: 'Average Rating', value: '4.9/5' },
      { label: 'Years in Business', value: '15+' },
    ],
  },
  benefits: [
    { title: 'Free 3D Design Preview', description: 'See your new kitchen before construction starts with our photorealistic 3D walkthrough.' },
    { title: 'Transparent Pricing', description: 'Locked-in quotes with no hidden fees. Know exactly what you\'ll pay from day one.' },
    { title: '5-Year Warranty', description: 'Every project backed by our comprehensive 5-year workmanship warranty.' },
  ],
  testimonial: {
    quote: 'Prestige completely transformed our kitchen. From the initial design to the final walkthrough, every detail was perfect. We couldn\'t be happier with the result.',
    author: 'The Thompson Family',
    location: 'Westlake Hills, Austin',
    rating: 5,
  },
  finalCta: {
    headline: 'Ready to Love Your Kitchen?',
    subheadline: 'Book your free in-home consultation today. No obligation, no pressure — just expert advice and a 3D preview of your dream space.',
    cta: 'Schedule My Free Consultation',
  },
};

export default function PageEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [viewport, setViewport] = useState('desktop');
  const [editingSection, setEditingSection] = useState(null);
  const [sections, setSections] = useState(defaultSections);
  const [content, setContent] = useState(pageContent);

  const pageName = id === 'lp1' ? 'Kitchen Remodel — Main' : id === 'lp2' ? 'Bath Renovation — Main' : `Landing Page ${id}`;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/landing-pages')} className="p-1.5 rounded-md hover:bg-slate-100 transition-colors">
            <ArrowLeft size={18} className="text-slate-500" />
          </button>
          <h1 className="text-sm font-semibold text-slate-900">{pageName}</h1>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 rounded-md p-0.5">
          <button
            onClick={() => setViewport('desktop')}
            className={`p-1.5 rounded ${viewport === 'desktop' ? 'bg-white shadow-sm' : ''}`}
          >
            <Monitor size={16} className={viewport === 'desktop' ? 'text-slate-900' : 'text-slate-400'} />
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`p-1.5 rounded ${viewport === 'mobile' ? 'bg-white shadow-sm' : ''}`}
          >
            <Smartphone size={16} className={viewport === 'mobile' ? 'text-slate-900' : 'text-slate-400'} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">
            <Save size={14} /> Save Draft
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
            <Globe size={14} /> Publish
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">
            <Copy size={14} /> Create Variant
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar — section list */}
        <div className="w-56 bg-white border-r border-slate-200 p-3 space-y-1 shrink-0 overflow-y-auto">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-2 mb-2">Sections</h3>
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setEditingSection(editingSection === section.id ? null : section.id)}
                className={`w-full flex items-center gap-2 px-2 py-2 text-sm rounded-md transition-colors ${
                  editingSection === section.id ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <GripVertical size={12} className="text-slate-300 cursor-grab" />
                <Icon size={14} />
                <span className="font-medium">{section.name}</span>
              </button>
            );
          })}
        </div>

        {/* Main preview area */}
        <div className="flex-1 bg-slate-100 overflow-y-auto p-6">
          <div className={`mx-auto bg-white shadow-lg rounded-lg overflow-hidden ${viewport === 'mobile' ? 'max-w-sm' : 'max-w-3xl'}`}>
            {/* Hero Section */}
            <div
              className={`relative bg-gradient-to-br from-blue-700 to-blue-900 text-white p-12 text-center group ${editingSection === 'hero' ? 'ring-2 ring-blue-400' : ''}`}
              onClick={() => setEditingSection('hero')}
            >
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-white text-slate-700 px-2 py-1 rounded text-xs font-medium shadow flex items-center gap-1">
                  <Edit3 size={12} /> Edit Section
                </span>
              </div>
              {editingSection === 'hero' ? (
                <div className="space-y-4">
                  <input
                    value={content.hero.headline}
                    onChange={e => setContent({ ...content, hero: { ...content.hero, headline: e.target.value } })}
                    className="w-full bg-transparent border border-white/30 rounded px-3 py-2 text-3xl font-bold text-center focus:outline-none focus:border-white"
                  />
                  <input
                    value={content.hero.subheadline}
                    onChange={e => setContent({ ...content, hero: { ...content.hero, subheadline: e.target.value } })}
                    className="w-full bg-transparent border border-white/30 rounded px-3 py-1 text-lg text-center text-white/80 focus:outline-none focus:border-white"
                  />
                  <input
                    value={content.hero.cta}
                    onChange={e => setContent({ ...content, hero: { ...content.hero, cta: e.target.value } })}
                    className="bg-transparent border border-white/30 rounded px-3 py-1 text-center font-semibold focus:outline-none focus:border-white"
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold mb-4">{content.hero.headline}</h1>
                  <p className="text-lg text-white/80 mb-8 max-w-lg mx-auto">{content.hero.subheadline}</p>
                  <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
                    {content.hero.cta}
                  </button>
                </>
              )}
            </div>

            {/* Social Proof Bar */}
            <div
              className={`bg-slate-50 py-6 px-8 group ${editingSection === 'social-proof' ? 'ring-2 ring-blue-400' : ''}`}
              onClick={() => setEditingSection('social-proof')}
            >
              <div className="flex items-center justify-around">
                {content.socialProof.stats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits Section */}
            <div
              className={`py-12 px-8 group ${editingSection === 'benefits' ? 'ring-2 ring-blue-400' : ''}`}
              onClick={() => setEditingSection('benefits')}
            >
              <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Why Choose Prestige?</h2>
              <div className="grid grid-cols-3 gap-6">
                {content.benefits.map((benefit, i) => (
                  <div key={i} className="text-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                      <Check size={20} className="text-blue-600" />
                    </div>
                    {editingSection === 'benefits' ? (
                      <>
                        <input
                          value={benefit.title}
                          onChange={e => {
                            const updated = [...content.benefits];
                            updated[i] = { ...updated[i], title: e.target.value };
                            setContent({ ...content, benefits: updated });
                          }}
                          className="w-full text-center text-sm font-semibold text-slate-900 bg-transparent border border-slate-200 rounded px-2 py-1 mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <textarea
                          value={benefit.description}
                          onChange={e => {
                            const updated = [...content.benefits];
                            updated[i] = { ...updated[i], description: e.target.value };
                            setContent({ ...content, benefits: updated });
                          }}
                          rows={3}
                          className="w-full text-center text-xs text-slate-600 bg-transparent border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </>
                    ) : (
                      <>
                        <h3 className="text-sm font-semibold text-slate-900 mb-1">{benefit.title}</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">{benefit.description}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial Section */}
            <div
              className={`bg-slate-50 py-12 px-8 group ${editingSection === 'testimonials' ? 'ring-2 ring-blue-400' : ''}`}
              onClick={() => setEditingSection('testimonials')}
            >
              <div className="max-w-xl mx-auto text-center">
                <div className="flex justify-center mb-4">
                  {Array.from({ length: content.testimonial.rating }).map((_, i) => (
                    <Star key={i} size={18} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                {editingSection === 'testimonials' ? (
                  <textarea
                    value={content.testimonial.quote}
                    onChange={e => setContent({ ...content, testimonial: { ...content.testimonial, quote: e.target.value } })}
                    rows={3}
                    className="w-full text-center text-slate-700 italic bg-transparent border border-slate-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-slate-700 italic leading-relaxed mb-4">&ldquo;{content.testimonial.quote}&rdquo;</p>
                )}
                <p className="text-sm font-semibold text-slate-900">{content.testimonial.author}</p>
                <p className="text-xs text-slate-500">{content.testimonial.location}</p>
              </div>
            </div>

            {/* Final CTA */}
            <div
              className={`bg-gradient-to-br from-slate-800 to-slate-900 text-white py-12 px-8 text-center group ${editingSection === 'cta' ? 'ring-2 ring-blue-400' : ''}`}
              onClick={() => setEditingSection('cta')}
            >
              {editingSection === 'cta' ? (
                <div className="space-y-3">
                  <input
                    value={content.finalCta.headline}
                    onChange={e => setContent({ ...content, finalCta: { ...content.finalCta, headline: e.target.value } })}
                    className="w-full bg-transparent border border-white/30 rounded px-3 py-2 text-2xl font-bold text-center focus:outline-none focus:border-white"
                  />
                  <input
                    value={content.finalCta.subheadline}
                    onChange={e => setContent({ ...content, finalCta: { ...content.finalCta, subheadline: e.target.value } })}
                    className="w-full bg-transparent border border-white/30 rounded px-3 py-1 text-center text-white/70 focus:outline-none focus:border-white"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-3">{content.finalCta.headline}</h2>
                  <p className="text-white/70 mb-6 max-w-lg mx-auto">{content.finalCta.subheadline}</p>
                </>
              )}
              <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors mt-4">
                {content.finalCta.cta}
              </button>
              <p className="text-xs text-white/50 mt-3">Free consultation · No obligation · Serving Austin, TX</p>
            </div>

            {/* FAQ placeholder */}
            <div
              className={`py-8 px-8 group ${editingSection === 'faq' ? 'ring-2 ring-blue-400' : ''}`}
              onClick={() => setEditingSection('faq')}
            >
              <h2 className="text-xl font-bold text-slate-900 text-center mb-6">Frequently Asked Questions</h2>
              {[
                { q: 'How long does a typical kitchen remodel take?', a: 'Most kitchen remodels take 4-8 weeks from start to finish, depending on the scope of the project.' },
                { q: 'Do you offer financing?', a: 'Yes! We partner with several financing providers to offer flexible payment plans with competitive rates.' },
                { q: 'What does the free consultation include?', a: 'Our designer visits your home, takes measurements, discusses your vision, and creates a photorealistic 3D preview of your new space.' },
              ].map((item, i) => (
                <div key={i} className="border-b border-slate-200 py-3 last:border-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-900">{item.q}</span>
                    <ChevronRight size={14} className="text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
