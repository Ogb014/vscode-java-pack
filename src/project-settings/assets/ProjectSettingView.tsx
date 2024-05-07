// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import React, { Dispatch, useState } from "react";
import { useDispatch } from "react-redux";
import ClasspathConfigurationView from "./classpath/features/ClasspathConfigurationView";
import { updateActiveTab } from "./classpath/features/classpathConfigurationViewSlice";
import "./style.scss";

const ProjectSettingView = (): JSX.Element => {
  const [section, setSection] = useState("classpath");
  const dispatch: Dispatch<any> = useDispatch();

  React.useEffect(() => {
    window.addEventListener("message", onWillChangeRoute);
    return () => {
      window.removeEventListener("message", onWillChangeRoute);
    };
  }, []);

  const getSectionContent = () => {
    if (section === "classpath") {
      return <ClasspathConfigurationView />;
    }

    return null;
  }

  const onWillChangeRoute = (e: any) => {
    const { data } = e;
    if (data.command === "main.onWillChangeRoute") {
      const routes = data.route.split("/");
      setSection(routes[0]);
      if (routes.length > 1) {
        switch (routes[0]) {
          case "classpath":
            dispatch(updateActiveTab(routes[1]));
            break;
          default:
            break;
        }
      }
    }
  }

  const onClickNavBarItem = (panelId: string) => {
    setSection(panelId);
  };

  return (
    <div className="app-container">
        <div className="app-sidebar">
          <div className="app-sidebar-content">
            <div className="mt-2">
              <div className={`section-link ${section === "classpath" ? "section-link-active" : ""}`} onClick={() => onClickNavBarItem("classpath")}>
                Classpath
              </div>
            </div>
          </div>
          <div className="app-sidebar-resizer" />
        </div>
        <div className="app-frame">
          {getSectionContent()}
        </div>
      </div>
  );
};

export default ProjectSettingView;
