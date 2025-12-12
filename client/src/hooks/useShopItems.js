import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export function useShopItems() {
  const { token, API_BASE_URL } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  async function fetchItems() {
    try {
      const res = await fetch(`${API_BASE_URL}/shopItem`, {
        headers: authHeaders,
      });
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Error fetching items:", err);
    } finally {
      setLoading(false);
    }
  }

  async function addItem(item) {
    await fetch(`${API_BASE_URL}/shopItem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify(item),
    });
    await fetchItems();
  }

  async function updateItem(id, item) {
    await fetch(`${API_BASE_URL}/shopItem/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify(item),
    });
    await fetchItems();
  }

  async function deleteItem(id) {
    await fetch(`${API_BASE_URL}/shopItem/${id}`, {
      method: "DELETE",
      headers: authHeaders,
    });
    await fetchItems();
  }

  async function toggleCheck(id, isChecked) {
    await updateItem(id, { isChecked });
  }

  useEffect(() => {
    if (token) {
      fetchItems();
    }
  }, [token]);

  return {
    items,
    loading,
    addItem,
    updateItem,
    deleteItem,
    toggleCheck,
    refresh: fetchItems,
  };
}