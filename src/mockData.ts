import { 
  SalesRecord, CompetitiveProduct, StrategicCategory, KeywordData,
  MarketingPlanData, KeywordAnalysisData, LinkAnalysisData, CustomerMaintenanceData
} from './types';
import { subDays, startOfMonth, format, subMonths, subYears, startOfWeek } from 'date-fns';

export const generateMarketingPlanData = (): MarketingPlanData[] => {
  const plans = ['大客生意解决方案', '首位展示', '定位推广', '搜索展播', '品牌专区', '全站推店', '全站销货', '精准获客', '关键词卡位'];
  const statuses: ('优秀' | '良好' | '一般' | '待优化')[] = ['优秀', '良好', '一般', '待优化'];
  
  return plans.map((plan, i) => {
    const spend = Math.floor(Math.random() * 50000) + 5000;
    const clicks = Math.floor(Math.random() * 2000) + 100;
    const inquiries = Math.floor(Math.random() * 50) + 5;
    const leads = Math.floor(inquiries * (0.3 + Math.random() * 0.4));
    return {
      id: `plan-${i}`,
      planName: plan,
      spend,
      impressions: Math.floor(spend * (10 + Math.random() * 5)),
      clicks,
      ctr: Number((clicks / (spend * 10) * 100).toFixed(2)),
      cpc: Number((spend / clicks).toFixed(2)),
      leads,
      leadConversionRate: Number((leads / clicks * 100).toFixed(2)),
      leadCost: Number((spend / leads).toFixed(2)),
      inquiries,
      inquiryCost: Number((spend / inquiries).toFixed(2)),
      inquiryConversionRate: Number((inquiries / clicks * 100).toFixed(2)),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      mom: {
        spend: Number((Math.random() * 40 - 10).toFixed(1)),
        impressions: Number((Math.random() * 40 - 10).toFixed(1)),
        clicks: Number((Math.random() * 40 - 10).toFixed(1)),
        ctr: Number((Math.random() * 40 - 10).toFixed(1)),
        cpc: Number((Math.random() * 40 - 10).toFixed(1)),
        leads: Number((Math.random() * 40 - 10).toFixed(1)),
        leadConversionRate: Number((Math.random() * 40 - 10).toFixed(1)),
        leadCost: Number((Math.random() * 40 - 10).toFixed(1)),
        inquiries: Number((Math.random() * 40 - 10).toFixed(1)),
        inquiryCost: Number((Math.random() * 40 - 10).toFixed(1)),
        inquiryConversionRate: Number((Math.random() * 40 - 10).toFixed(1)),
      }
    };
  });
};

export const generateKeywordAnalysisData = (count: number = 15): KeywordAnalysisData[] => {
  const keywords = ['餐椅', '游泳池', '折叠盆', '充气床', '婴儿浴盆', '滑雪圈', '户外用品', '家居装饰', '儿童玩具'];
  const actions = ['增加出价', '优化关键词', '保持现状', '降低出价', '暂停推广'];
  return Array.from({ length: count }).map((_, i) => {
    const spend = Math.floor(Math.random() * 10000) + 1000;
    const clicks = Math.floor(Math.random() * 500) + 50;
    const leads = Math.floor(Math.random() * 30) + 2;
    const inquiries = Math.floor(Math.random() * 20) + 1;
    return {
      id: `kw-${i}`,
      keyword: keywords[i % keywords.length] + (i > 8 ? i : ''),
      spend,
      impressions: Math.floor(spend * (15 + Math.random() * 10)),
      clicks,
      ctr: Number((clicks / (spend * 15) * 100).toFixed(2)),
      cpc: Number((spend / clicks).toFixed(2)),
      leads,
      leadConversionRate: Number((leads / clicks * 100).toFixed(2)),
      leadCost: Number((spend / leads).toFixed(2)),
      inquiries,
      inquiryCost: Number((spend / inquiries).toFixed(2)),
      inquiryConversionRate: Number((inquiries / clicks * 100).toFixed(2)),
      action: actions[Math.floor(Math.random() * actions.length)],
      mom: {
        spend: Number((Math.random() * 40 - 10).toFixed(1)),
        impressions: Number((Math.random() * 40 - 10).toFixed(1)),
        clicks: Number((Math.random() * 40 - 10).toFixed(1)),
        ctr: Number((Math.random() * 40 - 10).toFixed(1)),
        cpc: Number((Math.random() * 40 - 10).toFixed(1)),
        leads: Number((Math.random() * 40 - 10).toFixed(1)),
        leadConversionRate: Number((Math.random() * 40 - 10).toFixed(1)),
        leadCost: Number((Math.random() * 40 - 10).toFixed(1)),
        inquiries: Number((Math.random() * 40 - 10).toFixed(1)),
        inquiryCost: Number((Math.random() * 40 - 10).toFixed(1)),
        inquiryConversionRate: Number((Math.random() * 40 - 10).toFixed(1)),
      }
    };
  });
};

