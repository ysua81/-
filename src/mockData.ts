import { SalesRecord, CompetitiveProduct, StrategicCategory } from './types';
import { subDays, startOfMonth, format, subMonths, subYears, startOfWeek } from 'date-fns';

export const generateStrategicMapData = (): StrategicCategory[] => {
  const categories = [
    {
      title: '人群需求',
      topItem: { name: '婴儿', popularity: 32728092 },
      items: [
        { name: '儿童', popularity: 31138385 },
        { name: '宝宝', popularity: 29837075 },
        { name: '成人', popularity: 5047646 },
        { name: '大人', popularity: 4407658 },
        { name: '新生', popularity: 4059493 },
        { name: '一岁', popularity: 3482294 },
        { name: '幼儿', popularity: 3196079 },
        { name: '游泳', popularity: 3076304 },
        { name: '女士', popularity: 1933941 },
      ]
    },
    {
      title: '使用需求',
      topItem: { name: '泡脚', popularity: 28349066 },
      items: [
        { name: '游泳', popularity: 23249082 },
        { name: '泡澡', popularity: 13164853 },
        { name: '滑雪', popularity: 5055012 },
        { name: '洗澡', popularity: 4949664 },
        { name: '拳击', popularity: 4923857 },
        { name: '洗头', popularity: 4815870 },
        { name: '洗脚', popularity: 3788488 },
        { name: '坐浴', popularity: 3320303 },
        { name: '训练', popularity: 2564817 },
      ]
    },
    {
      title: '其他需求',
      topItem: { name: '消耗', popularity: 758666 },
      items: [
        { name: 'kk', popularity: 661780 },
        { name: '成长', popularity: 619851 },
        { name: '用品', popularity: 536219 },
        { name: '人家', popularity: 487454 },
        { name: '以上', popularity: 367764 },
        { name: '一名', popularity: 348520 },
        { name: '抽抽', popularity: 346629 },
        { name: '体力', popularity: 313432 },
        { name: '用盆', popularity: 285912 },
      ]
    },
    {
      title: '功能需求',
      topItem: { name: '充气', popularity: 21210097 },
      items: [
        { name: '折叠', popularity: 12666251 },
        { name: '游泳', popularity: 10563711 },
        { name: '气垫', popularity: 5242931 },
        { name: '电动', popularity: 2972861 },
        { name: '便携', popularity: 2244701 },
        { name: '防水', popularity: 2195839 },
        { name: '带轮', popularity: 2115053 },
        { name: '自动', popularity: 2057557 },
        { name: '喷水', popularity: 2011542 },
      ]
    },
    {
      title: '品牌需求',
      topItem: { name: 'stokke', popularity: 2504485 },
      items: [
        { name: '卡达', popularity: 2478609 },
        { name: '哈卡', popularity: 2145882 },
        { name: 'iuu', popularity: 1657759 },
        { name: 'kk', popularity: 1129509 },
        { name: '卡曼', popularity: 1037422 },
        { name: '迪卡侬', popularity: 891465 },
        { name: '肯德基', popularity: 866610 },
        { name: '英发', popularity: 771820 },
        { name: '气床', popularity: 721144 },
      ]
    },
    {
      title: '品类需求',
      topItem: { name: '玩具', popularity: 35459759 },
      items: [
        { name: '脚桶', popularity: 25112762 },
        { name: '泡脚桶', popularity: 21776434 },
        { name: '水枪', popularity: 19000478 },
        { name: '餐椅', popularity: 16985697 },
        { name: '泳镜', popularity: 15086882 },
        { name: '泳圈', popularity: 11002087 },
        { name: '充气床', popularity: 8208079 },
        { name: '泳帽', popularity: 7800672 },
        { name: '洗澡盆', popularity: 6903629 },
      ]
    },
    {
      title: '场景需求',
      topItem: { name: '家用', popularity: 0 }, // Image doesn't show popularity for top scene
      items: [
        { name: '户外', popularity: 0 },
        { name: '飞机', popularity: 0 },
        { name: '露营', popularity: 0 },
        { name: '地铺', popularity: 0 },
        { name: '水上', popularity: 0 },
        { name: '旅行', popularity: 0 },
        { name: '火车', popularity: 0 },
        { name: '高铁', popularity: 0 },
        { name: '室内', popularity: 0 },
      ]
    }
  ];
  return categories as StrategicCategory[];
};

const platforms = ['淘宝', '京东', '拼多多', '抖音', '快手'];
const businessOwners = ['张三', '李四', '王五', '赵六', '孙七'];
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
    });
  }
  return data;
};
