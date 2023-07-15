import React, { useState, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const API_URL = 'https://623c2a6d2e056d1037fa9e3f.mockapi.io/user/';

const App = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [pincode, setPincode] = useState('');
  const [street, setStreet] = useState('');
  const [state, setState] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [searchPincode, setSearchPincode] = useState('');
  const [searchState, setSearchState] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(25);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchName, searchCity, searchPincode, searchState, searchPhone, searchEmail]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const createUser = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          avatar,
          city,
          country,
          pincode,
          street,
          state,
          phone,
          email,
        }),
      });
      if (response.ok) {
        fetchUsers();
        clearForm();
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const updateUser = async (userId) => {
    try {
      const response = await fetch(`${API_URL}${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          avatar,
          city,
          country,
          pincode,
          street,
          state,
          phone,
          email,
        }),
      });
      if (response.ok) {
        fetchUsers();
        clearForm();
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await fetch(`${API_URL}${userId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const clearForm = () => {
    setName('');
    setAvatar('');
    setCity('');
    setCountry('');
    setPincode('');
    setStreet('');
    setState('');
    setPhone('');
    setEmail('');
  };

  const handleSort = () => {
    const sortedUsers = [...filteredUsers].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.createdAt.localeCompare(b.createdAt);
      } else {
        return b.createdAt.localeCompare(a.createdAt);
      }
    });
    setFilteredUsers(sortedUsers);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const filterUsers = () => {
    const filtered = users.filter((user) => {
      const nameMatch = user.name.toLowerCase().includes(searchName.toLowerCase());
      const cityMatch = user.city.toLowerCase().includes(searchCity.toLowerCase());
      const pincodeMatch = user.pincode.toString().includes(searchPincode);
      const stateMatch = user.state.toLowerCase().includes(searchState.toLowerCase());
      const phoneMatch = user.phone.includes(searchPhone);
      const emailMatch = user.email.toLowerCase().includes(searchEmail.toLowerCase());

      return nameMatch && cityMatch && pincodeMatch && stateMatch && phoneMatch && emailMatch;
    });

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handlePaginationChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const renderUsers = currentItems.map((user) => (
    <tr key={user.id}>
      <td>{user.name}</td>
      <td>{user.avatar}</td>
      <td>{user.city}</td>
      <td>{user.country}</td>
      <td>{user.pincode}</td>
      <td>{user.street}</td>
      <td>{user.state}</td>
      <td>{user.phone}</td>
      <td>{user.email}</td>
      <td>
        <button type="button" onClick={() => updateUser(user.id)}>
          Edit
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this user?')) {
              deleteUser(user.id);
            }
          }}
        >
          
        </button>
      </td>
    </tr>
  ));

  const handleSearch = (e) => {
    e.preventDefault();
    filterUsers();
  };

  return (
    <div>
      <h1>User Management</h1>
      <h2>Add User</h2>
      <form onSubmit={createUser} className='forms'>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Avatar:
          <input type="text" value={avatar} onChange={(e) => setAvatar(e.target.value)} required />
        </label>
        <label>
          City:
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
        </label>
        <label>
          Country:
          <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} required />
        </label>
        <label>
          Pincode:
          <input type="number" value={pincode} onChange={(e) => setPincode(e.target.value)} required />
        </label>
        <label>
          Street:
          <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} required />
        </label>
        <label>
          State:
          <input type="text" value={state} onChange={(e) => setState(e.target.value)} required />
        </label>
        <button type="button" onClick={createUser} className='addbtn'>
          Add
        </button>
      </form>

      <h2>User List</h2>
      <table border={1}>
        <thead>
          <tr>
            <th>Name</th>
            {/* Add table headers for other user fields */}
            <th>City</th>
            <th>Country</th>
            <th>Pincode</th>
            <th>Street</th>
            <th>State</th>
            <th>Phone</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              {/* <td>{user.avatar}</td> */}
              <td>{user.city}</td>
              <td>{user.country}</td>
              <td>{user.pincode}</td>
              <td>{user.street}</td>
              <td>{user.state}</td>
              <td>{user.phone}</td>
              <td>{user.email}</td>
              {/* Add table data for other user fields */}
              <td className='icons'>
                <button type="button" onClick={() => updateUser(user.id)}>
                  < EditIcon />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this user?')) {
                      deleteUser(user.id);
                    }
                  }}
                >
                <DeleteIcon /> 
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;