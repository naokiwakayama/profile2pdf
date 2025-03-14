
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import ProfileForm from '@/components/ProfileForm';
import ApiKeyForm from '@/components/ApiKeyForm';
import LoadingState from '@/components/LoadingState';
import { fetchProfileData } from '@/utils/profileFetcher';
import { FirecrawlService } from '@/utils/FirecrawlService';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // APIキーが設定されているか確認
    const apiKey = FirecrawlService.getApiKey();
    setHasApiKey(!!apiKey);
  }, []);

  const handleApiKeySaved = () => {
    setHasApiKey(true);
  };

  const handleProfileSubmit = async (url: string) => {
    setIsLoading(true);
    
    try {
      // プロフィール情報を取得
      const profileData = await fetchProfileData(url);
      
      // Store the data in sessionStorage to persist between pages
      sessionStorage.setItem('profileData', JSON.stringify(profileData));
      
      // Show success notification
      toast.success("プロフィール情報を取得しました");
      
      // Navigate to editor page
      navigate('/editor');
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error("プロフィールの取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-resume-blue/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-resume-lightBlue/5 rounded-full blur-3xl"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl mx-auto text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-resume-darkBlue">
          職務経歴書ジェネレーター
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Xのプロフィールから自動的に職務経歴書を生成し、編集・PDFとしてダウンロードできます。
        </p>
      </motion.div>

      {isLoading ? (
        <LoadingState message="プロフィール情報を取得しています..." />
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-2xl"
        >
          <Card className="glass p-8 rounded-xl">
            {!hasApiKey ? (
              <ApiKeyForm onApiKeySaved={handleApiKeySaved} />
            ) : (
              <ProfileForm onSubmit={handleProfileSubmit} />
            )}
          </Card>
        </motion.div>
      )}

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-auto py-6 text-sm text-gray-500 text-center w-full"
      >
        © 2025 職務経歴書ジェネレーター | 
        <a href="/privacy" className="mx-2 hover:text-resume-blue transition-colors">
          プライバシーポリシー
        </a> | 
        <a href="/terms" className="ml-2 hover:text-resume-blue transition-colors">
          利用規約
        </a>
      </motion.footer>
    </div>
  );
};

export default Index;
