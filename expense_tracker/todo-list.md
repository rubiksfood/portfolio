Comments:

1. I could streamline the input fields. I.e. merge the 'add income' & 'add expense' html & functions into a single form.

    This would reduce the screen-space taken by the app.
    Then, the transaction table could take up the left side, and the input form could take up the right side, with the summary beneath.
    This seems to me like a more pleasing design. COMPLETE.

2. Ideally, I'd add a '+' or '-' symbol before the amount in the transaction table. COMPLETE.

3. Add dark mode. COMPLETE.

4. Fix contrast of colours in dark-mode. COMPLETE.

5. I want to stop the notification pop-up from moving the position of the 'Clear All' button. COMPLETE.

6. Add local storage solutions in order to save information. COMPLETE.
PROBLEM: When returning to the web app after closing it:
1st time: all works fine.
2nd time: things from the 1st time are doubled. If new item added after 1st time close, that is not doubled.

// LoadTransactions() triggers addTransaction for each individual transaction...
// addTransaction() adds each given transaction to localStorage. 
// This doubles the transaction items in localStorage, when loading via loadTransactions().

FIXED: Created a work-around using a flag-variable to check whether the transaction is being added via clicking the button, or via loading from localStorage.

7. Create edit transaction button. COMPLETE.

8. Make the UI correctly fit any device/screensize without scroll bars. COMPLETE.

XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

9. BUG FOUND: when deleting a repeated transaction, upon reloading, each repetition is also deleted.
Solution? Add a transaction_id for identification, instead of identifying which transaction to delete by matching its details (which could be found in more than 1 transaction).

10. Make the UI prettier.

11. Perhaps, add 'monthly expense tracker' functionality, where you can save the data for each month, compare between months, and set savings goals?
  - Local storage of a transaction object should be separated between months. This allows the user to start a fresh (blank) month, yet still have access to old transactions.
  - The current month (day?) should be acknowledged and set as the default transaction entry date.
  - App may need a subtitle for the month & year. A dropdown menu of each month since app creation/use.
  - The ability to set a savings goal and to track it as expenses rise in the current month(?).
