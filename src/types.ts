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
  isWholesale: boolean; // 代批
  date: string; // ISO string
  customerType: 'New' | 'Returning';
  categoryL2: string;
  categoryL3: string;
  categoryL4: string;
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
}

export interface StrategicCategory {
  title: string;
  topItem: StrategicDemandItem;
  items: StrategicDemandItem[];
}
