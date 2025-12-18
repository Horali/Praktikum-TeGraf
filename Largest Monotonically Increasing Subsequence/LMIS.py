class LMISSolver:
    def _init_(self, sequence):
        """Initialize solver with input sequence"""
        self.sequence = sequence
        self.tree = []  # Stores tree structure as list of nodes
        self.longest_path = []
        self.max_length = 0
    
    class TreeNode:
        """Represents a node in the decision tree"""
        def _init_(self, value, index, parent=None, depth=0):
            self.value = value
            self.index = index  # Index in original sequence
            self.parent = parent
            self.children = []
            self.depth = depth
            self.path = []  # Path from root to this node
    
    def build_tree(self):
        """Build complete decision tree for all possible subsequences"""
        if not self.sequence:
            return
        
        # Root node (empty subsequence)
        root = self.TreeNode(None, -1, None, 0)
        root.path = []
        self.tree = [root]
        
        # Build tree level by level
        self._build_recursive(root, 0)
        
        return self.tree
    
    def _build_recursive(self, parent, start_idx):
        """Recursively build tree by trying to add each remaining element"""
        for i in range(start_idx, len(self.sequence)):
            current_value = self.sequence[i]
            
            # Check if we can add this element (monotonically increasing)
            if parent.value is None or current_value > parent.value:
                # Create new node
                child = self.TreeNode(current_value, i, parent, parent.depth + 1)
                child.path = parent.path + [current_value]
                
                parent.children.append(child)
                self.tree.append(child)
                
                # Update longest path if this is longer
                if len(child.path) > self.max_length:
                    self.max_length = len(child.path)
                    self.longest_path = child.path.copy()
                
                # Continue building from this node
                self._build_recursive(child, i + 1)
    
    def solve(self):
        """Solve LMIS problem and return the longest subsequence"""
        self.build_tree()
        return self.longest_path
    
    def get_tree_structure(self):
        """Return tree structure for visualization"""
        tree_data = []
        for node in self.tree:
            tree_data.append({
                'value': node.value,
                'index': node.index,
                'depth': node.depth,
                'path': node.path,
                'is_solution': node.path == self.longest_path if node.path else False
            })
        return tree_data
    
    def get_solution_indices(self):
        """Return indices of elements in the longest subsequence"""
        solution_indices = []
        for node in self.tree:
            if node.path == self.longest_path and len(node.path) > 0:
                solution_indices.append(node.index)
        
        # Return unique indices in order
        return sorted(set(solution_indices))
    
    def print_tree(self, node=None, prefix="", is_last=True):
        """Pretty print the tree structure"""
        if node is None:
            if not self.tree:
                return
            node = self.tree[0]
        
        # Print current node
        connector = "+-- " if is_last else "|-- "
        if node.value is None:
            print(prefix + connector + "ROOT")
        else:
            marker = " *" if node.path == self.longest_path else ""
            print(f"{prefix}{connector}{node.value} (index: {node.index}){marker}")
        
        # Print children
        children = node.children
        for i, child in enumerate(children):
            extension = "    " if is_last else "|   "
            self.print_tree(child, prefix + extension, i == len(children) - 1)