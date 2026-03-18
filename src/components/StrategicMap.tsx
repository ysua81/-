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
  Grid,
  User,
  Clock,
  Search
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
  const [platform, setPlatform] = useState('阿里巴巴');
  const [categoryPath, setCategoryPath] = useState(['玩具', '运动、休闲、传统玩具', '戏水玩具']);
  const rawStrategicData = React.useMemo(() => generateStrategicMapData(categoryPath[categoryPath.length - 1]), [categoryPath]);
  const [sortBy, setSortBy] = useState<'popularity' | 'growth'>('popularity');
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState<number | null>(null);

  const inferAudienceAndScenario = (title: string) => {
    const audience = title.includes('婴儿') || title.includes('宝宝') ? '宝妈/婴幼儿' : 
                    title.includes('成人') ? '成年人' : 
                    title.includes('女士') ? '女性用户' : '大众人群';
    
    const scenario = title.includes('游泳') ? '水上活动/健身' : 
                    title.includes('泡脚') || title.includes('浴桶') ? '居家保健/放松' : 
                    title.includes('滑雪') ? '户外运动/冬季' : '日常使用';
    
    return { audience, scenario };
  };

  const sortedStrategicData = React.useMemo(() => {
    return [...rawStrategicData].map(category => {
      const allItems = [category.topItem, ...category.items];
      const sortedAll = allItems.sort((a, b) => 
        sortBy === 'popularity' ? b.popularity - a.popularity : b.growth - a.growth
      );
      return {
        ...category,
        topItem: sortedAll[0],
        items: sortedAll.slice(1)
      };
    }).sort((a, b) => 
      sortBy === 'popularity' ? b.topItem.popularity - a.topItem.popularity : b.topItem.growth - a.topItem.growth
    );
  }, [rawStrategicData, sortBy]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'matrix' | 'datasource' | 'library'>('matrix');
  const [filterKeyword, setFilterKeyword] = useState<string | null>(null);
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([]);
  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);
  const [lastGeneratedTitle, setLastGeneratedTitle] = useState('');
  const [currentTitle, setCurrentTitle] = useState<string | null>(null);
  const [suggestedTitles, setSuggestedTitles] = useState<string[]>([]);
  const [libraryTitles, setLibraryTitles] = useState([
    { user: '张三', time: '2025-03-15 10:30', title: '2025新款 婴儿游泳池 充气加厚 厂家直销', ...inferAudienceAndScenario('2025新款 婴儿游泳池 充气加厚 厂家直销') },
    { user: '李四', time: '2025-03-15 14:20', title: '爆款推荐：戏水玩具 | 婴儿 | 折叠 质量保证', ...inferAudienceAndScenario('爆款推荐：戏水玩具 | 婴儿 | 折叠 质量保证') },
    { user: '王五', time: '2025-03-16 09:15', title: '高端定制 充气浮排 水上运动 必备单品', ...inferAudienceAndScenario('高端定制 充气浮排 水上运动 必备单品') },
    { user: '张三', time: '2025-03-16 11:05', title: '折叠浴桶 婴儿 泡脚 2025新款 特惠', ...inferAudienceAndScenario('折叠浴桶 婴儿 泡脚 2025新款 特惠') },
  ]);
  const [libraryUserFilter, setLibraryUserFilter] = useState('全部用户');

  const keywordData = React.useMemo(() => generateKeywordData(filterKeyword), [filterKeyword]);

  const calculateSimilarity = (title: string) => {
    if (libraryTitles.length === 0) return 0;
    
    // Simple word-based similarity
    const getWords = (t: string) => t.toLowerCase().split(/[\s|:|：]+/).filter(w => w.length > 0);
    const targetWords = getWords(title);
    
    let maxSim = 0;
    libraryTitles.forEach(lib => {
      const libWords = getWords(lib.title);
      const intersection = targetWords.filter(w => libWords.includes(w));
      const sim = intersection.length / Math.max(targetWords.length, 1);
      if (sim > maxSim) maxSim = sim;
    });
    
    return Math.round(maxSim * 100);
  };

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

  const deleteLibraryTitle = (index: number) => {
    const filtered = libraryTitles.filter(item => libraryUserFilter === '全部用户' || item.user === libraryUserFilter);
    const itemToDelete = filtered[index];
    setLibraryTitles(prev => prev.filter(item => item !== itemToDelete));
    setDeleteConfirmIndex(null);
  };

  const generateTitle = () => {
    if (selectedWords.length === 0) return;
    
    const suffixes = [
      "2025新款 厂家直销",
      "质量保证 爆款推荐",
      "高端定制 限时特惠",
      "官方正品 售后无忧",
      "源头工厂 价格优选",
      "极速发货 品质保障"
    ];

    const prefixes = [
      "【新品】",
      "爆款：",
      "热销：",
      "限时抢购：",
      "新品上市：",
      ""
    ];

    const shuffle = (array: string[]) => [...array].sort(() => Math.random() - 0.5);
    
    // Generate 3 different titles based on selected words with some randomness
    const titles = [
      `${prefixes[Math.floor(Math.random() * prefixes.length)]}${selectedWords.join(' ')} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`,
      `爆款推荐：${shuffle(selectedWords).join(' | ')} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`,
      `${shuffle(selectedWords).join(' ')} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`
    ];
    
    setSuggestedTitles(titles);
    setCurrentTitle(null);
  };

  return (
    <main className="p-8 space-y-6 w-full bg-slate-50/50 min-h-screen">
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
        <button 
          onClick={() => setActiveTab('library')}
          className={cn(
            "flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all",
            activeTab === 'library' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:bg-slate-50"
          )}
        >
          <Database size={16} />
          <span>标题库</span>
        </button>
      </div>

      {activeTab === 'matrix' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
          <div className="p-4 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-indigo-100 rounded flex items-center justify-center">
                <div className="w-2 h-2 bg-indigo-600 rounded-full" />
              </div>
              <h3 className="font-bold text-slate-800">词根分析</h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">排序方式</span>
              <div className="relative">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'popularity' | 'growth')}
                  className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-1 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[100px]"
                >
                  <option value="popularity">搜索人气</option>
                  <option value="growth">同比增长</option>
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <div className="flex min-w-max">
              {sortedStrategicData.map((category, idx) => (
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
                          category.topItem.growth > 0 ? "text-rose-500" : "text-emerald-500"
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
                            item.growth > 0 ? "text-rose-500" : "text-emerald-500"
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
      )}

      {activeTab === 'datasource' && (
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

      {activeTab === 'library' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                <Database size={20} className="text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">标题库</h3>
                <p className="text-xs text-slate-400">查看团队已使用的标题及历史记录</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <select 
                  value={libraryUserFilter}
                  onChange={(e) => setLibraryUserFilter(e.target.value)}
                  className="appearance-none bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-8 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[140px]"
                >
                  <option value="全部用户">全部用户</option>
                  {Array.from(new Set(libraryTitles.map(t => t.user))).map(user => (
                    <option key={user} value={user}>{user}</option>
                  ))}
                </select>
                <User size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">使用者</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">使用时间</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">标题名称</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">人群</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">场景</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {libraryTitles
                  .filter(item => libraryUserFilter === '全部用户' || item.user === libraryUserFilter)
                  .map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-xs font-bold">
                          {item.user[0]}
                        </div>
                        <span className="text-sm font-medium text-slate-700">{item.user}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Clock size={14} />
                        <span className="text-sm font-mono">{item.time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div 
                        onClick={() => {
                          navigator.clipboard.writeText(item.title);
                          // Optional: Show a toast or feedback
                        }}
                        className="text-sm text-slate-700 cursor-pointer hover:text-indigo-600 hover:underline decoration-indigo-300 underline-offset-4 transition-colors relative group/title"
                      >
                        {item.title}
                        <div className="absolute -top-8 left-0 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/title:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                          点击复制标题
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">{(item as any).audience}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">{(item as any).scenario}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setDeleteConfirmIndex(idx)}
                          className="text-rose-500 hover:text-rose-700 text-sm font-medium flex items-center gap-1"
                        >
                          <Trash2 size={14} />
                          <span>删除</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Delete Confirmation Modal */}
          {deleteConfirmIndex !== null && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3 text-rose-600 mb-4">
                  <div className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center">
                    <Trash2 size={20} />
                  </div>
                  <h4 className="text-lg font-bold">确认删除?</h4>
                </div>
                <p className="text-slate-600 text-sm mb-6">
                  您确定要从标题库中删除此标题吗？此操作无法撤销。
                </p>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setDeleteConfirmIndex(null)}
                    className="flex-1 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
                  >
                    取消
                  </button>
                  <button 
                    onClick={() => deleteLibraryTitle(deleteConfirmIndex)}
                    className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200"
                  >
                    确认删除
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Word Combination Bar */}
      <div className="sticky bottom-8 z-50 space-y-4">
        {suggestedTitles.length > 0 && !currentTitle && (
          <div className="bg-white border border-indigo-100 p-4 rounded-2xl shadow-xl animate-in slide-in-from-bottom-4 duration-300 space-y-3 max-w-2xl mx-auto">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
              <div className="flex items-center gap-2 text-indigo-600">
                <Sparkles size={18} />
                <span className="text-sm font-bold">请选择一个生成的标题</span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={generateTitle}
                  className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md transition-colors"
                >
                  <Zap size={14} />
                  <span>重新生成</span>
                </button>
                <button onClick={() => setSuggestedTitles([])} className="text-slate-400 hover:text-slate-600">
                  <X size={16} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {suggestedTitles.map((title, idx) => {
                const similarity = calculateSimilarity(title);
                return (
                  <button 
                    key={idx}
                    onClick={() => {
                      setSuggestedTitles([]);
                      setActiveTab('library');
                      const newTitle = {
                        user: '当前用户',
                        time: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
                        title: title,
                        ...inferAudienceAndScenario(title)
                      };
                      setLibraryTitles(prev => [newTitle, ...prev]);
                    }}
                    className="text-left p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-600">{title}</span>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full transition-all duration-500",
                                similarity > 80 ? "bg-rose-500" : similarity > 50 ? "bg-amber-500" : "bg-emerald-500"
                              )}
                              style={{ width: `${similarity}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-slate-400">库相似度: {similarity}%</span>
                        </div>
                      </div>
                      <Plus size={14} className="text-slate-300 group-hover:text-indigo-400" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

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
