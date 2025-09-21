export interface Analysis {
  summary: string;
  legalTerms: { term: string; explanation: string; severity: 'low' | 'medium' | 'high' }[];
  risks: { risk: string; severity: 'low' | 'medium' | 'high'; impact: string }[];
  relevantLaws: { law: string; section: string; description: string }[];
  recommendations: { recommendation: string; priority: 'low' | 'medium' | 'high' }[];
  fairnesScore: number;
  complexity: 'simple' | 'moderate' | 'complex';
  estimatedReadTime: number;
  keyHighlights: string[];
  redFlags: string[];
}

export interface DocumentType {
  value: string;
  label: string;
  icon: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ComparisonResult {
  similarities: string[];
  differences: string[];
  recommendation: string;
}