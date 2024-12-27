"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    TelegramLoginWidgetCallback: (user: TelegramUser) => void;
  }
}

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

const LoginForm = ({ botUsername }: { botUsername: string }) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?21";
    script.async = true;
    script.setAttribute("data-telegram-login", botUsername);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "10"); // Optional: Adjust button radius
    script.setAttribute("data-request-access", "write"); // Optional: Request additional permissions
    script.setAttribute("data-userpic", "true"); // Optional: Show user profile pic
    script.setAttribute("data-onauth", "TelegramLoginWidgetCallback(user)");
    script.onload = async () => {
      window.TelegramLoginWidgetCallback = async (user) => {
        console.log(process.env.BACKEND_URL );
        
        const rawData = await fetch(process.env.BACKEND_URL + "/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        });
        const data = await rawData.json();
        console.log(data);
        if (data.token) {
          localStorage.setItem("session", data.token);
          window.location.href = "/";
        } else {
          alert("Login failed. Please try again.");
        }

        console.log(user);
      };
    };
    const container = document.getElementById("telegram-login-container");
    if (container) {
      container.appendChild(script);
    }

    return () => {
      const container = document.getElementById("telegram-login-container");
      if (container) {
        container.innerHTML = ""; // Cleanup
      }
    };
  }, [botUsername]);

  return <div id="telegram-login-container"></div>;
};

export default LoginForm;
