import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Board from './components/board';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true,
      coords: [{
        x_y: Array(2).fill(0)
      }],
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const coords = this.state.coords.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const current_coords = coords[coords.length - 1];
    const squares = current.squares.slice();
    const x_y = current_coords.x_y.slice();
    let onSelectedRect = false;

    if (calculateWinner(squares)) {
      return;
    }

    if (squares[i]) {
      onSelectedRect = true;
    }
    else {
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      x_y[0] = ~~(i / 3) + 1;
      x_y[1] = i%3 + 1;
    }

    this.setState({
      history: onSelectedRect? history : history.concat([{
        squares: squares
      }]),
      stepNumber: onSelectedRect? history.length-1 : history.length,
      xIsNext: onSelectedRect? this.state.xIsNext : !this.state.xIsNext,
      coords: onSelectedRect? coords : coords.concat([{
        x_y: x_y
      }]),
      onSelectedRect: onSelectedRect,
      SelectedRect: i,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2 ) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const all_coords = this.state.coords;
    let onSelectedRect = this.state.onSelectedRect;
    const selectedRect = this.state.SelectedRect;

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
            <button className="button-selected-move" onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      }
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
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
