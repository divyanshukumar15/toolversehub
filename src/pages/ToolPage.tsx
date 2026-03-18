import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, CheckCircle2, HelpCircle, ArrowLeft } from 'lucide-react';
import { getToolBySlug, tools } from '../data/tools';
import WordCounter from '../components/tools/WordCounter';
import PercentageCalculator from '../components/tools/PercentageCalculator';
import CaseConverter from '../components/tools/CaseConverter';
import PasswordGenerator from '../components/tools/PasswordGenerator';

import CharacterCounter from '../components/tools/CharacterCounter';
import RandomNumberGenerator from '../components/tools/RandomNumberGenerator';
import AgeCalculator from '../components/tools/AgeCalculator';
import ImageResizer from '../components/tools/ImageResizer';
import ImageCropper from '../components/tools/ImageCropper';
import JpgToPng from '../components/tools/JpgToPng';
import PngToJpg from '../components/tools/PngToJpg';
import EmiCalculator from '../components/tools/EmiCalculator';
import GstCalculator from '../components/tools/GstCalculator';
import LoanInterestCalculator from '../components/tools/LoanInterestCalculator';
import RemoveExtraSpaces from '../components/tools/RemoveExtraSpaces';
import QRGenerator from '../components/tools/QRGenerator';
import UnitConverter from '../components/tools/UnitConverter';
import RgbToHex from '../components/tools/RgbToHex';
import DiscountCalculator from '../components/tools/DiscountCalculator';
import UrlEncoder from '../components/tools/UrlEncoder';
import BinaryConverter from '../components/tools/BinaryConverter';
import Pomodoro from '../components/tools/Pomodoro';
import ExamCountdown from '../components/tools/ExamCountdown';
import ImageRotator from '../components/tools/ImageRotator';
import RemoveLineBreaks from '../components/tools/RemoveLineBreaks';
import TextSorter from '../components/tools/TextSorter';
import RandomTextGenerator from '../components/tools/RandomTextGenerator';
import OnlineNotepad from '../components/tools/OnlineNotepad';
import TimeDurationCalculator from '../components/tools/TimeDurationCalculator';
import AverageCalculator from '../components/tools/AverageCalculator';
import NumberToWords from '../components/tools/NumberToWords';

const ToolRenderer = ({ id }: { id: string }) => {
  switch (id) {
    case 'word-counter': return <WordCounter />;
    case 'percentage-calculator': return <PercentageCalculator />;
    case 'case-converter': return <CaseConverter />;
    case 'password-generator': return <PasswordGenerator />;
    case 'character-counter': return <CharacterCounter />;
    case 'random-number': return <RandomNumberGenerator />;
    case 'age-calculator': return <AgeCalculator />;
    case 'image-resizer': return <ImageResizer />;
    case 'image-cropper': return <ImageCropper />;
    case 'jpg-to-png': return <JpgToPng />;
    case 'png-to-jpg': return <PngToJpg />;
    case 'emi-calculator': return <EmiCalculator />;
    case 'gst-calculator': return <GstCalculator />;
    case 'loan-interest-calculator': return <LoanInterestCalculator />;
    case 'remove-extra-spaces': return <RemoveExtraSpaces />;
    case 'qr-generator': return <QRGenerator />;
    case 'unit-converter': return <UnitConverter />;
    case 'rgb-to-hex': return <RgbToHex />;
    case 'discount-calculator': return <DiscountCalculator />;
    case 'url-encoder': return <UrlEncoder />;
    case 'binary-converter': return <BinaryConverter />;
    case 'pomodoro': return <Pomodoro />;
    case 'exam-countdown': return <ExamCountdown />;
    case 'image-rotator': return <ImageRotator />;
    case 'remove-line-breaks': return <RemoveLineBreaks />;
    case 'text-sorter': return <TextSorter />;
    case 'random-text': return <RandomTextGenerator />;
    case 'online-notepad': return <OnlineNotepad />;
    case 'time-duration': return <TimeDurationCalculator />;
    case 'average-calculator': return <AverageCalculator />;
    case 'number-to-words': return <NumberToWords />;
    default: return (
      <div className="p-12 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
        <p className="text-gray-500 font-medium">Tool logic for "{id}" is coming soon in the next update!</p>
      </div>
    );
  }
};

