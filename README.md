<div align="center">
  <h1>🌐 GridWorld Pathfinding & RL Planner</h1>
  <p>An interactive, beautifully animated web-based Reinforcement Learning environment and grid generator.</p>

  <img src="demo.webp" alt="GridWorld Demo" width="600"/>
</div>

---

## 📖 Introduction

**GridWorld** is a classic Reinforcement Learning environment brought to life in your browser. This project allows you to construct dynamic mazes, configure Markov Decision Process (MDP) parameters, and watch the legendary **Value Iteration** and **Policy Iteration** algorithms compute the optimal policy and shortest path right before your eyes!

Whether you are a student learning about Dynamic Programming, an educator demonstrating AI pathfinding, or just someone who enjoys interactive web widgets, this tool provides a hands-on experience with core RL concepts.

## ✨ Key Features

- **🎛️ Dynamic Grid Generation**: Create any $n \times n$ grid on the fly (scales fluidly up to $10 \times 10$). The UI automatically resizes to prevent overlapping!
- **🖱️ Interactive State Editor**: Click any cell in the grid to cycle its state:
  1.  **Empty** (Default)
  2.  **Start State** (Green) - The starting point of the agent.
  3.  **End State** (Red) - The goal state the agent wants to reach.
  4.  **Obstacle** (Gray) - Walls that block the agent's movement. Dynamically limited to $n - 1$ to ensure solvable paths.
- **⚙️ Configurable MDP Parameters**: Adjust the environment's underlying Reinforcement Learning properties:
  - **Goal Reward**: The positive reinforcement received when hitting the end state (e.g., `+10`).
  - **Step Penalty**: The cost of taking a single step (e.g., `-0.1` to encourage shorter, more efficient paths).
  - **Obstacle Penalty**: The cost/penalty of hitting an obstacle (e.g., `-1`).
  - **Discount Factor ($\gamma$)**: Determines the importance of future rewards vs immediate rewards (e.g., `0.9`).
- **🧠 Real-time Simultaneous Planning**: Click **Plan** to instantly run **both** Value Iteration and Policy Iteration simultaneously. The app tracks the execution time and number of iterations, allowing you to compare their performance in real-time!
- **📊 Comprehensive Visualizations**: Once planned, the app visually renders distinct matrix sets for both algorithms:
  1.  **Value Matrix**: The converged max expected utility ($V(s)$) for every state.
  2.  **Policy Matrix**: Arrow vectors ($\uparrow, \downarrow, \leftarrow, \rightarrow$) showing the greedy optimal action(s) for every state.
  3.  **Best Path Matrix**: Highlights the single optimal continuous route from the Start state to the End state based on the calculated policy.
- **⚖️ Algorithm Comparison**: A dedicated section at the bottom of the page breaks down the pros, cons, and differences between Value Iteration and Policy Iteration.
- **🎨 Modern UI/UX**: Designed with a clean, dark-themed glassmorphism aesthetic, responsive CSS Grid layouts, and smooth CSS pop-in animations.

## 🚀 How to Run (Local Installation)

Because this is a vanilla HTML/CSS/JS project, you don't need to install any heavy Javascript frameworks, Node.js, or run a complex build step!

1. **Clone the repository**:
   ```bash
   git clone https://github.com/light810311/GridWorld.git
   cd GridWorld
   ```
2. **Open the project**:
   Simply double-click `index.html` to open it in any modern web browser (Chrome, Firefox, Safari, Edge).
3. **Play and Learn**:
   - Set your grid size using the input box and click **Generate Square**.
   - Design your map by clicking on the cells to place your Start, End, and Obstacle blocks.
   - Tweak your MDP rewards/penalties to see how it affects the agent's behavior.
   - Click the **Plan** button to witness both algorithms execute simultaneously. Compare their real-time stats and their resulting Best Path visualizations side-by-side!

## 🛠️ Technologies Used

- **HTML5**: Semantic tags and clean structure.
- **CSS3**: 
  - CSS Variables for easy theming
  - Flexbox and CSS Grid for complex, responsive 2D layouts
  - Keyframe animations (`@keyframes`) for interactive feedback
  - Glassmorphism effects (`backdrop-filter`) for premium visual depth
- **JavaScript**: 
  - Vanilla JS (ES6+)
  - DOM Manipulation without external libraries like React/Vue
  - Custom implementation of the Value Iteration algorithmic loop

## 📐 Algorithm Deep Dive

This application supports two fundamental Dynamic Programming algorithms in Reinforcement Learning used to solve Markov Decision Processes (MDPs):

### Value Iteration
Value Iteration repeatedly applies the **Bellman Optimality Equation** until the state values converge. For every state $s$, the value $V(s)$ is updated by finding the maximum expected return across all possible actions $a$:

$$ V(s) \leftarrow \max_a \left[ R(s, a, s') + \gamma V(s') \right] $$

Where:
- $a \in \{\text{Up}, \text{Down}, \text{Left}, \text{Right}\}$
- $R(s, a, s')$ is the immediate reward of taking action $a$ in state $s$.
- $\gamma$ (gamma) is the discount factor.
- $V(s')$ is the value of the resulting next state $s'$.

Once the values converge, the optimal policy $\pi^*(s)$ is extracted by acting greedily with respect to the final value function.

### Policy Iteration
Policy Iteration interleaves two distinct steps until the policy stops changing:
1. **Policy Evaluation**: Calculate the value function $V^\pi(s)$ for the current policy $\pi$ by iteratively solving the Bellman Expectation Equation:
   $$ V(s) \leftarrow R(s, \pi(s), s') + \gamma V(s') $$
2. **Policy Improvement**: Update the policy by acting greedily with respect to the newly evaluated value function:
   $$ \pi'(s) \leftarrow \arg\max_a \left[ R(s, a, s') + \gamma V(s') \right] $$

If the new policy $\pi'$ is identical to the old policy $\pi$, the algorithm has converged to the optimal policy.

### Comparison: Value Iteration vs Policy Iteration
While both algorithms compute the optimal policy for an MDP, they differ in their approach:
- **Value Iteration** computes the absolute optimal value function first, repeatedly updating values across all states, and only extracts the optimal policy once at the very end. It's often computationally simpler per sweep but may take many iterations to converge.
- **Policy Iteration** starts with a complete policy, evaluates it fully, and then improves it. Because it searches the space of policies rather than the space of continuous values, it often converges in significantly fewer iterations, although the policy evaluation step can be computationally expensive for very large state spaces.

### Policy Extraction & Visualization
For both algorithms, our **Best Path** visualization follows the optimal policy matrix from the Start State to automatically trace the optimal route!

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

---
*Created for Reinforcement Learning studies & Interactive Web Development.*
