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
  Store as StoreIcon, Megaphone, Type, Box, Key, List, Video, PlayCircle, X, Globe
} from 'lucide-react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subWeeks, subMonths, startOfYear, subYears, isWithinInterval, parseISO, eachDayOfInterval, isSameDay, subDays, startOfDay } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { SalesRecord, CompetitiveProduct } from './types';
import { generateMockData, generateCompetitiveData, storeAttributions, POSITIONS_DATA } from './mockData';
import StrategicMap from './components/StrategicMap';
import DigitalMarketingAnalysis from './components/DigitalMarketingAnalysis';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const DISTRIBUTOR_GRADES: Record<string, { label: string, color: string }> = {
  '分销商A': { label: 'S', color: 'bg-rose-500' },
  '分销商B': { label: 'A', color: 'bg-amber-500' },
  '分销商C': { label: 'B', color: 'bg-emerald-500' },
  '分销商D': { label: 'C', color: 'bg-blue-500' },
  '分销商E': { label: 'D', color: 'bg-slate-500' },
};

const GRADE_COLORS: Record<string, string> = {
  'S': 'bg-rose-500',
  'A': 'bg-amber-500',
  'B': 'bg-emerald-500',
  'C': 'bg-blue-500',
  'D': 'bg-slate-500',
};

