import React, { useState } from 'react';
import { BarChart3, TrendingUp, Download, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, Badge, ButtonSmall, StatCard } from '../../components/DesignSystem';

const EarningsPaymentDashboard = () => {
  const [earnings, setEarnings] = useState({
    totalEarned: 45230.50,
    pendingEarnings: 3500.00,
    thisMonthEarnings: 8750.25,
    lastMonthEarnings: 7200.00,
  });

  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: 'earned',
      title: 'Payment for E-Commerce Platform',
      project: 'E-Commerce Platform',
      amount: 5000,
      date: 'March 15, 2024',
      status: 'completed',
      client: 'TechStart Inc',
    },
    {
      id: 2,
      type: 'earned',
      title: 'Payment for UI/UX Design',
      project: 'Mobile App Design System',
      amount: 3500,
      date: 'March 10, 2024',
      status: 'pending',
      client: 'FitnessPro',
    },
    {
      id: 3,
      type: 'withdrawal',
      title: 'Withdrawal to Bank Account',
      amount: -4000,
      date: 'March 5, 2024',
      status: 'completed',
      method: 'Bank Transfer',
    },
    {
      id: 4,
      type: 'earned',
      title: 'Payment for API Development',
      project: 'Rest API Development',
      amount: 2500,
      date: 'February 28, 2024',
      status: 'completed',
      client: 'DataFlow Systems',
    },
  ]);

  const [showWithdrawal, setShowWithdrawal] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank');

  const handleWithdraw = () => {
    if (withdrawalAmount && parseFloat(withdrawalAmount) <= earnings.pendingEarnings) {
      const newTransaction = {
        id: transactions.length + 1,
        type: 'withdrawal',
        title: 'Withdrawal to ' + (paymentMethod === 'bank' ? 'Bank Account' : 'PayPal'),
        amount: -parseFloat(withdrawalAmount),
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        status: 'processing',
        method: paymentMethod === 'bank' ? 'Bank Transfer' : 'PayPal',
      };
      setTransactions([newTransaction, ...transactions]);
      setEarnings({
        ...earnings,
        pendingEarnings: earnings.pendingEarnings - parseFloat(withdrawalAmount),
        totalEarned: earnings.totalEarned - parseFloat(withdrawalAmount),
      });
      setWithdrawalAmount('');
      setShowWithdrawal(false);
    }
  };

  const earningsGrowth = ((earnings.thisMonthEarnings - earnings.lastMonthEarnings) / earnings.lastMonthEarnings * 100).toFixed(1);
  const isGrowth = earningsGrowth >= 0;

  return (
    <div className="min-h-screen bg-black-50 py-8 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black-900 mb-2">Earnings & Payments</h1>
          <p className="text-black-600">Track your income and manage withdrawals</p>
        </div>

        {/* Earnings Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={CreditCard}
            label="Total Earnings"
            value={`$${earnings.totalEarned.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            backgroundColor="bg-orange-50"
          />
          <StatCard
            icon={AlertCircle}
            label="Pending Earnings"
            value={`$${earnings.pendingEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            backgroundColor="bg-yellow-50"
          />
          <StatCard
            icon={TrendingUp}
            label="This Month"
            value={`$${earnings.thisMonthEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            backgroundColor="bg-emerald-50"
          />
          <div className="rounded-2xl border border-black-100 p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black-600 mb-2">Growth vs Last Month</p>
                <p className={`text-3xl font-bold ${isGrowth ? 'text-emerald-600' : 'text-red-600'}`}>
                  {isGrowth ? '+' : ''}{earningsGrowth}%
                </p>
              </div>
              <div className={`p-3 rounded-lg ${isGrowth ? 'bg-emerald-100' : 'bg-red-100'}`}>
                <TrendingUp size={24} className={isGrowth ? 'text-emerald-600' : 'text-red-600'} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Withdraw Funds */}
          <Card className="lg:col-span-1 bg-gradient-to-br from-orange-50 to-white">
            <h3 className="text-xl font-bold text-black-900 mb-6">Withdraw Funds</h3>

            {showWithdrawal ? (
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-black-900 mb-2">Amount to Withdraw</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black-900 font-semibold">$</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      max={earnings.pendingEarnings}
                      value={withdrawalAmount}
                      onChange={(e) => setWithdrawalAmount(e.target.value)}
                      className="w-full pl-8 pr-4 py-2 rounded-lg border border-black-100 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <p className="text-xs text-black-600 mt-2">
                    Available: ${earnings.pendingEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-black-900 mb-2">Withdrawal Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-black-100 focus:outline-none focus:border-orange-500"
                  >
                    <option value="bank">Bank Transfer</option>
                    <option value="paypal">PayPal</option>
                    <option value="wise">Wise</option>
                  </select>
                </div>

                <div className="p-3 rounded-lg bg-orange-100 border border-orange-300 mb-4">
                  <p className="text-sm text-orange-900">
                    <strong>Processing time:</strong> 2-5 business days
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleWithdraw}
                    className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition"
                  >
                    Withdraw
                  </button>
                  <button
                    onClick={() => setShowWithdrawal(false)}
                    className="flex-1 py-2 border-2 border-black-100 text-black-900 font-semibold rounded-lg hover:bg-black-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="p-4 rounded-lg bg-white border-2 border-black-100 mb-4">
                  <p className="text-xs text-black-600 mb-1">Available for Withdrawal</p>
                  <p className="text-3xl font-bold text-orange-600">
                    ${earnings.pendingEarnings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <button
                  onClick={() => setShowWithdrawal(true)}
                  disabled={earnings.pendingEarnings === 0}
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition"
                >
                  Withdraw Funds
                </button>
                <p className="text-xs text-black-600 mt-4 text-center">
                  Minimum withdrawal: $10
                </p>
              </div>
            )}
          </Card>

          {/* Payment Methods */}
          <Card className="lg:col-span-2">
            <h3 className="text-lg font-bold text-black-900 mb-6">Payment Methods</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-lg border-2 border-black-100 hover:border-orange-300 transition cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <CreditCard size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-black-900">Bank Account</p>
                      <p className="text-sm text-black-600">Checking Account ••••1234</p>
                    </div>
                  </div>
                  <Badge variant="success">Verified</Badge>
                </div>
              </div>

              <div className="p-4 rounded-lg border-2 border-black-100 hover:border-orange-300 transition cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center text-xl">
                      🅿️
                    </div>
                    <div>
                      <p className="font-semibold text-black-900">PayPal</p>
                      <p className="text-sm text-black-600">john.doe@paypal.com</p>
                    </div>
                  </div>
                  <Badge variant="success">Verified</Badge>
                </div>
              </div>

              <button className="w-full py-3 border-2 border-dashed border-black-100 rounded-lg text-black-700 font-semibold hover:border-orange-500 hover:text-orange-600 transition">
                + Add Payment Method
              </button>
            </div>
          </Card>
        </div>

        {/* Transaction History */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-black-900">Transaction History</h3>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-black-100 hover:bg-black-50 transition text-black-900 font-semibold">
              <Download size={18} />
              Export
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black-50 border-b border-black-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-black-900">Description</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-black-900">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-black-900">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-black-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-black-100 hover:bg-black-50 transition">
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-semibold text-black-900">{transaction.title}</p>
                        {transaction.project && (
                          <p className="text-sm text-black-600">{transaction.project}</p>
                        )}
                        {transaction.client && (
                          <p className="text-sm text-black-600">{transaction.client}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className={`font-bold ${transaction.type === 'earned' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {transaction.type === 'earned' ? '+' : ''}{transaction.amount}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-black-700">{transaction.date}</td>
                    <td className="px-4 py-4">
                      {transaction.status === 'completed' && (
                        <Badge variant="success" className="flex items-center gap-1 w-fit">
                          <CheckCircle size={14} />
                          Completed
                        </Badge>
                      )}
                      {transaction.status === 'pending' && (
                        <Badge variant="warning" className="flex items-center gap-1 w-fit">
                          <AlertCircle size={14} />
                          Pending
                        </Badge>
                      )}
                      {transaction.status === 'processing' && (
                        <Badge variant="primary" className="flex items-center gap-1 w-fit">
                          Processing
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EarningsPaymentDashboard;
