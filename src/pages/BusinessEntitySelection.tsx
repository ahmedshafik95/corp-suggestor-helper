
import React from "react";
import { useNavigate } from "react-router-dom";
import { Building, Users, UserPlus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const BusinessEntitySelection = () => {
  const navigate = useNavigate();

  const handleEntitySelect = (entityType: string) => {
    // Store selected entity type if needed
    console.log("Selected entity type:", entityType);
    
    // Navigate to the company search page
    navigate("/company-search");
  };

  return (
    <div className="flex min-h-screen">
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
            <span className="bg-white/20 rounded-full px-4 py-2 text-sm backdrop-blur-sm">
              The best FX rates
            </span>
            <span className="bg-white/20 rounded-full px-4 py-2 text-sm backdrop-blur-sm">
              Multi-currency accounts
            </span>
            <span className="bg-white/20 rounded-full px-4 py-2 text-sm backdrop-blur-sm">
              No personal guarantee needed
            </span>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/70 text-sm">
            Trusted by 3,000+ Canadian businesses
          </p>
        </div>
      </div>

      {/* Right Side - Entity Selection */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-6">
        <div className="w-full max-w-xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-10">
            What's your business entity?
          </h1>

          <div className="space-y-4">
            <Button
              variant="outline"
              onClick={() => handleEntitySelect("corporation")}
              className="w-full justify-between p-6 text-base font-medium border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:hover:border-gray-700 dark:hover:bg-gray-900/50 transition-all"
            >
              <span className="flex items-center gap-3">
                <Building className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                <span>Corporation</span>
              </span>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Button>

            <Button
              variant="outline"
              onClick={() => handleEntitySelect("co-operative")}
              className="w-full justify-between p-6 text-base font-medium border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:hover:border-gray-700 dark:hover:bg-gray-900/50 transition-all"
            >
              <span className="flex items-center gap-3">
                <Users className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                <span>Co-operative (for profit and not-for-profit)</span>
              </span>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Button>

            <Button
              variant="outline"
              onClick={() => handleEntitySelect("sole-proprietorship")}
              className="w-full justify-between p-6 text-base font-medium border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:hover:border-gray-700 dark:hover:bg-gray-900/50 transition-all"
            >
              <span className="flex items-center gap-3">
                <UserPlus className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                <span>Sole-proprietorship and partnership</span>
              </span>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessEntitySelection;
