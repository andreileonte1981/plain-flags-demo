import { useState } from "react";
import PixiContent from "./pixi/pixicontent";

function App() {
  const [show, setShow] = useState(false);

  const frameClass = show ? "flex items-center justify-center p-4" : "hidden";

  return (
    <>
      <div
        id="explanation"
        className="p-2 md:p-16 text-center text-gray-600 font-semibold flex flex-col gap-2 items-center"
      >
        <p id="disclamer" className="text-xs text-red-700 py-4">
          Community generated content below. The author of Plain Flags assumes
          no liability for offensive, disturbing or otherwise inappropriate
          content.
        </p>
        {!show && (
          <button
            id="confirmCheckbox"
            className="rounded bg-green-900 hover:bg-green-600 text-white font-semibold p-2 px-4"
            onClick={() => {
              setShow(true);
              PixiContent.init(document);
            }}
          >
            Show image
          </button>
        )}
      </div>

      <div id="canvasFramer" className={frameClass}>
        <div id="canvas" className="w-96 h-96"></div>
      </div>

      <div className="flex flex-col gap-2 p-2 md:p-16 text-center font-semibold text-gray-600">
        <p>
          Control the pixels at{" "}
          <a
            href="https://demoservice.plainflags.dev/"
            className="text-green-600 hover:underline"
          >
            demoservice.plainflags.dev
          </a>
        </p>
        <p>
          Demo users can add, set and clear feature flags to contribute to the
          image.
        </p>
      </div>
    </>
  );
}

export default App;
