/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CompetitiveProduct {
  id: string;
  name: string;
  image: string;
  storeName: string;
  transactionIndex: number; // 交易指数
  trafficIndex: number; // 流量指数
  searchIndex: number; // 搜索指数
  searchGrowth: number; // 搜索增长幅度
  effectiveInquiryIndex: number; // 有效询盘用户指数
  listingTime: string; // 上架时间
  monthlySales: number; // 月成交
  monthlyDropshipping: number; // 月代销
  yearlySalesVolume: number; // 年成交件数
  yearlyTransactionCount: number; // 年成交笔数
  reviewCount: number; // 评论数
  positiveRate: number; // 好评率
  collectionRate: number; // 揽收率
  repurchaseRate: number; // 商品复购率
  addToCartCount: number; // 加购人数
  platformType: '天猫' | '淘宝' | '京东'; // 店铺类型
  origin: string; // 发货地
  category: string;
  isGoldCrown: boolean;
  isPotential: boolean;
}

export interface SalesRecord {
  id: string;
  distributorId: string;
  storeName: string;
  platform: string;
  isWholesale: '代发' | '批发' | '散户' | '定制'; // 代批
  date: string; // ISO string
  customerType: 'New' | 'Returning';
  categoryL1: string;
  categoryL2: string;
  categoryL3: string;
  categoryL4: string;
  sku: string;
  salesAmount: number;
  salesVolume: number;
  costAmount: number;
  businessOwner: string;
  salesperson: string;
}

export interface GrowthMetrics {
  wow: number;
  mom: number;
  yoy: number;
}

export interface StrategicDemandItem {
  name: string;
  popularity: number;
  growth: number; // 环比增长
}

export interface KeywordData {
  rank: number;
  keyword: string;
  searchIndex: number;
  searchGrowth: number; // 搜索增长幅度
  clickRate: number;
  productIndex: number; // 商品指数
  supplyDemandIndex: number; // 供需指数
  monthlyPrice: number; // 包月推广价
}

export interface StrategicCategory {
  title: string;
  topItem: StrategicDemandItem;
  items: StrategicDemandItem[];
}

export interface MarketingPlanData {
  id: string;
  planName: string; // 营销方案
  spend: number; // 消耗
  impressions: number; // 展现数
  clicks: number; // 点击数
  ctr: number; // 点击率
  cpc: number; // 平均点击花费
  leads: number; // 线索量
  leadConversionRate: number; // 线索转化率
  leadCost: number; // 线索成本
  inquiries: number; // 总询盘量
  inquiryCost: number; // 询盘成本
  inquiryConversionRate: number; // 询盘转化率
  status: '优秀' | '良好' | '一般' | '待优化'; // 状态评估
  mom?: Partial<Record<keyof Omit<MarketingPlanData, 'id' | 'planName' | 'status' | 'mom'>, number>>;
}

export interface KeywordAnalysisData {
  id: string;
  keyword: string; // 关键词
  spend: number; // 消耗
  impressions: number; // 展现数
  clicks: number; // 点击数
  ctr: number; // 点击率
  cpc: number; // 平均点击花费
  leads: number; // 线索量
  leadConversionRate: number; // 线索转化率
  leadCost: number; // 线索成本
  inquiries: number; // 总询盘量
  inquiryCost: number; // 询盘成本
  inquiryConversionRate: number; // 询盘转化率
  action: string; // 建议操作
  mom?: Partial<Record<keyof Omit<KeywordAnalysisData, 'id' | 'keyword' | 'action' | 'mom'>, number>>;
}

export interface LinkAnalysisData {
  id: string;
  productId: string; // 商品ID
  spend: number; // 消耗
  impressions: number; // 展现数
  clicks: number; // 点击数
  ctr: number; // 点击率
  cpc: number; // 平均点击花费
  leads: number; // 线索量
  leadConversionRate: number; // 线索转化率
  leadCost: number; // 线索成本
  inquiries: number; // 总询盘量
  inquiryCost: number; // 询盘成本
  inquiryConversionRate: number; // 询盘转化率
  roi: number; // 投入产出比
  status: '优秀' | '良好' | '一般' | '待优化'; // 状态评估
  mom?: Partial<Record<keyof Omit<LinkAnalysisData, 'id' | 'productId' | 'status' | 'mom'>, number>>;
}

export interface CustomerMaintenanceData {
  id: string;
  customerName: string; // 客户名称 (分销商)
  storeAttribution: string; // 店铺归属
  buyerId: string; // 买家ID
  orderAccount: string; // 下单账号
  customerGrade: string; // 客户等级
  salesAmount: number; // 销售额
  customerCategory: string; // 客户分类
  customerType: string; // 客户类型
  sourceChannel: string; // 来源渠道
  visitDate: string; // 拜访日期
  customerSalesChannel: string; // 客户销售渠道
  wechatRemark: string; // 客户微信备注名
  wechatId: string; // 客户微信号
  wechatAccount: string; // 客户微信账号
  groupName: string; // 客户群名称
  realName: string; // 客户姓名
  idCard: string; // 客户身份证
  phoneNumber: string; // 手机号
  gender: string; // 性别
  birthday: string; // 生日
  customerStoreName: string; // 客户店铺名
  productCategory: string; // 产品类目
  companyName: string; // 客户公司名
  address: string; // 客户地址
  customerPrice: string; // 客户价格
  taxPoint: string; // 发票税点
  shippingRequirement: string; // 发货要求
  isInfoComplete: boolean; // 信息是否完善
  remarks: string; // 备注信息
  dailyTrackingRemarks: string; // 日常跟踪备注
}
