import React from 'react';
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CVFormProvider, useCVForm } from "@/contexts/cv-form-context";
import { AuthProvider } from "@/contexts/auth-context";
import { AdminAuthProvider } from "@/contexts/admin-auth-context";
import { CVRequestProvider } from "@/contexts/cv-request-context";
import { ProtectedAdminRoute } from "@/components/admin/ProtectedAdminRoute";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { StorageWarningModal } from "@/components/StorageWarningModal";
import ScrollToTop from "@/components/ScrollToTop";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import FaviconUpdater from "@/components/FaviconUpdater";
import ErrorBoundary from "@/components/ErrorBoundary";

import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
// Admin button removed - access via /admin-dashboard directly
import Home from "@/pages/Home";
import CreateCV from "@/pages/CreateCV";
import TemplateSelection from "@/pages/TemplateSelection";
import CreationMethod from "@/pages/CreationMethod";
import ChooseMethodPage from "@/pages/ChooseMethodPage";
import PersonalInfoForm from "@/pages/PersonalInfoForm";
import WorkExperienceForm from "@/pages/WorkExperienceForm";
import EducationForm from "@/pages/EducationForm";
import SkillsIntro from "@/pages/SkillsIntro";
import SkillsRecommendations from "@/pages/SkillsRecommendations";
import SkillsEditor from "@/pages/SkillsEditor";
import LanguagesForm from "@/pages/LanguagesForm";
import SummaryIntro from "@/pages/SummaryIntro";
import SummaryGeneration from "@/pages/SummaryGeneration";
import SummaryEditor from "@/pages/SummaryEditor";
import ReferencesForm from "@/pages/ReferencesForm";
import AdditionalSectionsForm from "@/pages/AdditionalSectionsForm";
import FinalPreview from "@/pages/FinalPreview";
import PaymentPage from "@/pages/payment-page";
import USSDPaymentPage from "@/pages/ussd-payment";
import About from "@/pages/About";
import WhyUs from "@/pages/WhyUs";
import Contact from "@/pages/Contact";
import FAQ from "@/pages/FAQ";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import UserProfile from "@/pages/UserProfile";
import WebsitesPortfoliosForm from "@/pages/WebsitesPortfoliosForm";
import CertificationsForm from "@/pages/CertificationsForm";
import AccomplishmentsForm from "@/pages/AccomplishmentsForm";
import HobbiesForm from "@/pages/HobbiesForm";
import TemplateGallery from "@/pages/template-gallery";
import CVSteps from "@/pages/CVSteps";
import NiceToMeetYouPage from "@/pages/NiceToMeetYouPage";
import GreatStartPage from "@/pages/GreatStartPage";
import UploadCVFlow from "@/pages/UploadCVFlow";
import UploadNiceToMeetYouPage from "@/pages/upload/UploadNiceToMeetYouPage";
import UploadGreatStartPage from "@/pages/upload/UploadGreatStartPage";

// Import UploadProcessingPage directly to avoid lazy loading issues
import UploadProcessingPage from "@/pages/upload/UploadProcessingPage";
import EditSections from "@/pages/EditSections";
import WorkExperienceSummary from "@/pages/WorkExperienceSummary";
import AuthTest from "@/pages/auth-test";
import NotFound from "@/pages/not-found";

// Admin pages
import AdminLoginPage from "@/pages/admin-login";
import AdminDashboardPage from "@/pages/admin-dashboard";
import AdminUsersPage from "@/pages/admin-users";
import AdminTemplatesPage from "@/pages/admin-templates";
import AdminPaymentsPage from "@/pages/admin-payments";
import AdminUSSDVerificationPage from "@/pages/admin-ussd-verification";
import AdminAnalyticsPage from "@/pages/admin-analytics";
import AdminSettingsPage from "@/pages/admin-settings";

// Test Pages
import TestPagesIndex from "@/pages/test-pages-index";
import OpenAITestPage from "@/pages/OpenAITestPage";
import BackendTest from "@/pages/backend-test";
import APIStatusCheck from "@/pages/api-status-check";
import ApiEndpointTest from "@/pages/api-endpoint-test";
import CVScreenerTest from "@/pages/cv-screener-test";
import ProxyTestPage from "@/pages/proxy-test-page";
import USSDPaymentTest from "@/pages/ussd-payment-test";

// Wrapper components for onboarding pages that need context
function OnboardingNiceToMeetYou() {
  const { onboardingInsights } = useCVForm();
  
  if (!onboardingInsights) {
    // Fallback to templates if no insights
    window.location.href = '/templates';
    return null;
  }
  
  return <NiceToMeetYouPage onboardingInsights={onboardingInsights} />;
}

