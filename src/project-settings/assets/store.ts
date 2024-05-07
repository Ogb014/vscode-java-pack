// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import { configureStore } from "@reduxjs/toolkit";
import classpathConfigurationViewReducer from "./classpath/features/classpathConfigurationViewSlice";

export default configureStore({
  reducer: {
    classpathConfig: classpathConfigurationViewReducer
  },
});
