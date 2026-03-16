import React, { useState } from 'react';
import { 
  Filter, 
  Upload, 
  Download, 
  Zap, 
  Lightbulb, 
  Sparkles, 
  Type, 
  Send, 
  Trash2, 
  ChevronDown,
  Plus,
  X,
  TrendingUp,
  TrendingDown,
  Database,
  Grid
} from 'lucide-react';
import { StrategicCategory, KeywordData } from '../types';
import { generateStrategicMapData, generateKeywordData } from '../mockData';

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

const ALIBABA_CATEGORIES = {
  '玩具': {
    '运动、休闲、传统玩具': ['戏水玩具', '婴儿游泳池'],
    '充气玩具': ['其他充气玩具']
  },
  '运动户外': {
    '涉水运动用品': ['漂流船、皮划艇、充气艇', '冲浪、滑水、帆板', '水上充气床、充气浮排'],
    '按摩保健': ['保健护具'],
    '游艺设施': ['淘气堡', '游泳池'],
    '滑雪用品': ['滑雪板', '滑雪圈'],
    '游泳用品': ['游泳圈'],
    '健身器材用品': ['拳击用品']
  },
  '收纳清洁用具': {
    '卫浴整理用具': ['泡脚盆、沐浴桶、折叠浴桶', '婴儿浴盆']
  },
  '家纺家饰': {
    '枕芯类': ['U型枕']
  },
  '家装建材': {
    '休闲、户外家具': ['充气沙发', '充气床']
  },
  '居家日用': {
    '居家日用': ['鞋套、鞋刷、鞋用品', '冰垫']
  },
  '宠物及园艺': {
    '猫/狗美容清洁用品': ['宠物浴池/浴盆']
  }
};

const AMAZON_CATEGORIES = {
  '庭院、草坪与园艺': {
    '泳池、热水浴缸与配件': ['热水浴缸', '游泳池']
  },
  '运动与户外': {
    '体育': ['水上运动', '休闲体育用品', '其他运动', '冬季运动'],
    '户外娱乐': ['露营与徒步', '配件'],
    '配件': ['充气设备配件', '场地、球场和'],
    '运动与健身': ['配件']
  },
  '玩具与游戏': {
    '运动与户外': ['球池和配件', '泳池和水上玩具', '玩具运动'],
    '体育与户外': ['充气式蹦床', '泳池与水上玩具', '弹跳棒与蹦床', '游戏与水上玩具', '充气弹跳器'],
    '运动与健身': ['配件'],
    '派对用品': ['派对用品'],
    '游戏': ['游戏和配件']
  },
  '露台、草坪与园艺': {
    '户外装饰': ['户外节日装饰'],
    '泳池、热水浴缸与配件': ['游泳池', '零件和配件'],
    '露台家具': ['露台座位', '靠垫']
  },
  '宠物用品': {
    '猫': ['床和家具', '喂养和饮水', '猫门、台阶'],
    '狗': ['床和家具', '服装及配饰']
  },
  '家居与厨房': {
    '床上用品': ['充气床垫'],
    '垫料': ['充气床垫']
  },
  '婴儿': {
    '为妈妈们': ['孕妇枕', '枕头和枕套'],
    '活动与娱乐': ['活动与娱乐'],
    '旅行装备': ['旅行床'],
    '婴儿护理': ['洗澡'],
    '安全': ['床栏杆及护栏']
  },
  '办公用品': {
    '办公家具': ['办公家具']
  },
  '美容与个人护理': {
    '工具和配件': ['包袋与箱体']
  },
  '体育与户外': {
    '户外休闲': ['露营与徒步'],
    '体育': ['水上运动', '场地、球场和']
  },
  '婴儿用品': {
    '婴儿护理': ['沐浴'],
    '安全': ['浴室安全']
  },
  '工具与家居': {
    '厨房和浴室': ['浴室设备']
  }
};

