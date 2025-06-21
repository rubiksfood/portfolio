import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ShopItem() {
  const params = useParams();
  const navigate = useNavigate();
  const [shopItem, setShopItem] = useState({
    name: "",
    amount: "",
    notes: "",
    isChecked: false,
  });
  const [isNew, setIsNew] = useState(true);

  useEffect(() => {
      if (params.id) {
      setIsNew(false);
      fetch(`http://localhost:5050/shopItem/${params.id}`)
        .then((res) => res.json())
        .then((data) => setShopItem(data))
        .catch((err) => console.error(err));
    } else {
      setIsNew(true);
      setShopItem({
        name: "",
        amount: "",
        notes: "",
        isChecked: false,
      });
    }
  }, [params.id]);

    // SWAPPED OUT FOR THE ABOVE FUNCTION
    // async function fetchData() {
    // const id = params.id?.toString() || undefined;
    // if (!id) return;
    //   const response = await fetch(`http://localhost:5050/shopItem/${id}`);
    //   if (!response.ok) {
    //     const message = `An error has occurred: ${response.statusText}`;
    //     console.error(message);
    //     return;
    //   }
    //   const item = await response.json();
    //   if (!item) {
    //     console.warn(`Shop item with id ${id} not found`);
    //     navigate("/");
    //     return;
    //   }
    //   setShopItem(item); // Populate the form with the fetched shop item data
    // }
    // fetchData();
    // return;
  // }, [params.id, navigate]);


  // This method will update the state properties (i.e. the specific field changed by the user)
  function handleUpdate(e) {
    const { name, value } = e.target;
    setShopItem((prev) => ({ ...prev, [name]: value }));
    }

  // This function will handle the submission.
  async function handleSubmit(e) {
    e.preventDefault();

    if (!params.id && !isNew) {
      console.error("ID is not provided for updating an existing item.");
      return;
    }

    // This removes the _id property from the shopItem object before sending to server.
    const { _id, ...itemEntry } = shopItem;
    try {
      let response;
      if (isNew) {
        // If adding a new item, POST to /shopItem.
        response = await fetch("http://localhost:5050/shopItem", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(itemEntry),
        });
      } else {
        // If updating an item, PATCH to /shopItem/:id.
        console.log(params.id);
        response = await fetch(`http://localhost:5050/shopItem/${params.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(itemEntry),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // const updatedShopItem = await response.json(); // Fetch the updated item from the response
      // setShopItem(updatedShopItem); // Update the local state with the updated item
      navigate("/");
    } catch (error) {
      console.error('A problem occurred with your fetch operation: ', error);
    }
  }

  // This section will display the form that takes the input from the user.
  return (
    <>
      <h3 className="text-lg font-semibold p-2 py-10 pb-2">Add/Update Item</h3>
      <form
        onSubmit={handleSubmit}
        className="border rounded-lg overflow-hidden px-4 py-3 shadow-md"
      >
        <div className="grid grid-cols-1 gap-x-2 gap-y-1 border-b border-slate-900/10 pb-4 md:grid-cols-2">
          <div>
            <h2 className="text-base font-semibold leading-6 text-slate-900">
              Item Info
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Specify the name, amount, any notes, etc.
            </p>
          </div>

          <div>
            <div>
              <div>
                <div>
                  <input
                    type="checkbox"
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Name
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Flour, Raspberries, Oats, etc."
                    value={shopItem.name}
                    onChange={handleUpdate}
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="amount"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Amount
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="amount"
                    id="amount"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="5, 200g, 2 packs. etc."
                    value={shopItem.amount}
                    onChange={handleUpdate}
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="notes"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Notes
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="notes"
                    id="notes"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="From brand X, or cut finely, etc."
                    value={shopItem.notes}
                    onChange={handleUpdate}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <input
          type="submit"
          value="Save Item"
          className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3 cursor-pointer mt-2"
        />
      </form>
    </>
  );
}