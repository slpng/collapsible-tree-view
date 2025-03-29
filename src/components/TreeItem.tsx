import { TreeItemProps } from "@/components/TreeView";
import { useState } from "react";

const TreeItem = ({
    node,
    onAddChild,
    onRename,
    onDelete,
    treeName,
}: TreeItemProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <li>
            <div>
                {node.children?.length > 0 && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        aria-label={isExpanded ? "Collapse" : "Expand"}
                    >
                        {isExpanded ? "v" : ">"}
                    </button>
                )}

                <span>{node.name}</span>

                <div>
                    <button
                        onClick={() =>
                            onAddChild(node.id, node.name + "_child")
                        }
                    >
                        add
                    </button>
                    <button
                        onClick={() =>
                            onRename(
                                treeName,
                                node.id,
                                node.name + `_renamedAt_${Date.now()}`,
                            )
                        }
                    >
                        rename
                    </button>
                    <button onClick={() => onDelete(treeName, node.id)}>
                        delete
                    </button>
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
        </li>
    );
};

export default TreeItem;
