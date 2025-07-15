import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  const res = await fetch(`/api/dinosaurs`);
  const dinosaurs = await res.json();

  return { dinosaurs };
};
