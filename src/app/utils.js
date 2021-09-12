/**
 * Here you can define helper functions to use across your app.
 */

export async function delay(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), time * 1000);
  });
}
