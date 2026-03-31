import React, { useState, useRef, useEffect, forwardRef, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { 
  TrendingUp, TrendingDown, MousePointer2, Eye, Target, 
  ShoppingCart, Link as LinkIcon, AlertCircle, DollarSign,
  ChevronDown, ChevronUp, Calendar, Store, Megaphone, Filter, Loader2,
  ArrowLeft, Search, BarChart3
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer 
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  generateMarketingPlanData,
  generateKeywordAnalysisData, 
  generateLinkAnalysisData 
} from '../mockData';
import { 
  MarketingPlanData,
  KeywordAnalysisData, 
  LinkAnalysisData 
} from '../types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MarketingMetric {
  label: string;
  value: string;
  trend: number;
  icon: React.ReactNode;
  color: string;
}

const STORES = [
  '益瑞康',
  '青色',
  '起乾',
  '嘉述',
  '领阅',
  '数途',
  '麦创',
  '氪创'
];
const PROMOTIONS = [
  '大客生意解决方案',
  '首位展示',
  '定位推广',
  '搜索展播',
  '品牌专区',
  '全站推店',
  '全站销货',
  '精准获客',
  '关键词卡位'
];

// Mock data generator function
const getTrendData = (itemId: string, start: Date | null, end: Date | null) => {
  if (!start || !end) return [];
  
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const data = [];
  
  for (let i = 0; i < days; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    
    // Deterministic random based on itemId and date
    const seed = `${itemId}-${date.toDateString()}`;
    const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = (min: number, max: number) => {
      const x = Math.sin(hash) * 10000;
      return min + (x - Math.floor(x)) * (max - min);
    };

    data.push({
      date: format(date, 'MM/dd'),
      spend: Math.floor(random(500, 2000)),
      impressions: Math.floor(random(5000, 20000)),
      clicks: Math.floor(random(100, 500)),
      ctr: Number(random(1.5, 4.5).toFixed(2)),
      cpc: Number(random(5, 15).toFixed(2)),
      inquiries: Math.floor(random(5, 25)),
      inquiryCost: Number(random(50, 150).toFixed(2)),
    });
  }
  
  return data;
};

const METRIC_CONFIG = [
  { id: 'spend', label: '消耗/环比', color: '#6366f1' },
  { id: 'impressions', label: '展现数/环比', color: '#10b981' },
  { id: 'clicks', label: '点击数/环比', color: '#3b82f6' },
  { id: 'ctr', label: '点击率/环比', color: '#f59e0b' },
  { id: 'cpc', label: '平均点击花费/环比', color: '#f43f5e' },
  { id: 'inquiryConversionRate', label: '询盘转化率/环比', color: '#8b5cf6' },
  { id: 'inquiryCost', label: '询盘成本/环比', color: '#0891b2' },
];

