# BUS ESCAPE 3D // PASSENGER JAM — Technical Game Design Document

## 1. High Concept & 2-Second Hook
- **Genre:** 3D Spatial Jam / Bus Escape & Color Sorting Puzzle.
- **2-Second Hook:** Player immediately sees colorful buses parked on an angled lot and a queue of colorful passengers. One single tap on any unblocked bus drives it forward into the loading dock with a satisfying tire squeal and suspension wobble.
- **Art Direction:** Stylized Toony Soft Daylight (`#cfe8f7` sky, `#fff6e5` warm key light, `#fcf8ee` biscuit/cream tarmac, vinyl toy finish).

---

## 2. Core Mechanics & Solvable Level Math
1. **The Parking Grid:**
   - Buses are arranged in 1x2 or 1x3 footprint blocks on a discrete tile grid.
   - Each bus has a driving orientation (North, South, East, West) and a designated passenger capacity (4 or 6 seats).
   - A bus can only exit if its forward path to the perimeter exit lane is unobstructed by other vehicles.
2. **The Loading Bays & Passenger Conga Line:**
   - 3 loading bays are positioned next to the bus stop.
   - A queue of colorful passengers waits at the station.
   - When a bus enters an open bay, waiting passengers matching its color rush in and board with cute pop sounds until full or no more matching passengers remain.
   - Once full, the bus drives away into the city, awarding coins and freeing up the bay.
3. **100% Solvable Level Math:**
   - Levels are reverse-generated: Starting from clear exits and an empty lot, buses are placed in reverse order with valid trajectories.
   - Passenger queue chunks strictly match the exact capacity and color distribution of all vehicles on the lot.

---

## 3. Mandatory Revenue Hooks (`65-monetization-ads`)
1. **Hook 1 (In-Level Boosters):**
   - *Helicopter Lift (`booster_helo`):* Air-lifts any trapped bus directly into an open bay.
   - *VIP Parking Bay (`booster_vip`):* Unlocks a 4th temporary loading bay for the duration of the level.
   - *Shuffle Passengers (`booster_shuffle`):* Re-arranges the front of the passenger queue to match currently docked buses.
2. **Hook 2 (Near-Miss Revive Modal):**
   - Triggers when all 3 loading bays are occupied by partially-filled buses and the next 5 queue passengers match none of them ("Grid Jam!").
   - Offers `+1 VIP Bay & Clear Front Passenger` via Rewarded Ad.
3. **Hook 3 (Victory Multiplier):**
   - Moving needle oscillating across 2x / 3x / 5x coin reward multiplier on level clear.

---

## 4. Platform Standards & Technical Budget
- **Budget:** Strict `< 50 MB` production bundle (actual target ~550 kB).
- **Network CSP:** Zero external network calls (all procedural audio and prefabs).
- **Ergonomics:** Dynamic CameraRig adapts seamlessly between 9:16 portrait and 16:9 landscape.
