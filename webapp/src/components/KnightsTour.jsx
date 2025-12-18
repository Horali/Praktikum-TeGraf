import React, { useState, useRef, useEffect } from 'react';
import '../styles/KnightsTour.css';

const KnightsTour = () => {
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedStart, setSelectedStart] = useState({ x: 0, y: 0 });
  const [tourType, setTourType] = useState('open');
  const [error, setError] = useState('');
  const [computeTime, setComputeTime] = useState('');
  const [animatingPath, setAnimatingPath] = useState([]);
  const [currentMove, setCurrentMove] = useState(-1);
  const [animationSpeed, setAnimationSpeed] = useState(200);
  const [animationRunning, setAnimationRunning] = useState(false);
  const animationTimeoutRef = useRef(null);

  const BOARD_SIZE = 8;

  class KnightsTourSolver {
    constructor(boardSize = 8) {
      this.boardSize = boardSize;
      this.board = Array(boardSize).fill().map(() => Array(boardSize).fill(-1));
      this.moves = [
        [2, 1], [1, 2], [-1, 2], [-2, 1],
        [-2, -1], [-1, -2], [1, -2], [2, -1],
      ];
    }

    isValid(x, y) {
      return (
        x >= 0 && x < this.boardSize &&
        y >= 0 && y < this.boardSize &&
        this.board[x][y] === -1
      );
    }

    countOnwardMoves(x, y) {
      let count = 0;
      for (const [dx, dy] of this.moves) {
        if (this.isValid(x + dx, y + dy)) count++;
      }
      return count;
    }

    solveBacktracking(x, y, moveCount, startX, startY, isClosedTour = false) {
      this.board[x][y] = moveCount;

      if (moveCount === this.boardSize * this.boardSize - 1) {
        if (isClosedTour) {
          for (const [dx, dy] of this.moves) {
            if (x + dx === startX && y + dy === startY) return true;
          }
          this.board[x][y] = -1;
          return false;
        }
        return true;
      }

      const nextMoves = [];
      for (const [dx, dy] of this.moves) {
        const nextX = x + dx;
        const nextY = y + dy;
        if (this.isValid(nextX, nextY)) {
          const priority = this.countOnwardMoves(nextX, nextY);
          nextMoves.push([priority, nextX, nextY]);
        }
      }

      nextMoves.sort((a, b) => a[0] - b[0]);

      for (const [, nextX, nextY] of nextMoves) {
        if (this.solveBacktracking(nextX, nextY, moveCount + 1, startX, startY, isClosedTour)) {
          return true;
        }
      }

      this.board[x][y] = -1;
      return false;
    }

    solveOpenTour(startX, startY) {
      this.board = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(-1));
      return this.solveBacktracking(startX, startY, 0, startX, startY, false);
    }

    solveClosedTour(startX, startY) {
      this.board = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(-1));
      return this.solveBacktracking(startX, startY, 0, startX, startY, true);
    }

    getSolution() {
      return this.board;
    }
  }

  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  const handleBoardClick = (x, y) => {
    if (!loading && !animationRunning) {
      setSelectedStart({ x, y });
      setSolution(null);
      setError('');
    }
  };

  const solveTour = () => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    setLoading(true);
    setError('');
    setSolution(null);
    setAnimatingPath([]);
    setCurrentMove(-1);
    setAnimationRunning(false);

    setTimeout(() => {
      try {
        const solver = new KnightsTourSolver(BOARD_SIZE);
        const startTime = performance.now();

        let success = tourType === 'closed'
          ? solver.solveClosedTour(selectedStart.x, selectedStart.y)
          : solver.solveOpenTour(selectedStart.x, selectedStart.y);

        const elapsed = (performance.now() - startTime) / 1000;

        if (success) {
          setSolution(solver.getSolution());
          setComputeTime(elapsed.toFixed(3));
          animatePath(solver.getSolution());
        } else {
          setError(`No solution found for ${tourType} tour from position (${selectedStart.x}, ${selectedStart.y}). Try another starting position!`);
        }
      } catch (err) {
        setError(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }, 0);
  };

  const animatePath = (solutionBoard) => {
    const path = [];
    for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        for (let y = 0; y < BOARD_SIZE; y++) {
          if (solutionBoard[x][y] === i) {
            path.push({ x, y, move: i });
          }
        }
      }
    }
    setAnimatingPath(path);
    setCurrentMove(-1);
    setAnimationRunning(true);
    animateStep(path, 0);
  };

  const animateStep = (path, index) => {
    if (index < path.length) {
      setCurrentMove(index);
      animationTimeoutRef.current = setTimeout(() => animateStep(path, index + 1), animationSpeed);
    } else {
      setAnimationRunning(false);
      animationTimeoutRef.current = null;
    }
  };

  const restart = () => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }

    setSolution(null);
    setError('');
    setComputeTime('');
    setAnimatingPath([]);
    setCurrentMove(-1);
    setAnimationRunning(false);
  };

  const isStartPosition = (x, y) => x === selectedStart.x && y === selectedStart.y;
  
  const isCurrentPosition = (x, y) => {
    if (currentMove >= 0 && currentMove < animatingPath.length) {
      return animatingPath[currentMove].x === x && animatingPath[currentMove].y === y;
    }
    return false;
  };

  const getCurrentKnightPosition = () => {
    if (currentMove >= 0 && currentMove < animatingPath.length) {
      return animatingPath[currentMove];
    }
    return null;
  };

  const isVisited = (x, y) => {
    if (currentMove < 0) return false;
    for (let i = 0; i <= currentMove; i++) {
      if (animatingPath[i] && animatingPath[i].x === x && animatingPath[i].y === y) {
        return true;
      }
    }
    return false;
  };

  const getTrailLines = () => {
    if (currentMove < 1) return [];
    
    const lines = [];
    for (let i = 0; i < currentMove; i++) {
      const from = animatingPath[i];
      const to = animatingPath[i + 1];
      if (from && to) {
        lines.push({ from, to, index: i });
      }
    }
    return lines;
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>Knight's Tour</h1>
        <p className="subtitle">Graph Theory Visualization</p>
      </div>

      <div className="main-content">
        <div className="control-section">
          <div className="control-panel">
            <h2 className="panel-title">Settings</h2>
            
            <div className="control-group">
              <label>Tour Type</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    value="open"
                    checked={tourType === 'open'}
                    onChange={(e) => setTourType(e.target.value)}
                    disabled={loading || animationRunning}
                  />
                  <span>Open Tour (end anywhere)</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    value="closed"
                    checked={tourType === 'closed'}
                    onChange={(e) => setTourType(e.target.value)}
                    disabled={loading || animationRunning}
                  />
                  <span>Closed Tour (return to start)</span>
                </label>
              </div>
            </div>

            <div className="control-group">
              <label>Start Position</label>
              <div className="start-position-display">
                <div className="position-value">
                  ({selectedStart.x}, {selectedStart.y})
                </div>
                <p className="hint">Click any square on the board</p>
              </div>
            </div>

            <div className="control-group">
              <label>Animation Speed: {animationSpeed}ms</label>
              <input
                type="range"
                min="50"
                max="500"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                disabled={animationRunning}
                className="slider"
              />
              <div className="slider-labels">
                <span>Fast</span>
                <span>Slow</span>
              </div>
            </div>

            <div className="button-group">
              <button
                className="solve-btn"
                onClick={solveTour}
                disabled={loading || animationRunning}
              >
                {loading ? (
                  <span className="btn-content">
                    <span className="spinner"></span>
                    Solving...
                  </span>
                ) : 'Solve Tour'}
              </button>
              
              <button
                className="restart-btn"
                onClick={restart}
                disabled={!solution && !error}
              >
                Reset
              </button>
            </div>

            {computeTime && (
              <div className="compute-time">
                Computed in {computeTime}s
              </div>
            )}

            {error && (
              <div className="error-message">{error}</div>
            )}
          </div>

          <div className="info-panel">
            <h2 className="panel-title">Status</h2>
            {solution ? (
              <div className="stats">
                <div className="stat-row">
                  <span className="stat-label">Status</span>
                  <span className="stat-value success">Solution Found</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Tour Type</span>
                  <span className="stat-value">{tourType.toUpperCase()}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Progress</span>
                  <span className="stat-value highlight">{currentMove + 1} / 64</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Computation</span>
                  <span className="stat-value">{computeTime}s</span>
                </div>
              </div>
            ) : (
              <p className="info-text">
                {loading ? 'Computing solution...' : 'Select a start position and click Solve Tour'}
              </p>
            )}
          </div>
        </div>

        <div className="board-section">
          <div className="board-wrapper">
            <div className="board-container">
              <svg className="trail-svg" viewBox="0 0 640 640" xmlns="http://www.w3.org/2000/svg">
                {getTrailLines().map(({ from, to, index }) => {
                  const x1 = from.y * 80 + 40;
                  const y1 = from.x * 80 + 40;
                  const x2 = to.y * 80 + 40;
                  const y2 = to.x * 80 + 40;
                  
                  return (
                    <line
                      key={`line-${index}`}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      className="trail-line"
                      style={{
                        animationDelay: `${index * 0.05}s`
                      }}
                    />
                  );
                })}
              </svg>
              
              <div className="board">
                {Array.from({ length: BOARD_SIZE }).map((_, x) =>
                  Array.from({ length: BOARD_SIZE }).map((_, y) => {
                    const isLight = (x + y) % 2 === 0;
                    const isStart = isStartPosition(x, y);
                    const isCurrent = isCurrentPosition(x, y);
                    const visited = isVisited(x, y);
                    const knightPos = getCurrentKnightPosition();
                    const showKnight = knightPos && knightPos.x === x && knightPos.y === y;
                    
                    return (
                      <div
                        key={`${x}-${y}`}
                        onClick={() => handleBoardClick(x, y)}
                        className={`
                          cell
                          ${isLight ? 'light' : 'dark'}
                          ${isStart ? 'start' : ''}
                          ${isCurrent ? 'current' : ''}
                          ${visited ? 'visited' : ''}
                        `}
                      >
                        {solution && solution[x][y] >= 0 && (
                          <span className="move-number">{solution[x][y]}</span>
                        )}
                        
                        {showKnight && (
                          <span className="knight-piece">♞</span>
                        )}
                        
                        {isStart && !showKnight && (
                          <div className="start-marker">
                            <div className="marker-ping"></div>
                            <div className="marker-dot"></div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnightsTour;
