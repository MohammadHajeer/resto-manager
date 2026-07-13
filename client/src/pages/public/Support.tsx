import React, { useState, useMemo } from 'react';
import { 
  Search, Send, Users, Store, Loader2,
  ChevronDown, MessageSquare, Mail, AlertCircle, Sparkles, BookOpen, Clock, Settings, ShoppingBag, Terminal
} from 'lucide-react';
import { toast } from 'sonner';

// Custom interface for Help Topics
interface HelpTopic {
  id: string;
  category: 'owner' | 'customer' | 'both';
  title: string;
  description: string;
  icon: React.ElementType;
}

// Custom interface for FAQ Item
interface FAQItem {
  id: string;
  category: 'owner' | 'customer' | 'general';
  question: string;
  answer: string;
}

export default function Support() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaqId, setActiveFaqId] = useState<string | null>(null);
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'owner' | 'customer'>('all');
  
  // Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    userType: 'owner',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Static list of interactive Help Topics
  const helpTopics: HelpTopic[] = [
    {
      id: 'login-reg',
      category: 'both',
      title: 'Login & Registration',
      description: 'Troubleshooting accounts creation, reset security links, and setup password rules.',
      icon: Users
    },
    {
      id: 'reg-status',
      category: 'owner',
      title: 'Restaurant Onboarding Status',
      description: 'Find out what stage your merchant verification is at and how to expedite review.',
      icon: Store
    },
    {
      id: 'update-info',
      category: 'owner',
      title: 'Updating Restaurant Details',
      description: 'Modify address coordinates, brand logos, banners, cuisine types, and description.',
      icon: Settings
    },
    {
      id: 'opening-hours',
      category: 'owner',
      title: 'Managing Opening Hours',
      description: 'Set custom kitchen timetables, holiday schedules, and special slot closures.',
      icon: Clock
    },
    {
      id: 'menu-items',
      category: 'owner',
      title: 'Categories & Menu Items',
      description: 'Add dishes, update ingredients, configure pricing parameters, and categorize listings.',
      icon: BookOpen
    },
    {
      id: 'orders',
      category: 'both',
      title: 'Order Status & Tracking',
      description: 'Follow active customer tickets, cook times, courier dispatches, and refunds.',
      icon: ShoppingBag
    },
    {
      id: 'tech-issues',
      category: 'both',
      title: 'Reporting Technical Issues',
      description: 'Resolve local printer sync failures, dashboard connection drops, or map bugs.',
      icon: Terminal
    }
  ];

  // Static list of FAQs matching the requirements
  const faqItems: FAQItem[] = [
    {
      id: 'faq-1',
      category: 'general',
      question: 'How do I create a new customer or merchant account?',
      answer: 'Simply click the Register option in the primary header. Restaurant owners should fill in their commercial credentials, while customers can sign up with basic coordinates to instantly browse local menus.'
    },
    {
      id: 'faq-2',
      category: 'owner',
      question: 'Why is my restaurant listing pending verification?',
      answer: 'To protect customer safety, our support administrators review submitted food permits, tax filings, and physical store photos. This vetting process typically wraps up within 24 to 48 working hours.'
    },
    {
      id: 'faq-3',
      category: 'owner',
      question: 'How do I adjust kitchen active hours during holidays?',
      answer: 'Navigate to your Owner Dashboard, open the Settings drawer, and head to the Business Hours schedule. There you can set one-off vacation closures or modify normal weekly operation windows.'
    },
    {
      id: 'faq-4',
      category: 'owner',
      question: 'Can I upload food images in any file type and size?',
      answer: 'We support JPG, PNG, WebP, and non-animated GIF formats. To maintain fast application load times, files are capped at 5MB each. They are automatically optimized for web rendering upon uploading.'
    },
    {
      id: 'faq-5',
      category: 'customer',
      question: 'What is your policy regarding active order cancellations?',
      answer: 'Customers can cancel orders freely within 2 minutes of placement. Once the restaurant kitchen board shifts the order status to "In Progress" or "Preparing", culinary expenses are committed and refunds are restricted.'
    },
    {
      id: 'faq-6',
      category: 'general',
      question: 'How do I update or purge my personal database logs?',
      answer: 'You have full data rights. You can adjust listing profiles instantly inside the console Settings page. If you would like to permanently delete your entire record, submit a deletion ticket below and our safety team will complete the purge within 14 business days.'
    }
  ];

  // Search and Role filter logic
  const filteredTopics = useMemo(() => {
    return helpTopics.filter(topic => {
      const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            topic.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = userRoleFilter === 'all' || topic.category === userRoleFilter || topic.category === 'both';
      return matchesSearch && matchesRole;
    });
  }, [searchQuery, userRoleFilter]);

  const filteredFaqs = useMemo(() => {
    return faqItems.filter(item => {
      const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = userRoleFilter === 'all' || item.category === userRoleFilter || item.category === 'general';
      return matchesSearch && matchesRole;
    });
  }, [searchQuery, userRoleFilter]);

  // Form input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  // Toggle FAQ Accordion
  const toggleFaq = (id: string) => {
    setActiveFaqId(prev => (prev === id ? null : id));
  };

  // Form submission handler
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple Validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email address';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) {
      newErrors.message = 'Please write a message';
    } else if (formData.message.trim().length < 15) {
      newErrors.message = 'Your explanation should be at least 15 characters long';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please resolve the errors highlighted in the form.');
      return;
    }

    // Submit Simulation
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Your support request was logged successfully!', {
        description: 'Our assistance team will email you back within 6-12 hours.',
        duration: 5000
      });
      // Reset Form
      setFormData({
        name: '',
        email: '',
        userType: 'owner',
        subject: '',
        message: ''
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
      {/* Interactive Hero Intro */}
      <div className="bg-gradient-to-b from-white to-background border-b border-border py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
            <Sparkles size={12} className="animate-pulse" /> Always here to assist you
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight leading-none">
            Support
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed font-medium">
            How can we help? Search our integrated knowledge guides, filter dedicated customer or merchant topics, or reach out directly to our live ticket response dispatch.
          </p>

          {/* Interactive Topic Search Bar */}
          <div className="max-w-md mx-auto relative pt-4">
            <div className="absolute inset-y-0 left-3 top-4 flex items-center pointer-events-none text-muted-foreground">
              <Search size={18} className="mt-3" />
            </div>
            <input
              type="text"
              placeholder="Search help topics, questions, errors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-border focus:border-primary focus:ring-2 focus:ring-primary/25 rounded-2xl text-sm font-semibold transition-all shadow-xs"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-7.5 text-xs text-muted-foreground hover:text-primary font-bold"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Primary Layout Container */}
      <main className="flex-1 py-12 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full space-y-12">
        
        {/* Quick Role Filters and Topic Bento Grid */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-border pb-4">
            <h2 className="text-xl font-black text-foreground tracking-tight">
              Knowledge Base Topics
            </h2>
            {/* Filter Pills */}
            <div className="flex gap-2 p-1 bg-muted rounded-xl border border-border/60">
              <button
                onClick={() => setUserRoleFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  userRoleFilter === 'all' 
                    ? 'bg-white text-primary shadow-xs' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                All Help
              </button>
              <button
                onClick={() => setUserRoleFilter('owner')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  userRoleFilter === 'owner' 
                    ? 'bg-white text-primary shadow-xs' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                For Restaurants
              </button>
              <button
                onClick={() => setUserRoleFilter('customer')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  userRoleFilter === 'customer' 
                    ? 'bg-white text-primary shadow-xs' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                For Customers
              </button>
            </div>
          </div>

          {/* Topics Grid */}
          {filteredTopics.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTopics.map((topic) => {
                const TopicIcon = topic.icon;
                return (
                  <div 
                    key={topic.id}
                    onClick={() => {
                      setSearchQuery(topic.title);
                      toast(`Filtering context: ${topic.title}`, { duration: 1500 });
                    }}
                    className="bg-white p-5 rounded-2xl border border-border hover:border-primary hover:shadow-xs transition-all text-left cursor-pointer group"
                  >
                    <div className="w-10 h-10 bg-secondary/60 group-hover:bg-secondary rounded-xl flex items-center justify-center text-primary-foreground mb-4 transition-all">
                      <TopicIcon className="w-5 h-5 text-secondary-foreground" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {topic.description}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 bg-white border border-dashed border-border rounded-2xl">
              <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-bold text-foreground">No specific help topics match your query.</p>
              <p className="text-xs text-muted-foreground mt-0.5">Try widening your keyterms or click "Clear" above.</p>
            </div>
          )}
        </div>

        {/* Audience Specialized Panels Section */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Customer Support Hub */}
          <div className="bg-gradient-to-br from-white to-muted/20 p-6 sm:p-8 rounded-3xl border border-border text-left space-y-4">
            <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-secondary-foreground">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-foreground tracking-tight">Customer Care Desk</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                If you are a dining customer experiencing delivery delays, kitchen cancellation issues, double payment authorizations, or account detail inaccuracies.
              </p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-border/80 space-y-2">
              <span className="text-[10px] font-extrabold uppercase text-primary tracking-widest block">Core SLA</span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We handle live customer complaints instantly. Our dispatch desk connects directly with third-party riders to track culinary delivery vectors.
              </p>
            </div>
          </div>

          {/* Restaurant Merchant Hub */}
          <div className="bg-gradient-to-br from-white to-muted/20 p-6 sm:p-8 rounded-3xl border border-border text-left space-y-4">
            <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-secondary-foreground">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-foreground tracking-tight">Restaurant Partner Suite</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Dedicated support for onboarding merchants. Resolve menu pricing failures, manage operational schedules, resolve invoice payouts, or troubleshoot POS setups.
              </p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-border/80 space-y-2">
              <span className="text-[10px] font-extrabold uppercase text-primary tracking-widest block">Onboarding SLA</span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Verify license applications within 24-48h. Premium partners get assigned a direct commercial representative for priority assistance.
              </p>
            </div>
          </div>
        </div>

        {/* Animated FAQ Section with custom accordion */}
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-foreground tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-muted-foreground font-semibold">
              Instant answers to typical questions asked by store owners and clients
            </p>
          </div>

          <div className="space-y-3 mt-6">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((item) => {
                const isOpen = activeFaqId === item.id;
                return (
                  <div 
                    key={item.id}
                    className="bg-white rounded-2xl border border-border transition-all overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFaq(item.id)}
                      className="w-full flex justify-between items-center p-4 sm:p-5 text-left font-bold text-sm text-foreground hover:text-primary transition-colors cursor-pointer select-none"
                    >
                      <span className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          item.category === 'owner' ? 'bg-secondary-foreground' : item.category === 'customer' ? 'bg-blue-500' : 'bg-primary'
                        }`} />
                        {item.question}
                      </span>
                      <ChevronDown 
                        size={16} 
                        className={`text-muted-foreground transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-primary' : ''}`} 
                      />
                    </button>
                    
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs text-muted-foreground leading-relaxed border-t border-muted bg-muted/10 animate-fade-in text-left">
                        {item.answer}
                        <div className="mt-3 pt-2 border-t border-muted flex items-center justify-between text-[10px] font-bold">
                          <span className="capitalize text-slate-400">Category: {item.category} Help</span>
                          <button 
                            onClick={() => {
                              setFormData(prev => ({ ...prev, subject: `Ref: ${item.question}` }));
                              toast.success('Subject updated in support form below!');
                              document.getElementById('support-form-anchor')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="text-primary hover:underline"
                          >
                            Still need help? Ask us
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6 bg-white border border-dashed border-border rounded-2xl">
                <p className="text-sm font-semibold text-muted-foreground">No specific FAQ items match your text search.</p>
              </div>
            )}
          </div>
        </div>

        {/* Interactive Contact Support Form */}
        <div id="support-form-anchor" className="max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-border shadow-xs space-y-6">
          <div className="text-center space-y-1">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-foreground tracking-tight mt-2">Submit Assistance Ticket</h3>
            <p className="text-xs text-muted-foreground">
              Can't find your answers? Send a secure ticket to our live dispatch desk.
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
            {/* Name Field */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-bold text-foreground">
                Your Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Jane Doe"
                className={`w-full px-3.5 py-2.5 bg-background border rounded-xl text-xs font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all ${
                  errors.name ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
                }`}
              />
              {errors.name && (
                <span className="text-[10px] font-bold text-destructive flex items-center gap-1">
                  <AlertCircle size={10} /> {errors.name}
                </span>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-bold text-foreground">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="jane@example.com"
                className={`w-full px-3.5 py-2.5 bg-background border rounded-xl text-xs font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all ${
                  errors.email ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
                }`}
              />
              {errors.email && (
                <span className="text-[10px] font-bold text-destructive flex items-center gap-1">
                  <AlertCircle size={10} /> {errors.email}
                </span>
              )}
            </div>

            {/* User Type Select */}
            <div className="space-y-1.5">
              <label htmlFor="userType" className="text-xs font-bold text-foreground">
                Who are you?
              </label>
              <select
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl text-xs font-bold outline-none transition-all cursor-pointer"
              >
                <option value="owner">Restaurant Owner (Merchant)</option>
                <option value="customer">Customer (Diner)</option>
                <option value="partner">Delivery Partner (Rider)</option>
              </select>
            </div>

            {/* Subject Field */}
            <div className="space-y-1.5">
              <label htmlFor="subject" className="text-xs font-bold text-foreground">
                Inquiry Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="e.g., Onboarding permit file size error"
                className={`w-full px-3.5 py-2.5 bg-background border rounded-xl text-xs font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all ${
                  errors.subject ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
                }`}
              />
              {errors.subject && (
                <span className="text-[10px] font-bold text-destructive flex items-center gap-1">
                  <AlertCircle size={10} /> {errors.subject}
                </span>
              )}
            </div>

            {/* Message Textarea */}
            <div className="space-y-1.5">
              <label htmlFor="message" className="text-xs font-bold text-foreground">
                Detailed Explanation
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                placeholder="Please describe what happened, including any system errors or transaction numbers..."
                className={`w-full px-3.5 py-2.5 bg-background border rounded-xl text-xs font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none ${
                  errors.message ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
                }`}
              />
              {errors.message && (
                <span className="text-[10px] font-bold text-destructive flex items-center gap-1">
                  <AlertCircle size={10} /> {errors.message}
                </span>
              )}
            </div>

            {/* Submit Button with Loading state */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Logging your ticket...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Ticket</span>
                </>
              )}
            </button>
          </form>

          {/* Fallback Email Indicator */}
          <div className="pt-4 border-t border-border/80 flex items-center justify-between text-[11px] text-muted-foreground font-semibold">
            <span>Prefer standard email?</span>
            <a 
              href="mailto:support@restomanager.example.com" 
              className="text-primary hover:underline flex items-center gap-1"
            >
              <Mail size={12} /> support@restomanager.example.com
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
