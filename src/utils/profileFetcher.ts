import { ProfileData } from '@/pages/Editor';
import { FirecrawlService, ScrapedProfileData, ScrapedReferenceData } from './FirecrawlService';

export interface FetchedData {
  profileData: ProfileData;
  referenceData: ScrapedReferenceData[];
}

export const fetchProfileData = async (
  xProfileUrl: string, 
  referenceUrls: string[] = []
): Promise<FetchedData> => {
  console.log(`Attempting to fetch profile data from X URL: ${xProfileUrl}`);
  console.log(`Additional reference URLs: ${referenceUrls.join(', ')}`);
  
  try {
    // APIキーがあるか確認
    const apiKey = FirecrawlService.getApiKey();
    if (!apiKey) {
      throw new Error('APIキーが設定されていません');
    }
    
    // Xプロフィールをスクレイピング
    const scrapedProfileData = await FirecrawlService.extractProfileData(xProfileUrl);
    
    // 参考URLをスクレイピング
    const referenceDataPromises = referenceUrls
      .filter(url => url.trim())
      .map(url => FirecrawlService.extractReferenceData(url)
        .catch(error => {
          console.error(`参考URL ${url} のスクレイピングに失敗:`, error);
          return null;
        })
      );
    
    const referenceDataResults = await Promise.all(referenceDataPromises);
    const validReferenceData = referenceDataResults.filter(Boolean) as ScrapedReferenceData[];
    
    // 参考URLから抽出したスキルを統合
    if (validReferenceData.length > 0) {
      const additionalSkills = validReferenceData.flatMap(data => data.extractedSkills);
      const uniqueSkills = [...new Set([...scrapedProfileData.skills, ...additionalSkills])];
      
      // 最大15個のスキルに制限
      scrapedProfileData.skills = uniqueSkills.slice(0, 15);
    }
    
    return {
      profileData: scrapedProfileData,
      referenceData: validReferenceData
    };
  } catch (error) {
    console.error('プロフィール取得エラー:', error);
    
    // エラーがある場合はモックデータを生成
    console.log('モックデータを使用します');
    return {
      profileData: generateMockProfileData(xProfileUrl),
      referenceData: referenceUrls.map(url => generateMockReferenceData(url))
    };
  }
};

// モックデータ生成関数（APIキーがない場合やスクレイピングに失敗した場合のフォールバック）
const generateMockProfileData = (url: string): ProfileData => {
  // Parse the URL to extract the username
  const urlObj = new URL(url);
  const pathParts = urlObj.pathname.split('/').filter(Boolean);
  const username = pathParts[0];
  
  if (!username) {
    throw new Error('Invalid profile URL');
  }
  
  // Generate mock data based on the username
  return {
    username,
    displayName: capitalizeUsername(username),
    bio: `This is a mock bio for ${username}. In a real implementation, this would be scraped from the X profile.`,
    joinDate: randomJoinDate(),
    location: randomLocation(),
    website: Math.random() > 0.5 ? `https://${username}.com` : '',
    tweetCount: Math.floor(Math.random() * 10000),
    followersCount: Math.floor(Math.random() * 5000),
    followingCount: Math.floor(Math.random() * 1000),
    skills: generateRandomSkills(),
    recentPosts: generateRandomPosts(username),
  };
};

// 参考URLのモックデータ生成関数
const generateMockReferenceData = (url: string): ScrapedReferenceData => {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace('www.', '');
    
    return {
      url,
      title: `${domain.charAt(0).toUpperCase() + domain.slice(1)} - Mock Content`,
      content: `This is mock content for ${url}. In a real implementation, this would be scraped from the reference URL.`,
      keywords: ['technology', 'programming', 'portfolio', 'skills'],
      extractedSkills: generateRandomSkills().slice(0, 5),
      lastScraped: new Date().toISOString()
    };
  } catch (error) {
    return {
      url,
      title: 'Mock Reference',
      content: 'Mock content for invalid URL',
      keywords: [],
      extractedSkills: [],
      lastScraped: new Date().toISOString()
    };
  }
};

// ヘルパー関数（モックデータ生成用）
const capitalizeUsername = (username: string): string => {
  return username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();
};

const randomJoinDate = (): string => {
  const year = 2006 + Math.floor(Math.random() * 16); // X/Twitter started in 2006
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1; // Simplified to avoid date validation
  return `${year}年${month}月${day}日`;
};

const randomLocation = (): string => {
  const locations = ['東京', '大阪', '神奈川', '京都', '埼玉', '千葉', '愛知', '福岡', '北海道', '沖縄'];
  return locations[Math.floor(Math.random() * locations.length)];
};

