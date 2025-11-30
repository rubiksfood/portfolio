## Features

# Feature 4: 
Create user profiles for the app.

THINGS TO CONSIDER:
- User authentication (npm install bcryptjs jsonwebtoken)
- Create User registration route (in 'routes' directory, i.e. auth.js)
- Add a log-in route to the same file.
- Create a middleware to protect the routes.
- Set up routes in app.js, 
e.g.  <AuthProvider> 
        <Switch>   
          <Route path="/login" component={Login} />     
          <Route path="/register" component={Register} />
          <Route path="/shopping-list" component={ShoppingList} />

- Create components for 'ProtectedRoute', 'Login' & 'Register'.
- Register & log-in/out UI.
- Update client to keep track of user related information re: shopping lists.

# Feature 3: DONE
When the item is toggled, it should appear underneath all the 'active' 
items. (This may mean changing how the ShopList component renders the page). XXX

# Feature 2: DONE
Create a sublist (of crossed-off items). Perhaps add an attribute to each item, 
that shows whether item is toggled or not? XXX

# Feature 1: DONE
A check box would allow the user to check off each item in the list.
This item would then be crossed out. It would ALSO be put to the top of an 'inactive list' 
i.e. items found below the 'active list'. XXX

## Issues

# PROBLEM 5: SOLVED
When an item is edited using the edit button, its properties no longer change.

LITERAL PROBLEM:
The edit button is not transmitting the new data to the shopItem object / OR /
The new data for the shopItem object is not being accessed when updating the display.
i.e.
Problem with the PATCH request in the backend / OR /
Problem with how the frontend updates the state after editing.

Todo: Install Postman to help with debugging the PATCH route.

# SOLUTION 5: 
Inadvertently tried to modify the '_id' field in MONGODB, by sending the entire 
object in the PATCH request.
Fixed by removing the '_id' field from the updated data before patching.

i.e In ShopItem.jsx:
// Created a copy of shopItem without the '_id' field
const { _id, ...itemEntry } = shopItem;

# PROBLEM 4: SOLVED
When an item is toggled (BACK / & FORTH), and the page reloads, the item loses its other properties.

# SOLUTION 4:
The backend 'shopItem.js' was overwriting the entire document in the MongoDB database with only 
the 'isChecked' field. As a result, this was deleting the other properties after reloading the page.
The backend now only merges changes to the document, rather than automatically replacing every field.

# PROBLEM 3: SOLVED
'isChecked' property cannot be changed using current logic.

Theory:
The code infrastructure has not been developed with this feature in mind.
It may well be that the app needs restructuring in order to accomodate it.

Problem feature: Being able to cross off each item on the Shopping List.

The properties of each ShopItem are defined within the component. However, the isChecked property is 
something that should only be accessible from the ShopList component. As a result, I am trying to add 
a property within the ShopItem component, and then later toggle the boolean value of that component 
from ShopList. 
Saving that value from outside the component within the state of the component is where I am struggling.

# SOLUTION 3:
Add an 'id' property to each item in the ShopItem component.
Then manipulate each item via its 'id' in the ShopList component.

# PROBLEM 2: SOLVED
isChecked property does not persist.

(In ShopList.jsx)
When rendering the 2 lists, newList() renders every item, as isChecked is always false.
I.e. when toggling the isChecked property, this does not have the desired effect 
(of rendering within a 2nd list, after the 1st).

HINT:
Looking at the database, the isChecked property does not exist for the items.
After manually adding the property, the 'crossed' out 2nd list behaves as expected.

# PARTIAL FIX 2:
Successfully added the property (via editing the server.js file).
Now, each property is correctly initialised when the app starts.

# PROBLEM 1: SOLVED
Displaying items from 1 list in 2 different tables.

Render 1 list, followed by another.
First list must contain elements where a new property can be toggled, i.e. 'isChecked' = false/true;
Second list must have the opposite condition.

App Rendering Logic: 
(In ShopList.jsx)
- ShopList(): returns Table headings + calls 'list()'.
- list(): returns an array containing each shopItem. 
This array is then presented in a table, by referencing the 'ShopItem' jsx element.
- <ShopItem>: returns 1 row, i.e. the current ShopItem referenced.

# SOLUTION 1:
In order to create 2 lists, each product must also have an 'isChecked' property.
Then, ShopList() returns 2 tables, by calling newList() AND oldList().
newList() returns only items where isChecked === false;
oldList() returns only items where isChecked === true;


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

# Todo:
- Read up on Tailwind CSS documentation & UI features. XXX
- Learn about publishing restrictions / what license should be used?
- Research & choose how to go about publishing an app.
- Publish app.

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    
### IMPORTANT NOTE (BEFORE publishing):
Remember to use security best practices in final form of app.
(e.g. sanitising inputs, etc.)

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

# Notes on re-render behaviour of React components:
(For potential optimisation...)

React components re-render when: its state changes, OR its props change.
If a parent re-renders, then its children will re-render too.
(Unless memoized with React.memo() ...)