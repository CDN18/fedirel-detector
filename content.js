const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

function detectFediLinks() {
  const links = {
    relMe: null,
    creatorMeta: null
  };

  // <a rel="me"> links
  const relMeLinks = document.querySelectorAll('a[rel="me"][href^="https://"][href*="/@"]');
  if (relMeLinks.length > 0) {
    links.relMe = relMeLinks[0].href;
  }

  // fediverse:creator meta tag
  const creatorMetaTag = document.querySelector('meta[name="fediverse:creator"][content^="@"]');
  if (creatorMetaTag) {
    links.creatorMeta = creatorMetaTag.getAttribute('content');
  }

  browserAPI.runtime.sendMessage(links, (response) => {
    if (browserAPI.runtime.lastError) {
      console.error(browserAPI.runtime.lastError.message);
    }
  });
}

detectFediLinks();

const observer = new MutationObserver(detectFediLinks);
observer.observe(document.body, { childList: true, subtree: true });