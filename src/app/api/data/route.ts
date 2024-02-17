export async function POST(request: Request) {
  const formData = await request.formData();
  const region = formData.get('region');
  const seed = formData.get('seed');
  return Response.json({ region, seed });
}