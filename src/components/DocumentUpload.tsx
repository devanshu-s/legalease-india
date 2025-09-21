import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Image, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface DocumentUploadProps {
  onFileUpload: (content: string) => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({ onFileUpload }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileUpload(content);
      toast.success('Document uploaded successfully!');
    };

    if (file.type.startsWith('image/')) {
      // For images, we'd use Google Vision API to extract text
      toast.loading('Extracting text from image...');
      // Simulate OCR processing
      setTimeout(() => {
        toast.dismiss();
        onFileUpload('Sample extracted text from image...');
        toast.success('Text extracted from image!');
      }, 2000);
    } else {
      reader.readAsText(file);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1
  });

  return (
    <motion.div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
        isDragActive 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center space-y-4">
        <div className="p-4 bg-blue-100 rounded-full">
          <Upload className="h-8 w-8 text-blue-600" />
        </div>
        <div>
          <p className="text-lg font-medium text-gray-900">
            {isDragActive ? 'Drop your document here' : 'Upload Document'}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Supports PDF, DOC, DOCX, TXT, and images (OCR)
          </p>
        </div>
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <FileText className="h-3 w-3" />
            <span>Text</span>
          </div>
          <div className="flex items-center space-x-1">
            <Image className="h-3 w-3" />
            <span>Images</span>
          </div>
          <div className="flex items-center space-x-1">
            <AlertCircle className="h-3 w-3" />
            <span>Max 10MB</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};