import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CVFormProvider } from "@/contexts/cv-form-context";
import { AuthProvider } from "@/contexts/auth-context";
import { AdminAuthProvider } from "@/contexts/admin-auth-context";
import { ProtectedAdminRoute } from "@/components/admin/ProtectedAdminRoute";

import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import AdminLoginLink from "@/components/AdminLoginLink";
import Home from "@/pages/Home";
import CreateCV from "@/pages/CreateCV";
import TemplateSelection from "@/pages/TemplateSelection";
import CreationMethod from "@/pages/CreationMethod";
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
import About from "@/pages/About";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import WebsitesPortfoliosForm from "@/pages/WebsitesPortfoliosForm";
import CertificationsForm from "@/pages/CertificationsForm";
import AccomplishmentsForm from "@/pages/AccomplishmentsForm";
import HobbiesForm from "@/pages/HobbiesForm";
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

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <AdminLoginLink />
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
        
        {/* Final Preview route without navbar or footer */}
        <Route path="/cv/:templateId/final-preview">
          <FinalPreview />
        </Route>
        
        {/* All other routes with navbar and footer */}
        <Route>
          <div className="flex flex-col min-h-screen">
            <NavBar />
            <div className="flex-grow">
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/templates" component={TemplateSelection} />
                <Route path="/create/method" component={CreationMethod} />
                <Route path="/cv/:templateId/personal" component={PersonalInfoForm} />
                <Route path="/cv/:templateId/work" component={WorkExperienceForm} />
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
                <Route path="/cv/:templateId/certifications" component={CertificationsForm} />
                <Route path="/cv/:templateId/accomplishments" component={AccomplishmentsForm} />
                <Route path="/cv/:templateId/hobbies" component={HobbiesForm} />
                <Route path="/create/:step?" component={CreateCV} />
                <Route path="/about" component={About} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
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
              <Router />
              <Toaster />
            </CVFormProvider>
          </AdminAuthProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