const SortableHeader = ({ 
  label, 
  sortKey, 
  currentSort, 
  onSort, 
  align = 'left',
  className = ""
}: { 
  label: string; 
  sortKey: string; 
  currentSort: { key: string; direction: 'asc' | 'desc' } | null; 
  onSort: (key: any) => void;
  align?: 'left' | 'right' | 'center';
  className?: string;
}) => {
  const isActive = currentSort?.key === sortKey;
  
  return (
    <th 
      className={cn(
        "p-0 cursor-pointer hover:bg-slate-100/50 transition-colors group select-none", 
        className
      )} 
      onClick={() => onSort(sortKey)}
    >
      <div className={cn(
        "px-4 py-3 flex items-center gap-1 whitespace-nowrap", 
        align === 'right' ? 'justify-end text-right' : align === 'center' ? 'justify-center text-center' : 'justify-start text-left'
      )}>
        {align === 'center' && sortKey !== 'id' && <div className="w-[10px]" />}
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

const CATEGORY_DATA: any = 
    {
    "户外": {
        "U型枕": {
            "25腰靠": [
                "橙柚泡泡",
                "多巴胺粉",
                "气泡葡萄",
                "千岛冰蓝",
                "云朵绵绵"
            ],
            "定制U型枕": [
                "可口可乐"
            ],
            "猫爪颈枕": [
                "不焦绿",
                "橙心意",
                "芒着嗨",
                "紫定行"
            ],
            "毛毛虫": [
                "多巴胺粉",
                "千岛冰蓝",
                "云朵泡泡"
            ],
            "通货U型枕": [
                "春日樱",
                "翡冷翠",
                "皓月灰",
                "季风灰",
                "奶盐灰",
                "青松绿",
                "深黛蓝"
            ],
            "兔型颈枕": [
                "橙柚泡泡",
                "气泡葡萄",
                "云朵绵绵"
            ]
        },
        "趴睡枕": {
            "26趴睡枕": [
                "灰云浮梦",
                "奶芙泡泡"
            ]
        },
        "足球": {
            "充气足球": [
                "燃动黑",
                "飞驰蓝",
                "旺仔家族",
                "心动熊仔"
            ]
        }
    },
    "家居": {
        "板材浴缸": {
            "2025-板材浴缸": [
                "白白云柔",
                "薄绿映荷",
                "黑暗绿波",
                "晶晶蓝泡",
                "秘密花园",
                "茉茉紫云",
                "柔雾茉语",
                "团团熊宝"
            ],
            "24板材浴缸": [
                "彩虹波点",
                "花间粉",
                "流光金"
            ],
            "24板材浴缸-Pro": [
                "流光金Pro"
            ],
            "25儿童板材浴缸": [
                "点点米基",
                "泡泡粉兔",
                "泡泡蓝龙"
            ],
            "25支架浴桶": [
                "花漾时光"
            ]
        },
        "板材浴桶": {
            "23圆形板材浴桶": [
                "极光紫",
                "雪泥蓝"
            ],
            "24大耳朵板材浴桶": [
                "粉海狸",
                "绿恐龙"
            ],
            "24方形浴桶": [
                "凤绣绿",
                "酣睡熊",
                "花漾金",
                "恐龙森林"
            ],
            "24圆形板材浴桶": [
                "潮酷熊",
                "胖达粉",
                "胖达绿",
                "甜心喵",
                "星际蓝"
            ],
            "25板材高深桶": [
                "黄油曲奇",
                "极光紫境",
                "鎏金岁月",
                "蜜桃泡泡",
                "暮暮灰灰",
                "青柠气泡"
            ],
            "25方形浴桶": [
                "花与兔乐园",
                "极地冰川",
                "龙龙郊游记",
                "柠檬欢悦",
                "暖米格调",
                "盐白奶蓝"
            ],
            "25靠背板材": [
                "粉粉云朵",
                "焦糖小熊",
                "沁心绿韵",
                "甜甜橙光",
                "紫梦暮光"
            ],
            "25圆形板材浴桶": [
                "独角兽欢歌",
                "海洋风铃",
                "焦糖小熊",
                "乐乐恐龙",
                "玫瑰星云",
                "绵绵奶黄",
                "抹茶淡巧",
                "日光金芒",
                "兔耳泡泡",
                "团团熊宝",
                "星际之旅",
                "熊猫嗨嗨",
                "元气芒芒",
                "圆圆粉泡",
                "芝士鸭鸭"
            ],
            "25支架浴桶": [
                "春暖花开"
            ],
            "W型浴桶": [
                "霸气龙",
                "甜粉兔",
                "元气龙",
                "月光粉",
                "云雾绿"
            ]
        },
        "充气浴缸": {
            "B款": [
                "骑士蓝",
                "西柚橘"
            ],
            "C款": [
                "外挂充气_粉色",
                "外挂充气_绿色"
            ]
        },
        "定制冰桶": {
            "板材冰浴桶": [
                "黑色"
            ]
        },
        "个清": {
            "个清": [
                "比耶羊",
                "冰透蓝",
                "橄榄绿",
                "灰爪棕",
                "鸡仔黄",
                "伦敦灰",
                "罗马棕",
                "玫果红",
                "魅惑蓝",
                "萌爪粉",
                "轻奢蓝",
                "水晶粉",
                "微醺粉",
                "霞光粉",
                "小绿龙",
                "炫彩粉",
                "夜影棕"
            ]
        },
        "泡脚桶": {
            "24成人泡脚桶": [
                "丹霞橙",
                "烟雨青"
            ],
            "24儿童泡脚桶": [
                "芭比兔",
                "小角龙"
            ],
            "24方形泡脚桶": [
                "星空粉",
                "雪松绿"
            ],
            "24手提泡脚桶": [
                "白桃粉",
                "蓝莓粉"
            ],
            "25大耳朵泡脚桶": [
                "芭乐柠檬",
                "蓝调格韵",
                "雪球汪汪"
            ],
            "25带盖泡脚桶": [
                "繁花似锦",
                "恋恋花期",
                "流光溢金",
                "满园芳华",
                "一帘幽梦"
            ],
            "25泡脚桶": [
                "金色黎明",
                "流光溢金",
                "满园芳华",
                "抹茶相思",
                "紫藤生花"
            ],
            "2护膝5泡脚桶": [
                "繁花似锦",
                "金色黎明",
                "恋恋花期",
                "流光溢金",
                "抹茶相思",
                "一帘幽梦",
                "折叠泡脚桶",
                "紫藤生花"
            ],
            "水盆": [
                "水盆"
            ],
            "水桶": [
                "水桶"
            ],
            "透明泡脚桶": [
                "卡哇兔",
                "考拉棕",
                "萌狐橙",
                "胖嘟龙"
            ],
            "折叠泡脚桶": [
                "折叠泡脚桶"
            ]
        },
        "桑拿一体机": {
            "桑拿": [
                "轻松绿",
                "舒适粉",
                "自在紫"
            ]
        },
        "塑料浴缸": {
            "塑料浴缸": [
                "奥汀绿",
                "硅谷蓝",
                "暖壶绿",
                "青湖蓝",
                "深泉蓝",
                "藤萝紫",
                "甜莓粉",
                "温泉蓝",
                "香槟粉",
                "星河蓝",
                "雪融白",
                "樱花粉",
                "柚金橘",
                "元气桃"
            ]
        },
        "塑料圆形浴桶": {
            "一秒加热": [
                "纽约风",
                "暖焰橙",
                "青椰绿",
                "藻泥绿"
            ],
            "一秒速开": [
                "北海道",
                "北海道条纹蓝",
                "苍兰紫",
                "大肚紫",
                "独角兽粉",
                "花田粉",
                "活力蓝",
                "极光",
                "绿憨憨鱼",
                "摩登咖",
                "纽约风",
                "普鲁蓝",
                "青椰绿",
                "轻奢粉",
                "球球战",
                "现代灰",
                "樱草黄",
                "悠游粉",
                "原野绿",
                "藻泥绿",
                "逐梦蓝"
            ]
        },
        "雨鞋": {
            "雨鞋": [
                "星际漫游"
            ]
        },
        "折叠伸缩浴缸": {
            "折叠伸缩": [
                "比克绿",
                "尼莫黄",
                "皮洛粉"
            ]
        }
    },
    "圈类": {
        "脖圈": {
            "24脖圈": [
                "抱莓熊",
                "春日青",
                "呆萌兽",
                "叮叮蓝",
                "粉莓熊",
                "欢乐玩伴",
                "活力龙",
                "可可橙",
                "恐龙乐园",
                "泡泡紫",
                "小恐龙",
                "欣欣绿"
            ],
            "25脖圈": [
                "憨头熊",
                "恐龙一家",
                "青青奶龙",
                "甜美兔",
                "小纵队",
                "星朵熊宝"
            ]
        },
        "冲浪板": {
            "25冲浪板": [
                "花汐蓝",
                "迷彩蓝",
                "远航绿"
            ],
            "26冲浪板": [
                "活力橙浪",
                "梦幻马卡龙",
                "青氧抹茶",
                "晴空奶黄"
            ]
        },
        "浮力衣": {
            "24浮力衣": [
                "酷米紫",
                "草莓红",
                "大眼蛙",
                "呆萌龙",
                "欢乐熊",
                "萌龙绿",
                "甜莓兔"
            ]
        },
        "浮排": {
            "25通货浮排": [
                "薄荷蓝绿",
                "冰沁蓝",
                "橙白竖纹",
                "番茄红",
                "粉白竖纹",
                "粉白斜条",
                "粉火烈鸟",
                "粉漾波纹",
                "粉叶悠影",
                "粉紫星闪",
                "复古黄紫",
                "海滨蓝绿",
                "海蓝假日",
                "红波点蝴蝶结",
                "黄白斜条",
                "活力橙",
                "简约蓝白",
                "蓝白晴空",
                "蓝白竖纹",
                "蓝悠波纹",
                "亮玫粉",
                "绿白斜条",
                "绿野仙踪",
                "冒泡橙橙",
                "美人鱼",
                "墨黑条纹",
                "柠檬黄",
                "暖阳橙白",
                "拼色黄紫",
                "深海蓝白",
                "水果菠萝",
                "桃粉条纹",
                "特调蓝海",
                "夏日西瓜",
                "阳光蜜橙",
                "湛蓝波纹",
                "霸气鲨鱼",
                "草绿条纹",
                "草莓布丁",
                "橙彩条纹",
                "粉甜双纹",
                "海军蓝",
                "海盐冰椰",
                "活力橙白",
                "橘子果酱",
                "蓝白条",
                "蓝白斜条",
                "蓝莓奶昔",
                "蓝叶浮波",
                "芒果慕斯",
                "蜜恋时光",
                "抹茶奶盖",
                "奶油草莓",
                "柠黄条纹",
                "清凉海岛",
                "热带菠萝",
                "日光暖黄",
                "糖心西瓜",
                "香水青柠",
                "银耀星河"
            ],
            "26浮排": [
                "冰川琉璃",
                "冰河世纪",
                "波波橙浪",
                "彩虹云朵",
                "蒂芙尼蓝",
                "多肉葡萄",
                "果冻蛙蛙",
                "莓果甜甜",
                "青提奶绿",
                "盐盐夏日",
                "云云蓝波",
                "治愈奶汪"
            ]
        },
        "趴圈": {
            "24趴圈": [
                "果冻蓝",
                "航天熊",
                "绿宝龙",
                "孟特蓝",
                "星海紫",
                "元气熊"
            ],
            "25趴圈": [
                "春山兔语",
                "咔萌巴拉",
                "闪星绿龙"
            ]
        },
        "手臂圈": {
            "24手臂圈": [
                "宝格绿",
                "呆萌粉",
                "萌龙绿",
                "莫奈蓝",
                "软糖熊",
                "田园花语",
                "小神龙",
                "元气蓝",
                "智慧兔"
            ]
        },
        "手机防水袋": {
            "25手机防水袋": [
                "芝士芒芒",
                "紫葡泡泡"
            ]
        },
        "躺圈": {
            "25躺圈": [
                "多巴胺星兔",
                "恐龙寻踪",
                "蜜罐小熊"
            ]
        },
        "通货跟屁虫": {
            "25通货跟屁虫": [
                "跟屁虫浮囊橘色"
            ]
        },
        "腋下圈": {
            "23腋下圈": [
                "莱茵蓝",
                "奶油蓝"
            ],
            "24腋下圈": [
                "粉莓熊",
                "恐龙绿",
                "莱茵蓝",
                "蓝鲸灵",
                "绿翼龙",
                "泡泡紫",
                "紫米兔"
            ],
            "25背带腋下圈": [
                "绿翼龙",
                "莓果熊",
                "魔法独角兽",
                "绮丽梦境"
            ],
            "25免充气腋下圈": [
                "熊猫团团"
            ],
            "25腋下圈-脖圈衍生类": [
                "布丁熊",
                "胖达雪球",
                "寻梦独角兽"
            ]
        },
        "婴儿滚筒": {
            "25滚筒": [
                "哈笑龙",
                "治愈独角兽"
            ]
        },
        "泳镜": {
            "24泳镜": [
                "泳镜"
            ]
        },
        "泳帽": {
            "24泳帽": [
                "24泳帽"
            ],
            "25泳帽": [
                "蛋黄鸭",
                "飞飞兔",
                "绿趣龙"
            ]
        },
        "游泳圈": {
            "24泳圈": [
                "豹富粉",
                "贝丁绿",
                "冰凝白",
                "啵啵兔",
                "晨雾蓝",
                "初桃粉",
                "迪卡黄",
                "盖文兰",
                "花明色",
                "幻彩色",
                "恐龙世界",
                "梦幻紫",
                "森格灰",
                "维尼橙",
                "西米紫",
                "星空之约",
                "逐光蓝"
            ],
            "蛋蛋圈": [
                "朝气绿",
                "公主粉",
                "海天蓝",
                "莫奈花园",
                "清水蓝",
                "甜蜜暴击"
            ],
            "花漾圈": [
                "浮光落日",
                "海蓝椰椰",
                "奶油兔",
                "葡萄奶冻",
                "甜甜圈",
                "小萌宠"
            ],
            "水滴圈": [
                "芭乐粉",
                "冰莓粉",
                "布鲁蓝",
                "初荷绿",
                "海盐蓝",
                "曼波绿"
            ],
            "水晶圈": [
                "薄荷绿",
                "冰爽蓝"
            ],
            "特价圈": [
                "海盐冰淇淋"
            ]
        },
        "雨鞋": {
            "25雨鞋": [
                "波点恐龙",
                "萌龙甜趣",
                "奶白萌喵",
                "星际漫游"
            ]
        },
        "自学宝": {
            "25自学宝": [
                "马卡蓝",
                "水波绿",
                "雪白粉"
            ]
        },
        "座圈": {
            "24座圈": [
                "粉莓熊",
                "乖乖粉",
                "海盐柠檬",
                "活力龙",
                "皮皮粉",
                "亲亲橙",
                "淘淘紫",
                "甜酷米",
                "盈盈绿",
                "悠悠蓝",
                "正义超人"
            ],
            "25座圈": [
                "萌龙挖挖乐",
                "萌态小龙",
                "皮皮粉",
                "奇趣动物园",
                "鸭鸭星球"
            ]
        }
    },
    "玩具": {
        "U型枕": {
            "25腰靠": [
                "橙柚泡泡",
                "气泡葡萄",
                "云朵绵绵"
            ],
            "25植绒款颈枕": [
                "蓝糖啵啵",
                "绵绵芝士",
                "青柠啵啵",
                "西西里灰",
                "元气桃桃"
            ],
            "脚凳": [
                "千岛冰蓝"
            ],
            "猫爪颈枕": [
                "不焦绿",
                "橙心意",
                "紫定行"
            ],
            "毛毛虫": [
                "多巴胺粉",
                "千岛冰蓝"
            ],
            "通货U型枕": [
                "宝石蓝",
                "绿松石",
                "暮云灰"
            ],
            "兔型颈枕": [
                "橙柚泡泡",
                "气泡葡萄",
                "云朵绵绵"
            ]
        },
        "不倒翁": {
            "25充气不倒翁": [
                "萌萌小兔",
                "糯米雪糍",
                "胖嘟小熊",
                "企鹅冰冰",
                "熊猫胖胖",
                "薄荷波波",
                "香芋奶昔"
            ],
            "26充气不倒翁": [
                "薄荷波波",
                "星光独角兽",
                "雪雪白云"
            ]
        },
        "滑雪圈": {
            "滑雪圈": [
                "蓝蓝雪白",
                "牵引绳",
                "甜甜粉心",
                "云朵奶熊"
            ]
        },
        "拍拍垫": {
            "25拍拍垫": [
                "海洋乐园",
                "蓝色青蛙",
                "蓝色鲨鱼",
                "蜜罐熊",
                "软萌龙",
                "深海灰鲸",
                "深海奇遇",
                "蛙蛙派对",
                "戏水海豚",
                "星星兔",
                "阳光海滩",
                "元气恐龙"
            ],
            "拍拍垫": [
                "蓝色青蛙"
            ]
        },
        "球池": {
            "球池": [
                "卢比黄",
                "亚当绿",
                "黄色小纵队",
                "绿野探险",
                "米尔蓝"
            ]
        },
        "拳击柱": {
            "24拳击柱": [
                "粉莓慕斯",
                "幻影武士",
                "雪海蓝冰",
                "竞技蓝",
                "炫彩粉"
            ],
            "25拳击柱": [
                "捣蛋小龙",
                "幻影武士",
                "恐龙崽崽",
                "栗栗棕熊",
                "企鹅圆圆"
            ]
        },
        "水画布": {
            "25水画布": [
                "萌幻宝驹",
                "萌宠乐园"
            ]
        },
        "学座椅": {
            "25学座椅": [
                "粉嫩熊宝",
                "啾啾小鸡仔",
                "美美粉兔",
                "悠悠绿龙"
            ],
            "免充学座椅": [
                "星芒小马",
                "紫鹿萌萌"
            ]
        },
        "足球": {
            "充气足球": [
                "嘟嘟恐龙",
                "莓莓甜兔",
                "旺仔家族"
            ]
        }
    },
    "浴盆": {
        "婴儿浴盆": {
            "24年板材浴盆": [
                "涂鸦绿",
                "郁香白"
            ],
            "25年板材浴盆": [
                "点点云朵",
                "恐龙乖乖",
                "绿豆薄荷",
                "奶熊呼呼",
                "暖暖粉兔"
            ],
            "26年板材浴盆": [
                "嘟嘟奶蓝",
                "极简生活",
                "恐龙乖乖",
                "糯糯奶圆"
            ],
            "充气浴盆": [
                "可可兔浴盆",
                "甜兔奶咖",
                "熊熊果绿"
            ],
            "塑料浴盆": [
                "爱马橙",
                "史迪蓝",
                "星戴粉"
            ]
        }
    },
    "运动户外": {
        "U型枕": {
            "脚凳": [
                "多巴胺粉"
            ]
        },
        "车载床": {
            "23车载床": [
                "松石绿"
            ]
        },
        "充气床": {
            "22充气床": [
                "森顶绿",
                "星夜蓝",
                "寻山棕"
            ],
            "24充气床": [
                "森氧绿"
            ],
            "清仓款": [
                "露营灰",
                "苍松绿",
                "漫野绿",
                "美拉奇",
                "莫迪棕",
                "纳多灰",
                "轻奢蓝",
                "天空蓝",
                "雅士灰",
                "云眠棕"
            ]
        },
        "充气水池": {
            "25闪充水池": [
                "冰川秘境",
                "冰川秘境配件",
                "冰川秘境遮阳",
                "恐龙漫游",
                "蓝梦奇缘",
                "龙崽绿",
                "龙崽绿配件",
                "龙崽绿遮阳"
            ],
            "充气水池": [
                "风信紫",
                "海岛绿",
                "空谷蓝",
                "量子灰",
                "洛樱粉",
                "迈阿密蓝",
                "脉动蓝",
                "摩洛蓝",
                "莫莱灰",
                "青芥绿",
                "山梨黄",
                "水黛蓝",
                "小怪兽",
                "小纵队",
                "雨林绿",
                "元气橙",
                "竹青绿",
                "逐浪紫",
                "恐龙漫游",
                "蓝橙",
                "蓝海童梦",
                "云蓝"
            ],
            "带棚水池": [
                "带棚滑梯",
                "黄色滑梯",
                "秒冲带棚粉",
                "秒冲带棚蓝",
                "秒冲带棚绿",
                "摩卡黄",
                "牛油果绿色",
                "星冰绿"
            ],
            "普通水池": [
                "蓝白",
                "印花"
            ],
            "四层方": [
                "嘟嘟鱼绿色",
                "风铃绿",
                "藕荷粉",
                "深海蓝",
                "油画蓝"
            ]
        },
        "高铁床": {
            "25高铁床": [
                "星船酣睡"
            ]
        },
        "夹网水池": {
            "蝶形夹网水池": [
                "冰雪时光",
                "沙朗灰"
            ],
            "夹网椭圆水池": [
                "冰湖苍云"
            ],
            "夹网支架水池": [
                "克莱因海",
                "镰仓灰"
            ]
        },
        "免充气水池": {
            "23免充水池": [
                "冰岛蓝",
                "冰河蓝",
                "代夫蓝",
                "菲林绿",
                "格尔灰",
                "天竺蓝"
            ]
        },
        "皮划艇": {
            "充气皮划艇": [
                "健跃号",
                "前橙似锦",
                "银河灰",
                "勇士蓝"
            ],
            "夹网皮划艇": [
                "迅鲨灰"
            ]
        },
        "球池": {
            "25免充圆形水池": [
                "粉兔莓莓",
                "绿野萌龙"
            ]
        }
    }
}
export default function App() {
  const [activeMenu, setActiveMenu] = useState('销售数据分析');
  const [data, setData] = useState<SalesRecord[]>(() => generateMockData(1000));
  const [competitiveData] = useState<CompetitiveProduct[]>(() => generateCompetitiveData(100));
  const [rankingType, setRankingType] = useState('热销榜');
  const [productFilter, setProductFilter] = useState('全部商品');
  const [sortConfig, setSortConfig] = useState<{ key: keyof CompetitiveProduct | 'rank'; direction: 'asc' | 'desc' } | null>(null);
  const [originFilter, setOriginFilter] = useState<string | 'all'>('all');
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [tableSortConfig, setTableSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [isCategoryFilterOpen, setIsCategoryFilterOpen] = useState(false);
  const [isPositionFilterOpen, setIsPositionFilterOpen] = useState(false);
  const [categoryFilterPath, setCategoryFilterPath] = useState<string[]>([]);
  const [positionFilterPath, setPositionFilterPath] = useState<string[]>([]);
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState<'昨天' | '上周' | '本周' | '上月' | '本月' | '自定义'>('昨天');
  const [customDateRange, setCustomDateRange] = useState<{ start: string; end: string }>({
    start: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
    end: format(subDays(new Date(), 1), 'yyyy-MM-dd')
  });
  const [isManagementOpen, setIsManagementOpen] = useState(false);
  const [stores, setStores] = useState<string[]>(storeAttributions);
  const [positions, setPositions] = useState<Record<string, string[]>>(POSITIONS_DATA);
  const [categories, setCategories] = useState<any>(CATEGORY_DATA);
  const [platforms, setPlatforms] = useState<string[]>(['跨境', '国内', '拼多多', '抖音', '淘宝', '京东', '阿里', '散户', '线下', '唯品会', '私域', '快手', '有赞微商城', '微信视频', '小红书', '得物']);
  const [distributors, setDistributors] = useState<string[]>(['分销商A', '分销商B', '分销商C', '分销商D', '分销商E']);

  // Management Modal Local States
  const [mgmtStoreName, setMgmtStoreName] = useState('');
  const [mgmtPlatformName, setMgmtPlatformName] = useState('');
  const [mgmtDistributorName, setMgmtDistributorName] = useState('');
  const [mgmtL1, setMgmtL1] = useState('');
  const [mgmtL2, setMgmtL2] = useState('');
  const [mgmtL3, setMgmtL3] = useState('');
  const [mgmtL4, setMgmtL4] = useState('');
  const [newL1, setNewL1] = useState('');
  const [newL2, setNewL2] = useState('');
  const [newL3, setNewL3] = useState('');
  const [mgmtPositionType, setMgmtPositionType] = useState('');
  const [mgmtPersonnelName, setMgmtPersonnelName] = useState('');
  const [mgmtCategorySearch, setMgmtCategorySearch] = useState('');

  // Confirmation Dialog Helper
  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

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

  const [selectedDimensionId, setSelectedDimensionId] = useState('storeName');
  const [selectedFilterValue, setSelectedFilterValue] = useState<string | null>(null);
  const [dashboardDimensionId, setDashboardDimensionId] = useState('all');
  const [dashboardFilterValue, setDashboardFilterValue] = useState<string | null>(null);
  const [dashboardSearchQuery, setDashboardSearchQuery] = useState('');
  const [isDashboardFilterOpen, setIsDashboardFilterOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<'salesAmount' | 'salesVolume'>('salesAmount');
  const [selectedYear, setSelectedYear] = useState<number | 'all'>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');

  const filterDimensions = [
    { id: 'storeName', label: '店铺' },
    { id: 'category', label: '类目' },
    { id: 'position', label: '岗位' },
  ];

  const dashboardDimensions = [
    { id: 'all', label: '全部' },
    { id: 'platform', label: '客户销售渠道' },
    { id: 'customerType', label: '新老客' },
    { id: 'isWholesale', label: '销售类型' },
    { id: 'distributorId', label: '分销商' },
    { id: 'grade', label: '等级' },
  ];

  const dashboardHierarchy = [
    {
      id: 'all',
      label: '全部',
      children: []
    },
    {
      id: 'platform',
      label: '客户销售渠道',
      searchable: true,
      children: ['跨境', '国内', '拼多多', '抖音', '淘宝', '京东', '阿里', '散户', '线下', '唯品会', '私域', '快手', '有赞微商城', '微信视频', '小红书', '得物']
    },
    {
      id: 'customerType',
      label: '新老客',
      children: ['新客', '老客']
    },
    {
      id: 'isWholesale',
      label: '销售类型',
      children: ['代发', '批发', '散户', '定制']
    },
    {
      id: 'distributorId',
      label: '分销商',
      searchable: true,
      children: distributors
    },
    {
      id: 'grade',
      label: '等级',
      children: ['S', 'A', 'B', 'C', 'D']
    }
  ];

  const dimensions = [...filterDimensions, ...dashboardDimensions];

  // Reset filter value when dimension changes
  useEffect(() => {
    if (selectedDimensionId === 'storeName') {
      setSelectedFilterValue('全部店铺');
    } else {
      setSelectedFilterValue(null);
    }
  }, [selectedDimensionId]);

  const filteredData = useMemo(() => {
    let result = data;

    // Time Range Filter
    const now = new Date();
    let start: Date;
    let end: Date = now;

    if (timeRange === '昨天') {
      start = subDays(now, 1);
      start.setHours(0, 0, 0, 0);
      end = subDays(now, 1);
      end.setHours(23, 59, 59, 999);
    } else if (timeRange === '本周') {
      start = startOfWeek(now);
    } else if (timeRange === '上周') {
      start = startOfWeek(subWeeks(now, 1));
      end = endOfWeek(subWeeks(now, 1));
    } else if (timeRange === '本月') {
      start = startOfMonth(now);
    } else if (timeRange === '上月') {
      start = startOfMonth(subMonths(now, 1));
      end = endOfMonth(subMonths(now, 1));
    } else {
      start = parseISO(customDateRange.start);
      end = parseISO(customDateRange.end);
    }

    result = result.filter(d => isWithinInterval(parseISO(d.date), { start, end }));

    if (!selectedFilterValue || selectedFilterValue === '全部店铺') return result;
    
    return result.filter(d => {
      if (selectedDimensionId === 'position') {
        const [type, name] = selectedFilterValue.split(' > ');
        if (!name) return d.businessOwner === type || d.salesperson === type;
        if (type === '业务') return d.businessOwner === name;
        if (type === '销售') return d.salesperson === name;
        return true;
      }
      if (selectedDimensionId === 'category') {
        const path = selectedFilterValue.split(' > ');
        if (path.length === 1) return d.categoryL1 === path[0];
        if (path.length === 2) return d.categoryL1 === path[0] && d.categoryL2 === path[1];
        if (path.length === 3) return d.categoryL1 === path[0] && d.categoryL2 === path[1] && d.categoryL3 === path[2];
        if (path.length === 4) return d.categoryL1 === path[0] && d.categoryL2 === path[1] && d.categoryL3 === path[2] && d.categoryL4 === path[3];
        return true;
      }
      if (['distributorId'].includes(selectedDimensionId)) {
        return String((d as any)[selectedDimensionId]).toLowerCase().includes(selectedFilterValue.toLowerCase());
      }
      return String((d as any)[selectedDimensionId]) === selectedFilterValue;
    });
  }, [data, selectedDimensionId, selectedFilterValue, selectedYear, selectedMonth, timeRange, customDateRange]);

  const availableValues = useMemo(() => {
    if (!selectedDimensionId) return [];
    if (selectedDimensionId === 'storeName') return ['全部店铺', ...[...stores].sort()];
    if (selectedDimensionId === 'position') {
      return Object.entries(positions).flatMap(([type, names]: [string, any]) => names.map((name: string) => `${type} > ${name}`)).sort();
    }
    if (selectedDimensionId === 'category') {
      return Object.entries(categories).flatMap(([l1, l2s]: [string, any]) => 
        Object.entries(l2s).flatMap(([l2, l3s]: [string, any]) => 
          Object.entries(l3s).flatMap(([l3, l4s]: [string, any]) => 
            l4s.map((l4: string) => `${l1} > ${l2} > ${l3} > ${l4}`)
          )
        )
      ).sort();
    }
    const vals = data.map(d => {
      if (selectedDimensionId === 'isWholesale') return d.isWholesale;
      if (selectedDimensionId === 'customerType') return d.customerType === 'New' ? '新客' : '老客';
      if (selectedDimensionId === 'platform') return d.platform;
      if (selectedDimensionId === 'distributorId') return d.distributorId;
      return String((d as any)[selectedDimensionId]);
    });
    return [...new Set(vals)].sort().reverse();
  }, [data, selectedDimensionId, stores, positions, categories]);

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
      const today = startOfDay(now);
      const yesterday = subDays(today, 1);
      const dayBeforeYesterday = subDays(today, 2);
      const lastYearToday = subYears(today, 1);
      const lastYearYesterday = subYears(yesterday, 1);

      const thisWeekStart = startOfWeek(now);
      const lastWeekStart = subWeeks(thisWeekStart, 1);
      const lastYearThisWeekStart = subYears(thisWeekStart, 1);

      const thisMonthStart = startOfMonth(now);
      const lastMonthStart = subMonths(thisMonthStart, 1);
      const lastYearThisMonthStart = subYears(thisMonthStart, 1);

      const getDetailedMetrics = (start: Date, end: Date) => {
        const filtered = subset.filter(d => isWithinInterval(parseISO(d.date), { start, end }));
        const salesAmount = filtered.reduce((sum, d) => sum + d.salesAmount, 0);
        const salesVolume = filtered.reduce((sum, d) => sum + d.salesVolume, 0);
        const costAmount = filtered.reduce((sum, d) => sum + d.costAmount, 0);
        const margin = salesAmount === 0 ? 0 : ((salesAmount - costAmount) / salesAmount) * 100;
        return { salesAmount, salesVolume, margin };
      };

      let current, previous, lastYear;

      if (timeRange === '昨天') {
        current = getDetailedMetrics(yesterday, today);
        previous = getDetailedMetrics(dayBeforeYesterday, yesterday);
        lastYear = getDetailedMetrics(lastYearYesterday, lastYearToday);
      } else if (timeRange === '本周') {
        current = getDetailedMetrics(thisWeekStart, now);
        previous = getDetailedMetrics(lastWeekStart, thisWeekStart);
        lastYear = getDetailedMetrics(lastYearThisWeekStart, subYears(now, 1));
      } else if (timeRange === '本月') {
        current = getDetailedMetrics(thisMonthStart, now);
        previous = getDetailedMetrics(lastMonthStart, thisMonthStart);
        lastYear = getDetailedMetrics(lastYearThisMonthStart, subYears(now, 1));
      } else {
        // Default to last 30 days vs previous 30 days
        current = getDetailedMetrics(subDays(now, 30), now);
        previous = getDetailedMetrics(subDays(now, 60), subDays(now, 30));
        lastYear = getDetailedMetrics(subYears(subDays(now, 30), 1), subYears(now, 1));
      }

      const calcGrowth = (curr: number, prev: number) => prev === 0 ? 0 : ((curr - prev) / prev) * 100;

      return {
        salesAmount: current.salesAmount,
        salesAmountYoY: calcGrowth(current.salesAmount, lastYear.salesAmount),
        salesAmountYoYDiff: current.salesAmount - lastYear.salesAmount,
        salesAmountWoW: calcGrowth(current.salesAmount, previous.salesAmount),
        salesAmountWoWDiff: current.salesAmount - previous.salesAmount,
        salesVolume: current.salesVolume,
        salesVolumeYoY: calcGrowth(current.salesVolume, lastYear.salesVolume),
        salesVolumeYoYDiff: current.salesVolume - lastYear.salesVolume,
        salesVolumeWoW: calcGrowth(current.salesVolume, previous.salesVolume),
        salesVolumeWoWDiff: current.salesVolume - previous.salesVolume,
        margin: current.margin,
        // Compatibility keys
        yoy: calcGrowth(current[selectedMetric === 'salesAmount' ? 'salesAmount' : 'salesVolume'], lastYear[selectedMetric === 'salesAmount' ? 'salesAmount' : 'salesVolume']),
        wow: calcGrowth(current[selectedMetric === 'salesAmount' ? 'salesAmount' : 'salesVolume'], previous[selectedMetric === 'salesAmount' ? 'salesAmount' : 'salesVolume']),
        total: subset.reduce((sum, d) => sum + d[selectedMetric], 0),
      };
    };

    return dimensions
      .filter(d => d.id === dashboardDimensionId)
      .map(dim => {
        let subset = filteredData;
        const selection = dashboardFilterValue || '全部';

        if (dashboardFilterValue) {
          subset = subset.filter(d => {
            if (dim.id === 'customerType') {
              const val = d.customerType === 'New' ? '新客' : '老客';
              return val === dashboardFilterValue;
            }
            if (dim.id === 'grade') {
              const grade = DISTRIBUTOR_GRADES[d.distributorId]?.label || 'D';
              return grade === dashboardFilterValue;
            }
            return String((d as any)[dim.id]) === dashboardFilterValue;
          });
        }

        // Calculate breakdown for the selected dimension
        const hierarchy = dashboardHierarchy.find(h => h.id === dim.id);
        const allKeys = hierarchy ? hierarchy.children : [];
        
        const groups: Record<string, SalesRecord[]> = {};
        
        // Initialize groups with all possible keys to ensure they appear in the table even with 0 data
        // If a specific value is filtered, we only show that one
        if (dim.id === 'all') {
          if (selectedDimensionId === 'category' || selectedDimensionId === 'position') {
            // Dynamic breakdown for category/position when in 'All' tab
          } else {
            const key = selectedFilterValue || '全部';
            groups[key] = [];
          }
        } else if (dashboardFilterValue) {
          groups[dashboardFilterValue] = [];
        } else {
          allKeys.forEach(key => {
            groups[key] = [];
          });
        }

        subset.forEach(d => {
          let key = '';
          if (dim.id === 'all') {
            if (selectedDimensionId === 'category') {
              const path = selectedFilterValue ? selectedFilterValue.split(' > ') : [];
              let val = '';
              if (path.length === 0) val = d.categoryL1;
              else if (path.length === 1) val = d.categoryL2;
              else if (path.length === 2) val = d.categoryL3;
              else val = d.categoryL4;
              key = selectedFilterValue ? `${selectedFilterValue} > ${val}` : val;
            } else if (selectedDimensionId === 'position') {
              const path = selectedFilterValue ? selectedFilterValue.split(' > ') : [];
              if (path.length === 0) {
                key = d.businessOwner ? '业务' : '销售';
              } else if (path.length === 1) {
                const type = path[0];
                const val = type === '业务' ? d.businessOwner : d.salesperson;
                key = `${selectedFilterValue} > ${val}`;
              } else {
                key = selectedFilterValue;
              }
            } else {
              key = selectedFilterValue || '全部';
            }
          } else if (dim.id === 'isWholesale') {
            key = d.isWholesale;
          } else if (dim.id === 'customerType') {
            key = d.customerType === 'New' ? '新客' : '老客';
          } else if (dim.id === 'platform') {
            key = d.platform;
          } else if (dim.id === 'distributorId') {
            key = d.distributorId;
          } else if (dim.id === 'grade') {
            key = DISTRIBUTOR_GRADES[d.distributorId]?.label || 'D';
          } else {
            key = String((d as any)[dim.id]);
          }
          
          if (groups[key]) {
            groups[key].push(d);
          } else if ((!dashboardFilterValue || dim.id === 'all') && key) {
            // Catch-all for values not in hierarchy if no filter is active
            groups[key] = [d];
          }
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
  }, [filteredData, dashboardDimensionId, dashboardFilterValue, selectedMetric, tableSortConfig, selectedDimensionId, selectedFilterValue]);

  const processedCompetitiveData = useMemo(() => {
    let result = competitiveData;

    if (productFilter !== '全部商品') {
      result = result.filter(d => d.platformType === productFilter);
    }

    if (originFilter !== 'all') {
      result = result.filter(d => d.origin === originFilter);
    }

    const sortedData = [...result].sort((a, b) => {
      if (!sortConfig) return 0;
      const { key, direction } = sortConfig;
      let valA: any = a[key as keyof CompetitiveProduct];
      let valB: any = b[key as keyof CompetitiveProduct];

      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    const rankedData = sortedData.map((d, i) => ({
      ...d,
      rank: i + 1
    }));

    if (rankingType === 'top10') {
      return rankedData.slice(0, 10);
    } else if (rankingType === 'top50') {
      return rankedData.slice(0, 50);
    }

    return rankedData;
  }, [competitiveData, productFilter, originFilter, sortConfig, rankingType]);

  const handleSort = (key: keyof CompetitiveProduct | 'rank') => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const handleTableSort = (key: string) => {
    setTableSortConfig(prev => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'desc' };
    });
  };

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
          <main className="p-8 space-y-8 w-full">
            {/* Single Dimension Selector Bar */}
            <section className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="flex items-center gap-3 shrink-0">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Filter size={18} className="text-indigo-600" />
                </div>
                <span className="text-sm font-bold text-slate-700">维度筛选</span>
              </div>

              <div className="flex items-center gap-3 flex-1 flex-wrap">
                <div className="flex bg-slate-100 p-1 rounded-xl shrink-0">
                  {(['昨天', '本周', '本月', '自定义'] as const).map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={cn(
                        "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                        timeRange === range 
                          ? "bg-white text-indigo-600 shadow-sm" 
                          : "text-slate-500 hover:text-slate-700"
                      )}
                    >
                      {range}
                    </button>
                  ))}
                </div>

                {timeRange === '自定义' && (
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 shrink-0">
                    <input 
                      type="date" 
                      value={customDateRange.start}
                      onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                      className="bg-transparent text-[10px] font-medium text-slate-700 outline-none w-24"
                    />
                    <span className="text-slate-400 text-[10px]">至</span>
                    <input 
                      type="date" 
                      value={customDateRange.end}
                      onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                      className="bg-transparent text-[10px] font-medium text-slate-700 outline-none w-24"
                    />
                  </div>
                )}

                <div className="h-8 w-px bg-slate-200 mx-1" />

                <div className="w-32">
                  <select 
                    value={selectedDimensionId}
                    onChange={(e) => setSelectedDimensionId(e.target.value)}
                    className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all cursor-pointer ${!selectedDimensionId ? 'text-slate-400' : 'text-slate-700'}`}
                  >
                    <option value="" disabled>请选择筛选项</option>
                    {filterDimensions.map(dim => (
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
                  ) : selectedDimensionId === 'category' ? (
                    <div className="relative">
                      <button 
                        onClick={() => {
                          setIsCategoryFilterOpen(!isCategoryFilterOpen);
                          setIsPositionFilterOpen(false);
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all flex items-center justify-between"
                      >
                        <span className="truncate">{selectedFilterValue || '全部类目'}</span>
                        <ChevronDown size={14} className="text-slate-400" />
                      </button>

                      {isCategoryFilterOpen && (
                        <div className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-[100] flex flex-col min-w-[600px] animate-in fade-in slide-in-from-top-2 duration-200">
                          <div className="p-3 border-b border-slate-100">
                            <div className="relative">
                              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                              <input 
                                type="text"
                                placeholder="搜索四级类目..."
                                value={categorySearchQuery}
                                onChange={(e) => setCategorySearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                              />
                            </div>
                          </div>
                          
                          {categorySearchQuery ? (
                            <div className="max-h-64 overflow-y-auto p-2">
                              {Object.entries(categories).flatMap(([l1, l2s]: any) => {
                                const results = [];
                                if (l1.includes(categorySearchQuery)) results.push({ path: l1, label: l1 });
                                Object.entries(l2s).forEach(([l2, l3s]: any) => {
                                  if (l2.includes(categorySearchQuery)) results.push({ path: `${l1} > ${l2}`, label: l2 });
                                  Object.entries(l3s).forEach(([l3, l4s]: any) => {
                                    if (l3.includes(categorySearchQuery)) results.push({ path: `${l1} > ${l2} > ${l3}`, label: l3 });
                                    l4s.forEach((l4: string) => {
                                      if (l4.includes(categorySearchQuery)) results.push({ path: `${l1} > ${l2} > ${l3} > ${l4}`, label: l4 });
                                    });
                                  });
                                });
                                return results;
                              }).map((item) => (
                                <button
                                  key={item.path}
                                  onClick={() => {
                                    setSelectedFilterValue(item.path);
                                    setIsCategoryFilterOpen(false);
                                    setCategorySearchQuery('');
                                  }}
                                  className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                >
                                  {item.path}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="flex h-80">
                              {/* L1 */}
                              <div className="w-1/4 border-r border-slate-100 p-2 overflow-y-auto">
                                <button
                                  onClick={() => {
                                    setSelectedFilterValue(null);
                                    setCategoryFilterPath([]);
                                    setIsCategoryFilterOpen(false);
                                  }}
                                  className={cn(
                                    "w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                                    !selectedFilterValue ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-50"
                                  )}
                                >
                                  全部类目
                                </button>
                                {Object.keys(categories).map(l1 => (
                                  <button
                                    key={l1}
                                    onClick={() => {
                                      setCategoryFilterPath([l1]);
                                    }}
                                    onDoubleClick={() => {
                                      setCategoryFilterPath([l1]);
                                      setSelectedFilterValue(l1);
                                      setIsCategoryFilterOpen(false);
                                    }}
                                    className={cn(
                                      "w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                                      categoryFilterPath[0] === l1 ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-50"
                                    )}
                                  >
                                    {l1}
                                  </button>
                                ))}
                              </div>
                              {/* L2 */}
                              <div className="w-1/4 border-r border-slate-100 p-2 overflow-y-auto">
                                <button
                                  onClick={() => {
                                    const val = categoryFilterPath[0] || null;
                                    setSelectedFilterValue(val);
                                    setCategoryFilterPath(categoryFilterPath[0] ? [categoryFilterPath[0]] : []);
                                    setIsCategoryFilterOpen(false);
                                  }}
                                  className={cn(
                                    "w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                                    selectedFilterValue === (categoryFilterPath[0] || null) ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-50"
                                  )}
                                >
                                  全部类目
                                </button>
                                {categoryFilterPath[0] && Object.keys(categories[categoryFilterPath[0]]).map(l2 => (
                                  <button
                                    key={l2}
                                    onClick={() => {
                                      setCategoryFilterPath([categoryFilterPath[0], l2]);
                                    }}
                                    onDoubleClick={() => {
                                      setCategoryFilterPath([categoryFilterPath[0], l2]);
                                      setSelectedFilterValue(`${categoryFilterPath[0]} > ${l2}`);
                                      setIsCategoryFilterOpen(false);
                                    }}
                                    className={cn(
                                      "w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                                      categoryFilterPath[1] === l2 ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-50"
                                    )}
                                  >
                                    {l2}
                                  </button>
                                ))}
                              </div>
                              {/* L3 */}
                              <div className="w-1/4 border-r border-slate-100 p-2 overflow-y-auto">
                                <button
                                  onClick={() => {
                                    const path = categoryFilterPath[1] 
                                      ? `${categoryFilterPath[0]} > ${categoryFilterPath[1]}`
                                      : (categoryFilterPath[0] || null);
                                    setSelectedFilterValue(path);
                                    setCategoryFilterPath(categoryFilterPath[1] ? [categoryFilterPath[0], categoryFilterPath[1]] : (categoryFilterPath[0] ? [categoryFilterPath[0]] : []));
                                    setIsCategoryFilterOpen(false);
                                  }}
                                  className={cn(
                                    "w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                                    selectedFilterValue === (categoryFilterPath[1] ? `${categoryFilterPath[0]} > ${categoryFilterPath[1]}` : (categoryFilterPath[0] || null)) ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-50"
                                  )}
                                >
                                  全部类目
                                </button>
                                {categoryFilterPath[1] && Object.keys(categories[categoryFilterPath[0]][categoryFilterPath[1]]).map(l3 => (
                                  <button
                                    key={l3}
                                    onClick={() => {
                                      setCategoryFilterPath([categoryFilterPath[0], categoryFilterPath[1], l3]);
                                    }}
                                    onDoubleClick={() => {
                                      setCategoryFilterPath([categoryFilterPath[0], categoryFilterPath[1], l3]);
                                      setSelectedFilterValue(`${categoryFilterPath[0]} > ${categoryFilterPath[1]} > ${l3}`);
                                      setIsCategoryFilterOpen(false);
                                    }}
                                    className={cn(
                                      "w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                                      categoryFilterPath[2] === l3 ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-50"
                                    )}
                                  >
                                    {l3}
                                  </button>
                                ))}
                              </div>
                              {/* L4 */}
                              <div className="w-1/4 p-2 overflow-y-auto">
                                <button
                                  onClick={() => {
                                    const path = categoryFilterPath[2]
                                      ? `${categoryFilterPath[0]} > ${categoryFilterPath[1]} > ${categoryFilterPath[2]}`
                                      : (categoryFilterPath[1] 
                                          ? `${categoryFilterPath[0]} > ${categoryFilterPath[1]}` 
                                          : (categoryFilterPath[0] || null));
                                    setSelectedFilterValue(path);
                                    setCategoryFilterPath(categoryFilterPath[2] ? [categoryFilterPath[0], categoryFilterPath[1], categoryFilterPath[2]] : (categoryFilterPath[1] ? [categoryFilterPath[0], categoryFilterPath[1]] : (categoryFilterPath[0] ? [categoryFilterPath[0]] : [])));
                                    setIsCategoryFilterOpen(false);
                                  }}
                                  className={cn(
                                    "w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                                    selectedFilterValue === (categoryFilterPath[2] ? `${categoryFilterPath[0]} > ${categoryFilterPath[1]} > ${categoryFilterPath[2]}` : (categoryFilterPath[1] ? `${categoryFilterPath[0]} > ${categoryFilterPath[1]}` : (categoryFilterPath[0] || null))) ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-50"
                                  )}
                                >
                                  全部类目
                                </button>
                                {categoryFilterPath[2] && (categories[categoryFilterPath[0]][categoryFilterPath[1]][categoryFilterPath[2]] as string[]).map(l4 => (
                                  <button
                                    key={l4}
                                    onClick={() => {
                                      setSelectedFilterValue(`${categoryFilterPath[0]} > ${categoryFilterPath[1]} > ${categoryFilterPath[2]} > ${l4}`);
                                      setIsCategoryFilterOpen(false);
                                    }}
                                    className={cn(
                                      "w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                                      selectedFilterValue?.includes(l4) ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-50"
                                    )}
                                  >
                                    {l4}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : selectedDimensionId === 'position' ? (
                    <div className="relative">
                      <button 
                        onClick={() => {
                          setIsPositionFilterOpen(!isPositionFilterOpen);
                          setIsCategoryFilterOpen(false);
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all flex items-center justify-between"
                      >
                        <span className="truncate">{selectedFilterValue || '全部岗位'}</span>
                        <ChevronDown size={14} className="text-slate-400" />
                      </button>

                      {isPositionFilterOpen && (
                        <div className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-[100] flex flex-col min-w-[300px] animate-in fade-in slide-in-from-top-2 duration-200">
                          <div className="flex h-64">
                              {/* Type */}
                              <div className="w-1/2 border-r border-slate-100 p-2 overflow-y-auto">
                                <button
                                  onClick={() => {
                                    setSelectedFilterValue(null);
                                    setIsPositionFilterOpen(false);
                                  }}
                                  className={cn(
                                    "w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                                    !selectedFilterValue ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-50"
                                  )}
                                >
                                  全部岗位
                                </button>
                                {Object.keys(positions).map(type => (
                                  <button
                                    key={type}
                                    onClick={() => {
                                      setPositionFilterPath([type]);
                                    }}
                                    onDoubleClick={() => {
                                      setPositionFilterPath([type]);
                                      setSelectedFilterValue(type);
                                      setIsPositionFilterOpen(false);
                                    }}
                                    className={cn(
                                      "w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                                      positionFilterPath[0] === type ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-50"
                                    )}
                                  >
                                    {type}
                                  </button>
                                ))}
                              </div>
                            {/* Name */}
                            <div className="w-1/2 p-2 overflow-y-auto">
                              <button
                                onClick={() => {
                                  setSelectedFilterValue(positionFilterPath[0] || null);
                                  setIsPositionFilterOpen(false);
                                }}
                                className={cn(
                                  "w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                                  selectedFilterValue === (positionFilterPath[0] || null) ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-50"
                                )}
                              >
                                全部岗位
                              </button>
                              {positionFilterPath[0] && (positions as any)[positionFilterPath[0]].map((name: string) => (
                                <button
                                  key={name}
                                  onClick={() => {
                                    setSelectedFilterValue(`${positionFilterPath[0]} > ${name}`);
                                    setIsPositionFilterOpen(false);
                                  }}
                                  className={cn(
                                    "w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                                    selectedFilterValue === `${positionFilterPath[0]} > ${name}` ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-50"
                                  )}
                                >
                                  {name}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative">
                      <button 
                        onClick={() => {
                          setIsPositionFilterOpen(!isPositionFilterOpen);
                          setIsCategoryFilterOpen(false);
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all flex items-center justify-between"
                      >
                        <span className="truncate">{selectedFilterValue || `选择${dimensions.find(d => d.id === selectedDimensionId)?.label}`}</span>
                        <ChevronDown size={14} className="text-slate-400" />
                      </button>

                      {isPositionFilterOpen && (
                        <div className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-[100] flex flex-col min-w-[200px] animate-in fade-in slide-in-from-top-2 duration-200">
                          {(selectedDimensionId === 'platform' || selectedDimensionId === 'distributorId' || selectedDimensionId === 'storeName') && (
                            <div className="p-3 border-b border-slate-100">
                              <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                  type="text"
                                  placeholder="搜索..."
                                  value={categorySearchQuery}
                                  onChange={(e) => setCategorySearchQuery(e.target.value)}
                                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                />
                              </div>
                            </div>
                          )}
                          <div className="max-h-64 overflow-y-auto p-2">
                            {availableValues.filter(v => v.toLowerCase().includes(categorySearchQuery.toLowerCase())).map(val => (
                              <button
                                key={val}
                                onClick={() => {
                                  setSelectedFilterValue(val);
                                  setIsPositionFilterOpen(false);
                                  setCategorySearchQuery('');
                                }}
                                className={cn(
                                  "w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                                  selectedFilterValue === val ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-50"
                                )}
                              >
                                {val}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="h-8 w-px bg-slate-200 mx-1" />

                <button 
                  onClick={() => setIsManagementOpen(true)}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
                >
                  <RefreshCw size={16} />
                  <span>管理项</span>
                </button>

                {selectedFilterValue && (
                  <button 
                    onClick={() => setSelectedFilterValue(null)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 px-3 py-2 bg-indigo-50 rounded-lg transition-all"
                  >
                    清除细分筛选
                  </button>
                )}
              </div>
            </section>

            {/* Unified Dimension Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between rounded-t-2xl">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">维度增长看板</h2>
                  <p className="text-xs text-slate-500 mt-1">按不同维度查看各指标的同比增长情况（展示各维度{selectedMetric === 'salesAmount' ? '销售额' : '销量'}前5名）</p>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
                    {dashboardHierarchy.map(group => (
                      <button
                        key={group.id}
                        onClick={() => {
                          setDashboardDimensionId(group.id);
                          setDashboardFilterValue(null);
                        }}
                        className={cn(
                          "px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
                          dashboardDimensionId === group.id 
                            ? "bg-white text-indigo-600 shadow-sm" 
                            : "text-slate-500 hover:text-slate-700"
                        )}
                      >
                        {group.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-4">
                    {dashboardDimensionId !== 'all' && (
                      <div className="relative">
                        <button 
                          onClick={() => setIsDashboardFilterOpen(!isDashboardFilterOpen)}
                          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold transition-all text-slate-700 shadow-sm hover:border-indigo-300"
                        >
                          <Filter size={14} className="text-slate-400" />
                          <span>{dashboardFilterValue || '全部' + dashboardHierarchy.find(h => h.id === dashboardDimensionId)?.label}</span>
                          <ChevronDown size={14} className="ml-1 opacity-50" />
                        </button>

                        {isDashboardFilterOpen && (
                          <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-2xl z-[100] animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                            <div className="p-3 border-b border-slate-50">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">筛选{dashboardHierarchy.find(h => h.id === dashboardDimensionId)?.label}</span>
                                {dashboardFilterValue && (
                                  <button 
                                    onClick={() => {
                                      setDashboardFilterValue(null);
                                      setIsDashboardFilterOpen(false);
                                    }}
                                    className="text-[10px] text-indigo-600 hover:underline"
                                  >
                                    重置
                                  </button>
                                )}
                              </div>
                              {dashboardHierarchy.find(h => h.id === dashboardDimensionId)?.searchable && (
                                <div className="relative">
                                  <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                  <input 
                                    type="text"
                                    placeholder="搜索..."
                                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                                    autoFocus
                                    onChange={(e) => setDashboardSearchQuery(e.target.value)}
                                    value={dashboardSearchQuery}
                                  />
                                </div>
                              )}
                            </div>
                            <div className="max-h-64 overflow-y-auto p-1">
                              <button
                                onClick={() => {
                                  setDashboardFilterValue(null);
                                  setIsDashboardFilterOpen(false);
                                }}
                                className={cn(
                                  "w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all",
                                  !dashboardFilterValue ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-50"
                                )}
                              >
                                全部
                              </button>
                              {dashboardHierarchy.find(h => h.id === dashboardDimensionId)?.children
                                .filter(child => !dashboardSearchQuery || child.toLowerCase().includes(dashboardSearchQuery.toLowerCase()))
                                .map(child => (
                                  <button
                                    key={child}
                                    onClick={() => {
                                      setDashboardFilterValue(child);
                                      setIsDashboardFilterOpen(false);
                                      setDashboardSearchQuery('');
                                    }}
                                    className={cn(
                                      "w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between",
                                      dashboardFilterValue === child ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-50"
                                    )}
                                  >
                                    <span>{child}</span>
                                    {dashboardDimensionId === 'distributorId' && DISTRIBUTOR_GRADES[child] && (
                                      <span className={cn(
                                        "px-1.5 py-0.5 rounded text-[8px] font-bold uppercase",
                                        dashboardFilterValue === child ? "bg-white/20 text-white" : cn("text-white", DISTRIBUTOR_GRADES[child].color)
                                      )}>
                                        {DISTRIBUTOR_GRADES[child].label}
                                      </span>
                                    )}
                                    {dashboardDimensionId === 'grade' && GRADE_COLORS[child] && (
                                      <span className={cn(
                                        "px-1.5 py-0.5 rounded text-[8px] font-bold uppercase",
                                        dashboardFilterValue === child ? "bg-white/20 text-white" : cn("text-white", GRADE_COLORS[child])
                                      )}>
                                        {child}
                                      </span>
                                    )}
                                  </button>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input 
                        type="text"
                        placeholder="在结果中搜索..."
                        className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-full text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none w-64 transition-all shadow-sm"
                        value={globalSearch}
                        onChange={(e) => setGlobalSearch(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

              </div>
              
              <div className="overflow-x-auto rounded-b-2xl">
                {dimensionMetrics.length > 0 && (
                  <div className="px-6 py-4 bg-white border-b border-slate-300 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.4)]" />
                    <span className="font-bold text-slate-900 text-sm">{dimensionMetrics[0].label} 明细数据</span>
                  </div>
                )}
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider border-b border-slate-300">
                      <SortableHeader label="细分项" sortKey="id" currentSort={tableSortConfig} onSort={handleTableSort} align="center" className="border-r border-slate-300 bg-slate-100/50" />
                      <SortableHeader label="销售额" sortKey="salesAmount" currentSort={tableSortConfig} onSort={handleTableSort} align="center" className="bg-indigo-50/30" />
                      <SortableHeader label="环比 (WoW)" sortKey="salesAmountWoW" currentSort={tableSortConfig} onSort={handleTableSort} align="center" className="bg-indigo-50/30" />
                      <SortableHeader label="同比 (YoY)" sortKey="salesAmountYoY" currentSort={tableSortConfig} onSort={handleTableSort} align="center" className="border-r border-slate-300 bg-indigo-50/30" />
                      <SortableHeader label="销量" sortKey="salesVolume" currentSort={tableSortConfig} onSort={handleTableSort} align="center" className="bg-emerald-50/20" />
                      <SortableHeader label="环比 (WoW)" sortKey="salesVolumeWoW" currentSort={tableSortConfig} onSort={handleTableSort} align="center" className="bg-emerald-50/20" />
                      <SortableHeader label="同比 (YoY)" sortKey="salesVolumeYoY" currentSort={tableSortConfig} onSort={handleTableSort} align="center" className="border-r border-slate-300 bg-emerald-50/20" />
                      <SortableHeader label="利润率" sortKey="margin" currentSort={tableSortConfig} onSort={handleTableSort} align="center" className="bg-slate-50" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {dimensionMetrics.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-24 text-center">
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
                          {/* Breakdown Rows */}
                          {filteredBreakdown?.map((item) => {
                            const isSelected = selectedFilterValue === item.id;
                            return (
                              <tr 
                                key={item.id}
                                onClick={() => {
                                  if (isSelected) {
                                    setSelectedFilterValue(null);
                                  } else {
                                    setSelectedFilterValue(item.id);
                                    if (dim.id !== 'all') {
                                      setSelectedDimensionId(dim.id);
                                    }
                                  }
                                }}
                                className={cn(
                                  "group transition-all cursor-pointer border-b border-slate-100 last:border-0",
                                  isSelected ? "bg-indigo-50/80" : "hover:bg-slate-50"
                                )}
                              >
                                <td className="px-4 py-3 text-center border-r border-slate-300 bg-slate-50/30">
                                  <div className="flex flex-col items-center justify-center">
                                    <div className="relative inline-flex items-center">
                                      {isSelected && <div className="absolute -left-3 w-1 h-4 bg-indigo-500 rounded-full shrink-0" />}
                                      <span className={cn(
                                        "text-sm font-medium transition-colors",
                                        isSelected ? "text-indigo-700 font-bold" : "text-slate-600 group-hover:text-slate-900"
                                      )}>
                                        {item.id.includes(' > ') ? item.id.split(' > ').pop() : item.id}
                                      </span>
                                      {dim.id === 'distributorId' && DISTRIBUTOR_GRADES[item.id] && (
                                        <span className={cn(
                                          "ml-1 px-1 rounded-[3px] text-[10px] font-bold text-white uppercase leading-tight",
                                          DISTRIBUTOR_GRADES[item.id].color
                                        )}>
                                          {DISTRIBUTOR_GRADES[item.id].label}
                                        </span>
                                      )}
                                      {dim.id === 'grade' && GRADE_COLORS[item.id] && (
                                        <span className={cn(
                                          "ml-1 px-1 rounded-[3px] text-[10px] font-bold text-white uppercase leading-tight",
                                          GRADE_COLORS[item.id]
                                        )}>
                                          {item.id}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-center bg-indigo-50/10">
                                  <span className="text-xs font-bold text-slate-900">¥{(item.metrics as any).salesAmount.toLocaleString()}</span>
                                </td>
                                <td className="px-4 py-3 text-center bg-indigo-50/10">
                                  <CompactGrowth value={(item.metrics as any).salesAmountWoW} diff={(item.metrics as any).salesAmountWoWDiff} prefix="¥" />
                                </td>
                                <td className="px-4 py-3 text-center border-r border-slate-300 bg-indigo-50/10">
                                  <CompactGrowth value={(item.metrics as any).salesAmountYoY} diff={(item.metrics as any).salesAmountYoYDiff} prefix="¥" />
                                </td>
                                <td className="px-4 py-3 text-center bg-emerald-50/5">
                                  <span className="text-xs font-bold text-slate-900">{(item.metrics as any).salesVolume.toLocaleString()}</span>
                                </td>
                                <td className="px-4 py-3 text-center bg-emerald-50/5">
                                  <CompactGrowth value={(item.metrics as any).salesVolumeWoW} diff={(item.metrics as any).salesVolumeWoWDiff} />
                                </td>
                                <td className="px-4 py-3 text-center border-r border-slate-300 bg-emerald-50/5">
                                  <CompactGrowth value={(item.metrics as any).salesVolumeYoY} diff={(item.metrics as any).salesVolumeYoYDiff} />
                                </td>
                                <td className="px-4 py-3 text-center bg-slate-50/20">
                                  <span className="text-xs font-bold text-slate-900">{(item.metrics as any).margin.toFixed(1)}%</span>
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
          <main className="p-8 space-y-6 w-full">
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
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between rounded-t-2xl">
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
              
              <div className="overflow-x-auto rounded-b-2xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-100">
                      <th className="px-4 py-4 w-10 whitespace-nowrap">
                        <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                      </th>
                      <th className="px-4 py-4 whitespace-nowrap">商品</th>
                      <th className="px-4 py-4 whitespace-nowrap">店铺</th>
                      <SortableHeader label="排名" sortKey="rank" currentSort={sortConfig} onSort={handleSort} align="center" />
                      <SortableHeader label="交易指数" sortKey="transactionIndex" currentSort={sortConfig} onSort={handleSort} align="right" />
                      <SortableHeader label="流量指数" sortKey="trafficIndex" currentSort={sortConfig} onSort={handleSort} align="right" />
                      <SortableHeader label="搜索指数" sortKey="searchIndex" currentSort={sortConfig} onSort={handleSort} align="right" />
                      <SortableHeader label="搜索增长幅度" sortKey="searchGrowth" currentSort={sortConfig} onSort={handleSort} align="center" />
                      <SortableHeader label="有效询盘用户指数" sortKey="effectiveInquiryIndex" currentSort={sortConfig} onSort={handleSort} align="right" />
                      <th className="px-4 py-4 whitespace-nowrap">上架时间</th>
                      <SortableHeader label="月成交" sortKey="monthlySales" currentSort={sortConfig} onSort={handleSort} align="right" />
                      <SortableHeader label="月代销" sortKey="monthlyDropshipping" currentSort={sortConfig} onSort={handleSort} align="right" />
                      <SortableHeader label="年成交件数" sortKey="yearlySalesVolume" currentSort={sortConfig} onSort={handleSort} align="right" />
                      <SortableHeader label="年成交笔数" sortKey="yearlyTransactionCount" currentSort={sortConfig} onSort={handleSort} align="right" />
                      <SortableHeader label="评论数" sortKey="reviewCount" currentSort={sortConfig} onSort={handleSort} align="right" />
                      <SortableHeader label="好评率" sortKey="positiveRate" currentSort={sortConfig} onSort={handleSort} align="center" />
                      <SortableHeader label="揽收率" sortKey="collectionRate" currentSort={sortConfig} onSort={handleSort} align="center" />
                      <SortableHeader label="商品复购率" sortKey="repurchaseRate" currentSort={sortConfig} onSort={handleSort} align="center" />
                      <SortableHeader label="加购人数" sortKey="addToCartCount" currentSort={sortConfig} onSort={handleSort} align="right" />
                      <th className="px-4 py-4 text-center relative whitespace-nowrap">
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
                          <td className="px-4 py-6 whitespace-nowrap">
                            <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                          </td>
                          <td className="px-4 py-6 whitespace-nowrap">
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
                          <td className="px-4 py-6 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                                <img src={`https://picsum.photos/seed/${product.storeName}/20/20`} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                              <span className="text-sm text-slate-600 whitespace-nowrap">{product.storeName}</span>
                            </div>
                          </td>
                          <td className="px-4 py-6 text-center whitespace-nowrap">
                            <span className="text-sm font-bold text-slate-900">{product.rank}</span>
                          </td>
                          <td className="px-4 py-6 text-right whitespace-nowrap">
                            <div className="inline-block border-b-2 border-blue-500 pb-0.5">
                              <span className="text-sm font-bold text-slate-900">{product.transactionIndex.toLocaleString()}</span>
                            </div>
                          </td>
                          <td className="px-4 py-6 text-right text-sm text-slate-600 whitespace-nowrap">
                            {product.trafficIndex.toLocaleString()}
                          </td>
                          <td className="px-4 py-6 text-right text-sm text-slate-600 whitespace-nowrap">
                            {product.searchIndex.toLocaleString()}
                          </td>
                          <td className="px-4 py-6 text-center whitespace-nowrap">
                            <div className={cn(
                              "inline-flex items-center gap-1 font-bold text-xs",
                              product.searchGrowth >= 0 ? "text-emerald-500" : "text-rose-500"
                            )}>
                              {product.searchGrowth >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                              {Math.abs(product.searchGrowth).toFixed(2)}%
                            </div>
                          </td>
                          <td className="px-4 py-6 text-right text-sm text-slate-600 font-medium whitespace-nowrap">
                            {product.effectiveInquiryIndex.toLocaleString()}
                          </td>
                          <td className="px-4 py-6 text-sm text-slate-500 whitespace-nowrap">
                            {product.listingTime}
                          </td>
                          <td className="px-4 py-6 text-right text-sm text-slate-600 whitespace-nowrap">
                            {product.monthlySales.toLocaleString()}
                          </td>
                          <td className="px-4 py-6 text-right text-sm text-slate-600 whitespace-nowrap">
                            {product.monthlyDropshipping.toLocaleString()}
                          </td>
                          <td className="px-4 py-6 text-right text-sm text-slate-600 whitespace-nowrap">
                            {product.yearlySalesVolume.toLocaleString()}
                          </td>
                          <td className="px-4 py-6 text-right text-sm text-slate-600 whitespace-nowrap">
                            {product.yearlyTransactionCount.toLocaleString()}
                          </td>
                          <td className="px-4 py-6 text-right text-sm text-slate-600 whitespace-nowrap">
                            {product.reviewCount.toLocaleString()}
                          </td>
                          <td className="px-4 py-6 text-center text-sm text-slate-600 whitespace-nowrap">
                            {product.positiveRate.toFixed(1)}%
                          </td>
                          <td className="px-4 py-6 text-center whitespace-nowrap">
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
                          <td className="px-4 py-6 text-center text-sm text-slate-600 whitespace-nowrap">
                            {product.repurchaseRate.toFixed(1)}%
                          </td>
                          <td className="px-4 py-6 text-right text-sm text-slate-600 whitespace-nowrap">
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
        ) : activeMenu === '数字营销分析' ? (
          <DigitalMarketingAnalysis />
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

      {/* Management Modal */}
      {isManagementOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-bold text-slate-900">管理后台</h3>
              <button 
                onClick={() => setIsManagementOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>
            
            <div className="p-6 space-y-8 overflow-y-auto custom-scrollbar flex-1">
              {/* Add Store */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <StoreIcon size={16} className="text-indigo-500" />
                  店铺管理
                </h4>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="输入新店铺名称..."
                    value={mgmtStoreName}
                    onChange={(e) => setMgmtStoreName(e.target.value)}
                    className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <button 
                    onClick={() => {
                      if (mgmtStoreName) {
                        setStores(prev => [...prev, mgmtStoreName]);
                        setMgmtStoreName('');
                      }
                    }}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors"
                  >
                    添加店铺
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {stores.map(store => (
                    <div key={store} className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 group">
                      <span>{store}</span>
                      <button 
                        onClick={() => showConfirm('确认删除', `确定要删除店铺 "${store}" 吗？`, () => {
                          setStores(prev => prev.filter(s => s !== store));
                        })}
                        className="text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Product */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Box size={16} className="text-emerald-500" />
                  类目层级管理
                </h4>
                <div className="grid grid-cols-4 gap-3">
                  <div className="space-y-2">
                    <select 
                      value={mgmtL1}
                      onChange={(e) => { setMgmtL1(e.target.value); setMgmtL2(''); setMgmtL3(''); }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                    >
                      <option value="">一级类目</option>
                      {Object.keys(categories).map(l1 => <option key={l1} value={l1}>{l1}</option>)}
                    </select>
                    <div className="flex gap-1">
                      <input 
                        type="text" 
                        placeholder="新增一级..."
                        value={newL1}
                        onChange={(e) => setNewL1(e.target.value)}
                        className="flex-1 px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] outline-none"
                      />
                      <button 
                        onClick={() => {
                          if (newL1 && !categories[newL1]) {
                            setCategories(prev => ({ ...prev, [newL1]: {} }));
                            setNewL1('');
                          }
                        }}
                        className="bg-emerald-600 text-white px-2 py-1 rounded-lg text-[10px] font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <select 
                      value={mgmtL2}
                      onChange={(e) => { setMgmtL2(e.target.value); setMgmtL3(''); }}
                      disabled={!mgmtL1}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none disabled:opacity-50"
                    >
                      <option value="">二级类目</option>
                      {mgmtL1 && Object.keys(categories[mgmtL1]).map(l2 => <option key={l2} value={l2}>{l2}</option>)}
                    </select>
                    <div className="flex gap-1">
                      <input 
                        type="text" 
                        placeholder="新增二级..."
                        value={newL2}
                        onChange={(e) => setNewL2(e.target.value)}
                        disabled={!mgmtL1}
                        className="flex-1 px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] outline-none disabled:opacity-50"
                      />
                      <button 
                        onClick={() => {
                          if (mgmtL1 && newL2 && !categories[mgmtL1][newL2]) {
                            setCategories(prev => {
                              const next = { ...prev };
                              next[mgmtL1] = { ...next[mgmtL1], [newL2]: {} };
                              return next;
                            });
                            setNewL2('');
                          }
                        }}
                        disabled={!mgmtL1}
                        className="bg-emerald-600 text-white px-2 py-1 rounded-lg text-[10px] font-bold disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <select 
                      value={mgmtL3}
                      onChange={(e) => setMgmtL3(e.target.value)}
                      disabled={!mgmtL2}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none disabled:opacity-50"
                    >
                      <option value="">三级类目</option>
                      {mgmtL2 && Object.keys(categories[mgmtL1][mgmtL2]).map(l3 => <option key={l3} value={l3}>{l3}</option>)}
                    </select>
                    <div className="flex gap-1">
                      <input 
                        type="text" 
                        placeholder="新增三级..."
                        value={newL3}
                        onChange={(e) => setNewL3(e.target.value)}
                        disabled={!mgmtL2}
                        className="flex-1 px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] outline-none disabled:opacity-50"
                      />
                      <button 
                        onClick={() => {
                          if (mgmtL1 && mgmtL2 && newL3 && !categories[mgmtL1][mgmtL2][newL3]) {
                            setCategories(prev => {
                              const next = { ...prev };
                              next[mgmtL1][mgmtL2] = { ...next[mgmtL1][mgmtL2], [newL3]: [] };
                              return next;
                            });
                            setNewL3('');
                          }
                        }}
                        disabled={!mgmtL2}
                        className="bg-emerald-600 text-white px-2 py-1 rounded-lg text-[10px] font-bold disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <input 
                      type="text" 
                      placeholder="输入四级类目名称..."
                      value={mgmtL4}
                      onChange={(e) => setMgmtL4(e.target.value)}
                      disabled={!mgmtL3}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
                    />
                    <button 
                      onClick={() => {
                        if (mgmtL1 && mgmtL2 && mgmtL3 && mgmtL4) {
                          const newCategories = { ...categories };
                          newCategories[mgmtL1][mgmtL2][mgmtL3] = [...(newCategories[mgmtL1][mgmtL2][mgmtL3] || []), mgmtL4];
                          setCategories(newCategories);
                          setMgmtL4('');
                        }
                      }}
                      disabled={!mgmtL4}
                      className="w-full bg-emerald-600 text-white px-4 py-1.5 rounded-xl text-[10px] font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50"
                    >
                      添加四级
                    </button>
                  </div>
                </div>

                {/* Display Current Categories for Deletion */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">搜索并删除层级</p>
                    <div className="relative flex items-center gap-2">
                      <div className="relative">
                        <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="搜索类目..."
                          value={mgmtCategorySearch}
                          onChange={(e) => setMgmtCategorySearch(e.target.value)}
                          className="pl-7 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] outline-none focus:ring-1 focus:ring-indigo-500/30 w-40"
                        />
                      </div>
                      {mgmtCategorySearch && (
                        <button 
                          onClick={() => setMgmtCategorySearch('')}
                          className="text-[10px] text-indigo-600 hover:underline"
                        >
                          清除
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto border border-slate-100 rounded-xl p-2 space-y-2">
                    {/* L1s */}
                    {Object.keys(categories).filter(l1 => l1.includes(mgmtCategorySearch)).map(l1 => (
                      <div key={l1} className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg group">
                        <span className="text-xs font-bold text-slate-700">{l1} (一级)</span>
                        <button 
                          onClick={() => showConfirm('确认删除', `确定要删除一级类目 "${l1}" 及其下所有子类目吗？`, () => {
                            setCategories(prev => {
                              const next = { ...prev };
                              delete next[l1];
                              return next;
                            });
                          })}
                          className="text-slate-400 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    
                    {/* L2s */}
                    {Object.entries(categories).flatMap(([l1, l2s]: any) => 
                      Object.keys(l2s).filter(l2 => l2.includes(mgmtCategorySearch)).map(l2 => ({ l1, l2 }))
                    ).map(({ l1, l2 }) => (
                      <div key={`${l1}-${l2}`} className="flex items-center justify-between bg-blue-50/50 px-3 py-2 rounded-lg group ml-4">
                        <span className="text-xs text-slate-600">{l1} &gt; <span className="font-bold">{l2}</span> (二级)</span>
                        <button 
                          onClick={() => showConfirm('确认删除', `确定要删除二级类目 "${l1} > ${l2}" 及其下所有子类目吗？`, () => {
                            setCategories(prev => {
                              const next = { ...prev };
                              delete next[l1][l2];
                              return next;
                            });
                          })}
                          className="text-slate-400 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}

                    {/* L3s */}
                    {Object.entries(categories).flatMap(([l1, l2s]: any) => 
                      Object.entries(l2s).flatMap(([l2, l3s]: any) => 
                        Object.keys(l3s).filter(l3 => l3.includes(mgmtCategorySearch)).map(l3 => ({ l1, l2, l3 }))
                      )
                    ).map(({ l1, l2, l3 }) => (
                      <div key={`${l1}-${l2}-${l3}`} className="flex items-center justify-between bg-indigo-50/50 px-3 py-2 rounded-lg group ml-8">
                        <span className="text-xs text-slate-600">{l1} &gt; {l2} &gt; <span className="font-bold">{l3}</span> (三级)</span>
                        <button 
                          onClick={() => showConfirm('确认删除', `确定要删除三级类目 "${l1} > {l2} > ${l3}" 及其下所有子类目吗？`, () => {
                            setCategories(prev => {
                              const next = { ...prev };
                              delete next[l1][l2][l3];
                              return next;
                            });
                          })}
                          className="text-slate-400 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}

                    {/* L4s */}
                    {Object.entries(categories).flatMap(([l1, l2s]: any) => 
                      Object.entries(l2s).flatMap(([l2, l3s]: any) => 
                        Object.entries(l3s).flatMap(([l3, l4s]: any) => 
                          l4s.filter((l4: string) => l4.includes(mgmtCategorySearch)).map((l4: string) => ({ l1, l2, l3, l4 }))
                        )
                      )
                    ).map(({ l1, l2, l3, l4 }) => (
                      <div key={`${l1}-${l2}-${l3}-${l4}`} className="flex items-center justify-between bg-emerald-50/50 px-3 py-2 rounded-lg group ml-12">
                        <span className="text-xs text-slate-600">{l1} &gt; {l2} &gt; {l3} &gt; <span className="font-bold text-emerald-700">{l4}</span> (四级)</span>
                        <button 
                          onClick={() => showConfirm('确认删除', `确定要删除四级类目 "${l1} > ${l2} > ${l3} > ${l4}" 吗？`, () => {
                            setCategories(prev => {
                              const next = { ...prev };
                              next[l1][l2][l3] = next[l1][l2][l3].filter((item: string) => item !== l4);
                              return next;
                            });
                          })}
                          className="text-slate-400 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Add Platform */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Globe size={16} className="text-blue-500" />
                  客户销售渠道管理
                </h4>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="输入新渠道名称..."
                    value={mgmtPlatformName}
                    onChange={(e) => setMgmtPlatformName(e.target.value)}
                    className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <button 
                    onClick={() => {
                      if (mgmtPlatformName) {
                        setPlatforms(prev => [...prev, mgmtPlatformName]);
                        setMgmtPlatformName('');
                      }
                    }}
                    className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
                  >
                    添加渠道
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {platforms.map(platform => (
                    <div key={platform} className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 group">
                      <span>{platform}</span>
                      <button 
                        onClick={() => showConfirm('确认删除', `确定要删除渠道 "${platform}" 吗？`, () => {
                          setPlatforms(prev => prev.filter(p => p !== platform));
                        })}
                        className="text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Distributor */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Users size={16} className="text-purple-500" />
                  分销商管理
                </h4>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="输入新分销商名称..."
                    value={mgmtDistributorName}
                    onChange={(e) => setMgmtDistributorName(e.target.value)}
                    className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <button 
                    onClick={() => {
                      if (mgmtDistributorName) {
                        setDistributors(prev => [...prev, mgmtDistributorName]);
                        setMgmtDistributorName('');
                      }
                    }}
                    className="bg-purple-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-purple-700 transition-colors"
                  >
                    添加分销商
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {distributors.map(distributor => (
                    <div key={distributor} className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 group">
                      <div className="flex flex-col items-start">
                        <span>{distributor}</span>
                        {DISTRIBUTOR_GRADES[distributor] && (
                          <span className={cn(
                            "px-1 py-0.5 rounded-[2px] text-[8px] font-bold text-white uppercase leading-none mt-0.5",
                            DISTRIBUTOR_GRADES[distributor].color
                          )}>
                            {DISTRIBUTOR_GRADES[distributor].label}级
                          </span>
                        )}
                      </div>
                      <button 
                        onClick={() => showConfirm('确认删除', `确定要删除分销商 "${distributor}" 吗？`, () => {
                          setDistributors(prev => prev.filter(d => d !== distributor));
                        })}
                        className="text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Users size={16} className="text-orange-500" />
                  岗位人员管理
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <select 
                    value={mgmtPositionType}
                    onChange={(e) => setMgmtPositionType(e.target.value)}
                    className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
                  >
                    <option value="">选择岗位</option>
                    <option value="业务">业务</option>
                    <option value="销售">销售</option>
                  </select>
                  <input 
                    type="text" 
                    placeholder="输入人员姓名..."
                    value={mgmtPersonnelName}
                    onChange={(e) => setMgmtPersonnelName(e.target.value)}
                    className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <button 
                  onClick={() => {
                    if (mgmtPositionType && mgmtPersonnelName) {
                      setPositions(prev => ({
                        ...prev,
                        [mgmtPositionType]: [...prev[mgmtPositionType], mgmtPersonnelName]
                      }));
                      setMgmtPersonnelName('');
                    }
                  }}
                  className="w-full bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-orange-700 transition-colors"
                >
                  添加人员
                </button>
                
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(positions).map(([type, names]: [string, any]) => (
                    <div key={type} className="space-y-2">
                      <p className="text-xs font-bold text-slate-500">{type}</p>
                      <div className="flex flex-wrap gap-2">
                        {names.map((name: string) => (
                          <div key={name} className="flex items-center gap-2 bg-orange-50 px-2 py-1 rounded-lg text-xs font-medium text-orange-700">
                            <span>{name}</span>
                            <button 
                              onClick={() => showConfirm('确认删除', `确定要删除人员 "${name}" 吗？`, () => {
                                setPositions(prev => ({
                                  ...prev,
                                  [type]: prev[type].filter(n => n !== name)
                                }));
                              })}
                              className="hover:text-rose-500"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
              <button 
                onClick={() => setIsManagementOpen(false)}
                className="px-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
              >
                关闭管理后台
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 space-y-4">
              <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-600">
                <Trash2 size={24} />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-bold text-slate-900">{confirmDialog.title}</h3>
                <p className="text-sm text-slate-500">{confirmDialog.message}</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                  className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={confirmDialog.onConfirm}
                  className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-700 transition-colors shadow-lg shadow-rose-600/20"
                >
                  确认删除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
            <GrowthRow label="本周环比 (WoW)" value={metrics.wow} />
            <GrowthRow label="本月环比 (MoM)" value={metrics.mom} />
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

function CompactGrowth({ value, diff, prefix = "" }: { value: number, diff?: number, prefix?: string }) {
  const isPositive = value >= 0;
  const colorClass = isPositive ? "text-rose-600" : "text-emerald-600";
  
  return (
    <div className="flex items-center justify-center gap-1.5 py-1">
      {diff !== undefined && (
        <span className="text-xs font-bold text-slate-800">
          {isPositive ? '+' : ''}{prefix}{diff.toLocaleString()}
        </span>
      )}
      <div className={cn("flex items-center gap-0.5 text-[10px] font-bold", colorClass)}>
        {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
        <span>{isPositive ? '+' : ''}{value.toFixed(1)}%</span>
      </div>
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
