"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import { Wallet, ArrowUpRight, ArrowDownLeft, History, DollarSign, TrendingUp, TrendingDown, Clock, Check, X, ChevronRight, AlertCircle } from "lucide-react"
import { mockUser, mockTransactions } from "@/lib/mockData"

export default function WalletPage() {
  const [transactions] = useState(mockTransactions)
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [address, setAddress] = useState("")
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleDeposit = () => {
    if (Number(amount) < 10) {
      showToast("Minimum deposit is $10", "error")
      return
    }
    if (Number(amount) > 500) {
      showToast("Daily deposit limit exceeded. Your limit is $500 (Novice tier)", "error")
      return
    }
    showToast(`Deposit invoice created for $${amount}. Check your email for payment details.`, "success")
    setIsDepositModalOpen(false)
    setAmount("")
  }

  const handleWithdraw = () => {
    if (Number(amount) < 10) {
      showToast("Minimum withdrawal is $10", "error")
      return
    }
    if (Number(amount) > 250) {
      showToast("Daily withdrawal limit exceeded. Your limit is $250 (Novice tier)", "error")
      return
    }
    showToast(`Withdrawal request submitted for approval. You'll be notified once processed.`, "success")
    setIsWithdrawModalOpen(false)
    setAmount("")
    setAddress("")
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowDownLeft className="h-4 w-4 text-green-600" />
      case 'withdrawal': return <ArrowUpRight className="h-4 w-4 text-red-600" />
      case 'bet_entry': return <DollarSign className="h-4 w-4 text-blue-600" />
      case 'payout': return <TrendingUp className="h-4 w-4 text-purple-600" />
      default: return <History className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      failed: "bg-red-100 text-red-700"
    }
    return (
      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${styles[status as keyof typeof styles]}`}>
        {status}
      </span>
    )
  }

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed right-4 top-4 z-50"
          >
            <div className={`flex items-center gap-3 rounded-2xl px-6 py-4 shadow-2xl backdrop-blur-md ${toast.type === 'success' ? 'bg-green-500/90' : 'bg-red-500/90'
              } text-white border border-white/20`}>
              {toast.type === 'success' ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
              <p className="font-medium">{toast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <DashboardHeader
        subtitle="Manage your balance and transactions"
      />

      {/* Visual Separator - Balance Overview */}
      <div className="flex items-center gap-4 my-18">
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
        <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Balance Overview</h2>
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
      </div>

      {/* Balance Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-6 md:grid-cols-3 mb-10"
      >
        {/* Current Balance - Blue */}
        <Card className="relative overflow-hidden border-none bg-linear-to-br from-blue-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100/50 blur-2xl transition-all group-hover:bg-blue-200/50" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900/60">Current Balance</p>
                <p className="mt-2 text-3xl font-medium numeric text-blue-900">${mockUser.wallet.balance.toFixed(2)}</p>
              </div>
              <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                <Wallet className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Winnings - Green */}
        <Card className="relative overflow-hidden border-none bg-linear-to-br from-green-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-100/50 blur-2xl transition-all group-hover:bg-green-200/50" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-900/60">Total Winnings</p>
                <p className="mt-2 text-3xl font-medium numeric text-green-900">+${mockUser.wallet.total_winnings.toFixed(2)}</p>
              </div>
              <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Losses - Red */}
        <Card className="relative overflow-hidden border-none bg-linear-to-br from-red-50 via-white to-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all cursor-pointer group">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-red-100/50 blur-2xl transition-all group-hover:bg-red-200/50" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-900/60">Total Losses</p>
                <p className="mt-2 text-3xl font-medium numeric text-red-900">-${mockUser.wallet.total_losses.toFixed(2)}</p>
              </div>
              <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-4 my-18"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsDepositModalOpen(true)}
          className="group flex h-11 cursor-pointer flex-1 items-center justify-center gap-2 rounded-xl bg-neutral-900 px-6 text-white shadow-md transition-all hover:bg-neutral-800 hover:shadow-lg"
        >
          <ArrowDownLeft className="h-4 w-4" />
          <span className="font-medium text-sm">Deposit Funds</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsWithdrawModalOpen(true)}
          className="group flex h-11 cursor-pointer flex-1 items-center justify-center gap-2 rounded-xl bg-white px-6 text-neutral-900 shadow-sm border border-neutral-200 transition-all hover:shadow-md hover:border-neutral-300"
        >
          <ArrowUpRight className="h-4 w-4" />
          <span className="font-medium text-sm">Withdraw Funds</span>
        </motion.button>
      </motion.div>

      {/* Visual Separator - Transaction History */}
      <div className="flex items-center gap-4 my-18">
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
        <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Transaction History</h2>
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-neutral-200 to-transparent"></div>
      </div>

      {/* Recent Transactions - Sleek List View */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <DashboardCard className="p-0">
          <CardHeader className="border-b border-gray-50 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900">
                <History className="h-5 w-5 text-gray-400" />
                Transaction History
              </CardTitle>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer transition-colors">
                View All <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="pt-2 px-0">
            <div className="divide-y divide-gray-50">
              {transactions.map((tx, index) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-gray-50 p-2.5 text-gray-600 transition-colors group-hover:bg-white group-hover:shadow-sm">
                      {getTransactionIcon(tx.type)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{tx.description}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-medium text-gray-400">
                          {new Date(tx.created_date).toLocaleDateString()}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-gray-200" />
                        <span className="text-xs font-medium text-gray-500 capitalize">{tx.type.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <p className={`text-sm font-medium numeric ${tx.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                      {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount)}
                    </p>
                    {getStatusBadge(tx.status)}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </DashboardCard>
      </motion.div>

      {/* Refined Deposit Modal */}
      <AnimatePresence>
        {isDepositModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
              <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-medium text-gray-900">Deposit Funds</h2>
                  <p className="text-sm text-gray-500">Add funds via USDT (TRC20)</p>
                </div>
                <button onClick={() => setIsDepositModalOpen(false)} className="rounded-full p-2 hover:bg-gray-200 transition-colors">
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="flex items-start gap-3 rounded-xl bg-blue-50 p-4 border border-blue-100">
                  <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-medium">Deposit Limits (Novice)</p>
                    <p className="mt-1 text-blue-700">Min: <span className="font-mono font-medium">$10</span> • Max: <span className="font-mono font-medium">$500</span></p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount to Deposit</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-lg">$</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 pl-8 text-2xl font-mono font-medium text-gray-900 outline-none transition-all focus:border-gray-900 focus:bg-white focus:ring-0 placeholder:text-gray-300"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setIsDepositModalOpen(false)}
                    className="flex-1 cursor-pointer rounded-xl px-4 py-2 font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDeposit}
                    className="flex-2 cursor-pointer rounded-xl bg-gray-900 px-6 py-2 font-medium text-white shadow-lg transition-all hover:bg-black"
                  >
                    Create Invoice
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Refined Withdraw Modal */}
      <AnimatePresence>
        {isWithdrawModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
              <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-medium text-gray-900">Withdraw Funds</h2>
                  <p className="text-sm text-gray-500">Cash out to crypto wallet</p>
                </div>
                <button onClick={() => setIsWithdrawModalOpen(false)} className="rounded-full p-2 hover:bg-gray-200 transition-colors">
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="flex items-start gap-3 rounded-xl bg-yellow-50 p-4 border border-yellow-100">
                  <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-900">
                    <p className="font-medium">Withdrawal Limits (Novice)</p>
                    <p className="mt-1 text-yellow-700">Min: <span className="font-mono font-medium">$10</span> • Max: <span className="font-mono font-medium">$250</span></p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount to Withdraw</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-lg">$</span>
                      <input
                        type="number"
                        placeholder="0.00"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 pl-8 text-2xl font-mono font-medium text-gray-900 outline-none transition-all focus:border-gray-900 focus:bg-white focus:ring-0 placeholder:text-gray-300"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">TRX Address</label>
                    <input
                      type="text"
                      placeholder="T..."
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-gray-900 outline-none transition-all focus:border-gray-900 focus:bg-white focus:ring-0 font-mono text-sm placeholder:text-gray-300"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setIsWithdrawModalOpen(false)}
                    className="flex-1 cursor-pointer rounded-xl px-4 py-2 font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleWithdraw}
                    className="flex-2 cursor-pointer rounded-xl bg-gray-900 px-6 py-2 font-medium text-white shadow-lg transition-all hover:bg-black"
                  >
                    Request Withdrawal
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
