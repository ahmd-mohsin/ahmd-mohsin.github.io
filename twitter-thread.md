# Twitter thread — Coverage Preservation in RLVR

Post the card link on the first tweet so the image preview shows. Each slide is under 280 characters.

---

**1/8**
Reinforcement learning makes math models better on their first try. Sample them many times and the base model wins. RLVR buys pass@1 and pays with reasoning coverage. New post on why, and a fix.

ahmd-mohsin.github.io/writing/coverage-preservation-rlvr

---

**2/8**
Coverage is finite-budget recoverability. A problem is recoverable at budget K when one of K samples is correct. For a mode with probability p, recoverability is 1 − (1 − p)^K. Once p drops below about 1/K the mode is gone.

---

**3/8**
Here is the mechanism. GRPO routes gradient to a reasoning mode only when it samples that mode. The expected gradient scales as O(p_θ). As training sharpens the policy, rare correct modes fall under 1/K and stop getting any signal.

---

**4/8**
Reward shaping cannot fix this. UCPO, PKPO, RiskPO all multiply the advantage by a bounded factor, and a bounded factor leaves the O(p_θ) term intact. A method only pushes on modes it samples, so it never reaches the rare ones.

---

**5/8**
Our fix is a constraint, not a reward. Run the base model offline, bank its correct traces, store each trace log-probability. During RL, keep every banked trace within a factor of its base probability.

log π_θ ≥ log π_0 + log α, α = 0.5.

---

**6/8**
Three properties make it work. It is off-policy, evaluated by teacher forcing, so its gradient does not vanish. It constrains log π_θ directly, so the group-relative advantage cannot cancel it. It is one-sided, so it adds no pass@1 tax.

---

**7/8**
Identical GRPO from one base, floor the only difference. Plain RL collapses 39% of base reasoning modes. The floor collapses 2.3%. The floor is the only method with positive mean mode mass. UCPO, built for coverage, is the worst.

---

**8/8**
Coverage is the substrate for the next round. Fork round-1 into plain and floor, then run identical round-2 RL. The plain fork wins small k. The floor fork overtakes at k ≥ 32 and reaches 0.990 at pass@256.

Full post and figures below.
ahmd-mohsin.github.io/writing/coverage-preservation-rlvr
