import TreeView from "@/components/TreeView";
import React from "react";

const App: React.FC = () => {
    return (
        <main className="container">
            <h1>Collapsible Tree View</h1>
            <ul>
                <TreeView treeName="03F4615D-529D-4A6E-93F3-AB9152AB9EF5" />
            </ul>
        </main>
    );
};

export default App;
