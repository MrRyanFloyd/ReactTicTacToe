import React from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './index.css';

function Square(props) {
    return ( 
        <button className="square" onClick={props.onClick}>
            {props.value}                                       {/* We have changed this.props to props both times it appears. */}
        </button>
    );
}


class Board extends React.Component {
    renderSquare(i) {
        return (
        <Square 
            value={this.props.squares[i]}               //  now we're passing two props to Square component: value and onClick
            onClick={() => this.props.onClick(i)}         //  tells react to set up onClick event listener. We could give any name to the Square’s onClick prop or Board’s handleClick method, and the code would work the same. In React, it’s conventional to use on[Event] names for props which represent events and handle[Event] for the methods which handle the events.
        />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
            {
                squares: Array(9).fill(null)
            }
        ],
        stepNumber: 0,
        xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];     //  instead of always showing the last move, show state of the stepNumber we're on 
        const squares = current.squares.slice();                 //  we call .slice() to create a copy of the squares array to modify instead of modifying the existing array. 
        
        if (calculateWinner(squares) || squares[i] ) {      //  return if there's a winner or the square is full already
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([
                {
                squares: squares,
            }
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) ===0
        });
    }
    
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?             //current move position in list of moves 
            'Go to move #' + move:
            'Go to game start';

            return (
                <li key={move}>
                    <button className="step-button" onClick={() => this.jumpTo(move)}>{desc}</button>   {/* description of whis button move history */}
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div>
                <div className="App">
                    <div className="App-header">
                        <img src={logo} className="App-logo" alt="logo" />
                    </div>
                </div>
                <div className="game-container">
                    <div className="game">
                        <div className="game-board">
                            <Board 
                                squares = {current.squares}
                                onClick={i => this.handleClick(i)}
                            />
                        </div>
                        <div className="game-info">
                            <div className="current-status">{status}</div>
                            <ol>{moves}</ol>
                        </div>
                    </div>
                </div>
                <div>
                    <a className="floyd-header" href="https://github.com/MrRyanFloyd/ReactTicTacToe">Ryan Floyd</a>
                </div>
            </div>
        );
    }
}



function calculateWinner(squares) {
    const lines =[
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i =0; i <lines.length; i++) {
        const [a, b ,c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;    //if no winner
}


// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
