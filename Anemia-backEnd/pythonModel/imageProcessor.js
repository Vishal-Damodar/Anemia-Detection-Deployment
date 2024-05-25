const path = require("path");
const fs = require("fs")
const { spawn } = require("child_process");

async function processImage(imagePath) {
  return new Promise((resolve, reject) => {
      // Path to Python script
      const pythonScript = path.join(__dirname, "main.py");

      // Spawn Python process
      const pythonProcess = spawn("python", [pythonScript, imagePath]);

      let jsonResponse = "";
      pythonProcess.stdout.on("data", (data) => {
          jsonResponse += data.toString();
      });

      // Handle stderr data
      pythonProcess.stderr.on("data", (data) => {
          console.error(`stderr: ${data}`);
      });

      // Handle Python process exit
      pythonProcess.on("close", (code) => {
          console.log(`child process exited with code ${code}`);

          try {
              // Extract JSON part from the output using regex
              const jsonMatch = jsonResponse.match(/{.*}/s);
              if (jsonMatch) {
                  const result = JSON.parse(jsonMatch[0]);
                  console.log("Detections:", result.detections);

                  const outputImagePath = result.output_image_path;
                  fs.readFile(outputImagePath, (err, data) => {
                      if (err) {
                          console.error("Error reading output image:", err);
                          reject("Internal Server Error");
                      } else {
                          // Convert image data to base64 and include it in the JSON response
                          const imageData = data.toString("base64");
                          resolve({
                              detections: result.detections,
                              image: imageData,
                          });
                      }
                  });
              } else {
                  console.error("JSON response not found in Python output");
                  reject("Invalid JSON response");
              }
          } catch (err) {
              console.error("Error parsing JSON response:", err);
              reject("Internal Server Error");
          }
      });
  });
}
module.exports = { processImage };
