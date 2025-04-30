import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CVFormProvider } from "@/contexts/cv-form-context";
import { AuthProvider } from "@/contexts/auth-context";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
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
import About from "@/pages/About";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/not-found";

function Router() {
  return (
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
          <Route path="/create/:step?" component={CreateCV} />
          <Route path="/about" component={About} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route component={NotFound} />
        </Switch>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CVFormProvider>
            <Router />
            <Toaster />
          </CVFormProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
