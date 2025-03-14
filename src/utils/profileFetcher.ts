
import { ProfileData } from '@/pages/Editor';

// This is a mock implementation for the frontend-only MVP
// In a real implementation, this would connect to a backend service
// that handles the scraping of X profiles

export const fetchProfileData = async (url: string): Promise<ProfileData> => {
  console.log(`Attempting to fetch profile data from URL: ${url}`);
  
  // In a real implementation, this would be an API call to the backend
  // For now, we'll just simulate a network request with a timeout
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Parse the URL to extract the username
  const urlObj = new URL(url);
  const pathParts = urlObj.pathname.split('/').filter(Boolean);
  const username = pathParts[0];
  
  if (!username) {
    throw new Error('Invalid profile URL');
  }
  
  // Generate mock data based on the username
  // In a real implementation, this would be actual scraped data
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

// Helper functions for generating mock data
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
