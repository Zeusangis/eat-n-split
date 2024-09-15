import { isCursorAtEnd } from "@testing-library/user-event/dist/utils";
import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [currSelect, setCurrSelect] = useState(null);

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handleSelect(friend) {
    setCurrSelect((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <Friends
          friends={friends}
          currSelect={currSelect}
          onSelect={handleSelect}
        />
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={handleShowAddFriend}>
          {!showAddFriend ? <p>Add Friend</p> : <p>Close</p>}
        </Button>
      </div>
      {currSelect && <FormSplitBill currSelect={currSelect} />}
    </div>
  );
}

function Friends({ friends, onSelect, currSelect }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          key={friend.id}
          currSelect={currSelect}
          friend={friend}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelect, currSelect }) {
  const isSelected = currSelect?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}

      {friend.balance === 0 && <p className="">You are even.</p>}

      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owe you ${Math.abs(friend.balance)}
        </p>
      )}
      <Button onClick={() => onSelect(friend)}>
        {!isSelected ? "Select" : "Close"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id: id,
      name: name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👬 Friend Name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
      />
      <label>🌄 Image Url</label>
      <input
        value={image}
        onChange={(e) => setImage(e.target.value)}
        type="text"
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ currSelect }) {
  const [bill, setBill] = useState(0);
  const [selfExpense, setSelfExpense] = useState(0);
  const [friendExpense, setFriendExpense] = useState();
  const [paying, setPaying] = useState("user");
  
  const balance = selfExpense - friendExpense

  function handleBillSubmit(e) {
    e.preventDefault();
    if(selfExpense>friendExpense){
      
    }
  }

  return (
    <form className="form-split-bill" onSubmit={handleBillSubmit}>
      <h2>Split a bill with {currSelect.name}</h2>

      <label>💰 Bill Value</label>
      <input
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
        type="number"
      />

      <label>🧍 Your Expense</label>
      <input
        value={selfExpense}
        onChange={(e) =>
          setSelfExpense(Number(e.target.value) > bill
            ? selfExpense
            : Number(e.target.value))
        }
        type="number"
        disabled={(paying === `${currSelect.id}`)}
      />

      <label>👬 {currSelect.name}'s Expense</label>
      <input
        value={friendExpense}
        onChange={(e)=>setFriendExpense(Number(e.target.value)>bill?friendExpense:Number(e.target.value))}
        type="number"
        disabled={(paying === "user")}
      />

      <label>🤑 Who is paying the bill?</label>
      <select onChange={(e) => setPaying(e.target.value)}>
        <option value="user">You</option>
        <option value={`${currSelect.id}`}>{currSelect.name}</option>
      </select>
      <Button>Add</Button>
    </form>
  );
}
