function App() {
  return (
    <div>
      {/* <WebviewWindow
        src="http://localhost:3000"
        style={{ width: "100%", height: "100%" }}
      /> */}
      Hello World
      {/* {isTauri && ( */}
      <button
        type="button"
        onClick={() => {
          console.log("Hello World");
        }}
      >
        Click me
      </button>
      {/* )} */}
    </div>
  );
}

export default App;
