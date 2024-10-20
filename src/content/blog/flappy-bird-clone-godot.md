---
author: Anshul Sharma
pubDatetime: 2024-08-25T17:13:29.380Z
title: Making a Flappy Bird clone in Godot
slug: flappy-bird-clone-godot
featured: true
draft: false
tags:
  - learning
  - code
  - gamdev
  - godot
description: I made a Flappy Bird clone using Godot engine (v4.2). Flappy Bird is game no. 1 in the 20 games challenge, where I will make 20 games as small projects to learn game development and design. In this chapter, I will share what I learned along the way about game development, game design, and about Godot game engine. 
ogImage: src/assets/images/flappy-bird-clone-godot/flappy-bird-clone-godot-og.png
githubLink: https://github.com/anshs/Flappy-Bird-v1
link: https://anshulsharma.itch.io/flappy-bird-clone
---
I made a Flappy Bird clone using Godot engine (v4.2). Flappy Bird is game no. 1 in the [20 Games Challenge](https://20_games_challenge.gitlab.io/how/), where I will make 20 games as small projects to learn game development and design. In this chapter, I will share what I learned along the way about game development, game design, and about Godot game engine. I'm a beginner, so if you learn something by reading this, then you are learning *with* me. The source code is shared below and you can play the final game on [itch.io](https://anshulsharma.itch.io/flappy-bird-clone)

<iframe frameborder="0" src="https://itch.io/embed/2967409?linkback=true" width="552" height="167"><a href="https://anshulsharma.itch.io/flappy-bird-clone">Flappy Bird clone by anshulsharma</a></iframe>

This is not a step-by-step tutorial on how to make flappy bird. You will find enough of them online, and you can always get all the source code from [github](https://github.com/anshs/Flappy-Bird-v1). 
## Why make it?
- because it's fun
- practice building a fully functional game without blowing up the scope and avoid abandoning it mid-way
- learn creating all aspects for a basic game end-to-end: the game mechanics, animation, sound effects, game interface and everything in between
- force myself to keep under a time limit and practice the art of deciding what to leave out of the scope. It's easier when you already know what the final game is going to look like
- focus on the code and programming aspect. Hence the game sprites are picked up from the internet. I will eventually do game art myself in future projects.
## Pre-requisite knowledge
- Basic understanding of Godot game engine. A good place to start is the "Getting Started" section in the [official Godot documentation](https://docs.godotengine.org/en/stable/getting_started/introduction/index.html)
- Some familiarity with programming
## Reference Links and Credits
- [Link to the final game](https://anshulsharma.itch.io/flappy-bird-clone)
- [My source code at Github](https://github.com/anshs/Flappy-Bird-v1)
- [Game assets](https://github.com/samuelcust/flappy-bird-assets) (sprites and audio). Credits to *@samuelcust*
## The Plan

The planning stage is important for meeting the aforementioned goal of delivering the game under a time limit. Since I am able to work on this for an hour each weekday after my day job, I created smaller chunks or modules of tasks and assigned a time limit (in hours) to complete each task. I started getting more interesting ideas as I started building and believe me, you have to practice restraint to prioritize what to keep and what to exclude from the scope. I ended up including some enhancements, but only the ones that were low effort.

![Flappy Bird - Plan](@assets/images/flappy-bird-clone-godot/flappy-bird-plan.jpg)

- Player mechanics and animation(1.5 hour): The player (the bird in this caser) mechanics were straight forward. We play using a single player input to make the bird fly higher. The bird by default falls to the ground under gravity. The game scrolls sideways by itself. 
- Ground (1 hour): A simple infinite scrolling ground animation.
- Pipe generation (2 hours, actually took 4): The pipe generation is the most complex part as I have to instantiate the pipes at regular intervals and also introduce some randomization for the height of the pipes.
- Scoring and Game Over logic (1.5 hours): Increment score by 1 every time the bird crosses a pipe. The game is over if the bird collides with a pipe. The use of global variables in Godot is very useful to track "Game Over" across the code.
- Audio (0.5 hours): Just two basic sounds, one for flying (to provide audio feedback to the player) and one when bird collides (game over sound)
- Start Screen (1 hour): I implemented a sine wave flying motion for the bird on the start screen and reused most of the scrolling animation for the ground
- Enhancements (0.5 hours): As the game took shape, I dedicated one session to tweak some parameters (like gravity, scrolling speed etc.) and add some elements to make the game more "fun" to play. Key enhancements were:
	- More randomization: I am always fascinated by the use of randomness in video games (GMTK did a great video on [randomness in video games](https://youtu.be/dwI5b-wRLic)). To that effect, I added code to vary both pipe heights and the "width" of the gap between pipes through which the bird passes. I also added some randomness to the distance between two subsequent pipes. 
	- Player animation: Simple animations can create a world of difference in the playing experience. It makes the game more intuitive to play and also provides a visual feedback to the player when they do something. To achieve some of this goodness without spending too much time, I added some rotational animations when the player (bird) flies up or down. When the bird collides with a pipe, changed few rotation properties to make the bird fall face down.
	- Naive leveling up: To ensure the player does not find the most difficult random scenario to fly through at the beginning, introduced "easy" level in the beginning, but gets difficult only after the score hits 10.\


The original Flappy Bird was a 2013 mobile game that became a sleeper hit known for its simple yet addictive gameplay. It was made by Dong Nguyen, a Vietnamese solo developer who said that around 2014, the game was earning $50k a day through in-app advertisements. 