export const generateLinkAnalysisData = (count: number = 12): LinkAnalysisData[] => {
  const statuses: ('优秀' | '良好' | '一般' | '待优化')[] = ['优秀', '良好', '一般', '待优化'];
  return Array.from({ length: count }).map((_, i) => {
    const spend = Math.floor(Math.random() * 20000) + 2000;
    const clicks = Math.floor(Math.random() * 800) + 80;
    const leads = Math.floor(Math.random() * 50) + 5;
    const inquiries = Math.floor(Math.random() * 40) + 2;
    return {
      id: `link-${i}`,
      productId: `P${1000 + i}`,
      spend,
      impressions: Math.floor(spend * (12 + Math.random() * 8)),
      clicks,
      ctr: Number((clicks / (spend * 12) * 100).toFixed(2)),
      cpc: Number((spend / clicks).toFixed(2)),
      leads,
      leadConversionRate: Number((leads / clicks * 100).toFixed(2)),
      leadCost: Number((spend / leads).toFixed(2)),
      inquiries,
      inquiryCost: Number((spend / inquiries).toFixed(2)),
      inquiryConversionRate: Number((inquiries / clicks * 100).toFixed(2)),
      roi: Number((2 + Math.random() * 5).toFixed(2)),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      mom: {
        spend: Number((Math.random() * 40 - 10).toFixed(1)),
        impressions: Number((Math.random() * 40 - 10).toFixed(1)),
        clicks: Number((Math.random() * 40 - 10).toFixed(1)),
        ctr: Number((Math.random() * 40 - 10).toFixed(1)),
        cpc: Number((Math.random() * 40 - 10).toFixed(1)),
        leads: Number((Math.random() * 40 - 10).toFixed(1)),
        leadConversionRate: Number((Math.random() * 40 - 10).toFixed(1)),
        leadCost: Number((Math.random() * 40 - 10).toFixed(1)),
        inquiries: Number((Math.random() * 40 - 10).toFixed(1)),
        inquiryCost: Number((Math.random() * 40 - 10).toFixed(1)),
        inquiryConversionRate: Number((Math.random() * 40 - 10).toFixed(1)),
        roi: Number((Math.random() * 40 - 10).toFixed(1)),
      }
    };
  });
};

