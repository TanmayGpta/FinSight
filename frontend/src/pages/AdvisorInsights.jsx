import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  AlertCircle,
  TrendingDown,
  ChevronRight,
  X,
  Zap,
} from "lucide-react";

import Sidebar from "../components/ui/SideBar";
const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

const mockRecommendations = [
  {
    id: 1,
    alert: "Critical Risk",
    severity: "critical",
    recommendation:
      "Recommend immediate intervention and performance review for Deogarh branch. Portfolio at risk has exceeded safe thresholds.",
    reason: "Simple PAR Warning",
    branch: "087:Deogarh",
    detailsTitle: "Portfolio at Risk Analysis",
    detailedExplanation:
      "The Deogarh branch has shown a significant increase in Portfolio at Risk (PAR) over the past 3 months. PAR increased from 8.2% to 14.5%, crossing the critical threshold of 10%. This indicates that borrowers are facing repayment difficulties, which could lead to higher default rates if not addressed immediately.",
    ruleDetails:
      "The rule 'Simple PAR Warning' triggers when: PAR > 10% AND branch_size > 500 customers AND trend is upward. This rule uses historical PAR data and trends to predict risk.",
    recommendations: [
      "Conduct immediate field visits to understand borrower challenges",
      "Implement targeted loan restructuring programs",
      "Increase collection efforts and borrower support",
      "Review credit underwriting standards",
    ],
    metrics: {
      current_par: "14.5%",
      previous_par: "8.2%",
      borrowers_at_risk: 245,
      potential_loss: "₹28,50,000",
    },
  },
  {
    id: 2,
    alert: "Warning",
    severity: "warning",
    recommendation:
      "Monitor collection efficiency closely. Mungra Badshahpur branch showing declining trend in recovery rates.",
    reason: "Collection Efficiency Decline",
    branch: "254:Mungra Badshahpur",
    detailsTitle: "Collection Efficiency Trend",
    detailedExplanation:
      "The Mungra Badshahpur branch has experienced a 12% decline in collection efficiency over the last quarter. Collection rates dropped from 94.2% to 82.8%. While not yet critical, this downward trend suggests emerging challenges in borrower repayment capacity or collection team performance.",
    ruleDetails:
      "The rule 'Collection Efficiency Decline' triggers when: collection_rate < 85% AND trend_slope is negative AND decline_rate > 5% in 90 days. This predictive rule helps identify deteriorating performance before crisis.",
    recommendations: [
      "Analyze borrower repayment patterns and identify problem accounts",
      "Review collection team performance and provide additional training",
      "Implement early warning system for high-risk borrowers",
      "Consider collection incentive adjustments",
    ],
    metrics: {
      current_efficiency: "82.8%",
      previous_efficiency: "94.2%",
      overdue_accounts: 87,
      recovery_potential: "₹12,40,000",
    },
  },
  {
    id: 3,
    alert: "Opportunity",
    severity: "opportunity",
    recommendation:
      "Hariyali branch is showing exceptional performance. Consider expansion of loan products and increase in disbursement targets.",
    reason: "High Performance Signal",
    branch: "156:Hazaribagh Branch",
    detailsTitle: "High Performance Analysis",
    detailedExplanation:
      "The Hazaribagh branch has demonstrated consistently strong performance across all key metrics. Growth rate is 18% above average, PAR is well-controlled at 3.2%, and customer satisfaction scores are in the top 10%. This branch is a model for operational excellence.",
    ruleDetails:
      "The rule 'High Performance Signal' triggers when: PAR < 5% AND growth_rate > 12% AND customer_satisfaction > 85% AND operational_efficiency > 90%. This rule identifies branches ready for expansion.",
    recommendations: [
      "Increase loan disbursement targets by 25%",
      "Launch new loan products (seasonal, business expansion)",
      "Replicate operational practices to other branches",
      "Consider branch manager for training/leadership roles",
    ],
    metrics: {
      current_par: "3.2%",
      growth_rate: "18.3%",
      customer_satisfaction: "92%",
      expansion_potential: "₹45,50,000",
    },
  },
  {
    id: 4,
    alert: "Warning",
    severity: "warning",
    recommendation:
      "Giridih office requires portfolio diversification review. Over-concentration in agricultural loans detected.",
    reason: "Portfolio Concentration Risk",
    branch: "203:Giridih Office",
    detailsTitle: "Portfolio Concentration Analysis",
    detailedExplanation:
      "Giridih office has 68% of its portfolio in agricultural loans, creating significant concentration risk. While agricultural lending is important, this level of concentration exposes the branch to seasonal volatility and sector-specific shocks.",
    ruleDetails:
      "The rule 'Portfolio Concentration Risk' triggers when: Single_sector_percentage > 60% AND portfolio_size > 300 accounts AND market_volatility is high. This rule prevents over-reliance on single sectors.",
    recommendations: [
      "Develop diversification strategy across 3-4 sectors",
      "Create business expansion and trade finance products",
      "Partner with NBFC for non-agricultural lending",
      "Train staff on new product categories",
    ],
    metrics: {
      agricultural_concentration: "68%",
      target_concentration: "45%",
      diversification_gap: "23%",
      new_loan_potential: "₹8,70,000",
    },
  },
];

