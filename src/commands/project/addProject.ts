import { window } from "vscode";
import { createAppwriteClient } from '../../client';
import { addProjectWizard } from "../../ui/AddProjectWizard";

export async function addProject() {
    const projectConfiguration = await addProjectWizard();

    if (projectConfiguration) {
        createAppwriteClient(projectConfiguration);
    }

    window.showInformationMessage("Connected to Appwrite project.");
}
