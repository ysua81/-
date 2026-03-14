/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  LayoutDashboard, Filter, TrendingUp, TrendingDown, Users, ShoppingBag, 
  Calendar, ChevronDown, ChevronUp, Search, Download, RefreshCw, ChevronLeft, ChevronRight, Play, Trash2, Upload,
  MessageSquare, BarChart2, UserCheck, Map, UploadCloud, Target, 
  Store as StoreIcon, Megaphone, Type, Box, Key, List, Video, PlayCircle
} from 'lucide-react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subWeeks, subMonths, startOfYear, subYears, isWithinInterval, parseISO, eachDayOfInterval, isSameDay } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { SalesRecord, CompetitiveProduct } from './types';
import { generateMockData, generateCompetitiveData } from './mockData';
import StrategicMap from './components/StrategicMap';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const SortableHeader = ({ 
  label, 
  sortKey, 
  currentSort, 
  onSort, 
  align = 'left' 
}: { 
  label: string; 
  sortKey: string; 
  currentSort: { key: string; direction: 'asc' | 'desc' } | null; 
  onSort: (key: any) => void;
  align?: 'left' | 'right' | 'center';
}) => {
  const isActive = currentSort?.key === sortKey;
  
  return (
    <th 
      className={cn(
        "px-4 py-4 cursor-pointer hover:bg-slate-50 transition-colors group select-none", 
        align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'
      )} 
      onClick={() => onSort(sortKey)}
    >
      <div className={cn("flex items-center gap-1", align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start')}>
        <span>{label}</span>
        {sortKey !== 'id' && (
          <div className="flex flex-col -space-y-1">
            <ChevronUp size={10} className={cn(isActive && currentSort?.direction === 'asc' ? "text-orange-500" : "text-slate-300 group-hover:text-slate-400")} />
            <ChevronDown size={10} className={cn(isActive && currentSort?.direction === 'desc' ? "text-orange-500" : "text-slate-300 group-hover:text-slate-400")} />
          </div>
        )}
      </div>
    </th>
  );
};

export default function App() {
  const [activeMenu, setActiveMenu] = useState('销售数据分析');
  const [data] = useState<SalesRecord[]>(() => generateMockData(1000));
  const [competitiveData] = useState<CompetitiveProduct[]>(() => generateCompetitiveData(100));
  const [rankingType, setRankingType] = useState('热销榜');
  const [productFilter, setProductFilter] = useState('全部商品');
  const [sortConfig, setSortConfig] = useState<{ key: keyof CompetitiveProduct | 'rank'; direction: 'asc' | 'desc' } | null>(null);
  const [originFilter, setOriginFilter] = useState<string | 'all'>('all');
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [tableSortConfig, setTableSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const provinces = [
    '全部', '北京', '天津', '河北', '山西', '内蒙古', '辽宁', '吉林', '黑龙江', '上海', 
    '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', 
    '广西', '海南', '重庆', '四川', '贵州', '云南', '西藏', '陕西', '甘肃', '青海', 
    '宁夏', '新疆', '香港', '澳门', '台湾'
  ];

  const menuItems = [
    { id: '销售接待', icon: MessageSquare },
    { id: '销售数据分析', icon: BarChart2 },
    { id: '客户维护', icon: UserCheck },
    { id: '战略地图', icon: Map },
    { id: '自动上架', icon: UploadCloud },
    { id: '竞品分析', icon: Target },
    { id: '竞店分析', icon: StoreIcon },
    { id: '数字营销分析', icon: Megaphone },
    { id: '标题优化', icon: Type },
    { id: '店铺数据分析', icon: LayoutDashboard },
    { id: '主推品数据分析', icon: Box },
    { id: '入店关键词分析', icon: Key },
    { id: '客户明细', icon: List },
    { id: '内容视频', icon: Video },
    { id: 'AI直播营销视频', icon: PlayCircle },
  ];

  const [selectedDimensionId, setSelectedDimensionId] = useState('');
  const [selectedFilterValue, setSelectedFilterValue] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<'salesAmount' | 'salesVolume'>('salesAmount');
  const [selectedYear, setSelectedYear] = useState<number | 'all'>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');

  const dimensions = [
    { id: 'distributorId', label: '分销商' },
    { id: 'storeName', label: '店铺' },
    { id: 'platform', label: '平台' },
    { id: 'customerType', label: '新老客' },
    { id: 'isWholesale', label: '代批' },
    { id: 'categoryL2', label: '二级类目' },
    { id: 'categoryL3', label: '三级类目' },
    { id: 'categoryL4', label: '四级类目' },
    { id: 'businessOwner', label: '业务负责人' },
  ];

  // Reset filter value when dimension changes
  useEffect(() => {
    setSelectedFilterValue(null);
  }, [selectedDimensionId]);

  const filteredData = useMemo(() => {
    let result = data;

    // Year/Month Filter
    if (selectedYear !== 'all') {
      result = result.filter(d => new Date(d.date).getFullYear() === selectedYear);
    }
    if (selectedMonth !== 'all') {
      result = result.filter(d => new Date(d.date).getMonth() === selectedMonth);
    }

    if (!selectedFilterValue) return result;
    
    return result.filter(d => {
      if (selectedDimensionId === 'isWholesale') {
        const val = d.isWholesale ? '代批' : '非代批';
        return val === selectedFilterValue;
      }
      if (selectedDimensionId === 'customerType') {
        const val = d.customerType === 'New' ? '新客' : '老客';
        return val === selectedFilterValue;
      }
      if (selectedDimensionId === 'businessOwner') {
        return d.businessOwner === selectedFilterValue;
      }
      if (['distributorId', 'categoryL2', 'categoryL3', 'categoryL4'].includes(selectedDimensionId)) {
        return String((d as any)[selectedDimensionId]).toLowerCase().includes(selectedFilterValue.toLowerCase());
      }
      return String((d as any)[selectedDimensionId]) === selectedFilterValue;
    });
  }, [data, selectedDimensionId, selectedFilterValue, selectedYear, selectedMonth]);

  const processedCompetitiveData = useMemo(() => {
    let result = [...competitiveData];

    // Filter by Level 2 tabs
    if (productFilter === '金冠品') {
      result = result.filter(p => p.isGoldCrown);
    } else if (productFilter === '潜力品') {
      result = result.filter(p => p.isPotential);
    }

    // Filter by Origin
    if (originFilter !== 'all' && originFilter !== '全部') {
      result = result.filter(p => p.origin.includes(originFilter));
    }

    // Default sorting based on rankingType (to establish base rank)
    result.sort((a, b) => {
      if (rankingType === '热销榜') return b.transactionIndex - a.transactionIndex;
      if (rankingType === '热访榜') return b.trafficIndex - a.trafficIndex;
      if (rankingType === '热搜榜') return b.searchIndex - a.searchIndex;
      if (rankingType === '飙升榜') return b.searchGrowth - a.searchGrowth;
      if (rankingType === '询盘榜') return b.effectiveInquiryIndex - a.effectiveInquiryIndex;
      return b.transactionIndex - a.transactionIndex;
    });

    // Add rank property for sorting by rank
    const rankedData = result.map((p, i) => ({ ...p, _rank: i + 1 }));

    // Apply custom sort if configured
    if (sortConfig) {
      rankedData.sort((a, b) => {
        if (sortConfig.key === 'rank') {
          return sortConfig.direction === 'asc' ? b._rank - a._rank : a._rank - b._rank;
        }
        const aVal = a[sortConfig.key as keyof CompetitiveProduct];
        const bVal = b[sortConfig.key as keyof CompetitiveProduct];

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortConfig.direction === 'asc' ? bVal - aVal : aVal - bVal;
        }
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortConfig.direction === 'asc' ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
        }
        return 0;
      });
    }

    return rankedData;
  }, [competitiveData, productFilter, originFilter, sortConfig, rankingType]);

  const handleSort = (key: keyof CompetitiveProduct | 'rank') => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        if (prev.direction === 'asc') return { key, direction: 'desc' };
        return null;
      }
      return { key, direction: 'asc' };
    });
  };

  const handleTableSort = (key: string) => {
    setTableSortConfig(prev => {
      if (prev?.key === key) {
        if (prev.direction === 'asc') return { key, direction: 'desc' };
        return null;
      }
      return { key, direction: 'asc' };
    });
  };

  // Available values for the selected dimension (for the dropdown)
  const availableValues = useMemo(() => {
    if (!selectedDimensionId) return [];
    const vals = data.map(d => {
      if (selectedDimensionId === 'isWholesale') return d.isWholesale ? '代批' : '非代批';
      if (selectedDimensionId === 'customerType') return d.customerType === 'New' ? '新客' : '老客';
      if (selectedDimensionId === 'businessOwner') return d.businessOwner;
      return String((d as any)[selectedDimensionId]);
    });
    return [...new Set(vals)].sort().reverse();
  }, [data, selectedDimensionId]);

  // Trend Data Calculations
  const trendData = useMemo(() => {
    const now = new Date();
    
    // Weekly Trend (Current Week)
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);
    const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
    
    const weeklyTrend = daysInWeek.map(day => {
      const daySales = filteredData
        .filter(d => isSameDay(parseISO(d.date), day))
        .reduce((sum, d) => sum + d[selectedMetric], 0);
      return {
        date: format(day, 'EEE'),
        fullDate: format(day, 'yyyy-MM-dd'),
        sales: daySales
      };
    });

    // Monthly Trend (Current Month)
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    const monthlyTrend = daysInMonth.map(day => {
      const daySales = filteredData
        .filter(d => isSameDay(parseISO(d.date), day))
        .reduce((sum, d) => sum + d[selectedMetric], 0);
      return {
        date: format(day, 'dd'),
        fullDate: format(day, 'yyyy-MM-dd'),
        sales: daySales
      };
    });

    return { weeklyTrend, monthlyTrend };
  }, [filteredData, selectedMetric]);

  const [globalSearch, setGlobalSearch] = useState('');

  // Growth Calculations
  const metrics = useMemo(() => {
    const now = new Date();
    
    const getSalesInRange = (start: Date, end: Date) => {
      return filteredData
        .filter(d => isWithinInterval(parseISO(d.date), { start, end }))
        .reduce((sum, d) => sum + d[selectedMetric], 0);
    };

    // WoW
    const thisWeekStart = startOfWeek(now);
    const lastWeekStart = subWeeks(thisWeekStart, 1);
    const thisWeekSales = getSalesInRange(thisWeekStart, now);
    const lastWeekSales = getSalesInRange(lastWeekStart, thisWeekStart);
    const wow = lastWeekSales === 0 ? 0 : ((thisWeekSales - lastWeekSales) / lastWeekSales) * 100;

    // MoM
    const thisMonthStart = startOfMonth(now);
    const lastMonthStart = subMonths(thisMonthStart, 1);
    const thisMonthSales = getSalesInRange(thisMonthStart, now);
    const lastMonthSales = getSalesInRange(lastMonthStart, thisMonthStart);
    const mom = lastMonthSales === 0 ? 0 : ((thisMonthSales - lastMonthSales) / lastMonthSales) * 100;

    // YoY
    const thisYearStart = startOfYear(now);
    const lastYearStart = subYears(thisYearStart, 1);
    const thisYearSales = getSalesInRange(thisYearStart, now);
    const lastYearSales = getSalesInRange(lastYearStart, thisYearStart);
    const yoy = lastYearSales === 0 ? 0 : ((thisYearSales - lastYearSales) / lastYearSales) * 100;

    return { wow, mom, yoy, total: filteredData.reduce((s, d) => s + d[selectedMetric], 0) };
  }, [filteredData, selectedMetric]);

  // Dimension-specific growth calculations
  const dimensionMetrics = useMemo(() => {
    const now = new Date();
    const getMetricsInRange = (subset: SalesRecord[], start: Date, end: Date) => {
      const filtered = subset.filter(d => isWithinInterval(parseISO(d.date), { start, end }));
      const sales = filtered.reduce((sum, d) => sum + d[selectedMetric], 0);
      const salesAmt = filtered.reduce((sum, d) => sum + d.salesAmount, 0);
      const costAmt = filtered.reduce((sum, d) => sum + d.costAmount, 0);
      const margin = salesAmt === 0 ? 0 : ((salesAmt - costAmt) / salesAmt) * 100;
      return { sales, margin };
    };

    const calculateGrowth = (subset: SalesRecord[]) => {
      const thisWeekStart = startOfWeek(now);
      const lastWeekStart = subWeeks(thisWeekStart, 1);
      const thisMonthStart = startOfMonth(now);
      const lastMonthStart = subMonths(thisMonthStart, 1);
      const thisYearStart = startOfYear(now);
      const lastYearStart = subYears(thisYearStart, 1);

      const thisWeekMetrics = getMetricsInRange(subset, thisWeekStart, now);
      const lastWeekMetrics = getMetricsInRange(subset, lastWeekStart, thisWeekStart);
      const thisMonthMetrics = getMetricsInRange(subset, thisMonthStart, now);
      const lastMonthMetrics = getMetricsInRange(subset, lastMonthStart, thisMonthStart);
      const thisYearMetrics = getMetricsInRange(subset, thisYearStart, now);
      const lastYearMetrics = getMetricsInRange(subset, lastYearStart, thisYearStart);

      const thisWeek = thisWeekMetrics.sales;
      const lastWeek = lastWeekMetrics.sales;
      const thisMonth = thisMonthMetrics.sales;
      const lastMonth = lastMonthMetrics.sales;
      const thisYear = thisYearMetrics.sales;
      const lastYear = lastYearMetrics.sales;

      return {
        thisWeek,
        lastWeek,
        thisMonth,
        lastMonth,
        thisYear,
        lastYear,
        wow: lastWeek === 0 ? 0 : ((thisWeek - lastWeek) / lastWeek) * 100,
        mom: lastMonth === 0 ? 0 : ((thisMonth - lastMonth) / lastMonth) * 100,
        yoy: lastYear === 0 ? 0 : ((thisYear - lastYear) / lastYear) * 100,
        total: subset.reduce((sum, d) => sum + d[selectedMetric], 0),
        weekMargin: thisWeekMetrics.margin,
        monthMargin: thisMonthMetrics.margin,
        yearMargin: thisYearMetrics.margin
      };
    };

    return dimensions
      .filter(d => d.id === selectedDimensionId)
      .map(dim => {
        const subset = data;
        const selection = selectedFilterValue || '全部';

        // Calculate breakdown for the selected dimension
        const groups: Record<string, SalesRecord[]> = {};
        data.forEach(d => {
          let key = '';
          if (dim.id === 'isWholesale') {
            key = d.isWholesale ? '代批' : '非代批';
          } else if (dim.id === 'customerType') {
            key = d.customerType === 'New' ? '新客' : '老客';
          } else if (dim.id === 'businessOwner') {
            key = d.businessOwner;
          } else {
            key = String((d as any)[dim.id]);
          }

          if (!groups[key]) groups[key] = [];
          groups[key].push(d);
        });

        const breakdown = Object.entries(groups)
          .map(([id, records]) => ({
            id,
            metrics: calculateGrowth(records)
          }))
          .sort((a, b) => {
            if (tableSortConfig) {
              const { key, direction } = tableSortConfig;
              let valA: any;
              let valB: any;

              if (key === 'id') {
                valA = a.id;
                valB = b.id;
              } else {
                // Handle nested metrics keys
                valA = (a.metrics as any)[key];
                valB = (b.metrics as any)[key];
              }

              if (valA < valB) return direction === 'asc' ? 1 : -1;
              if (valA > valB) return direction === 'asc' ? -1 : 1;
              return 0;
            }
            return b.metrics.total - a.metrics.total;
          });

        return {
          ...dim,
          selection,
          metrics: calculateGrowth(subset),
          breakdown
        };
      });
  }, [data, selectedDimensionId, selectedFilterValue, selectedMetric, tableSortConfig]);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col sticky top-0 h-screen shrink-0 z-50">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <ShoppingBag className="text-white" size={20} />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">电商数据看板</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-left",
                  activeMenu === item.id 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                    : "hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon size={18} className={cn(
                  "shrink-0",
                  activeMenu === item.id ? "text-white" : "text-slate-500"
                )} />
                <span className="truncate">{item.id}</span>
              </button>
            ))}
          </div>
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">Admin User</p>
              <p className="text-[10px] text-slate-500 truncate">admin@ecommerce.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-slate-900">{activeMenu}</h1>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Calendar size={14} />
              <span>数据更新至: {format(new Date(), 'yyyy-MM-dd HH:mm')}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="搜索功能或数据..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none w-64"
              />
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors relative">
              <RefreshCw size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-md shadow-indigo-200">
              <Download size={16} />
              <span>导出报告</span>
            </button>
          </div>
        </header>

        {activeMenu === '销售数据分析' ? (
          <main className="p-8 space-y-8 max-w-[1600px] mx-auto w-full">
            {/* Single Dimension Selector Bar */}
            <section className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="flex items-center gap-3 shrink-0">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Filter size={18} className="text-indigo-600" />
                </div>
                <span className="text-sm font-bold text-slate-700">维度筛选</span>
              </div>

              <div className="flex items-center gap-3 flex-1">
                <div className="w-28">
                  <select 
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all cursor-pointer"
                  >
                    <option value="all">全部年份</option>
                    <option value={2026}>2026年</option>
                    <option value={2025}>2025年</option>
                    <option value={2024}>2024年</option>
                  </select>
                </div>

                <div className="w-28">
                  <select 
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all cursor-pointer"
                  >
                    <option value="all">全部月份</option>
                    {Array.from({ length: 12 }).map((_, i) => (
                      <option key={i} value={i}>{i + 1}月</option>
                    ))}
                  </select>
                </div>

                <div className="h-8 w-px bg-slate-200 mx-1" />

                <div className="w-32">
                  <select 
                    value={selectedDimensionId}
                    onChange={(e) => setSelectedDimensionId(e.target.value)}
                    className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all cursor-pointer ${!selectedDimensionId ? 'text-slate-400' : 'text-slate-700'}`}
                  >
                    <option value="" disabled>请选择筛选项</option>
                    {dimensions.map(dim => (
                      <option key={dim.id} value={dim.id} className="text-slate-700">{dim.label}</option>
                    ))}
                  </select>
                </div>

                <div className="w-48">
                  {!selectedDimensionId ? (
                    <div className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-400 cursor-not-allowed flex items-center justify-between">
                      <span>请先选择维度</span>
                      <ChevronDown size={14} className="opacity-30" />
                    </div>
                  ) : ['distributorId', 'categoryL2', 'categoryL3', 'categoryL4'].includes(selectedDimensionId) ? (
                    <div className="relative">
                      <input 
                        list="sub-item-list"
                        type="text"
                        placeholder="输入搜索细分项..."
                        value={selectedFilterValue || ''}
                        onChange={(e) => setSelectedFilterValue(e.target.value || null)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                      />
                      <datalist id="sub-item-list">
                        {availableValues.map(val => (
                          <option key={val} value={val} />
                        ))}
                      </datalist>
                      <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  ) : (
                    <select 
                      value={selectedFilterValue || ''}
                      onChange={(e) => setSelectedFilterValue(e.target.value || null)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all cursor-pointer"
                    >
                      <option value="">全部细分项</option>
                      {availableValues.map(val => (
                        <option key={val} value={val}>{val}</option>
                      ))}
                    </select>
                  )}
                </div>

                {selectedFilterValue && (
                  <button 
                    onClick={() => setSelectedFilterValue(null)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 px-3 py-2 bg-indigo-50 rounded-lg transition-all"
                  >
                    清除细分筛选
                  </button>
                )}

                <div className="h-8 w-px bg-slate-200 mx-1" />

                <div className="w-32">
                  <select 
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all cursor-pointer"
                  >
                    <option value="salesAmount">销售额</option>
                    <option value="salesVolume">销量</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 italic">
                <span>* 筛选细分项将同步更新趋势图与KPI</span>
              </div>
            </section>

            {/* KPI Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard 
                title={selectedMetric === 'salesAmount' ? "总销售额" : "总销量"} 
                value={selectedMetric === 'salesAmount' ? `¥${metrics.total.toLocaleString()}` : metrics.total.toLocaleString()} 
                trend={metrics.wow >= 0 ? 'up' : 'down'} 
                icon={<ShoppingBag className="text-indigo-600" size={18} />}
              />
              <MetricCard 
                title="订单总量" 
                value={data.length.toLocaleString()} 
                trend={metrics.mom >= 0 ? 'up' : 'down'} 
                icon={<LayoutDashboard className="text-emerald-600" size={18} />}
              />
              <MetricCard 
                title="活跃客户数" 
                value={new Set(data.map(d => d.distributorId)).size.toLocaleString()} 
                trend={metrics.wow < 0 ? 'up' : 'down'} 
                icon={<Users className="text-amber-600" size={18} />}
              />
              <MetricCard 
                title="平均客单价" 
                value={`¥${Math.floor(metrics.total / (data.length || 1))}`} 
                trend={metrics.yoy >= 0 ? 'up' : 'down'} 
                icon={<TrendingUp className="text-rose-600" size={18} />}
              />
            </section>

            {/* Trend Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">本周趋势增长曲线</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">展示本周每日{selectedMetric === 'salesAmount' ? '销售额' : '销量'}波动情况</p>
                  </div>
                  <div className="px-2 py-1 bg-indigo-50 rounded text-[10px] font-bold text-indigo-600">
                    WEEKLY TREND
                  </div>
                </div>
                <div className="h-[160px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData.weeklyTrend}>
                      <defs>
                        <linearGradient id="colorWeekly" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fill: '#94a3b8'}}
                        dy={10}
                      />
                      <YAxis 
                        hide 
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number) => [selectedMetric === 'salesAmount' ? `¥${value.toLocaleString()}` : value.toLocaleString(), selectedMetric === 'salesAmount' ? '销售额' : '销量']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="#6366f1" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorWeekly)" 
                        animationDuration={1500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">本月趋势增长曲线</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">展示本月每日{selectedMetric === 'salesAmount' ? '销售额' : '销量'}波动情况</p>
                  </div>
                  <div className="px-2 py-1 bg-emerald-50 rounded text-[10px] font-bold text-emerald-600">
                    MONTHLY TREND
                  </div>
                </div>
                <div className="h-[160px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData.monthlyTrend}>
                      <defs>
                        <linearGradient id="colorMonthly" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fill: '#94a3b8'}}
                        dy={10}
                        interval={2}
                      />
                      <YAxis 
                        hide 
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number) => [selectedMetric === 'salesAmount' ? `¥${value.toLocaleString()}` : value.toLocaleString(), selectedMetric === 'salesAmount' ? '销售额' : '销量']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorMonthly)" 
                        animationDuration={1500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Unified Dimension Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">维度增长看板</h2>
                  <p className="text-xs text-slate-500 mt-1">按不同维度查看各指标的同比增长情况（展示各维度{selectedMetric === 'salesAmount' ? '销售额' : '销量'}前5名）</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input 
                      type="text"
                      placeholder="全局搜索维度项..."
                      className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-full text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none w-64 transition-all"
                      value={globalSearch}
                      onChange={(e) => setGlobalSearch(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200">
                      <SortableHeader label="维度 / 细分项" sortKey="id" currentSort={tableSortConfig} onSort={handleTableSort} />
                      <SortableHeader label={`上周${selectedMetric === 'salesAmount' ? '销售' : '销量'}`} sortKey="lastWeek" currentSort={tableSortConfig} onSort={handleTableSort} align="right" />
                      <SortableHeader label={`本周${selectedMetric === 'salesAmount' ? '销售' : '销量'}`} sortKey="thisWeek" currentSort={tableSortConfig} onSort={handleTableSort} align="right" />
                      <SortableHeader label="本周同比" sortKey="wow" currentSort={tableSortConfig} onSort={handleTableSort} align="center" />
                      <SortableHeader label="本周利润率" sortKey="weekMargin" currentSort={tableSortConfig} onSort={handleTableSort} align="center" />
                      <SortableHeader label={`上月${selectedMetric === 'salesAmount' ? '销售' : '销量'}`} sortKey="lastMonth" currentSort={tableSortConfig} onSort={handleTableSort} align="right" />
                      <SortableHeader label={`本月${selectedMetric === 'salesAmount' ? '销售' : '销量'}`} sortKey="thisMonth" currentSort={tableSortConfig} onSort={handleTableSort} align="right" />
                      <SortableHeader label="本月同比" sortKey="mom" currentSort={tableSortConfig} onSort={handleTableSort} align="center" />
                      <SortableHeader label="本月利润率" sortKey="monthMargin" currentSort={tableSortConfig} onSort={handleTableSort} align="center" />
                      <SortableHeader label={`25${selectedMetric === 'salesAmount' ? '销售' : '销量'}`} sortKey="lastYear" currentSort={tableSortConfig} onSort={handleTableSort} align="right" />
                      <SortableHeader label={`26${selectedMetric === 'salesAmount' ? '销售' : '销量'}`} sortKey="thisYear" currentSort={tableSortConfig} onSort={handleTableSort} align="right" />
                      <SortableHeader label="今年同比" sortKey="yoy" currentSort={tableSortConfig} onSort={handleTableSort} align="center" />
                      <SortableHeader label="年度利润率" sortKey="yearMargin" currentSort={tableSortConfig} onSort={handleTableSort} align="center" />
                      <SortableHeader label={`累计${selectedMetric === 'salesAmount' ? '销售' : '销量'}`} sortKey="total" currentSort={tableSortConfig} onSort={handleTableSort} align="right" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {dimensionMetrics.length === 0 ? (
                      <tr>
                        <td colSpan={14} className="px-6 py-24 text-center">
                          <div className="flex flex-col items-center gap-4 text-slate-400">
                            <div className="p-4 bg-slate-50 rounded-full">
                              <Filter size={32} className="opacity-30" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-base font-bold text-slate-600">请选择分析维度</p>
                              <p className="text-xs">在上方筛选栏选择一个维度（如：分销商、平台）以查看详细增长数据</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : dimensionMetrics.map((dim) => {
                      const filteredBreakdown = dim.breakdown?.filter(item => 
                        item.id.toLowerCase().includes(globalSearch.toLowerCase())
                      );

                      if (globalSearch && (!filteredBreakdown || filteredBreakdown.length === 0)) return null;

                      return (
                        <React.Fragment key={dim.id}>
                          {/* Dimension Header Row */}
                          <tr className="bg-slate-50/50">
                            <td colSpan={14} className="px-6 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                <span className="font-bold text-slate-900 text-sm">{dim.label} 明细</span>
                              </div>
                            </td>
                          </tr>
                          
                          {/* Breakdown Rows */}
                          {filteredBreakdown?.map((item) => {
                            const isSelected = selectedFilterValue === item.id;
                            return (
                              <tr 
                                key={item.id}
                                onClick={() => setSelectedFilterValue(isSelected ? null : item.id)}
                                className={cn(
                                  "group transition-all cursor-pointer border-b border-slate-50 last:border-0",
                                  isSelected ? "bg-indigo-50/80" : "hover:bg-indigo-50/30"
                                )}
                              >
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    {isSelected && <div className="w-1 h-4 bg-indigo-500 rounded-full" />}
                                    <span className={cn(
                                      "text-sm font-medium transition-colors",
                                      isSelected ? "text-indigo-700 font-bold" : "text-slate-600 group-hover:text-slate-900"
                                    )}>
                                      {item.id}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-2 py-4 text-right text-xs font-medium text-slate-500">
                                  {selectedMetric === 'salesAmount' ? `¥${item.metrics.lastWeek.toLocaleString()}` : item.metrics.lastWeek.toLocaleString()}
                                </td>
                                <td className="px-2 py-4 text-right text-xs font-bold text-slate-900">
                                  {selectedMetric === 'salesAmount' ? `¥${item.metrics.thisWeek.toLocaleString()}` : item.metrics.thisWeek.toLocaleString()}
                                </td>
                                <td className="px-2 py-4 text-center">
                                  <CompactGrowth value={item.metrics.wow} />
                                </td>
                                <td className="px-2 py-4 text-center font-medium text-slate-600">
                                  {item.metrics.weekMargin.toFixed(1)}%
                                </td>
                                <td className="px-2 py-4 text-right text-xs font-medium text-slate-500">
                                  {selectedMetric === 'salesAmount' ? `¥${item.metrics.lastMonth.toLocaleString()}` : item.metrics.lastMonth.toLocaleString()}
                                </td>
                                <td className="px-2 py-4 text-right text-xs font-bold text-slate-900">
                                  {selectedMetric === 'salesAmount' ? `¥${item.metrics.thisMonth.toLocaleString()}` : item.metrics.thisMonth.toLocaleString()}
                                </td>
                                <td className="px-2 py-4 text-center">
                                  <CompactGrowth value={item.metrics.mom} />
                                </td>
                                <td className="px-2 py-4 text-center font-medium text-slate-600">
                                  {item.metrics.monthMargin.toFixed(1)}%
                                </td>
                                <td className="px-2 py-4 text-right text-xs font-medium text-slate-500">
                                  {selectedMetric === 'salesAmount' ? `¥${item.metrics.lastYear.toLocaleString()}` : item.metrics.lastYear.toLocaleString()}
                                </td>
                                <td className="px-2 py-4 text-right text-xs font-bold text-slate-900">
                                  {selectedMetric === 'salesAmount' ? `¥${item.metrics.thisYear.toLocaleString()}` : item.metrics.thisYear.toLocaleString()}
                                </td>
                                <td className="px-2 py-4 text-center">
                                  <CompactGrowth value={item.metrics.yoy} />
                                </td>
                                <td className="px-2 py-4 text-center font-medium text-slate-600">
                                  {item.metrics.yearMargin.toFixed(1)}%
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <span className="text-sm font-bold text-indigo-600">
                                    {selectedMetric === 'salesAmount' ? `¥${item.metrics.total.toLocaleString()}` : item.metrics.total.toLocaleString()}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        ) : activeMenu === '竞品分析' ? (
          <main className="p-8 space-y-6 max-w-[1600px] mx-auto w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-slate-900">竞品分析</h2>
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <span>市场竞争</span>
                  <span>/</span>
                  <span>竞品数据追踪</span>
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">平台</span>
                  <select className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[120px]">
                    <option>全部平台</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <select className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[120px]">
                    <option>全部类目</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <select className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>2025年</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <select className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>01月</option>
                  </select>
                </div>
                <div className="flex items-center gap-1 border border-slate-200 rounded-lg overflow-hidden">
                  <button className="p-1.5 hover:bg-slate-50 text-slate-400 border-r border-slate-200"><ChevronLeft size={16} /></button>
                  <button className="p-1.5 hover:bg-slate-50 text-slate-400"><ChevronRight size={16} /></button>
                </div>
                <button className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors shadow-sm">
                  <Play size={14} fill="currentColor" />
                </button>
                <span className="text-xs text-slate-400">(统计时间: 2025年1月1日-1月31日)</span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
                    <Upload size={14} className="text-slate-400" />
                    <span>上传链接</span>
                  </button>
                  <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
                    <UploadCloud size={14} className="text-slate-400" />
                    <span>上传表格</span>
                  </button>
                  <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
                    <Filter size={14} className="text-slate-400" />
                    <span>筛选竞品</span>
                  </button>
                  <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
                    <MessageSquare size={14} className="text-slate-400" />
                    <span>评论分析</span>
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <button className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors border border-slate-200">
                    <Trash2 size={18} />
                  </button>
                  <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
                    <Download size={14} className="text-slate-400" />
                    <span>导出表格</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs Level 1 */}
            <div className="flex items-center gap-8 border-b border-slate-100 px-2">
              {['热销榜', '热访榜', '热搜榜', '飙升榜', '询盘榜'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setRankingType(tab)}
                  className={cn(
                    "py-4 text-lg font-medium transition-all relative",
                    rankingType === tab 
                      ? "text-blue-600" 
                      : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  {tab}
                  {rankingType === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Tabs Level 2 */}
            <div className="flex items-center gap-8 px-2 py-4">
              <span className="text-xl font-bold text-slate-800">商品排行</span>
              <div className="flex items-center gap-8">
                {['全部商品', '金冠品', '潜力品'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setProductFilter(tab)}
                    className={cn(
                      "py-2 text-lg font-medium transition-all relative",
                      productFilter === tab 
                        ? "text-blue-600" 
                        : "text-slate-500 hover:text-slate-900"
                    )}
                  >
                    {tab}
                    {productFilter === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* List Content */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">{rankingType} - {productFilter}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">排序依据: </span>
                  <span className="text-xs font-bold text-indigo-600">
                    {rankingType === '热销榜' ? '交易指数' : 
                     rankingType === '热访榜' ? '流量指数' :
                     rankingType === '热搜榜' ? '搜索指数' :
                     rankingType === '飙升榜' ? '搜索增长幅度' :
                     rankingType === '询盘榜' ? '有效询盘用户指数' : '综合评分'}
                  </span>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-100">
                      <th className="px-4 py-4 w-10">
                        <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                      </th>
                      <th className="px-4 py-4">商品</th>
                      <th className="px-4 py-4">店铺</th>
                      <SortableHeader label="排名" sortKey="rank" currentSort={sortConfig} onSort={handleSort} align="center" />
                      <SortableHeader label="交易指数" sortKey="transactionIndex" currentSort={sortConfig} onSort={handleSort} align="right" />
                      <SortableHeader label="流量指数" sortKey="trafficIndex" currentSort={sortConfig} onSort={handleSort} align="right" />
                      <SortableHeader label="搜索指数" sortKey="searchIndex" currentSort={sortConfig} onSort={handleSort} align="right" />
                      <SortableHeader label="搜索增长幅度" sortKey="searchGrowth" currentSort={sortConfig} onSort={handleSort} align="center" />
                      <SortableHeader label="有效询盘用户指数" sortKey="effectiveInquiryIndex" currentSort={sortConfig} onSort={handleSort} align="right" />
                      <th className="px-4 py-4">上架时间</th>
                      <SortableHeader label="月成交" sortKey="monthlySales" currentSort={sortConfig} onSort={handleSort} align="right" />
                      <SortableHeader label="月代销" sortKey="monthlyDropshipping" currentSort={sortConfig} onSort={handleSort} align="right" />
                      <SortableHeader label="年成交件数" sortKey="yearlySalesVolume" currentSort={sortConfig} onSort={handleSort} align="right" />
                      <SortableHeader label="年成交笔数" sortKey="yearlyTransactionCount" currentSort={sortConfig} onSort={handleSort} align="right" />
                      <SortableHeader label="评论数" sortKey="reviewCount" currentSort={sortConfig} onSort={handleSort} align="right" />
                      <SortableHeader label="好评率" sortKey="positiveRate" currentSort={sortConfig} onSort={handleSort} align="center" />
                      <SortableHeader label="揽收率" sortKey="collectionRate" currentSort={sortConfig} onSort={handleSort} align="center" />
                      <SortableHeader label="商品复购率" sortKey="repurchaseRate" currentSort={sortConfig} onSort={handleSort} align="center" />
                      <SortableHeader label="加购人数" sortKey="addToCartCount" currentSort={sortConfig} onSort={handleSort} align="right" />
                      <th className="px-4 py-4 text-center relative">
                        <div 
                          className="flex items-center justify-center gap-1 cursor-pointer hover:text-indigo-600 transition-colors"
                          onClick={() => setShowOriginDropdown(!showOriginDropdown)}
                        >
                          <span>发货地</span>
                          <Filter size={12} className={originFilter !== 'all' ? "text-indigo-600" : "text-slate-400"} />
                        </div>
                        {showOriginDropdown && (
                          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-32 bg-white border border-slate-200 rounded-lg shadow-xl z-50 py-1">
                            {provinces.map(p => (
                              <div 
                                key={p}
                                className={cn(
                                  "px-4 py-2 text-sm cursor-pointer hover:bg-slate-50 transition-colors",
                                  originFilter === p || (originFilter === 'all' && p === '全部') ? "text-indigo-600 font-bold bg-indigo-50" : "text-slate-600"
                                )}
                                onClick={() => {
                                  setOriginFilter(p === '全部' ? 'all' : p);
                                  setShowOriginDropdown(false);
                                }}
                              >
                                {p}
                              </div>
                            ))}
                          </div>
                        )}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {processedCompetitiveData
                      .slice(0, 20)
                      .map((product) => (
                        <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-4 py-6">
                            <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                          </td>
                          <td className="px-4 py-6">
                            <div className="flex items-center gap-3">
                              <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-12 h-12 rounded-lg object-cover border border-slate-100"
                                referrerPolicy="no-referrer"
                              />
                              <div className="relative group/name">
                                <p className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors max-w-[160px] truncate leading-relaxed">
                                  {product.name}
                                </p>
                                <div className="absolute bottom-full left-0 mb-2 hidden group-hover/name:block z-[60] w-64 p-2 bg-slate-900 text-white text-xs rounded shadow-xl pointer-events-none">
                                  {product.name}
                                  <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-6">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                                <img src={`https://picsum.photos/seed/${product.storeName}/20/20`} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                              <span className="text-sm text-slate-600 whitespace-nowrap">{product.storeName}</span>
                            </div>
                          </td>
                          <td className="px-4 py-6 text-center">
                            <span className="text-sm font-bold text-slate-900">{product._rank}</span>
                          </td>
                          <td className="px-4 py-6 text-right">
                            <div className="inline-block border-b-2 border-blue-500 pb-0.5">
                              <span className="text-sm font-bold text-slate-900">{product.transactionIndex.toLocaleString()}</span>
                            </div>
                          </td>
                          <td className="px-4 py-6 text-right text-sm text-slate-600">
                            {product.trafficIndex.toLocaleString()}
                          </td>
                          <td className="px-4 py-6 text-right text-sm text-slate-600">
                            {product.searchIndex.toLocaleString()}
                          </td>
                          <td className="px-4 py-6 text-center">
                            <div className={cn(
                              "inline-flex items-center gap-1 font-bold text-xs",
                              product.searchGrowth >= 0 ? "text-emerald-500" : "text-rose-500"
                            )}>
                              {product.searchGrowth >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                              {Math.abs(product.searchGrowth).toFixed(2)}%
                            </div>
                          </td>
                          <td className="px-4 py-6 text-right text-sm text-slate-600 font-medium">
                            {product.effectiveInquiryIndex.toLocaleString()}
                          </td>
                          <td className="px-4 py-6 text-sm text-slate-500 whitespace-nowrap">
                            {product.listingTime}
                          </td>
                          <td className="px-4 py-6 text-right text-sm text-slate-600">
                            {product.monthlySales.toLocaleString()}
                          </td>
                          <td className="px-4 py-6 text-right text-sm text-slate-600">
                            {product.monthlyDropshipping.toLocaleString()}
                          </td>
                          <td className="px-4 py-6 text-right text-sm text-slate-600">
                            {product.yearlySalesVolume.toLocaleString()}
                          </td>
                          <td className="px-4 py-6 text-right text-sm text-slate-600">
                            {product.yearlyTransactionCount.toLocaleString()}
                          </td>
                          <td className="px-4 py-6 text-right text-sm text-slate-600">
                            {product.reviewCount.toLocaleString()}
                          </td>
                          <td className="px-4 py-6 text-center text-sm text-slate-600">
                            {product.positiveRate.toFixed(1)}%
                          </td>
                          <td className="px-4 py-6 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-blue-500 rounded-full" 
                                  style={{ width: `${product.collectionRate}%` }}
                                />
                              </div>
                              <span className="text-xs text-slate-500">{product.collectionRate.toFixed(1)}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-6 text-center text-sm text-slate-600">
                            {product.repurchaseRate.toFixed(1)}%
                          </td>
                          <td className="px-4 py-6 text-right text-sm text-slate-600">
                            {product.addToCartCount.toLocaleString()}
                          </td>
                          <td className="px-4 py-6 text-center text-xs text-slate-500 whitespace-nowrap">
                            {product.origin}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        ) : activeMenu === '战略地图' ? (
          <StrategicMap />
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center space-y-4 max-w-md">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto">
                {React.createElement(menuItems.find(i => i.id === activeMenu)?.icon || LayoutDashboard, { size: 40, className: "text-indigo-600" })}
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{activeMenu}</h2>
              <p className="text-slate-500">该模块正在开发中，敬请期待。目前您可以查看“销售数据分析”模块获取实时业务洞察。</p>
              <button 
                onClick={() => setActiveMenu('销售数据分析')}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors"
              >
                返回销售数据分析
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface DimensionModuleProps {
  key?: string | number;
  title: string;
  selection: string;
  metrics: {
    wow: number;
    mom: number;
    yoy: number;
    total: number;
  };
  breakdown?: {
    id: string;
    metrics: {
      wow: number;
      mom: number;
      yoy: number;
      total: number;
    };
  }[] | null;
  onSelect?: (id: string) => void;
}

function DimensionModule({ title, selection, metrics, breakdown, onSelect }: DimensionModuleProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const filteredBreakdown = useMemo(() => {
    if (!breakdown) return null;
    if (!searchTerm) return breakdown;
    return breakdown.filter(item => 
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [breakdown, searchTerm]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group">
      <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 truncate">{title}</h3>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5 truncate">
            当前: {selection === 'All' ? '全部' : selection}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {breakdown && (
            <button 
              onClick={() => {
                setShowSearch(!showSearch);
                if (showSearch) setSearchTerm('');
              }}
              className={cn(
                "p-1.5 rounded-md transition-colors",
                showSearch ? "bg-indigo-100 text-indigo-600" : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              )}
            >
              <Search size={14} />
            </button>
          )}
          <div className="w-8 h-8 bg-white rounded-lg border border-slate-200 flex items-center justify-center shadow-sm">
            <TrendingUp size={16} className="text-indigo-600" />
          </div>
        </div>
      </div>

      {showSearch && (
        <div className="px-5 py-2 border-b border-slate-50 bg-white">
          <input 
            autoFocus
            type="text"
            placeholder={`搜索${title}...`}
            className="w-full text-xs bg-slate-50 border-none rounded-md px-3 py-1.5 focus:ring-1 focus:ring-indigo-500/30 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}
      
      <div className="p-5 flex-1 flex flex-col">
        {filteredBreakdown ? (
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-slate-50/50 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-2">{title}</th>
                  <th className="px-2 py-2 text-center">WoW</th>
                  <th className="px-2 py-2 text-center">MoM</th>
                  <th className="px-5 py-2 text-center">YoY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredBreakdown.length > 0 ? (
                  filteredBreakdown.map((item) => {
                    const isActive = selection !== 'All' && (
                      selection === item.id || 
                      (title === '代批' && ((selection === 'Yes' && item.id === '代批') || (selection === 'No' && item.id === '非代批'))) ||
                      (title === '新老客户' && ((selection === 'New' && item.id === '新客') || (selection === 'Returning' && item.id === '老客')))
                    );

                    return (
                      <tr 
                        key={item.id} 
                        onClick={() => onSelect?.(item.id)}
                        className={cn(
                          "cursor-pointer transition-colors",
                          isActive ? "bg-indigo-50/50" : "hover:bg-slate-50/50"
                        )}
                      >
                        <td className="px-5 py-2.5 font-bold text-slate-700 truncate max-w-[100px]">
                          <div className="flex items-center gap-2">
                            {isActive && <div className="w-1 h-1 rounded-full bg-indigo-500" />}
                            {item.id}
                          </div>
                        </td>
                        <td className="px-2 py-2.5 text-center">
                          <CompactGrowth value={item.metrics.wow} />
                        </td>
                        <td className="px-2 py-2.5 text-center">
                          <CompactGrowth value={item.metrics.mom} />
                        </td>
                        <td className="px-5 py-2.5 text-center">
                          <CompactGrowth value={item.metrics.yoy} />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-slate-400 italic">未找到匹配项</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-4">
            <GrowthRow label="本周同比 (WoW)" value={metrics.wow} />
            <GrowthRow label="本月同比 (MoM)" value={metrics.mom} />
            <GrowthRow label="今年同比 (YoY)" value={metrics.yoy} />
          </div>
        )}
        
        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">累计销售额</span>
          <span className="text-sm font-bold text-slate-900">¥{metrics.total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

function CompactGrowth({ value }: { value: number }) {
  const isPositive = value >= 0;
  return (
    <div className={cn(
      "inline-flex items-center gap-1 px-2 py-1 rounded-md font-bold text-xs",
      isPositive ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"
    )}>
      {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {isPositive ? '+' : ''}{value.toFixed(1)}%
    </div>
  );
}

function GrowthRow({ label, value }: { label: string, value: number }) {
  const isPositive = value >= 0;
  return (
    <div className="flex items-center justify-between group">
      <span className="text-sm text-slate-600 font-medium">{label}</span>
      <div className={cn(
        "flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all",
        isPositive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
      )}>
        <TrendingUp size={14} className={cn("transition-transform", !isPositive && "rotate-180")} />
        <span className="text-xs font-bold">{isPositive ? '+' : ''}{value.toFixed(1)}%</span>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false, badge }: { icon: React.ReactNode, label: string, active?: boolean, badge?: string }) {
  return (
    <a 
      href="#" 
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 group whitespace-nowrap",
        active 
          ? "bg-indigo-50 text-indigo-600 font-semibold" 
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      )}
    >
      <span className={cn("transition-colors", active ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600")}>
        {icon}
      </span>
      <span className="text-[13px]">{label}</span>
      {badge && (
        <span className={cn(
          "text-[10px] font-bold px-1.5 py-0.5 rounded-md ml-1",
          parseFloat(badge.replace(/[^\d.-]/g, '')) >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
        )}>
          {badge}
        </span>
      )}
    </a>
  );
}

function FilterSelect({ options, value, onChange, className, placeholder }: { options: string[], value: string, onChange: (v: string) => void, className?: string, placeholder?: string }) {
  return (
    <div className={cn("relative", className)}>
      <select 
        className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-xs cursor-pointer font-medium text-slate-700"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {placeholder && <option value="All" disabled>{placeholder}</option>}
        {options.map(opt => (
          <option key={opt} value={opt}>{opt === 'All' ? (placeholder || '全部') : opt}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
    </div>
  );
}

function UnifiedFilter({ options, value, onChange }: { 
  options: { label: string; type: string; values: string[] }[], 
  value: { type: string; value: string; label: string } | null,
  onChange: (v: { type: string; value: string; label: string } | null) => void 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    return options.map(group => ({
      ...group,
      values: group.values.filter(v => 
        v.toLowerCase().includes(search.toLowerCase()) || 
        group.label.toLowerCase().includes(search.toLowerCase())
      )
    })).filter(group => group.values.length > 0);
  }, [options, search]);

  return (
    <div className="relative" ref={containerRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 flex items-center justify-between hover:border-indigo-300 transition-all group"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <Search size={16} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
          {value ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md whitespace-nowrap">
                {value.label}
              </span>
              <span className="text-sm font-medium text-slate-700 truncate">
                {value.value === 'New' ? '新客' : value.value === 'Returning' ? '老客' : value.value}
              </span>
            </div>
          ) : (
            <span className="text-sm text-slate-400">选择筛选项：分销商、店铺、平台、类目...</span>
          )}
        </div>
        <ChevronDown size={16} className={cn("text-slate-400 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-3 border-b border-slate-100 bg-slate-50/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                autoFocus
                type="text"
                placeholder="搜索选项值..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          
          <div className="max-h-[400px] overflow-y-auto p-2">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((group) => (
                <div key={group.type} className="mb-4 last:mb-0">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    {group.label}
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {group.values.map((val) => (
                      <button
                        key={val}
                        onClick={() => {
                          onChange({ type: group.type, value: val, label: group.label });
                          setIsOpen(false);
                          setSearch('');
                        }}
                        className={cn(
                          "text-left px-3 py-2 rounded-lg text-xs font-medium transition-all truncate",
                          value?.type === group.type && value?.value === val
                            ? "bg-indigo-600 text-white"
                            : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                        )}
                      >
                        {val === 'New' ? '新客' : val === 'Returning' ? '老客' : val === 'Yes' ? '代批' : val === 'No' ? '非代批' : val}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 italic text-sm">
                未找到匹配的选项
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SearchFilter({ placeholder, value, onChange, className }: { placeholder: string, value: string, onChange: (v: string) => void, className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <input 
        type="text"
        placeholder={placeholder}
        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 pl-8 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-xs font-medium text-slate-700"
        value={value === 'All' ? '' : value}
        onChange={(e) => onChange(e.target.value || 'All')}
      />
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
    </div>
  );
}

function MetricCard({ title, value, trend, icon }: { title: string, value: string, trend?: 'up' | 'down', icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
          {icon}
        </div>
        {trend && (
          <span className={cn(
            "text-xs font-bold px-2 py-1 rounded-lg",
            trend === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          )}>
            {trend === 'up' ? '↑' : '↓'}
          </span>
        )}
      </div>
      <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
      <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
    </div>
  );
}
