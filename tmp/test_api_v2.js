
async function test() {
  try {
    const key = "0e77530835c88c969e365ebe";
    const resp = await fetch(`https://v6.exchangerate-api.com/v6/${key}/latest/USD`);
    const json = await resp.json();
    console.log(JSON.stringify(json, null, 2));
  } catch (e) {
    console.error(e);
  }
}
test();
