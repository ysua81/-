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
  X
} from 'lucide-react';
import { StrategicCategory } from '../types';
import { generateStrategicMapData } from '../mockData';

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

export default function StrategicMap() {
  const [strategicData] = useState<StrategicCategory[]>(() => generateStrategicMapData());
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [platform, setPlatform] = useState('阿里巴巴');
  const [categoryPath, setCategoryPath] = useState(['玩具', '运动、休闲、传统玩具', '戏水玩具']);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const handleWordSelect = (word: string) => {
    if (!selectedWords.includes(word)) {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const removeWord = (word: string) => {
    setSelectedWords(selectedWords.filter(w => w !== word));
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
                  onChange={(e) => setPlatform(e.target.value)}
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
              {platform === '阿里巴巴' ? (
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
                        {Object.keys(ALIBABA_CATEGORIES).map(l1 => (
                          <button
                            key={l1}
                            onClick={() => setCategoryPath([l1, Object.keys(ALIBABA_CATEGORIES[l1 as keyof typeof ALIBABA_CATEGORIES])[0], (ALIBABA_CATEGORIES[l1 as keyof typeof ALIBABA_CATEGORIES] as any)[Object.keys(ALIBABA_CATEGORIES[l1 as keyof typeof ALIBABA_CATEGORIES])[0]][0]])}
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
                        {Object.keys(ALIBABA_CATEGORIES[categoryPath[0] as keyof typeof ALIBABA_CATEGORIES] || {}).map(l2 => (
                          <button
                            key={l2}
                            onClick={() => setCategoryPath([categoryPath[0], l2, (ALIBABA_CATEGORIES[categoryPath[0] as keyof typeof ALIBABA_CATEGORIES] as any)[l2][0]])}
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
                        {((ALIBABA_CATEGORIES[categoryPath[0] as keyof typeof ALIBABA_CATEGORIES] as any)?.[categoryPath[1]] || []).map((l3: string) => (
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
              ) : (
                <div className="relative">
                  <select className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[120px]">
                    <option>泳池</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">时间</span>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <select className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[100px]">
                    <option>2025年</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                <div className="relative">
                  <select className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[80px]">
                    <option>1月</option>
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

      {/* Strategic Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/30 flex items-center gap-2">
          <div className="w-5 h-5 bg-indigo-100 rounded flex items-center justify-center">
            <div className="w-2 h-2 bg-indigo-600 rounded-full" />
          </div>
          <h3 className="font-bold text-slate-800">战略矩阵</h3>
        </div>
        
        <div className="overflow-x-auto">
          <div className="flex min-w-max">
            {strategicData.map((category, idx) => (
              <div 
                key={category.title} 
                className={cn(
                  "flex-1 min-w-[200px] border-r border-slate-100 last:border-0",
                  idx % 2 === 0 ? "bg-white" : "bg-slate-50/10"
                )}
              >
                {/* Category Header */}
                <div className="p-4 border-b border-slate-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-indigo-600">{category.title}</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">搜索人气</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">{category.topItem.name}</span>
                    <span className="text-xs text-slate-300 font-mono">
                      {category.topItem.popularity > 0 ? category.topItem.popularity.toLocaleString() : '-'}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="divide-y divide-slate-50">
                  {category.items.map((item) => (
                    <div 
                      key={item.name}
                      onClick={() => handleWordSelect(item.name)}
                      className="px-4 py-3 flex items-center justify-between hover:bg-indigo-50/50 cursor-pointer transition-colors group"
                    >
                      <span className="text-sm text-slate-600 group-hover:text-indigo-600 transition-colors">{item.name}</span>
                      <span className="text-xs text-slate-400 font-mono">
                        {item.popularity > 0 ? item.popularity.toLocaleString() : '-'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-lg flex items-center justify-between sticky bottom-8 z-50">
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
            onClick={() => setSelectedWords([])}
            className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
          >
            清空选择
          </button>
          <button className="px-6 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors">
            一键生成标题
          </button>
          <button className="px-6 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-colors flex items-center gap-2">
            <Send size={16} />
            <span>发送至生图空间</span>
          </button>
        </div>
      </div>
    </main>
  );
}
