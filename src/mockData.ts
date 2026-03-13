import { SalesRecord, CompetitiveProduct } from './types';
import { subDays, startOfMonth, format, subMonths, subYears, startOfWeek } from 'date-fns';

const platforms = ['淘宝', '京东', '拼多多', '抖音', '快手'];
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
    });
  }
  return data;
};
