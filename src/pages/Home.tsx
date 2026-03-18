import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import * as Icons from 'lucide-react';
import { motion } from 'motion/react';
import { tools, categories } from '../data/tools';
import { cn } from '../utils/cn';

const IconRenderer = ({ name, className }: { name: string; className?: string }) => {
  const Icon = (Icons as any)[name] || Icons.HelpCircle;
  return <Icon className={className} />;
};

const FEATURED_IDS = ['word-counter', 'image-resizer', 'emi-calculator', 'gst-calculator', 'percentage-calculator'];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredTools = useMemo(() => {
    const results = tools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort featured tools to the top
    return [...results].sort((a, b) => {
      const aFeatured = FEATURED_IDS.includes(a.id);
      const bFeatured = FEATURED_IDS.includes(b.id);
      if (aFeatured && !bFeatured) return -1;
      if (!aFeatured && bFeatured) return 1;
      return 0;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20 pb-0">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
          Every Tool You Need, <span className="text-indigo-600">All in One Place.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Fast, free, and secure online tools for developers, writers, and students. No registration, no limits, just productivity.
        </p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative group mb-12">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search 30+ tools (e.g., Word Counter, Image Resizer...)" 
            className="w-full pl-14 pr-6 py-5 bg-white border-2 border-gray-100 rounded-2xl text-lg shadow-xl shadow-indigo-500/5 focus:border-indigo-500 focus:ring-0 transition-all outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Popular Tools Grid (Moved Up) */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="flex justify-between items-end mb-8 px-4">
            <div className="text-left">
              <h2 className="text-2xl font-bold text-gray-900">Popular Tools</h2>
              <p className="text-gray-500 text-sm">Most used tools by our community</p>
            </div>
            <Link to="/all-tools" className="text-indigo-600 text-sm font-semibold flex items-center hover:underline">
              View all <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            {filteredTools.slice(0, 6).map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link 
                  to={`/${tool.slug}`}
                  className={cn(
                    "group block bg-white p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-left h-full",
                    FEATURED_IDS.includes(tool.id) ? "border-indigo-100 ring-4 ring-indigo-50/50" : "border-gray-100 shadow-sm"
                  )}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={cn(
                      "p-3 rounded-xl transition-colors",
                      FEATURED_IDS.includes(tool.id) ? "bg-indigo-600 text-white" : "bg-gray-50 group-hover:bg-indigo-50 group-hover:text-indigo-600"
                    )}>
                      <IconRenderer name={tool.icon} className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 flex items-center">
                        {tool.name}
                        {FEATURED_IDS.includes(tool.id) && (
                          <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase rounded-full">
                            Top
                          </span>
                        )}
                      </h3>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                    {tool.shortDesc}
                  </p>
                  <div className="flex items-center text-indigo-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    Use Tool <ArrowRight className="ml-1 w-4 h-4" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-6">
          <div className="flex flex-wrap justify-center gap-3">
            <button 
              onClick={() => setActiveCategory('all')}
              className={cn("px-6 py-2 rounded-full text-sm font-bold transition-all", activeCategory === 'all' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100')}
            >
              All Tools
            </button>
            {categories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn("px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center space-x-2", activeCategory === cat.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100')}
              >
                <IconRenderer name={cat.icon} className="w-4 h-4" />
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {activeCategory !== 'all' && (
            <div className="text-center">
              <Link 
                to={`/${categories.find(c => c.id === activeCategory)?.slug}`}
                className="inline-flex items-center text-indigo-600 font-bold hover:underline"
              >
                View full {categories.find(c => c.id === activeCategory)?.name} page <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 px-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start space-x-4">
          <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Lightning Fast</h3>
            <p className="text-sm text-gray-500">Tools process instantly in your browser for maximum speed.</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start space-x-4">
          <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Privacy First</h3>
            <p className="text-sm text-gray-500">Your data never leaves your device. We don't store your input.</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start space-x-4">
          <div className="bg-amber-50 p-3 rounded-xl text-amber-600">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">100% Free</h3>
            <p className="text-sm text-gray-500">No subscriptions, no hidden fees. All tools are free forever.</p>
          </div>
        </div>
      </section>

      {/* SEO Introduction Section */}
      <section className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto prose prose-indigo">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Welcome to ToolVerseHub: Your Ultimate Online Utility Toolkit</h2>
          
          <p className="text-gray-600 leading-relaxed mb-6">
            In today's fast-paced digital world, having the right tools at your fingertips can make all the difference between a productive day and one bogged down by repetitive tasks. Whether you're a developer debugging complex code, a writer polishing a creative manuscript, or a student tackling difficult math problems, efficiency is the key to success. That's why we created <strong>ToolVerseHub</strong>—a comprehensive, all-in-one platform designed to streamline your daily digital workflow and provide high-quality solutions for free.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-4">The Power of Free Online Tools</h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            The internet has democratized access to information, and we believe it should do the same for productivity tools. The benefits of using free online tools like those found on ToolVerseHub are immense. First and foremost is the elimination of financial barriers. Professional-grade software often comes with hefty subscription fees that can be prohibitive for individuals or small businesses. By providing these utilities for free, we empower everyone to perform at their best without worrying about the cost. Furthermore, online tools eliminate the need for bulky software installations that take up valuable disk space and can slow down your operating system.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-4">Essential for Students and Bloggers</h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            For students, ToolVerseHub is a digital study companion. From our <em>Age Calculator</em> for biology projects to our <em>Percentage Calculator</em> for statistics homework, we provide the precision needed for academic excellence. Writing assignments also become much easier with our <em>Word Counter</em> and <em>Character Counter</em>, ensuring that every essay meets the strict requirements of professors and institutions.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            Bloggers and content creators also find immense value in our toolkit. SEO is a game of precision, and our tools help you win. Use our <em>Character Counter</em> to optimize meta titles and descriptions, or our <em>Word Counter</em> to ensure your blog posts hit the ideal length for search engine rankings. The <em>Case Converter</em> and <em>Remove Extra Spaces</em> tools are perfect for cleaning up drafted content before it goes live, ensuring a professional look for your audience every time.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-4">Daily Productivity Advantages</h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            Productivity isn't about working harder; it's about working smarter. Daily productivity advantages come from automating the "small" tasks that eat up your time. Need to generate a secure password? Don't spend minutes trying to think of one; use our <em>Password Generator</em> in seconds. Need to resize an image for an email? Our <em>Image Resizer</em> handles it instantly. By centralizing these diverse utilities, ToolVerseHub saves you from having to search the web for individual solutions, keeping you in your creative flow longer.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-4">Fast Browser-Based Processing</h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            One of the core technical advantages of ToolVerseHub is our commitment to <strong>browser-based processing</strong>. Unlike traditional web tools that send your data to a remote server for calculation, our tools run directly on your device using modern JavaScript. This approach offers two major benefits: speed and privacy. Because the data doesn't have to travel across the internet, results are delivered with zero latency. More importantly, your sensitive information—whether it's a private note, a password, or a personal image—never touches our servers. Your data stays on your machine, providing a level of security that server-side tools simply cannot match.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-4">The Benefits of No-Login Tools</h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            We value your time and your privacy, which is why ToolVerseHub is a <strong>no-login platform</strong>. We've all experienced the frustration of finding a useful tool only to be met with a "Sign Up to Continue" wall. This often leads to unwanted newsletters, data tracking, and the risk of your personal information being leaked in a breach. By removing the login requirement, we provide a frictionless experience. You can land on our site, use the tool you need, and leave within seconds. No accounts to manage, no passwords to remember, and no personal data shared. It's the way the web was meant to be: open, fast, and respectful of the user.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-4">A Growing Library of Utilities</h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            Our platform currently offers over 30+ tools categorized into Text Content, Math Calculators, Image Editing, and Utility Development. We are constantly listening to our community and adding new features based on your feedback. Whether you're a developer needing a <em>Binary to Decimal</em> converter or a designer needing to switch between <em>RGB and HEX</em>, we are building the ultimate destination for your digital needs.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-4">Specialized Tools for Every Niche</h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            In the <strong>Text Content</strong> category, we offer more than just basic counters. Our <em>Case Converter</em> allows you to toggle between UPPERCASE, lowercase, Title Case, and sentence case with a single click—perfect for formatting headlines or cleaning up messy notes. The <em>Remove Extra Spaces</em> tool is a lifesaver for data entry tasks, ensuring your strings are clean and consistent.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            Our <strong>Math and Finance</strong> section is designed to take the headache out of calculations. Whether you're calculating a discount during a sale with our <em>Percentage Calculator</em> or determining your exact age for a legal document with our <em>Age Calculator</em>, our algorithms are rigorously tested for accuracy. We believe that everyone should have access to reliable mathematical tools without needing to carry a physical calculator or open a complex spreadsheet.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            For the visually inclined, our <strong>Image Editing</strong> suite provides essential utilities like the <em>Image Resizer</em> and <em>Image Cropper</em>. These tools are optimized for web performance, allowing you to prepare your photos for social media or blog posts without losing quality. And for the tech-savvy, our <strong>Utility Development</strong> section offers everything from <em>JSON Formatters</em> to <em>Base64 Encoders</em>, making it a favorite among software engineers and IT professionals.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-4">Why Choose ToolVerseHub?</h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            With so many utility sites on the internet, why choose ToolVerseHub? The answer lies in our three core pillars: <strong>Speed, Security, and Simplicity</strong>. We don't clutter our pages with intrusive ads that slow down your browser. We don't track your every move or sell your data to third parties. We provide a clean, minimalist interface that puts the tool front and center. Our goal is to be the fastest way to get your task done, so you can get back to what really matters.
          </p>

          <p className="text-gray-600 leading-relaxed">
            Explore our categories today and discover how ToolVerseHub can transform your digital life. We are committed to remaining 100% free, secure, and incredibly fast. Welcome to the future of online productivity—where every tool you need is just a click away.
          </p>
        </div>
      </section>
    </div>
  );
}
