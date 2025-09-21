import type { ReferenceItem } from "../pages/History/History";

function injectParams(baseUrl: URL, params: Object){
  const newUrl = new URL(baseUrl.toString());
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      newUrl.searchParams.append(key, String(value));
    }
  });
  return newUrl;
}
function updateHistory(referenceItem: ReferenceItem){
  const referenceItems = localStorage.getItem('history');
  let parsedReferenceItems: Array<ReferenceItem> = JSON.parse(referenceItems as string);
  if(!parsedReferenceItems) parsedReferenceItems = [];
  if(!parsedReferenceItems.some((currentReferenceItem: ReferenceItem) => currentReferenceItem.mbid === referenceItem.mbid)){
    parsedReferenceItems.push(referenceItem);
    localStorage.setItem('history', JSON.stringify(parsedReferenceItems));
  }
}
export {
    injectParams,
    updateHistory,
}