export const generateStrategicMapData = (category?: string): StrategicCategory[] => {
  const categories = [
    {
      title: '品类',
      topItem: { name: '玩具', popularity: 35459759, growth: 15.6 },
      items: [
        { name: '脚桶', popularity: 25112762, growth: -2.1 },
        { name: '泡脚桶', popularity: 21776434, growth: 22.4 },
        { name: '水枪', popularity: 19000478, growth: 10.5 },
        { name: '餐椅', popularity: 16985697, growth: 5.6 },
        { name: '泳镜', popularity: 15086882, growth: 32.1 },
        { name: '泳圈', popularity: 11002087, growth: 8.9 },
        { name: '充气床', popularity: 8208079, growth: 10.2 },
        { name: '泳帽', popularity: 7800672, growth: 14.5 },
        { name: '洗澡盆', popularity: 6903629, growth: 22.1 },
      ]
    },
    {
      title: '人群',
      topItem: { name: '婴儿', popularity: 32728092, growth: 60.68 },
      items: [
        { name: '儿童', popularity: 31138385, growth: 45.2 },
        { name: '宝宝', popularity: 29837075, growth: 32.1 },
        { name: '成人', popularity: 5047646, growth: -5.4 },
        { name: '大人', popularity: 4407658, growth: 12.3 },
        { name: '新生', popularity: 4059493, growth: 8.9 },
        { name: '一岁', popularity: 3482294, growth: 15.6 },
        { name: '幼儿', popularity: 3196079, growth: -2.1 },
        { name: '游泳', popularity: 3076304, growth: 22.4 },
        { name: '女士', popularity: 1933941, growth: 10.5 },
      ]
    },
    {
      title: '场景',
      topItem: { name: '家用', popularity: 12500, growth: 5.6 },
      items: [
        { name: '户外', popularity: 8900, growth: 32.1 },
        { name: '飞机', popularity: 4500, growth: 8.9 },
        { name: '露营', popularity: 3200, growth: 10.2 },
        { name: '地铺', popularity: 2100, growth: 14.5 },
        { name: '水上', popularity: 1800, growth: 22.1 },
        { name: '旅行', popularity: 1500, growth: 12.3 },
        { name: '火车', popularity: 1200, growth: 8.9 },
        { name: '高铁', popularity: 900, growth: 15.6 },
        { name: '室内', popularity: 800, growth: -2.1 },
      ]
    },
    {
      title: '功能',
      topItem: { name: '充气', popularity: 21210097, growth: 45.2 },
      items: [
        { name: '折叠', popularity: 12666251, growth: 32.1 },
        { name: '游泳', popularity: 10563711, growth: -5.4 },
        { name: '气垫', popularity: 5242931, growth: 12.3 },
        { name: '电动', popularity: 2972861, growth: 8.9 },
        { name: '便携', popularity: 2244701, growth: 15.6 },
        { name: '防水', popularity: 2195839, growth: -2.1 },
        { name: '带轮', popularity: 2115053, growth: 22.4 },
        { name: '自动', popularity: 2057557, growth: 10.5 },
        { name: '喷水', popularity: 2011542, growth: 5.6 },
      ]
    },
    {
      title: '使用',
      topItem: { name: '泡脚', popularity: 28349066, growth: 15.4 },
      items: [
        { name: '游泳', popularity: 23249082, growth: 28.9 },
        { name: '泡澡', popularity: 13164853, growth: 12.1 },
        { name: '滑雪', popularity: 5055012, growth: 145.2 },
        { name: '洗澡', popularity: 4949664, growth: 5.6 },
        { name: '拳击', popularity: 4923857, growth: 32.1 },
        { name: '洗头', popularity: 4815870, growth: 8.9 },
        { name: '洗脚', popularity: 3788488, growth: 10.2 },
        { name: '坐浴', popularity: 3320303, growth: 14.5 },
        { name: '训练', popularity: 2564817, growth: 22.1 },
      ]
    },
    {
      title: '属性',
      topItem: { name: '材质', popularity: 15459759, growth: 12.6 },
      items: [
        { name: '加厚', popularity: 12112762, growth: 18.1 },
        { name: '环保', popularity: 9776434, growth: 25.4 },
        { name: '耐磨', popularity: 8000478, growth: 8.5 },
        { name: '防滑', popularity: 7985697, growth: 15.6 },
        { name: '舒适', popularity: 6086882, growth: 32.1 },
        { name: '柔软', popularity: 5002087, growth: 18.9 },
        { name: '尺寸', popularity: 4208079, growth: 10.2 },
        { name: '颜色', popularity: 3800672, growth: 14.5 },
        { name: '大号', popularity: 2903629, growth: 22.1 },
      ]
    },
    {
      title: '时间',
      topItem: { name: '2025新款', popularity: 18459759, growth: 45.6 },
      items: [
        { name: '夏季', popularity: 15112762, growth: 32.1 },
        { name: '冬季', popularity: 11776434, growth: 12.4 },
        { name: '四季通用', popularity: 9000478, growth: 10.5 },
        { name: '节日', popularity: 6985697, growth: 5.6 },
        { name: '生日', popularity: 5086882, growth: 32.1 },
        { name: '周年', popularity: 4002087, growth: 8.9 },
        { name: '限时', popularity: 3208079, growth: 10.2 },
        { name: '全天', popularity: 2800672, growth: 14.5 },
        { name: '夜用', popularity: 1903629, growth: 22.1 },
      ]
    },
    {
      title: '背书',
      topItem: { name: '官方正品', popularity: 12459759, growth: 15.6 },
      items: [
        { name: '厂家直销', popularity: 10112762, growth: 22.1 },
        { name: '质量保证', popularity: 8776434, growth: 12.4 },
        { name: '售后无忧', popularity: 7000478, growth: 10.5 },
        { name: '品牌授权', popularity: 5985697, growth: 5.6 },
        { name: '专利产品', popularity: 4086882, growth: 32.1 },
        { name: '检测报告', popularity: 3002087, growth: 8.9 },
        { name: '明星同款', popularity: 2208079, growth: 10.2 },
        { name: '网红推荐', popularity: 1800672, growth: 14.5 },
        { name: '出口品质', popularity: 1203629, growth: 22.1 },
      ]
    },
    {
      title: '修饰词',
      topItem: { name: '爆款', popularity: 25459759, growth: 35.6 },
      items: [
        { name: '热销', popularity: 20112762, growth: 22.1 },
        { name: '推荐', popularity: 15776434, growth: 12.4 },
        { name: '必备', popularity: 12000478, growth: 10.5 },
        { name: '极速发货', popularity: 9985697, growth: 5.6 },
        { name: '限时抢购', popularity: 8086882, growth: 32.1 },
        { name: '特惠', popularity: 7002087, growth: 8.9 },
        { name: '新款', popularity: 6208079, growth: 10.2 },
        { name: '包邮', popularity: 5800672, growth: 14.5 },
        { name: '秒杀', popularity: 4903629, growth: 22.1 },
      ]
    },
    {
      title: '品牌',
      topItem: { name: 'stokke', popularity: 2504485, growth: 12.3 },
      items: [
        { name: '卡达', popularity: 2478609, growth: 8.9 },
        { name: '哈卡', popularity: 2145882, growth: 15.6 },
        { name: 'iuu', popularity: 1657759, growth: -2.1 },
        { name: 'kk', popularity: 1129509, growth: 22.4 },
        { name: '卡曼', popularity: 1037422, growth: 10.5 },
        { name: '迪卡侬', popularity: 891465, growth: 5.6 },
        { name: '肯德基', popularity: 866610, growth: 32.1 },
        { name: '英发', popularity: 771820, growth: 8.9 },
        { name: '气床', popularity: 721144, growth: 10.2 },
      ]
    },
    {
      title: '其他',
      topItem: { name: '消耗', popularity: 758666, growth: 5.4 },
      items: [
        { name: 'kk', popularity: 661780, growth: 12.3 },
        { name: '成长', popularity: 619851, growth: 8.9 },
        { name: '用品', popularity: 536219, growth: 15.6 },
        { name: '人家', popularity: 487454, growth: -2.1 },
        { name: '以上', popularity: 367764, growth: 22.4 },
        { name: '一名', popularity: 348520, growth: 10.5 },
        { name: '抽抽', popularity: 346629, growth: 5.6 },
        { name: '体力', popularity: 313432, growth: 32.1 },
        { name: '用盆', popularity: 285912, growth: 8.9 },
      ]
    }
  ];

  if (category) {
    // Randomize values based on category name to simulate dynamic data
    const seed = category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return categories.map(cat => ({
      ...cat,
      topItem: {
        ...cat.topItem,
        popularity: Math.floor(cat.topItem.popularity * (0.5 + (seed % 100) / 100)),
        growth: Math.round((cat.topItem.growth + (seed % 20) - 10) * 100) / 100
      },
      items: cat.items.map(item => ({
        ...item,
        popularity: Math.floor(item.popularity * (0.5 + (seed % 100) / 100)),
        growth: Math.round((item.growth + (seed % 20) - 10) * 100) / 100
      }))
    }));
  }

  return categories as StrategicCategory[];
};

