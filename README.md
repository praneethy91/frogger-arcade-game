# A Frogger Arcade game clone
This game is developed using Object-oriented Javascript and HTML5 canvas. This is a complete HTML5 canvas game with the overlay menu being written to DOM.

## How to Run the game:
There are two ways for you to run the game:

1. Navigate to [Game Website](https://praneethy91.github.io/frogger-arcade-game)
2. Clone to your local machine to host it and play:
```
  git clone https://github.com/praneethy91/frogger-arcade-game.git
```

## How to navigate the Game menu:
The menu is very simple. You choose your character by clicking on one of the character sprites in the initial menu when you open the game.

## How to Play:
You can move your character by pressing the <kbd>&rarr;</kbd> <kbd>&larr;</kbd> <kbd>&uarr;</kbd> <kbd>&darr;</kbd> arrow keys.

## Game Rules:
Every game is a 5 minute timed game. Your goal is to get the maximum score possible within that time frame.

### Your score increases if you:
1. Reach the water at the top. Your score increases by 50 points. Then your position is reset back to the starting point and you continue playing the game.
2. Collect one of the **Gems**. There are three kinds of **Gems**:
    - **Blue gem**: Worth 50 points.
    - **Green gem**: Worth 100 points.
    - **Orange gem**: Worth 200 points.

### Increase your lives:
Every player starts of with one life at the start of the game. You can increase your lives by collecting the **Heart**.

### Game termination conditions:
The game terminates and take you back to the main menu, if:

1. You collide with one of the enemy bugs.
2. Your time runs out.

  **_Have Fun and try to achieve your high score!!_**

## Limitations

1. Be careful! Your high score resets if you refresh the game page.
2. This game does not work on mobile devices.

## License
Copyright (c) 2017 Praneeth Yenugutala. This project is licensed using MIT License. Feel free to contribute, fork or commit.
