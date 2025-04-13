import cron from "node-cron";
import https from "https";

// Schedule a cron job to run every 14 minutes
const job = cron.schedule("*/14 * * * *", () => {
  const url = process.env.URL; // e.g., "https://your-app-name.onrender.com"
  if (!url) {
    console.error("URL environment variable is not set");
    return;
  }

  https
    .get(url, (res) => {
      if (res.statusCode === 200) {
        console.log("GET request successful");
      } else {
        console.log(`GET request failed with status code: ${res.statusCode}`);
      }
    })
    .on("error", (error) => {
      console.error("Error making GET request:", error.message);
    });
});

// Start the cron job
job.start();

export default job;
