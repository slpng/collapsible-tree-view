export interface TreeNode {
    id: number;
    name: string;
    children: TreeNode[];
}

export interface TreeOperationResponse {
    success: boolean;
    error?: string;
}
