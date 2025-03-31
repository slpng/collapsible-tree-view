import { useState } from "react";

const titles = {
    add: () => "Add new node",
    rename: () => "Rename node",
    delete: () => "Are you sure?",
};

const descriptions = {
    add: (nodeName: string) => `Add a child node to "${nodeName}"`,
    rename: (nodeName: string) => `Change the name of "${nodeName}"`,
    delete: (nodeName: string, hasChildren?: boolean) =>
        `This will permanently delete ${hasChildren ? `"${nodeName}"` + " and its children" : `"${nodeName}"`}. ${hasChildren ? "All child nodes will be deleted recursively." : ""} This action cannot be undone.`,
};

const buttonTexts = {
    add: {
        normal: () => "Add node",
        submitting: () => "Adding...",
    },
    rename: {
        normal: () => "Rename",
        submitting: () => "Renaming...",
    },
    delete: {
        normal: () => "Delete",
        submitting: () => "Deleting...",
    },
};

const labels = {
    add: () => "Name",
    rename: () => "New Name",
};

export type DialogType = "add" | "rename" | "delete";

interface TreeNodeDialogProps {
    type: DialogType;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (value?: string) => Promise<void>;
    nodeName: string;
    initialValue?: string;
    hasChildren?: boolean;
}

const Dialog = ({
    type,
    isOpen,
    onClose,
    onConfirm,
    nodeName,
    initialValue = "",
    hasChildren = false,
}: TreeNodeDialogProps) => {
    const [value, setValue] = useState(initialValue);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if ((type === "add" || type === "rename") && !value.trim()) {
            return;
        }

        setIsSubmitting(true);
        try {
            if (type === "delete") {
                await onConfirm();
            } else {
                await onConfirm(value);
            }
            if (type !== "delete") setValue(initialValue);
        } finally {
            setIsSubmitting(false);
            onClose();
        }
    };
    return (
        <dialog open={true}>
            <article>
                <header>
                    <button aria-label="Close" rel="prev" onClick={onClose} />
                    <h1>{titles[type]()}</h1>
                </header>
                <div>
                    {descriptions[type](
                        nodeName,
                        type === "delete" ? hasChildren : undefined,
                    )}
                </div>
                {(type === "add" || type === "rename") && (
                    <>
                        <hr />
                        <form>
                            <input
                                placeholder={labels[type]()}
                                value={value}
                                autoFocus
                                onChange={(e) => setValue(e.target.value)}
                            />
                        </form>
                    </>
                )}
                <footer>
                    <button className="secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button onClick={handleSubmit}>
                        {isSubmitting
                            ? buttonTexts[type].submitting()
                            : buttonTexts[type].normal()}
                    </button>
                </footer>
            </article>
        </dialog>
    );
};

export default Dialog;
