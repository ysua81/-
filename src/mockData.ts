import { SalesRecord, CompetitiveProduct, StrategicCategory, KeywordData } from './types';
import { subDays, startOfMonth, format, subMonths, subYears, startOfWeek } from 'date-fns';

export const generateStrategicMapData = (): StrategicCategory[] => {
  const categories = [
    {
      title: '人群需求',
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
      title: '使用需求',
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
      title: '其他需求',
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
    },
    {
      title: '功能需求',
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
      title: '品牌需求',
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
      title: '品类需求',
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
      title: '场景需求',
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
    }
  ];
  return categories as StrategicCategory[];
};

export const generateKeywordData = (): KeywordData[] => {
  return [
    { rank: 1, keyword: '宝宝餐椅', searchIndex: 124200, clickRate: 99.70, paymentConversion: 11.05, paymentIndex: 13700, clickIndex: 123800 },
    { rank: 2, keyword: '儿童餐椅', searchIndex: 69600, clickRate: 95.05, paymentConversion: 8.66, paymentIndex: 5732, clickIndex: 66200 },
    { rank: 3, keyword: '成长椅', searchIndex: 66600, clickRate: 110.93, paymentConversion: 4.35, paymentIndex: 3213, clickIndex: 73900 },
    { rank: 4, keyword: '哈卡达餐椅', searchIndex: 60300, clickRate: 93.99, paymentConversion: 2.00, paymentIndex: 1135, clickIndex: 56700 },
    { rank: 5, keyword: '实木餐椅', searchIndex: 55400, clickRate: 88.50, paymentConversion: 5.20, paymentIndex: 2800, clickIndex: 49000 },
    { rank: 6, keyword: '折叠餐椅', searchIndex: 48200, clickRate: 92.10, paymentConversion: 7.40, paymentIndex: 3500, clickIndex: 44000 },
    { rank: 7, keyword: '多功能餐椅', searchIndex: 42100, clickRate: 85.30, paymentConversion: 3.80, paymentIndex: 1600, clickIndex: 36000 },
    { rank: 8, keyword: '便携餐椅', searchIndex: 35600, clickRate: 78.90, paymentConversion: 6.10, paymentIndex: 2100, clickIndex: 28000 },
    { rank: 9, keyword: '婴儿餐椅', searchIndex: 31200, clickRate: 82.40, paymentConversion: 4.50, paymentIndex: 1400, clickIndex: 25000 },
    { rank: 10, keyword: '餐椅垫', searchIndex: 28400, clickRate: 75.20, paymentConversion: 2.80, paymentIndex: 800, clickIndex: 21000 },
  ];
};

const platforms = ['淘宝', '京东', '拼多多', '抖音', '快手'];
const businessOwners = ['方建浩', '孔帅'];
const salespeople = ['小王', '小李', '小张', '小赵', '小钱'];
const categories = [
  { l2: '服装', l3: '女装', l4: '连衣裙' },
  { l2: '服装', l3: '女装', l4: 'T恤' },
  { l2: '服装', l3: '男装', l4: '牛仔裤' },
  { l2: '电子', l3: '手机', l4: '智能手机' },
  { l2: '电子', l3: '电脑', l4: '笔记本' },
  { l2: '家居', l3: '家具', l4: '沙发' },
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
      category: categories[Math.floor(Math.random() * categories.length)].l3,
      isGoldCrown: Math.random() > 0.8,
      isPotential: Math.random() > 0.7,
    });
  }
  return data;
};

export const generateMockData = (count: number = 500): SalesRecord[] => {
  const data: SalesRecord[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const date = subDays(now, Math.floor(Math.random() * 400)); // Last 400 days
    const cat = categories[Math.floor(Math.random() * categories.length)];
    const amount = Math.floor(Math.random() * 1000) + 100;
    
    data.push({
      id: `rec_${i}`,
      distributorId: `DIST_${Math.floor(Math.random() * 10) + 100}`,
      storeName: `店铺_${Math.floor(Math.random() * 5) + 1}`,
      platform: platforms[Math.floor(Math.random() * platforms.length)],
      isWholesale: Math.random() > 0.7,
      date: date.toISOString(),
      customerType: Math.random() > 0.6 ? 'Returning' : 'New',
      categoryL2: cat.l2,
      categoryL3: cat.l3,
      categoryL4: cat.l4,
      salesAmount: amount,
      salesVolume: Math.floor(Math.random() * 20) + 1,
      costAmount: amount * (0.6 + Math.random() * 0.2), // 60-80% cost
      businessOwner: businessOwners[Math.floor(Math.random() * businessOwners.length)],
      salesperson: salespeople[Math.floor(Math.random() * salespeople.length)],
    });
  }
  return data;
};
