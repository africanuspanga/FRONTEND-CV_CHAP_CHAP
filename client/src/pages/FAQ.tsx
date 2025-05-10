import React from 'react';
import { Helmet } from 'react-helmet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ: React.FC = () => {
  const faqItems: FAQItem[] = [
    {
      question: "What services does CV Chap Chap offer?",
      answer: "CV Chap Chap offers expert CV writing and creation, CV improvement services, crafting of compelling application letters, and resources like CV samples, formats, and templates.",
      category: "Services"
    },
    {
      question: "Can CV Chap Chap help me create a CV from scratch?",
      answer: "Yes, CV Chap Chap can help you create a CV from scratch, guiding you through the process with professional templates and step-by-step instructions.",
      category: "Services"
    },
    {
      question: "Does CV Chap Chap offer CV improvement services?",
      answer: "Yes, CV Chap Chap provides thorough CV improvement services to polish your existing CV, enhancing its content, structure, and design to meet current standards.",
      category: "Services"
    },
    {
      question: "Does CV Chap Chap have CV samples and templates?",
      answer: "Yes, CV Chap Chap offers a rich library of CV samples and versatile templates designed to impress employers across different industries.",
      category: "Resources"
    },
    {
      question: "Can CV Chap Chap advise on CV formats?",
      answer: "Yes, CV Chap Chap provides guidance on effective CV formats that recruiters prefer, ensuring your CV is structured in a way that highlights your strengths and experience.",
      category: "Resources"
    },
    {
      question: "Can CV Chap Chap help first-time job seekers?",
      answer: "Yes, CV Chap Chap can help first-time job seekers write effective CVs that highlight their strengths, education, and potential, even with limited work experience.",
      category: "Target Users"
    },
    {
      question: "Does CV Chap Chap assist with writing application letters?",
      answer: "Yes, CV Chap Chap assists with writing professional and tailored application letters (\"barua ya kuomba kazi\") that complement your CV and effectively communicate your value to employers.",
      category: "Services"
    },
    {
      question: "Can I see examples of application letters from CV Chap Chap?",
      answer: "Yes, you can access examples of application letters (\"mfano wa barua ya kuomba kazi\") from CV Chap Chap that serve as effective templates for your own submissions.",
      category: "Resources"
    },
    {
      question: "What does \"Chap Chap\" signify?",
      answer: "\"Chap Chap\" signifies our commitment to providing efficient and timely services, ensuring you get professional CV and application letter support without unnecessary delays.",
      category: "About Us"
    },
    {
      question: "Does CV Chap Chap understand the East African job market?",
      answer: "Yes, CV Chap Chap understands the nuances of the East African job market, including local hiring practices, industry expectations, and cultural context, allowing us to create CVs that resonate with regional employers.",
      category: "Expertise"
    },
    {
      question: "Are the CVs created by CV Chap Chap ATS-friendly?",
      answer: "Yes, the CVs created by CV Chap Chap are designed to be ATS-friendly, meaning they're optimized to pass through Applicant Tracking Systems that many employers use to screen candidates.",
      category: "Quality"
    },
    {
      question: "Are CVs and application letters tailored?",
      answer: "CV Chap Chap tailors CVs and application letters to individual career goals, industry, and experience level, ensuring each document is personalized to your specific situation and target role.",
      category: "Quality"
    },
    {
      question: "What expertise does CV Chap Chap offer?",
      answer: "CV Chap Chap offers local and international expertise, combining knowledge of East African markets with global best practices in CV writing and job application strategies.",
      category: "Expertise"
    },
    {
      question: "What are the benefits of using CV Chap Chap?",
      answer: "The benefits include tailored solutions customized to your needs, quality and professionalism in all documents, efficient service delivery, and access to a comprehensive resource hub of templates and examples.",
      category: "Benefits"
    },
    {
      question: "Is CV Chap Chap efficient?",
      answer: "Yes, CV Chap Chap's processes are designed to deliver high-quality results efficiently, respecting your time while ensuring excellence in the final documents.",
      category: "Quality"
    },
    {
      question: "Does CV Chap Chap help with the broader job search beyond application documents?",
      answer: "While our core focus is on application documents, CV Chap Chap provides foundational support for your job search through strategic guidance on presenting your qualifications effectively.",
      category: "Services"
    },
    {
      question: "How does CV Chap Chap help with job search readiness?",
      answer: "CV Chap Chap helps with job search readiness by providing stellar CVs and application letters that serve as your marketing materials, positioning you confidently to approach potential employers.",
      category: "Benefits"
    }
  ];

  // Extract unique categories
  const uniqueCategories: string[] = [];
  faqItems.forEach(item => {
    if (!uniqueCategories.includes(item.category)) {
      uniqueCategories.push(item.category);
    }
  });
  
  // Group FAQs by category
  const faqsByCategory = uniqueCategories.map(category => ({
    category,
    items: faqItems.filter(item => item.category === category)
  }));

  return (
    <>
      <Helmet>
        <title>Frequently Asked Questions | CV Chap Chap</title>
        <meta 
          name="description" 
          content="Find answers to common questions about CV Chap Chap's CV writing, improvement services, application letter creation, templates, and more." 
        />
        <meta 
          name="keywords" 
          content="CV FAQ, CV help, CV services, jinsi ya kuandika CV, kutengeneza CV, barua ya kuomba kazi, CV writing questions, application letter help" 
        />
        <link rel="canonical" href="https://cvchapchap.com/faq" />
        <meta property="og:title" content="CV Chap Chap FAQ - Your CV and Application Letter Questions Answered" />
        <meta property="og:description" content="Get answers to common questions about CV creation, formats, templates, application letters, and CV improvement services." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cvchapchap.com/faq" />
      </Helmet>

      <div className="container max-w-5xl mx-auto px-4 py-10">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-3">Frequently Asked Questions</h1>
          <p className="text-gray-700 max-w-3xl mx-auto text-lg">
            Find answers to common questions about our CV creation services, templates, and application letter writing.
          </p>
        </div>

        {/* Search Bar (Decorative) */}
        <div className="max-w-2xl mx-auto mb-12 relative">
          <div className="flex items-center p-2 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="bg-primary/10 p-2 rounded-md mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              className="flex-grow p-2 focus:outline-none" 
              placeholder="Search FAQs (decorative, does not function)"
              readOnly
              aria-label="Search FAQs (decorative)"
            />
          </div>
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-white px-4 py-1 rounded-full text-xs text-gray-500 border border-gray-100 shadow-sm">
            Ask us anything about CV creation
          </div>
        </div>

        {/* FAQ Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Categories Sidebar */}
          <div className="md:col-span-3 hidden md:block">
            <div className="bg-white rounded-xl p-5 shadow-sm sticky top-20">
              <h2 className="font-bold text-gray-900 mb-4">FAQ Categories</h2>
              <ul className="space-y-2">
                {uniqueCategories.map((category: string, index: number) => (
                  <li key={index}>
                    <a 
                      href={`#${category.toLowerCase().replace(/\s+/g, '-')}`}
                      className="block p-2 text-gray-700 hover:bg-primary/5 rounded-md hover:text-primary transition-colors"
                    >
                      {category}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="md:col-span-9">
            {faqsByCategory.map((categoryGroup, categoryIndex) => (
              <div key={categoryIndex} id={categoryGroup.category.toLowerCase().replace(/\s+/g, '-')} className="mb-10">
                <h2 className="text-2xl font-bold text-primary mb-5 flex items-center">
                  <span className="inline-block w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 text-sm">
                    {categoryIndex + 1}
                  </span>
                  {categoryGroup.category} Questions
                </h2>
                <Accordion type="single" collapsible className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {categoryGroup.items.map((item, index) => (
                    <AccordionItem key={index} value={`item-${categoryIndex}-${index}`} className="border-b last:border-b-0 px-1">
                      <AccordionTrigger className="hover:bg-primary/5 text-left py-5 px-4 text-gray-800 font-medium text-lg">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="px-5 pb-5 pt-0 text-gray-700 leading-relaxed">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>

        {/* Still Have Questions Section */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 mt-16 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-primary mb-3">Still Have Questions?</h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? We're here to help with any questions about our CV creation services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/create/method">Start Creating Your CV</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Structured data for SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqItems.map(item => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer
          }
        }))
      }) }} />
    </>
  );
};

export default FAQ;