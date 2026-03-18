import React, { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { motion } from 'motion/react';
import { tools, categories } from '../data/tools';
import { cn } from '../utils/cn';

const IconRenderer = ({ name, className }: { name: string; className?: string }) => {
  const Icon = (Icons as any)[name] || Icons.HelpCircle;
  return <Icon className={className} />;
};

export default function CategoryPage({ slug }: { slug?: string }) {
  const { categorySlug: paramSlug } = useParams<{ categorySlug: string }>();
  const categorySlug = slug || paramSlug;
  
  const category = categories.find(c => c.slug === categorySlug);
  
  useEffect(() => {
    if (category) {
      document.title = category.metaTitle;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', category.metaDesc);
      }
    }
  }, [category]);

  if (!category) {
    return <Navigate to="/" replace />;
  }

  const categoryTools = tools.filter(t => t.category === category.id);

  return (
    <div className="space-y-12 py-8">
      {/* Category Header & Intro */}
      <section className="max-w-4xl mx-auto text-center space-y-6">
        <div className="inline-flex p-4 bg-indigo-50 rounded-2xl text-indigo-600 mb-4">
          <IconRenderer name={category.icon} className="w-10 h-10" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
          {category.h1}
        </h1>
        <div className="prose prose-indigo max-w-none text-gray-600 leading-relaxed text-lg text-left bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm">
          {category.intro.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="mb-4">{paragraph}</p>
          ))}
        </div>
      </section>

      {/* Tools Grid */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Available {category.name}
          </h2>
          <span className="text-sm text-gray-500 font-medium">
            {categoryTools.length} Tools Found
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link 
                to={`/${tool.slug}`}
                className="group block bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    <IconRenderer name={tool.icon} className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900">{tool.name}</h3>
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
      </section>

      {/* Internal Linking / Navigation */}
      <section className="max-w-4xl mx-auto bg-indigo-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-xl shadow-indigo-500/20">
        <h2 className="text-3xl font-bold mb-4">Need a different tool?</h2>
        <p className="text-indigo-100 mb-8 text-lg">
          Explore our other categories to find the perfect utility for your task.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {categories.filter(c => c.id !== category.id).map(c => (
            <Link
              key={c.id}
              to={`/${c.slug}`}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold transition-all flex items-center space-x-2"
            >
              <IconRenderer name={c.icon} className="w-5 h-5" />
              <span>{c.name}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
