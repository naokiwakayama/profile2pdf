
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Download, Save } from 'lucide-react';
import ResumePreview from '@/components/ResumePreview';
import LoadingState from '@/components/LoadingState';
import { generatePdf } from '@/utils/pdfGenerator';

// Types
export interface ProfileData {
  username: string;
  displayName: string;
  bio: string;
  joinDate: string;
  location: string;
  website: string;
  tweetCount: number;
  followersCount: number;
  followingCount: number;
  skills: string[];
  recentPosts: {
    text: string;
    date: string;
  }[];
}

// Mock resume sections structure
export interface ResumeData {
  personalInfo: {
    name: string;
    location: string;
    website: string;
    contact: string;
  };
  summary: string;
  workExperience: {
    title: string;
    company: string;
    period: string;
    description: string;
  }[];
  skills: string[];
  education: {
    school: string;
    degree: string;
    period: string;
  }[];
  languages: string[];
}

const Editor = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('preview');

  useEffect(() => {
    // Retrieve the profile data from sessionStorage
    const storedData = sessionStorage.getItem('profileData');
    
    if (!storedData) {
      toast.error('プロフィールデータが見つかりませんでした');
      navigate('/');
      return;
    }
    
    try {
      const parsedData = JSON.parse(storedData) as ProfileData;
      setProfileData(parsedData);
      
      // Generate initial resume data from profile data
      const generatedResumeData = transformProfileToResume(parsedData);
      setResumeData(generatedResumeData);
    } catch (error) {
      console.error('Error parsing profile data:', error);
      toast.error('プロフィールデータの読み込みに失敗しました');
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Function to transform profile data to resume format
  const transformProfileToResume = (profile: ProfileData): ResumeData => {
    // This is a simplified transformation for the MVP
    // In a real implementation, this would use NLP and more advanced analysis
    return {
      personalInfo: {
        name: profile.displayName,
        location: profile.location || '未設定',
        website: profile.website || '未設定',
        contact: 'example@email.com' // Placeholder as X doesn't provide email
      },
      summary: `${profile.displayName}は${profile.bio || 'プロフェッショナル'}です。${profile.followersCount}人のフォロワーがおり、${profile.joinDate}からXを利用しています。`,
      workExperience: [
        {
          title: '推定職種',
          company: '推定企業名',
          period: '推定期間',
          description: 'プロフィールと投稿履歴から職務経験を自動生成します。実際のデータに基づき編集してください。'
        }
      ],
      skills: profile.skills || ['スキル1', 'スキル2', 'スキル3'],
      education: [
        {
          school: '推定学歴',
          degree: '推定学位',
          period: '推定期間'
        }
      ],
      languages: ['日本語']
    };
  };

  const handleResumeUpdate = (updatedResume: ResumeData) => {
    setResumeData(updatedResume);
  };

  const handleDownloadPdf = async () => {
    if (!resumeData) return;
    
    setIsLoading(true);
    try {
      await generatePdf(resumeData);
      toast.success('PDFを生成しました');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('PDFの生成に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (isLoading) {
    return <LoadingState message="職務経歴書を準備しています..." />;
  }

  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-4 px-6 border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-10"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            className="text-gray-600 hover:text-resume-blue flex items-center gap-2"
            onClick={handleBackToHome}
          >
            <ArrowLeft size={18} />
            戻る
          </Button>
          
          <h1 className="text-xl font-semibold text-resume-darkBlue">職務経歴書エディタ</h1>
          
          <Button
            className="bg-resume-blue hover:bg-resume-darkBlue text-white flex items-center gap-2"
            onClick={handleDownloadPdf}
          >
            <Download size={18} />
            PDFダウンロード
          </Button>
        </div>
      </motion.header>

      {/* Main content */}
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-grow p-6"
      >
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="preview" onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full max-w-md mx-auto mb-6 bg-white/80 backdrop-blur-sm">
              <TabsTrigger value="preview" className="flex-1">プレビュー</TabsTrigger>
              <TabsTrigger value="edit" className="flex-1">編集</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preview" className="mt-6">
              {resumeData && (
                <Card className="w-full max-w-4xl mx-auto p-0 overflow-hidden shadow-xl">
                  <div className="overflow-auto max-h-[80vh] p-8">
                    <ResumePreview 
                      resumeData={resumeData} 
                      editable={false} 
                      onUpdate={handleResumeUpdate}
                    />
                  </div>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="edit" className="mt-6">
              {resumeData && (
                <Card className="w-full max-w-4xl mx-auto overflow-hidden shadow-xl">
                  <div className="p-8">
                    <ResumePreview 
                      resumeData={resumeData} 
                      editable={true} 
                      onUpdate={handleResumeUpdate}
                    />
                    
                    <div className="mt-6 flex justify-end">
                      <Button
                        className="bg-resume-blue hover:bg-resume-darkBlue text-white flex items-center gap-2"
                      >
                        <Save size={18} />
                        変更を保存
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </motion.main>
    </div>
  );
};

export default Editor;
