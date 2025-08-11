import type { Route } from "./+types/home";
import Welcome from "../welcome/pages/welcome";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Tip tap" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <Welcome
      content=""
      onChange={() => { }}
      guestVariables={{}}
      eventVariables={{}}
    />
  );
}
