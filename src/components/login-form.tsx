"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LoginForm() {
  const handleLogin = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    localStorage.setItem("session", JSON.stringify({ userId: "123" }));
    window.location.href = "/";
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <Button variant="outline" className="w-full" onClick={handleLogin}>
            Login with Telegram
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
