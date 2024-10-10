export default class NGram {
  static getNGrams(splitedText: string[], n: number): Array<string[]> {
    const ngrams: Array<string[]> = [];

    for (let i = 0; i < splitedText.length - n + 1; i++) {
      ngrams.push(splitedText.slice(i, i + n));
    }

    return ngrams;
  }
}
