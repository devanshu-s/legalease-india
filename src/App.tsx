import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { 
  FileText, AlertTriangle, BookOpen, Scale, Languages, 
  Lightbulb, Shield, Eye, MessageCircle, GitCompare,
  Download, Share2, Zap, Globe, Lock, TrendingUp,
  Clock, Award, Users, BarChart3, Search, Filter,
  Moon, Sun, Bell, Settings, HelpCircle
} from 'lucide-react';

import { Analysis, DocumentType } from './types';
import { DocumentUpload } from './components/DocumentUpload';
import { AnalysisCard } from './components/AnalysisCard';
import { ChatInterface } from './components/ChatInterface';
import { ComparisonTool } from './components/ComparisonTool';
import { GoogleTranslateService, GoogleLanguageService, SecurityService } from './services/googleServices';
import { exportToPDF, exportToJSON, shareAnalysis } from './utils/exportUtils';

function App() {
  const [inputText, setInputText] = useState('');
  const [documentType, setDocumentType] = useState('rental');
  const [language, setLanguage] = useState('english');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const documentTypes: DocumentType[] = [
    { value: 'rental', label: 'Rental Agreement', icon: '🏠', description: 'Housing and property rentals' },
    { value: 'employment', label: 'Employment Contract', icon: '💼', description: 'Job contracts and work agreements' },
    { value: 'loan', label: 'Loan Agreement', icon: '💰', description: 'Personal and business loans' },
    { value: 'nda', label: 'Non-Disclosure Agreement', icon: '🤐', description: 'Confidentiality agreements' },
    { value: 'terms', label: 'Terms & Conditions', icon: '📋', description: 'Service terms and policies' },
    { value: 'partnership', label: 'Partnership Deed', icon: '🤝', description: 'Business partnerships' },
    { value: 'sale', label: 'Sale Agreement', icon: '🛒', description: 'Property and asset sales' },
    { value: 'insurance', label: 'Insurance Policy', icon: '🛡️', description: 'Insurance contracts' },
    { value: 'franchise', label: 'Franchise Agreement', icon: '🏪', description: 'Franchise business deals' },
    { value: 'other', label: 'Other Document', icon: '📄', description: 'Other legal documents' }
  ];

  const sampleAnalyses: Record<string, Analysis> = {
    rental: {
      summary: "This rental agreement establishes a landlord-tenant relationship with specific terms for property use, payment obligations, and maintenance responsibilities. The document contains several clauses that may favor the landlord disproportionately.",
      legalTerms: [
        { term: "Security Deposit", explanation: "Money paid upfront as protection against damages or unpaid rent. Should typically not exceed 2-3 months' rent.", severity: 'medium' },
        { term: "Lock-in Period", explanation: "Minimum rental duration during which tenant cannot terminate without penalty. Common in Indian rentals.", severity: 'high' },
        { term: "Maintenance Charges", explanation: "Additional fees for common area upkeep, security, utilities. Should be clearly itemized.", severity: 'low' }
      ],
      risks: [
        { risk: "Excessive security deposit (4 months' rent)", severity: 'high', impact: "Financial burden and potential for disputes during refund" },
        { risk: "No clear deposit return timeline", severity: 'medium', impact: "Landlord may delay refund indefinitely" },
        { risk: "Tenant liable for major structural repairs", severity: 'high', impact: "Unexpected large expenses that should be landlord's responsibility" },
        { risk: "Daily penalty for late rent payment", severity: 'medium', impact: "Accumulating charges that may exceed reasonable limits" }
      ],
      relevantLaws: [
        { law: "Rent Control Act", section: "Varies by State", description: "Governs rent regulation and tenant rights in different states" },
        { law: "Transfer of Property Act, 1882", section: "Section 105-117", description: "Defines lease agreements and landlord-tenant relationships" },
        { law: "Consumer Protection Act, 2019", section: "Section 2(7)", description: "Protects against unfair trade practices in housing services" },
        { law: "Indian Contract Act, 1872", section: "Section 10", description: "Ensures validity and enforceability of rental agreements" }
      ],
      recommendations: [
        { recommendation: "Negotiate security deposit to maximum 2-3 months' rent", priority: 'high' },
        { recommendation: "Add clause for deposit refund within 30 days of vacating", priority: 'high' },
        { recommendation: "Clarify that major repairs are landlord's responsibility", priority: 'medium' },
        { recommendation: "Cap late payment penalty to reasonable amount (₹100-200/day)", priority: 'medium' },
        { recommendation: "Include property condition documentation clause", priority: 'low' }
      ],
      fairnesScore: 65,
      complexity: 'moderate',
      estimatedReadTime: 8,
      keyHighlights: [
        "11-month lock-in period with no early termination",
        "Security deposit of ₹1,00,000 (4 months' rent)",
        "Tenant responsible for all repairs including structural",
        "₹500 daily penalty for late rent payment"
      ],
      redFlags: [
        "Excessive security deposit amount",
        "No deposit refund timeline specified",
        "Unfair repair responsibility allocation"
      ]
    }
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    setIsAnalyzing(true);
    
    try {
      // Security scan
      const securityResult = await SecurityService.scanForMaliciousContent(inputText);
      if (!securityResult.isSafe) {
        throw new Error('Document contains potentially harmful content');
      }

      // Sentiment analysis
      const sentiment = await GoogleLanguageService.analyzeSentiment(inputText);
      
      // Entity extraction
      const entities = await GoogleLanguageService.extractEntities(inputText);

      // Simulate comprehensive analysis
      setTimeout(() => {
        const baseAnalysis = sampleAnalyses[documentType] || sampleAnalyses.rental;
        
        // Enhance analysis with AI insights
        const enhancedAnalysis: Analysis = {
          ...baseAnalysis,
          fairnesScore: Math.max(30, Math.min(95, baseAnalysis.fairnesScore + (sentiment.score * 10))),
          complexity: inputText.length > 2000 ? 'complex' : inputText.length > 1000 ? 'moderate' : 'simple',
          estimatedReadTime: Math.ceil(inputText.split(' ').length / 200)
        };

        setAnalysis(enhancedAnalysis);
        setIsAnalyzing(false);
      }, 3000);
    } catch (error) {
      console.error('Analysis failed:', error);
      setIsAnalyzing(false);
    }
  };

  const handleSampleLoad = () => {
    const sampleTexts = {
      rental: `RENTAL AGREEMENT

This agreement is made between Mr. Rajesh Kumar (Landlord) and Ms. Priya Sharma (Tenant).

PROPERTY: 2BHK Apartment, Sector 15, Gurgaon

TERMS:
1. Monthly rent: ₹25,000 payable by 5th of each month
2. Security deposit: ₹1,00,000 (4 months rent) - NON-REFUNDABLE in case of damages
3. Lock-in period: 11 months - NO EARLY TERMINATION allowed under any circumstances
4. Maintenance charges: ₹3,000 per month additional (non-negotiable)
5. Tenant responsible for ALL repairs including plumbing, electrical, structural damages
6. Deposit refundable after 60 days of vacating (subject to deductions)
7. Late payment penalty: ₹500 per day (no grace period)
8. Any damage to property will be deducted from deposit at landlord's discretion
9. Landlord can increase rent by 15% annually without notice
10. Tenant must vacate within 24 hours if rent is delayed by more than 10 days

ADDITIONAL CONDITIONS:
- No pets allowed (₹10,000 penalty for violation)
- No guests for more than 2 days (₹1,000 per day penalty)
- Landlord can inspect property anytime without prior notice
- All utility bills in tenant's name from day 1
- Any legal disputes to be resolved in landlord's preferred court only

The tenant agrees to these terms and conditions without any modifications.

Signed: _________________ (Tenant)
Date: _________________`,
      
      employment: `EMPLOYMENT CONTRACT

Company: TechCorp Solutions Pvt Ltd
Employee: John Doe
Position: Software Developer

TERMS OF EMPLOYMENT:
1. Salary: ₹8,00,000 per annum (subject to deductions)
2. Bond period: 3 years - Employee cannot leave without paying ₹5,00,000
3. Working hours: 9 AM to 9 PM, 6 days a week (including Saturdays)
4. Overtime: No additional compensation for extra hours
5. Leave policy: 10 days annual leave (including sick leave)
6. Notice period: 3 months (company can terminate with 1 day notice)
7. Non-compete: Cannot work in similar industry for 2 years after leaving
8. Confidentiality: All work belongs to company, including personal projects
9. Training cost recovery: ₹2,00,000 if leaving within 2 years
10. Performance review: Annual increment not guaranteed

The employee accepts all terms without negotiation.`
    };
    
    setInputText(sampleTexts[documentType as keyof typeof sampleTexts] || sampleTexts.rental);
  };

  const handleTranslate = async () => {
    if (!analysis) return;
    
    const translatedSummary = await GoogleTranslateService.translateText(
      analysis.summary, 
      language === 'english' ? 'hi' : 'en'
    );
    
    setAnalysis({
      ...analysis,
      summary: translatedSummary
    });
  };

  const getFairnessColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'complex': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    }`}>
      <Toaster position="top-right" />
      
      {/* Enhanced Header */}
      <header className={`border-b shadow-sm transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <motion.div 
                className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Scale className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  LegalEase India Pro
                </h1>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  AI-Powered Legal Document Analysis
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search legal terms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              {/* Language Toggle */}
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600' 
                  : 'bg-amber-50 border-amber-200'
              }`}>
                <Languages className={`h-4 w-4 ${isDarkMode ? 'text-gray-300' : 'text-amber-600'}`} />
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  className={`bg-transparent text-sm font-medium focus:outline-none ${
                    isDarkMode ? 'text-gray-300' : 'text-amber-700'
                  }`}
                >
                  <option value="english">English</option>
                  <option value="hindi">हिंदी</option>
                </select>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              {/* Notifications */}
              <button className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
                <Bell className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className={`border-b transition-colors ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className={`h-4 w-4 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  50,000+ Documents Analyzed
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className={`h-4 w-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  10,000+ Happy Users
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className={`h-4 w-4 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  99.5% Accuracy Rate
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Lock className={`h-4 w-4 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Secured by Google Cloud
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Enhanced Input Section */}
          <div className="space-y-6">
            <motion.div 
              className={`rounded-xl shadow-sm border p-6 transition-colors ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Document Analysis
                  </h2>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsComparisonOpen(true)}
                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                    title="Compare Documents"
                  >
                    <GitCompare className="h-4 w-4" />
                  </button>
                  <button
                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                    title="Settings"
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Document Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {documentTypes.slice(0, 6).map(type => (
                      <button
                        key={type.value}
                        onClick={() => setDocumentType(type.value)}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          documentType === type.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : isDarkMode
                              ? 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{type.icon}</span>
                          <div>
                            <div className="font-medium text-sm">{type.label}</div>
                            <div className="text-xs opacity-75">{type.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Document Upload */}
                <DocumentUpload onFileUpload={setInputText} />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={`block text-sm font-medium ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Legal Text / Document Content
                    </label>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleSampleLoad}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Load Sample
                      </button>
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {inputText.length} characters
                      </span>
                    </div>
                  </div>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Paste your legal document here, or use the upload feature above..."
                    className={`w-full h-64 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>

                <div className="flex space-x-3">
                  <motion.button
                    onClick={handleAnalyze}
                    disabled={!inputText.trim() || isAnalyzing}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isAnalyzing ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Analyzing with AI...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Zap className="h-4 w-4" />
                        <span>Analyze Document</span>
                      </div>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Quick Info */}
            <motion.div 
              className={`rounded-xl border p-6 transition-colors ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600' 
                  : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-start space-x-3">
                <Lightbulb className={`h-5 w-5 mt-0.5 ${
                  isDarkMode ? 'text-yellow-400' : 'text-amber-600'
                }`} />
                <div>
                  <h3 className={`font-semibold mb-2 ${
                    isDarkMode ? 'text-yellow-400' : 'text-amber-900'
                  }`}>
                    AI-Powered Analysis Features
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className={`flex items-center space-x-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-amber-800'
                    }`}>
                      <Globe className="h-3 w-3" />
                      <span>Multi-language support</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-amber-800'
                    }`}>
                      <Lock className="h-3 w-3" />
                      <span>Security scanning</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-amber-800'
                    }`}>
                      <BarChart3 className="h-3 w-3" />
                      <span>Fairness scoring</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-amber-800'
                    }`}>
                      <MessageCircle className="h-3 w-3" />
                      <span>Interactive Q&A</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Enhanced Analysis Section */}
          <div className="space-y-6" id="analysis-section">
            {analysis ? (
              <AnimatePresence>
                {/* Analysis Overview */}
                <motion.div 
                  className={`rounded-xl shadow-sm border p-6 transition-colors ${
                    isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
                  }`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Analysis Overview
                    </h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => exportToPDF('analysis-section')}
                        className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                        title="Export to PDF"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => shareAnalysis(analysis)}
                        className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                        title="Share Analysis"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getFairnessColor(analysis.fairnesScore)}`}>
                        {analysis.fairnesScore}%
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Fairness Score
                      </div>
                    </div>
                    <div className="text-center">
                      <div className={`text-sm font-medium px-2 py-1 rounded ${getComplexityColor(analysis.complexity)}`}>
                        {analysis.complexity.toUpperCase()}
                      </div>
                      <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Complexity
                      </div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        {analysis.estimatedReadTime}m
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Read Time
                      </div>
                    </div>
                  </div>

                  {/* Key Highlights */}
                  <div className="mb-4">
                    <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Key Highlights
                    </h4>
                    <div className="space-y-1">
                      {analysis.keyHighlights.map((highlight, index) => (
                        <div key={index} className={`text-sm p-2 rounded ${
                          isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-700'
                        }`}>
                          • {highlight}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Summary */}
                <AnalysisCard
                  title="Plain Language Summary"
                  icon={BookOpen}
                  iconColor="text-green-600"
                  borderColor="border-slate-200"
                  delay={0.1}
                >
                  <p className={`leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {analysis.summary}
                  </p>
                  <div className="mt-3 flex items-center space-x-2">
                    <button
                      onClick={handleTranslate}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Translate
                    </button>
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {analysis.estimatedReadTime} min read
                    </span>
                  </div>
                </AnalysisCard>

                {/* Legal Terms */}
                <AnalysisCard
                  title="Legal Terms Explained"
                  icon={BookOpen}
                  iconColor="text-blue-600"
                  borderColor="border-slate-200"
                  delay={0.2}
                >
                  <div className="space-y-4">
                    {analysis.legalTerms.map((term, index) => (
                      <motion.div 
                        key={index} 
                        className="border-l-4 border-blue-200 pl-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {term.term}
                          </h4>
                          <span className={`text-xs px-2 py-1 rounded ${
                            term.severity === 'high' ? 'bg-red-100 text-red-800' :
                            term.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {term.severity}
                          </span>
                        </div>
                        <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {term.explanation}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </AnalysisCard>

                {/* Enhanced Risks */}
                <AnalysisCard
                  title="Risk Assessment & Red Flags"
                  icon={AlertTriangle}
                  iconColor="text-red-600"
                  borderColor="border-red-200"
                  delay={0.3}
                >
                  <div className="space-y-3">
                    {analysis.risks.map((riskItem, index) => (
                      <motion.div 
                        key={index} 
                        className={`p-3 rounded-lg border transition-colors ${
                          riskItem.severity === 'high' 
                            ? 'bg-red-50 border-red-200' 
                            : riskItem.severity === 'medium'
                              ? 'bg-yellow-50 border-yellow-200'
                              : 'bg-orange-50 border-orange-200'
                        }`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <div className="flex items-start space-x-3">
                          <AlertTriangle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                            riskItem.severity === 'high' ? 'text-red-600' :
                            riskItem.severity === 'medium' ? 'text-yellow-600' :
                            'text-orange-600'
                          }`} />
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${
                              riskItem.severity === 'high' ? 'text-red-800' :
                              riskItem.severity === 'medium' ? 'text-yellow-800' :
                              'text-orange-800'
                            }`}>
                              {riskItem.risk}
                            </p>
                            <p className={`text-xs mt-1 ${
                              riskItem.severity === 'high' ? 'text-red-700' :
                              riskItem.severity === 'medium' ? 'text-yellow-700' :
                              'text-orange-700'
                            }`}>
                              Impact: {riskItem.impact}
                            </p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded font-medium ${
                            riskItem.severity === 'high' ? 'bg-red-200 text-red-800' :
                            riskItem.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                            'bg-orange-200 text-orange-800'
                          }`}>
                            {riskItem.severity.toUpperCase()}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </AnalysisCard>

                {/* Enhanced Relevant Laws */}
                <AnalysisCard
                  title="Relevant Indian Laws & Regulations"
                  icon={Scale}
                  iconColor="text-purple-600"
                  borderColor="border-slate-200"
                  delay={0.4}
                >
                  <div className="space-y-3">
                    {analysis.relevantLaws.map((lawItem, index) => (
                      <motion.div 
                        key={index} 
                        className={`p-3 rounded-lg border transition-colors ${
                          isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-purple-50 border-purple-200'
                        }`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <div className="flex items-start space-x-3">
                          <Scale className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-purple-900'}`}>
                              {lawItem.law}
                            </h4>
                            <p className={`text-xs font-mono mt-1 ${
                              isDarkMode ? 'text-purple-400' : 'text-purple-700'
                            }`}>
                              {lawItem.section}
                            </p>
                            <p className={`text-sm mt-1 ${
                              isDarkMode ? 'text-gray-300' : 'text-purple-800'
                            }`}>
                              {lawItem.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </AnalysisCard>

                {/* Enhanced Recommendations */}
                <AnalysisCard
                  title="Expert Recommendations"
                  icon={Shield}
                  iconColor="text-green-600"
                  borderColor="border-green-200"
                  delay={0.5}
                >
                  <div className="space-y-3">
                    {analysis.recommendations.map((recItem, index) => (
                      <motion.div 
                        key={index} 
                        className={`p-3 rounded-lg border transition-colors ${
                          recItem.priority === 'high' 
                            ? 'bg-green-50 border-green-200' 
                            : recItem.priority === 'medium'
                              ? 'bg-blue-50 border-blue-200'
                              : 'bg-gray-50 border-gray-200'
                        }`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <div className="flex items-start space-x-3">
                          <Shield className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                            recItem.priority === 'high' ? 'text-green-600' :
                            recItem.priority === 'medium' ? 'text-blue-600' :
                            'text-gray-600'
                          }`} />
                          <div className="flex-1">
                            <p className={`text-sm ${
                              recItem.priority === 'high' ? 'text-green-800' :
                              recItem.priority === 'medium' ? 'text-blue-800' :
                              'text-gray-800'
                            }`}>
                              {recItem.recommendation}
                            </p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded font-medium ${
                            recItem.priority === 'high' ? 'bg-green-200 text-green-800' :
                            recItem.priority === 'medium' ? 'bg-blue-200 text-blue-800' :
                            'bg-gray-200 text-gray-800'
                          }`}>
                            {recItem.priority.toUpperCase()}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </AnalysisCard>

                {/* Enhanced Disclaimer */}
                <motion.div 
                  className={`border rounded-xl p-4 transition-colors ${
                    isDarkMode 
                      ? 'bg-yellow-900 border-yellow-700' 
                      : 'bg-yellow-50 border-yellow-200'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                      isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                    }`} />
                    <div>
                      <p className={`text-sm font-medium ${
                        isDarkMode ? 'text-yellow-200' : 'text-yellow-800'
                      }`}>
                        ⚠️ This is not legal advice. Please consult a qualified lawyer for serious legal matters.
                      </p>
                      <p className={`text-xs mt-1 ${
                        isDarkMode ? 'text-yellow-300' : 'text-yellow-700'
                      }`}>
                        This AI-powered analysis provides general information and educational insights. 
                        For binding legal advice, consult with a licensed attorney familiar with your jurisdiction.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <motion.div 
                className={`rounded-xl shadow-sm border p-12 text-center transition-colors ${
                  isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
                }`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <FileText className={`h-8 w-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                </div>
                <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Ready for AI Analysis
                </h3>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Upload or paste your legal document to get started with our advanced AI-powered analysis.
                </p>
                <div className="mt-4 flex items-center justify-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Zap className="h-4 w-4 text-blue-500" />
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                      Instant Analysis
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Lock className="h-4 w-4 text-green-500" />
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                      Secure & Private
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-3">
        <motion.button
          onClick={() => setIsChatOpen(true)}
          className="p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Ask Legal Questions"
        >
          <MessageCircle className="h-6 w-6" />
        </motion.button>
        
        <motion.button
          className="p-3 bg-gray-600 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Help & Support"
        >
          <HelpCircle className="h-5 w-5" />
        </motion.button>
      </div>

      {/* Chat Interface */}
      <ChatInterface isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      
      {/* Comparison Tool */}
      <ComparisonTool isOpen={isComparisonOpen} onClose={() => setIsComparisonOpen(false)} />
    </div>
  );
}

export default App;