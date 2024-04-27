import { useState } from "react";

const content = [
  {
    summary: "React is a library for building UIs",
    details:
      "Dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    summary: "State management is like giving state a home",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    summary: "We can think of props as the component API",
    details:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
];

export default function App() {
  return (
    <div>
      <Tabbed content={content} />
    </div>
  );
}

function Tabbed({ content }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div className="tabs">
        <Tab num={0} activeTab={activeTab} onClick={setActiveTab} />
        <Tab num={1} activeTab={activeTab} onClick={setActiveTab} />
        <Tab num={2} activeTab={activeTab} onClick={setActiveTab} />
        <Tab num={3} activeTab={activeTab} onClick={setActiveTab} />
      </div>

      {activeTab <= 2 ? (
        <TabContent
          item={content.at(activeTab)}
          key={content.at(activeTab).summary}
        /> // This is "content.at(activeTap)" <==> modern form of this "content[activeTap]"
      ) : (
        <DifferentContent />
      )}
    </div>
  );
}

function Tab({ num, activeTab, onClick }) {
  return (
    <button
      className={activeTab === num ? "tab active" : "tab"}
      onClick={() => onClick(num)}
    >
      Tab {num + 1}
    </button>
  );
}

function TabContent({ item }) {
  const [showDetails, setShowDetails] = useState(true);
  const [likes, setLikes] = useState(0);

  // This log is to make sure that the component renders only once due to state batching.
  console.log("RENDER");

  function handleInc() {
    setLikes(likes + 1);
  }

  function handleTripleInc() {
    // REMERBER THIS BEFORE BEING CONFUSED IN BELOW CODE
    // Updated state variables are not immediately available after setState call, but only
    // after re-render.
    // setLikes(likes + 1); // 0 + 1
    // setLikes(likes + 1); // Still 0 + 1
    // setLikes(likes + 1); // Still 0 + 1
    //
    //
    //
    // ABOVE PROBLEM CAN BE SOLVED BY DOING THE BELOW THINGS.
    // If we want to update a state based on current state we use  callback function instead of
    // just a value.
    // In the callback function we do actually get access to the latest updated state.
    // So its a good practice to use callback function while updating the state based on the current state.
    setLikes((likes) => likes + 1);
    console.log(likes);
    setLikes((likes) => likes + 1);
    setLikes((likes) => likes + 1);
  }
  function handleUndo() {
    // These two state updates are batched in to one state update for the
    // entire event handler. When batch is done react will trigger one single render and commit.
    setShowDetails(true);
    setLikes(0);

    // State updation is asynchoronous.
    // The below value of likes won't be reset and will print
    // previous value.
    // Updated state variables are not immediately available after setState call, but only
    // after re=render.
    console.log(likes);
  }

  // Doing this to check whether state batching works or not beyond Event Handler Function
  // Before React 18, state batching used to work only in Event handler function.
  // From React 18, state batching works on event handlers, timeouts, promises, native events(As far as I learned) etc.
  function handleUndoLater() {
    setTimeout(handleUndo, 2000);
  }

  return (
    <div className="tab-content">
      <h4>{item.summary}</h4>
      {showDetails && <p>{item.details}</p>}

      <div className="tab-actions">
        <button onClick={() => setShowDetails((h) => !h)}>
          {showDetails ? "Hide" : "Show"} details
        </button>

        <div className="hearts-counter">
          <span>{likes} ❤️</span>
          <button onClick={handleInc}>+</button>
          <button onClick={handleTripleInc}>+++</button>
        </div>
      </div>

      <div className="tab-undo">
        <button onClick={handleUndo}>Undo</button>
        <button onClick={handleUndoLater}>Undo in 2s</button>
      </div>
    </div>
  );
}

function DifferentContent() {
  return (
    <div className="tab-content">
      <h4>I'm a DIFFERENT tab, so I reset state 💣💥</h4>
    </div>
  );
}

// console.log(<DifferentContent key={1} name="Binayak" />);
// console.log(DifferentContent());
