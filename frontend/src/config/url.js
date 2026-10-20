let backendUrl, frontendUrl;

if (process.env.NODE_ENV === "development") {
  console.log("development env");
  backendUrl = "http://localhost:5001";
  frontendUrl = "http://localhost:3000";
} else {
  console.log("production env");
  backendUrl = "";
  frontendUrl = "https://premium.coverd.io";
}

export { backendUrl, frontendUrl };
