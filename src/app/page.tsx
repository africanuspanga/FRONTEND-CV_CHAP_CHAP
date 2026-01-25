"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Zap, Smartphone, Globe, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const features = [
  {
    icon: FileText,
    title: "Professional Templates",
    description: "6 beautiful, ATS-friendly templates designed for the East African job market",
  },
  {
    icon: Zap,
    title: "AI-Powered Content",
    description: "Get smart suggestions for your professional summary, skills, and job descriptions",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description: "Build your CV on any device - phone, tablet, or computer",
  },
  {
    icon: Globe,
    title: "Made for East Africa",
    description: "Templates and content tailored for Tanzania, Kenya, Uganda, and beyond",
  },
];

const steps = [
  { step: 1, title: "Choose a Template", description: "Pick from 6 professional designs" },
  { step: 2, title: "Add Your Details", description: "Fill in your experience and skills" },
  { step: 3, title: "Get AI Suggestions", description: "Enhance your content with AI" },
  { step: 4, title: "Download PDF", description: "Pay once, download instantly" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-gray-900">CV Chap Chap</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-gray-600 hover:text-gray-900">Features</Link>
          <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900">How It Works</Link>
          <Link href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
        </nav>
        <Link href="/template">
          <Button>Get Started</Button>
        </Link>
      </header>

      <main>
        <section className="container mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Create Your Professional CV
              <br />
              <span className="text-primary">in Minutes</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Build a stunning CV that gets you noticed. AI-powered content suggestions, 
              professional templates, and instant PDF download.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/template">
                <Button size="lg" className="text-lg px-8">
                  Create Your CV <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        <section id="features" className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Stand Out
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform is designed specifically for job seekers in East Africa
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <feature.icon className="h-12 w-12 text-primary mb-4" />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="bg-gray-50 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-gray-600">
                Create your professional CV in just 4 easy steps
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simple, Fair Pricing
            </h2>
            <p className="text-gray-600">
              Pay once per CV download. No subscriptions, no hidden fees.
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <Card className="border-2 border-primary">
              <CardHeader className="text-center bg-primary text-white rounded-t-lg">
                <CardTitle className="text-2xl">Professional CV</CardTitle>
                <div className="text-4xl font-bold mt-4">
                  TZS 2,500
                </div>
                <CardDescription className="text-blue-100">
                  One-time payment per download
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-4">
                  {[
                    "Choose from 6 professional templates",
                    "AI-powered content suggestions",
                    "Unlimited edits before download",
                    "High-quality PDF download",
                    "Mobile money payment (M-Pesa, Tigo Pesa)",
                    "Instant delivery",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/template" className="block mt-6">
                  <Button className="w-full" size="lg">
                    Start Creating Your CV
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="bg-primary text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Land Your Dream Job?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of job seekers who have already created their professional CVs with CV Chap Chap
            </p>
            <Link href="/template">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Create Your CV Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-6 w-6" />
                <span className="text-xl font-bold">CV Chap Chap</span>
              </div>
              <p className="text-gray-400">
                Professional CV creation for East African job seekers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/template" className="hover:text-white">Create CV</Link></li>
                <li><Link href="#features" className="hover:text-white">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} CV Chap Chap. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
