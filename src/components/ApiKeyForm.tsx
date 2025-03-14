
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FirecrawlService } from '@/utils/FirecrawlService';
import { toast } from "sonner";

interface ApiKeyFormProps {
  onApiKeySaved: () => void;
}

const ApiKeyForm = ({ onApiKeySaved }: ApiKeyFormProps) => {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast.error('APIキーを入力してください');
      return;
    }
    
    setIsLoading(true);
    
    try {
      FirecrawlService.saveApiKey(apiKey);
      toast.success('APIキーを保存しました');
      onApiKeySaved();
    } catch (error) {
      console.error('APIキー保存エラー:', error);
      toast.error('APIキーの保存に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">FirecrawlのAPIキーを設定</h2>
      <p className="text-gray-600 mb-4">
        Xのプロフィールスクレイピングには<a href="https://firecrawl.dev" target="_blank" rel="noopener noreferrer" className="text-resume-blue hover:underline">Firecrawl</a>のAPIキーが必要です。
        <br />
        取得したAPIキーを以下に入力してください。
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 mb-1">
            APIキー
          </label>
          <Input
            id="api-key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk_live_..."
            className="w-full"
          />
        </div>
        
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-resume-blue hover:bg-resume-darkBlue"
        >
          {isLoading ? '保存中...' : 'APIキーを保存'}
        </Button>
      </form>
    </div>
  );
};

export default ApiKeyForm;
