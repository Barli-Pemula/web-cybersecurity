import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DoodleLayout from "./components/DoodleLayout";
import Home from "./pages/Home";
import PasswordChecker from "./pages/PasswordChecker";
import URLChecker from "./pages/URLChecker";
import TwoFAChecker from "./pages/TwoFAChecker";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <DoodleLayout>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/password-checker"} component={PasswordChecker} />
        <Route path={"/url-checker"} component={URLChecker} />
        <Route path={"/2fa-checker"} component={TwoFAChecker} />
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </DoodleLayout>
  );
}

// NOTE: About Theme
// - Personal Digital Threat Detector uses a light theme with warm cream background
// - Color palette: Teal (primary), Coral (accent), Mustard (secondary), Lavender (tertiary)
// - Theme is NOT switchable to maintain consistent doodle aesthetic

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
