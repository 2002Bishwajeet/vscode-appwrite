import * as vscode from "vscode";
import { client } from "../../client";
import AppwriteCall from "../../utils/AppwriteCall";
import { Collection, CollectionsList, DocumentsList } from "../../appwrite";
import { CollectionTreeItem } from "./CollectionTreeItem";
import { AppwriteSDK } from "../../constants";
import { AppwriteTreeItemBase } from "../../ui/AppwriteTreeItemBase";
import { ext } from '../../extensionVariables';

export class DatabaseTreeItemProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined | void> = new vscode.EventEmitter<
        CollectionTreeItem | undefined | void
    >();

    readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined | void> = this._onDidChangeTreeData.event;

    constructor() {}

    refresh(): void {
        ext.outputChannel?.appendLine('refresh database');
        this._onDidChangeTreeData.fire();
    }

    refreshChild(child: vscode.TreeItem): void {
        this._onDidChangeTreeData.fire(child);
    }

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

    async getChildren(parent?: vscode.TreeItem): Promise<vscode.TreeItem[]> {
        ext.outputChannel?.appendLine('getChildren for: ' + parent?.label);
        if (client === undefined) {
            return Promise.resolve([]);
        }

        if (parent instanceof AppwriteTreeItemBase) {
            return parent.getChildren?.() ?? [];
        }

        let databaseSdk = new AppwriteSDK.Database(client);

        const collectionsList = await AppwriteCall<CollectionsList, CollectionsList>(databaseSdk.listCollections());
        if (collectionsList) {
            const userTreeItems = collectionsList.collections.map((collection: Collection) => new CollectionTreeItem(collection, this)) ?? [];
            const headerItem: vscode.TreeItem = {
                label: `Total collections: ${collectionsList.sum}`,
            };
            return [headerItem, ...userTreeItems];
        }

        return [{ label: "No collections found" }];
    }
}
