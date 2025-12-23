import { useEffect, useState } from "react";

const emptyItem = {
  name: "",
  amount: "",
  notes: "",
  isChecked: false,
};

export default function ShopItemForm({ initialItem, onSubmit, onCancel }) {
  const [shopItem, setShopItem] = useState(emptyItem);

  // When initialItem changes (edit / add new), update the form state
  useEffect(() => {
    if (initialItem) {
      setShopItem({
        name: initialItem.name || "",
        amount: initialItem.amount || "",
        notes: initialItem.notes || "",
        isChecked: initialItem.isChecked ?? false,
      });
    } else {
      setShopItem(emptyItem);
    }
  }, [initialItem]);

  function handleUpdate(e) {
    const { name, value } = e.target;
    setShopItem((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    // Parent component (ShoppingList) will handle API + state updates
    await onSubmit(shopItem);
  }

  return (
    <div role="dialog" aria-modal="true" aria-label="Add Item">
      <h3 className="text-lg font-semibold mb-4">
        {initialItem ? "Edit Item" : "Add Item"}
      </h3>
      <form
        onSubmit={handleSubmit}
        className="border rounded-lg overflow-hidden px-4 py-3 shadow-md bg-white"
      >
        <div className="grid grid-cols-1 gap-x-2 gap-y-1 border-b border-slate-900/10 pb-4 md:grid-cols-2">
          <div>
            <h2 className="text-base font-semibold leading-6 text-slate-900">
              Item Info
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Specify the name, amount, and any notes.
            </p>
          </div>

          <div className="space-y-2">
            <div>
              <label htmlFor="item-name" className="block text-sm font-medium text-slate-700 mb-1">
                Name
              </label>
              <input
                id="item-name"
                type="text"
                name="name"
                value={shopItem.name}
                onChange={handleUpdate}
                required
                className="w-full border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring focus:ring-sky-300"
              />
            </div>

            <div>
              <label htmlFor="item-amount" className="block text-sm font-medium text-slate-700 mb-1">
                Amount
              </label>
              <input
                id="item-amount"
                type="text"
                name="amount"
                value={shopItem.amount}
                onChange={handleUpdate}
                className="w-full border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring focus:ring-sky-300"
              />
            </div>

            <div>
              <label htmlFor="item-notes" className="block text-sm font-medium text-slate-700 mb-1">
                Notes
              </label>
              <textarea
                id="item-notes"
                name="notes"
                value={shopItem.notes}
                onChange={handleUpdate}
                rows={3}
                className="w-full border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring focus:ring-sky-300"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-sm rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-1.5 text-sm rounded-md bg-sky-600 text-white hover:bg-sky-700"
          >
            {initialItem ? "Save changes" : "Add item"}
          </button>
        </div>
      </form>
    </div>
  );
}