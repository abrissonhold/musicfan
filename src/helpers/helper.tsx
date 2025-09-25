import type { HistoryItem } from "../pages/History/History";

function injectParams(baseUrl: URL, params: Object) {
  const newUrl = new URL(baseUrl.toString());
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      newUrl.searchParams.append(key, String(value));
    }
  });
  return newUrl;
}

function updateHistory(historyItem: HistoryItem) {
  const referenceItems = localStorage.getItem("history");
  let parsedHistoryItem: Array<HistoryItem> = JSON.parse(
    referenceItems as string
  );
  if (!parsedHistoryItem) parsedHistoryItem = [];
  if (!parsedHistoryItem.some((currentHistoryItem: HistoryItem) => currentHistoryItem.mbid === historyItem.mbid)) {
    if(parsedHistoryItem.length >= 9){
      parsedHistoryItem.splice(9);
    }
    parsedHistoryItem.unshift(historyItem);
    localStorage.setItem("history", JSON.stringify(parsedHistoryItem));
  }
}

function getFavorites(): string[] {
  const playlist = localStorage.getItem("favorites");
  return playlist ? JSON.parse(playlist) : [];
}

function addToFavorites(mbid: string): boolean {
  const favorites = getFavorites();
  const index = favorites.findIndex((id: string) => id === mbid);

  if (index !== -1) {
    favorites.splice(index, 1);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    window.dispatchEvent(new CustomEvent('favoritesUpdated', { detail: favorites }));
    return false;
  } else {
    favorites.push(mbid);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    window.dispatchEvent(new CustomEvent('favoritesUpdated', { detail: favorites }));
    return true;
  }
}

function isFavorite(mbid: string): boolean {
  const favorites = getFavorites();
  return favorites.includes(mbid);
}

function clearFavorites(): void {
  localStorage.removeItem("favorites");
  window.dispatchEvent(new CustomEvent('favoritesUpdated', { detail: [] }));
}

export {
  injectParams,
  updateHistory,
  getFavorites,
  addToFavorites,
  isFavorite,
  clearFavorites
}
