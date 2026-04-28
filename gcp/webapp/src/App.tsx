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
            onClick={async () => {
              setShow(true);
              try {
                await PixiContent.init(document);
              } catch (error) {
                console.error("Failed to initialize graphics:", error);
              }
            }}
          >
            Show image
          </button>
        )}
      </div>

      <div id="canvasFramer" className={frameClass}>
        <div id="canvas" className="w-96 h-96"></div>
      </div>
    </>
  );
}

export default App;
