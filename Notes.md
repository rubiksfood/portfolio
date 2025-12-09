# Shopping List App -- Development Log

This document summarises the feature development, technical decisions,
issues encountered, and solutions implemented throughout the creation of
the Shopping List App.

------------------------------------------------------------------------

# 1. Features

## ✅ Completed Features

### Feature 1 -- Checkbox to mark items as inactive

-   Added a checkbox to each item to toggle whether it is "active" or
    "inactive".
-   Inactive items are visually crossed out and moved to a secondary
    list beneath active items.

### Feature 2 -- Sublist for crossed-off items

-   Introduced an `isChecked` property for each list item.
-   The app now separates active and crossed-off items into two lists.

### Feature 3 -- Automatically reorder toggled items

-   When items are toggled, they automatically move below active items
    without manual sorting.

### Feature 4 -- User authentication & profiles

- Users must register & log-in to access their own private shopping list.

------------------------------------------------------------------------

## 📝 Planned Features

### Feature 5 -- Shared lists

- Users can establish a 'shared household' in order to share a shopping list with someone else.

------------------------------------------------------------------------

# 2. Issues & Solutions

## Issue 4 -- Editing an item stopped updating correctly

**Status:** *Solved*

### Cause

The frontend sent the entire item object---including the MongoDB `_id`
field---during a PATCH request. Attempting to modify `_id` caused
MongoDB to reject the update or ignore other fields.

### Solution

Before sending update data, omit `_id`:

``` js
const { _id, ...itemEntry } = shopItem;
```

### Lesson Learned

Immutable fields (like `_id`) must not be included in update payloads.

------------------------------------------------------------------------

## Issue 3 -- Toggled items lost their properties after a page reload

**Status:** *Solved*

### Cause

The backend update logic overwrote the entire MongoDB document with only
the `isChecked` field during toggles.

### Solution

Updated backend logic so only changed fields are merged into the
document rather than replacing it.

### Lesson Learned

PATCH routes should *merge*, not replace, unless explicitly intended.

------------------------------------------------------------------------

## Issue 2 -- Unable to toggle `isChecked` property reliably

**Status:** *Solved*

### Cause

The original component architecture made it difficult for the parent
(`ShopList`) to update a property defined within the child (`ShopItem`).

### Solution

Added unique `id` values to items and centralised state management in
`ShopList`.

### Lesson Learned

State should live in the component that owns the logic around it;
React's one-way data flow matters.

------------------------------------------------------------------------

## Issue 1 -- `isChecked` did not persist in the database

**Status:** *Solved*

### Cause

Items saved to the database did not initially have the `isChecked` field.

### Solution

Correctly initialised `isChecked` on the backend and ensured all items were stored
with this property.

### Lesson Learned

Schema completeness is essential for predictable rendering and state
transitions.

------------------------------------------------------------------------

# 3. Technical Notes

-   React re-renders when **state** or **props** change.
-   A parent re-render triggers all child re-renders unless components
    are memoised (`React.memo()`).
-   Backend update strategies: prefer merging (PATCH) to overwriting,
    unless intentional.

------------------------------------------------------------------------

# ✔️ Summary

This log documents the engineering decisions, debugging processes, and
feature development of the Shopping List App. It demonstrates:

-   Systematic problem-solving
-   Understanding of React behaviour
-   Correct handling of backend updates
-   Awareness of data integrity & security
-   Feature planning and iterative development