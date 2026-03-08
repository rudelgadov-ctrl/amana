

## Fix: Review cards text overflow

The issue is `line-clamp-4` on line 83, which truncates long reviews to 4 lines. Reviews like Jordi ST, Kevin Lee, and Carolina Chavarría Mora get cut off.

### Solution
- Remove `line-clamp-4` from the review text paragraph
- Add a fixed minimum height to the card to keep visual consistency
- Allow text to flow naturally with a scroll or simply show all text

### File to modify
**`src/components/home/ReviewsSection.tsx`** (line 83):
- Change `line-clamp-4` to `line-clamp-6` (show more text, up to 6 lines) — or remove it entirely and let the card grow to fit the content.

I recommend removing `line-clamp-4` entirely and adding `min-h-[180px]` to the CardContent so shorter reviews still look balanced, while longer ones display fully.

