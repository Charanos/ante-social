  return (
    <div className="space-y-6 md:space-y-10 pb-12 pl-0 md:pl-8 overflow-x-hidden w-full max-w-[100vw] px-2">
      <DashboardHeader user={user} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-8 lg:space-y-12">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 border border-slate-800 shadow-2xl"
          >
            {/* Background Glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px] mix-blend-screen" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px] mix-blend-screen" />

            <div className="relative p-8 md:p-12 pb-16">
              {/* Badges */}
              <div className="flex items-center gap-3 mb-8">
                <div className="px-4 py-1.5 rounded-full flex items-center bg-white/10 backdrop-blur-md border border-white/10">
                  <span className="text-xs font-bold text-white uppercase tracking-widest">
                    {market.category}
                  </span>
                </div>
                <div
                  className={\`flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md border \${
                    isClosed
                      ? "bg-slate-800/80 border-slate-700"
                      : "bg-emerald-500/20 border-emerald-500/30"
                  }\`}
                >
                  {!isClosed && (
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                  <span
                    className={\`text-xs font-bold uppercase tracking-widest \${
                      isClosed ? "text-slate-300" : "text-emerald-300"
                    }\`}
                  >
                    {isClosed ? "Closed" : "Live"}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="max-w-3xl space-y-6 relative z-10 w-full lg:w-3/5">
                <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                  {market.title}
                </h2>
                <p className="text-lg text-slate-300 font-medium leading-relaxed">
                  {market.description}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-12 relative z-10">
                <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <IconTrendingUp className="w-5 h-5 text-emerald-400" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Total Pool
                    </span>
                  </div>
                  <p className="text-2xl md:text-3xl font-bold font-mono text-white">
                    {formatCurrency(market.total_pool)}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <IconUsers className="w-5 h-5 text-blue-400" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Players
                    </span>
                  </div>
                  <p className="text-2xl md:text-3xl font-bold font-mono text-white">
                    {market.participant_count}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors col-span-2 md:col-span-1">
                  <div className="flex items-center gap-2 mb-3">
                    <IconClock className="w-5 h-5 text-purple-400" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {isClosed ? "Finalized" : "Time Left"}
                    </span>
                  </div>
                  <p className="text-2xl md:text-3xl font-bold font-mono text-white">
                    {isClosed
                      ? new Date(market.close_date).toLocaleDateString()
                      : getTimeRemaining()}
                  </p>
                </div>
              </div>
            </div>

            {/* Overlapping Hero Image */}
            <div className="absolute right-0 top-0 bottom-0 w-2/5 hidden lg:block opacity-60 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700">
              <div className="absolute inset-0 bg-linear-to-r from-slate-900 via-transparent to-transparent z-10" />
              <img
                src={market.image}
                alt={market.title}
                className="w-full h-full object-cover object-center"
              />
            </div>
            {/* Mobile Hero Image Background */}
            <div className="absolute inset-0 lg:hidden opacity-20 pointer-events-none">
              <div className="absolute inset-0 bg-slate-900/80 z-10" />
              <img
                src={market.image}
                alt={market.title}
                className="w-full h-full object-cover object-center"
              />
            </div>
          </motion.div>

          {!isClosed ? (
            <div className="space-y-8">
              {/* Scenario Box */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="p-8 rounded-[2.5rem] bg-indigo-50 border border-indigo-100/50 shadow-inner"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center">
                    <IconBolt className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-widest mb-2">
                      The Scenario
                    </h3>
                    <p className="text-lg font-medium text-indigo-900/80 leading-relaxed">
                      {market.scenario}
                    </p>
                    <p className="text-sm text-indigo-700 mt-3 font-semibold flex items-center gap-2">
                      <IconAccessPoint className="w-4 h-4" />
                      Reflex check: You have moments to decide. What will the majority choose?
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Visual Separator */}
              <div className="flex items-center gap-4 py-4">
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-slate-300 to-transparent"></div>
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest bg-slate-50 px-4 rounded-full">
                  Quick Reactions
                </h2>
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-slate-300 to-transparent"></div>
              </div>

              {/* Options */}
              <div className="space-y-4">
                {market.options.map((option: any, index: number) => {
                  const isSelected = selectedOption === option.id;

                  return (
                    <motion.div
                      key={option.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      onClick={() => setSelectedOption(option.id)}
                      className={\`group relative p-6 rounded-3xl transition-all duration-300 cursor-pointer \${
                        isSelected
                          ? "bg-indigo-50 border-2 border-indigo-500 shadow-[0_16px_48px_-8px_rgba(99,102,241,0.25)]"
                          : "bg-white border-2 border-slate-100 hover:border-indigo-300 hover:bg-indigo-50/50 shadow-sm hover:shadow-md"
                      }\`}
                    >
                      <div className="flex items-center gap-5">
                        <div className={\`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-colors \${
                          isSelected ? "bg-indigo-100 ring-4 ring-indigo-50" : "bg-slate-100 group-hover:bg-indigo-100"
                        }\`}>
                          <option.icon className={\`w-7 h-7 \${isSelected ? 'text-indigo-600' : 'text-slate-500 group-hover:text-indigo-600'}\`} />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className={\`text-xl font-bold \${isSelected ? 'text-indigo-900' : 'text-slate-900 group-hover:text-indigo-900'}\`}>
                              {option.option_text}
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold font-mono text-slate-500 group-hover:text-indigo-600 transition-colors">
                                {option.percentage}%
                              </span>
                              {isSelected && (
                                <IconCircleCheckFilled className="w-6 h-6 text-indigo-600" />
                              )}
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="space-y-1.5">
                            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: \`\${option.percentage}%\` }}
                                transition={{
                                  duration: 1,
                                  ease: "easeOut",
                                  delay: 0.3 + index * 0.05,
                                }}
                                className={\`h-full rounded-full \${
                                  isSelected ? "bg-indigo-500" : "bg-slate-300 group-hover:bg-indigo-400"
                                }\`}
                              />
                            </div>
                            <span className="text-sm text-slate-500 font-semibold block uppercase tracking-wider">
                              {option.votes} predictions
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Closed State - Market Resolution */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 md:p-12 rounded-[2.5rem] bg-white border border-slate-200 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                  <IconTrophy className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Market Resolution
                  </h3>
                  <p className="text-slate-500 font-medium">
                    The final outcome has been decided
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="h-[300px] w-full relative">
                  {market.options && market.options.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={market.options}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={120}
                          paddingAngle={2}
                          dataKey="pool_amount"
                          stroke="none"
                        >
                          {market.options.map((entry: any, index: number) => {
                            const isWinning = winningOutcomeId === entry.id;
                            const colors = ["#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"];
                            return (
                              <Cell
                                key={\`cell-\${index}\`}
                                fill={isWinning ? "#4f46e5" : colors[index % colors.length]}
                                opacity={isWinning ? 1 : 0.6}
                              />
                            );
                          })}
                        </Pie>
                        <RechartsTooltip
                          formatter={(value: any) => formatCurrency(value)}
                          contentStyle={{
                            borderRadius: "16px",
                            border: "none",
                            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                            fontWeight: "bold",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400 font-medium">
                      No data available
                    </div>
                  )}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-1">
                      Winning Move
                    </span>
                    <span className="text-3xl font-bold text-slate-900 text-center px-4 leading-tight">
                      {market.options?.find((o:any) => o.id === winningOutcomeId)?.option_text?.toUpperCase() || 'UNKNOWN'}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-slate-900 mb-4">
                    Reflex Breakdown
                  </h4>
                  {market.options?.map((opt: any) => {
                    const isWinning = winningOutcomeId === opt.id;
                    const percentage = totalVotes > 0 ? ((opt.pool_amount || 0) / totalVotes) * 100 : 0;
                    
                    return (
                      <div
                        key={opt.id}
                        className={\`p-4 rounded-2xl border \${
                          isWinning
                            ? "border-indigo-200 bg-indigo-50/50"
                            : "border-slate-100 bg-slate-50"
                        }\`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            {isWinning && (
                              <IconTrophy className="w-4 h-4 text-indigo-600" />
                            )}
                            <span className="font-bold text-slate-900">
                              {opt.option_text}
                            </span>
                          </div>
                          <span className="font-mono font-bold text-slate-900">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 mb-2 overflow-hidden">
                          <div
                            className={\`h-2 rounded-full \${
                              isWinning 
                                ? "bg-indigo-600" 
                                : "bg-slate-400"
                            }\`}
                            style={{ width: \`\${percentage}%\` }}
                          />
                        </div>
                        <div className="text-sm font-medium text-slate-500">
                          {formatCurrency(opt.pool_amount || 0)} staked
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
