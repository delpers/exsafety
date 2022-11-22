// ES2017

let loadPages = (() => {
  var ref = _asyncToGenerator(function* () {
    let dataRedirect = yield getBlockedRedirect();
    loadUrlsRedirect(dataRedirect);
    let dataAllow = yield getAllowedWebSite();
    loadUrlsAllowed(dataAllow);
    let keyWordsHost = yield getBlockedHostKeyWords();
    let keyWordsSlug = yield getBlockedSlugKeyWords();
    loadKeyWordsBlocked(keyWordsHost, keyWordsSlug);
    addListenerWebRequest();
  });

  return function loadPages() {
    return ref.apply(this, arguments);
  };
})();

// blocking of unauthorized websites.
// when a site is blocked, it returns a page on the subject.

let getBlockedRedirect = (() => {
  var ref = _asyncToGenerator(function* () {
    let response = yield fetch("https://api.npoint.io/5fa8e0df3fbcb6b55740");
    let data = yield response.json();
    return data;
  });

  return function getBlockedRedirect() {
    return ref.apply(this, arguments);
  };
})();

// list of authorizations of authorized domains.
// related to keyword blocked in domain names. (related getBlockedHostKeyWords).

let getAllowedWebSite = (() => {
  var ref = _asyncToGenerator(function* () {
    let response = yield fetch("https://api.npoint.io/fb199a54e9b7c6a95050");
    let data = yield response.json();
    return data;
  });

  return function getAllowedWebSite() {
    return ref.apply(this, arguments);
  };
})();

// keyword blocked in domain names.
// when a domain keyword is blocked, it is not blocked on an authorized site.

let getBlockedHostKeyWords = (() => {
  var ref = _asyncToGenerator(function* () {
    let response = yield fetch("https://api.npoint.io/390e89080b29c06dd46a");
    let data = yield response.json();
    return data;
  });

  return function getBlockedHostKeyWords() {
    return ref.apply(this, arguments);
  };
})();

// reading of key words blocked in slugs. (related getAllowedWebSite).
// when a slug is blocked it is not blocked on an authorized site.

let getBlockedSlugKeyWords = (() => {
  var ref = _asyncToGenerator(function* () {
    let response = yield fetch("https://api.npoint.io/dee0c68555d63116ae30");
    let data = yield response.json();
    return data;
  });

  return function getBlockedSlugKeyWords() {
    return ref.apply(this, arguments);
  };
})();

function _asyncToGenerator(fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }
        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(
            function (value) {
              return step("next", value);
            },
            function (err) {
              return step("throw", err);
            }
          );
        }
      }
      return step("next");
    });
  };
}

var urlsRedirect = [];
var urlsAllowed = [];
var keyWordsHostBlock = [];
var keyWordsSlugBlock = [];
var state = true;

loadPages();

function loadKeyWordsBlocked(_data, _data2) {
  for (var item of _data) {
    keyWordsHostBlock.push(item);
  }
  for (var item of _data2) {
    keyWordsSlugBlock.push(item);
  }
}

function loadUrlsRedirect(_data) {
  for (var item of _data) {
    urlsRedirect.push(item);
  }
}

function loadUrlsAllowed(_data) {
  for (var item of _data) {
    urlsAllowed.push(item);
  }
}

function addListenerWebRequest() {
  browser.webRequest.onBeforeRequest.addListener(
    redirect,
    {
      urls: ["<all_urls>"],
      types: ["main_frame"],
    },
    ["blocking"]
  );
}

function redirect(requestDetails) {
  let redirection_url = "https://google.fr/";
  let type = requestDetails.type;
  let url = requestDetails.url;

  if (state) {
    if (!allowedWebPages(requestDetails)) {
      var haveRedirect = redirectPages(requestDetails);
      if (haveRedirect == "") {
        var haveKeywordsRedirect = getBlockKeyWords(requestDetails);
        if (haveKeywordsRedirect != "") {
          state = false;
          return {
            redirectUrl: haveKeywordsRedirect,
          };
        }
      } else {
        state = false;
        return {
          redirectUrl: haveRedirect,
        };
      }
    }
  } else {
    state = true;
  }
}

function allowedWebPages(requestDetails) {
  var currentUrl = new URL(requestDetails.url);
  for (let item of urlsAllowed) {
    if (
      currentUrl.hostname == item.allowed ||
      currentUrl.hostname.endsWith("." + item.allowed)
    ) {
      return true;
    }
  }
  return false;
}

function redirectPages(requestDetails) {
  var currentUrl = new URL(requestDetails.url);
  for (let item of urlsRedirect) {
    if (
      currentUrl.hostname == item.currently ||
      currentUrl.hostname.endsWith("." + item.currently)
    ) {
      return item.pushing;
    }
  }
  return "";
}

function getBlockKeyWords(requestDetails) {
  var url = requestDetails.url;
  var parsedUrl = new URL(url);
  var hostname = parsedUrl.hostname;

  for (let item of keyWordsHostBlock) {
    if (hostname.toLowerCase().indexOf(item.read) !== -1) {
      return item.recommended;
    }
  }
  var slug = parsedUrl.pathname;
  for (let item of keyWordsSlugBlock) {
    if (slug.toLowerCase().indexOf(item.rslug) !== -1) {
      return "https://google.fr/";
    }
  }
  return "";
}
