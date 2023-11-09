// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import * as React from 'react';
import { VSCodePanels, VSCodePanelTab, VSCodePanelView } from "@vscode/webview-ui-toolkit/react";

class ProjectManagementView extends React.Component {
  public render() {
    return (
      <VSCodePanels>
        <VSCodePanelTab id="classpath-tab">Classpath</VSCodePanelTab>
        <VSCodePanelTab id="jdks-tab">JDKs</VSCodePanelTab>
        <VSCodePanelView id="classpath-view">
          classpath
        </VSCodePanelView>
        <VSCodePanelView id="jdks-view">
          jdks
        </VSCodePanelView>
      </VSCodePanels>
    );
  }
}

export default ProjectManagementView;
