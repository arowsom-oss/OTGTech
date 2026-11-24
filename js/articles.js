// articles.js
// Draws the Articles page (articles.html) and a single article (article.html).
// The articles themselves are in articles-data.js. This file only checks them and draws them.
//
// Everything is added with textContent, never as HTML, so nothing typed into an article
// can turn into code. Articles with a mistake are skipped, so one bad entry can't break the page.

const ARTICLE_ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const ARTICLE_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const ARTICLE_IMAGE_PATTERN = /^images\/[A-Za-z0-9._-]+\.(jpg|jpeg|png|webp)$/i;   // only our own images folder

// ---------- Small helpers ----------

function makeArticleEl(tag, className, text) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  if (text) {
    element.textContent = text;
  }
  return element;
}

function isText(value) {
  return typeof value === "string" && value.trim() !== "";
}

// "2026-12-01" -> "Dec 1, 2026". Uses UTC so the date can't slip a day in some time zones.
function formatArticleDate(date) {
  return new Date(date + "T00:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC"
  });
}

function isRealDate(date) {
  if (!ARTICLE_DATE_PATTERN.test(date)) {
    return false;
  }
  const parsed = new Date(date + "T00:00:00Z");
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;   // rejects 2026-02-31
}

// ---------- Checking the data ----------

// Returns the body pieces that are valid. Anything unrecognized is dropped.
function cleanBody(body) {
  if (!Array.isArray(body)) {
    return [];
  }
  const pieces = [];
  body.forEach(function (piece) {
    if (!piece || typeof piece !== "object") {
      return;
    }
    if ((piece.type === "h" || piece.type === "p") && isText(piece.text)) {
      pieces.push({ type: piece.type, text: piece.text });
    } else if (piece.type === "list" && Array.isArray(piece.items)) {
      const items = piece.items.filter(isText);
      if (items.length > 0) {
        pieces.push({ type: "list", items: items });
      }
    }
  });
  return pieces;
}

// Returns a clean copy of one article, or null if it has a problem.
function cleanArticle(article) {
  if (!article || typeof article !== "object") {
    return null;
  }
  if (typeof article.id !== "string" || !ARTICLE_ID_PATTERN.test(article.id)) {
    return null;
  }
  if (!isText(article.title) || !isText(article.summary) || !isText(article.author)) {
    return null;
  }
  if (typeof article.date !== "string" || !isRealDate(article.date)) {
    return null;
  }

  let image = null;
  if (article.image) {
    const picture = article.image;
    if (!ARTICLE_IMAGE_PATTERN.test(String(picture.src)) || !isText(picture.alt)) {
      return null;   // a picture with no description, or from somewhere else, is a mistake: skip the article
    }
    image = { src: picture.src, alt: picture.alt, credit: isText(picture.credit) ? picture.credit : "" };
  }

  return {
    id: article.id,
    title: article.title.trim(),
    summary: article.summary.trim(),
    author: article.author.trim(),
    date: article.date,
    image: image,
    body: cleanBody(article.body),
    sources: Array.isArray(article.sources) ? article.sources.filter(isText) : [],
    ai: isText(article.ai) ? article.ai.trim() : ""
  };
}

// Clean list: bad articles dropped, repeated ids dropped (the first one wins), newest first.
function cleanArticles(list) {
  if (!Array.isArray(list)) {
    return [];
  }
  const seen = {};
  const articles = [];
  list.forEach(function (raw) {
    const article = cleanArticle(raw);
    if (article && !seen[article.id]) {
      seen[article.id] = true;
      articles.push(article);
    }
  });
  return articles.sort(function (a, b) {
    return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
  });
}

// ---------- Drawing ----------

// The list page: one card for each article.
function renderArticleList(articles, listEl, emptyEl) {
  listEl.replaceChildren();
  emptyEl.hidden = articles.length > 0;

  articles.forEach(function (article) {
    const card = makeArticleEl("li", "article-card");

    if (article.image) {
      const picture = makeArticleEl("img", "article-card-image");
      picture.src = article.image.src;
      picture.alt = "";   // the title next to it already says what the card is about
      picture.loading = "lazy";
      card.appendChild(picture);
    }

    const text = makeArticleEl("div", "article-card-text");
    const heading = makeArticleEl("h2", "article-card-title");
    const link = makeArticleEl("a", "", article.title);
    link.href = "article.html?id=" + encodeURIComponent(article.id);
    heading.appendChild(link);
    text.appendChild(heading);
    text.appendChild(makeArticleEl("p", "article-meta", article.author + " · " + formatArticleDate(article.date)));
    text.appendChild(makeArticleEl("p", "", article.summary));
    card.appendChild(text);

    listEl.appendChild(card);
  });
}

// One whole article.
function renderArticle(article, containerEl) {
  containerEl.replaceChildren();

  containerEl.appendChild(makeArticleEl("h1", "", article.title));
  containerEl.appendChild(makeArticleEl("p", "article-meta", article.author + " · " + formatArticleDate(article.date)));

  if (article.image) {
    const figure = makeArticleEl("figure", "article-figure");
    const picture = makeArticleEl("img");
    picture.src = article.image.src;
    picture.alt = article.image.alt;
    figure.appendChild(picture);
    if (article.image.credit) {
      figure.appendChild(makeArticleEl("figcaption", "", "Image: " + article.image.credit));
    }
    containerEl.appendChild(figure);
  }

  const body = makeArticleEl("div", "article-body");
  article.body.forEach(function (piece) {
    if (piece.type === "h") {
      body.appendChild(makeArticleEl("h2", "", piece.text));
    } else if (piece.type === "p") {
      body.appendChild(makeArticleEl("p", "", piece.text));
    } else if (piece.type === "list") {
      const list = makeArticleEl("ul");
      piece.items.forEach(function (item) {
        list.appendChild(makeArticleEl("li", "", item));
      });
      body.appendChild(list);
    }
  });
  containerEl.appendChild(body);

  if (article.sources.length > 0) {
    const sources = makeArticleEl("section", "article-sources");
    sources.appendChild(makeArticleEl("h2", "", "Sources"));
    const list = makeArticleEl("ul");
    article.sources.forEach(function (source) {
      list.appendChild(makeArticleEl("li", "", source));
    });
    sources.appendChild(list);
    containerEl.appendChild(sources);
  }

  if (article.ai) {
    containerEl.appendChild(makeArticleEl("p", "article-ai", "AI use: " + article.ai));
  }

  const backLine = makeArticleEl("p", "article-back");
  const backLink = makeArticleEl("a", "", "← All articles");
  backLink.href = "articles.html";
  backLine.appendChild(backLink);
  containerEl.appendChild(backLine);
}

// ---------- Starting up (only on the two article pages) ----------

const articleListEl = document.getElementById("article-list");
const articleViewEl = document.getElementById("article-view");

if (articleListEl) {
  renderArticleList(cleanArticles(ARTICLES), articleListEl, document.getElementById("articles-empty"));
}

if (articleViewEl) {
  const wantedId = new URLSearchParams(window.location.search).get("id");
  const found = cleanArticles(ARTICLES).find(function (article) {
    return article.id === wantedId;
  });
  if (found) {
    document.title = found.title + " | OTGTech";
    renderArticle(found, articleViewEl);
  } else {
    articleViewEl.replaceChildren();
    articleViewEl.appendChild(makeArticleEl("h1", "", "Article not found"));
    articleViewEl.appendChild(makeArticleEl("p", "", "We couldn't find that article."));
    const back = makeArticleEl("a", "button", "See all articles");
    back.href = "articles.html";
    articleViewEl.appendChild(back);
  }
}
