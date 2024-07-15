export enum EventMessages {
  loadState = "update-harmonograph",
  loadHarmonograph = "load-harmonograph",
}

export enum ClientStorageMessages {
  userSettings = "userSettings",
  lastHarmonograph = "last-harmonograph",
  savedHarmonographs = "saved-harmonographs",
  selectedHarmonograph = "this-harmonograh",
}

export enum PluginMessages {
  FTUEVisited = "ftue-visited",
  updateAdvancedMode = "advanced-mode-updated",
  insertHarmonograph = "insert-harmonograh",
  saveHarmonograph = "save-harmonograph",
  resizeWindow = "resize-window",
  loadHarmonograph = "load-harmonograph-from-selection",
  resetSettings = "plugin-reset",
  errorMessage = "plugin-error",
}

export type ToastMessage = {
  isError: boolean;
  message: string;
};

export const ToastMessages = {
  loadingFailure: {
    isError: true,
    message:
      "Select a previously generated harmonograph on the canvas and try again",
  },
  loadingMultiSelect: {
    isError: false,
    message: "Multiple harmonographs detected, averaging their values..",
  },
  loadingMultiSelectFail: {
    isError: true,
    message:
      "Many nodes selected, none of which were a harmonograph previously made with this plugin..",
  },
  loadingSingleSuccess: {
    isError: false,
    message: "Harmonograph successfully loaded!",
  },
};
