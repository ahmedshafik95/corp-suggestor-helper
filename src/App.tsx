
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BusinessEntitySelection from "./pages/BusinessEntitySelection";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LocationSelectionPage from "./pages/LocationSelectionPage";
import WaitlistPage from "./pages/WaitlistPage";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const queryClient = new QueryClient();

// Extend the theme to include custom colors, fonts, etc
const theme = extendTheme({
  fonts: {
    heading: "'Haffer', sans-serif",
    body: "'Haffer', sans-serif",
  },
  colors: {
    primary: {
      500: '#0F172A', // Default button color
      600: '#1E293B', // Hover state
    },
    blue: {
      600: '#1E40AF', // Progress bar color
    }
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'medium',
      },
    },
  },
});

const App = () => (
  <ChakraProvider theme={theme}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<BusinessEntitySelection />} />
            <Route path="/location" element={<LocationSelectionPage />} />
            <Route path="/company-search" element={<Index />} />
            <Route path="/waitlist" element={<WaitlistPage />} />
            <Route 
              path="/waitlist/quebec" 
              element={
                <WaitlistPage 
                  title="Désolé! Unfortunately, we can't onboard you (just yet)"
                  description="Stay in touch with us to be the first to know when we will be available in Quebec!"
                />
              } 
            />
            <Route 
              path="/waitlist/international" 
              element={
                <WaitlistPage 
                  title="Coming soon to your region"
                  description="Stay in touch with us to be the first to know when we will be available in your region!"
                />
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ChakraProvider>
);

export default App;