export const generateKeywordData = (rootWord?: string | null): KeywordData[] => {
  const baseKeywords = [
    { keyword: '餐椅', searchIndex: 124200, clickRate: 99.70, searchGrowth: 60.68, productIndex: 13700, supplyDemandIndex: 123800, monthlyPrice: 2500 },
    { keyword: '游泳池', searchIndex: 85000, clickRate: 88.50, searchGrowth: 45.2, productIndex: 4500, supplyDemandIndex: 75000, monthlyPrice: 1800 },
    { keyword: '折叠盆', searchIndex: 45000, clickRate: 75.20, searchGrowth: 32.1, productIndex: 2800, supplyDemandIndex: 34000, monthlyPrice: 1200 },
    { keyword: '充气床', searchIndex: 62000, clickRate: 82.40, searchGrowth: -5.4, productIndex: 3100, supplyDemandIndex: 51000, monthlyPrice: 2100 },
    { keyword: '婴儿浴盆', searchIndex: 38000, clickRate: 92.10, searchGrowth: 12.3, productIndex: 2900, supplyDemandIndex: 35000, monthlyPrice: 1500 },
    { keyword: '滑雪圈', searchIndex: 25000, clickRate: 65.30, searchGrowth: 145.2, productIndex: 1200, supplyDemandIndex: 16000, monthlyPrice: 900 },
  ];

  const results: KeywordData[] = [];
  const count = 15;
  const word = rootWord || '推荐';

  for (let i = 1; i <= count; i++) {
    const base = baseKeywords[i % baseKeywords.length];
    results.push({
      rank: i,
      keyword: `${word}${base.keyword}${i}`,
      searchIndex: Math.floor(base.searchIndex * (0.8 + Math.random() * 0.4)),
      searchGrowth: base.searchGrowth + (Math.random() * 10 - 5),
      clickRate: base.clickRate * (0.9 + Math.random() * 0.2),
      productIndex: Math.floor(base.productIndex * (0.8 + Math.random() * 0.4)),
      supplyDemandIndex: Math.floor(base.supplyDemandIndex * (0.8 + Math.random() * 0.4)),
      monthlyPrice: Math.floor(base.monthlyPrice * (0.9 + Math.random() * 0.2)),
    });
  }

  return results;
};

