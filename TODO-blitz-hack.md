# Blitz Hack TODO.md (Hackathon Tracker)

**Status: 🟡 In Progress | ⬜ TODO | ✅ Done | 🔴 Blocked**

## 📋 Hackathon MVP (2hr target)

### **Phase 1: Mobile Core (60min)**
- [x] **Setup** Expo blank-typescript + navigation  
- [x] **Skeletons** App.tsx + HomeScreen/SessionScreen placeholders  
- [⬜] **HomeScreen** Wallet connect + START button (15min)  
- [⬜] **SessionScreen** 5min timer + fake focus score (20min)  
- [⬜] **Backend** Simple session storage API (10min)  

### **Phase 2: On-Chain Demo (45min)**
- [⬜] **Cairo contract** Escrow: stake → settle(focusScore) (20min)  
- [⬜] **StarkZap** Connect → approveUSDC → stake 1$ (15min)  
- [⬜] **Settle** Backend signs → contract claims reward (10min)  

### **Phase 3: Demo Polish (15min)**
- [⬜] **Results screen** "✅ +$1.20 (120% bonus)"  
- [⬜] **Screenshots** 3 key flows for slides  
- [⬜] **Demo script** 90sec pitch  

---

## 🏗️ Technical Stack

```
✅ [DONE] mobile/     Expo RN + TypeScript
✅ [DONE] backend/    Node/Express  
⬜ [TODO] contracts/  Cairo + Scarb
⬜ [TODO] StarkZap    Wallet + staking SDK
```

**Dependencies needed:**
```
⬜ expo-camera          # Monitoring
⬜ @mediapipe/tasks-vision # Gaze detection  
⬜ starkzap             # Starknet wallet
⬜ prisma              # Backend DB
```

---

## 📱 Screen-by-Screen

```
✅ [DONE] App.tsx       (Navigation)
✅ [DONE] HomeScreen.tsx (Placeholder) 
✅ [DONE] SessionScreen.tsx (Placeholder)

⬜ [TODO] HomeScreen    StarkZap connect + START
⬜ [TODO] SessionScreen Timer + screen monitor  
⬜ [TODO] ResultsScreen Victory + claim rewards
⬜ [TODO] ProfileScreen Streaks + history
```

---

## 🔗 File Structure Target
```
blitz-hack/
├── 📱 mobile/
│   ├── src/
│   │   ├── screens/     ✅ Done
│   │   ├── hooks/       ⬜ useFocusMonitor
│   │   ├── components/  ⬜ Timer, ScoreBar
│   │   └── theme.ts     ⬜ Design tokens
├── 🖥️ backend/         ✅ Running
├── ⚡ contracts/       ⬜ Cairo escrow
├── 📄 docs/           ✅ PRD + Design + TODO
└── README.md          ⬜ Demo GIF
```

---

## ⏱️ Timeboxed Tasks (Hackathon)

**4:25PM - 4:40PM** → HomeScreen wallet (15min)  
**4:40PM - 5:00PM** → SessionScreen timer (20min)  
**5:00PM - 5:20PM** → Cairo contract deploy (20min)  
**5:20PM - 5:35PM** → StarkZap stake flow (15min)  
**5:35PM - 5:45PM** → Demo recording (10min)  

---

## 🚨 Success Criteria (Judges)
- [ ] ✅ **Live demo**: Wallet → Stake $1 → 5min focus → Claim reward  
- [ ] ✅ **On-chain**: Tx hash visible (Starkscan link)  
- [ ] ✅ **Anti-cheat**: Fake screen monitor score updates  
- [ ] ✅ **Wow factor**: "120% bonus" math + streak counter  
