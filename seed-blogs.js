const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://charanos:960sinned960@cluster0.vlidnbw.mongodb.net/antesocial?appName=Cluster0";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db("antesocial");
    const blogsCollection = database.collection("blogs");

    // Clear existing featured blogs (optional, to avoid duplicates)
    await blogsCollection.deleteMany({
      slug: { $in: ["introducing-ante-social", "understanding-amm", "community-governance"] }
    });

    const blogs = [
      {
        slug: "introducing-ante-social",
        title: "Introducing Ante Social: The Future of Prediction Markets",
        excerpt: "We're revolutionizing social betting with cutting-edge technology, game theory mechanics, and community-first design. Welcome to prediction markets reimagined.",
        content: `
          <h2>The Problem: Traditional Betting is Broken</h2>
          
          <p>Walk into any betting shop in Nairobi, Lagos, or Johannesburg and you'll see the same story: punters losing money to predatory odds while the house rakes in guaranteed profits. The game is rigged from the start.</p>
          
          <p>Online betting platforms promise convenience but deliver the same broken model wrapped in flashy mobile apps. Opaque operations, manipulated odds, and a house-always-wins mentality that treats users as revenue streams rather than participants in a fair marketplace.</p>
          
          <p>Meanwhile, prediction markets—platforms that should democratize forecasting and reward genuine insight—remain niche, hampered by terrible user experience, regulatory uncertainty, and liquidity so thin you can't place meaningful bets without moving the entire market.</p>
          
          <blockquote>
            "The best way to predict the future is to create it. At Ante Social, we're creating a future where your conviction matters more than the house edge."
          </blockquote>
          
          <h2>Enter Ante Social: Where Conviction Meets Capital</h2>
          
          <p><strong>We're building something fundamentally different.</strong> Not just another sportsbook with better odds. Not just another prediction market with slightly less friction. We're creating an entirely new category: social prediction markets that combine the best of game theory, behavioral economics, and community governance.</p>
          
          <img src="/dashboard-mockup.png" alt="Ante Social Dashboard - Your prediction market command center" />
          
          <h3>What Makes Us Different?</h3>
          
          <p><strong>Zero House Edge, Maximum Transparency</strong></p>
          <p>You're not betting against us. You're forecasting against the crowd. We take a minimal platform fee (2.5% on winning positions) to keep the lights on and fund development. That's it. Every other cent stays in the pool, distributed to those who predicted correctly.</p>
          
          <p>Compare that to traditional betting platforms that build in 15-30% house edges. On Ante Social, if the crowd thinks an outcome has a 60% chance of happening and you disagree, your expected value is determined purely by your insight—not by how much the house needs to extract.</p>
          
          <p><strong>Game Theory Meets Social Dynamics</strong></p>
          <p>We've taken classic game theory frameworks and transformed them into engaging betting mechanics:</p>
          
          <ul>
            <li><strong>The Prisoner's Dilemma:</strong> Cooperate or betray your fellow bettors. Trust can be profitable—or disastrous. Navigate the tension between individual incentives and collective outcomes in real-time markets where your choice affects everyone else's payoff.</li>
            
            <li><strong>Reflex Reaction:</strong> Bet against the crowd and earn multipliers for contrarian accuracy. When everyone zigs, you zag—and if you're right, you earn exponentially. The minority viewpoint pays premium returns, incentivizing genuine intellectual diversity rather than groupthink.</li>
            
            <li><strong>Consensus Ladder:</strong> Predict not just outcomes but exact sequences. Will Liverpool beat City by 2 goals, then United beat Chelsea by 1? Chain your predictions together for exponential returns. Miss one step? You fall off the ladder. High risk, massive reward.</li>
            
            <li><strong>Group Pools:</strong> Create private betting pools with friends, colleagues, or communities. Winner-takes-all formats, point systems, and custom rules. From office World Cup pools to fantasy league-style competition, we've got you covered.</li>
          </ul>
          
          <p><strong>Immutable Truth Through Decentralization</strong></p>
          <p>Market outcomes aren't decided by shadowy back-office employees or algorithms you can't audit. We leverage decentralized resolution mechanisms—weighted voting from high-reputation forecasters, oracle networks, and transparent appeals processes—to ensure absolute fairness.</p>
          
          <p>Every decision is recorded on an immutable ledger. Every vote is weighted by historical accuracy. Every appeal is handled through a tiered governance structure that empowers the community, not faceless administrators.</p>
          
          <h3>Built for Africa, Designed for the World</h3>
          
          <p>We started in Kenya because this is where the innovation happens. M-Pesa pioneered mobile money. SportPesa showed that Africans understand betting. Now Ante Social is showing that Africa can lead in prediction market design.</p>
          
          <p>Seamless M-Pesa integration means deposits in seconds. USDT support means borderless liquidity. Multi-currency pricing means you think in KES, USD, or whatever makes sense for your market.</p>
          
          <h2>This is Just the Beginning</h2>
          
          <p>We're launching with sports and politics—the categories people already know and love. But the future is broader: entertainment awards, economic indicators, weather patterns, product launches, social trends. Any outcome with a determinable result can become a market.</p>
          
          <p>Imagine forecasting quarterly earnings reports, betting on chart positions for new music releases, or predicting viral moments before they happen. The wisdom of crowds, properly structured and incentivized, consistently outperforms individual experts.</p>
          
          <p>The future of forecasting is social, transparent, and incredibly competitive. It's about aligning incentives, rewarding accuracy, and building a community that values insight over luck.</p>
          
          <p><strong>Welcome to Ante Social.</strong> Put your money where your conviction is.</p>
        `,
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        author: "Ante Team",
        coverImage: "/dashboard-mockup.png",
        tags: ["Announcements", "Product", "Vision"],
        status: "published",
        readTime: 6,
        views: 0
      },
      {
        slug: "understanding-amm",
        title: "How Our Automated Market Maker Actually Works",
        excerpt: "A deep dive into the mathematical engine that powers instant liquidity, fair pricing, and seamless trading on every market.",
        content: `
          <h2>The Liquidity Crisis in Prediction Markets</h2>
          
          <p>Here's the fundamental problem that kills most prediction markets: <em>liquidity</em>.</p>
          
          <p>You want to bet $1,000 on an election outcome. You find a market. The odds look reasonable. You click "place bet." Nothing happens. Why? Because there's no one on the other side willing to take your bet at that price.</p>
          
          <p>Traditional prediction markets use order books—lists of buy and sell orders waiting to be matched. This works great when you have millions of users. But for emerging markets, niche topics, or new platforms? You're stuck waiting for someone, anyone, to take the opposite side of your trade.</p>
          
          <p>The result? Stagnant markets. Frustrated users. Abandoned platforms.</p>
          
          <blockquote>
            "The best price is meaningless if you can't trade at it. Liquidity isn't a feature—it's the entire product."
          </blockquote>
          
          <h2>The Solution: Automated Market Makers</h2>
          
          <p>Instead of waiting for another human to match your trade, you trade against an algorithm. Not a casino house edge. Not a market maker skimming profits. A mathematical formula that adjusts prices based on supply and demand.</p>
          
          <p><strong>The Automated Market Maker (AMM) is always there, always ready to trade, always providing liquidity.</strong></p>
          
          <img src="https://images.unsplash.com/photo-1642790106117-e829e14a795f?q=80&w=1200&auto=format&fit=crop" alt="AMM Visualization - Mathematical precision meets market dynamics" />
          
          <h3>The Math: Simplified (But Still Powerful)</h3>
          
          <p>At its core, our AMM uses a modified <strong>Constant Product Formula</strong> adapted for multi-outcome prediction markets. Here's the intuition:</p>
          
          <p>Imagine a market with two outcomes: Team A wins, Team B wins. The AMM holds shares of both outcomes. When someone buys shares of "Team A wins," the supply of those shares decreases, so the price increases. Simultaneously, the supply of "Team B wins" shares increases relative to demand, so that price decreases.</p>
          
          <p>The formula ensures that the product of shares across all outcomes remains constant. This creates a smooth price curve: early buyers get better prices, later buyers pay more, and the price continuously reflects market sentiment.</p>
          
          <p><strong>For the math nerds:</strong></p>
          <p>We use <code>k = x * y * z * ...</code> where k is constant, and x, y, z represent share balances for each outcome. When you buy, you're solving for the new price point along this curve that maintains k after the trade.</p>
          
          <h3>Why This Changes Everything</h3>
          
          <p><strong>Infinite Liquidity</strong></p>
          <p>Want to bet $10? No problem. Want to bet $10,000? Still no problem. The AMM adjusts the price based on your order size, but it never refuses your trade. You're never stuck waiting for liquidity.</p>
          
          <p><strong>Real-Time Price Discovery</strong></p>
          <p>Prices instantly reflect crowd wisdom. As people buy an outcome, its probability increases. As people sell, it decreases. No lag, no waiting for orders to match. The market is always live.</p>
          
          <p><strong>Protection Against Slippage</strong></p>
          <p>Large orders get worse prices (you're moving the market), but the curve is smooth and predictable. You always know the exact price before you trade. No surprises, no hidden fees, no getting dumped on by whales.</p>
          
          <p><strong>Arbitrage Keeps Us Honest</strong></p>
          <p>If our AMM prices diverge from fair market value, arbitrageurs jump in to profit from the difference. Their trades push prices back toward equilibrium. This self-correcting mechanism ensures our odds stay competitive without manual intervention.</p>
          
          <h3>Beyond Basic AMMs: Our Innovations</h3>
          
          <p>We didn't just copy-paste a Uniswap fork. We've added several improvements tailored for prediction markets:</p>
          
          <ul>
            <li><strong>Dynamic Fee Adjustment:</strong> Fees decrease with liquidity depth, encouraging larger markets while protecting smaller ones from manipulation.</li>
            
            <li><strong>Liquidity Incentives:</strong> Early liquidity providers earn bonus fees, bootstrapping new markets faster.</li>
            
            <li><strong>Multi-Outcome Optimization:</strong> Our formula handles 2-outcome, 3-outcome, and even 10+ outcome markets with equal efficiency.</li>
            
            <li><strong>Slippage Caps:</strong> Maximum slippage limits protect users from accidentally making terrible trades during volatile periods.</li>
          </ul>
          
          <h3>Transparency in Action</h3>
          
          <p>Every trade updates the bonding curve in real-time. You can see exactly how much your bet will move the odds before you place it. You can calculate your potential returns with mathematical precision. No hidden formulas, no black boxes.</p>
          
          <p>The AMM isn't our secret advantage—it's <em>your</em> guarantee of fair pricing.</p>
          
          <h2>The Bottom Line</h2>
          
          <p>Whether you're betting 100 KES on a local football match or 100,000 KES on a presidential election, you're getting the fairest price possible dictated entirely by market forces—not by a bookmaker's profit margin.</p>
          
          <p>That's the power of AMMs. That's the future of prediction markets. That's Ante Social.</p>
        `,
        publishedAt: new Date(Date.now() - 86400000 * 2),
        createdAt: new Date(Date.now() - 86400000 * 2),
        updatedAt: new Date(Date.now() - 86400000 * 2),
        author: "Protocol Engineering",
        coverImage: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?q=80&w=1200&auto=format&fit=crop",
        tags: ["Engineering", "AMM", "Liquidity"],
        status: "published",
        readTime: 7,
        views: 0
      },
      {
        slug: "community-governance",
        title: "The Dawn of Community Governance in Prediction Markets",
        excerpt: "Empowering forecasters to curate markets, resolve disputes, and shape the future of the platform through reputation-weighted governance.",
        content: `
          <h2>The Central Authority Problem</h2>
          
          <p>Who decides which markets get created? Who resolves disputes when outcomes are ambiguous? Who determines what's fair when rules are unclear?</p>
          
          <p>In traditional betting and prediction platforms, these decisions flow from a central authority: the company running the platform. This creates fundamental problems:</p>
          
          <ul>
            <li><strong>Conflicts of Interest:</strong> The platform often has financial stakes in certain outcomes or market types.</li>
            <li><strong>Scaling Bottlenecks:</strong> Every market requires admin approval. Every dispute requires manual review. Growth is limited by headcount.</li>
            <li><strong>Lack of Local Context:</strong> A company in Silicon Valley can't properly curate markets about Kenyan politics, Nigerian entertainment, or South African rugby culture.</li>
            <li><strong>Trust Deficit:</strong> Users must trust that administrators are acting fairly, even when they can't see the decision-making process.</li>
          </ul>
          
          <p><strong>At Ante Social, we believe the community is the ultimate source of truth.</strong></p>
          
          <blockquote>
            "The wisdom of crowds works best when crowds have skin in the game. Governance isn't about democracy—it's about aligning incentives."
          </blockquote>
          
          <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop" alt="Community Governance - Power to the forecasters" />
          
          <h2>The Reputation-Weighted Governance System</h2>
          
          <p>We're introducing a tiered governance model where influence is earned through accuracy, not purchased through capital. Your voting power scales with your track record.</p>
          
          <h3>The Tier System</h3>
          
          <p><strong>Tier 1: Novice (0-500 Mastery Points)</strong></p>
          <p>Everyone starts here. You can participate in markets, but you're still building reputation. Focus on learning, making good predictions, and understanding market dynamics.</p>
          
          <p><strong>Tier 2: High Roller (500-2,500 MP)</strong></p>
          <p>You've proven you can forecast accurately. Now you can propose new markets. Your suggestions go to a community vote weighted by reputation.</p>
          
          <p><strong>Tier 3: Whale (2,500-10,000 MP)</strong></p>
          <p>You're in the top tier of forecasters. You can participate in dispute resolution, vote on market outcomes when they're ambiguous, and earn fees for providing oracle services.</p>
          
          <p><strong>Tier 4: Legend (10,000+ MP)</strong></p>
          <p>Reserved for the absolute best. You can propose protocol upgrades, participate in high-stakes arbitration, and shape the platform's future direction.</p>
          
          <h3>How Mastery Points Work</h3>
          
          <p>Mastery Points aren't just about wins. They're about <em>calibrated accuracy</em>:</p>
          
          <ul>
            <li>Win a bet everyone else won? Small MP gain.</li>
            <li>Win a bet as part of a small, correct minority? Massive MP gain.</li>
            <li>Consistently predict 60% outcomes correctly 60% of the time? Big MP bonus for calibration.</li>
            <li>Make wild, lucky guesses that occasionally hit? Minimal MP growth.</li>
          </ul>
          
          <p>We're measuring genuine forecasting skill, not just bankroll growth.</p>
          
          <h3>The Syndicate Resolution Protocol</h3>
          
          <p>When markets have clear outcomes (sports scores, election results, public announcements), resolution is automatic. But some outcomes are subjective or contested. That's where Syndicates come in.</p>
          
          <p><strong>How it works:</strong></p>
          
          <ol>
            <li><strong>Dispute Flagging:</strong> Any user can flag a market as incorrectly resolved by staking 100 MP. Frivolous flags lose the stake.</li>
            
            <li><strong>Syndicate Formation:</strong> The platform randomly selects 7-21 high-reputation forecasters (Tier 3+) to review the dispute. Selection is weighted by MP and relevant category expertise.</li>
            
            <li><strong>Evidence Review:</strong> Syndicate members review evidence, arguments from both sides, and relevant documentation. They have 48 hours to deliberate.</li>
            
            <li><strong>Weighted Voting:</strong> Each Syndicate member votes, with votes weighted by their MP and accuracy in similar markets. A 67% supermajority is required to overturn the original resolution.</li>
            
            <li><strong>Stake-Based Accountability:</strong> Syndicate members stake MP on their votes. If the resolution is later proven wrong (through new evidence or appeals), voters on the wrong side lose their stake.</li>
          </ol>
          
          <p>This creates a system where the most knowledgeable, most accurate forecasters make the hardest calls—and they're directly accountable for getting it right.</p>
          
          <h3>Market Curation by the Community</h3>
          
          <p><strong>Anyone can propose a market.</strong> But whether it goes live depends on community approval:</p>
          
          <ul>
            <li>Tier 2+ users submit market proposals with clear resolution criteria and evidence sources.</li>
            <li>The proposal goes to a 24-hour voting period.</li>
            <li>Voters stake MP on their approval/rejection vote.</li>
            <li>If the market passes and performs well (high volume, clear resolution, no disputes), approving voters earn MP.</li>
            <li>If the market fails (low volume, disputes, unclear rules), approving voters lose MP.</li>
          </ul>
          
          <p>This aligns incentives perfectly: curators are rewarded for green-lighting good markets and punished for approving bad ones.</p>
          
          <h3>Appeals: The Final Safeguard</h3>
          
          <p>Even Syndicates can make mistakes. That's why we have a three-tier appeal system:</p>
          
          <ol>
            <li><strong>Standard Appeal (100 MP stake):</strong> Reviewed by a fresh Syndicate of different members.</li>
            <li><strong>Expert Appeal (500 MP stake):</strong> Reviewed by Tier 4 Legends only, with additional evidence requirements.</li>
            <li><strong>Protocol Appeal (2,000 MP stake):</strong> Final review by the core team + elected community representatives. Used only for protocol-breaking edge cases.</li>
          </ol>
          
          <p>Each level requires stronger evidence and higher stakes, preventing endless appeals while ensuring genuine mistakes get corrected.</p>
          
          <h2>Why This Matters</h2>
          
          <p>By shifting power to our most active and accurate users, we're building a resilient ecosystem that:</p>
          
          <ul>
            <li><strong>Scales Globally:</strong> Local experts curate local markets. No San Francisco office deciding what Nigerians care about.</li>
            <li><strong>Maintains Context:</strong> Cultural nuances, local knowledge, and community standards are enforced by the community itself.</li>
            <li><strong>Builds Trust:</strong> Every decision is transparent. Every vote is recorded. Every outcome is verifiable.</li>
            <li><strong>Rewards Expertise:</strong> The best forecasters earn real influence and real income from oracle services.</li>
          </ul>
          
          <h2>The Long Game</h2>
          
          <p>We're not just building a betting platform. We're building a decentralized forecasting infrastructure where the wisdom of crowds, properly incentivized and structured, becomes the most reliable source of truth about future events.</p>
          
          <p>Where reputation is earned through accuracy, not bought through capital. Where governance is merit-based, not plutocratic. Where the community doesn't just use the platform—they <em>are</em> the platform.</p>
          
          <p><strong>Welcome to the future of community-governed prediction markets.</strong></p>
        `,
        publishedAt: new Date(Date.now() - 86400000 * 5),
        createdAt: new Date(Date.now() - 86400000 * 5),
        updatedAt: new Date(Date.now() - 86400000 * 5),
        author: "Community Lead",
        coverImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop",
        tags: ["Community", "Governance", "Trust"],
        status: "published",
        readTime: 8,
        views: 0
      }
    ];

    const result = await blogsCollection.insertMany(blogs);
    console.log("✅ Successfully inserted " + result.insertedCount + " enhanced blog posts.");
    console.log("📊 Total reading time:", blogs.reduce((sum, blog) => sum + blog.readTime, 0), "minutes");
  } finally {
    await client.close();
  }
}

run().catch(console.dir);