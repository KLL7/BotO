export default class Counter {
  static getCounts(arr: string[]): Record<string, number> {
    let counter: Record<string, number> = {};

    arr.forEach((item) => {
      counter[item] = (counter[item] || 0) + 1;
    });

    return counter;
  }
}