function OnboardingGreatStart() {
  const { onboardingInsights } = useCVForm();
  
  if (!onboardingInsights) {
    // Fallback to templates if no insights
    window.location.href = '/templates';
    return null;
  }
  
  return <GreatStartPage onboardingInsights={onboardingInsights} />;
}

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Switch>
        {/* Admin Dashboard Routes */}
        <Route path="/admin-login" component={AdminLoginPage} />
        <ProtectedAdminRoute path="/admin-dashboard" component={AdminDashboardPage} />
        <ProtectedAdminRoute path="/admin-users" component={AdminUsersPage} />
        <ProtectedAdminRoute path="/admin-templates" component={AdminTemplatesPage} />
        <ProtectedAdminRoute path="/admin-payments" component={AdminPaymentsPage} />
        <ProtectedAdminRoute path="/admin-ussd-verification" component={AdminUSSDVerificationPage} />
        <ProtectedAdminRoute path="/admin-analytics" component={AdminAnalyticsPage} />
        <ProtectedAdminRoute path="/admin-settings" component={AdminSettingsPage} />
        
        {/* Final Preview and Payment routes without navbar or footer */}
        <Route path="/cv/:templateId/final-preview">
          <div className="container">
            <FinalPreview />
          </div>
        </Route>
        <Route path="/cv/:templateId/ussd-payment">
          <div className="container">
            <USSDPaymentPage />
          </div>
        </Route>
        <Route path="/payment">
          <div className="container">
            <PaymentPage />
          </div>
        </Route>
        <Route path="/ussd-payment">
          <div className="container">
            <USSDPaymentPage />
          </div>
        </Route>
        
        {/* All other routes with navbar and footer */}
        <Route>
          <div className="flex flex-col min-h-screen">
            <NavBar />
            <div className="flex-grow">
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/cv-steps" component={CVSteps} />
                <Route path="/cv-steps/choose" component={ChooseMethodPage} />
                <Route path="/onboarding/nice-to-meet-you" component={OnboardingNiceToMeetYou} />
                <Route path="/onboarding/great-start" component={OnboardingGreatStart} />
                
                {/* Upload CV Flow Routes */}
                <Route path="/upload" component={UploadCVFlow} />
                <Route path="/upload/processing" component={UploadProcessingPage} />
                <Route path="/upload/nice-to-meet-you" component={UploadNiceToMeetYouPage} />
                <Route path="/upload/great-start" component={UploadGreatStartPage} />
                <Route path="/templates" component={TemplateSelection} />
                <Route path="/cv-form/personal-info" component={PersonalInfoForm} />
                {/* Redirect from old route to new CVSteps page */}
                <Route path="/create/method">
                  {() => {
                    window.location.href = "/cv-steps";
                    return null;
                  }}
                </Route>
                <Route path="/cv/:templateId/personal" component={PersonalInfoForm} />
                <Route path="/cv/:templateId/work" component={WorkExperienceForm} />
                <Route path="/cv/:templateId/work-experience" component={WorkExperienceForm} />
                <Route path="/cv/:templateId/work-experience/summary" component={WorkExperienceSummary} />
                <Route path="/cv/:templateId/education" component={EducationForm} />
                <Route path="/cv/:templateId/skills" component={SkillsIntro} />
                <Route path="/cv/:templateId/skills-recommendations" component={SkillsRecommendations} />
                <Route path="/cv/:templateId/skills-editor" component={SkillsEditor} />
                <Route path="/cv/:templateId/languages" component={LanguagesForm} />
                <Route path="/cv/:templateId/summary" component={SummaryIntro} />
                <Route path="/cv/:templateId/summary-generation" component={SummaryGeneration} />
                <Route path="/cv/:templateId/summary-editor" component={SummaryEditor} />
                <Route path="/cv/:templateId/references" component={ReferencesForm} />
                <Route path="/cv/:templateId/additional-sections" component={AdditionalSectionsForm} />
                <Route path="/cv/:templateId/websites-portfolios" component={WebsitesPortfoliosForm} />
                {/* Handle all path variations including direct access URLs */}
                <Route path="/cv/:templateId/certifications" component={CertificationsForm} />
                <Route path="/cv/certifications" component={CertificationsForm} />
                <Route path="/cv//certifications" component={CertificationsForm} />
                
                <Route path="/cv/:templateId/accomplishments" component={AccomplishmentsForm} />
                <Route path="/cv/accomplishments" component={AccomplishmentsForm} />
                <Route path="/cv//accomplishments" component={AccomplishmentsForm} />
                
                <Route path="/cv/:templateId/hobbies" component={HobbiesForm} />
                <Route path="/cv//hobbies" component={HobbiesForm} />
                <Route path="/cv/hobbies" component={HobbiesForm} />
                <Route path="/create/:step?" component={CreateCV} />
                <Route path="/about" component={About} />
                <Route path="/why-us" component={WhyUs} />
                <Route path="/contact" component={Contact} />
                <Route path="/faq" component={FAQ} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <ProtectedRoute path="/profile" component={UserProfile} />
                <Route path="/test-pages" component={TestPagesIndex} />
                <Route path="/openai-test" component={OpenAITestPage} />
                <Route path="/backend-test" component={BackendTest} />
                <Route path="/api-status-check" component={APIStatusCheck} />
                <Route path="/api-endpoint-test" component={ApiEndpointTest} />
                <Route path="/cv-screener-test" component={CVScreenerTest} />
                <Route path="/proxy-test" component={ProxyTestPage} />
                <Route path="/ussd-payment-test" component={USSDPaymentTest} />
                <Route path="/template-gallery" component={TemplateGallery} />
                <Route path="/edit-sections" component={EditSections} />
                <Route path="/auth-test" component={AuthTest} />
                <Route component={NotFound} />
              </Switch>
            </div>
            <Footer />
          </div>
        </Route>
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AdminAuthProvider>
            <CVFormProvider>
              <CVRequestProvider>
                {/* SEO Components */}
                <SEO />
                <StructuredData type="website" />
                <StructuredData type="organization" />
                <StructuredData type="webApplication" />
                <FaviconUpdater />
                
                <ErrorBoundary 
                  onError={(error) => {
                    console.error("Application error caught by root ErrorBoundary:", error);
                  }}
                >
                  <Router />
                </ErrorBoundary>
                <Toaster />
                <StorageWarningModal />
              </CVRequestProvider>
            </CVFormProvider>
          </AdminAuthProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
