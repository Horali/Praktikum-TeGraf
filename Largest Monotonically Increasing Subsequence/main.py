from LMIS import LMISSolver
import time


def test_algorithm():
    """Quick test of the algorithm (optional, for local testing)"""
    
    print("Testing LMIS Algorithm...")
    print("-" * 40)
    
    # Test with the example from the practicum
    test_sequence = [4, 1, 13, 7, 0, 2, 8, 11, 3]
    
    print(f"Input sequence: {test_sequence}")
    print()
    
    # Solve LMIS
    solver = LMISSolver(test_sequence)
    start = time.time()
    result = solver.solve()
    elapsed = time.time() - start
    
    print(f"Longest Monotonically Increasing Subsequence:")
    print(f"  Subsequence: {result}")
    print(f"  Length: {len(result)}")
    print(f"  Computation time: {elapsed:.3f}s")
    print()
    
    # Print tree structure
    print("Decision Tree Structure:")
    print("(* marks nodes in the solution path)")
    print()
    solver.print_tree()
    print()
    
    print("-" * 40)
    print("Test complete!")


if __name__ == "__main__":
    test_algorithm()