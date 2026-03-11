# Generate n \times n Square

An interactive web-based grid generator with customizable start, end, and obstacle cells.

## Features

- **Dynamic Grid Size**: Generate an $n \times n$ grid by entering any number between 3 and 10.
- **Interactive State Cycling**: Click on any cell in the grid to cycle its state through the following sequence:
  1.  **Empty** (Default)
  2.  **Start** (Green) - Only one cell can be the start at a time.
  3.  **End** (Red) - Only one cell can be the end at a time.
  4.  **Obstacle** (Gray) - Obstacles are dynamically limited based on the grid size.
- **Obstacle Limit**: The number of obstacle cells is limited to $n - 1$ to ensure there is always a potential path in pathfinding algorithms that might use this grid. The UI dynamically shows the current limit.
- **Value Iteration Planning**: Input your custom Goal Reward, Step Penalty, Obstacle Penalty, and Discount Factor. Click "Plan" to run the Value Iteration algorithm and instantly visualize the resulting **Value Matrix** and **Policy Matrix** side-by-side! 
- **Modern UI/UX**: Features a clean, dark-themed glassmorphism design with responsive elements and smooth pop-in animations.

## How to Run

Since this is a vanilla HTML/CSS/JS project, you don't need to install any dependencies or run a build step.

1. Clone or download this repository.
2. Open the `index.html` file in any modern web browser.
3. Use the input box to select your grid size and click **Generate Square**.
4. Click on the cells to place your Start, End, and Obstacle blocks according to the cycling rules!
5. Setup your custom rewards/penalties, and click the **Plan** button to see the Value Iteration results.

## Technologies Used
- HTML5
- CSS3 (Vanilla, CSS Variables, Flexbox/Grid, Animations)
- JavaScript (Vanilla, DOM Manipulation, Event Listeners)
