const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

let detectedLinks = {};

browserAPI.runtime.onMessage.addListener((links, sender, sendResponse) => {
  detectedLinks = links;
  updateBrowserAction(links);
});

function updateBrowserAction(links) {
  let iconPath = 'icons/icon-no-link.png';
  
  if (links.relMe || links.creatorMeta) {
    iconPath = 'icons/icon-link.png';
  }

  browserAPI.action.setIcon({ path: iconPath });
}

browserAPI.action.onClicked.addListener((tab) => {
  if (detectedLinks.relMe) {
    browserAPI.tabs.create({ url: detectedLinks.relMe });
  } else if (detectedLinks.creatorMeta) {
    const [, username, domain] = detectedLinks.creatorMeta.match(/@([^@]+)@(.+)/);
    const linkToOpen = `https://${domain}/@${username}`;
    browserAPI.tabs.create({ url: linkToOpen });
  }
});