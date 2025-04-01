export interface TreeNode {
    id: number;
    name: string;
    children: TreeNode[];
}

export interface TreeOperationResponse {
    error: string | null;
}
