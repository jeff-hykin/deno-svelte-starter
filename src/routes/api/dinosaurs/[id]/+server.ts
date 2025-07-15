import { json } from "@sveltejs/kit";
import type { RequestHandler } from './$types';
import data from "../../data.json" with { type: "json" };

export const GET:  RequestHandler = ({ params }) =>{
  const dinosaur = data.find((item) => {
    return item.name.toLowerCase() === params.id.toLowerCase();
  });

  if (dinosaur) {
    return json(dinosaur);
  }

  return json({ error: "Not found" }, { status: 404 });
}
