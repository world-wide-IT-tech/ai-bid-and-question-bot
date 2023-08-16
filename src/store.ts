export function getApiKey(): Promise<string> {
    return new Promise((res, rej) => {
        chrome.storage.sync.get('apibidbotGptApiKey', function (items) {
            res(items.apibidbotGptApiKey || '')
        });
    })
}

export function saveApiKey(value: string) {
    return new Promise((res, rej) => {
        chrome.storage.sync.set({ 'apibidbotGptApiKey': value }, function(){
            res(undefined);
          });
    })
}
