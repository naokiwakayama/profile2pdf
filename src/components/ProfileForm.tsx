
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus, Trash2 } from "lucide-react";
import { FirecrawlService } from '@/utils/FirecrawlService';

interface ProfileFormProps {
  onSubmit: (urls: {xProfileUrl: string, referenceUrls: string[]}) => void;
}

const ProfileForm = ({ onSubmit }: ProfileFormProps) => {
  const [xProfileUrl, setXProfileUrl] = useState('');
  const [referenceUrls, setReferenceUrls] = useState<string[]>(['']);
  const [errors, setErrors] = useState<{xProfile: string, references: string[]}>({
    xProfile: '',
    references: ['']
  });

  const validateXProfileUrl = (input: string): boolean => {
    // Basic validation for X/Twitter URLs
    const regex = /^https?:\/\/(www\.)?(twitter|x)\.com\/[a-zA-Z0-9_]+\/?$/;
    return regex.test(input);
  };

  const validateReferenceUrl = (input: string): boolean => {
    // Basic validation for general URLs
    if (!input.trim()) return true; // 空のURLは有効として扱う（後で除外する）
    
    try {
      new URL(input);
      return true;
    } catch (e) {
      return false;
    }
  };

  const addReferenceUrl = () => {
    setReferenceUrls([...referenceUrls, '']);
    setErrors({
      ...errors,
      references: [...errors.references, '']
    });
  };

  const removeReferenceUrl = (index: number) => {
    const newUrls = [...referenceUrls];
    newUrls.splice(index, 1);
    setReferenceUrls(newUrls);

    const newErrors = [...errors.references];
    newErrors.splice(index, 1);
    setErrors({
      ...errors,
      references: newErrors
    });
  };

  const handleReferenceUrlChange = (index: number, value: string) => {
    const newUrls = [...referenceUrls];
    newUrls[index] = value;
    setReferenceUrls(newUrls);
    
    // Clear error when typing
    const newErrors = [...errors.references];
    newErrors[index] = '';
    setErrors({
      ...errors,
      references: newErrors
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset all errors
    const newReferenceErrors = referenceUrls.map(() => '');
    setErrors({
      xProfile: '',
      references: newReferenceErrors
    });
    
    // Validate all inputs
    let hasError = false;
    
    // Validate X profile URL
    if (!xProfileUrl.trim()) {
      setErrors(prev => ({ ...prev, xProfile: 'XプロフィールのURLを入力してください' }));
      hasError = true;
    } else if (!validateXProfileUrl(xProfileUrl)) {
      setErrors(prev => ({ ...prev, xProfile: '有効なX(Twitter)のプロフィールURLを入力してください' }));
      hasError = true;
    }
    
    // Validate reference URLs
    const newErrors = [...newReferenceErrors];
    referenceUrls.forEach((url, index) => {
      if (url.trim() && !validateReferenceUrl(url)) {
        newErrors[index] = '有効なURLを入力してください';
        hasError = true;
      }
    });
    
    if (hasError) {
      setErrors(prev => ({ ...prev, references: newErrors }));
      return;
    }
    
    // Filter out empty reference URLs
    const filteredReferenceUrls = referenceUrls.filter(url => url.trim());
    
    // Call the onSubmit callback
    onSubmit({
      xProfileUrl,
      referenceUrls: filteredReferenceUrls
    });
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
          value={xProfileUrl}
          onChange={(e) => {
            setXProfileUrl(e.target.value);
            setErrors(prev => ({ ...prev, xProfile: '' }));
          }}
          placeholder="https://x.com/username"
          className="w-full px-4 py-3 rounded-lg text-lg border-gray-300 focus:border-resume-blue focus:ring-2 focus:ring-resume-blue/50 transition-all"
        />
        
        {errors.xProfile && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm mt-1"
          >
            {errors.xProfile}
          </motion.p>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-lg font-medium text-gray-700">
            参考URL (任意):
          </label>
          
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={addReferenceUrl}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            追加
          </Button>
        </div>
        
        {referenceUrls.map((url, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex-grow space-y-1">
              <Input
                type="url"
                value={url}
                onChange={(e) => handleReferenceUrlChange(index, e.target.value)}
                placeholder="https://example.com/portfolio"
                className="w-full px-4 py-3 rounded-lg text-lg border-gray-300 focus:border-resume-blue focus:ring-2 focus:ring-resume-blue/50 transition-all"
              />
              
              {errors.references[index] && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm"
                >
                  {errors.references[index]}
                </motion.p>
              )}
            </div>
            
            {referenceUrls.length > 1 && (
              <Button 
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeReferenceUrl(index)}
                className="text-gray-500 hover:text-red-500"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            )}
          </div>
        ))}
        
        <p className="text-sm text-gray-500">
          ポートフォリオやGitHubなど、あなたのスキルを示すサイトのURLを追加できます
        </p>
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
        公開されているXプロフィールと参考URLのみ対応しています
      </p>
    </form>
  );
};

export default ProfileForm;
