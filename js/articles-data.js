// articles-data.js
// All the articles live here, in one list. This is the only file you edit to add an article.
// (Same idea as products.js: the pages read from this file and never hold article text themselves.)
//
// HOW TO ADD AN ARTICLE
//   1. Copy the example below, take away the two slashes at the start of each line, and fill it in.
//   2. If it has a picture, put the picture in the images/ folder and use its name in "src".
//   3. Put a comma between articles. Keep the list inside the [ ] brackets.
//
// WHAT EACH PART MEANS
//   id       short name for the web address, only lowercase letters, numbers and dashes.
//            Example: "why-we-built-the-portafold"  ->  article.html?id=why-we-built-the-portafold
//   title    the headline
//   summary  one or two sentences shown on the list page
//   author   who wrote it, as they want to be credited (a person, a team or another firm)
//   date     "YYYY-MM-DD"
//   image    optional picture: { src: "images/name.jpg", alt: "what the picture shows", credit: "who made it" }
//            alt is required for a picture, because it is what a screen reader says. Only jpg, png or webp.
//   body     the article, as a list of pieces, in order. Each piece is one of:
//              { type: "h", text: "A heading" }
//              { type: "p", text: "A paragraph." }
//              { type: "list", items: ["one", "two"] }
//   sources  where the facts came from (VE asks for sources). Plain text, one line each.
//   ai       optional. If AI helped write or make the article, say how, in one sentence.
//            VE's AI policy asks firms to disclose it. Leave it out if no AI was used.
//
// The text is shown as plain text, never as HTML. If you type <b>bold</b> you will see those
// characters on the page, not bold. That is on purpose: it keeps the page safe.
//
// An article with a missing or wrong part (a bad id, a bad date, no title) is skipped and not shown,
// so one mistake never breaks the whole page. Check the page after you add one.
//
// EXAMPLE (take away the // marks to use it):
//
// {
//   id: "example-article",
//   title: "Example headline",
//   summary: "One or two sentences that tell a reader what this is about.",
//   author: "Example Team",
//   date: "2026-12-01",
//   image: { src: "images/portafold-hero.jpg", alt: "The PortaFold open on a desk", credit: "OTGTech" },
//   body: [
//     { type: "h", text: "A heading" },
//     { type: "p", text: "A paragraph of the article." },
//     { type: "list", items: ["First point", "Second point"] }
//   ],
//   sources: ["Where a fact came from"],
//   ai: "Claude helped edit this article. The team checked every claim."
// }

const ARTICLES = [
  // No articles yet. We are waiting on other teams.
];
