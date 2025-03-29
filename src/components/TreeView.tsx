import { useState, useEffect } from "react";
import axios from "axios";
import TreeItem from "@/components/TreeItem";

interface TreeNode {
    id: number;
    name: string;
    children: TreeNode[];
}

export interface TreeItemProps {
    treeName: string;
    node: TreeNode;
    onAddChild: (parentId: number, nodeName: string) => Promise<void>;
    onDelete: (treeName: string, nodeId: number) => Promise<void>;
    onRename: (
        treeName: string,
        nodeId: number,
        newName: string,
    ) => Promise<void>;
}

const TreeView = () => {
    const [treeData, setTreeData] = useState<TreeNode | null>(null);
    const [treeName] = useState<string>(
        "jdhfgljfdhljk-asdjewurhgwekrgdjksf-cxvdfsvsdf",
    );

    const fetchTree = async () => {
        try {
            const response = await axios.post(
                `https://test.vmarmysh.com/api.user.tree.get?treeName=${treeName}`,
            );
            setTreeData(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Failed to fetch tree:", error);
        }
    };

    const handleAddChild = async (parentNodeId: number, nodeName: string) => {
        const props = new URLSearchParams();
        props.append("treeName", treeName);
        props.append("parentNodeId", parentNodeId.toString());
        props.append("nodeName", nodeName);

        const response = await axios.post(
            `https://test.vmarmysh.com/api.user.tree.node.create?${props.toString()}`,
        );
        if (response.status === 200) {
            fetchTree();
        }
    };

    const handleDelete = async (treeName: string, nodeId: number) => {
        const props = new URLSearchParams();
        props.append("treeName", treeName);
        props.append("nodeId", nodeId.toString());

        const response = await axios.post(
            `https://test.vmarmysh.com/api.user.tree.node.delete?${props.toString()}`,
        );
        if (response.status === 200) {
            fetchTree();
        }
    };

    const handleRename = async (
        treeName: string,
        nodeId: number,
        newNodeName: string,
    ) => {
        const props = new URLSearchParams();
        props.append("treeName", treeName);
        props.append("nodeId", nodeId.toString());
        props.append("newNodeName", newNodeName);

        const response = await axios.post(
            `https://test.vmarmysh.com/api.user.tree.node.rename?${props.toString()}`,
        );
        if (response.status === 200) {
            fetchTree();
        }
    };

    useEffect(() => {
        fetchTree();
    }, [treeName]);

    if (!treeData) return <div>Loading...</div>;

    return (
        <div>
            <ul>
                <TreeItem
                    treeName={treeName}
                    node={treeData}
                    onAddChild={handleAddChild}
                    onRename={handleRename}
                    onDelete={handleDelete}
                />
            </ul>
        </div>
    );
};

export default TreeView;
