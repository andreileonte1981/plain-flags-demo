import { useState } from "react";

function App() {
  const [show, setShow] = useState(false);

  return (
    <>
      <div
        id="explanation"
        className="p-2 text-center flex flex-col gap-2 items-center"
      >
        <p>
          The image below has its pixels controlled by the Plain Flags demo
          installation at{" "}
          <a
            href="https://demoservice.plainflags.dev/"
            className="text-green-600 hover:underline"
          >
            demoservice.plainflags.dev
          </a>
        </p>
        <p>
          Any demo user can add, set and clear feature flags to contribute to
          the image.
        </p>
        <p id="disclamer" className="text-xs text-red-700 py-4">
          Community generated content below. The author of Plain Flags assumes
          no liability for offensive, disturbing or otherwise inappropriate
          content.
        </p>
        <div
          id="confirmShow"
          className="flex items-center justify-center gap-2"
        >
          <input
            type="checkbox"
            id="confirmCheckbox"
            onChange={(e) => setShow(e.target.checked)}
          />{" "}
          Show image
        </div>
      </div>

      <div
        id="canvasFramer"
        className={`flex items-center justify-center p-4 ${
          show ? "" : "hidden"
        }`}
      >
        <div id="canvas" className="w-96 h-96"></div>
      </div>
    </>
  );
}

export default App;
