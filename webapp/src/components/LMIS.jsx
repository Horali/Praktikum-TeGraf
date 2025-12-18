import React, { useState, useRef, useEffect } from 'react';
import '../styles/LMIS.css';

const LMIS = () => {
    const [inputArray, setInputArray] = useState('4, 1, 13, 7, 0, 2, 8, 11, 3');
    const [tree, setTree] = useState(null);
    const [solution, setSolution] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [computeTime, setComputeTime] = useState('');
    const [animationSpeed, setAnimationSpeed] = useState(200);
    const [animationRunning, setAnimationRunning] = useState(false);
    const [visibleNodes, setVisibleNodes] = useState([]);
    const [currentDepth, setCurrentDepth] = useState(-1);
    const animationTimeoutRef = useRef(null);

    class TreeNode {
        constructor(value, index, parent = null, depth = 0) {
            this.value = value;
            this.index = index;
            this.parent = parent;
            this.children = [];
            this.depth = depth;
            this.path = [];
            this.id = Math.random().toString(36).substr(2, 9);
        }
    }

    class LMISSolver {
        constructor(sequence) {
            this.sequence = sequence;
            this.tree = [];
            this.longest_path = [];
            this.max_length = 0;
        }

        buildTree() {
            if (!this.sequence || this.sequence.length === 0) {
                return;
            }

            const root = new TreeNode(null, -1, null, 0);
            root.path = [];
            this.tree = [root];

            this._buildRecursive(root, 0);
            return this.tree;
        }

        _buildRecursive(parent, startIdx) {
            for (let i = startIdx; i < this.sequence.length; i++) {
                const currentValue = this.sequence[i];

                if (parent.value === null || currentValue > parent.value) {
                    const child = new TreeNode(currentValue, i, parent, parent.depth + 1);
                    child.path = [...parent.path, currentValue];

                    parent.children.push(child);
                    this.tree.push(child);

                    if (child.path.length > this.max_length) {
                        this.max_length = child.path.length;
                        this.longest_path = [...child.path];
                    }

                    this._buildRecursive(child, i + 1);
                }
            }
        }

        solve() {
            this.buildTree();
            return this.longest_path;
        }

        getTreeStructure() {
            return this.tree.map(node => ({
                id: node.id,
                value: node.value,
                index: node.index,
                depth: node.depth,
                path: node.path,
                isSolution: JSON.stringify(node.path) === JSON.stringify(this.longest_path) && node.path.length > 0,
                parentId: node.parent ? node.parent.id : null,
                children: node.children.map(c => c.id)
            }));
        }
    }

    useEffect(() => {
        return () => {
            if (animationTimeoutRef.current) {
                clearTimeout(animationTimeoutRef.current);
            }
        };
    }, []);

    const parseInput = (input) => {
        try {
            const arr = input.split(',').map(s => {
                const num = parseInt(s.trim());
                if (isNaN(num)) throw new Error('Invalid number');
                return num;
            });
            if (arr.length === 0) throw new Error('Empty array');
            return arr;
        } catch (e) {
            throw new Error('Invalid input. Please enter comma-separated numbers (e.g., 4, 1, 13, 7)');
        }
    };

    const solveLMIS = () => {
        if (animationTimeoutRef.current) {
            clearTimeout(animationTimeoutRef.current);
        }

        setLoading(true);
        setError('');
        setTree(null);
        setSolution(null);
        setVisibleNodes([]);
        setCurrentDepth(-1);
        setAnimationRunning(false);

        setTimeout(() => {
            try {
                const sequence = parseInput(inputArray);
                const solver = new LMISSolver(sequence);
                const startTime = performance.now();

                const result = solver.solve();
                const elapsed = (performance.now() - startTime) / 1000;

                const treeStructure = solver.getTreeStructure();

                setTree(treeStructure);
                setSolution(result);
                setComputeTime(elapsed.toFixed(3));
                animateTree(treeStructure);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }, 0);
    };

    const animateTree = (treeStructure) => {
        const maxDepth = Math.max(...treeStructure.map(n => n.depth));
        setVisibleNodes([]);
        setCurrentDepth(-1);
        setAnimationRunning(true);
        animateDepth(treeStructure, 0, maxDepth);
    };

    const animateDepth = (treeStructure, depth, maxDepth) => {
        if (depth <= maxDepth) {
            const nodesAtDepth = treeStructure.filter(n => n.depth === depth);
            setVisibleNodes(prev => [...prev, ...nodesAtDepth.map(n => n.id)]);
            setCurrentDepth(depth);

            animationTimeoutRef.current = setTimeout(
                () => animateDepth(treeStructure, depth + 1, maxDepth),
                animationSpeed
            );
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

        setTree(null);
        setSolution(null);
        setError('');
        setComputeTime('');
        setVisibleNodes([]);
        setCurrentDepth(-1);
        setAnimationRunning(false);
    };

    const getNodePosition = (node, treeStructure) => {
        const nodesAtDepth = treeStructure.filter(n => n.depth === node.depth);
        const indexAtDepth = nodesAtDepth.findIndex(n => n.id === node.id);

        // Vertical spacing
        const y = node.depth * 100 + 50;

        // Dynamic width based on number of nodes at this depth
        const maxNodesAtAnyDepth = Math.max(...Array.from(
            { length: Math.max(...treeStructure.map(n => n.depth)) + 1 },
            (_, depth) => treeStructure.filter(n => n.depth === depth).length
        ));

        // Calculate total width needed (minimum 1200px, scales up for more nodes)
        const minWidth = 1200;
        const nodeWidth = 90; // minimum space per node
        const totalWidth = Math.max(minWidth, maxNodesAtAnyDepth * nodeWidth);

        // Distribute nodes evenly across available width
        const spacing = totalWidth / (nodesAtDepth.length + 1);
        const x = spacing * (indexAtDepth + 1);

        return { x, y };
    };

    const renderTree = () => {
        if (!tree) return null;

        const maxDepth = Math.max(...tree.map(n => n.depth));

        // Calculate dynamic dimensions
        const maxNodesAtAnyDepth = Math.max(...Array.from(
            { length: maxDepth + 1 },
            (_, depth) => tree.filter(n => n.depth === depth).length
        ));

        const minWidth = 1200;
        const nodeWidth = 90;
        const svgWidth = Math.max(minWidth, maxNodesAtAnyDepth * nodeWidth);
        const svgHeight = (maxDepth + 1) * 100 + 100;

        return (
            <svg className="tree-svg" viewBox={`0 0 ${svgWidth} ${svgHeight}`} xmlns="http://www.w3.org/2000/svg">
                {/* Draw edges */}
                {tree.map(node => {
                    if (!node.parentId || !visibleNodes.includes(node.id)) return null;

                    const parent = tree.find(n => n.id === node.parentId);
                    if (!parent) return null;

                    const parentPos = getNodePosition(parent, tree);
                    const nodePos = getNodePosition(node, tree);

                    return (
                        <line
                            key={`edge-${node.id}`}
                            x1={parentPos.x}
                            y1={parentPos.y}
                            x2={nodePos.x}
                            y2={nodePos.y}
                            className="tree-edge"
                            style={{
                                animationDelay: `${node.depth * 0.05}s`
                            }}
                        />
                    );
                })}

                {/* Draw nodes */}
                {tree.map(node => {
                    if (!visibleNodes.includes(node.id)) return null;

                    const pos = getNodePosition(node, tree);
                    const isRoot = node.value === null;
                    const isSolution = node.isSolution;

                    return (
                        <g key={`node-${node.id}`} className="tree-node-group">
                            <circle
                                cx={pos.x}
                                cy={pos.y}
                                r="30"
                                className={`tree-node ${isRoot ? 'root' : ''} ${isSolution ? 'solution' : ''}`}
                                style={{
                                    animationDelay: `${node.depth * 0.05}s`
                                }}
                            />
                            <text
                                x={pos.x}
                                y={pos.y}
                                className="node-text"
                                textAnchor="middle"
                                dominantBaseline="middle"
                            >
                                {isRoot ? 'R' : node.value}
                            </text>
                        </g>
                    );
                })}
            </svg>
        );
    };

    return (
        <div className="app-container">
            <div className="header">
                <h1>Largest Monotonically Increasing Subsequence</h1>
                <p className="subtitle">Graph Theory Visualization</p>
            </div>

            <div className="main-content">
                <div className="control-section">
                    <div className="control-panel">
                        <h2 className="panel-title">Settings</h2>

                        <div className="control-group">
                            <label>Input Array</label>
                            <input
                                type="text"
                                className="array-input"
                                value={inputArray}
                                onChange={(e) => setInputArray(e.target.value)}
                                disabled={loading || animationRunning}
                                placeholder="e.g., 4, 1, 13, 7, 0, 2, 8, 11, 3"
                            />
                            <p className="hint">Enter comma-separated numbers</p>
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
                                onClick={solveLMIS}
                                disabled={loading || animationRunning}
                            >
                                {loading ? (
                                    <span className="btn-content">
                                        <span className="spinner"></span>
                                        Solving...
                                    </span>
                                ) : 'Solve LMIS'}
                            </button>

                            <button
                                className="restart-btn"
                                onClick={restart}
                                disabled={!tree && !error}
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
                                    <span className="stat-label">Subsequence</span>
                                    <span className="stat-value highlight">[{solution.join(', ')}]</span>
                                </div>
                                <div className="stat-row">
                                    <span className="stat-label">Length</span>
                                    <span className="stat-value">{solution.length}</span>
                                </div>
                                <div className="stat-row">
                                    <span className="stat-label">Tree Depth</span>
                                    <span className="stat-value">{currentDepth >= 0 ? currentDepth : tree ? Math.max(...tree.map(n => n.depth)) : 0}</span>
                                </div>
                                <div className="stat-row">
                                    <span className="stat-label">Total Nodes</span>
                                    <span className="stat-value">{tree ? tree.length : 0}</span>
                                </div>
                            </div>
                        ) : (
                            <p className="info-text">
                                {loading ? 'Computing solution...' : 'Enter an array and click Solve LMIS'}
                            </p>
                        )}
                    </div>
                </div>

                <div className="board-section">
                    <div className="board-wrapper">
                        {tree ? renderTree() : (
                            <div className="empty-state">
                                <p>Tree visualization will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LMIS;