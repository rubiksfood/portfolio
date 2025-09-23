### Issues:

# PROBLEM 1: SOLVED
When returning to the web app after closing it:
1st time: works as expected.
2nd time: transactions added after returning the 1st time are doubled. 
If a new transaction is added after closing it the 1st time, that is not doubled.

After thinking through the problem, I came to realise that:
- LoadTransactions() triggers addTransaction for each individual transaction.
- addTransaction() adds each given transaction to localStorage.
This effectively doubles the transactions saved to localStorage, when loading via loadTransactions().

# SOLUTION 1: 
Created a flag-variable to check whether the transaction is being loaded from localStorage or added via the add transaction button.


### Features:

1. Streamline the input fields.
I originally included a set of inputs for 'Income', AND a set of inputs for 'Expenses'. However, I found the design to be inelegant, repetitive, and worst of all, ugly.
As a result, I combined the 2 input forms into a single form, where all the information could be entered. After removing the 2nd set of inputs, I had a lot more room on the page, so I decided to place the transaction history table alongside the single set of inputs. This freed a lot of space on the screen, helping the design to look sleeker.


2. Add a '+' or '-' symbol before the amount in the transaction table.
Originally, the table featured the description, category, and the amount for each transcation entered. 
However, after entering a few transactions, it was not immediately clear whether each transaction was a negative influence on the balance, or a positive one.
As a result, I decided that simple adding a '+' or '-' symbol before the amount would help this lack of clarity. 


3. Add dark mode.
After having worked on this app for many days, it was becoming rather irritating to look back and forth between a bright background (my app), and a dark one (my code editor).
I realised it would be great to have a dark mode, as it is functionality that I always wish for in any apps that I use myself.
Plus, it is common enough that I thought it would simply be a good thing to learn. 
After researching the various ways to achieve it and trying them out, I decided that using the CSS class approach was perhaps the most versatile and useful for my needs.


4. Create a notification pop-up.
The app was beginning to look a lot better than before, and I thought a nice UI flourish would be to add a notification pop-up stating 'Transaction Successfully Added' after clicking the 'Add Transaction' button. This was quite easily achieved by toggling a 'hidden' CSS class which held the message. 


5. Add local storage solution in order to save information.
The app looked and felt quite nice. However, I realised that it was not going to be very helpful if the information you add to it simply disappears every time the app is closed.
I researched how to create a local storage solution and implemented it.


6. Create edit transaction button.
After a lot of testing, I noticed that if there was a typo in my transaction description or amount, I would have to delete it in order to correct it.
It made sense to me, that an 'Edit Transaction' button could be a very useful piece of functionality. 
This was implemented by simply assigning the current values for the transaction to the various input fields, and then deleting the existing transaction.
As soon as the user decides on the corrected input, they can add the transaction again as normal.