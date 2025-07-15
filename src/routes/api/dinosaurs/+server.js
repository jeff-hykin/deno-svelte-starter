import { json } from "@sveltejs/kit";
import data from "../data.json" with { type: "json" };

export function GET() {
  return json(data);
}
