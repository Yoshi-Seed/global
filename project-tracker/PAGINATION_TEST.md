# Pagination and Load More - Test Plan

## Access the Application
**Test URL**: https://8080-i8nlr5ajngvzs24prrm1y-82b888ba.sandbox.novita.ai/projects.html

## Features Implemented

### 1. Smart Pagination Logic
- **No search mode**: Paginate at 100 items/page
- **Search mode (≤500 results)**: Display all results (no pagination)
- **Search mode (>500 results)**: "さらに表示" button (load 100 more at a time)

### 2. URL State Management
Query parameters preserved:
- `?q=keyword` - Search query
- `?page=2` - Page number (only in no-search mode)
- `?view=table` - View mode (card/table)
- `?target=医師` - Target type filter
- `?specialty=循環器内科` - Specialty filter
- `?sort=recruits-desc` - Sort order

### 3. Search Term Highlighting
- Keywords wrapped in `<mark class="bg-yellow-200 font-semibold">`
- Applies to: 疾患名, 疾患略語, 専門科, クライアント, PJ番号
- Case-insensitive matching
- Multiple keyword support (AND search)

### 4. Smooth Scrolling
- Page navigation: Scroll to top
- Load more: Scroll to first newly displayed item

## Test Scenarios

### Test Case 1: Initial Load (No Search)
**Steps:**
1. Navigate to `/projects.html`
2. Observe the display

**Expected Results:**
- ✅ Shows first 100 items
- ✅ Pagination controls visible at bottom
- ✅ Page numbers displayed (1, 2, 3...)
- ✅ "前へ" button disabled on page 1
- ✅ URL: `/projects.html` (no params)

### Test Case 2: Page Navigation (No Search)
**Steps:**
1. Click page 2 button
2. Click "次へ" button
3. Click page 1 button
4. Click "前へ" button (should do nothing on page 1)

**Expected Results:**
- ✅ URL updates to `?page=2`, `?page=3`, etc.
- ✅ Different items displayed
- ✅ Smooth scroll to top after each navigation
- ✅ Active page highlighted in blue
- ✅ Browser back/forward works correctly

### Test Case 3: Search with Few Results (≤500)
**Steps:**
1. Enter search term that returns <500 results (e.g., "COPD")
2. Press Enter or wait for instant search

**Expected Results:**
- ✅ All matching results displayed at once
- ✅ No pagination controls visible
- ✅ URL updates to `?q=COPD`
- ✅ Search term highlighted in yellow
- ✅ Result count updated correctly

### Test Case 4: Search with Many Results (>500)
**Steps:**
1. Enter broad search term that returns >500 results (e.g., "医師")
2. Observe initial display
3. Click "さらに表示" button multiple times

**Expected Results:**
- ✅ Initial display shows first 100 items
- ✅ "さらに表示" button visible with remaining count
- ✅ Status text: "現在 100 / [total] 件表示中"
- ✅ Each click loads 100 more items
- ✅ Remaining count decreases by 100
- ✅ Smooth scroll to newly loaded items
- ✅ Button disappears when all items loaded
- ✅ URL shows `?q=医師`

### Test Case 5: Search Term Highlighting
**Steps:**
1. Search for "循環器" (cardiovascular)
2. Verify highlighting in card view
3. Switch to table view
4. Verify highlighting in table view

**Expected Results:**
- ✅ "循環器" highlighted in yellow in 疾患名
- ✅ "循環器" highlighted in yellow in 専門科
- ✅ Highlighting preserved across view switches
- ✅ Multiple keywords highlighted separately

### Test Case 6: URL State Restoration
**Steps:**
1. Apply filters: target type, specialty, search, page
2. Copy URL from address bar
3. Open URL in new tab or refresh page

**Expected Results:**
- ✅ All filters restored correctly
- ✅ Same page displayed
- ✅ Search query appears in search box
- ✅ Correct view mode (card/table) restored
- ✅ Pagination state restored

