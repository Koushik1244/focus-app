# Blitz Hack – Product Requirements Document (PRD)

## 1. Overview

**Product name:** Blitz Hack  
**Tagline:** Stake to focus. Earn if you finish, lose if you quit.  
**Platforms:** Mobile app (Expo React Native), Starknet on-chain backend via StarkZap. [web:50][web:55]

Blitz Hack is a crypto‑powered deep work app where users lock a small crypto stake before a focus session. If they complete the session, they recover their stake plus a reward; if they quit early, they lose some or all of the stake. Streaks and group pools increase motivation.

## 2. Problem & Opportunity

- People struggle to stay focused and avoid distractions, especially on their phones. [web:37]  
- Existing productivity apps rely mostly on willpower (timers, checklists) with weak consequences for failure. [web:41]  
- Commitment‑device research shows people are more likely to follow through when there is real financial skin in the game. [web:37]

**Opportunity:** Use crypto staking and automated, transparent rewards on Starknet to create a high‑accountability focus app that is provably fair and hard to cheat.

## 3. Solution Summary

Blitz Hack lets users:
1. Connect a Starknet wallet (via StarkZap SDK).
2. Choose session duration and a small stake (e.g. 5 USDC).  
3. Run a focus session while the app monitors activity (screen and camera).  
4. On completion, if the user passes anti‑cheat checks, a smart contract returns the stake plus a share of failers’ stakes and/or sponsor rewards. Otherwise, their stake is forfeited to the pool.

## 4. Target Users

- **Students & solo builders** preparing for exams, hackathons, or coding sprints.  
- **Developers & knowledge workers** who already use Pomodoro or focus tools but want stronger accountability.  
- **Crypto‑native users** on Starknet who want a fun, gamified way to use small amounts of USDC/STRK. [web:55]

## 5. User Journeys (MVP)

1. **Solo focus session**  
   - Open app → Connect Starknet wallet → Select 25‑minute session + 5 USDC stake → Start timer → Stay focused → Session completes → See success screen and transaction hash → Claim rewards to wallet.

2. **Peer pool session** (simple version)  
   - Join a pool of up to N users all staking the same amount → If some users fail, their stakes are distributed among the successful ones (minus a small protocol fee).

3. **Streak building**  
   - Do at least one successful session per day → Maintain streak counter → Streak boosts reward multiplier in future sessions.

## 6. Features – MVP Scope

### 6.1 Must‑Have

1. **Wallet connect (StarkZap)**  
   - Connect existing Starknet wallet or create an embedded wallet via StarkZap. [web:50][web:52]
   - Show connected address and USDC balance (testnet).

2. **Session creation**  
   - Inputs: duration (25 / 50 / 90 minutes), stake amount (preset options), solo or peer pool.  
   - Show estimated reward range (e.g. “Expected bonus: 5–20%”).

3. **On‑chain staking & settlement**  
   - Smart contract on Starknet that:
     - Accepts USDC stakes from users into an escrow pool. [web:48]  
     - Tracks which wallet is associated with which session.  
     - Exposes a `settle_session(user, focus_score)` function callable by backend/oracle that either:
       - Marks success and allocates stake + reward back to user.  
       - Marks failure and redistributes stake to reward pool/treasury.

4. **Anti‑cheat monitoring (dual)**

   **Option A – Screen/activity monitoring**  
   - Detect if Blitz Hack is in the foreground and track percentage of session time spent in the app. [web:66][web:69]  
   - Flag extended background time or app switches to social/media apps as suspicious. [web:73]

   **Option B – Camera AI/ML monitoring**  
   - Use front camera periodically (e.g. every 30 seconds) plus on‑device ML (MediaPipe/TensorFlow Lite) to classify frames as “focused” vs “not focused” based on gaze and face orientation. [web:79]

   **Combined focus score**  
   - Compute `focus_score = 0.5 * screen_score + 0.5 * gaze_score`.  
   - Define a success threshold (e.g. focus_score ≥ 0.85) required for on‑chain payout.

5. **Results & feedback**  
   - On session end, show:
     - Outcome: ✅ success or ❌ failed.
     - Focus score breakdown (screen vs gaze).  
     - Stake amount, reward amount, and link to Starkscan transaction. [web:46]

6. **Basic streaks & history**  
   - Track number of consecutive successful days.  
   - List last 5 sessions with date, duration, and outcome.

### 6.2 Nice‑to‑Have (if time)

- Friend groups (join via invite link, leaderboards based on weekly earnings).  
- Themed campaigns (e.g. “Study Sprint Week”) with sponsor‑funded bonus pools. [web:40][web:45]  
- In‑app notifications and reminders.

## 7. Non‑Functional Requirements

- **Performance:** App should start a session and open camera within 3 seconds on mid‑range devices.  
- **Reliability:** Session monitoring must handle brief network drops; local cache of reports synced when connection resumes.  
- **Privacy:**
  - Camera frames stay on device; only derived focus scores and aggregates are sent to backend. [web:73][web:79]  
  - Explicit consent for monitoring is required before staking.
- **Security:**
  - Use audited or battle‑tested token contracts for USDC/STRK on Starknet where possible. [web:48]  
  - Minimize smart contract complexity; most logic off‑chain with simple on‑chain settlement.

## 8. Architecture Overview

**Client (mobile, Expo RN)**  
- UI screens: Home, Session, Results, Profile.  
- Integrations: StarkZap SDK for wallet/staking; camera and screen monitoring SDKs. [web:50][web:66][web:79]

**Backend (Node/Express)**  
- REST API for:
  - Session creation and status updates.  
  - Storing monitoring reports and computing final focus score.  
  - Signing and sending Starknet `settle_session` calls.

**Blockchain (Starknet)**  
- Cairo contract(s):
  - Stake pool (escrow) with:
    - `stake(amount, session_id)`  
    - `settle_session(user, focus_score)`  
  - Optional treasury address collecting protocol fee (e.g. 2–5% of failed stakes).

## 9. Dependencies & Integrations

- **StarkZap SDK** for wallet connect and Starknet transactions. [web:50][web:55]  
- **USDC/STRK Starknet token contracts** for actual staking. [web:48]  
- **React Native / Expo** for mobile app and camera integration. [web:80][web:85]  
- **Screen activity monitoring** libraries or native APIs (Screen Time / UsageStats). [web:66][web:69][web:73]  
- **Camera ML stack** (MediaPipe, TensorFlow Lite, or camera SDK like Banuba). [web:79]

## 10. Success Metrics (MVP / Hackathon)

**Hackathon demo success:**
- Live demo: connect wallet → stake test USDC → run short session → show result and on‑chain transaction.  
- Judges understand anti‑cheat story and see live focus score changing.

**Post‑hack early metrics:**
- 100+ testnet sessions run by early users.  
- ≥60% of users complete at least one successful streak of 3 days.  
- Low rate of disputes/false positives from anti‑cheat (<5% of sessions).

## 11. Future Roadmap (Beyond MVP)

- Advanced social features (friend challenges, global leaderboards).  
- More flexible pools (variable stake sizes, dynamic odds).  
- Multi‑chain support and fiat on‑ramp.  
- Richer AI models for focus detection and personalized suggestions.