export default function ToolPage() {
  const { slug } = useParams();
  const tool = getToolBySlug(slug || '');

  useEffect(() => {
    if (tool) {
      document.title = tool.metaTitle;
      // In a real app, you'd update meta tags here too
    }
  }, [tool]);

  if (!tool) {
    return (
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold mb-4">Tool Not Found</h1>
        <Link to="/" className="text-indigo-600 font-bold hover:underline">Return Home</Link>
      </div>
    );
  }

  const relatedTools = tools
    .filter(t => t.category === tool.category && t.id !== tool.id)
    .slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-gray-400">
        <Link to="/" className="hover:text-indigo-600">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="capitalize">{tool.category}</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">{tool.name}</span>
      </nav>

      {/* Tool Header */}
      <section>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-4">{tool.h1}</h1>
        <p className="text-xl text-gray-500 max-w-3xl">{tool.shortDesc}</p>
      </section>

      {/* Tool Interface */}
      <section className="bg-white p-4 md:p-8 rounded-3xl border border-gray-100 shadow-xl shadow-indigo-500/5">
        <ToolRenderer id={tool.id} />
      </section>

      {/* SEO Content Section */}
      <article className="prose prose-indigo max-w-none bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">What is {tool.name}?</h2>
          <p className="text-gray-600 leading-relaxed text-lg mb-8">{tool.intro}</p>

          <h3 className="text-2xl font-bold mb-4">How to Use {tool.name}</h3>
          <ul className="space-y-4 mb-10">
            {tool.usageGuide.map((step, i) => (
              <li key={i} className="flex items-start space-x-3">
                <div className="bg-indigo-100 text-indigo-600 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm mt-1">
                  {i + 1}
                </div>
                <span className="text-gray-600">{step}</span>
              </li>
            ))}
          </ul>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-4">Key Features</h3>
              <ul className="space-y-3">
                {tool.features.map((f, i) => (
                  <li key={i} className="flex items-center space-x-2 text-gray-600">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Benefits</h3>
              <ul className="space-y-3">
                {tool.benefits.map((b, i) => (
                  <li key={i} className="flex items-center space-x-2 text-gray-600">
                    <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Programmatic SEO Sections */}
          {tool.programmaticSections.map((section, i) => (
            <div key={i} className="mb-10 bg-gray-50 p-6 rounded-2xl">
              <h3 className="text-xl font-bold mb-3">{section.title}</h3>
              <p className="text-gray-600">{section.content}</p>
            </div>
          ))}

          {/* FAQ Section */}
          <h3 className="text-2xl font-bold mb-6">Frequently Asked Questions</h3>
          <div className="space-y-6 mb-12">
            {tool.faqs.map((faq, i) => (
              <div key={i} className="border-b border-gray-100 pb-6">
                <h4 className="flex items-center text-lg font-bold text-gray-900 mb-2">
                  <HelpCircle className="w-5 h-5 text-indigo-500 mr-2" />
                  {faq.q}
                </h4>
                <p className="text-gray-600 pl-7">{faq.a}</p>
              </div>
            ))}
          </div>

          {/* Internal Linking */}
          {relatedTools.length > 0 && (
            <div className="pt-12 border-t border-gray-100">
              <h3 className="text-xl font-bold mb-6">Related Tools</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedTools.map(t => (
                  <Link 
                    key={t.id} 
                    to={`/${t.slug}`}
                    className="p-4 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors border border-transparent hover:border-indigo-100 group"
                  >
                    <span className="text-sm font-bold text-gray-900 group-hover:text-indigo-600">{t.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
