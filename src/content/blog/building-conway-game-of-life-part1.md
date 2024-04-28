---
author: Anshul Sharma
pubDatetime: 2024-04-27T11:20:29.380Z
title: Building Conway's Game of Life - Part 1
slug: building-conway-game-of-life-part1
featured: true
draft: false
tags:
  - learning
  - python
  - code
description: I built an extremely simple python terminal implementation of John Conway's Game of Life. Source code on github - plays inside a Jupyter notebook
ogImage: src/assets/images/building-conway-game-of-life-part1/gameoflife1.gif
---

# Building Conway's Game of Life - Part 1

![Source: Numberphile - Youtube video](@assets/images/building-conway-game-of-life-part1/conway-banner.jpg)
<center>*(Image Source: Numberphile - Youtube video)*</center>

I built an extremely simple python terminal implementation of John Conway's Game of Life. 
[Source code on github](https://github.com/anshs/learning-public/blob/main/gameoflife-part1.ipynb) - plays inside a Jupyter notebook. This is what it looks like in action:

![Game of life - in python](@assets/images/building-conway-game-of-life-part1/gameoflife1.gif)

[Wikipedia link](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)

[Conway's Game of Life](https://conwaylife.com/wiki/Conway%27s_Game_of_Life) is a cellular automaton that is played on a 2D square grid. It was devised by the British mathematician John Horton Conway in 1970. Cellular automata is an interesting field of study that shows how complexities can emerge from very simple rules and initial conditions. The game of life is a [zero-player game](https://en.wikipedia.org/wiki/Zero-player_game "Zero-player game"), meaning that its evolution is determined by its initial state, requiring no further input. One interacts with the Game of Life by creating an initial configuration and observing how it evolves. 
## Rules:
Each square (or "cell") on the grid can be either alive or dead, and they evolve according to the following rules:
- Any live cell with fewer than two live neighbours dies (referred to as underpopulation).
- Any live cell with more than three live neighbours dies (referred to as overpopulation).
- Any live cell with two or three live neighbours lives, unchanged, to the next generation.
- Any dead cell with exactly three live neighbours comes to life.

The initial configuration of cells can be created by a human, but all generations thereafter are completely determined by the above rules. The goal of the game is to find patterns that evolve in interesting ways – something that people have now been doing for over 50 years. (see this amazing [lexicon](https://playgameoflife.com/lexicon) for inspiration)

## My python Implementation:
My starting point is [chapter 4 of this amazing resource](https://automatetheboringstuff.com/2e/chapter4/) for learning python. Unlike the classic implementations which have an infinite 2D grid, this implementation folds over itself from right-to-left and from bottom-to-top. Which means a cell on the right most edge of the grid influences cells on the left most edge, and same for bottom and top edges. This makes likelihood of the game reach a "stable" state significantly higher. In this first version, the initial conditions are created at random, something I will change in future. Additionally, I made slight changes to original source code: (1) Added epochs counter to see how many iterations have passed, and (2) Logic to identify when a "stable" state has reached and mark the number of epochs it took to reach that stable state.

[Source code on github](https://github.com/anshs/learning-public/blob/main/gameoflife-part1.ipynb)  - plays inside a Jupyter notebook

This is what it looks like in action:

![Game of life - in python](@assets/images/building-conway-game-of-life-part1/gameoflife1.gif)


Future plans as tinker around more:
- Add better UI within python
- Implement a web based and more interactive version of game of life in Javascript
- Ability to add custom initial conditions and change conditions while the game is running
- Better UI, possibly trippy visualizations
- Presets for special use-cases (see this [lexicon](https://playgameoflife.com/lexicon))
- Analysis on "stable eras" and how frequently do they occur given random initial conditions
- Add sound
- A possible hardware implementation :) 

Here is John Conway himself talking about inventing the Game of Life (Source: Numberphile):
[![Game of life - in python](@assets/images/building-conway-game-of-life-part1/conway_yt-thumb.webp)](https://www.youtube.com/watch?v=R9Plq-D1gEk)

I keep a track of my learning journey, nerdy musings and creative projects on my [blog](https://anshulsharma.in/) and [Twitter](https://twitter.com/anshulbuilds)