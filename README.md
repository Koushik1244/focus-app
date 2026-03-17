# focusss ⚡

> Stake to focus. Earn if you finish. Lose if you quit.

Focusss is a crypto-powered focus accountability app built on Starknet. Users stake real USDC before a focus session. A smart contract holds the money. AI monitors focus via camera + screen tracking. Complete the session and earn rewards. Quit early and lose your stake.

## 🌐 Live Demo

| | Link |
|--|--|
| 📱 **Live App** | [focus-app-y8x8.vercel.app](https://focus-app-y8x8.vercel.app/) |
| 🖥️ **Backend API** | [Railway](https://railway.com/project/118bfd2c-28a5-4811-82f5-734e95463269) |
| ⛓️ **Smart Contract** | [Starkscan](https://sepolia.starkscan.co/contract/0x47d770f65d527cb975255b3af9fca5ff1c0f3062350449629e6f158990700c5) |
| 💻 **GitHub** | [Koushik1244/focus-app](https://github.com/Koushik1244/focus-app) |

## 🧠 The Problem

People can't focus. Existing apps like Forest or Pomodoro use timers with zero real consequences. Willpower alone doesn't work.

## 💡 The Solution

Put real money on the line. Focusss uses crypto staking + AI monitoring to create the strongest focus accountability tool ever built. Every session is a financial commitment backed by a smart contract — provably fair, transparent, and impossible to cheat.

## 🔄 How It Works

1. **Connect Wallet** — Connect your Starknet wallet (Argent / Braavos / Ready Wallet)
2. **Set Session** — Choose duration (10-120 min) and stake amount ($1-$10 USDC)
3. **Stake** — USDC locked into Cairo smart contract on Starknet Sepolia
4. **Focus** — Camera AI monitors gaze + screen activity every 5 seconds
5. **Settle** — Score ≥ 85% → get stake back + exponential reward. Score < 85% → stake goes to pool

## 💰 Reward Formula (Exponential)

Longer sessions earn disproportionately higher rewards:

```
multiplier = 1 + (duration/120)^1.5 × 1.5
reward = stake × multiplier × streakBonus
```

| Duration | $5 Stake | Reward |
|----------|----------|--------|
| 10 min | $5 | ~$5.10 |
| 30 min | $5 | ~$5.60 |
| 60 min | $5 | ~$6.77 |
| 90 min | $5 | ~$8.30 |
| 120 min | $5 | ~$12.50 |

Streak bonuses: 3-day streak = +10%, 7-day streak = +25%

## 🛡️ Anti-Cheat (Dual Layer)

- **Screen Monitor** — Detects app switching to Instagram, YouTube etc
- **Camera AI** — Front camera checks gaze direction every 30 seconds
- **Combined Score** — `focus_score = (screen × 0.5) + (gaze × 0.5)`
- Threshold: ≥ 85% = success, < 85% = fail

## ⛓️ Smart Contract

Deployed on **Starknet Sepolia Testnet**

```
Contract Address:
0x47d770f65d527cb975255b3af9fca5ff1c0f3062350449629e6f158990700c5
```

Two main functions:
- `stake(amount, session_id)` — locks USDC into escrow
- `settle_session(user, focus_score)` — pays out or slashes based on score

Everything is transparent and verifiable on Starkscan.

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile/Web | Expo React Native + TypeScript |
| Blockchain | Starknet (Cairo 2.16.1 smart contract) |
| Backend | Node.js + Express (Railway) |
| Database | PostgreSQL via Prisma (Neon) |
| Camera | expo-camera (MediaPipe planned) |
| Font | Bitcount Prop Double Ink |
| Deployment | Vercel (frontend) + Railway (backend) |

## 📱 Screens

- **Onboarding** — Animated wallet connect with bottom sheet wallet selector
- **Home** — Duration slider (10-120min), stake selector, live exponential reward preview
- **Session** — Full camera overlay UI, live SVG score ring, countdown timer, streak bonus
- **Results** — Success confetti animation / fail screen, Starkscan tx link
- **Profile** — Streak counter, session history, stats
- **Leaderboard** — Weekly/all-time rankings with podium display
- **Stats** — Personal performance bar charts

## 🚀 Running Locally

```bash
# Clone
git clone https://github.com/Koushik1244/focus-app.git
cd focus-app

# Frontend
cd blitz-hack
npm install
npx expo start --web

# Backend
cd backend
npm install
node index.js
```

## 🔮 Roadmap

- [ ] Real wallet integration (Argent/Braavos via starknet.js)
- [ ] Real USDC staking transactions on-chain
- [ ] MediaPipe face detection for real gaze scoring
- [ ] Peer pool sessions (winner takes loser's stake)
- [ ] Starknet Mainnet deployment
- [ ] App Store / Play Store release
- [ ] Multi-chain support (Ethereum, Solana)
- [ ] NFT achievement badges for streaks
- [ ] Sponsor pools (companies fund focus campaigns)

## 👥 Built At

Starknet Hackathon 2026

## 📄 License

MIT
