import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
  return (
    <button className="square"
     onClick={props.onClick}>
      {props.value}
    </button>
  );
}

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

class Board extends React.Component {
  renderSquare(i, row, col) {
    return <Square
             value={this.props.squares[i]}
             onClick={() => this.props.onClick(i, row, col)}
             key={i}
           />;
  }

  createBoard() {
    const board = [];

    for (let i = 0; i < 3; i += 1) {
      const columns = [];
      for (let j = 0; j < 3; j += 1) {
        columns.push(this.renderSquare(i*2 + i + j, i, j));
      }
      // console.log(columns)
      board.push(<div key={i} className="board-row">{columns}</div>);
    }

    //console.log(board);

    return board;
  }


  render() {
    return (
      <div>
        {this.createBoard()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        row_col: null,
      }],
      xIsNext: true,
      stepNumber: 0,
    };
  }

  handleClick(i, row, col) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1 ]
    const squares = current.squares.slice()

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
                   history: history.concat([{
                     squares: squares,
                     row_col: [row, col]
                   }]),
                   stepNumber: history.length,
                   xIsNext: !this.state.xIsNext,
                  });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares)

    const moves = history.map((step,move) => {
      let row = null;
      let col = null;
      const bold = (move === this.state.stepNumber ? 'bold' : '')

      if (move) {
        row = '(' + this.state.history[move].row_col[0] + ', ';
        col = this.state.history[move].row_col[1] + ')';
      }

      const desc = move ?
        'Go to move #' + move + ' ' + row  + col:
        'Go to game start';


      return (
        <li key={move}>
          <button className={bold} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });


    let status;
    if(winner) {
      status = 'Winner: ' + winner
    } else {
      status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O')
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={ (i, row, col) => this.handleClick(i, row, col) }
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