const platforms = [
  '跨境', '国内', '拼多多', '抖音', '淘宝', '京东', '阿里', '散户', '线下', '唯品会', '私域', '快手', '有赞微商城', '微信视频', '小红书', '得物'
];
const businessOwners = ['方建浩', '孔帅'];
const salespeople = ['小王', '小李', '小张', '小赵', '小钱'];
const distributors = ['分销商A', '分销商B', '分销商C', '分销商D', '分销商E'];

export const storeAttributions = [
  '阿里-义乌麦创科技有限公司',
  '阿里-义乌氪创科技有限公司',
  '阿里-义乌市数途贸易有限公司',
  '9.阿里-义乌市青色贸易有限公司',
  '7.阿里-义乌市益瑞康科技有限公司',
  '68.阿里-义乌市领阅贸易有限公司',
  '67.阿里-义乌市嘉述贸易有限公司',
  '66.阿里-义乌市起乾商贸有限公司'
];

export const POSITIONS_DATA = {
  '业务': businessOwners,
  '销售': salespeople
};

const wholesaleTypes: ('代发' | '批发' | '散户' | '定制')[] = ['代发', '批发', '散户', '定制'];

export const categoryTree = [
  { l1: '办公', l2: '医疗坐垫', l3: '配件', l4: '医疗坐垫配件', skus: ['黑色-标准', '灰色-加厚'] },
  { l1: '产品配件', l2: '配件', l3: '配件', l4: '通用配件', skus: ['10mm', '20mm', '30mm'] },
  { l1: '户外', l2: 'U型枕', l3: '25腰靠', l4: '橙柚泡泡', skus: ['S码', 'M码', 'L码'] },
  { l1: '户外', l2: 'U型枕', l3: '25腰靠', l4: '多巴胺粉', skus: ['S码', 'M码', 'L码'] },
  { l1: '户外', l2: 'U型枕', l3: '25腰靠', l4: '气泡葡萄', skus: ['S码', 'M码', 'L码'] },
  { l1: '户外', l2: '充气沙发', l3: '单人沙发', l4: '简约白', skus: ['标准款', '升级款'] },
  { l1: '户外', l2: '充气沙发', l3: '单人沙发', l4: '深邃蓝', skus: ['标准款', '升级款'] },
  { l1: '户外', l2: '充气沙发', l3: '双人沙发', l4: '情侣款', skus: ['标准款', '升级款'] },
  { l1: '户外', l2: '充气床垫', l3: '单人床垫', l4: '标准型', skus: ['1.2m', '1.5m'] },
  { l1: '户外', l2: '充气床垫', l3: '双人床垫', l4: '加厚型', skus: ['1.8m', '2.0m'] },
  { l1: '家居', l2: '板材浴缸', l3: '2025-板材浴缸', l4: '白云浮梦', skus: ['1.5m', '1.7m'] },
  { l1: '家居', l2: '板材浴缸', l3: '2025-板材浴缸', l4: '奶芙泡泡', skus: ['1.5m', '1.7m'] },
  { l1: '家居', l2: '支架泳池', l3: '大型支架', l4: '家庭装', skus: ['3m', '4m', '5m'] },
  { l1: '家居', l2: '支架泳池', l3: '小型支架', l4: '儿童款', skus: ['1.5m', '2m'] },
  { l1: '圈类', l2: '24寸圈', l3: '24寸圈', l4: '恐龙乐园', skus: ['蓝色', '绿色'] },
  { l1: '圈类', l2: '24寸圈', l3: '24寸圈', l4: '独角兽', skus: ['粉色', '白色'] },
  { l1: '圈类', l2: '25寸圈', l3: '25寸圈', l4: '彩虹圈', skus: ['七彩', '渐变'] },
  { l1: '玩具', l2: '不倒翁', l3: '25充气不倒翁', l4: '萌萌小兔', skus: ['粉色', '白色'] },
  { l1: '玩具', l2: '不倒翁', l3: '25充气不倒翁', l4: '酷酷小熊', skus: ['棕色', '黑色'] },
  { l1: '玩具', l2: '滑雪圈', l3: '加厚滑雪圈', l4: '极速版', skus: ['红色', '蓝色'] },
  { l1: '浴盆', l2: '婴儿浴盆', l3: '折叠浴盆', l4: '粉色', skus: ['带感温', '不带感温'] },
  { l1: '浴盆', l2: '婴儿浴盆', l3: '折叠浴盆', l4: '蓝色', skus: ['带感温', '不带感温'] },
  { l1: '浴盆', l2: '婴儿浴盆', l3: '感温浴盆', l4: '智能款', skus: ['语音版', '普通版'] },
];

