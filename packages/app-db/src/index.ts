import { DexieData, generateQuery, generateWrite } from './DexieData';
import { CredentialInterface, CredentialQuery, CredentialWrite } from './types';

export class CredentialFetcher implements CredentialInterface {
  #query: CredentialQuery;
  #write: CredentialWrite;

  constructor(name: string) {
    const data = new DexieData(name);

    this.#query = generateQuery(data);
    this.#write = generateWrite(data);
  }

  public get query(): CredentialQuery {
    return this.#query;
  }

  public get write(): CredentialWrite {
    return this.#write;
  }
}
