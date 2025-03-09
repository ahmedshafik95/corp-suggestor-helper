
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BusinessEntitySelection from "./pages/BusinessEntitySelection";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LocationSelectionPage from "./pages/LocationSelectionPage";
import WaitlistPage from "./pages/WaitlistPage";

const queryClient = new QueryClient();

const App = () => (
  <ChakraProvider value={{}}>
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
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
      </div>
    </QueryClientProvider>
  </ChakraProvider>
);

export default App;