export const generateCompetitiveData = (count: number = 50): CompetitiveProduct[] => {
  const data: CompetitiveProduct[] = [];
  const productNames = [
    '夏季新款法式碎花连衣裙', '高腰显瘦直筒牛仔裤', '纯棉透气简约白T恤', 
    '旗舰新款5G智能手机', '轻薄便携高性能笔记本', '北欧简约布艺三人沙发',
    '复古港风宽松工装裤', '真丝质感慵懒风衬衫', '运动速干透气跑步鞋',
    '智能降噪无线蓝牙耳机', '大容量多功能双肩包', '手工编织波西米亚草帽'
  ];
  const storeNames = ['旗舰店', '专卖店', '官方店', '海外购', '精品店'];

  for (let i = 0; i < count; i++) {
    const name = productNames[Math.floor(Math.random() * productNames.length)];
    const transactionIndex = Math.floor(Math.random() * 1000000);
    const trafficIndex = Math.floor(Math.random() * 500000);
    const searchIndex = Math.floor(Math.random() * 200000);
    const searchGrowth = (Math.random() * 200) - 50; // -50% to 150%
    const effectiveInquiryIndex = Math.floor(Math.random() * 10000);
    const listingTime = format(subDays(new Date(), Math.floor(Math.random() * 1000)), 'yyyy-MM-dd');
    const monthlySales = Math.floor(Math.random() * 5000);
    const monthlyDropshipping = Math.floor(Math.random() * 1000);
    const yearlySalesVolume = Math.floor(Math.random() * 50000);
    const yearlyTransactionCount = Math.floor(Math.random() * 20000);
    const reviewCount = Math.floor(Math.random() * 10000);
    const positiveRate = 85 + Math.random() * 15;
    const collectionRate = 90 + Math.random() * 10;
    const repurchaseRate = 5 + Math.random() * 25;
    const addToCartCount = Math.floor(Math.random() * 20000);
    const platformTypes: ('天猫' | '淘宝' | '京东')[] = ['天猫', '淘宝', '京东'];
    const origins = [
      '北京', '上海', '天津', '重庆', '浙江杭州', '浙江金华', '广东广州', '广东深圳', 
      '江苏苏州', '江苏南京', '福建厦门', '山东青岛', '四川成都', '湖北武汉', '河南郑州',
      '湖南长沙', '陕西西安', '安徽合肥', '辽宁大连', '云南昆明'
    ];

    data.push({
      id: `comp_${i}`,
      name: `${name}_${i}`,
      image: `https://picsum.photos/seed/product_${i}/200/200`,
      storeName: `${storeNames[Math.floor(Math.random() * storeNames.length)]}_${i}`,
      transactionIndex,
      trafficIndex,
      searchIndex,
      searchGrowth,
      effectiveInquiryIndex,
      listingTime,
      monthlySales,
      monthlyDropshipping,
      yearlySalesVolume,
      yearlyTransactionCount,
      reviewCount,
      positiveRate,
      collectionRate,
      repurchaseRate,
      addToCartCount,
      platformType: platformTypes[Math.floor(Math.random() * platformTypes.length)],
      origin: origins[Math.floor(Math.random() * origins.length)],
      category: categoryTree[Math.floor(Math.random() * categoryTree.length)].l3,
      isGoldCrown: Math.random() > 0.8,
      isPotential: Math.random() > 0.7,
    });
  }
  return data;
};

