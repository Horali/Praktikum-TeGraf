class KnightsTourSolver:
    """
    Solves the Knight's Tour problem using backtracking + Warnsdorff's heuristic
    
    Knight moves in L-shape: 2 squares one direction, 1 perpendicular
    Goal: Visit all 64 squares exactly once
    """
    
    def __init__(self, board_size=8):
        """Initialize solver with board and knight moves"""
        self.board_size = board_size
        self.board = [[-1 for _ in range(board_size)] for _ in range(board_size)]
        self.moves = [
            (2, 1), (1, 2), (-1, 2), (-2, 1),
            (-2, -1), (-1, -2), (1, -2), (2, -1)
        ]
    
    def is_valid(self, x, y):
        """Check if position is on board and unvisited"""
        return (0 <= x < self.board_size and 
                0 <= y < self.board_size and 
                self.board[x][y] == -1)
    
    def count_onward_moves(self, x, y):
        """Warnsdorff's heuristic: count valid moves from position"""
        count = 0
        for dx, dy in self.moves:
            if self.is_valid(x + dx, y + dy):
                count += 1
        return count
    
    def solve_backtracking(self, x, y, move_count, start_x, start_y, is_closed=False):
        """Main recursive backtracking algorithm"""
        self.board[x][y] = move_count
        
        # Check if all squares visited
        if move_count == self.board_size * self.board_size - 1:
            if is_closed:
                # For closed tour: check if can return to start
                for dx, dy in self.moves:
                    if x + dx == start_x and y + dy == start_y:
                        return True
                self.board[x][y] = -1
                return False
            return True
        
        # Get valid next moves and sort by Warnsdorff's heuristic
        next_moves = []
        for dx, dy in self.moves:
            next_x, next_y = x + dx, y + dy
            if self.is_valid(next_x, next_y):
                priority = self.coungitt_onward_moves(next_x, next_y)
                next_moves.append((priority, next_x, next_y))
        
        next_moves.sort()
        
        # Try each move
        for _, next_x, next_y in next_moves:
            if self.solve_backtracking(next_x, next_y, move_count + 1, 
                                      start_x, start_y, is_closed):
                return True
        
        # Backtrack
        self.board[x][y] = -1
        return False
    
    def solve_open_tour(self, start_x, start_y):
        """Solve open tour (can end anywhere)"""
        self.board = [[-1 for _ in range(self.board_size)] 
                      for _ in range(self.board_size)]
        return self.solve_backtracking(start_x, start_y, 0, 
                                       start_x, start_y, is_closed=False)
    
    def solve_closed_tour(self, start_x, start_y):
        """Solve closed tour (must return to start)"""
        self.board = [[-1 for _ in range(self.board_size)] 
                      for _ in range(self.board_size)]
        return self.solve_backtracking(start_x, start_y, 0, 
                                       start_x, start_y, is_closed=True)
    
    def get_solution(self):
        """Return the board (move order for each square)"""
        return self.board