const AlertIcon = ({ severity }) => {
  switch (severity) {
    case "critical":
      return <AlertTriangle className="h-5 w-5" />;
    case "warning":
      return <AlertCircle className="h-5 w-5" />;
    case "opportunity":
      return <Zap className="h-5 w-5" />;
    default:
      return null;
  }
};

const AlertColor = ({ severity }) => {
  switch (severity) {
    case "critical":
      return {
        bg: "bg-red-50",
        border: "border-red-200",
        text: "text-red-700",
        badge: "bg-red-100 text-red-700",
      };
    case "warning":
      return {
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        text: "text-yellow-700",
        badge: "bg-yellow-100 text-yellow-700",
      };
    case "opportunity":
      return {
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-700",
        badge: "bg-green-100 text-green-700",
      };
    default:
      return {
        bg: "bg-slate-50",
        border: "border-slate-200",
        text: "text-slate-700",
        badge: "bg-slate-100 text-slate-700",
      };
  }
};

export default function AdvisorInsights() {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setRecommendations(mockRecommendations);
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleCardClick = (recommendation) => {
    setSelectedCard(recommendation);
  };

  const closeModal = () => {
    setSelectedCard(null);
  };

  const colors = selectedCard ? AlertColor({ severity: selectedCard.severity }) : {};

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Header Section */}
        <div className="border-b border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Advisor Insights
              </h1>
              <p className="text-sm text-slate-600">
                AI-Powered recommendations and explainable insights
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1">
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">
                Inference Engine Active
              </span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mb-4 inline-block rounded-full bg-emerald-100 p-4">
                  <Zap className="h-8 w-8 animate-pulse text-emerald-600" />
                </div>
                <p className="text-slate-600">Running inference engine...</p>
                <p className="text-sm text-slate-500 mt-1">
                  Analyzing portfolio and generating recommendations
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-max">
              {recommendations.map((rec) => {
                const colors = AlertColor({ severity: rec.severity });
                return (
                  <div
                    key={rec.id}
                    onClick={() => handleCardClick(rec)}
                    className={cn(
                      "rounded-lg border p-5 transition-all duration-200 cursor-pointer hover:shadow-lg hover:-translate-y-1",
                      colors.bg,
                      colors.border,
                    )}
                  >
                    {/* Alert Title */}
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={cn("flex-shrink-0 mt-0.5", colors.text)}>
                          <AlertIcon severity={rec.severity} />
                        </div>
                        <div>
                          <h3
                            className={cn(
                              "text-lg font-bold",
                              colors.text,
                            )}
                          >
                            {rec.alert}
                          </h3>
                          <p className="text-xs text-slate-600 mt-1">
                            {rec.branch}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Prescriptive Action */}
                    <p className="text-sm text-slate-800 mb-4 leading-relaxed">
                      {rec.recommendation}
                    </p>

                    {/* Divider */}
                    <div className="my-4 border-t border-slate-300" />

                    {/* Explainable Insight */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-slate-700">
                        Rule Applied:
                      </p>
                      <div className={cn(
                        "inline-block px-3 py-1.5 rounded text-xs font-medium",
                        colors.badge,
                      )}>
                        {rec.reason}
                      </div>
                    </div>

                    {/* Click to Expand */}
                    <div className="mt-4 flex items-center text-xs font-medium text-slate-600 hover:text-slate-800">
                      <span>View Details</span>
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Expanded Details Modal */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className={cn(
            "w-full max-w-2xl rounded-lg border shadow-2xl overflow-hidden",
            colors.border,
          )}>
            {/* Modal Header */}
            <div className={cn(
              "flex items-center justify-between px-6 py-4 border-b",
              colors.bg,
              colors.border,
            )}>
              <div className="flex items-center gap-3">
                <div className={cn("flex-shrink-0", colors.text)}>
                  <AlertIcon severity={selectedCard.severity} />
                </div>
                <div>
                  <h2 className={cn("text-xl font-bold", colors.text)}>
                    {selectedCard.detailsTitle}
                  </h2>
                  <p className="text-sm text-slate-600">{selectedCard.branch}</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="bg-white p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Detailed Explanation */}
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Overview</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedCard.detailedExplanation}
                </p>
              </div>

              {/* Rule Details */}
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">
                  How This Rule Works
                </h3>
                <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
                  <p className="text-sm text-slate-700 leading-relaxed font-mono">
                    {selectedCard.ruleDetails}
                  </p>
                </div>
              </div>

              {/* Key Metrics */}
              <div>
                <h3 className="font-semibold text-slate-800 mb-3">
                  Key Metrics
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(selectedCard.metrics).map(([key, value]) => (
                    <div
                      key={key}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                    >
                      <p className="text-xs text-slate-600 capitalize">
                        {key.replace(/_/g, " ")}
                      </p>
                      <p className="mt-1 text-lg font-bold text-emerald-600">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Actions */}
              <div>
                <h3 className="font-semibold text-slate-800 mb-3">
                  Recommended Actions
                </h3>
                <ul className="space-y-2">
                  {selectedCard.recommendations.map((action, index) => (
                    <li key={index} className="flex gap-3 text-sm text-slate-700">
                      <span className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                        {index + 1}
                      </span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-lg bg-slate-200 text-slate-800 font-medium hover:bg-slate-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
