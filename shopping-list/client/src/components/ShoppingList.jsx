import { useEffect, useState } from "react";
import ToggleSwitch from "./ToggleSwitch";
import ShopItemForm from "./ShopItemForm.jsx";

const ShopItemRow = (props) => {
  const { shopItem, toggleCheck, onEdit, deleteShopItem } = props;

  const handleToggleChange = () => {
    toggleCheck(shopItem._id, !shopItem.isChecked);
  };

  return (
    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
      <td className="px-2 py-1 align-middle [&:has([role=checkbox])]:pr-0">
        <ToggleSwitch
          isToggled={shopItem.isChecked}
          onToggleChange={handleToggleChange}
        />
      </td>
      <td
        className={`px-4 py-1 align-middle [&:has([role=checkbox])]:pr-0 ${
          shopItem.isChecked ? "line-through" : "no-underline"
        }`}
      >
        {shopItem.name}
      </td>
      <td
        className={`px-4 py-1 align-middle [&:has([role=checkbox])]:pr-0 ${
          shopItem.isChecked ? "line-through" : "no-underline"
        }`}
      >
        {shopItem.amount}
      </td>
      <td
        className={`px-4 py-1 align-middle [&:has([role=checkbox])]:pr-0 ${
          shopItem.isChecked ? "line-through" : "no-underline"
        }`}
      >
        {shopItem.notes}
      </td>

      <td className="px-4 py-1 align-middle [&:has([role=checkbox])]:pr-0">
        <div className="flex gap-4">
          <button
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-8 rounded-md px-3"
            type="button"
            onClick={() => onEdit(shopItem)}
          >
            Edit
          </button>
          <button
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-8 rounded-md px-3"
            color="red"
            type="button"
            onClick={() => deleteShopItem(shopItem._id)}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default function ShoppingList() {
  const [shopItems, setShopItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  async function fetchItems() {
    try {
      const response = await fetch("http://localhost:5050/shopItem/");
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const items = await response.json();
      setShopItems(items);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  }

  // Initial load
  useEffect(() => {
    fetchItems();
  }, []);

  const toggleCheck = async (id, isChecked) => {
    await fetch(`http://localhost:5050/shopItem/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isChecked }),
    });

    setShopItems((prevItems) =>
      prevItems.map((item) =>
        item._id === id ? { ...item, isChecked } : item
      )
    );
  };

  async function deleteShopItem(id) {
    await fetch(`http://localhost:5050/shopItem/${id}`, {
      method: "DELETE",
    });
    const newShopItems = shopItems.filter((el) => el._id !== id);
    setShopItems(newShopItems);
  }

  function openAddModal() {
    setEditingItem(null);
    setIsModalOpen(true);
  }

  function openEditModal(item) {
    setEditingItem(item);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingItem(null);
  }

  // Handle saving an item (both add & edit)
  async function handleSaveItem(formData) {
    try {
      let response;
      if (editingItem) {
        response = await fetch(
          `http://localhost:5050/shopItem/${editingItem._id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }
        );
      } else {
        // Add new item
        response = await fetch("http://localhost:5050/shopItem", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, isChecked: false }),
        });
      }

      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }

      // Re-fetch the list after saving
      await fetchItems();
      closeModal();
    } catch (err) {
      console.error("Error saving item:", err);
    }
  }

  const uncheckedItems = shopItems.filter((item) => !item.isChecked);
  const checkedItems = shopItems.filter((item) => item.isChecked);

  return (
    <>
      {/* Top bar with Add button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-slate-800">
          Your Shopping List
        </h1>
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium rounded-md border border-input bg-white hover:bg-slate-100 px-3 py-1.5"
        >
          + Add item
        </button>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden pt-2 bg-white shadow-sm">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b rounded transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Got it?
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Name
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Amount
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Notes
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {uncheckedItems.map((shopItem) => (
                <ShopItemRow
                  key={shopItem._id}
                  shopItem={shopItem}
                  toggleCheck={toggleCheck}
                  deleteShopItem={deleteShopItem}
                  onEdit={openEditModal}
                />
              ))}

              {checkedItems.map((shopItem) => (
                <ShopItemRow
                  key={shopItem._id}
                  shopItem={shopItem}
                  toggleCheck={toggleCheck}
                  deleteShopItem={deleteShopItem}
                  onEdit={openEditModal}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-xl p-6">
            <ShopItemForm
              initialItem={editingItem}
              onSubmit={handleSaveItem}
              onCancel={closeModal}
            />
          </div>
        </div>
      )}
    </>
  );
}