
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BusinessEntitySelection from "./pages/BusinessEntitySelection";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LocationSelectionPage from "./pages/LocationSelectionPage";
import WaitlistPage from "./pages/WaitlistPage";

// Create a custom theme
const theme = extendTheme({
  fonts: {
    heading: "Haffer, sans-serif",
    body: "Haffer, sans-serif",
  },
  colors: {
    brand: {
      50: "#F0F9FF",
      100: "#E0F2FE",
      200: "#BAE6FD",
      300: "#7DD3FC",
      400: "#38BDF8",
      500: "#0EA5E9",
      600: "#0284C7",
      700: "#0369A1",
      800: "#075985",
      900: "#0F172A", // Dark blue from the original design
    },
  },
  styles: {
    global: {
      body: {
        bg: "white",
        color: "gray.800",
      },
    },
  },
});

const queryClient = new QueryClient();

const App = () => (
  <ChakraProvider theme={theme}>
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
