import axios from "axios";
import type { TreeNode, TreeOperationResponse } from "@/types/tree";

const API_BASE_URL = "https://test.vmarmysh.com";

export interface AddNodeResponse extends TreeOperationResponse {
    nodeId?: number;
}

export const treeService = {
    getTree: async (treeName: string): Promise<TreeNode> => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/api.user.tree.get?treeName=${treeName}`,
            );
            return response.data;
        } catch (error) {
            console.error("Failed to fetch tree:", error);
            throw new Error("Failed to fetch tree data");
        }
    },

    addNode: async (
        treeName: string,
        parentNodeId: number,
        nodeName: string,
    ): Promise<AddNodeResponse> => {
        try {
            const props = new URLSearchParams();
            props.append("treeName", treeName);
            props.append("parentNodeId", parentNodeId.toString());
            props.append("nodeName", nodeName);

            const response = await axios.post(
                `${API_BASE_URL}/api.user.tree.node.create?${props.toString()}`,
            );

            return {
                success: response.status === 200,
                nodeId: response.data?.nodeId,
            };
        } catch (error: any) {
            console.error("Failed to add node:", error);
            return {
                success: false,
                error: error.response?.data?.message || "Failed to add node",
            };
        }
    },

    deleteNode: async (
        treeName: string,
        nodeId: number,
    ): Promise<TreeOperationResponse> => {
        try {
            const props = new URLSearchParams();
            props.append("treeName", treeName);
            props.append("nodeId", nodeId.toString());

            const response = await axios.post(
                `${API_BASE_URL}/api.user.tree.node.delete?${props.toString()}`,
            );

            return { success: response.status === 200 };
        } catch (error: any) {
            console.error("Failed to delete node:", error);
            return {
                success: false,
                error: error.response?.data?.message || "Failed to delete node",
            };
        }
    },

    renameNode: async (
        treeName: string,
        nodeId: number,
        newNodeName: string,
    ): Promise<TreeOperationResponse> => {
        try {
            const props = new URLSearchParams();
            props.append("treeName", treeName);
            props.append("nodeId", nodeId.toString());
            props.append("newNodeName", newNodeName);

            const response = await axios.post(
                `${API_BASE_URL}/api.user.tree.node.rename?${props.toString()}`,
            );

            return { success: response.status === 200 };
        } catch (error: any) {
            console.error("Failed to rename node:", error);
            return {
                success: false,
                error: error.response?.data?.message || "Failed to rename node",
            };
        }
    },

    deleteNodeRecursive: async (
        treeName: string,
        node: TreeNode,
    ): Promise<TreeOperationResponse> => {
        try {
            if (node.children && node.children.length > 0) {
                for (const child of node.children) {
                    const result = await treeService.deleteNodeRecursive(
                        treeName,
                        child,
                    );
                    if (!result.success) {
                        return result;
                    }
                }
            }

            return await treeService.deleteNode(treeName, node.id);
        } catch (error: any) {
            console.error("Failed to delete node recursively:", error);
            return {
                success: false,
                error:
                    error.response?.data?.message ||
                    "Failed to delete node recursively",
            };
        }
    },
};
