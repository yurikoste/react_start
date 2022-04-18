import React, { useState } from "react";
import Board from "./board";

const Game = () => {
    let [history, setHistory] = useState([{squares: Array(9).fill(null)}]);
    let [stepNumber, setStepNumber] = useState(0);
    let [xIsNext, setxIsNext] = useState(true);
    let [coords, setCoords] = useState([{x_y: Array(2).fill(0)}]);
    let [onSelectedRect, setOnSelectedRect] = useState();
    let [selectedRect, setSelectedRect] = useState();

    let current = history[stepNumber];
    let winner = calculateWinner(current.squares);
    let all_coords = coords;

    const JumpTo = (step) => {
        setStepNumber(step);
        setxIsNext(step % 2);
      }

    const handleClick = (i) => {
        let local_history = history.slice(0, stepNumber + 1);
        let local_coords = coords.slice(0, stepNumber + 1);
    
        let current = local_history[local_history.length - 1];
        let current_coords = local_coords[local_coords.length - 1];
        let squares = current.squares.slice();
        let x_y = current_coords.x_y.slice();
        onSelectedRect = false;
    
        if (calculateWinner(squares)) {
            return;
        }
    
        if (squares[i]) {
            onSelectedRect = true;
        }
        else {
            squares[i] = xIsNext ? 'X' : 'O';
            x_y[0] = ~~(i / 3) + 1;
            x_y[1] = i%3 + 1;
        }
    
    
        setHistory(onSelectedRect? history : history.concat([{squares: squares}]));
        setStepNumber(onSelectedRect? history.length-1 : history.length);
        setxIsNext(onSelectedRect? xIsNext : !xIsNext);
        setCoords(onSelectedRect? coords : coords.concat([{x_y: x_y}]));
        setOnSelectedRect(onSelectedRect);
        setSelectedRect(i);
    }

    const moves = history.map((step, move) => {
      const x_y = all_coords[move].x_y[0]+':'+all_coords[move].x_y[1];
      let selectedRectCoords = -1

      if (all_coords[move].x_y[0] === 1){
        selectedRectCoords = (all_coords[move].x_y[0] + all_coords[move].x_y[1]) - 2;
      }
      else if (all_coords[move].x_y[0] === 2) {
        selectedRectCoords = (all_coords[move].x_y[0] + all_coords[move].x_y[1]);
      }
      else if (all_coords[move].x_y[0] === 3) {
        selectedRectCoords = (all_coords[move].x_y[0] + all_coords[move].x_y[1]) + 2;
      }

      const desc = move ?
        x_y + ' Go to move #' + move :
        ' Go to game start';
      if (onSelectedRect === true && selectedRectCoords === selectedRect) {
        onSelectedRect = false;
        return (
          <li key={move}>
            <button className="button-selected-move" onClick={() => JumpTo(move)}>{desc}</button>
          </li>
        );
      }
      return (
        <li key={move}>
          <button onClick={() => JumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }


const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }


export default Game;
