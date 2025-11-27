import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ToggleComponent from "./ToggleSwitch";

const ShopItem = (props) => {
    const handleToggleChange = () => {
      props.toggleCheck(props.shopItem._id, !props.shopItem.isChecked);
    };

    return (
    <tr className='border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted'>
      <td className="px-2 py-1 align-middle [&:has([role=checkbox])]:pr-0">
        <ToggleComponent isToggled={props.shopItem.isChecked} onToggleChange={handleToggleChange} />
      </td>
      <td className={`px-4 py-1 align-middle [&:has([role=checkbox])]:pr-0 ${props.shopItem.isChecked ? 'line-through' : 'no-underline'}`}>
        {props.shopItem.name}
      </td>
      <td className={`px-4 py-1 align-middle [&:has([role=checkbox])]:pr-0 ${props.shopItem.isChecked ? 'line-through' : 'no-underline'}`}>
        {props.shopItem.amount}
      </td>
      <td className={`px-4 py-1 align-middle [&:has([role=checkbox])]:pr-0 ${props.shopItem.isChecked ? 'line-through' : 'no-underline'}`}>
        {props.shopItem.notes}
      </td>
      
      <td className="px-4 py-1 align-middle [&:has([role=checkbox])]:pr-0">
      <div className="flex gap-4">
        <Link
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-8 rounded-md px-3"
          to={`/edit/${props.shopItem._id}`}
        >
          Edit
        </Link>
        <button
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-8 rounded-md px-3"
          color="red"
          type="button"
          onClick={() => {
            props.deleteShopItem(props.shopItem._id);
          }}
        >
          Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default function ShopList() {
  const [shopItems, setShopItems] = useState([]);

  // This method SHOULD update the isChecked property for each item.
    const toggleCheck = async (id, isChecked) => {
        await fetch(`http://localhost:5050/shopItem/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isChecked }),
        });

        setShopItems((prevItems) =>
            prevItems.map((item) =>
                item._id === id ? { ...item, isChecked } : item
            )
        );
    };
  
  // This method fetches the list items from the database.
  useEffect(() => {
    async function getShopItems() {
      const response = await fetch(`http://localhost:5050/shopItem/`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const shopItems = await response.json();
      setShopItems(shopItems);
    }
    getShopItems();
  }, []);

  async function handleEdit(id, updatedItem) {
    const response = await fetch(`http://localhost:5050/shopItem/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedItem),
    });

    if (!response.ok) {
      const message = `An error occurred: ${response.statusText}`;
      console.error(message);
      return;
    }

    const updatedShopItem = await response.json();
    setShopItems((prevItems) =>
      prevItems.map((item) => (item._id === id ? updatedShopItem : item))
    );
  }

  // This method will delete a list item
  async function deleteShopItem(id) {
    await fetch(`http://localhost:5050/shopItem/${id}`, {
      method: "DELETE",
    });
    const newShopItems = shopItems.filter((el) => el._id !== id);
    setShopItems(newShopItems);
  }

    // This method will map out list items where: isChecked === false
    function newList() {
      return shopItems.map((shopItem) => {
        if (!shopItem.isChecked) {
          return (
            <ShopItem
              shopItem={shopItem}
              toggleCheck={toggleCheck}
              handleEdit={handleEdit}
              deleteShopItem={deleteShopItem}
              key={shopItem._id}
            />
          );
        }
      });
    }

    // THIS method will map out list items where: isChecked === true
    function oldList() {
      return shopItems.map((shopItem) => {
        if (shopItem.isChecked) {
          return (
            <ShopItem
              shopItem={shopItem}
              toggleCheck={toggleCheck}
              handleEdit={handleEdit}
              deleteShopItem={deleteShopItem}
              key={shopItem._id}
            />
          );
        }
      });
    }

  // This section will display the table with both list's items from the shopping list.
  return (
    <>
      <div className="border rounded-lg overflow-hidden pt-8">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b rounded transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Got it?
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Name
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Amount
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Notes
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {newList()}
              <tr className="border-b rounded transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <td colSpan="5"></td>
              </tr>
              {oldList()}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}