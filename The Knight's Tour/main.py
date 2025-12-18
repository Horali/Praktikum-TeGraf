from knight_tour import KnightsTourSolver
import time


def test_algorithm():
    """Quick test of the algorithm (optional, for local testing)"""
    
    print("Testing Knight's Tour Algorithm...")
    print("-" * 40)
    
    # Test 1: Open tour
    solver = KnightsTourSolver()
    start = time.time()
    result = solver.solve_open_tour(0, 0)
    elapsed = time.time() - start
    
    print(f"Open tour from (0,0): {'✓ Found' if result else '✗ Failed'} in {elapsed:.3f}s")
    
    # Test 2: Closed tour
    solver2 = KnightsTourSolver()
    start = time.time()
    result2 = solver2.solve_closed_tour(1, 2)
    elapsed = time.time() - start
    
    print(f"Closed tour from (1,2): {'✓ Found' if result2 else '✗ Failed'} in {elapsed:.3f}s")
    
    print("-" * 40)
    print("Tests complete!")


if __name__ == "__main__":
    test_algorithm()