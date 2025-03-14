
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ProfileFormProps {
  onSubmit: (url: string) => void;
}

const ProfileForm = ({ onSubmit }: ProfileFormProps) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const validateUrl = (input: string): boolean => {
    // Basic validation for X/Twitter URLs
    const regex = /^https?:\/\/(www\.)?(twitter|x)\.com\/[a-zA-Z0-9_]+\/?$/;
    return regex.test(input);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous error
    setError('');
    
    // Check if URL is provided
    if (!url.trim()) {
      setError('URLを入力してください');
      return;
    }
    
    // Validate URL format
    if (!validateUrl(url)) {
      setError('有効なX(Twitter)のプロフィールURLを入力してください');
      return;
    }
    
    // Call the onSubmit callback
    onSubmit(url);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label 
          htmlFor="profile-url" 
          className="block text-lg font-medium text-gray-700"
        >
          Xのプロフィール URL:
        </label>
        
        <Input
          id="profile-url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://x.com/username"
          className="w-full px-4 py-3 rounded-lg text-lg border-gray-300 focus:border-resume-blue focus:ring-2 focus:ring-resume-blue/50 transition-all"
        />
        
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm mt-1"
          >
            {error}
          </motion.p>
        )}
      </div>
      
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button 
          type="submit" 
          className="w-full h-12 bg-resume-blue hover:bg-resume-darkBlue transition-all duration-300 rounded-lg text-white text-lg font-medium flex items-center justify-center gap-2 shadow-lg shadow-resume-blue/20"
        >
          生成
          <ArrowRight className="h-5 w-5" />
        </Button>
      </motion.div>
      
      <p className="text-sm text-gray-500 text-center">
        公開されているXプロフィールのみ対応しています
      </p>
    </form>
  );
};

export default ProfileForm;
