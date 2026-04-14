"use client";

// Centralized API configuration and normalization
const getApiBase = () => {
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
  // Remove trailing slash if present to prevent double slashes in requests
  return base.endsWith("/") ? base.slice(0, -1) : base;
};

export const API_BASE = getApiBase();
