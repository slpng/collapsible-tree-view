import axios from "axios";
import type { TreeNode, TreeOperationResponse } from "@/types/tree";

const API_BASE_URL = "https://test.vmarmysh.com";

export interface AddNodeResponse extends TreeOperationResponse {
    nodeId?: number;
}

export interface GetTreeResponse extends TreeOperationResponse {
    tree?: TreeNode;
}

export const treeService = {
    getTree: async (treeName: string): Promise<GetTreeResponse> => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/api.user.tree.get?treeName=${treeName}`,
            );
            if (response.status === 200) {
                return {
                    tree: response.data,
                    error: null,
                };
            }

            return {
                error: response.data?.message || "Failed to get tree via API",
            };
        } catch (error: any) {
            return {
                error:
                    error.response?.data?.message ||
                    "Failed to get tree due to an unexpected error",
            };
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
            if (response.status === 200) {
                return {
                    nodeId: response.data?.nodeId,
                    error: null,
                };
            }

            return {
                error: response.data?.message || "Failed to add node via API",
            };
        } catch (error: any) {
            return {
                error:
                    error.response?.data?.message ||
                    "Failed to add node due to an unexpected error",
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

            return {
                error:
                    response.status === 200
                        ? null
                        : response.data?.message ||
                          "Failed to delete node via API",
            };
        } catch (error: any) {
            return {
                error:
                    error.response?.data?.message ||
                    "Failed to delete node due to an unexpected error",
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

            return {
                error:
                    response.status === 200
                        ? null
                        : response.data?.message ||
                          "Failed to rename node via API",
            };
        } catch (error: any) {
            return {
                error:
                    error.response?.data?.message ||
                    "Failed to rename node due to an unexpected error",
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
                    if (result.error) {
                        return result;
                    }
                }
            }

            return await treeService.deleteNode(treeName, node.id);
        } catch (error: any) {
            return {
                error:
                    error.response?.data?.message ||
                    "Failed to delete node recursively due to an unexpected error",
            };
        }
    },
};
