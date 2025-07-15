import type { PageLoad } from "./$types";
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ fetch, params }) => {
  const res = await fetch(`/api/dinosaurs/${params.dinosaur}`);
  const dinosaur = await res.json() as {name:string, description:string};
  
  if (res.status === 404) {
    return error(404, 'No dinosaur found')
  }

  return { dinosaur };
};
