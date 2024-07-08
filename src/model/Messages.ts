export enum EventMessages {
  loadState = "update-harmonograph",
}

export enum ClientStorageMessages {
  userSettings = "userSettings",
  lastHarmonograph = "last-harmonograph",
  savedHarmonographs = "saved-harmonographs",
}

export enum PluginMessages {
  FTUEVisited = "ftue-visited",
  updateAdvancedMode = "advanced-mode-updated",
  insertHarmonograph = "insert-harmonograh",
  saveHarmonograph = "save-harmonograph",
  resizeWindow = "resize-window",
  resetSettings = "plugin-reset",
  errorMessage = "plugin-error",
}
