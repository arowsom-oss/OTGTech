# Guide: make the shop photo change with the picked material and color

You write this one. It is about 20 lines in `js/shop.js`. The steps below tell you what to build
and what to look up. There are hints so you are not stuck, but the code is yours to type.

Where you are starting from: the shop page always shows one photo (the brown leather PortaFold),
even when the customer picks Carbon fiber or Gray. The caption says "leather", so the page is honest,
but it looks wrong. The goal is that the photo follows the choice.

Concept names to look up: **lookup table** (an object used as a dictionary), **single source of truth**,
**event listener**, **fallback value**, **textContent vs innerHTML**.

---

## Step 0. Know what you already have (5 minutes, no typing)

Open `js/shop.js` and find these three pieces. Say out loud what each one does.

1. `selectedCase()` finds the product that matches the picked material AND color.
2. `updatePrice()` takes that product and writes its price on the page.
3. The `forEach` that attaches `updatePrice` to every material and color radio button, then calls `updatePrice()` once.

Your photo code is a copy of that pattern. If you can explain those three, the rest is easy.

**Check question:** why is `updatePrice()` called once right after the listeners are attached?
(Hint: what would the page show on load if it were not?)

## Step 1. Give the photo and the note an id (HTML)

In `shop.html`, the product photo is the `<img>` inside `<div class="product-image">`.
Add `id="product-photo"` to the `<img>`, and `id="photo-note"` to the `<p class="image-note">` under it.
JavaScript can only find an element easily if it has an id.

## Step 2. Decide which photos exist (a team question, not a code question)

You can only show a photo that exists. Right now:

| Pick | Photo file | Exists? |
|---|---|---|
| Leather, Brown | `images/portafold-hero.jpg` | yes |
| Carbon fiber, Black | `images/portafold-carbon-black.jpg` | once the carbon render is added |
| Carbon fiber, Gray | `images/portafold-carbon-gray.jpg` | once the carbon render is added |
| Leather, Black | none | no |
| Leather, Gray | none | no |

Decide what the page should do for Leather Black and Leather Gray. Two honest options:
show the brown leather photo with a caption like "Shown in Brown. Black is the same case in black leather",
or render those two colors too. Do not show a photo of a different product from the one picked
without saying so. A judge will notice, and it is a product claim.

## Step 3. Build the lookup table

Write an object that maps a SKU to a photo and a caption. Use the SKU as the key, because
`selectedCase()` already gives you a product with a `sku`, and SKUs are what the rest of the site uses.
Put it near the top of the PortaFold form section, above `updatePrice()`.

Shape (fill in the real files and captions):

```js
const PHOTOS = {
  "PF-LTH-BRN": { file: "...", alt: "...", note: "..." },
  "PF-CF-BLK":  { file: "...", alt: "...", note: "..." }
  // and so on
};
```

Why a table and not a long `if / else if` chain? Adding a photo later is one new line, not a new branch,
and you can see every photo in one place.

Where should it live, `shop.js` or `products.js`? Argue each side in one sentence, then pick.
(Hint: `products.js` is the one data file the brief says every page reads from.)

## Step 4. Write `updatePhoto()`

It does the same job as `updatePrice()`, for the picture. In plain English:

1. Get the selected product with `selectedCase()`.
2. Look up `PHOTOS[product.sku]`. If there is no product, or no entry, use your fallback entry
   (the brown leather one) so the page never shows a broken image.
3. Set the image's `src` and `alt` from the entry.
4. Set the note's `textContent` from the entry.

Rules for this step:

- Use `.src`, `.alt` and `.textContent`. Do **not** use `innerHTML`. Nothing here comes from a customer,
  so it would work, but this site's rule is `textContent` for anything written to the page, and you should be
  able to say why in an interview. (Hint: what could `innerHTML` do if the text ever came from a customer?)
- Keep the `alt` text accurate. Screen readers read it, and the carbon photo must not say "leather".

## Step 5. Hook it up

Find the `forEach` that attaches `updatePrice`. Add `updatePhoto` to the same listener, or add a second
`addEventListener("change", updatePhoto)` line. Then call `updatePhoto()` once after it, like `updatePrice()`.

Think about the Brown / Carbon fiber rule at the top of the file (the part you wrote): when Carbon fiber is
picked while Brown is checked, your code switches the color to Black. Does `updatePhoto()` see the new color?
The order of events matters here. Test it, don't assume.

## Step 6. Test it (write down what you see)

Open `shop.html` from the file system and click through every combination:

- [ ] Leather + Brown shows the brown photo and its caption
- [ ] Leather + Black shows your Step 2 choice and a truthful caption
- [ ] Carbon fiber + Black shows the carbon photo
- [ ] Carbon fiber + Gray shows the gray carbon photo
- [ ] Start on Leather + Brown, then click Carbon fiber: Brown greys out, the color jumps to Black, and the photo follows
- [ ] Refresh the page: the first photo matches what is checked
- [ ] Phone width (browser dev tools, 375 px): the photo is not cut off and the page does not scroll sideways
- [ ] Console (F12): no red errors

Add to Cart and the price still have to work. You touched the same listeners, so check them too.

## Step 7. Commit it as yours

Commit on its own with a message that says what and why, for example:
`Switch the shop photo with the picked material and color`. Your name is on it, so it is your work.
If you got stuck and asked for help on a step, say which one in the commit body. That is honest, and it
matches the VE AI policy.

## Interview questions you should be able to answer

1. Why a lookup table instead of if / else if?
2. What happens if someone picks a combination that has no entry in `PHOTOS`? Show me where your code handles it.
3. Why `textContent` and not `innerHTML`?
4. Why is the SKU the key and not a string like "Leather-Black"?

When you have a working version, send it to me and I will review it the way a senior developer reviews a
pull request. I will not rewrite it.