### Test Case 7: Filter Change Resets Pagination
**Steps:**
1. Navigate to page 3 in no-search mode
2. Change target type filter
3. Enter search query
4. Clear search query

**Expected Results:**
- ✅ Pagination resets to page 1 after filter change
- ✅ Pagination resets to page 1 after search
- ✅ shownCount resets to 100
- ✅ URL updates correctly

### Test Case 8: Multi-keyword Search Highlighting
**Steps:**
1. Search for "循環器 医師" (two keywords with space)
2. Observe results

**Expected Results:**
- ✅ Both "循環器" and "医師" highlighted separately
- ✅ Only projects containing BOTH keywords shown (AND search)
- ✅ Highlighting works in both card and table view

### Test Case 9: View Switch Preserves State
**Steps:**
1. Search for keyword
2. Navigate to page 2 (if pagination active)
3. Switch between card and table view

**Expected Results:**
- ✅ Search results preserved
- ✅ Page number preserved
- ✅ Highlighting preserved
- ✅ URL updates with `?view=table` or `?view=card`

### Test Case 10: Browser Back/Forward Navigation
**Steps:**
1. Navigate through pages: 1 → 2 → 3
2. Search for keyword
3. Click browser back button multiple times
4. Click browser forward button

**Expected Results:**
- ✅ Each back click restores previous state
- ✅ Filters, page, and search restored correctly
- ✅ Forward navigation works correctly
- ✅ URL and display stay in sync

## Performance Checks

### Memory and Rendering
- ✅ All projects loaded once at initialization
- ✅ Filtering happens in memory (fast)
- ✅ Only displayed items rendered to DOM
- ✅ No lag when typing in search box
- ✅ Smooth animations on page/view changes

### Edge Cases
- ✅ Empty search results handled gracefully
- ✅ Special characters in search query escaped properly
- ✅ Very long search queries don't break layout
- ✅ Pagination handles exact multiples of 100 correctly
- ✅ Last page shows correct number of items

## Known Limitations

1. **Search Highlighting**: Mark tags may break truncation in some edge cases
2. **URL Length**: Very long specialty names might cause long URLs
3. **Browser History**: Rapid filter changes create many history entries

## Future Enhancements (Not Implemented)

- [ ] Virtual scrolling for very large datasets
- [ ] Export filtered results to CSV
- [ ] Save search queries as bookmarks
- [ ] Advanced filter combinations in URL
- [ ] Infinite scroll option instead of "load more"
- [ ] Keyboard shortcuts for pagination

## Testing Checklist

- [ ] Test Case 1: Initial Load
- [ ] Test Case 2: Page Navigation
- [ ] Test Case 3: Search with Few Results
- [ ] Test Case 4: Search with Many Results
- [ ] Test Case 5: Search Term Highlighting
- [ ] Test Case 6: URL State Restoration
- [ ] Test Case 7: Filter Reset
- [ ] Test Case 8: Multi-keyword Search
- [ ] Test Case 9: View Switch
- [ ] Test Case 10: Browser Navigation

## Bug Report Template

If you find issues, please report using this format:

```
**Bug**: [Short description]
**Steps to Reproduce**:
1. Step 1
2. Step 2
3. Step 3

**Expected**: [What should happen]
**Actual**: [What actually happened]
**URL**: [Copy URL from address bar]
**Browser**: [Chrome/Firefox/Safari/Edge + version]
**Screenshot**: [If applicable]
```

## Implementation Notes

### Code Locations
- Pagination logic: lines 879-1008 in projects.html
- URL state management: lines 1019-1118 in projects.html  
- Search highlighting: lines 1120-1145 in projects.html
- Filter reset: line 828-832 in projects.html

### Key Functions
- `renderWithPagination(sorted)` - Main pagination decision logic
- `paginate(arr, page, size)` - Array slicing for pagination
- `updateURL()` - Sync state to URL query params
- `restoreFromURL()` - Load state from URL on init
- `highlightText(text, keywords)` - Apply <mark> tags
- `goToPage(page)` - Handle page navigation
- `loadMore()` - Handle "さらに表示" button
