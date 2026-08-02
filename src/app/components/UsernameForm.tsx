"use client";

import { FormEvent, useState } from "react";

type UsernameFormProps = {
  onUserSaved: (username: string) => void;
};

export default function UsernameForm({
  onUserSaved,
}: UsernameFormProps) {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanedUsername = username.trim();

    if (cleanedUsername.length < 2 || cleanedUsername.length > 30) {
      setMessage("The username must contain between 2 and 30 characters.");
      return;
    }

    try {
      setIsSaving(true);
      setMessage("");

      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: cleanedUsername,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error ?? "The username could not be saved.");
        return;
      }

      onUserSaved(data.user.username);
      setMessage("Username saved successfully.");
    } catch (error) {
      console.error("Failed to save username:", error);
      setMessage("Could not connect to the server.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section aria-labelledby="username-heading">
      <h2 id="username-heading">Welcome</h2>

      <p>Enter your username to open your task tracker.</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>

        <input
          id="username"
          name="username"
          type="text"
          value={username}
          minLength={2}
          maxLength={30}
          autoComplete="username"
          required
          onChange={(event) => setUsername(event.target.value)}
        />

        <button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Continue"}
        </button>
      </form>

      {message && (
        <p role="status" aria-live="polite">
          {message}
        </p>
      )}
    </section>
  );
}