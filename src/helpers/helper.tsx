import type { ReferenceItem } from "../pages/History/History";

function injectParams(baseUrl: URL, params: Object) {
  const newUrl = new URL(baseUrl.toString());
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      newUrl.searchParams.append(key, String(value));
    }
  });
  return newUrl;
}

function updateHistory(referenceItem: ReferenceItem) {
  const referenceItems = localStorage.getItem("history");
  let parsedReferenceItems: Array<ReferenceItem> = JSON.parse(
    referenceItems as string
  );
  if (!parsedReferenceItems) parsedReferenceItems = [];
  if (
    !parsedReferenceItems.some(
      (currentReferenceItem: ReferenceItem) =>
        currentReferenceItem.mbid === referenceItem.mbid
    )
  ) {
    parsedReferenceItems.push(referenceItem);
    localStorage.setItem("history", JSON.stringify(parsedReferenceItems));
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
