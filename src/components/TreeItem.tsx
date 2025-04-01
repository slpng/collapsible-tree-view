import Dialog, { DialogType } from "@/components/Dialog";
import { TreeNode } from "@/types/tree";
import { useCallback, useState } from "react";
import {
    FaCaretDown,
    FaCaretRight,
    FaEdit,
    FaPlus,
    FaTrash,
} from "react-icons/fa";
import styles from "@/components/flex.module.scss";

interface TreeItemProps {
    treeName: string;
    node: TreeNode;
    onAddChild: (parentId: number, nodeName: string) => Promise<void>;
    onDelete: (treeName: string, nodeId: number) => Promise<void>;
    onRename: (
        treeName: string,
        nodeId: number,
        newName: string,
    ) => Promise<void>;
    isRoot?: boolean;
}

const TreeItem = ({
    node,
    onAddChild,
    onRename,
    onDelete,
    treeName,
    isRoot = false,
}: TreeItemProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [dialogType, setDialogType] = useState<DialogType | null>(null);

    const handleAddChild = useCallback(
        async (nodeName?: string) => {
            if (!nodeName) return;
            await onAddChild(node.id, nodeName);
            setIsExpanded(true);
        },
        [node.id, onAddChild],
    );

    const handleRename = useCallback(
        async (newName?: string) => {
            if (!newName) return;
            await onRename(treeName, node.id, newName);
        },
        [treeName, node.id, onRename],
    );

    const handleDelete = useCallback(async () => {
        await onDelete(treeName, node.id);
    }, [treeName, node.id, onDelete]);

    const getDialogHandler = useCallback(() => {
        switch (dialogType) {
            case "add":
                return handleAddChild;
            case "rename":
                return handleRename;
            case "delete":
                return handleDelete;
            default:
                return async () => {};
        }
    }, [dialogType, handleAddChild, handleRename, handleDelete]);

    return (
        <li>
            <div>
                <div className={styles.flexContainer}>
                    <button
                        className={`outline contrast no-border ${styles.flexContainer}`}
                        onClick={() => setIsExpanded(!isExpanded)}
                        aria-label={isExpanded ? "Collapse" : "Expand"}
                    >
                        {isExpanded ? <FaCaretDown /> : <FaCaretRight />}
                    </button>

                    <span className={styles.expandingChild}>
                        [{node.id}] {node.name}
                    </span>

                    <div className={`${styles.flexContainer}`}>
                        <button
                            className={`outline contrast no-border ${styles.flexContainer}`}
                            onClick={() => setDialogType("add")}
                        >
                            <FaPlus />
                        </button>

                        {!isRoot && (
                            <>
                                <button
                                    className={`outline contrast no-border ${styles.flexContainer}`}
                                    onClick={() => setDialogType("rename")}
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    className={`outline contrast no-border ${styles.flexContainer} pico-color-red`}
                                    onClick={() => setDialogType("delete")}
                                >
                                    <FaTrash />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {isExpanded && node.children?.length > 0 && (
                    <ul>
                        {node.children.map((child) => (
                            <TreeItem
                                key={child.id}
                                treeName={treeName}
                                node={child}
                                onAddChild={onAddChild}
                                onRename={onRename}
                                onDelete={onDelete}
                            />
                        ))}
                    </ul>
                )}

                {dialogType && (
                    <Dialog
                        isOpen={!!dialogType}
                        type={dialogType}
                        nodeName={node.name}
                        onClose={() => setDialogType(null)}
                        onConfirm={getDialogHandler()}
                        initialValue={dialogType === "rename" ? node.name : ""}
                        hasChildren={
                            node.children?.length > 0 && dialogType === "delete"
                        }
                    ></Dialog>
                )}
            </div>
        </li>
    );
};

export default TreeItem;
