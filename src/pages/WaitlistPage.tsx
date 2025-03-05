
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TestimonialsCarousel from "@/components/Testimonial";

interface WaitlistPageProps {
  title?: string;
  description?: string;
}

const WaitlistPage = ({ 
  title = "We currently don't support your business",
  description = "Enter your email to sign up for a waitlist."
}: WaitlistPageProps) => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically integrate with a waitlist service
    toast({
      title: "Thank you for joining our waitlist!",
      description: "We'll notify you when we're ready to support your business.",
    });
    setEmail("");
  };

  // Testimonial data
  const testimonials = [
    {
      quote: "We needed a better card and spend management solution to serve everyone faster and deliver a better experience for end users.",
      author: "Josh Pickles",
      position: "Head of Global Strategic Sourcing and Procurement",
      company: "DoorDash",
      rating: 5,
      logoSrc: "https://cdn.worldvectorlogo.com/logos/doordash-1.svg"
    },
    {
      quote: "The ah-ha moment for me as a finance leader was — I can put everything in Venn. If spending is approaching limits in one area, I know in real time and can talk to leaders about possible tradeoffs.",
      author: "Andrew Maier",
      position: "Head of Finance",
      company: "Superhuman",
      rating: 5,
      logoSrc: "https://superhuman.com/static/favicon/safari-pinned-tab.svg"
    },
    {
      quote: "Venn's platform has streamlined our financial operations and given us unprecedented visibility into our spending.",
      author: "Sarah Johnson",
      position: "CFO",
      company: "TechStart Inc.",
      rating: 5
    }
  ];

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Left Side - Marketing Panel */}
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-b from-emerald-600 to-emerald-800 p-10 text-white flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute rounded-full w-96 h-96 bg-emerald-400/40 -top-20 -left-20 blur-xl"></div>
          <div className="absolute rounded-full w-80 h-80 bg-emerald-300/40 top-1/4 right-10 blur-xl"></div>
          <div className="absolute rounded-full w-72 h-72 bg-emerald-500/40 bottom-10 left-20 blur-xl"></div>
        </div>

        <div className="relative z-10">
          <div className="text-2xl font-bold mb-2">Venn</div>
        </div>

        <div className="relative z-10 space-y-4">
          <h1 className="text-5xl font-bold leading-tight">
            Better Canadian<br />
            business banking.
          </h1>
          
          <p className="text-2xl font-medium mt-4">
            Get started for free in 5 minutes.
          </p>

          <div className="flex flex-wrap gap-2 mt-6">
            <span className="bg-white/20 rounded-full px-4 py-2 text-sm backdrop-blur-sm">
              No monthly fees
            </span>
            <span className="bg-white/20 rounded-full px-4 py-2 text-sm backdrop-blur-sm">
              Cashback on card spend
            </span>
          </div>
        </div>

        {/* Testimonial section */}
        <div className="relative z-10 mt-6">
          <TestimonialsCarousel testimonials={testimonials} />
        </div>
      </div>

      {/* Right Side - Waitlist Form */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-xl">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6 sm:mb-8"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            <span>Back</span>
          </button>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">{title}</h1>
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">{description}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Your business email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 sm:p-4"
              />
            </div>
            <Button type="submit" className="w-full">Submit</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WaitlistPage;