export const generateMockData = (count: number = 1200): SalesRecord[] => {
  const data: SalesRecord[] = [];
  const now = new Date();

  // Define some trends for different categories to ensure variety in growth/decline
  const categoryTrends: Record<string, number> = {
    '办公': 1.2,    // Growing
    '产品配件': 0.8, // Declining
    '户外': 1.5,    // Strong growth
    '家居': 0.7,    // Strong decline
    '圈类': 1.0,    // Stable
    '玩具': 1.1,    // Slight growth
    '浴盆': 0.9     // Slight decline
  };

  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 400);
    const date = subDays(now, daysAgo);
    const cat = categoryTree[Math.floor(Math.random() * categoryTree.length)];
    
    // Apply trend: newer records have higher/lower amounts based on trend factor
    const trendFactor = categoryTrends[cat.l1] || 1.0;
    // Simple linear trend: factor ^ (1 - daysAgo/400)
    // If trend > 1, newer (daysAgo small) will be larger.
    // If trend < 1, newer will be smaller.
    const timeWeight = Math.pow(trendFactor, (400 - daysAgo) / 400);
    
    const baseAmount = Math.floor(Math.random() * 1000) + 100;
    const amount = Math.floor(baseAmount * timeWeight);
    
    const baseVolume = Math.floor(Math.random() * 20) + 1;
    const volume = Math.max(1, Math.floor(baseVolume * timeWeight));
    
    data.push({
      id: `rec_${i}`,
      distributorId: distributors[Math.floor(Math.random() * distributors.length)],
      storeName: storeAttributions[Math.floor(Math.random() * storeAttributions.length)],
      platform: platforms[Math.floor(Math.random() * platforms.length)],
      isWholesale: wholesaleTypes[Math.floor(Math.random() * wholesaleTypes.length)],
      date: date.toISOString(),
      customerType: Math.random() > 0.6 ? 'Returning' : 'New',
      categoryL1: cat.l1,
      categoryL2: cat.l2,
      categoryL3: cat.l3,
      categoryL4: cat.l4,
      sku: (cat as any).skus[Math.floor(Math.random() * (cat as any).skus.length)],
      salesAmount: amount,
      salesVolume: volume,
      costAmount: amount * (0.6 + Math.random() * 0.2), // 60-80% cost
      businessOwner: businessOwners[Math.floor(Math.random() * businessOwners.length)],
      salesperson: salespeople[Math.floor(Math.random() * salespeople.length)],
    });
  }
  return data;
};

