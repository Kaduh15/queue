import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between p-24 min-h-screen">
      <h1>Hello World</h1>
      <Button>Click me</Button>
      <ModeToggle/>
    </main>
  )
}
