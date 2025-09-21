import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GitCompare, FileText, ArrowRight } from 'lucide-react';
import { ComparisonResult } from '../types';

interface ComparisonToolProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComparisonTool: React.FC<ComparisonToolProps> = ({ isOpen, onClose }) => {
  const [document1, setDocument1] = useState('');
  const [document2, setDocument2] = useState('');
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  const handleCompare = () => {
    if (!document1.trim() || !document2.trim()) return;
    
    setIsComparing(true);
    // Simulate comparison
    setTimeout(() => {
      setComparison({
        similarities: [
          'Both documents include standard termination clauses',
          'Similar payment terms structure',
          'Comparable dispute resolution mechanisms'
        ],
        differences: [
          'Document 1 has stricter penalty clauses',
          'Document 2 includes additional insurance requirements',
          'Different notice periods for termination'
        ],
        recommendation: 'Document 2 appears more balanced with better tenant protections. Consider negotiating the insurance requirements in Document 2.'
      });
      setIsComparing(false);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GitCompare className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Document Comparison</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document 1
              </label>
              <textarea
                value={document1}
                onChange={(e) => setDocument1(e.target.value)}
                placeholder="Paste first document here..."
                className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document 2
              </label>
              <textarea
                value={document2}
                onChange={(e) => setDocument2(e.target.value)}
                placeholder="Paste second document here..."
                className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <button
              onClick={handleCompare}
              disabled={!document1.trim() || !document2.trim() || isComparing}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isComparing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Comparing...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <GitCompare className="h-4 w-4" />
                  <span>Compare Documents</span>
                </div>
              )}
            </button>
          </div>

          {comparison && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-3">Similarities</h3>
                  <ul className="space-y-2">
                    {comparison.similarities.map((similarity, index) => (
                      <li key={index} className="text-sm text-green-800 flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{similarity}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h3 className="font-semibold text-orange-900 mb-3">Key Differences</h3>
                  <ul className="space-y-2">
                    {comparison.differences.map((difference, index) => (
                      <li key={index} className="text-sm text-orange-800 flex items-start space-x-2">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{difference}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Recommendation</h3>
                <p className="text-sm text-blue-800">{comparison.recommendation}</p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};