export const generateCustomerMaintenanceData = (count: number): CustomerMaintenanceData[] => {
  const data: CustomerMaintenanceData[] = [];
  const distributors = ['阿里-义乌市益瑞康科技有限公司', '阿里-义乌市青色贸易有限公司', '阿里-义乌市起乾商贸有限公司', '阿里-义乌市嘉诺进出口有限公司', '阿里-义乌市领阅贸易有限公司'];
  const stores = ['店铺A', '店铺B', '店铺C', '店铺D'];
  const grades = ['S', 'A', 'B', 'C', 'D'];
  const categories = ['2类铁单', '7类强单', '3+类高意向', '3类有意向', '3-类意向不明', '1类已付款', '拿样客户', '0类未触碰', '定制客户'];
  const types = ['代发', '批发', '散户', '定制'];
  const channels = ['转介绍', '展会', '阿里转接', '站外拉新', '线下开发'];
  const salesChannels = ['亚马逊', 'temu', '速卖通', '希音', 'TikTok', '虾皮', '美客多', '沃尔玛', 'Ozon', '阿里国际站', '阿里', '拼多多', '淘宝', '京东', '唯品会', '私域', '快手', '小红书', '抖音', '得物', '微信视频号'];
  const genders = ['男', '女'];

  for (let i = 0; i < count; i++) {
    data.push({
      id: `cust_${i}`,
      customerName: distributors[Math.floor(Math.random() * distributors.length)],
      storeAttribution: stores[Math.floor(Math.random() * stores.length)],
      buyerId: `buyer_${Math.floor(Math.random() * 10000)}`,
      orderAccount: `acc_${Math.floor(Math.random() * 10000)}`,
      customerGrade: grades[Math.floor(Math.random() * grades.length)],
      salesAmount: Math.floor(Math.random() * 100000),
      customerCategory: categories[Math.floor(Math.random() * categories.length)],
      customerType: types[Math.floor(Math.random() * types.length)],
      sourceChannel: channels[Math.floor(Math.random() * channels.length)],
      visitDate: `2026.${Math.floor(Math.random() * 12) + 1}月拜访`,
      customerSalesChannel: salesChannels[Math.floor(Math.random() * salesChannels.length)],
      wechatRemark: `备注_${i}`,
      wechatId: `wxid_${Math.floor(Math.random() * 10000)}`,
      wechatAccount: `wxacc_${Math.floor(Math.random() * 10000)}`,
      groupName: `群_${Math.floor(Math.random() * 100)}`,
      realName: `姓名_${i}`,
      idCard: `33010119900101${Math.floor(Math.random() * 10000)}`,
      phoneNumber: `138${Math.floor(Math.random() * 100000000)}`,
      gender: genders[Math.floor(Math.random() * genders.length)],
      birthday: `1990-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
      customerStoreName: `客户店铺_${i}`,
      productCategory: `类目_${Math.floor(Math.random() * 10)}`,
      companyName: `公司_${i}`,
      address: `地址_${i}`,
      customerPrice: `${Math.floor(Math.random() * 10) + 1}个点`,
      taxPoint: `${Math.floor(Math.random() * 10)}%`,
      shippingRequirement: `发货要求_${i}`,
      isInfoComplete: Math.random() > 0.5,
      remarks: `备注_${i}`,
      dailyTrackingRemarks: `日常跟踪备注_${i}`,
    });
  }
  return data;
};
