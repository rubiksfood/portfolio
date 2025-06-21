# Project title:
Shopping List App

# Description:
This web app is designed to be used as a shopping list for grocery shopping.

# Technologies used:
MERN stack, i.e. MongoDB, Express.js, React, and Node.js.

# Features:
Full CRUD operations, i.e. the user can add items to the list, view them, edit them, and delete them.

In addition, the user can also cross items off, i.e. when adding them to their shopping trolley in a shop, to keep track of what they still want to buy.
These items can then be 'uncrossed' at a later date, if the user buys that item regularly and wishes to store its details in the app for later use.

# Installation Instructions:
1. Clone the repository.
2. Ensure you have downloaded the dependencies, i.e. Node.js, TailwindCSS.
3. Ensure you have a MongoDB account.
4. Create a local version of a file named 'config.env' and add
ATLAS_URI="YOUR_MONGODB_URI_HERE"
PORT=5050
5. Navigate to the 'server' folder, then run in a BASH terminal:
> node --env-file=config.env server
6. Navigate to the 'client' folder, then run in a BASH terminal:
> npm run build
> npm run dev
7. Click on the link to your localhost in order to open the app.

# Usage:
- Add items to the list using the 'Add New Item' button.
- Add the details of an item using the input boxes: 'Name', 'Amount', & 'Notes'.
- Click 'Save Item' and the item will be added to the main list.
- Items can be edited by clicking the edit button.
- Items can be deleted (permenantly removed) by clicking the delete button.
- Items can also be visually crossed off the list (as well as removed from the 
main list and added to a second sub list) by clicking the circle icon underneath 
'Got it?' for that item.
- Items can then be 'uncrossed' & re-added to the main list by clicking the circle 
icon for that item (again).