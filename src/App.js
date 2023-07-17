import React, { useState, useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { Button,Select, Form, Input } from 'antd';

const { Option } = Select;

const API_URL = "https://623c2a6d2e056d1037fa9e3f.mockapi.io/user/";

const App = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [pincode, setPincode] = useState("");
  const [street, setStreet] = useState("");
  const [state, setState] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [searchPincode, setSearchPincode] = useState("");
  const [searchState, setSearchState] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(25);
  const [fetchErr,setFetcherr]=useState(null)

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [
    users,
    searchName,
    searchCity,
    searchPincode,
    searchState,
    searchPhone,
    searchEmail,
  ]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(API_URL);
      if(!response.ok) throw Error("Data Not Recevied")
      const data = await response.json();
      setUsers(data);
      setFetcherr(null)
    } catch (err) {
      // console.error("Error fetching users:", error);
      setFetcherr(err.message)
    }
  };

  const createUser = async () => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
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
      console.error("Error creating user:", error);
    }
  };

  const updateUser = async (userId) => {
    try {
      const response = await fetch(`${API_URL}${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
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
      console.error("Error updating user:", error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await fetch(`${API_URL}${userId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const clearForm = () => {
    setName("");
    setCity("");
    setCountry("");
    setPincode("");
    setStreet("");
    setState("");
    setPhone("");     
    setEmail("");
  };

  const handleSort = () => {
    const sortedUsers = [...filteredUsers].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.createdAt.localeCompare(b.createdAt);
      } 
      else {
        return b.createdAt.localeCompare(a.createdAt);
      }
    });
    setFilteredUsers(sortedUsers);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const filterUsers = () => {
      const filtered = users.filter((user) => {
      const nameMatch = user.name.toLowerCase()
      const cityMatch = user.city.toLowerCase()
      const pincodeMatch = user.pincode.toString()
      const stateMatch = user.state.toLowerCase()
      const phoneMatch = user.phone.includes(searchPhone);
      const emailMatch = user.email.toLowerCase()

      return (nameMatch &&cityMatch &&pincodeMatch &&stateMatch &&phoneMatch &&emailMatch);
    });

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handlePaginationChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = Math.floor(Math.random()*(currentPage - itemsPerPage)-itemsPerPage)
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const renderUsers = currentItems.map((user) => (
    <tr key={user.id}>
      <td>{user.name}</td>
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
            if (window.confirm("Are you sure you want to delete this user?")) {
              deleteUser(user.id);
            }
          }}
        ></button>
      </td>
    </tr>
  ));

  const handleSearch = (e) => {
    e.preventDefault();
    filterUsers();
  };


  const onFinish = (values) => {
    console.log('Success:', values);
  };
  
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
        <Option value="91">+91</Option>
        <Option value="102">+102</Option>
        <Option value="103">+103</Option>
        <Option value="112">+112</Option>
      </Select>
    </Form.Item>
  );

  return (
    <div className="container">
      <h1>User Management</h1>
      <h2>Add User</h2>
      <Form
    name="basic"
    labelCol={{ span: 10 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 800 }}
    initialValues={{ remember: true }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
    onSubmit={createUser} 
    className="forms"
  >
    <div className="container">
          <div className="row">
            <div className="col">
            <Form.Item
      label="Name"
      name="name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      rules={[{ required: true, message: 'Please input your name!' }]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      label="City"
      name="city"
      value={city}
      onChange={(e) => setCity(e.target.value)}
      rules={[{ required: true, message: 'Please input your City!' }]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      label="Country"
      name="country"
      value={country}
      onChange={(e) => setCountry(e.target.value)}
      rules={[{ required: true, message: 'Please input your country!' }]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      label="Pincode"
      name="pincode"
      value={pincode}
      onChange={(e) => setPincode(e.target.value)}
      rules={[{ required: true, message: 'Please input your Pincode!' }]}
    >
      <Input />
    </Form.Item>
            </div>
            <div className="col">
            <Form.Item
      label="Street"
      name="street"
      value={street}
      onChange={(e) => setStreet(e.target.value)}
      rules={[{ required: true, message: 'Please input your Street!' }]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      label="State"
      name="state"
      value={state}
      onChange={(e) => setState(e.target.value)}
      rules={[{ required: true, message: 'Please input your State!' }]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      label="Phone Number"
      name="phonenumber"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
      rules={[{ required: true, message: 'Please input your phone number!' }]}
    >
      <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
    </Form.Item>
    <Form.Item
      label="Email"
      name="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      rules={[{
        type: 'email',
        message: 'The input is not valid E-mail!',
      },
      {
        required: true,
        message: 'Please input your E-mail!',
      },]}
    >
      <Input />
    </Form.Item>
            </div>
          </div>
        </div>
    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
      <Button type="primary" htmlType="submit" onClick={createUser} className="addbtn">
        Submit
      </Button>
    </Form.Item>
  </Form>
      {/* <form onSubmit={createUser} className="forms">
        
        <button type="button" >
          Add List
        </button>
      </form> */}

      <h2>User List</h2>
      <table border={1}>
        <thead>
          <tr>
            <th>Name</th>
            <th>City</th>
            <th>Country</th>
            <th>Pincode</th>
            <th>Street</th>
            <th>State</th>
            <th>Phone</th>
            <th>Email</th>
          </tr>
        </thead>
        {fetchErr && <h3>{`Error:${fetchErr}`}</h3>}
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
              <td className="icons">
                <button type="button" onClick={() => updateUser(user.id)}>
                  <FaEdit />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this user?")){
                      deleteUser(user.id);
                    }
                  }}
                >
                  <FaTrashAlt />
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
