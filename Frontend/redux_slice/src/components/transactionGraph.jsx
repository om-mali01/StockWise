import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactionDetails } from '../redux/action/inventoryAction';
import { selectTransactions, selectGetAllInventorys } from '../redux/selector/selector';

const CustomDateTick = ({ x, y, payload }) => {
  if (payload.value && payload.value.trim() !== '') {
    return (
      <text x={x} y={y + 20} textAnchor="middle" fill="#666" fontSize={16}>
        {payload.value}
      </text>
    );
  }
  return null;
};

const TransactionAnalytics = () => {
  const { sku } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const transactions = useSelector(selectTransactions);
  const inventorys = useSelector(selectGetAllInventorys);
  const [data, setData] = useState([]);
  const [inventoryName, setInventoryName] = useState('Unknown Inventory');

  useEffect(() => {
    dispatch(fetchTransactionDetails(sku));
  }, [dispatch, sku]);

  useEffect(() => {
    if (inventorys && inventorys.length > 0) {
      const inventoryItem = inventorys.find(item => item.sku === sku);
      if (inventoryItem) {
        setInventoryName(inventoryItem.name);
      }
    }
  }, [inventorys, sku]);

  useEffect(() => {
    if (transactions.length > 0) {
      const sorted = [...transactions].sort(
        (a, b) => new Date(a.transaction_date) - new Date(b.transaction_date)
      );

      const grouped = sorted.reduce((acc, trx) => {
        const dateStr = new Date(trx.transaction_date).toLocaleDateString();
        if (!acc[dateStr]) acc[dateStr] = [];
        acc[dateStr].push(trx);
        return acc;
      }, {});

      const chartData = [];
      const dateEntries = Object.entries(grouped);

      dateEntries.forEach(([dateStr, dayTransactions], groupIdx) => {
        const dateData = {
          date: dateStr,
          dateGroup: dateStr,
        };

        dayTransactions.forEach((trx, index) => {
          const stackKey = `transaction_${index}`;
          if (trx.transaction_type === 'IN') {
            dateData[`in_${stackKey}`] = trx.quantity;
            dateData[`out_${stackKey}`] = 0;
          } else {
            dateData[`in_${stackKey}`] = 0;
            dateData[`out_${stackKey}`] = trx.quantity;
          }
          dateData[`${stackKey}_details`] = {
            id: trx.transaction_id,
            type: trx.transaction_type,
            quantity: trx.quantity
          };
        });

        dateData.transactionCount = dayTransactions.length;
        dateData.allTransactions = dayTransactions;

        chartData.push(dateData);

        if (groupIdx < dateEntries.length - 1) {
          chartData.push({
            date: '',
            spacer: true,
          });
        }
      });

      setData(chartData);
    }
  }, [transactions, inventorys, sku]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length && label) {
      const data = payload[0].payload;
      if (data.spacer) return null;
      
      const inTransactions = data.allTransactions?.filter(t => t.transaction_type === 'IN') || [];
      const outTransactions = data.allTransactions?.filter(t => t.transaction_type === 'OUT') || [];
      
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg max-w-xs">
          <p className="font-bold mb-2">{`Date: ${data.dateGroup}`}</p>
          <p className="font-semibold text-sm">Total Transactions: {data.transactionCount}</p>
          
          {inTransactions.length > 0 && (
            <div className="mt-2">
              <p className="font-semibold text-green-600 text-sm">IN Transactions:</p>
              {inTransactions.map((trx, idx) => (
                <p key={idx} className="text-xs text-green-600">
                  • Qty: {trx.quantity} (ID: {trx.transaction_id})
                </p>
              ))}
            </div>
          )}
          
          {outTransactions.length > 0 && (
            <div className="mt-2">
              <p className="font-semibold text-red-600 text-sm">OUT Transactions:</p>
              {outTransactions.map((trx, idx) => (
                <p key={idx} className="text-xs text-red-600">
                  • Qty: {trx.quantity} (ID: {trx.transaction_id})
                </p>
              ))}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const maxTransactionsPerDate = Math.max(...data.filter(d => !d.spacer).map(d => d.transactionCount || 0));
  
  const renderBars = () => {
    const bars = [];
    
    for (let i = 0; i < maxTransactionsPerDate; i++) {
      bars.push(
        <Bar 
          key={`in_transaction_${i}`}
          dataKey={`in_transaction_${i}`} 
          stackId="stack"
          fill="#82ca9d" 
          name={i === 0 ? "In Stock" : undefined} 
          legendType={i === 0 ? "rect" : "none"}
          radius={i === maxTransactionsPerDate - 1 ? [2, 2, 0, 0] : [0, 0, 0, 0]}
        />
      );
      bars.push(
        <Bar 
          key={`out_transaction_${i}`}
          dataKey={`out_transaction_${i}`} 
          stackId="stack"
          fill="#ff4d4d" 
          name={i === 0 ? "Out Stock" : undefined} 
          legendType={i === 0 ? "rect" : "none"}
          radius={i === maxTransactionsPerDate - 1 ? [2, 2, 0, 0] : [0, 0, 0, 0]}
        />
      );
    }
    
    return bars;
  };

  return (
    <div>
      <ResponsiveContainer width="100%" height={460}>
        <BarChart
          data={data}
          margin={{ bottom: 70 }}
          barCategoryGap={20} 
          maxBarSize={60}
        >
          <CartesianGrid strokeDasharray="2 2" />
          <XAxis
            dataKey="date"
            height={60}
            interval={0}
            tick={CustomDateTick}
            axisLine={false}
            tickLine={false}
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} />
          {renderBars()}
        </BarChart>
      </ResponsiveContainer>
      <h3 className="text-center mt-4 font-semibold text-lg">{inventoryName}</h3>
      
      <div className="text-center mt-4">
        <button 
          className="bg-gray-800 text-white px-4 py-2 rounded-md"
          onClick={() => navigate(`/dashboard/view-product/${sku}`)} 
        >
          Back to Product Categories
        </button>
      </div>
    </div>
  );
};

export default TransactionAnalytics;
