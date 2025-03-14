import FirecrawlApp from '@mendable/firecrawl-js';

interface ErrorResponse {
  success: false;
  error: string;
}

export interface ScrapedProfileData {
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

export interface ScrapedReferenceData {
  url: string;
  title: string;
  content: string;
  keywords: string[];
  extractedSkills: string[];
  lastScraped: string;
}

interface CrawlStatusResponse {
  success: true;
  status: string;
  completed: number;
  total: number;
  creditsUsed: number;
  expiresAt: string;
  data: any[];
}

type CrawlResponse = CrawlStatusResponse | ErrorResponse;

export class FirecrawlService {
  private static API_KEY_STORAGE_KEY = 'firecrawl_api_key';
  private static firecrawlApp: FirecrawlApp | null = null;

  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
    this.firecrawlApp = new FirecrawlApp({ apiKey });
    console.log('API key saved successfully');
  }

  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  static async extractProfileData(url: string): Promise<ScrapedProfileData> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('APIキーが設定されていません');
    }

    if (!this.firecrawlApp) {
      this.firecrawlApp = new FirecrawlApp({ apiKey });
    }

    try {
      console.log(`Xプロフィールをスクレイピング中: ${url}`);
      
      const crawlResponse = await this.firecrawlApp.crawlUrl(url, {
        limit: 10, // プロフィールページと最近の投稿を取得するのに十分
        scrapeOptions: {
          formats: ['markdown', 'html']
        }
      }) as CrawlResponse;

      if (!crawlResponse.success) {
        throw new Error(`スクレイピングに失敗しました: ${(crawlResponse as ErrorResponse).error}`);
      }

      // スクレイピングしたデータから必要な情報を抽出
      return this.parseProfileData(crawlResponse.data, url);
    } catch (error) {
      console.error('スクレイピングエラー:', error);
      throw new Error('プロフィール取得中にエラーが発生しました');
    }
  }

  static async extractReferenceData(url: string): Promise<ScrapedReferenceData> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('APIキーが設定されていません');
    }

    if (!this.firecrawlApp) {
      this.firecrawlApp = new FirecrawlApp({ apiKey });
    }

    try {
      console.log(`参考URLをスクレイピング中: ${url}`);
      
      const crawlResponse = await this.firecrawlApp.crawlUrl(url, {
        limit: 5, // 参考URLのページを取得するのに十分
        scrapeOptions: {
          formats: ['markdown', 'html']
        }
      }) as CrawlResponse;

      if (!crawlResponse.success) {
        throw new Error(`スクレイピングに失敗しました: ${(crawlResponse as ErrorResponse).error}`);
      }

      // スクレイピングしたデータから必要な情報を抽出
      return this.parseReferenceData(crawlResponse.data, url);
    } catch (error) {
      console.error('スクレイピングエラー:', error);
      throw new Error('参考URL取得中にエラーが発生しました');
    }
  }
  
  static isTwitterOrXUrl(url: string): boolean {
    const regex = /^https?:\/\/(www\.)?(twitter|x)\.com\/[a-zA-Z0-9_]+\/?$/;
    return regex.test(url);
  }

  private static parseProfileData(scrapedData: any[], url: string): ScrapedProfileData {
    // URLからユーザー名を抽出
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    const username = pathParts[0];
    
    // スクレイピングしたデータから情報を抽出
    // 実際のデータ構造に合わせて調整が必要
    let displayName = username;
    let bio = '';
    let location = '';
    let website = '';
    let joinDate = '';
    let followersCount = 0;
    let followingCount = 0;
    let tweetCount = 0;
    const recentPosts: { text: string; date: string }[] = [];
    
    // スクレイピングしたデータから情報を抽出
    try {
      // プロフィールヘッダー情報を検索
      const profileHeaderData = scrapedData.find(data => data.name === 'profile_header');
      if (profileHeaderData?.data) {
        // 表示名を抽出
        const nameMatch = profileHeaderData.data.match(/@([a-zA-Z0-9_]+)/);
        if (nameMatch && nameMatch[1]) {
          displayName = nameMatch[1];
        }
        
        // BIOを抽出
        const bioMatch = profileHeaderData.data.match(/Bio:(.*?)(?:Location:|Website:|Joined:|$)/s);
        if (bioMatch && bioMatch[1]) {
          bio = bioMatch[1].trim();
        }
        
        // ロケーション情報を抽出
        const locationMatch = profileHeaderData.data.match(/Location:(.*?)(?:Website:|Joined:|$)/s);
        if (locationMatch && locationMatch[1]) {
          location = locationMatch[1].trim();
        }
        
        // Webサイト情報を抽出
        const websiteMatch = profileHeaderData.data.match(/Website:(.*?)(?:Joined:|$)/s);
        if (websiteMatch && websiteMatch[1]) {
          website = websiteMatch[1].trim();
        }
        
        // 登録日を抽出
        const joinedMatch = profileHeaderData.data.match(/Joined:(.*?)(?:$)/s);
        if (joinedMatch && joinedMatch[1]) {
          joinDate = joinedMatch[1].trim();
        }
      }
      
      // プロフィール統計情報を検索
      const statsData = scrapedData.find(data => data.name === 'profile_stats');
      if (statsData?.data) {
        // フォロワー数を抽出
        const followersMatch = statsData.data.match(/([0-9,.]+)\s*フォロワー/);
        if (followersMatch && followersMatch[1]) {
          followersCount = this.parseNumberString(followersMatch[1]);
        }
        
        // フォロー数を抽出
        const followingMatch = statsData.data.match(/([0-9,.]+)\s*フォロー中/);
        if (followingMatch && followingMatch[1]) {
          followingCount = this.parseNumberString(followingMatch[1]);
        }
        
        // ツイート数を抽出
        const tweetsMatch = statsData.data.match(/([0-9,.]+)\s*ポスト/);
        if (tweetsMatch && tweetsMatch[1]) {
          tweetCount = this.parseNumberString(tweetsMatch[1]);
        }
      }
      
      // ツイート情報を検索
      const tweetData = scrapedData.filter(data => data.name === 'tweets');
      if (tweetData.length > 0) {
        tweetData.forEach(tweet => {
          if (tweet.data) {
            const tweetText = tweet.data.toString();
            const dateMatch = tweetText.match(/([0-9]{4}年[0-9]{1,2}月[0-9]{1,2}日|[0-9]{1,2}月[0-9]{1,2}日|[0-9]{1,2}時間前|[0-9]{1,2}分前)/);
            recentPosts.push({
              text: tweetText.substring(0, 200), // 最初の200文字を使用
              date: dateMatch ? dateMatch[1] : '不明'
            });
          }
        });
      }
    } catch (error) {
      console.error('データ解析エラー:', error);
    }
    
    // スキルを抽出（ハッシュタグやキーワードから推測）
    const skills = this.extractSkillsFromData(bio, recentPosts);
    
    return {
      username,
      displayName: displayName || username,
      bio: bio || '',
      joinDate: joinDate || '不明',
      location: location || '',
      website: website || '',
      tweetCount,
      followersCount,
      followingCount,
      skills,
      recentPosts: recentPosts.slice(0, 10) // 最新10件のみ使用
    };
  }

  private static parseReferenceData(scrapedData: any[], url: string): ScrapedReferenceData {
    let title = '';
    let content = '';
    const extractedSkills: string[] = [];
    let keywords: string[] = [];
    
    try {
      // ページのタイトルを取得
      const titleData = scrapedData.find(item => item.name === 'title');
      if (titleData?.data) {
        title = titleData.data.toString();
      }
      
      // ページの本文を取得
      const mainContentData = scrapedData.find(item => item.name === 'main_content' || item.name === 'body');
      if (mainContentData?.data) {
        content = mainContentData.data.toString().substring(0, 5000); // 最初の5000文字を使用
      }
      
      // メタデータからキーワードを取得
      const metaKeywordsData = scrapedData.find(item => item.name === 'meta_keywords');
      if (metaKeywordsData?.data) {
        keywords = metaKeywordsData.data.toString().split(',').map((k: string) => k.trim());
      }
      
      // 本文からスキルを抽出
      const skillKeywords = [
        'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Node.js',
        'PHP', 'Python', 'Ruby', 'Java', 'C#', 'Swift',
        'HTML', 'CSS', 'Sass', 'UI/UX', 'Figma', 'Adobe XD',
        'SQL', 'MongoDB', 'Firebase', 'AWS', 'Azure', 'GCP',
        'Docker', 'Kubernetes', 'CI/CD', 'Git', 'Agile', 'Scrum',
        'プロジェクト管理', 'マーケティング', 'セールス', 'カスタマーサポート',
        'データ分析', '機械学習', 'AI', 'ブロックチェーン',
        'SEO', 'SEM', 'コンテンツマーケティング', 'SNSマーケティング'
      ];
      
      skillKeywords.forEach(skill => {
        if (content.toLowerCase().includes(skill.toLowerCase())) {
          extractedSkills.push(skill);
        }
      });
    } catch (error) {
      console.error('参考URLデータ解析エラー:', error);
    }
    
    return {
      url,
      title: title || url,
      content: content || '内容を取得できませんでした',
      keywords,
      extractedSkills: [...new Set(extractedSkills)],
      lastScraped: new Date().toISOString()
    };
  }
  
  private static parseNumberString(numStr: string): number {
    // 数値文字列から数値を抽出
    const cleanedStr = numStr.replace(/[,.]/g, '');
    return parseInt(cleanedStr, 10) || 0;
  }
  
  private static extractSkillsFromData(bio: string, posts: { text: string; date: string }[]): string[] {
    // バイオと投稿内容からスキルっぽいキーワードを抽出
    const commonSkills = [
      'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Node.js',
      'PHP', 'Python', 'Ruby', 'Java', 'C#', 'Swift',
      'HTML', 'CSS', 'Sass', 'UI/UX', 'Figma', 'Adobe XD',
      'SQL', 'MongoDB', 'Firebase', 'AWS', 'Azure', 'GCP',
      'Docker', 'Kubernetes', 'CI/CD', 'Git', 'Agile', 'Scrum',
      'プロジェクト管理', 'マーケティング', 'セールス', 'カスタマーサポート',
      'データ分析', '機械学習', 'AI', 'ブロックチェーン', 
      'SEO', 'SEM', 'コンテンツマーケティング', 'SNSマーケティング'
    ];
    
    const extractedSkills: string[] = [];
    
    // バイオと投稿内容を結合したテキストから検索
    const allText = bio + ' ' + posts.map(p => p.text).join(' ');
    
    commonSkills.forEach(skill => {
      // 大文字小文字を区別せずスキルを検索
      if (new RegExp(skill, 'i').test(allText)) {
        extractedSkills.push(skill);
      }
    });
    
    // ハッシュタグからもスキルを抽出
    const hashtagRegex = /#([a-zA-Z0-9_]+)/g;
    let hashtagMatch;
    const hashtags: string[] = [];
    
    while ((hashtagMatch = hashtagRegex.exec(allText)) !== null) {
      hashtags.push(hashtagMatch[1]);
    }
    
    // ハッシュタグから技術関連のものを抽出
    const techHashtags = hashtags.filter(tag => 
      /tech|dev|エンジニア|プログラミング|開発|デザイン|マーケティング/i.test(tag)
    );
    
    return [...new Set([...extractedSkills, ...techHashtags])].slice(0, 15); // 重複を削除して最大15個まで
  }
}




