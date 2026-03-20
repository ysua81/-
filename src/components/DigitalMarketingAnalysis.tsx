import React, { useState, useRef, useEffect, forwardRef, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { 
  TrendingUp, TrendingDown, MousePointer2, Eye, Target, 
  ShoppingCart, Link as LinkIcon, AlertCircle, DollarSign,
  ChevronDown, Calendar, Store, Megaphone, Filter, Loader2,
  ArrowLeft
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer 
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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

interface LinkData {
  id: string;
  spend: number;
  roi: number;
}

const STORES = ['树外旗舰店', '简酷龙旗舰店', '莱蓓旗舰店'];
const PROMOTIONS = ['全部推广', '货品全站推', '关键词推广', '人群推广', '内容推广'];

// Mock data generator function
const getMockData = (store: string, promotion: string, start: Date | null, end: Date | null) => {
  // Use a seed based on store, promotion and dates to keep it somewhat stable but different
  const seed = `${store}-${promotion}-${start?.getTime()}-${end?.getTime()}`;
  const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const random = (min: number, max: number) => {
    const x = Math.sin(hash) * 10000;
    return min + (x - Math.floor(x)) * (max - min);
  };

  const metrics: MarketingMetric[] = [
    { label: '支出', value: `¥${Math.floor(random(100000, 200000)).toLocaleString()}`, trend: Number(random(-20, 30).toFixed(1)), icon: <DollarSign size={20} />, color: 'text-blue-600' },
    { label: '平均投产 (ROI)', value: random(2.5, 4.5).toFixed(2), trend: Number(random(-10, 15).toFixed(1)), icon: <Target size={20} />, color: 'text-emerald-600' },
    { label: '点击量', value: Math.floor(random(10000, 20000)).toLocaleString(), trend: Number(random(-5, 20).toFixed(1)), icon: <MousePointer2 size={20} />, color: 'text-blue-500' },
    { label: '平均点击率', value: `${random(1.5, 4.5).toFixed(2)}%`, trend: Number(random(-2, 5).toFixed(1)), icon: <Eye size={20} />, color: 'text-orange-500' },
    { label: '转化率', value: `${random(2, 6).toFixed(2)}%`, trend: Number(random(-3, 8).toFixed(1)), icon: <TrendingUp size={20} />, color: 'text-purple-600' },
    { label: '平均点击单价', value: `¥${random(5, 15).toFixed(2)}`, trend: Number(random(-5, 5).toFixed(1)), icon: <TrendingDown size={20} />, color: 'text-rose-500' },
    { label: '购物车', value: Math.floor(random(1000, 3000)).toLocaleString(), trend: Number(random(-10, 25).toFixed(1)), icon: <ShoppingCart size={20} />, color: 'text-cyan-600' },
    { label: '链接总数', value: Math.floor(random(8, 20)).toString(), trend: 0, icon: <LinkIcon size={20} />, color: 'text-amber-600' },
  ];

  const linkData: LinkData[] = Array.from({ length: 11 }).map((_, i) => ({
    id: `L00${i + 1}`,
    spend: Math.floor(random(5000, 25000)),
    roi: Number(random(1.5, 5.0).toFixed(2))
  })).sort((a, b) => b.spend - a.spend);

  return { metrics, linkData };
};

const getTrendData = (linkId: string, start: Date | null, end: Date | null) => {
  if (!start || !end) return [];
  
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const data = [];
  
  for (let i = 0; i < days; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    
    // Deterministic random based on linkId and date
    const seed = `${linkId}-${date.toDateString()}`;
    const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = (min: number, max: number) => {
      const x = Math.sin(hash) * 10000;
      return min + (x - Math.floor(x)) * (max - min);
    };

    data.push({
      date: format(date, 'MM/dd'),
      spend: Math.floor(random(500, 2000)),
      roi: Number(random(1.5, 5.0).toFixed(2)),
      clicks: Math.floor(random(100, 500)),
      ctr: Number(random(1.5, 4.5).toFixed(2)),
      cvr: Number(random(2, 6).toFixed(2)),
      cpc: Number(random(5, 15).toFixed(2)),
      cart: Math.floor(random(50, 150)),
    });
  }
  
  return data;
};

const METRIC_CONFIG = [
  { id: 'spend', label: '支出', color: '#6366f1' },
  { id: 'roi', label: 'ROI', color: '#10b981' },
  { id: 'clicks', label: '点击量', color: '#3b82f6' },
  { id: 'ctr', label: '点击率 (%)', color: '#f59e0b' },
  { id: 'cvr', label: '转化率 (%)', color: '#8b5cf6' },
  { id: 'cpc', label: '点击单价', color: '#f43f5e' },
  { id: 'cart', label: '购物车', color: '#0891b2' },
];

export default function DigitalMarketingAnalysis() {
  const [selectedStore, setSelectedStore] = useState(STORES[0]);
  const [selectedPromotion, setSelectedPromotion] = useState(PROMOTIONS[0]);
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [isPromotionOpen, setIsPromotionOpen] = useState(false);
  
  // Date Picker State
  const [startDate, setStartDate] = useState<Date | null>(new Date(2026, 2, 11));
  const [endDate, setEndDate] = useState<Date | null>(new Date(2026, 2, 18));
  const [activePreset, setActivePreset] = useState('自定义');

  // Data State
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(() => getMockData(STORES[0], PROMOTIONS[0], new Date(2026, 2, 11), new Date(2026, 2, 18)));
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['spend', 'roi']);

  const storeRef = useRef<HTMLDivElement>(null);
  const promotionRef = useRef<HTMLDivElement>(null);

  // Trigger data update when filters change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setData(getMockData(selectedStore, selectedPromotion, startDate, endDate));
      setIsLoading(false);
    }, 600); // Simulate network delay

    return () => clearTimeout(timer);
  }, [selectedStore, selectedPromotion, startDate, endDate]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (storeRef.current && !storeRef.current.contains(event.target as Node)) {
        setIsStoreOpen(false);
      }
      if (promotionRef.current && !promotionRef.current.contains(event.target as Node)) {
        setIsPromotionOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const maxSpend = useMemo(() => Math.max(...data.linkData.map(d => d.spend)), [data.linkData]);
  const maxRoi = 5;

  const trendData = useMemo(() => {
    if (!selectedLinkId) return [];
    return getTrendData(selectedLinkId, startDate, endDate);
  }, [selectedLinkId, startDate, endDate]);

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

  const handleLinkClick = (linkId: string, initialMetric?: string) => {
    setSelectedLinkId(linkId);
    if (initialMetric) {
      setSelectedMetrics([initialMetric]);
    } else {
      setSelectedMetrics(['spend', 'roi']);
    }
  };

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

      {selectedLinkId ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSelectedLinkId(null)}
                className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
              >
                <ArrowLeft size={20} className="text-slate-600" />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">趋势分析 - {selectedLinkId}</h2>
                <p className="text-sm text-slate-500">
                  {startDate ? format(startDate, 'yyyy/MM/dd') : ''} - {endDate ? format(endDate, 'yyyy/MM/dd') : ''}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-wrap gap-2">
              {METRIC_CONFIG.map(m => (
                <button
                  key={m.id}
                  onClick={() => toggleMetric(m.id)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-bold transition-all border",
                    selectedMetrics.includes(m.id)
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                    {m.label}
                  </div>
                </button>
              ))}
              <div className="ml-auto text-[10px] font-bold text-slate-400 uppercase self-center">
                最多选择 4 个指标
              </div>
            </div>

            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      padding: '12px'
                    }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    align="right" 
                    height={36}
                    iconType="circle"
                    formatter={(value) => <span className="text-xs font-bold text-slate-600">{METRIC_CONFIG.find(m => m.id === value)?.label}</span>}
                  />
                  {selectedMetrics.map(metricId => (
                    <Line
                      key={metricId}
                      type="monotone"
                      dataKey={metricId}
                      stroke={METRIC_CONFIG.find(m => m.id === metricId)?.color}
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                      animationDuration={1000}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <>
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

        {/* Promotion Dropdown */}
        <div className="relative" ref={promotionRef}>
          <div 
            onClick={() => setIsPromotionOpen(!isPromotionOpen)}
            className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors min-w-[140px]"
          >
            <Megaphone size={16} className="text-slate-400" />
            <span className="text-sm font-medium text-slate-700">{selectedPromotion}</span>
            <ChevronDown size={14} className={cn("text-slate-400 transition-transform", isPromotionOpen && "rotate-180")} />
          </div>

          {isPromotionOpen && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1 overflow-hidden">
              {PROMOTIONS.map((promo) => (
                <div
                  key={promo}
                  onClick={() => {
                    setSelectedPromotion(promo);
                    setIsPromotionOpen(false);
                  }}
                  className={cn(
                    "px-4 py-2 text-sm cursor-pointer transition-colors",
                    selectedPromotion === promo ? "bg-indigo-600 text-white" : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  {promo}
                </div>
              ))}
            </div>
          )}
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
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {data.metrics.map((metric, idx) => (
          <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50", metric.color)}>
                {metric.icon}
              </div>
              {metric.trend !== 0 && (
                <div className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                  metric.trend > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                )}>
                  {metric.trend > 0 ? '+' : ''}{metric.trend}%
                </div>
              )}
              {metric.trend === 0 && (
                <div className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-50 text-slate-400">
                  稳定
                </div>
              )}
            </div>
            <p className="text-slate-500 text-xs font-medium mb-1">{metric.label}</p>
            <h4 className="text-lg font-bold text-slate-900">{metric.value}</h4>
          </div>
        ))}
      </div>

      {/* Comparison Chart Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-slate-900">花费与投产对比分析</h3>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500" />
                <span className="text-xs font-bold text-slate-500">花费 (SPEND)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-slate-500">投产 (ROI)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="text-xs font-bold text-slate-500">危险预警 (ROI &lt; 3.5)</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-400">按花费金额从高到低排序，点击查看该链接趋势波动</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-[100px_120px_1fr_100px] gap-4 mb-4 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
            <div>链接 ID</div>
            <div>花费金额</div>
            <div className="text-center">对比分析 (花费 VS ROI)</div>
            <div className="text-right">ROI 表现</div>
          </div>

          <div className="space-y-2">
            {data.linkData.map((item, idx) => {
              const isWarning = item.roi < 3.5;
              const spendWidth = (item.spend / maxSpend) * 50;
              const roiWidth = (item.roi / maxRoi) * 50;

              return (
                <div 
                  key={idx} 
                  onClick={() => handleLinkClick(item.id)}
                  className={cn(
                    "grid grid-cols-[100px_120px_1fr_100px] gap-4 items-center p-4 rounded-xl border transition-all cursor-pointer",
                    isWarning 
                      ? "bg-rose-50/30 border-rose-100 hover:bg-rose-50/50" 
                      : "bg-white border-slate-100 hover:bg-slate-50"
                  )}
                >
                  <div className={cn("text-sm font-bold whitespace-nowrap", isWarning ? "text-rose-600" : "text-slate-600")}>
                    {item.id}
                  </div>
                  <div className="text-sm font-bold text-indigo-600 whitespace-nowrap">
                    ¥{item.spend.toLocaleString()}
                  </div>
                  <div className="flex items-center justify-center h-8 bg-slate-50/50 rounded-lg px-2 gap-0.5">
                    <div className="flex-1 flex justify-end">
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLinkClick(item.id, 'spend');
                        }}
                        className="h-4 bg-indigo-500 rounded-l-sm hover:brightness-110 transition-all" 
                        style={{ width: `${spendWidth}%` }}
                      />
                    </div>
                    <div className="w-px h-6 bg-slate-200" />
                    <div className="flex-1 flex justify-start">
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLinkClick(item.id, 'roi');
                        }}
                        className="h-4 bg-emerald-500 rounded-r-sm hover:brightness-110 transition-all" 
                        style={{ width: `${roiWidth}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <span className={cn("text-sm font-bold", isWarning ? "text-rose-600" : "text-emerald-600")}>
                      {item.roi.toFixed(2)}
                    </span>
                    {isWarning && <AlertCircle size={14} className="text-rose-500" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
}
