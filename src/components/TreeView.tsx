import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import TreeItem from "@/components/TreeItem";
import { TreeNode } from "@/types/tree";
import { treeService } from "@/services/treeService";
import Dialog from "@/components/Dialog";

interface TreeViewProps {
    treeName: string;
}

const findAndUpdateNode = (
    nodes: TreeNode[],
    nodeId: number,
    updateFn: (node: TreeNode) => TreeNode,
): [TreeNode[], boolean] => {
    let updated = false;

    const updateNodes = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map((node) => {
            if (node.id === nodeId) {
                updated = true;
                return updateFn(node);
            }

            if (node.children && node.children.length > 0) {
                const [updatedChildren, childUpdated] = findAndUpdateNode(
                    node.children,
                    nodeId,
                    updateFn,
                );
                if (childUpdated) {
                    updated = true;
                    return { ...node, children: updatedChildren };
                }
            }

            return node;
        });
    };

    return [updateNodes(nodes), updated];
};

const findAndRemoveNode = (
    nodes: TreeNode[],
    nodeId: number,
): [TreeNode[], boolean] => {
    let removed = false;

    const updatedNodes = nodes
        .map((node) => {
            if (node.id === nodeId) {
                removed = true;
                return null;
            }

            const [filteredChildren, childRemoved] = findAndRemoveNode(
                node.children || [],
                nodeId,
            );
            if (childRemoved) {
                removed = true;
                return { ...node, children: filteredChildren };
            }

            return node;
        })
        .filter((node): node is TreeNode => node !== null);

    return [updatedNodes, removed];
};

const findAndAddChild = (
    nodes: TreeNode[],
    parentId: number,
    newChild: TreeNode,
): [TreeNode[], boolean] => {
    let added = false;

    const updateNodes = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map((node) => {
            if (node.id === parentId) {
                added = true;
                return {
                    ...node,
                    children: [...(node.children || []), newChild],
                };
            }

            if (node.children && node.children.length > 0) {
                const [updatedChildren, childAdded] = findAndAddChild(
                    node.children,
                    parentId,
                    newChild,
                );
                if (childAdded) {
                    added = true;
                    return { ...node, children: updatedChildren };
                }
            }

            return node;
        });
    };

    return [updateNodes(nodes), added];
};

const findNodeById = (nodes: TreeNode[], nodeId: number): TreeNode | null => {
    for (const node of nodes) {
        if (node.id === nodeId) {
            return node;
        }

        if (node.children && node.children.length > 0) {
            const foundNode = findNodeById(node.children, nodeId);
            if (foundNode) {
                return foundNode;
            }
        }
    }

    return null;
};

const TreeView = ({ treeName }: TreeViewProps) => {
    const [treeData, setTreeData] = useState<TreeNode | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTree = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { error, tree } = await treeService.getTree(treeName);
            if (error) {
                console.error("Failed to fetch tree:", error);
                setError("Failed to load tree data. Please try again later.");
            } else {
                setTreeData(tree!);
            }
        } finally {
            setLoading(false);
        }
    }, [treeName]);

    const handleAddChild = useCallback(
        async (parentNodeId: number, nodeName: string) => {
            if (!treeData) return;

            const tempId = Date.now();

            const newNode: TreeNode = {
                id: tempId,
                name: nodeName,
                children: [],
            };

            const [updatedTree, added] = findAndAddChild(
                [treeData],
                parentNodeId,
                newNode,
            );

            if (added) {
                setTreeData(updatedTree[0]);

                const { error } = await treeService.addNode(
                    treeName,
                    parentNodeId,
                    nodeName,
                );
                fetchTree();
            }
        },
        [treeName, treeData, fetchTree],
    );

    const handleDelete = useCallback(
        async (treeName: string, nodeId: number) => {
            if (!treeData) return;

            const nodeToDelete = findNodeById([treeData], nodeId);
            if (!nodeToDelete) {
                return;
            }

            const [updatedTree, removed] = findAndRemoveNode(
                [treeData],
                nodeId,
            );

            console.log(updatedTree, removed);
            if (removed) {
                setTreeData(updatedTree[0]);

                const { error } = await treeService.deleteNodeRecursive(
                    treeName,
                    nodeToDelete,
                );
                if (error) {
                    fetchTree();
                }
            }
        },
        [treeName, treeData, fetchTree],
    );

    const handleRename = useCallback(
        async (treeName: string, nodeId: number, newNodeName: string) => {
            if (!treeData) return;

            const [updatedTree, updated] = findAndUpdateNode(
                [treeData],
                nodeId,
                (node) => ({
                    ...node,
                    name: newNodeName,
                }),
            );

            if (updated) {
                setTreeData(updatedTree[0]);

                const { error } = await treeService.renameNode(
                    treeName,
                    nodeId,
                    newNodeName,
                );
                if (error) {
                    fetchTree();
                }
            }
        },
        [treeName, treeData, fetchTree],
    );

    useEffect(() => {
        fetchTree();
    }, [treeName]);

    if (!treeData) {
        if (loading) {
            return <div>Loading...</div>;
        } else if (error) {
            return <div>{error}</div>;
        } else {
            return <div>Unexpected error loading</div>;
        }
    }

    return (
        <TreeItem
            treeName={treeName}
            node={treeData}
            onAddChild={handleAddChild}
            onRename={handleRename}
            onDelete={handleDelete}
            isRoot
        />
    );
};

export default TreeView;
