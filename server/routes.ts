import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  const FASTAPI_BASE_URL = "http://212.193.27.132/fastapi/api/v1";
  const username = "catalog_mvp";
  const password = "tzlQQsKA";
  const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
  
  console.log(`Using credentials: ${username}:${password}`);
  console.log(`Auth header: ${authHeader}`);

  // Proxy all API calls to FastAPI server
  app.all("/api/v1/*", async (req, res) => {
    try {
      const apiPath = req.path.replace("/api/v1", "");
      const url = `${FASTAPI_BASE_URL}${apiPath}`;
      
      const headers: Record<string, string> = {
        "Authorization": authHeader,
        "Content-Type": "application/json",
        "User-Agent": "FurnitureCatalog/1.0"
      };
      
      console.log(`Making request to: ${url} with headers:`, headers);
      
      const response = await fetch(url, {
        method: req.method,
        headers,
        body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
      });

      // Check if response is JSON or HTML
      const contentType = response.headers.get('content-type');
      console.log(`API Response for ${url}: Status ${response.status}, Content-Type: ${contentType}`);
      
      if (contentType?.includes('application/json')) {
        const data = await response.json();
        res.status(response.status).json(data);
      } else {
        const text = await response.text();
        console.log(`Non-JSON response from ${url}:`, text.substring(0, 200));
        res.status(502).json({ 
          error: "External API returned non-JSON response", 
          contentType,
          preview: text.substring(0, 100)
        });
      }
    } catch (error) {
      console.error("API proxy error:", error);
      res.status(500).json({ 
        error: "Failed to fetch from external API", 
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      message: "Frontend server is running",
      externalApi: FASTAPI_BASE_URL,
      hasCredentials: !!(username && password)
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
