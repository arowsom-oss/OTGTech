// luhn.js
// The Luhn check: a quick test that a card number has no typo.
//
// It does NOT prove a card is real or has money on it. It only catches mistakes,
// like one wrong digit or two digits swapped. Real card numbers are built so they pass.
//
// How it works, using the test number 4242 4242 4242 4242:
//   1. Start at the LAST digit and move left.
//   2. Double every second digit (the 2nd from the right, then the 4th, and so on).
//   3. If a doubled digit is over 9, subtract 9. (That's the same as adding its two digits.)
//   4. Add up all the digits. If the total ends in 0 (it divides evenly by 10), it passes.
//
// digits must be a string of only 0-9, like "4242424242424242". Returns true or false.
function passesLuhn(digits) {
  if (!/^\d+$/.test(digits)) {
    return false;
  }

  let total = 0;
  let doubleIt = false;   // the last digit is not doubled, so we start with false

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number(digits[i]);
    if (doubleIt) {
      digit = digit * 2;
      if (digit > 9) {
        digit = digit - 9;
      }
    }
    total = total + digit;
    doubleIt = !doubleIt;   // flip: double, don't double, double, ...
  }

  return total % 10 === 0;
}
