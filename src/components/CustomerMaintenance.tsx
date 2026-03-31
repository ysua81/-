import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronUp, ChevronDown, Download, Upload, Plus, MoreHorizontal } from 'lucide-react';
import { CustomerMaintenanceData } from '../types';
import { generateCustomerMaintenanceData } from '../mockData';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CustomerMaintenance: React.FC = () => {
  const [data] = useState<CustomerMaintenanceData[]>(() => generateCustomerMaintenanceData(50));
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof CustomerMaintenanceData; direction: 'asc' | 'desc' } | null>(null);

  const filteredData = useMemo(() => {
    let result = [...data];
    if (searchQuery) {
      result = result.filter(item => 
        item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.buyerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.realName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [data, searchQuery, sortConfig]);

  const handleSort = (key: keyof CustomerMaintenanceData) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const columns: { key: keyof CustomerMaintenanceData; label: string; width?: string }[] = [
    { key: 'customerName', label: '客户名称 (分销商)', width: '200px' },
    { key: 'storeAttribution', label: '店铺归属', width: '120px' },
    { key: 'buyerId', label: '买家ID', width: '120px' },
    { key: 'orderAccount', label: '下单账号', width: '120px' },
    { key: 'customerGrade', label: '客户等级', width: '100px' },
    { key: 'salesAmount', label: '销售额', width: '120px' },
    { key: 'customerCategory', label: '客户分类', width: '120px' },
    { key: 'customerType', label: '客户类型', width: '100px' },
    { key: 'sourceChannel', label: '来源渠道', width: '120px' },
    { key: 'visitDate', label: '拜访日期', width: '150px' },
    { key: 'customerSalesChannel', label: '客户销售渠道', width: '150px' },
    { key: 'wechatRemark', label: '客户微信备注名', width: '150px' },
    { key: 'wechatId', label: '客户微信号', width: '150px' },
    { key: 'wechatAccount', label: '客户微信账号', width: '150px' },
    { key: 'groupName', label: '客户群名称', width: '150px' },
    { key: 'realName', label: '客户姓名', width: '120px' },
    { key: 'idCard', label: '客户身份证', width: '180px' },
    { key: 'phoneNumber', label: '手机号', width: '130px' },
    { key: 'gender', label: '性别', width: '80px' },
    { key: 'birthday', label: '生日', width: '120px' },
    { key: 'customerStoreName', label: '客户店铺名', width: '150px' },
    { key: 'productCategory', label: '产品类目', width: '120px' },
    { key: 'companyName', label: '客户公司名', width: '200px' },
    { key: 'address', label: '客户地址', width: '250px' },
    { key: 'customerPrice', label: '客户价格', width: '120px' },
    { key: 'taxPoint', label: '发票税点', width: '100px' },
    { key: 'shippingRequirement', label: '发货要求', width: '200px' },
    { key: 'isInfoComplete', label: '信息是否完善', width: '120px' },
    { key: 'remarks', label: '备注信息', width: '200px' },
    { key: 'dailyTrackingRemarks', label: '日常跟踪备注', width: '250px' },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      {/* Toolbar */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="搜索客户名称、买家ID、姓名..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-80 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={16} />
            高级筛选
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm">
            <Plus size={16} />
            新增客户
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Upload size={16} />
            导入
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Download size={16} />
            导出
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-auto relative">
        <table className="w-full border-separate border-spacing-0">
          <thead className="sticky top-0 z-20 bg-slate-50">
            <tr>
              <th className="sticky left-0 z-30 bg-slate-50 p-0 border-b border-r border-slate-200">
                <div className="px-4 py-3 flex items-center justify-center">
                  <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                </div>
              </th>
              {columns.map((col) => (
                <th 
                  key={col.key}
                  className="p-0 border-b border-r border-slate-200 last:border-r-0 cursor-pointer hover:bg-slate-100 transition-colors group"
                  style={{ minWidth: col.width }}
                  onClick={() => handleSort(col.key)}
                >
                  <div className="px-4 py-3 flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">{col.label}</span>
                    <div className="flex flex-col -space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronUp size={10} className={cn(sortConfig?.key === col.key && sortConfig.direction === 'asc' ? "text-indigo-600" : "text-slate-300")} />
                      <ChevronDown size={10} className={cn(sortConfig?.key === col.key && sortConfig.direction === 'desc' ? "text-indigo-600" : "text-slate-300")} />
                    </div>
                  </div>
                </th>
              ))}
              <th className="sticky right-0 z-30 bg-slate-50 p-0 border-b border-l border-slate-200">
                <div className="px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider text-center">操作</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row) => (
              <tr key={row.id} className="hover:bg-indigo-50/30 transition-colors group">
                <td className="sticky left-0 z-10 bg-white group-hover:bg-indigo-50/30 p-0 border-b border-r border-slate-100 transition-colors">
                  <div className="px-4 py-3 flex items-center justify-center">
                    <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  </div>
                </td>
                {columns.map((col) => (
                  <td key={col.key} className="p-0 border-b border-r border-slate-100 last:border-r-0">
                    <div className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap overflow-hidden text-ellipsis">
                      {col.key === 'salesAmount' ? (
                        <span className="font-medium text-slate-900">¥{row[col.key].toLocaleString()}</span>
                      ) : col.key === 'customerGrade' ? (
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold text-white",
                          row[col.key] === 'S' ? "bg-rose-500" :
                          row[col.key] === 'A' ? "bg-amber-500" :
                          row[col.key] === 'B' ? "bg-emerald-500" :
                          row[col.key] === 'C' ? "bg-blue-500" : "bg-slate-400"
                        )}>
                          {row[col.key]}级
                        </span>
                      ) : col.key === 'isInfoComplete' ? (
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-medium",
                          row[col.key] ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                        )}>
                          {row[col.key] ? '是' : '否'}
                        </span>
                      ) : (
                        row[col.key]
                      )}
                    </div>
                  </td>
                ))}
                <td className="sticky right-0 z-10 bg-white group-hover:bg-indigo-50/30 p-0 border-b border-l border-slate-100 transition-colors">
                  <div className="px-4 py-3 flex items-center justify-center gap-2">
                    <button className="p-1 text-slate-400 hover:text-indigo-600 transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Info (from Image) */}
      <div className="p-4 border-t border-slate-100 bg-slate-50 grid grid-cols-4 gap-6">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">客户身份</span>
          <p className="text-sm text-slate-700 font-medium">分销商 / 核心客户</p>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">发货要求</span>
          <p className="text-sm text-slate-700 font-medium">顺丰速运 / 气泡膜加固</p>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">转介绍客户</span>
          <p className="text-sm text-slate-700 font-medium">张三 (分销商A)</p>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">客户其他信息1</span>
          <p className="text-sm text-slate-700 font-medium">长期合作，信誉良好</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerMaintenance;