const generateRandomSkills = (): string[] => {
  const allSkills = [
    'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Node.js',
    'PHP', 'Python', 'Ruby', 'Java', 'C#', 'Swift',
    'HTML', 'CSS', 'Sass', 'UI/UX', 'Figma', 'Adobe XD',
    'SQL', 'MongoDB', 'Firebase', 'AWS', 'Azure', 'GCP',
    'Docker', 'Kubernetes', 'CI/CD', 'Git', 'Agile', 'Scrum',
    'プロジェクト管理', 'マーケティング', 'セールス', 'カスタマーサポート',
    'データ分析', '機械学習', 'AI', 'ブロックチェーン',
    'SEO', 'SEM', 'コンテンツマーケティング', 'SNSマーケティング'
  ];
  
  // Randomly select 5-10 skills
  const skillCount = 5 + Math.floor(Math.random() * 6);
  const shuffled = [...allSkills].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, skillCount);
};

const generateRandomPosts = (username: string): { text: string; date: string }[] => {
  const postTemplates = [
    `新しいプロジェクトを始めました！詳細は後ほど #新プロジェクト`,
    `今日も一日頑張りました！明日も頑張ろう！ #日々精進`,
    `${randomTechEvent()}に参加してきました。とても勉強になりました！ #イベント`,
    `新しい${randomTech()}のチュートリアルを公開しました！興味がある方はチェックしてください。`,
    `${randomCompany()}との会議が終わりました。素晴らしいチームとの協力が楽しみです！`,
    `${randomBook()}を読みました。とても参考になる内容でした。おすすめです！ #読書`,
    `新しい${randomTech()}スキルを身につけました。楽しい学習でした！ #スキルアップ`,
    `${randomConference()}で発表してきました。多くの方からフィードバックをいただきました！`,
    `最近の${randomTech()}の進化について考えています。皆さんはどう思いますか？`,
    `新しいポジションで働くことになりました！これからもよろしくお願いします！ #キャリア`
  ];
  
  // Generate 5-8 random posts
  const postCount = 5 + Math.floor(Math.random() * 4);
  const posts = [];
  
  for (let i = 0; i < postCount; i++) {
    const randomIndex = Math.floor(Math.random() * postTemplates.length);
    const randomText = postTemplates[randomIndex];
    
    // Generate a random date within the last 3 months
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 90));
    
    posts.push({
      text: randomText,
      date: date.toLocaleDateString('ja-JP')
    });
  }
  
  return posts;
};

const randomTechEvent = (): string => {
  const events = [
    'Tech Conference 2023', 'Developers Summit', 'JavaScriptフェス',
    'Python勉強会', 'AIサミット', 'Webデザインワークショップ',
    'React Meetup', 'クラウドコンピューティングカンファレンス',
    'モバイルアプリ開発セミナー', 'データサイエンスフォーラム'
  ];
  return events[Math.floor(Math.random() * events.length)];
};

const randomTech = (): string => {
  const techs = [
    'React', 'Vue.js', 'Angular', 'Node.js', 'Python',
    'Java', 'PHP', 'Ruby', 'Swift', 'Kotlin',
    'Go', 'Rust', 'TypeScript', 'C#', 'AWS',
    'Docker', 'Kubernetes', 'TensorFlow', 'PyTorch', 'Flutter'
  ];
  return techs[Math.floor(Math.random() * techs.length)];
};

const randomCompany = (): string => {
  const companies = [
    'テックスタートアップ', 'グローバルIT企業', '通信大手',
    'フィンテック企業', 'Eコマース大手', 'コンサルティング会社',
    'マーケティングエージェンシー', 'ヘルスケアIT', '教育テック',
    'モバイルアプリ開発会社'
  ];
  return companies[Math.floor(Math.random() * companies.length)];
};

const randomBook = (): string => {
  const books = [
    'クリーンコード', 'リーダブルコード', 'デザインパターン入門',
    'プログラマの思考法', 'UXデザインの教科書', 'アジャイル開発の実践',
    'AI時代の生存戦略', 'データサイエンス入門', 'ブロックチェーン革命',
    'マネジメント3.0'
  ];
  return books[Math.floor(Math.random() * books.length)];
};

const randomConference = (): string => {
  const conferences = [
    'JSConf', 'PyCon', 'RubyKaigi', 'AWS Summit',
    'Google I/O', 'Apple WWDC', 'Microsoft Build',
    'TensorFlow Developer Summit', 'ReactConf', 'DevOps Days'
  ];
  return conferences[Math.floor(Math.random() * conferences.length)];
};