export default function StrategicMap() {
  const [strategicData] = useState<StrategicCategory[]>(() => generateStrategicMapData());
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [platform, setPlatform] = useState('阿里巴巴');
  const [categoryPath, setCategoryPath] = useState(['玩具', '运动、休闲、传统玩具', '戏水玩具']);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'matrix' | 'datasource'>('matrix');
  const [filterKeyword, setFilterKeyword] = useState<string | null>(null);
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([]);
  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);
  const [lastGeneratedTitle, setLastGeneratedTitle] = useState('');
  const [currentTitle, setCurrentTitle] = useState<string | null>(null);

  const keywordData = React.useMemo(() => generateKeywordData(filterKeyword), [filterKeyword]);

  const handlePlatformChange = (newPlatform: string) => {
    setPlatform(newPlatform);
    const categories = newPlatform === '阿里巴巴' ? ALIBABA_CATEGORIES : AMAZON_CATEGORIES;
    const l1 = Object.keys(categories)[0];
    const l2 = Object.keys(categories[l1 as keyof typeof categories])[0];
    const l3 = (categories[l1 as keyof typeof categories] as any)[l2][0];
    setCategoryPath([l1, l2, l3]);
  };

  const currentCategories = platform === '阿里巴巴' ? ALIBABA_CATEGORIES : AMAZON_CATEGORIES;

  const handleRootWordSelect = (word: string) => {
    setFilterKeyword(word);
    setActiveTab('datasource');
  };

  const handleKeywordSelect = (keyword: string) => {
    if (selectedWords.includes(keyword)) {
      setSelectedWords(selectedWords.filter(w => w !== keyword));
    } else {
      setSelectedWords([...selectedWords, keyword]);
    }
  };

  const removeWord = (word: string) => {
    setSelectedWords(selectedWords.filter(w => w !== word));
  };

  const generateTitle = () => {
    if (selectedWords.length === 0) return;
    
    // Simple title generation logic: join words with some spacers
    const title = selectedWords.join(' ') + ' 2025新款 厂家直销';
    
    if (generatedTitles.includes(title)) {
      setLastGeneratedTitle(title);
      setShowDuplicateAlert(true);
    } else {
      setGeneratedTitles([...generatedTitles, title]);
      setCurrentTitle(title);
    }
  };

  return (
    <main className="p-8 space-y-6 max-w-[1600px] mx-auto w-full bg-slate-50/50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-900">战略地图</h2>
        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <span>运营规划</span>
          <span>/</span>
          <span>市场需求矩阵</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
            <Filter size={16} className="text-indigo-500" />
            <span className="text-sm font-bold text-slate-700">筛选条件</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">平台</span>
              <div className="relative">
                <select 
                  value={platform}
                  onChange={(e) => handlePlatformChange(e.target.value)}
                  className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[120px]"
                >
                  <option value="阿里巴巴">阿里巴巴</option>
                  <option value="亚马逊">亚马逊</option>
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">类目</span>
              <div className="relative">
                <button 
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[240px] text-left"
                >
                  <span className="truncate">{categoryPath.join(' > ')}</span>
                  <ChevronDown size={14} className="text-slate-400 ml-2 shrink-0" />
                </button>

                {isCategoryOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-[100] flex animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Level 1 */}
                    <div className="w-48 border-r border-slate-100 p-2 max-h-80 overflow-y-auto">
                      {Object.keys(currentCategories).map(l1 => (
                        <button
                          key={l1}
                          onClick={() => setCategoryPath([l1, Object.keys(currentCategories[l1 as keyof typeof currentCategories])[0], (currentCategories[l1 as keyof typeof currentCategories] as any)[Object.keys(currentCategories[l1 as keyof typeof currentCategories])[0]][0]])}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                            categoryPath[0] === l1 ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-50"
                          )}
                        >
                          {l1}
                        </button>
                      ))}
                    </div>
                    {/* Level 2 */}
                    <div className="w-48 border-r border-slate-100 p-2 max-h-80 overflow-y-auto">
                      {Object.keys(currentCategories[categoryPath[0] as keyof typeof currentCategories] || {}).map(l2 => (
                        <button
                          key={l2}
                          onClick={() => setCategoryPath([categoryPath[0], l2, (currentCategories[categoryPath[0] as keyof typeof currentCategories] as any)[l2][0]])}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                            categoryPath[1] === l2 ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-50"
                          )}
                        >
                          {l2}
                        </button>
                      ))}
                    </div>
                    {/* Level 3 */}
                    <div className="w-48 p-2 max-h-80 overflow-y-auto">
                      {((currentCategories[categoryPath[0] as keyof typeof currentCategories] as any)?.[categoryPath[1]] || []).map((l3: string) => (
                        <button
                          key={l3}
                          onClick={() => {
                            setCategoryPath([categoryPath[0], categoryPath[1], l3]);
                            setIsCategoryOpen(false);
                          }}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                            categoryPath[2] === l3 ? "bg-indigo-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-50"
                          )}
                        >
                          {l3}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">时间</span>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <select className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[100px]">
                    <option value="2025">2025年</option>
                    <option value="2024">2024年</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                <div className="relative">
                  <select className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[80px]">
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}月</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 text-slate-600">
            <Upload size={16} />
            <span>上传数据</span>
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-md shadow-indigo-200">
            <Download size={16} />
            <span>导出报表</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab('matrix')}
          className={cn(
            "flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all",
            activeTab === 'matrix' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:bg-slate-50"
          )}
        >
          <Grid size={16} />
          <span>词根分析</span>
        </button>
        <button 
          onClick={() => setActiveTab('datasource')}
          className={cn(
            "flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all",
            activeTab === 'datasource' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:bg-slate-50"
          )}
        >
          <Database size={16} />
          <span>关键词数据源</span>
        </button>
      </div>

      {activeTab === 'matrix' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/30 flex items-center gap-2">
            <div className="w-5 h-5 bg-indigo-100 rounded flex items-center justify-center">
              <div className="w-2 h-2 bg-indigo-600 rounded-full" />
            </div>
            <h3 className="font-bold text-slate-800">词根分析</h3>
          </div>
          
          <div className="overflow-x-auto">
            <div className="flex min-w-max">
              {strategicData.map((category, idx) => (
                <div 
                  key={category.title} 
                  className={cn(
                    "flex-1 min-w-[220px] border-r border-slate-100 last:border-0",
                    idx % 2 === 0 ? "bg-white" : "bg-slate-50/10"
                  )}
                >
                  {/* Category Header (Top Item) */}
                  <div className="border-b border-slate-100">
                    <div className="p-4 bg-slate-50/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-indigo-600">{category.title}</span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">搜索人气 / 同比</span>
                      </div>
                    </div>
                    <div 
                      onClick={() => handleKeywordSelect(category.topItem.name)}
                      onDoubleClick={() => handleRootWordSelect(category.topItem.name)}
                      className="px-4 py-3 flex items-center justify-between hover:bg-indigo-50/50 cursor-pointer transition-colors group select-none"
                    >
                      <span className="text-sm text-slate-600 group-hover:text-indigo-600 transition-colors">{category.topItem.name}</span>
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-slate-500 font-mono">
                          {category.topItem.popularity > 0 ? category.topItem.popularity.toLocaleString() : '-'}
                        </span>
                        <div className={cn(
                          "flex items-center gap-0.5 text-[10px] font-medium",
                          category.topItem.growth > 0 ? "text-emerald-500" : "text-rose-500"
                        )}>
                          {category.topItem.growth > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                          {Math.abs(category.topItem.growth)}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="divide-y divide-slate-50">
                    {category.items.map((item) => (
                      <div 
                        key={item.name}
                        onClick={() => handleKeywordSelect(item.name)}
                        onDoubleClick={() => handleRootWordSelect(item.name)}
                        className="px-4 py-3 flex items-center justify-between hover:bg-indigo-50/50 cursor-pointer transition-colors group select-none"
                      >
                        <span className="text-sm text-slate-600 group-hover:text-indigo-600 transition-colors">{item.name}</span>
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-slate-500 font-mono">
                            {item.popularity > 0 ? item.popularity.toLocaleString() : '-'}
                          </span>
                          <div className={cn(
                            "flex items-center gap-0.5 text-[10px] font-medium",
                            item.growth > 0 ? "text-emerald-500" : "text-rose-500"
                          )}>
                            {item.growth > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                            {Math.abs(item.growth)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="p-4 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-indigo-100 rounded flex items-center justify-center">
                  <Database size={12} className="text-indigo-600" />
                </div>
                <h3 className="font-bold text-slate-800">关键词数据源</h3>
              </div>
              {filterKeyword && (
                <div className="flex items-center gap-2 px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md text-xs font-bold">
                  <span>词根: {filterKeyword}</span>
                  <button onClick={() => setFilterKeyword(null)} className="hover:text-rose-500">
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
            <span className="text-xs text-slate-400">共 {keywordData.filter(item => !filterKeyword || item.keyword.includes(filterKeyword)).length} 条数据</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">排名</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">关键词</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">搜索指数</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">点击率</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">支付转化率</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">支付指数</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">点击指数</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {keywordData
                  .filter(item => !filterKeyword || item.keyword.includes(filterKeyword))
                  .map((item) => (
                  <tr key={item.rank} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => handleKeywordSelect(item.keyword)}>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold",
                        item.rank <= 3 ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : "bg-slate-100 text-slate-500"
                      )}>
                        {item.rank}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{item.keyword}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-slate-600">{item.searchIndex.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-slate-600">{item.clickRate.toFixed(2)}%</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-slate-600">{item.paymentConversion.toFixed(2)}%</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-slate-600">{item.paymentIndex.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-slate-600">{item.clickIndex.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleKeywordSelect(item.keyword);
                        }}
                        className={cn(
                          "p-1.5 rounded-lg transition-all",
                          selectedWords.includes(item.keyword) 
                            ? "bg-indigo-600 text-white" 
                            : "bg-slate-100 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
                        )}
                      >
                        {selectedWords.includes(item.keyword) ? <X size={14} /> : <Plus size={14} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Market Opportunity Discovery */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <Lightbulb size={20} className="text-amber-500" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">市场机会挖掘</h3>
              <p className="text-sm text-slate-500">通过交叉分析人群、使用及其他需求，发现未被满足的市场空白点</p>
            </div>
          </div>
          <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            <Zap size={18} fill="currentColor" />
            <span>AI 挖掘新机会</span>
          </button>
        </div>

        <div className="h-[400px] flex flex-col items-center justify-center text-center space-y-4 bg-slate-50/30 border-t border-slate-50">
          <div className="w-20 h-20 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center">
            <Sparkles size={32} className="text-slate-200" />
          </div>
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-slate-800">准备好发现新机会了吗？</h4>
            <p className="text-sm text-slate-400">点击右上角按钮，让 AI 为您分析市场空白点</p>
          </div>
        </div>
      </div>

      {/* Word Combination Bar */}
      <div className="sticky bottom-8 z-50 space-y-4">
        {currentTitle && (
          <div className="bg-indigo-600 text-white p-4 rounded-2xl shadow-xl animate-in slide-in-from-bottom-4 duration-300 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles size={20} className="text-amber-300" />
              <div>
                <span className="text-xs font-medium text-indigo-100 block">生成标题</span>
                <span className="text-sm font-bold">{currentTitle}</span>
              </div>
            </div>
            <button onClick={() => setCurrentTitle(null)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
              <X size={18} />
            </button>
          </div>
        )}
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-6 flex-1">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-lg text-indigo-600">
              <Type size={18} />
              <span className="text-sm font-bold">词根组合</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span>已选</span>
              <span className="font-bold text-indigo-600">{selectedWords.length}</span>
              <span>个词</span>
            </div>
  
            <div className="flex-1 flex flex-wrap gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100 min-h-[44px] items-center">
              {selectedWords.map(word => (
                <span key={word} className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-indigo-100 rounded-lg text-xs font-medium text-indigo-600 animate-in fade-in zoom-in duration-200">
                  {word}
                  <button onClick={() => removeWord(word)} className="hover:text-rose-500 transition-colors">
                    <X size={12} />
                  </button>
                </span>
              ))}
              {selectedWords.length === 0 && (
                <span className="text-xs text-slate-300 ml-2">点击上方矩阵中的词汇进行组合...</span>
              )}
            </div>
          </div>
  
          <div className="flex items-center gap-3 ml-6">
            <button 
              onClick={() => {
                setSelectedWords([]);
                setCurrentTitle(null);
              }}
              className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              清空选择
            </button>
            <button 
              onClick={generateTitle}
              disabled={selectedWords.length === 0}
              className={cn(
                "px-6 py-2 rounded-xl text-sm font-bold transition-colors",
                selectedWords.length > 0 
                  ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100" 
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              )}
            >
              一键生成标题
            </button>
            <button className="px-6 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-colors flex items-center gap-2">
              <Send size={16} />
              <span>发送至生图空间</span>
            </button>
          </div>
        </div>
      </div>

      {/* Duplicate Alert Modal */}
      {showDuplicateAlert && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <Sparkles size={32} className="text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 text-center mb-2">标题已存在</h3>
            <p className="text-slate-500 text-center mb-6">
              您生成的标题 <span className="font-bold text-slate-800">"{lastGeneratedTitle}"</span> 之前已经生成过了。
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  // Re-generate logic: just add a random suffix for demo
                  const newTitle = lastGeneratedTitle + ' ' + Math.floor(Math.random() * 1000);
                  setGeneratedTitles([...generatedTitles, newTitle]);
                  setShowDuplicateAlert(false);
                  alert(`重新生成成功: ${newTitle}`);
                }}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                重新生成
              </button>
              <button 
                onClick={() => setShowDuplicateAlert(false)}
                className="w-full py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
