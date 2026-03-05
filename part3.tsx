          {/* Recent Activity */}
          {!isClosed && (
            <div className="space-y-6 pt-8">
              <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  <IconEye className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Recent Activity
                  </h3>
                  <p className="text-sm text-slate-500 font-medium">
                    Live updates from other players
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {market.participants && market.participants.length > 0 ? (
                    market.participants.map((participant: any, idx: number) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + idx * 0.05 }}
                        className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <UserAvatar 
                            name={participant.username || "Anonymous"} 
                            size="md" 
                            border={false}
                          />
                          <div>
                            <p className="text-base font-bold text-slate-900">
                              {participant.username || "Anonymous"}
                            </p>
                            <p className="text-sm text-slate-500 font-medium">
                              Made a prediction
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-base font-bold font-mono text-slate-900">
                            {formatCurrency(participant.total_stake)}
                          </p>
                          <p className="text-sm text-slate-400 font-medium">
                            {new Date(participant.timestamp).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="py-12 px-6 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50"
                    >
                      <IconGhost className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <h4 className="text-lg font-bold text-slate-700 mb-1">
                        Much Empty
                      </h4>
                      <p className="text-slate-500 font-medium">
                        Be the first to predict in this market!
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 lg:self-start space-y-6">
          <div className="lg:sticky lg:top-8 z-40 h-fit space-y-6 transition-all duration-300">
            {isClosed ? (
              <>
                {/* Closed Market Notice */}
                <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <IconTrophy className="w-6 h-6 text-amber-400" />
                    <h3 className="text-lg font-bold">Market Resolved</h3>
                  </div>
                  <p className="text-slate-300 text-sm font-medium leading-relaxed mb-6">
                    This market has concluded and winnings have been distributed to the victors. Check the leaderboard below to see who came out on top!
                  </p>
                  
                  <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Final Pool Value</p>
                    <p className="text-2xl font-mono font-bold text-white tracking-tight">{formatCurrency(market.total_pool)}</p>
                  </div>
                </div>

                {/* Leaderboard */}
                <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-900">Top Participants</h3>
                    <div className="px-3 py-1 bg-slate-100 rounded-full">
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Final</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {sortedParticipants.slice(0, 5).map((player: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className={\`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-sm \${
                          idx === 0 ? 'bg-amber-100 text-amber-700' :
                          idx === 1 ? 'bg-slate-200 text-slate-700' :
                          idx === 2 ? 'bg-orange-100 text-orange-800' :
                          'bg-slate-50 text-slate-500'
                        }\`}>
                          {idx + 1}
                        </div>
                        <UserAvatar name={player.username || "Anonymous"} size="sm" border={false} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">{player.username}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-mono font-bold text-slate-900">{formatCurrency(player.total_stake)}</p>
                        </div>
                      </div>
                    ))}
                    {sortedParticipants.length === 0 && (
                      <div className="text-center py-6 text-slate-500 text-sm font-medium">
                        No participants in this market
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Prediction Result / Slip */}
                {predictionResult ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white border border-emerald-100 shadow-[0_20px_60px_-15px_rgba(16,185,129,0.2)] rounded-3xl overflow-hidden"
                  >
                    <div className="p-8 bg-emerald-500 text-white text-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-[32px] translate-x-1/2 -translate-y-1/2" />
                      <IconCircleCheckFilled className="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
                      <h3 className="text-2xl font-bold mb-1">Prediction Secured</h3>
                      <p className="text-sm text-emerald-100 font-medium">Receipt ID: {predictionResult.transactionId?.slice(-8).toUpperCase()}</p>
                    </div>
                    <div className="p-8 space-y-5 bg-white">
                      <div className="flex justify-between items-center py-3 border-b border-slate-100">
                        <span className="text-sm text-slate-500 font-semibold uppercase tracking-wider">Outcome</span>
                        <span className="text-base font-bold text-emerald-600">{predictionResult.optionText}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-slate-100">
                        <span className="text-sm text-slate-500 font-semibold uppercase tracking-wider">Stake</span>
                        <span className="text-lg font-bold font-mono text-slate-900">{formatCurrency(predictionResult.amount)}</span>
                      </div>
                      <div className="flex justify-between items-center py-3">
                         <span className="text-sm text-slate-400 font-semibold uppercase tracking-wider">Platform Fee</span>
                         <span className="text-sm font-bold font-mono text-slate-500">{formatCurrency(predictionResult.amount * 0.05)}</span>
                      </div>
                      <button 
                        onClick={() => setPredictionResult(null)}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all mt-6 shadow-lg shadow-slate-900/20"
                      >
                        Dismiss
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* Prediction Placement Card */
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white border border-slate-200 shadow-xl space-y-6 rounded-3xl overflow-hidden"
                  >
                    {/* Header */}
                    <div className="p-8 bg-slate-900 text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-[32px] translate-x-1/2 -translate-y-1/2 mix-blend-screen" />
                      <h3 className="text-2xl font-bold mb-2 relative z-10">
                        Place Your Prediction
                      </h3>
                      <p className="text-sm text-slate-300 font-medium relative z-10">
                        Predict the crowd's reflex
                      </p>
                    </div>
    
                    {/* Content */}
                    <div className="space-y-6 px-8 py-6">
                      {/* Selected Option */}
                      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3">
                          Selected Prediction
                        </span>
                        <div className="flex items-center gap-3">
                          {selectedOption ? (
                            <>
                              <div className="p-2 rounded-xl bg-indigo-100">
                                <IconCircleCheckFilled className="w-5 h-5 text-indigo-600" />
                              </div>
                              <span className="text-xl font-bold text-indigo-600">
                                {
                                  market.options.find(
                                    (o: any) => o.id === selectedOption,
                                  )?.option_text
                                }
                              </span>
                            </>
                          ) : (
                            <span className="text-base text-slate-400 font-medium flex items-center gap-2">
                              No option selected
                            </span>
                          )}
                        </div>
                      </div>
    
                      {/* Stake Input */}
                      <div className="space-y-4 pt-2">
                        <label className="text-sm font-bold text-slate-700">
                          Your Stake
                        </label>
                        <div className="relative group">
                          <input
                            type="number"
                            placeholder={formatCurrency(market.buy_in_amount)}
                            min={market.buy_in_amount}
                            value={stakeAmount}
                            onChange={(e) => setStakeAmount(e.target.value)}
                            className="w-full px-5 py-4 pr-16 bg-white border-2 border-slate-200 rounded-2xl text-lg font-mono font-bold text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-300"
                          />
                          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-base font-bold text-slate-400">
                            {symbol}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm px-1">
                          <span className="text-slate-500 font-medium">
                            Minimum buy-in
                          </span>
                          <span className="font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                            {formatCurrency(market.buy_in_amount)}
                          </span>
                        </div>
                      </div>
    
                      {/* Summary */}
                      <div className="pt-6 border-t border-slate-100 space-y-4 bg-slate-50/50 -mx-8 px-8 pb-8 -mb-6 mt-6">
                        <div className="flex justify-between text-sm mt-6">
                          <span className="text-slate-500 font-bold uppercase tracking-wider">
                            Platform Fee (5%)
                          </span>
                          <span className="font-mono font-bold text-slate-600">
                            {formatCurrency(platformFeeKsh)}
                          </span>
                        </div>
                        <div className="flex justify-between text-lg items-center">
                          <span className="text-slate-900 font-bold">
                            Total Amount
                          </span>
                          <span className="font-mono font-black text-blue-600 text-2xl">
                            {formatCurrency(totalAmountKsh)}
                          </span>
                        </div>
      
                        {/* CTA Button */}
                        <motion.button
                          onClick={handlePlacePrediction}
                          disabled={isSubmitting || !selectedOption || !stakeAmount}
                          className={\`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all mt-6 \${
                            isSubmitting || !selectedOption || !stakeAmount
                              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                              : "bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-600/20 cursor-pointer"
                          }\`}
                          whileHover={
                            !isSubmitting && selectedOption && stakeAmount
                              ? { scale: 1.02 }
                              : {}
                          }
                          whileTap={
                            !isSubmitting && selectedOption && stakeAmount
                              ? { scale: 0.98 }
                              : {}
                          }
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              Confirm Prediction
                              <IconArrowRight className="w-6 h-6" />
                            </>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </>
            )}

            {/* Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-3xl bg-blue-50 border border-blue-100/50 shadow-inner"
            >
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <IconShield className="w-5 h-5 text-blue-600" />
                </div>
                <div className="space-y-2">
                  <p className="text-base font-bold text-blue-900">
                    How it works
                  </p>
                  <p className="text-sm text-blue-800/80 font-medium leading-relaxed">
                    Winners split the prize pool proportionally based on their
                    stake. All payouts are processed instantly when the market
                    closes.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
