import { readFile } from "fs/promises";
import NGram from "./NGram";
import Counter from "./Counter";

export default class CosineSimilarity {
  static clearText(text: string) {
    return text
      .trim()
      .toLowerCase()
      .replace(/\s\s+/g, " ")
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()@?]/g, "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  static cosineSimilarity(
    vec1: Record<string, number>,
    vec2: Record<string, number>
  ) {
    const intersection = Object.keys(vec1).filter((key) => key in vec2);

    // Calcula o numerador: produto escalar dos vetores
    const numerator = intersection.reduce(
      (sum, key) => sum + vec1[key] * vec2[key],
      0
    );

    // Soma dos quadrados para vec1
    const sum1 = Object.keys(vec1).reduce(
      (sum, key) => sum + vec1[key] ** 2,
      0
    );

    // Soma dos quadrados para vec2
    const sum2 = Object.keys(vec2).reduce(
      (sum, key) => sum + vec2[key] ** 2,
      0
    );

    // Calcula o denominador: produto das normas dos vetores
    const denominator = Math.sqrt(sum1) * Math.sqrt(sum2);

    // Verifica se o denominador é zero
    if (!denominator) {
      return 0.0;
    }

    // Calcula a similaridade do cosseno
    let coef = numerator / denominator;

    // Corrige para evitar qualquer valor maior que 1 devido a erros numéricos
    if (coef > 1) {
      coef = 1;
    }

    return coef;
  }

  static transformPhraseToVector(
    phrase: string,
    NGramToken: number
  ): Record<string, number> {
    const newPhrase: string = this.clearText(phrase);
    const words: string[] = newPhrase.split(" ");

    let accumulator: string[] = [];

    for (let n = 1; n <= NGramToken; n++) {
      const grams = NGram.getNGrams(words, n);

      grams.forEach((gram) => {
        accumulator.push(gram.join(" "));
      });
    }

    return Counter.getCounts(accumulator);
  }

  static compareTwoPhrases(phrase1: string, phrase2: string, NGramToken = 2) {
    const vec1 = this.transformPhraseToVector(phrase1, NGramToken);
    const vec2 = this.transformPhraseToVector(phrase2, NGramToken);

    return this.cosineSimilarity(vec1, vec2);
  }
}
