import { useEffect, useState } from "react";
import axios from "axios";

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:5000/api/users/all"
      );
      setUsers(res.data.users);
      setError("");
    } catch (err) {
      setError("Failed to load users");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error, refetch: fetchUsers };
};

export default useUsers;