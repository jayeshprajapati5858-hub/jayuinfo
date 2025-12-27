// MOCK DB - NO REAL DATABASE CONNECTION
// This allows the app to run on FreeHosting as a static site.

export const pool = {
  query: async (text: string, params?: any[]) => {
    console.warn("Static Mode: Database query ignored.", text);
    // Return empty result to prevent crashes in components that still use this
    return { rows: [], rowCount: 0 };
  }
};