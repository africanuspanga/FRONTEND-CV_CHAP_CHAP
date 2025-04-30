import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CVFormProvider } from "@/contexts/cv-form-context";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import CreateCV from "@/pages/CreateCV";
import TemplateSelection from "@/pages/TemplateSelection";
import CreationMethod from "@/pages/CreationMethod";
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
          <Route path="/create/:step?" component={CreateCV} />
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
        <CVFormProvider>
          <Router />
          <Toaster />
        </CVFormProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