export default function DigitalMarketingAnalysis() {
  const [selectedStore, setSelectedStore] = useState(STORES[0]);
  const [selectedPromotion, setSelectedPromotion] = useState(PROMOTIONS[0]);
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  
  // Date Picker State
  const [startDate, setStartDate] = useState<Date | null>(new Date(2026, 2, 11));
  const [endDate, setEndDate] = useState<Date | null>(new Date(2026, 2, 18));
  const [activePreset, setActivePreset] = useState('自定义');

  // Analysis Tabs State
  const [activeTab, setActiveTab] = useState<'marketingPlan' | 'keyword' | 'link'>('marketingPlan');
  const [marketingPlanData, setMarketingPlanData] = useState<MarketingPlanData[]>([]);
  const [keywordAnalysisData, setKeywordAnalysisData] = useState<KeywordAnalysisData[]>([]);
  const [linkAnalysisData, setLinkAnalysisData] = useState<LinkAnalysisData[]>([]);

  // Data State
  const [isLoading, setIsLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  // Trend View State
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedItemName, setSelectedItemName] = useState<string | null>(null);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['spend', 'clicks']);

  const storeRef = useRef<HTMLDivElement>(null);

  // Trigger data update when filters change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setMarketingPlanData(generateMarketingPlanData());
      setKeywordAnalysisData(generateKeywordAnalysisData(15));
      setLinkAnalysisData(generateLinkAnalysisData(12));
      setIsLoading(false);
    }, 600); // Simulate network delay

    return () => clearTimeout(timer);
  }, [selectedStore, selectedPromotion, startDate, endDate]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (storeRef.current && !storeRef.current.contains(event.target as Node)) {
        setIsStoreOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePresetClick = (preset: string) => {
    setActivePreset(preset);
    const today = new Date();
    
    switch (preset) {
      case '昨天':
        const yesterday = subDays(today, 1);
        setStartDate(yesterday);
        setEndDate(yesterday);
        break;
      case '本周':
        setStartDate(startOfWeek(today, { weekStartsOn: 1 }));
        setEndDate(endOfWeek(today, { weekStartsOn: 1 }));
        break;
      case '本月':
        setStartDate(startOfMonth(today));
        setEndDate(endOfMonth(today));
        break;
      default:
        break;
    }
  };

  const summaryMetrics = useMemo(() => {
    const currentData = activeTab === 'marketingPlan' ? marketingPlanData : 
                        activeTab === 'keyword' ? keywordAnalysisData : 
                        linkAnalysisData;
    
    if (!currentData || currentData.length === 0) return [];

    const totals = currentData.reduce((acc, curr) => ({
      spend: acc.spend + curr.spend,
      impressions: acc.impressions + curr.impressions,
      clicks: acc.clicks + curr.clicks,
      inquiries: acc.inquiries + curr.inquiries,
    }), { spend: 0, impressions: 0, clicks: 0, inquiries: 0 });

    const ctr = totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0;
    const cpc = totals.clicks > 0 ? totals.spend / totals.clicks : 0;
    const inquiryCost = totals.inquiries > 0 ? totals.spend / totals.inquiries : 0;
    const inquiryConversionRate = totals.clicks > 0 ? (totals.inquiries / totals.clicks) * 100 : 0;

    // Use a hash of the data to generate stable random trends for mock feel
    const hash = currentData.length + totals.spend;
    const randomTrend = (seed: number) => {
      const x = Math.sin(hash + seed) * 10000;
      return Number((-10 + (x - Math.floor(x)) * 40).toFixed(1));
    };

    return [
      { id: 'spend', label: '消耗/环比', value: `¥${Math.floor(totals.spend).toLocaleString()}`, trend: randomTrend(1), icon: <DollarSign size={20} />, color: 'text-blue-600' },
      { id: 'impressions', label: '展现数/环比', value: totals.impressions.toLocaleString(), trend: randomTrend(2), icon: <Eye size={20} />, color: 'text-indigo-600' },
      { id: 'clicks', label: '点击数/环比', value: totals.clicks.toLocaleString(), trend: randomTrend(3), icon: <MousePointer2 size={20} />, color: 'text-blue-500' },
      { id: 'ctr', label: '点击率/环比', value: `${ctr.toFixed(2)}%`, trend: randomTrend(4), icon: <TrendingUp size={20} />, color: 'text-orange-500' },
      { id: 'cpc', label: '平均点击花费/环比', value: `¥${cpc.toFixed(2)}`, trend: randomTrend(5), icon: <TrendingDown size={20} />, color: 'text-rose-500' },
      { id: 'inquiryConversionRate', label: '询盘转化率/环比', value: `${inquiryConversionRate.toFixed(2)}%`, trend: randomTrend(9), icon: <Target size={20} />, color: 'text-emerald-600' },
      { id: 'inquiryCost', label: '询盘成本/环比', value: `¥${inquiryCost.toFixed(2)}`, trend: randomTrend(10), icon: <DollarSign size={20} />, color: 'text-cyan-600' },
    ];
  }, [activeTab, marketingPlanData, keywordAnalysisData, linkAnalysisData]);

  const trendTitle = useMemo(() => {
    const prefix = activeTab === 'marketingPlan' ? '营销方案' : activeTab === 'keyword' ? '关键词' : '链接';
    return `${prefix}趋势分析`;
  }, [activeTab]);

  const trendData = useMemo(() => {
    if (!selectedItemId) return [];
    return getTrendData(selectedItemId, startDate, endDate);
  }, [selectedItemId, startDate, endDate]);

  const toggleMetric = (metricId: string) => {
    setSelectedMetrics(prev => {
      if (prev.includes(metricId)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter(id => id !== metricId);
      }
      if (prev.length >= 4) return prev; // Max 4
      return [...prev, metricId];
    });
  };

  useEffect(() => {
    setSortConfig(null);
  }, [activeTab]);

  const handleSort = (key: string) => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        if (prev.direction === 'asc') return { key, direction: 'desc' };
        return null;
      }
      return { key, direction: 'asc' };
    });
  };

  const sortedMarketingPlanData = useMemo(() => {
    if (!sortConfig) return marketingPlanData;
    return [...marketingPlanData].sort((a, b) => {
      const aValue = (a as any)[sortConfig.key];
      const bValue = (b as any)[sortConfig.key];
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? bValue - aValue : aValue - bValue;
      }
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
      }
      return 0;
    });
  }, [marketingPlanData, sortConfig]);

  const sortedKeywordAnalysisData = useMemo(() => {
    if (!sortConfig) return keywordAnalysisData;
    return [...keywordAnalysisData].sort((a, b) => {
      const aValue = (a as any)[sortConfig.key];
      const bValue = (b as any)[sortConfig.key];
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? bValue - aValue : aValue - bValue;
      }
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
      }
      return 0;
    });
  }, [keywordAnalysisData, sortConfig]);

  const sortedLinkAnalysisData = useMemo(() => {
    if (!sortConfig) return linkAnalysisData;
    return [...linkAnalysisData].sort((a, b) => {
      const aValue = (a as any)[sortConfig.key];
      const bValue = (b as any)[sortConfig.key];
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? bValue - aValue : aValue - bValue;
      }
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
      }
      return 0;
    });
  }, [linkAnalysisData, sortConfig]);

  const SortableHeader = ({ label, sortKey, className }: { label: string; sortKey: string; className?: string }) => {
    const isActive = sortConfig?.key === sortKey;
    return (
      <th 
        className={cn(
          "px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors group",
          className
        )}
        onClick={() => handleSort(sortKey)}
      >
        <div className="flex items-center gap-1.5">
          <span>{label}</span>
          <div className="flex flex-col -space-y-1">
            <ChevronUp 
              size={10} 
              className={cn(
                isActive && sortConfig.direction === 'asc' ? "text-indigo-600" : "text-slate-300 group-hover:text-slate-400"
              )} 
            />
            <ChevronDown 
              size={10} 
              className={cn(
                isActive && sortConfig.direction === 'desc' ? "text-indigo-600" : "text-slate-300 group-hover:text-slate-400"
              )} 
            />
          </div>
        </div>
      </th>
    );
  };

  const handleItemClick = (id: string, name: string) => {
    setSelectedItemId(id);
    setSelectedItemName(name);
  };

  const TrendIndicator = ({ value }: { value?: number }) => {
    if (value === undefined || value === 0) return null;
    return (
      <div className={cn(
        "flex items-center gap-0.5 text-[10px] font-bold mt-0.5",
        value > 0 ? "text-rose-500" : "text-emerald-500"
      )}>
        {value > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
        <span>{Math.abs(value)}%</span>
      </div>
    );
  };

  // Custom Input for DatePicker
  const CustomDateInput = forwardRef(({ value, onClick }: any, ref: any) => (
    <div 
      onClick={onClick} 
      ref={ref}
      className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-indigo-300 transition-colors"
    >
      <Calendar size={16} className="text-slate-400" />
      <span className="text-xs font-medium text-slate-600">
        {startDate ? format(startDate, 'yyyy/MM/dd') : '开始日期'}
      </span>
      <span className="text-slate-300">/</span>
      <span className="text-xs font-medium text-slate-600">
        {endDate ? format(endDate, 'yyyy/MM/dd') : '结束日期'}
      </span>
    </div>
  ));

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-50/50 backdrop-blur-[1px] z-[100] flex items-center justify-center pointer-events-none">
          <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
            <Loader2 className="animate-spin text-indigo-600" size={24} />
            <span className="text-sm font-bold text-slate-600">正在更新数据...</span>
          </div>
        </div>
      )}

      {/* Header Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 mr-4">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Filter size={18} className="text-indigo-600" />
          </div>
          <span className="text-sm font-bold text-slate-700">筛选条件</span>
        </div>

        {/* Store Dropdown */}
        <div className="relative" ref={storeRef}>
          <div 
            onClick={() => setIsStoreOpen(!isStoreOpen)}
            className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors min-w-[140px]"
          >
            <Store size={16} className="text-slate-400" />
            <span className="text-sm font-medium text-slate-700">{selectedStore}</span>
            <ChevronDown size={14} className={cn("text-slate-400 transition-transform", isStoreOpen && "rotate-180")} />
          </div>
          
          {isStoreOpen && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1 overflow-hidden">
              {STORES.map((store) => (
                <div
                  key={store}
                  onClick={() => {
                    setSelectedStore(store);
                    setIsStoreOpen(false);
                  }}
                  className={cn(
                    "px-4 py-2 text-sm cursor-pointer transition-colors",
                    selectedStore === store ? "bg-indigo-600 text-white" : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  {store}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Analysis Tabs - Moved here */}
        <div className="flex items-center gap-2">
          {/* Marketing Plan Tab */}
          <button
            onClick={() => {
              setActiveTab('marketingPlan');
            }}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border",
              activeTab === 'marketingPlan' 
                ? "bg-indigo-50 text-indigo-600 border-indigo-200 shadow-sm" 
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            )}
          >
            <Megaphone size={16} className={cn(activeTab === 'marketingPlan' ? "text-indigo-600" : "text-slate-400")} />
            <span>营销方案分析</span>
          </button>

          {/* Keyword and Link Tabs */}
          {[
            { id: 'keyword', label: '关键词分析', icon: <Search size={16} /> },
            { id: 'link', label: '链接分析', icon: <LinkIcon size={16} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
              }}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border",
                activeTab === tab.id 
                  ? "bg-indigo-50 text-indigo-600 border-indigo-200 shadow-sm" 
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              )}
            >
              <div className={cn(activeTab === tab.id ? "text-indigo-600" : "text-slate-400")}>
                {tab.icon}
              </div>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex bg-slate-100 p-1 rounded-lg">
          {['昨天', '本周', '本月', '自定义'].map((t) => (
            <button
              key={t}
              onClick={() => handlePresetClick(t)}
              className={cn(
                "px-4 py-1.5 rounded-md text-xs font-bold transition-all",
                activePreset === t ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {activePreset === '自定义' && (
          <div className="relative z-50">
            <DatePicker
              selected={startDate}
              onChange={(dates: [Date | null, Date | null]) => {
                const [start, end] = dates;
                setStartDate(start);
                setEndDate(end);
                if (start && end) {
                  setActivePreset('自定义');
                }
              }}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              customInput={<CustomDateInput />}
              dateFormat="yyyy/MM/dd"
              popperPlacement="bottom-end"
            />
          </div>
        )}
      </div>

      {/* Metrics Grid */}
      {!selectedItemId && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {summaryMetrics.map((metric, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50", metric.color)}>
                  {metric.icon}
                </div>
              </div>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">{metric.label}</p>
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-slate-900 leading-none">{metric.value}</h4>
                {metric.trend !== 0 ? (
                  <div className={cn(
                    "flex items-center gap-1 text-xs font-bold",
                    metric.trend > 0 ? "text-rose-500" : "text-emerald-500"
                  )}>
                    {metric.trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    <span>{Math.abs(metric.trend)}%</span>
                  </div>
                ) : (
                  <div className="text-xs font-bold text-slate-400">稳定</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Analysis Tabs Section / Trend View */}
      {selectedItemId ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSelectedItemId(null)}
                className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  {trendTitle}: <span className="text-indigo-600">{selectedItemName}</span>
                </h2>
                <p className="text-sm text-slate-400 mt-1">点击下方指标切换展示趋势（最多选择4项）</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {METRIC_CONFIG.map((metric) => (
              <button
                key={metric.id}
                onClick={() => toggleMetric(metric.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border",
                  selectedMetrics.includes(metric.id)
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200"
                    : "bg-slate-50 text-slate-500 border-transparent hover:bg-slate-100 hover:text-slate-700"
                )}
              >
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: selectedMetrics.includes(metric.id) ? '#fff' : metric.color }} 
                />
                {metric.label}
                {selectedMetrics.includes(metric.id) && <div className="ml-1 w-3 h-3 flex items-center justify-center">✓</div>}
              </button>
            ))}
          </div>

          <div className="h-[450px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                  }}
                />
                <Legend 
                  verticalAlign="top" 
                  align="right" 
                  iconType="circle"
                  wrapperStyle={{ paddingBottom: '30px' }}
                />
                {selectedMetrics.map((metricId) => {
                  const config = METRIC_CONFIG.find(c => c.id === metricId);
                  return (
                    <Line
                      key={metricId}
                      type="monotone"
                      dataKey={metricId}
                      name={config?.label}
                      stroke={config?.color}
                      strokeWidth={3}
                      dot={{ r: 4, fill: config?.color, strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                      animationDuration={1000}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            {activeTab === 'marketingPlan' && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <SortableHeader label="营销方案" sortKey="planName" />
                    <SortableHeader label="消耗/环比" sortKey="spend" />
                    <SortableHeader label="展现数/环比" sortKey="impressions" />
                    <SortableHeader label="点击数/环比" sortKey="clicks" />
                    <SortableHeader label="点击率/环比" sortKey="ctr" />
                    <SortableHeader label="平均点击花费/环比" sortKey="cpc" />
                    <SortableHeader label="线索量/环比" sortKey="leads" />
                    <SortableHeader label="线索转化率/环比" sortKey="leadConversionRate" />
                    <SortableHeader label="线索成本/环比" sortKey="leadCost" />
                    <SortableHeader label="总询盘量/环比" sortKey="inquiries" />
                    <SortableHeader label="询盘成本/环比" sortKey="inquiryCost" />
                    <SortableHeader label="询盘转化率/环比" sortKey="inquiryConversionRate" />
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">状态评估</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {sortedMarketingPlanData.map((row) => (
                    <tr 
                      key={row.id} 
                      onClick={() => handleItemClick(row.id, row.planName)}
                      className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                    >
                      <td className="px-6 py-4 text-sm font-bold text-slate-700">{row.planName}</td>
                      <td className="px-6 py-4 text-sm font-bold text-indigo-600">
                        <div>¥{row.spend.toLocaleString()}</div>
                        <TrendIndicator value={row.mom?.spend} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div>{row.impressions.toLocaleString()}</div>
                        <TrendIndicator value={row.mom?.impressions} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div>{row.clicks.toLocaleString()}</div>
                        <TrendIndicator value={row.mom?.clicks} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div>{row.ctr}%</div>
                        <TrendIndicator value={row.mom?.ctr} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div>¥{row.cpc}</div>
                        <TrendIndicator value={row.mom?.cpc} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-bold">
                        <div>{row.leads}</div>
                        <TrendIndicator value={row.mom?.leads} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div>{row.leadConversionRate}%</div>
                        <TrendIndicator value={row.mom?.leadConversionRate} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div>¥{row.leadCost}</div>
                        <TrendIndicator value={row.mom?.leadCost} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-bold">
                        <div>{row.inquiries}</div>
                        <TrendIndicator value={row.mom?.inquiries} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div>¥{row.inquiryCost}</div>
                        <TrendIndicator value={row.mom?.inquiryCost} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div>{row.inquiryConversionRate}%</div>
                        <TrendIndicator value={row.mom?.inquiryConversionRate} />
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-bold",
                          row.status === '优秀' ? "bg-emerald-50 text-emerald-600" :
                          row.status === '良好' ? "bg-blue-50 text-blue-600" :
                          row.status === '一般' ? "bg-amber-50 text-amber-600" :
                          "bg-rose-50 text-rose-600"
                        )}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'keyword' && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <SortableHeader label="关键词" sortKey="keyword" />
                    <SortableHeader label="消耗/环比" sortKey="spend" />
                    <SortableHeader label="展现数/环比" sortKey="impressions" />
                    <SortableHeader label="点击数/环比" sortKey="clicks" />
                    <SortableHeader label="点击率/环比" sortKey="ctr" />
                    <SortableHeader label="平均点击花费/环比" sortKey="cpc" />
                    <SortableHeader label="线索量/环比" sortKey="leads" />
                    <SortableHeader label="线索转化率/环比" sortKey="leadConversionRate" />
                    <SortableHeader label="线索成本/环比" sortKey="leadCost" />
                    <SortableHeader label="总询盘量/环比" sortKey="inquiries" />
                    <SortableHeader label="询盘成本/环比" sortKey="inquiryCost" />
                    <SortableHeader label="询盘转化率/环比" sortKey="inquiryConversionRate" />
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">建议操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {sortedKeywordAnalysisData.map((row) => (
                    <tr 
                      key={row.id} 
                      onClick={() => handleItemClick(row.id, row.keyword)}
                      className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                    >
                      <td className="px-6 py-4 text-sm font-bold text-slate-700">{row.keyword}</td>
                      <td className="px-6 py-4 text-sm font-bold text-indigo-600">
                        <div>¥{row.spend.toLocaleString()}</div>
                        <TrendIndicator value={row.mom?.spend} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div>{row.impressions.toLocaleString()}</div>
                        <TrendIndicator value={row.mom?.impressions} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div>{row.clicks.toLocaleString()}</div>
                        <TrendIndicator value={row.mom?.clicks} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div>{row.ctr}%</div>
                        <TrendIndicator value={row.mom?.ctr} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div>¥{row.cpc}</div>
                        <TrendIndicator value={row.mom?.cpc} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-bold">
                        <div>{row.leads}</div>
                        <TrendIndicator value={row.mom?.leads} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div>{row.leadConversionRate}%</div>
                        <TrendIndicator value={row.mom?.leadConversionRate} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div>¥{row.leadCost}</div>
                        <TrendIndicator value={row.mom?.leadCost} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-bold">
                        <div>{row.inquiries}</div>
                        <TrendIndicator value={row.mom?.inquiries} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div>¥{row.inquiryCost}</div>
                        <TrendIndicator value={row.mom?.inquiryCost} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div>{row.inquiryConversionRate}%</div>
                        <TrendIndicator value={row.mom?.inquiryConversionRate} />
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                          {row.action}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'link' && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <SortableHeader label="商品ID" sortKey="productId" />
                    <SortableHeader label="消耗/环比" sortKey="spend" />
                    <SortableHeader label="展现数/环比" sortKey="impressions" />
                    <SortableHeader label="点击数/环比" sortKey="clicks" />
                    <SortableHeader label="点击率/环比" sortKey="ctr" />
                    <SortableHeader label="平均点击花费/环比" sortKey="cpc" />
                    <SortableHeader label="线索量/环比" sortKey="leads" />
                    <SortableHeader label="线索转化率/环比" sortKey="leadConversionRate" />
                    <SortableHeader label="线索成本/环比" sortKey="leadCost" />
                    <SortableHeader label="总询盘量/环比" sortKey="inquiries" />
                    <SortableHeader label="询盘成本/环比" sortKey="inquiryCost" />
                    <SortableHeader label="询盘转化率/环比" sortKey="inquiryConversionRate" />
                    <SortableHeader label="投入产出比/环比" sortKey="roi" />
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">状态评估</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {sortedLinkAnalysisData.map((row) => (
                    <tr 
                      key={row.id} 
                      onClick={() => handleItemClick(row.id, row.productId)}
                      className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                    >
                      <td className="px-6 py-4 text-sm font-bold text-slate-700">{row.productId}</td>
                      <td className="px-6 py-4 text-sm font-bold text-indigo-600">
                        <div>¥{row.spend.toLocaleString()}</div>
                        <TrendIndicator value={row.mom?.spend} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div>{row.impressions.toLocaleString()}</div>
                        <TrendIndicator value={row.mom?.impressions} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div>{row.clicks.toLocaleString()}</div>
                        <TrendIndicator value={row.mom?.clicks} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div>{row.ctr}%</div>
                        <TrendIndicator value={row.mom?.ctr} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div>¥{row.cpc}</div>
                        <TrendIndicator value={row.mom?.cpc} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-bold">
                        <div>{row.leads}</div>
                        <TrendIndicator value={row.mom?.leads} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div>{row.leadConversionRate}%</div>
                        <TrendIndicator value={row.mom?.leadConversionRate} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div>¥{row.leadCost}</div>
                        <TrendIndicator value={row.mom?.leadCost} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-bold">
                        <div>{row.inquiries}</div>
                        <TrendIndicator value={row.mom?.inquiries} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div>¥{row.inquiryCost}</div>
                        <TrendIndicator value={row.mom?.inquiryCost} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div>{row.inquiryConversionRate}%</div>
                        <TrendIndicator value={row.mom?.inquiryConversionRate} />
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-emerald-600">
                        <div>{row.roi}</div>
                        <TrendIndicator value={row.mom?.roi} />
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-bold",
                          row.status === '优秀' ? "bg-emerald-50 text-emerald-600" :
                          row.status === '良好' ? "bg-blue-50 text-blue-600" :
                          row.status === '一般' ? "bg-amber-50 text-amber-600" :
                          "bg-rose-50 text-rose-600"
                        )}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
