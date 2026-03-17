# focusss ⚡

> Stake to focus. Earn if you finish. Lose if you quit.

Focusss is a crypto-powered focus accountability app built on Starknet. Users stake real USDC before a focus session. A smart contract holds the money. AI monitors focus via camera + screen tracking. Complete the session and earn rewards. Quit early and lose your stake.

## 🎥 Demo

[Live Demo] | [Demo Video] | [Starkscan Contract](https://sepolia.starkscan.co/contract/0x47d770f65d527cb975255b3af9fca5ff1c0f3062350449629e6f158990700c5)

## 🧠 The Problem

People can't focus. Existing apps like Forest or Pomodoro use timers with zero real consequences. Willpower alone doesn't work.

## 💡 The Solution

Put real money on the line. Focusss uses crypto staking + AI monitoring to create the strongest focus accountability tool ever built.

## 🔄 How It Works

1. **Connect Wallet** — Connect your Starknet wallet (Argent/Braavos/Ready Wallet)
2. **Set Session** — Choose duration (10-120 min) and stake amount ($1-$10 USDC)
3. **Stake** — USDC locked into Cairo smart contract on Starknet Sepolia
4. **Focus** — Camera AI monitors gaze + screen activity every 5 seconds
5. **Settle** — Score ≥ 85% → get stake back + exponential reward. Score < 85% → stake goes to pool

## 💰 Reward Formula (Exponential)

```
multiplier = 1 + (duration/120)^1.5 × 1.5
reward = stake × multiplier × streakBonus
```

| Duration | Stake | Reward |
|----------|-------|--------|
| 10 min | $5 | ~$5.10 |
| 30 min | $5 | ~$5.60 |
| 60 min | $5 | ~$6.77 |
| 90 min | $5 | ~$8.30 |
| 120 min | $5 | ~$12.50 |

Longer sessions = bigger multiplier. Streaks add 10-25% bonus.

## 🛡️ Anti-Cheat (Dual Layer)

- **Screen Monitor** — Detects app switching to Instagram, YouTube etc
- **Camera AI** — Front camera checks gaze direction every 30 seconds
- **Combined Score** — `focus_score = (screen × 0.5) + (gaze × 0.5)`
- Threshold: ≥ 85% = success, < 85% = fail

## ⛓️ Smart Contract

Deployed on **Starknet Sepolia Testnet**

```
Contract: 0x47d770f65d527cb975255b3af9fca5ff1c0f3062350449629e6f158990700c5
```

Two main functions:
- `stake(amount, session_id)` — locks USDC into escrow
- `settle_session(user, focus_score)` — pays out or slashes based on score

Everything is transparent and verifiable on [Starkscan](https://sepolia.starkscan.co/contract/0x47d770f65d527cb975255b3af9fca5ff1c0f3062350449629e6f158990700c5)

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile | Expo React Native + TypeScript |
| Blockchain | Starknet (Cairo smart contract) |
| Backend | Node.js + Express |
| Database | PostgreSQL (Prisma) |
| Camera AI | expo-camera (MediaPipe planned) |
| Wallet | Ready Wallet / Argent / Braavos (WIP) |

## 📱 Screens

- **Onboarding** — Wallet connect with bottom sheet wallet selector
- **Home** — Duration slider, stake selector, exponential reward preview
- **Session** — Full camera overlay, live focus score ring, countdown timer
- **Results** — Success/fail with confetti animation, Starkscan tx link
- **Profile** — Streak counter, session history, stats
- **Leaderboard** — Weekly/all-time rankings
- **Stats** — Personal performance charts

## 🔮 Roadmap

- [ ] Real wallet integration (Argent/Braavos via starknet.js)
- [ ] Real USDC staking transactions
- [ ] MediaPipe face detection for real gaze scoring
- [ ] Peer pool sessions (winner takes loser's stake)
- [ ] Mainnet deployment
- [ ] App Store / Play Store release
- [ ] Multi-chain support
- [ ] NFT achievement badges

## 🚀 Running Locally

```bash
# Frontend
cd blitz-hack
npx expo start --web

# Backend
cd backend
node index.js
```

## 👥 Team

Built at [Hackathon Name] 2026

## 📄 License

MIT
